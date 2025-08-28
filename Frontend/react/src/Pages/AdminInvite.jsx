import React, { useState } from "react";
import axios from "axios";
import "./AdminInvitePage.css"; 

const AdminInvitePage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/admin/invite", { email });
      setMessage(response.data.message);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="invite-page">
      <div className="invite-card">
        <h1 className="invite-title">Invite a New Admin</h1>
        {message && <p className="invite-message success">{message}</p>}
        {error && <p className="invite-message error">{error}</p>}
        <form onSubmit={handleInvite}>
          <label className="invite-label">Admin Email</label>
          <input
            type="email"
            className="invite-input"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`invite-button ${loading ? "loading" : ""}`}
          >
            {loading ? "Sending..." : "Send Invitation"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminInvitePage;  
