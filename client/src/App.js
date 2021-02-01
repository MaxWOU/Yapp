
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

let socket;
const CONNECTION_PORT = "localhost:3000";
var room_name = "Room";


const cd = new Date(); //current date/time
const timestamp =  cd.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

function App() {
  
  //before login
  const [loggedIn, setLoggedIn] = useState(false); //check whether or not you entered a room or not.
  const [room, setRoom] = useState(""); // a value of the room we're in
  const [userName, setUserName] = useState(""); // value of the user name

  
  //after login
  const [message, setMessage] = useState("") // our default msg.
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {//initialize that kind of connection
    socket = io(CONNECTION_PORT); //initializes the connection
  }, [CONNECTION_PORT]); //pass connection port so it doesn't loop for inf.

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      console.log(data);
    })
  })

  const connectToRoom = () => { //whenever we press the Enter ROom button it fires function
    setLoggedIn(true);
    socket.emit("join_room", room); //referencing join_room from Backend Index.Js
    room_name = room.toString();
  }; //basic syntax of Socket.IO

  var cd = new Date(); //current date/time
  var local_time =  cd.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  

  const sendMessage = async () =>
  {
    let messageMD = {
      room: room,
      content: {
        author: userName,
        message: message,
        time: local_time
      }
    } // message meta data

    socket.emit("send_message", messageMD);

    setMessageList([...messageList, message.content]);
    setMessage("")    
  };
  
  return (
    <div className="App">
      {
        !loggedIn ? //if false
        ( 
          <div className="logIn">
            <div className="ui inverted segment">
              <div className="ui inverted form">
                <div className="two fields">
                  <div className="field">
                    <label>Name</label>
                      <div className="ui left icon input">
                        <input 
                            type="text" 
                            placeholder="Name..." 
                            onChange={(e) => 
                            {
                              setUserName(e.target.value);
                            }} 
                        />
                        <i className="user icon" />
                      </div>
                  </div>

                  <div className="field">
                    <label>Room</label>
                    <div className="ui left icon input" >
                      <input 
                        type="text" 
                        placeholder="Room..." 
                        onChange={(e) => 
                        {
                          setRoom(e.target.value);
                        }} 
                      />
                      <i className="door closed icon"/>                    
                    </div>
                  </div>
                </div>
                <div className="inline field">
                  <div className="ui checkbox">
                    <input type="checkbox" tabindex="0" className="hidden"/>
                    <label>I agree to the terms and conditions</label>
                  </div>
                </div>
                <button className="ui submit button" onClick={connectToRoom} >Enter</button>
              </div>
            </div>
            
          </div>
        ) : (
          <div className="chatContainer">
              <table className="ui inverted table">
                <thead>
                  <tr>
                    <th colSpan="3">{room_name} joined at <span className="ui red text">{timestamp}</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                  <td className="center aligned" colSpan="3">
                    <div className="messages">
                      {
                        messageList.map((key, val) => 
                        {
                          return(
                            <p>
                              {key.author} {key.message} 
                              <p style="text-size: 8px;">{key.time}</p>
                            </p>
                          )
                        })

                      }
                    </div>
                  </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                    <div className="ui input">
                        <textarea type="text" 
                        onChange={(e) => 
                        {
                          setMessage(e.target.value);
                        }}></textarea>
                    </div>
                      </td>
                    <td className="right aligned"><button className="ui inverted green button" onClick={sendMessage}>send</button></td>
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

