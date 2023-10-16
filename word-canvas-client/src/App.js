import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your endpoint or use this placeholder API
    fetch("http://localhost:5000/api/words")
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

  if (loading) return <div>Loading...</div>;

  const deleteWords = (wordId) => {
    console.log("delete under way");
    // Sending an HTTP request as an example (adjust the URL and logic as needed)
    fetch(`http://localhost:5000/api/words/${wordId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        // Remove the deleted user from the state
        const updatedData = data.filter((data) => data._id !== wordId);
        setData(updatedData);
      })
      .catch((error) => {
        console.error("There was an error with the delete request:", error);
      });
  };

  return (
    <div className="App">
      <h1>Words</h1>
      <table>
        <thead>
          <tr>
            <th>Words</th>
          </tr>
        </thead>
        <tbody>
          {data.map((data) => (
            <tr key={data._id}>
              <td>{data.word}</td>
              <td>
                <button onClick={() => deleteWords(data._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
