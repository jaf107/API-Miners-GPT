import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Modal } from "@material-ui/core";
import { Send, Mic } from "@material-ui/icons";
import Chat from "./chat";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MagicIcon from "./MagicIcon";

function Main() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      role: "system",
      content: "How can I help you today?",
      image: null,
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [generateBook,setGenerateBook] = useState(false);
  const [file, setFile] = useState(null);

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

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];

    if (uploadedFile) {
      setFile(uploadedFile);
      setMessage("Image Selected"); // Update the message to "Image Selected"
    }
  };

  const handleSubmit = async () => {
    if (message !== "") {
      let promptMessage = message;
      setChat((prevChat) => [
        ...prevChat,
        {
          role: "user",
          content: message,
          image: null,
        },
      ]);

      if (file) {
        const image = URL.createObjectURL(file);
        setChat((prevChat) => [
          ...prevChat,
          {
            role: "user",
            content: "",
            image: image,
          },
        ]);
        setFile(null); // Clear the file
        try {
          const imageData = new FormData();
          imageData.append("image", file);
          const apiUrl = "https://localhost:7219/api/v1/prompt/image";
          const response = await axios.post(apiUrl, imageData);
          const responseMessage = response.data.responseMessage;
          setTimeout(() => {
            setChat((prevChat) => [
              ...prevChat,
              {
                role: "assistant",
                content: responseMessage,
                image: null,
              },
            ]);
          }, 100);
        } catch (error) {
          console.error("An error occurred:", error);
        }
      } else if (generateBook) {
        try {
          const apiUrl = "https://localhost:7219/api/ebook";
          const response = await axios.post(apiUrl, {
            message: promptMessage,
          });
         
          const responseMessage = response.data.responseMessage;
    
         setGenerateBook(false) // Clear the topic field
          setTimeout(() => {
            setChat((prevChat) => [
              ...prevChat,
              {
                role: "assistant",
                content: responseMessage,
                image: null,
              },
            ]);
          }, 100);
        } catch (error) {
          console.error("An error occurred:", error);
        }
      } else {
        try {
          const apiUrl = "https://localhost:7219/api/v1/prompt/text";
          const response = await axios.post(apiUrl, {
            message: promptMessage,
          });
          const responseMessage = response.data.responseMessage;
          setTimeout(() => {
            setChat((prevChat) => [
              ...prevChat,
              {
                role: "assistant",
                content: responseMessage,
                image: null,
              },
            ]);
          }, 100);
        } catch (error) {
          console.error("An error occurred:", error);
        }
      }
      setMessage(""); // Clear the message field
    }
  };

  const handleCloseModal = () => {
    setIsListening(false);
    setShowModal(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

 

  const createBook = () => {
    handleSubmit();
  };

  return (
    <div className="w-full h-[100vh] max-h-[100vh] pt-10 flex flex-col items-center justify-center bg-white text-black ">
      <div className="w-full h-[90%] flex flex-col items-center flex-grow overflow-scroll pt-[2rem]">
        {chat.length !== 0 &&
          chat.map((data, index) => {
            return (
              <Chat
                key={index}
                role={data.role}
                content={data.content}
                url={data.image}
              />
            );
          })}
      </div>

      <div className="flex w-[70%] my-[2rem]">
        <div className="mr-3">
          <label htmlFor="upload-input">
            <Button
              variant="contained"
              component="span"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center text-sm"
              size="small"
            >
              <AttachFileIcon className="m-3" />
            </Button>
          </label>
          <input
            id="upload-input"
            type="file"
            accept="image/jpeg, image/png, text/plain"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
        <div className="mr-3 w-full min-w-300px">
          <TextField
            className="mr-2 text-sm"
            label="Prompt"
            variant="outlined"
            onChange={(e) => handleChange(e.target.value)}
            value={message}
            onKeyDown={handleKeyDown}
            fullWidth
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          endIcon={<Send />}
          onClick={handleSubmit}
          size="small"
        />
        <span className="mx-2"></span>
        <Button
          variant="contained"
          color={isListening ? "secondary" : "primary"}
          onClick={handleVoiceInput}
          size="small"
        >
          <Mic />
        </Button>
        <span className="mx-2"></span>
        <Button
          variant="contained"
          color="primary"
          onClick={createBook}
          size="small"
        >
          <MagicIcon />
        </Button>
      </div>

      <Modal open={showModal} onClose={handleCloseModal}>
        <div className="w-[300px] h-[200px] bg-white text-black flex flex-col items-center justify-center absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p>{`Recording duration: ${recordingDuration}s`}</p>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </div>
      </Modal>

      
    </div>
  );
}

export default Main;
