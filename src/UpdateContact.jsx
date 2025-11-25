import React, { useState } from "react";

export default function UpdateContact() {
  const [searchName, setSearchName] = useState("");
  const [contact, setContact] = useState(null);
  const [responseMsg, setResponseMsg] = useState("");

  // Step 1: Load current contact info
  const handleSearch = async (e) => {
    e.preventDefault();
    setResponseMsg("");
    setContact(null);

    if (!searchName.trim()) {
      setResponseMsg("Contact name is required.");
      return;
    }

    try {
      const encodedName = encodeURIComponent(searchName);

      const res = await fetch(
        `https://cs3870-backend-3kj9.onrender.com/contacts/${encodedName}`
      );
      const data = await res.json().catch(() => null);

      if (res.status === 200) {
        setContact(data);
      } else {
        setResponseMsg(data?.message || "Contact not found.");
      }
    } catch (error) {
      console.log("GET error:", error);
      setResponseMsg("Network error: Could not connect to the server.");
    }
  };

  // Step 2: Save updated contact info
  const handleUpdate = async (e) => {
    e.preventDefault();
    setResponseMsg("");

    try {
      const encodedName = encodeURIComponent(searchName);
      const res = await fetch(`https://cs3870-backend-3kj9.onrender.com/contacts/${encodedName}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone_number: contact.phone_number,
          message: contact.message,
          image_url: contact.image_url,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.status === 200) {
        setResponseMsg("Contact updated successfully!");
      } else {
        setResponseMsg(data?.message || "Failed to update contact.");
      }
    } catch (error) {
      console.log("PUT error:", error);
      setResponseMsg("Network error: Could not connect to the server.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Update Contact</h2>

      {/* Search Form */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter Contact Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <br />
        <br />
        <button type="submit">Load Contact</button>
      </form>

      {responseMsg && (
        <p style={{ marginTop: "15px", color: "blue" }}>{responseMsg}</p>
      )}

      {/* Update Form (only shows after contact is loaded) */}
      {contact && (
        <div style={{ marginTop: "25px" }}>
          <h3>Edit Contact</h3>

          <form onSubmit={handleUpdate}>
            <input
              type="text"
              placeholder="Phone Number"
              value={contact.phone_number}
              onChange={(e) =>
                setContact({ ...contact, phone_number: e.target.value })
              }
            />
            <br />
            <br />

            <input
              type="text"
              placeholder="Message"
              value={contact.message}
              onChange={(e) =>
                setContact({ ...contact, message: e.target.value })
              }
            />
            <br />
            <br />

            <input
              type="text"
              placeholder="Image URL"
              value={contact.image_url}
              onChange={(e) =>
                setContact({ ...contact, image_url: e.target.value })
              }
            />
            <br />
            <br />

            <button type="submit">Save Updates</button>
          </form>
        </div>
      )}
    </div>
  );
}
