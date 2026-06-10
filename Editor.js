import React, { useState, useEffect } from "react";
import socket from "./socket";
import axios from "axios";

function Editor() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    socket.on("receive-changes", (data) => {
      setText(data);
    });

    return () => {
      socket.off("receive-changes");
    };
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;

    setText(value);

    socket.emit("send-changes", value);
  };

  const saveDocument = async () => {
    try {
      await axios.post("http://localhost:5000/save", {
        title,
        content: text,
      });

      alert("Document Saved Successfully!");
    } catch (err) {
      console.log(err);
      alert("Error Saving Document");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Real-Time Collaborative Document Editor</h1>

      <input
        type="text"
        placeholder="Enter Document Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "300px",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <br />
      <br />

      <button
        onClick={saveDocument}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Save Document
      </button>

      <br />
      <br />

      <textarea
        rows="20"
        cols="100"
        value={text}
        onChange={handleChange}
        placeholder="Start typing here..."
      />
    </div>
  );
}

export default Editor;
