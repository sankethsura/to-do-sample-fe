"use client";
import React, { useEffect, useState } from "react";
import * as process from "process";

const BE_URL = "https://project-todo-simple-123.onrender.com";

async function getRecords() {
  const res = await fetch(`${BE_URL}/all`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default function Home() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (records?.length === 0) {
      console.log("Fetching records");
      getRecords().then(setRecords);
      setLoading(false);
    }
  }, []);

  const createRecord = async () => {
    if (!title.trim()) {
      createAlert("Please enter a title");
      return
    } // Prevent creating empty records
    setLoading(true);
    try {
      const response = await fetch(`${BE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error("Failed to create record");
      }

      const updatedRecords = await getRecords();
      setRecords(updatedRecords);
      setTitle("");
      setLoading(false);
    } catch (error) {
      console.error("Error creating record:", error);
      setLoading(false);
    }
  };

  const deleteRecord = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${BE_URL}/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      const updatedRecords = await getRecords();
      setRecords(updatedRecords);
      setLoading(false);
    } catch (error) {
      console.error("Error deleting record:", error);
      setLoading(false);
    }
  };

  const completeRecord = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${BE_URL}/completed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: id }),
      });

      if (!response.ok) {
        throw new Error("Failed to complete record");
      }

      const updatedRecords = await getRecords();
      setRecords(updatedRecords);
      setLoading(false);
    } catch (error) {
      console.error("Error completing record:", error);
      setLoading(false);
    }
  };

  const createAlert = (msg) =>{
    alert(msg);
  }

  return (
    <main className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-center text-white mb-8">Record Manager</h1>
      <div className="flex mb-6">
        <input
          className="flex-grow px-4 py-2 text-lg border-2 border-gray-300 rounded-l-md focus:outline-none focus:ring-0  text-black focus:border-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              createRecord();
            }
          }}
          placeholder="Enter record title"
        />
        <button
          className="px-6 py-2 text-lg text-white bg-blue-500 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={createRecord}
        >
          Create
        </button>
      </div>
      {loading && <p>Loading...</p>}
      <div className="space-y-4">
        {records.map((record) => (
          <div
            key={record._id}
            className="flex items-center justify-between p-4 bg-white rounded-md shadow"
          >
            <h2
              className={`text-xl ${
                record.completed ? "line-through text-gray-500" : "text-gray-800"
              }`}
            >
              {record.title}
            </h2>
            <div className="space-x-2">
              <button
                className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  record.completed
                    ? "bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500"
                    : "bg-green-500 hover:bg-green-600 focus:ring-green-500"
                }`}
                onClick={() => completeRecord(record._id)}
              >
                {record.completed ? "Uncomplete" : "Complete"}
              </button>
              <button
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                onClick={() => deleteRecord(record._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
