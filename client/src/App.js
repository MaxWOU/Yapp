import React, { useState, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";

let socket;
const CONNECTION_PORT = 'localhost:3001/' //the port for linking the backend


function App() {
  const [loggedIn, setLoggedIn] = useState(false) //check whether or not you entered a room or not.
  
  const [room, setRoom] = useState("") // a value of the room we're in
  const [userName, setUserName] = useState("") // value of the user name



  useEffect(() => {//initialize that kind of connection
    socket = io(CONNECTION_PORT) //initializes the connection
  }, [CONNECTION_PORT]) //pass connection port so it doesn't loop for inf.

  const connectToRoom = () => { //whenever we press the Enter ROom button it fires function
    socket.emit("join_room", room) //referencing join_room from Backend Index.Js
  }; //basic syntax of Socket.IO


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
        ):( // else
            <h1>Welcome!</h1>
          )
      }
    </div>
  );
}

export default App;
