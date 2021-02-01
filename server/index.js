const express = require("express")
const app = express()
const cors = require("cors")
const socket = require("socket.io")


app.use(cors());
app.use(express.json()); //this will allow us to communicate between front/backend

const server = app.listen(3000, () => {
    console.log("server runnin on port 3000");
});

const io = socket(server);



io.on('connection', function(socket) {
    console.log(socket.id) //different unique IDs logged
});
    
io.on("join_room", (data) => {
        socket.join(data) // data is the name of the room created.
        console.log( 'User has joined Room: ' + data)
    });

    io.on("send_message", (data) => {
        console.log(data);
        socket.to(data.room).emit("recieve_message", data.content);
    });

    io.on("disconnect", () => {
        console.log('USER DISCONNECTED')
    }); //recoognize and disconnect a user

    //sockets are good to communicate data between
    //users without needing a database to 
    //send/recieve for both parties.
