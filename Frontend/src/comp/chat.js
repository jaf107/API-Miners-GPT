import React, { useState, useEffect } from "react";
import { Play, Pause,Download } from "react-feather";

function Chat({ role, content, url,link }) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    let typingTimeout;
    let currentIndex = 0;
    const typingDelay = role === "assistant" ? 10 : 0;

    const typeCharacter = () => {
      if (currentIndex < content.length - 1) {
        setDisplayedContent((prevContent) => prevContent + content[currentIndex]);
        currentIndex++;
        typingTimeout = setTimeout(typeCharacter, typingDelay);
      }
    };

    clearTimeout(typingTimeout);

    if (typingDelay === 0) {
      setDisplayedContent(content);
    } else {
      typeCharacter();
    }

    return () => {
      clearTimeout(typingTimeout);
    };
  }, [role, content]);

  const speakContent = () => {
    if (!isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(displayedContent);
      speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    } else {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    const handleSpeechEnd = () => {
      setIsSpeaking(false);
    };

    speechSynthesis.addEventListener("end", handleSpeechEnd);

    return () => {
      speechSynthesis.removeEventListener("end", handleSpeechEnd);
    };
  }, []);

  return (
    <div className={`flex justify-center w-full py-[1rem] border-b-[1px] ${role !== "user" ? "bg-[#F7F7F8]" : ""}`}>
      <div className="flex w-[70%]">
        <img src={role === "user" ? "/user.png" : "/assistant.png"} alt={role} className="w-[30px] h-[30px] rounded-full mr-[20px]" />
        <div className="flex flex-wrap items-center flex-grow">
          <pre
            id="chat-container"
            className="flex-wrap content-[12px] leading-6"
            style={{ overflowWrap: "break-word", whiteSpace: "pre-wrap" }}
            onClick={speakContent}
          >
            {displayedContent}
          </pre>
          {url && <img src={url} className="h-[200px] flex" alt="Image Preview" />}
        </div>
        <button className="ml-2 flex" onClick={speakContent}>
          {isSpeaking ? <Pause size={20} /> : <Play size={20} />}
        </button>
        {link && (
          <a href={link} download>
            <button className="">
              <Download />
            </button>
          </a>
        )}
        
      </div>
    </div>
  );
}

export default Chat;
