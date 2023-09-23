// Importing the required modules
const WebSocketServer = require('ws');
 
// Creating a new websocket server
const wss = new WebSocketServer.Server({ port: 8080 })
 
// Creating connection using websocket
wss.on("connection", ws => {
    console.log("new client connected");
 
    // sending message to client
    ws.send('{"type":"msg","payload":"Connected!","client":{"id":"e051b208-1b0c-4c26-9ec2-ab00b2b528a2","nick":"Server"}}');
 
    //on message from client
    ws.on("message", data => {
        console.log(`Client has sent us: ${data}`);
        var json = JSON.parse(data);
        if (json.payload){
            ws.send(`{"type":"msg","payload":"You sent '${json.payload}'","client":{"id":"e051b208-1b0c-4c26-9ec2-ab00b2b528a2","nick":"Server"}}`);
        }
    });

    ws.onerror = function () {
        console.log('websocket error')
    }
 
    // handling what to do when clients disconnects from server
    ws.on("close", () => {
        console.log("the client has closed");
    });
    
    // handling client connection error
    ws.onerror = function () {
        console.log("Some Error occurred")
    }
    
   /*
    ws.on("error", () => {
        console.log("ERROR!");
    });
    */

});
console.log("The WebSocket server is running on port 8080");