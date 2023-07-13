import React, { useState } from "react";
import NavBar from "./navBar";
import { Dialog } from "@headlessui/react";
import {X} from "react-feather"

function Marketplace() {
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "Book 1",
      author: "Author 1",
      coverImage: "https://www.pdfbooksworld.com/image/cache/catalog/50-250x350.jpg",
      description: "Description of Book 1",
      previewUrl: "https://www.pdfbooksworld.com/bibi/pre.html?book=50.epub",
    },
    {
      id: 2,
      title: "Book 2",
      author: "Author 2",
      coverImage: "/assistant.png",
      description: "Description of Book 2",
      previewUrl: "https://example.com/book2-preview.pdf",
    },
    // Add more books here
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleDownload = (book) => {
    // Implement the logic to download the book
    console.log("Downloading book:", book.title);
    setSelectedBook(null)
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <NavBar />
      <div className="flex justify-center">
        <div className="w-[80%]">
          <div className="container px-4 py-10 mx-auto overflow-x-hidden">
            <h1 className="text-3xl font-bold mb-4 text-center">Book Marketplace</h1>
            <div className="w-1/4 mx-auto h-1 bg-gradient-to-r from-[#5046E5] to-transparent"></div>

            {/* Search bar */}
            <div className="py-5">
              <input
                type="text"
                placeholder="Search books..."
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            {/* Book list */}
            <div className="grid grid-cols-3 gap-4">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className="border border-gray-300 rounded-md p-4 cursor-pointer hover:bg-gray-100 "
                  onClick={() => handleBookClick(book)}
                >
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-48 object-contain mb-4"
                  />
                  <h3 className="text-lg font-bold">{book.title}</h3>
                  <p className="text-gray-600 font-semibold">{book.author}</p>
                </div>
              ))}
            </div>

            {/* Book details */}
            {selectedBook && (
              <Dialog
                open={true}
                onClose={() => setSelectedBook(null)}
                className="fixed inset-0 flex items-center justify-center  z-50 border-green-200 border-2"
                overlayClassName="fixed inset-0 bg-black opacity-60 "
              >
                <div className="bg-white p-4 rounded-lg shadow-lg z-50 ">
                  <div className="flex justify-end">
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setSelectedBook(null)}
                    >
                      
                    <X/>
                    </button>
                  </div>
                  <h2 className="text-xl font-bold">{selectedBook.title}</h2>
                  <p className="text-gray-600">{selectedBook.author}</p>
                  <p>{selectedBook.description}</p>

                  {/* Book preview */}
                  <iframe
                    src={selectedBook.previewUrl}
                    className="w-full h-96 mt-4"
                    title="Book Preview"
                  ></iframe>

                  {/* Download button */}
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-4 rounded"
                    onClick={() => handleDownload(selectedBook)}
                  >
                    Download
                  </button>
                </div>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Marketplace;
