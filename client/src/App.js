import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

let socket;
const CONNECTION_PORT = "localhost:3000/";
var room_name = "Room";


const cd = new Date(); //current date/time
const timestamp =  cd.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

function App() {
  
  //before login
  const [loggedIn, setLoggedIn] = useState(false) //check whether or not you entered a room or not.
  const [room, setRoom] = useState("") // a value of the room we're in
  const [userName, setUserName] = useState("") // value of the user name

  
  //after login
  const [message, setMessage] = useState("") // our default msg.
  const [messageList, setMessageList] = useState([{author: "max", msg: "hello, world.", time: timestamp}]);

  
  useEffect(() => {//initialize that kind of connection
    socket = io(CONNECTION_PORT) //initializes the connection
  }, [CONNECTION_PORT]) //pass connection port so it doesn't loop for inf.

  useEffect(() => {
  socket.on("recieve_message", (data) =>
  {
    setMessageList([...messageList, data]);
  })});

  const connectToRoom = () => {
    setLoggedIn(true);
    socket.emit("join_room", room);
    room_name = room;
  };

  const sendMessage = async () => {
    let messageMD = {
      room: room,
      content: {
        author: userName,
        msg: message,
        time: timestamp
      }
    }; // message meta data

    await socket.emit("send_message", messageMD);
    setMessageList([...messageList, messageMD.content]);
    setMessage(""); 
  }
  
  return (
    <div className="App">
      {
        !loggedIn ? //if false
        ( 
          <div className="logIn">
            <div class="ui inverted segment">
              <div class="ui inverted form">
                <div class="two fields">
                  <div class="field">
                    <label>Name</label>
                      <div class="ui left icon input">
                        <input 
                            type="text" 
                            placeholder="Name..." 
                            onChange={(e) => 
                            {
                              setUserName(e.target.value);
                            }} 
                        />
                        <i class="user icon" />
                      </div>
                  </div>

                  <div class="field">
                    <label>Room</label>
                    <div class="ui left icon input" >
                      <input 
                        type="text" 
                        placeholder="Room..." 
                        onChange={(e) => 
                        {
                          setRoom(e.target.value);
                        }} 
                      />
                      <i class="door closed icon"/>                    
                    </div>
                  </div>
                </div>
                <div class="inline field">
                  <div class="ui checkbox">
                    <input type="checkbox" tabindex="0" class="hidden"/>
                    <label>I agree to the terms and conditions</label>
                  </div>
                </div>
                <button class="ui submit button" onClick={connectToRoom} >Enter</button>
              </div>
            </div>
            
          </div>
        ) : (
          <div className="chatContainer">
              <table class="ui inverted table">
                <thead>
                  <tr>
                    <th colSpan="3">{room_name} joined at <span class="ui red text">{timestamp}</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                  <td class="center aligned" colSpan="3">
                    <div className="chatMessages">
                      {messageList.map((key, val) => {
                        return(<h2>{key.author} {key.msg} {key.time}</h2>)
                      })}
                    </div>
                  </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                    <div class="ui input">
                        <textarea type="text" 
                        onChange={(e) => 
                        {
                          setMessage(e.target.value);
                        }}></textarea>
                    </div>
                      </td>
                    <td class="right aligned"><button class="ui inverted green button" onClick={sendMessage}>send</button></td>
                  </tr>
                </tbody>
              </table>
          </div>
            )
      }
    </div>
  );
}

export default App;
