// src/pages/HelloPage.jsx
import React, { useEffect, useState } from "react";
import { getHello, createHello, updateHello, deleteHello } from "../utils/helloApi";

const HelloPage = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // GET call
    getHello().then((data) => setMessage(data));
  }, []);

  const handleCreate = async () => {
    const res = await createHello({ msg: "Hello from frontend!" });
    console.log("Created:", res);
  };

  const handleUpdate = async () => {
    const res = await updateHello();
    console.log("Updated:", res);
  };

  const handleDelete = async () => {
    const res = await deleteHello();
    console.log("Deleted:", res);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Backend Response:</h1>
      <p>{message}</p>

      <div className="space-x-2">
        <button onClick={handleCreate} className="btn btn-primary">POST</button>
        <button onClick={handleUpdate} className="btn btn-warning">PATCH</button>
        <button onClick={handleDelete} className="btn btn-error">DELETE</button>
      </div>
    </div>
  );
};

export default HelloPage;
