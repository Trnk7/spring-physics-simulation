class Vec2d{
    constructor(x=0,y=0){
        this.x=x;
        this.y=y;
    }
    
    get mag(){
        return Math.hypot(this.y,this.x); 
    }
    add(v){
        return new Vec2d(this.x + v.x,this.y + v.y);
    }
    sub(v){
        return new Vec2d(this.x - v.x,this.y - v.y);
    }
    mul(a){
        return new Vec2d(this.x * a, this.y * a);
    }
    div(a){
        return this.mul(1/a);
    }
    addI(v){
        this.x+=v.x;
        this.y+=v.y;
    }
    copy(){
        return new Vec2d(this.x,this.y);
    }
    
}