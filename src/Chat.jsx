import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async (event) => {
    event.preventDefault();

    if (message === "") {
      return;
    }

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    const messageData = {
      room,
      author: username,
      message,
      time: `${hours}:${minutes}`,
    };

    await socket.emit("send_message", messageData);
    setMessageList((prevMessageList) => [...prevMessageList, messageData]);
    setMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (message) => {
      setMessageList((prevMessageList) => [...prevMessageList, message]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <form onSubmit={sendMessage}>
        <div className="chat-header">
          <p>Live Chat</p>
        </div>
        <div className="chat-body">
          <ScrollToBottom className="message-container">
            {messageList.map((messageData, index) => {
              return (
                <div
                  key={index}
                  className="message"
                  id={username === messageData.author ? "you" : "other"}
                >
                  <div>
                    <div className="message-content">
                      <p>{messageData.message}</p>
                    </div>
                    <div className="message-meta">
                      <p id="author">
                        {messageData.author === username
                          ? "me"
                          : messageData.author}
                      </p>
                      <p id="time">{messageData.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollToBottom>
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={message}
            placeholder="Type your message..."
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit">&#11014;</button>
        </div>
      </form>
    </div>
  );
}

export default Chat;
