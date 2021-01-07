const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');
const h = canvas.height;
const w = canvas.width;
let color = "black"

ctx.strokeStyle = "rgb(255,0,0,1)";
ctx.lineWidth = 0.3;
ctx.fillStyle = 1;

for (let i = 10; i < w; i+= 10) {
    //vertical lines
    ctx.beginPath();    
    ctx.moveTo(i, 0);  
    ctx.lineTo(i, h);
    ctx.stroke();
    //horizontal 
    ctx.beginPath();    
    ctx.moveTo(0, i);  
    ctx.lineTo(w, i);
    ctx.stroke();
}

function setColor(c){
    color = c;
}

const ws = new WebSocket("ws://localhost:3000");


// websockets 

ws.addEventListener("open", ()=>{
    console.log("connected!");
})

ws.onmessage = (e) =>{
    handleEvent(e);
};

function handleEvent(e){
    const event = JSON.parse(e.data);

    switch (event.type) {
        case "init":
            initCanvas(event.data);
            break;
        case "add":
            addPoint(event.data);
            break;
        
        default:
            break;
    }

}

function addPoint(data){
    ctx.fillStyle = data.color;
    ctx.fillRect(data.x -10 , data.y -12, 10, 10);
}

function initCanvas(arr){
    arr.forEach(element => {
        ctx.fillStyle = element.color;
        ctx.fillRect(element.x -10 , element.y -12, 10, 10);

    });
    
}

let mouseClicked = false;

canvas.addEventListener("mousedown", ()=>{
    mouseClicked = true;
});

canvas.addEventListener("mouseup", ()=>{
    mouseClicked = false;
});



canvas.addEventListener("mousemove", (e)=>{
    if(!mouseClicked) return;
    const x = (Math.floor(e.pageX / 10) * 10) - canvas.offsetLeft + 10;
    const y = (Math.floor(e.pageY / 10) * 10) - canvas.offsetTop + 10;
    ctx.fillStyle = color;
    ctx.fillRect(x-10,y-12,10,10);

    const ev = {
        type: "add",
        data:{
            x: x,
            y: y,
            color: color
        }
    }

    ws.send(JSON.stringify(ev));
});


