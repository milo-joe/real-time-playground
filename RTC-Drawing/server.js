const WebSocket = require('ws');
const http = require('http');
const server = http.createServer();
const wss = new WebSocket.Server({server});

const canvas = [];

wss.on("connection", ws=>{
    console.log("new client connected");
    // send existing data to the new user
    const data = {
        type: "init",
        data: canvas
    }

    ws.send(JSON.stringify(data));

    //handle user events
    ws.onmessage = (e) =>{
        handleEvent(e);
    };

});




function handleEvent(e){
    const event = JSON.parse(e.data);
    switch (event.type) {
        case "add":
            updateCanvas(event.data);
            break;
    
        default:
            break;
    }

}

function updateCanvas(data){
    let exist = false;
    //check if item already exists in the array
    canvas.forEach(i =>{
        if(i.x === data.x && i.y === data.y){
            i.color = data.color;
            exist = true;
            return;
        }

    });
    
    //add the item otherweise
    if(!exist){
        canvas.push(data);
    }
    //share new data with all users
    updateClients(data);

}

function updateClients(data){
    wss.clients.forEach(client =>{
        const d = {
            type: "add",
            data: data
        }
        client.send(JSON.stringify(d));
    });

}

server.listen(3000, ()=>{
    console.log("listening on port 3000");
})