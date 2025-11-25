import React, { useState } from "react";

export default function ContactDetails() {
  const [searchName, setSearchName] = useState("");
  const [contact, setContact] = useState(null);
  const [responseMsg, setResponseMsg] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setResponseMsg("");
    setContact(null);

    if (!searchName.trim()) {
      setResponseMsg("Contact name is required.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8081/contacts/${searchName}`);

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

  return (
    <div style={{ padding: "20px" }}>
      <h2>Find Contact Details</h2>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter Contact Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <br />
        <br />
        <button type="submit">Search</button>
      </form>

      {responseMsg && (
        <p style={{ marginTop: "15px", color: "blue" }}>{responseMsg}</p>
      )}

      {contact && (
        <div style={{ marginTop: "20px" }}>
          <h3>Contact Information</h3>
          <p>
            <strong>Name:</strong> {contact.contact_name}
          </p>
          <p>
            <strong>Phone:</strong> {contact.phone_number}
          </p>
          <p>
            <strong>Message:</strong> {contact.message}
          </p>

          {contact.image_url && (
            <img
              src={contact.image_url}
              alt="contact"
              style={{ width: "200px", marginTop: "10px" }}
            />
          )}
        </div>
      )}
    </div>
  );
}

