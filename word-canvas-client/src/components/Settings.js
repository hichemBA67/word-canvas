import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
const API_URL = process.env.REACT_APP_API_URL;

const Settings = () => {
  const [responseText, setResponseText] = useState("");

  const clearCanvases = async () => {
    try {
      // Assuming the POST request returns a canvas ID in the response
      const response = await axios.delete(`${API_URL}/canvas`);

      setResponseText(response.data);
    } catch (error) {
      console.error("Error fetching image", error);
    }
  };

  return (
    <div className="center-container">
      <table>
        <thead>
          <tr>
            <th>Setting</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <h4>Clear canvases</h4>
            </td>
            <td>
              <small>
                This action will clear all unsused canvases saved on the server,
                that are older than one day. This action is not reversible.
              </small>
            </td>
            <td>
              <Button onClick={clearCanvases} variant="outlined" color="error">
                Clear
              </Button>
            </td>
          </tr>
          <tr>
            <td colSpan="3">
              <small>
                <i>{responseText && <small>{responseText}</small>}</i>
              </small>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Settings;
