// Demo.js
import React, { useState } from "react";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

const Demo = () => {
  const [inputText, setInputText] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  const fetchImage = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/canvas`,
        {
          text: inputText,
        },
        {
          responseType: "blob", // This tells axios to expect a Blob as response
        }
      );

      const blob = new Blob([response.data], { type: "image/jpeg" }); // Adjust the type if it's not JPEG
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (error) {
      console.error("Error fetching image", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button onClick={fetchImage}>Fetch Image</button>

      {imageUrl && <img src={imageUrl} alt="Fetched" />}
    </div>
  );
};

export default Demo;
