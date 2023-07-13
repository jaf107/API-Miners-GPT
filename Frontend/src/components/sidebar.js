import React, { useEffect, useState } from "react";
import pdfjsLib from "pdfjs-dist";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf";
import pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.entry";

import {
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
} from "@mui/material";

// Set up the PDF.js worker
GlobalWorkerOptions.workerSrc = pdfjsWorker;

GlobalWorkerOptions.workerSrc = pdfjsWorker;

const Sidebar = ({ pdfText, setPdfText }) => {
  useEffect(() => {
    const savedText = localStorage.getItem("extractedText");
    if (savedText) {
      setPdfText(savedText);
    }
  }, []);

  return (
    <div className="w-[25%] h-[100vh] bg-themeBlack p-4">
      <PDFTextExtractor setPdfText={setPdfText} />
    </div>
  );
};

export default Sidebar;

const PDFTextExtractor = ({ setPdfText }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileData = event.target.result;

      // Load the PDF using PDF.js
      getDocument(fileData).promise.then((pdf) => {
        // Extract text from each page
        const pagePromises = [];
        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
          pagePromises.push(
            pdf.getPage(pageNumber).then((page) => {
              return page.getTextContent().then((textContent) => {
                let pageText = "";
                textContent.items.forEach((item) => {
                  pageText += item.str + " ";
                });
                return pageText;
              });
            })
          );
        }

        Promise.all(pagePromises).then((pagesText) => {
          const newPdfText = pagesText.join("\n");
          setPdfText(newPdfText);
          console.log(newPdfText);
          // Save the extracted text to local storage
          localStorage.setItem("extractedText", newPdfText);
        });
      });
    };

    reader.readAsArrayBuffer(file);
  };

  // Load the extracted text from local storage on component mount
  React.useEffect(() => {
    const savedText = localStorage.getItem("extractedText");
    if (savedText) {
      setPdfText(savedText);
    }
  }, []);

  return (
    <div>
      <h2 className="text-md text-white font-bold mb-[1rem]">Upload PDF</h2>
      <TextField
        type="file"
        onChange={handleFileChange}
        inputProps={{
          accept: ".pdf",
        }}
        className="bg-white rounded-sm overflow-hidden border-2"
      />
    </div>
  );
};
