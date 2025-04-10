import { Server } from "socket.io";
import http from "http";
import express from "express";


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin : ["http://localhost:5173"],
    }
});

// we will call this function and give userId to this function and it will return socketId for that user. 
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

// used to store online users
const userSocketMap = {};


// everytime a user connects this will print a user connected on the console.
io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // receiving the userId that was sent from frontend useAuthStore.js
    const userId = socket.handshake.query.userId;

    // add the user id in the ScoketMap
    if (userId) userSocketMap[userId] = socket.id

    // io.emit is used to send events to all the connected clients.
    // getOnlineUsers is a variable or name given
    io.emit("getOnlineUsers", Object.keys(userSocketMap));     // Object.keys(userSocketMap), is the data that will be sent along with the event. It's a list (array) of all the keys in the userSocketMap object. 

    // whenever the user disconnects, print this message.
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId];       // delete the user id from the socket map after the user logs out.
        io.emit("getOnlineUsers", Object.keys(userSocketMap));     // Object.keys(userSocketMap), is the data that will be sent along with the event. It's a list (array) of all the keys in the userSocketMap object. 

    })
})


export { io, app, server};