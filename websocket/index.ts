import { WebSocketServer } from "ws";
const wss = new WebSocketServer({port: 5050});
wss.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("message", (data) => {
        const buffer = data as Buffer
        console.log(buffer.length);
    });
});