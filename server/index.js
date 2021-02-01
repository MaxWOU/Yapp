const express = require("express")
const app = express()
const cors = require("cors")
const socket = require("socket.io")


app.use(cors());
app.use(express.json()); //this will allow us to communicate between front/backend

const server = app.listen("3000", () => {
    console.log("server runnin on port 3000");
});

io = socket(server);

io.on("connection", (socket)=> {
    console.log(socket.id) //different unique IDs logged

    socket.on("join_room", (data) => {
        socket.join(data) // data is the name of the room created.
        console.log( 'User has joined Room: ' + data)
    })

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("recieve_message", data.content);

    })

    socket.on("disconnect", () => {
        console.log('USER DISCONNECTED')
    }) //recoognize and disconnect a user

    //sockets are good to communicate data between
    //users without needing a database to 
    //send/recieve for both parties.
});