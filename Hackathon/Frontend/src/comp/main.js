import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Modal } from "@material-ui/core";
import { Send, Mic } from "@material-ui/icons";
import Chat from "./chat";

function Main() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      role: "system",
      content: "How can I help you today?",
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let intervalId = null;

    if (isListening) {
      intervalId = setInterval(() => {
        setRecordingDuration((prevDuration) => prevDuration + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isListening]);

  const handleChange = (msg) => {
    setMessage(msg);
  };

  const handleVoiceInput = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setRecordingDuration(0);
        setShowModal(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");

        setMessage(transcript);
      };

      if (!isListening) {
        recognition.start();
      } else {
        recognition.stop();
        setShowModal(false);
        handleSubmit();
      }
    } else {
      console.log("Speech recognition not available");
    }
  };

  const handleSubmit = async () => {
    if (message !== "") {
      setChat((prevChat) => [
        ...prevChat,
        {
          role: "user",
          content: message,
        },
      ]);

      try {
        const filteredChat = chat.filter((entry) => entry.content !== null);

        const response = await axios.post("http://localhost:4000/chat", {
          message: message,
          prevChat: filteredChat,
        });

        const assistantMessage = response.data.data;

        setTimeout(() => {
          setChat((prevChat) => [
            ...prevChat,
            {
              role: "assistant",
              content: assistantMessage,
            },
          ]);
        }, 500); // Adjust the delay time as needed
      } catch (error) {
        console.error("An error occurred:", error);
      }

      setMessage("");
    }
  };

  const handleCloseModal = () => {
    setIsListening(false);
    setShowModal(false);
  };

  return (
    <div className="w-full h-[100vh] max-h-[100vh] flex flex-col items-center justify-center bg-white text-black relative">
      <div className="w-full h-[90%] flex flex-col items-center flex-grow overflow-scroll pt-[2rem]">
        {chat.length !== 0 &&
          chat.map((data, index) => {
            return <Chat role={data.role} content={data.content} />;
          })}
      </div>
      <div className="flex w-[70%] my-[2rem]">
        <TextField
          className="mr-2"
          label="Prompt"
          variant="outlined"
          onChange={(e) => handleChange(e.target.value)}
          value={message}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          endIcon={<Send />}
          onClick={handleSubmit}
        />
        <Button
          variant="contained"
          color={isListening ? "secondary" : "primary"}
          onClick={handleVoiceInput}
        >
          <Mic />
        </Button>
      </div>
      <Modal open={showModal} onClose={handleCloseModal}>
      <div className="w-[300px] h-[200px] bg-white text-black flex flex-col items-center justify-center absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <p>{`Recording duration: ${recordingDuration}s`}</p>
        <Button variant="contained" color="primary" onClick={handleCloseModal}>
          Close
        </Button>
      </div>
    </Modal>
    
    </div>
  );
}

export default Main;