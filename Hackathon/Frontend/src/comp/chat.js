import React, { useEffect, useState } from "react";

function Chat({ role, content }) {
  const [displayedContent, setDisplayedContent] = useState("");

  useEffect(() => {
    let typingTimeout;

    let currentIndex = 0;

    const typingDelay = role === "assistant" ? 10 : 0;

    const typeCharacter = () => {
      if (currentIndex < content.length-1) {
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

  return (
    <div className={`flex justify-center w-full py-[1rem] border-b-[1px] ${role !== "user" ? "bg-[#F7F7F8]" : null}`}>
      <div className="flex w-[70%]">
        <img
          src={role === "user" ? "/user.png" : "/assistant.png"}
          alt={role}
          className="w-[30px] h-[30px] rounded-full mr-[20px]"
        />
        <div className="flex flex-wrap items-center">
          <pre
            id="chat-container"
            className="flex-wrap content-[12px] leading-6"
            style={{ overflowWrap: "break-word", whiteSpace: "pre-wrap" }}
          >
            {displayedContent}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default Chat;
