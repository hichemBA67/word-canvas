import React, { useState, useEffect } from "react";
const API_URL = process.env.REACT_APP_API_URL;

const Words = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(API_URL);
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
  }, []); // <-- Add empty dependency array

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

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th colSpan={2}>Words</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.word}</td>
              <td>
                <button onClick={() => deleteWords(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Words;
