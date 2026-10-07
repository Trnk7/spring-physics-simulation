const cnv = document.getElementById("canvas");
const ctx = cnv.getContext("2d");

const gravityYInput = document.getElementById("gravityY");
const stiffnessInput = document.getElementById("stiffness");
const dampingScaleInput = document.getElementById("dampingScale");
const gravityYVal = document.getElementById("gravityYVal");
const stiffnessVal = document.getElementById("stiffnessVal");
const dampingScaleVal = document.getElementById("dampingScaleVal");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

function resize(){
    let rect = cnv.getBoundingClientRect();
    cnv.width = rect.width;
    cnv.height = rect.height;
}
resize();
let springs = [];
let points = [];
let paused = false;
let gravityY = Number(gravityYInput.value);

function clearPointDynamics(p) {
    p.vel = new Vec2d();
    p.force = new Vec2d();
}

function syncSpringVisuals() {
    springs.forEach(s => {
        const delta = s.ed.pos.sub(s.st.pos);
        s.len = delta.mag;
        if (s.len >= 0.0001) {
            s.dir = delta.div(s.len);
        }
    });
}

function refreshValueLabels() {
    gravityYVal.textContent = String(gravityY);
    stiffnessVal.textContent = stiffnessInput.value;
    dampingScaleVal.textContent = Number(dampingScaleInput.value).toFixed(1);
}

function makeSpringGrid(){
    let space = 80;
    let rows = 5;
    let cols = Math.floor((cnv.width-200)/space);
    springs = [];
    points = [];
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            let p = new Point(new Vec2d(100+j*space,100+i*space),1);
            if(i==0){
                p.pivot = true;
            }
            points.push(p);
        }
    }
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            let p = points[i*cols+j];
            if(j<cols-1){
                let right = points[i*cols+j+1];
                springs.push(new Spring(Number(stiffnessInput.value),p,right,1));
            }
            if(i<rows-1){
                let down = points[(i+1)*cols+j];
                springs.push(new Spring(Number(stiffnessInput.value),p,down,1));
            }
        }
    }

    const dampingScale = Number(dampingScaleInput.value);
    springs.forEach(s => {
        s.damping *= dampingScale;
    });
}

function rebuildSpringProperties(){
    const k = Number(stiffnessInput.value);
    const dampingScale = Number(dampingScaleInput.value);
    springs.forEach(s => {
        s.k = k;
        const reducedMass = (s.st.mass * s.ed.mass) / (s.st.mass + s.ed.mass);
        const baseDamping = Math.sqrt(k * (reducedMass || 1)) * Math.sqrt(2);
        s.damping = baseDamping * dampingScale;
    });
}

makeSpringGrid();
refreshValueLabels();

gravityYInput.addEventListener("input", () => {
    gravityY = Number(gravityYInput.value);
    refreshValueLabels();
});

stiffnessInput.addEventListener("input", () => {
    refreshValueLabels();
    rebuildSpringProperties();
});

dampingScaleInput.addEventListener("input", () => {
    refreshValueLabels();
    rebuildSpringProperties();
});

pauseBtn.addEventListener("click", () => {
    paused = !paused;
    pauseBtn.textContent = paused ? "Resume" : "Pause";
    if (paused) {
        points.forEach(clearPointDynamics);
    }
});

resetBtn.addEventListener("click", () => {
    makeSpringGrid();
    rebuildSpringProperties();
});

let activePoint = null;
let mouse = new Vec2d();
let mActive=false;
cnv.addEventListener("mousedown",(e)=>{
    let m = new Vec2d(e.offsetX,e.offsetY);
    for (let p of points) {
        if(p.pivot) continue;
        let d = p.pos.sub(m).mag;
        if(d<20){
            mActive = true;
            activePoint = p;
            break;
        }
    }
})

cnv.addEventListener("mousemove",(e)=>{
    if(!mActive) return;

    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
    if(activePoint){
        activePoint.pos = mouse.copy();
        clearPointDynamics(activePoint);
    }  
})
cnv.addEventListener("mouseup",()=>{
    mActive=false;
    activePoint = null;
})
cnv.addEventListener("mouseleave",()=>{
    mActive=false;
    activePoint = null;
})

let t = Date.now();
function anim(){
    let dt = Date.now()-t;

    ctx.clearRect(0,0,cnv.width,cnv.height);

    if (paused) {
        syncSpringVisuals();
        springs.forEach(s => s.draw(ctx));
        t = Date.now();
        requestAnimationFrame(anim);
        return;
    }

    const gravity = new Vec2d(0, gravityY);

    points.forEach(p => {
        p.force.addI(gravity.mul(p.mass));
    });

    springs.forEach(s=>{
        s.update(dt/1000);
        s.draw(ctx);
    })
    points.forEach(p => {
    p.update(dt/1000);
    });
    t = Date.now();
    requestAnimationFrame(anim);
}
anim();