
class Spring {
    constructor(k = 1, st = new Point(new Vec2d(100, 100), 1, false), ed = new Point(new Vec2d(100, 200), 1), mass = 1) {
        this.k = k;

        this.st = st;
        this.ed = ed;

        let dir = this.ed.pos.sub(this.st.pos);
        this.dir = dir.div(dir.mag);

        this.force = new Vec2d();
        this.len = this.ed.pos.sub(this.st.pos).mag;
        this.restLen = this.len;
        this.endsLen = this.len / 6;

        const reducedMass = (this.st.mass * this.ed.mass) / (this.st.mass + this.ed.mass);
        this.damping = Math.sqrt(k * (reducedMass || mass)) * Math.sqrt(2) ;

    }
    draw(ctx) {
        const rings = 7;
        let spacing = (this.len - this.endsLen * 2) / rings;
        let ct = this.st.pos.copy();

        let w = 10;
        let inc = spacing / 3;

        let perDir = new Vec2d(-this.dir.y, this.dir.x);

        ctx.beginPath();
        ctx.moveTo(ct.x, ct.y);

        ct.addI(this.dir.mul(this.endsLen));
        ctx.lineTo(ct.x, ct.y);

        for (let i = 0; i < rings; i++) {
            ct.addI(perDir.mul(w / 2));
            ct.addI(this.dir.mul(inc));
            ctx.lineTo(ct.x, ct.y);
            ct.addI(perDir.mul(-w));
            ct.addI(this.dir.mul(inc));
            ctx.lineTo(ct.x, ct.y);
            ct.addI(perDir.mul(w / 2));
            ct.addI(this.dir.mul(inc));
            ctx.lineTo(ct.x, ct.y);
        }
        ct.addI(this.dir.mul(this.endsLen));
        ctx.lineTo(ct.x, ct.y);

        ctx.stroke();
    }
    update(dt) {
        let delta = this.ed.pos.sub(this.st.pos);
        this.len = delta.mag;
        if (this.len < 0.0001) {
            return;
        }

        this.dir = delta.div(this.len);

        let x = this.len - this.restLen;
        let springForce = this.dir.mul(-this.k * x);

        // Damping uses velocity along spring axis so both endpoints oscillate naturally.
        let relVel = this.ed.vel.sub(this.st.vel);
        let relAlongSpring = relVel.x * this.dir.x + relVel.y * this.dir.y;
        let dampingForce = this.dir.mul(-this.damping * relAlongSpring);

        this.force = springForce.add(dampingForce);

        this.ed.force.addI(this.force);
        this.st.force.addI(this.force.mul(-1));
    }
    pull(x){
        let d = this.dir.mul(x);
        this.ed.pos.addI(d);
    }
    pullTo(v){
        this.ed.pos = v;
    }
}