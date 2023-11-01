import React, { useState, useEffect } from "react";
import "./style/Words.css";

import Button from "@mui/material/Button";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const API_URL = process.env.REACT_APP_API_URL;

const Words = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [currentWordId, setCurrentWordId] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/words`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the data:", error);
        setLoading(false);
      });
  }, []);

  const openModal = (word, id) => {
    setCurrentWord(word);
    setCurrentWordId(id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentWord("");
    setCurrentWordId(null);
  };

  const handleUpdate = () => {
    // Send the updated word to the API (you need to implement this)
    console.log(`Updating word with ID ${currentWordId} to: ${currentWord}`);
    closeModal();
  };

  if (loading) return <div>Loading...</div>;

  const deleteWords = (wordId) => {
    console.log("delete under way");
    fetch(`${API_URL}/words/${wordId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const updatedData = data.filter((item) => item._id !== wordId);
        setData(updatedData);
      })
      .catch((error) => {
        console.error("There was an error with the delete request:", error);
      });
  };

  const updateWords = () => {
    fetch(`${API_URL}/words/${currentWordId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word: currentWord }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // On successful update, reload the page
        window.location.reload();
      })
      .catch((error) => {
        console.error("There was an error with the update request:", error);
      });
  };

  return (
    <div>
      {isModalOpen && (
        <div className="backdrop">
          <div className="modal">
            <input
              value={currentWord}
              onChange={(e) => setCurrentWord(e.target.value)}
              className="roundedInput"
            />
            <div className="buttonContainer">
              <Button onClick={updateWords} variant="outlined" color="primary">
                Update
              </Button>
              <Button onClick={closeModal} variant="outlined" color="error">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Words</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.word}</td>
              <td>
                <Button
                  onClick={() => openModal(item.word, item._id)}
                  variant="outlined"
                  color="primary"
                >
                  Edit
                </Button>
              </td>
              <td>
                <Button
                  onClick={() => deleteWords(item._id)}
                  variant="contained"
                  color="error"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Words;
