class Point {
    constructor(pos = new Vec2d(), mass = 1,pivot = false) {
        this.pos = pos;
        this.mass = mass;
        this.pivot = pivot;

        this.vel = new Vec2d();
        this.force = new Vec2d();
    }
    update(dt){
        if(this.pivot) {
            this.vel = new Vec2d();
            this.force = new Vec2d();
            return;
        }
        let a = this.force.div(this.mass);
        this.vel.addI(a.mul(dt));
        this.pos.addI(this.vel.mul(dt));
        this.force = new Vec2d();
    }
}