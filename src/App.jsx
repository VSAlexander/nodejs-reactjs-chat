import React, { useState } from "react";
import "./App.css";

import io from "socket.io-client";
import Chat from "./Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = (event) => {
    event.preventDefault();
    if (username === "" && room === "") {
      return;
    }
    socket.emit("join_room", room);
    setShowChat(true);
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <form onSubmit={joinRoom}>
            <h3>Join a chat</h3>
            <input
              type="text"
              placeholder="Room name"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="Room id"
              onChange={(e) => {
                setRoom(e.target.value);
              }}
            />
            <button type="submit">Join</button>
          </form>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
