// Demo.js
import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import "./style/Demo.css";
const API_URL = process.env.REACT_APP_API_URL;

const Demo = () => {
  const [inputText, setInputText] = useState("");
  const [canvasId, setCanvasId] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [backgroundUrl, setBackgroundUrl] = useState(null);
  const [responeText, setResponseText] = useState(null);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const generateCanvas = async () => {
    try {
      // Assuming the POST request returns a canvas ID in the response
      const response = await axios.post(`${API_URL}/canvas`, {
        words: inputText,
      });

      // The response is expected to be a string that represents the canvas ID
      const canvasId = response.data.canvasId; // Assuming the response contains the ID directly
      setCanvasId(canvasId); // Save the canvas ID if you need to use it elsewhere

      if (canvasId !== "") {
        const imageUrl = `${API_URL}/canvas/${canvasId}`;
        setImageUrl(imageUrl); // Set the image URL so your component can display the image

        const backgroundUrl = `${API_URL}/canvas/background/${canvasId}`;
        setBackgroundUrl(backgroundUrl); // Set the image URL so your component can display the image
      } else {
        const imageUrl = `${API_URL}/canvas/background/${canvasId}`;

        setImageUrl(imageUrl); // Set the image URL so your component can display the image
        console.log(imageUrl);
      }
    } catch (error) {
      console.error("Error fetching image", error);
    }
  };

  const acceptCanvas = async () => {
    try {
      // Assuming the POST request returns a canvas ID in the response
      const response = await axios.put(`${API_URL}/canvas/accept/${canvasId}`);
      setResponseText(response.data);
    } catch (error) {
      console.error("Error fetching image", error);
    }
  };

  return (
    <div>
      <div className="center-container">
        <div className="card">
          <h1>Demo</h1>
          <div className="inputFields">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              className="input-text"
              placeholder="Enter you words, separated by a comma"
            />
            <Button
              onClick={generateCanvas}
              variant="outlined"
              color="primary"
              style={{ marginRight: "10px" }}
            >
              Generate Canvas
            </Button>
            {imageUrl && (
              <Button onClick={acceptCanvas} variant="outlined" color="success">
                Accept Canvas
              </Button>
            )}
          </div>
          <div>
            {canvasId && (
              <div>
                <h5>Canvas ID: </h5>
                <small>
                  <i>{canvasId}</i>
                </small>
              </div>
            )}
            {responeText && <h4 style={{ color: "green" }}>{responeText}</h4>}
          </div>
        </div>
      </div>
      {canvasId && (
        <div className="center-container">
          <div className="card">
            {imageUrl && (
              <img src={imageUrl} alt="Canvas" className="canvas-image" />
            )}
          </div>

          <div className="card">
            {imageUrl && (
              <img src={backgroundUrl} alt="Canvas" className="canvas-image" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Demo;
