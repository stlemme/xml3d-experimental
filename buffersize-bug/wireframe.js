function shade(env) {
	var bc = env.barycentric;
	var eps = 0.02;

	if (this.fwidth) {
		var d = this.fwidth(bc);
		var a = Math.smoothstep(new Vec3(0.0), d.mul(0.8), bc);
		var s = Math.min(Math.min(a.x(), a.y()), a.z());
		var color = Math.mix(env.lineColor || env.color.mul(0.2), env.color.mul(0.8), s);
	} else {
		if (bc.x() < eps || bc.y() < eps || bc.z() < eps) {
		var color = env.color.mul(0.2);
		} else {
			var color =  env.color.mul(0.8);
		}
	}
	return Shade.diffuse(color, env.normal);
}
