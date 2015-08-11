
var Xflow = Xflow || {};
var XML3D = XML3D || {};
	
(function() {

var vec3 = XML3D.math.vec3;


function Particle(x, y, z, mass) {
	this.position = vec3.fromValues(x, y, z); // position
	this.previous = vec3.fromValues(x, y, z); // previous
	this.normal = vec3.create();
	this.a = vec3.fromValues(0, 0, 0); // acceleration
	this.mass = mass;
	this.invMass = 1 / mass;
	this.tmp = vec3.create();
	// this.tmp2 = vec3.create();
}

// Force -> Acceleration
Particle.prototype.addForce = function(force) {
	vec3.scaleAndAdd(this.a, this.a, force, this.invMass);
};

// Performs verlet integration
Particle.prototype.integrate = function(timesq, drag) {
	vec3.sub(this.tmp, this.position, this.previous);
	
	vec3.scaleAndAdd(this.tmp, this.position, this.tmp, drag);
	var newPos = vec3.scaleAndAdd(vec3.create(), this.tmp, this.a, timesq);

	this.previous = this.position;
	this.position = newPos;

	vec3.set(this.a, 0, 0, 0);
}


function Cloth(position, index, mass) {

	var vertices = position.length / 3;
	var indices = index.length;

	var particles = new Array(vertices);
	var constrains = new Array();

	// initialize particles
	for (var i = 0; i < vertices; i++)
		particles[i] = new Particle(position[3*i], position[3*i+1], position[3*i+2], mass);

	// structural constrains
	for (var i = 0; i < indices;) {
				
		var p0 = particles[index[i++]];
		var p1 = particles[index[i++]];
		var p2 = particles[index[i++]];
		
		// p0<->p1
		// p1<->p2
		// p0<->p2 (implicitly)
		
		if (!this.hasConstrain(constrains, p0, p1)) {
			var dist = vec3.len(vec3.sub(vec3.create(), p0.position, p1.position));
			constrains.push([p0, p1, dist]);
		}

		if (!this.hasConstrain(constrains, p1, p2)) {
			var dist = vec3.len(vec3.sub(vec3.create(), p1.position, p2.position));
			constrains.push([p1, p2, dist]);
		}
	}
	
	this.particles = particles;
	this.constrains = constrains;
	
	this.position = position;
	this.index = index;
	this.mass = mass;

	this.updateNormals();
}


Cloth.prototype.hasConstrain = function(constrains, pa, pb) {
	for (var j = 0; j < constrains.length; j++) {
		var c = constrains[j];
		if (c[0] === pa && c[1] === pb)
			return true;
		
		if (c[0] === pb && c[1] === pa)
			return true;
	}
	return false;
}

Cloth.prototype.valid = function (position, index, mass) {
	var vertices = position.length / 3;
	if (this.particles.length != vertices) return false;
	if (this.index.length != index.length) return false;
	if (this.mass != mass) return false;
	return true;
}


var diff = vec3.create();

Cloth.prototype.satisifyConstrains = function (p1, p2, distance) {
	vec3.sub(diff, p2.position, p1.position);
	var currentDist = vec3.length(diff);
	if (currentDist == 0) return;
	vec3.scale(diff, diff, 1 - distance / currentDist);
	vec3.scale(diff, diff, 0.5);
	vec3.add(p1.position, p1.position, diff);
	vec3.sub(p2.position, p2.position, diff);
}


var tmpforce = vec3.create();
var GRAVITY = vec3.fromValues(0, -981, 0);

Cloth.prototype.simulate = function (time, options) {
	
	options = options || {};
	var windforce = options.windforce || vec3.create();
	var pins = options.pins || [];
	var damping = options.damping || 0.0;
	var drag = 1 - damping;
	
	var i, il, particle, constrain;

	// Aerodynamics forces
	for (i = 0, il = this.particles.length; i < il; i++) {
		particle = this.particles[i];
		// TODO: test to use face normals
		var normal = particle.normal;
		vec3.scale(tmpforce, normal, vec3.dot(normal, windforce));
		particle.addForce(tmpforce);
	}
	
	for (i = 0, il = this.particles.length; i < il; i++) {
		particle = this.particles[i];
		vec3.scale(tmpforce, GRAVITY, particle.mass);
		particle.addForce(tmpforce);

		// TODO: use time of params instead of fixed steps
		particle.integrate(TIMESTEP_SQ, drag);
	}

	// Start Constrains

	for (i = 0, il = this.constrains.length; i < il; i++) {
		constrain = this.constrains[i];
		this.satisifyConstrains(constrain[0], constrain[1], constrain[2]);
	}

	// Floor Constains
	// for (particles = cloth.particles, i = 0, il = particles.length
			// ; i < il; i ++) {
		// particle = particles[i];
		// pos = particle.position;
		// if (pos.y < -250) {
			// pos.y = -250;
		// }
	// }
	
	// Pin Constrains
	for (i = 0, il = pins.length; i < il; i++) {
		var xy = pins[i];
		var p = this.particles[xy];
		if (p == null) continue;
		var idx = 3*xy;
		vec3.set(p.position, this.position[idx], this.position[idx+1], this.position[idx+2]);
	}

	this.updateNormals();
}

Cloth.prototype.updateNormals = function() {
	var U = vec3.create(), V = vec3.create(), S = vec3.create();

	for (i = 0, il = this.particles.length; i < il; i++)
		vec3.set(this.particles[i].normal, 0, 0, 0);

	for (i = 0, il = this.index.length; i < il; i += 3) {
		var A = this.particles[this.index[i  ]];
		var B = this.particles[this.index[i+1]];
		var C = this.particles[this.index[i+2]];
		
		vec3.sub(U, B.position, A.position);
		vec3.sub(V, C.position, A.position);
		
		vec3.cross(S, V, U);
		vec3.normalize(S, S);
		
		vec3.add(A.normal, A.normal, S);
		vec3.add(B.normal, B.normal, S);
		vec3.add(C.normal, C.normal, S);
	}
	
	for (i = 0, il = this.particles.length; i < il; i++)
		vec3.normalize(this.particles[i].normal, this.particles[i].normal);
}


var TIMESTEP = 18 / 1000;
var TIMESTEP_SQ = TIMESTEP * TIMESTEP;


Xflow.registerOperator("xflow.cloth", {
    outputs: [	{type: 'float3', name: 'position', customAlloc: true},
				{type: 'float3', name: 'normal', customAlloc: true}
	],
    params:  [	{type: 'float3', source: 'position', array: true},
				{type: 'int', source: 'index', array: true},
				{type: 'float3', source: 'windforce', array: true},
				{type: 'int', source: 'pins', array: true},
				{type: 'float', source: 'mass', array: true},
				{type: 'float', source: 'damping', array: true},
				{type: 'float', source: 'time', array: true}
	],
    alloc: function(sizes, position, index, windforce, pins, mass, damping, time)
    {
		var vertices = position.length / 3;
        sizes['position'] = vertices;
        sizes['normal'] = vertices;
    },
    evaluate: function(out_position, out_normal, position, index, windforce, pins, mass, damping, time, info) {

		var time = time[0];
		
		var cloth = info.customData.cloth;
		var mass = mass[0];
		
		if (!cloth || !cloth.valid(position, index, mass)) {
			cloth = new Cloth(position, index, mass);
			info.customData.cloth = cloth;
			info.customData.lastTime = time;
		}

		var options = {
			windforce: windforce,
			pins: pins,
			damping: damping[0]
		};
		
		cloth.simulate(time - info.customData.lastTime, options);
		info.customData.lastTime = time;
		
		var numParticles = cloth.particles.length;
		
		for (var i = 0; i < numParticles; i++) {
			var p = cloth.particles[i].position;
			out_position[3*i  ] = p[0];
			out_position[3*i+1] = p[1];
			out_position[3*i+2] = p[2];

			var n = cloth.particles[i].normal;
			out_normal[3*i  ] = n[0];
			out_normal[3*i+1] = n[1];
			out_normal[3*i+2] = n[2];
		}
		
		// console.log(out_normal);
	}
});


})();
