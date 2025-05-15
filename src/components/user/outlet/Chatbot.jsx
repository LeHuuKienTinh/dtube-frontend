import React, { useState, useEffect } from "react";
import "./Chatbot.scss";
import aiIcon from "../../../assets/aiicon.png";
import axiosInstance from "../../../service/axiosInstance";

const Chatbot = () => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = sessionStorage.getItem("chatbotMessages");
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  const [message, setMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("chatbotMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessages = [...messages, { text: message, sender: "user" }];
    setMessages(newMessages);
    setMessage("");
    setIsThinking(true);

    try {
      const res = await axiosInstance.post("/api/chat", { message });

      let botReply = res.data.response || "Bot không phản hồi.";
      botReply = botReply.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

      setMessages([...newMessages, { text: botReply, sender: "bot" }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { text: "❌ Lỗi khi kết nối đến server.", sender: "bot" },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    sessionStorage.removeItem("chatbotMessages");
  };

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <h2>🎬 Chatbot Phim</h2>
        {messages.length > 0 && (
          <button onClick={clearChat} className="clear-btn">
            Xóa lịch sử
          </button>
        )}
      </div>

      <div className="chat-list">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            <div className="message-wrapper">
              <img
                className="avatar"
                src={
                  msg.sender === "user"
                    ? "https://www.pngmart.com/files/21/Account-Avatar-Profile-PNG-Clipart.png"
                    : aiIcon
                }
                alt="avatar"
              />
              <div
                className="bubble"
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="message bot">
            <div className="message-wrapper">
              <img className="avatar" src={aiIcon} alt="AI" />  
              <div className="bubble">⏳ Đang suy nghĩ...</div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập câu hỏi về phim..."
        />
        <div className="icons">
          <button type="submit">📨</button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
