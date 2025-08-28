import React, { useState } from "react";
import axios from "axios";
import "./AdminSignupPage.css";

const AdminSignupPage = () => {
  const [method, setMethod] = useState(""); // "invite" | "normal"
  const [step, setStep] = useState("code");

  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleVerifyCode = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/verify-invite", { code });
      if (res.data.valid) {
        setEmail(res.data.email);
        setStep("signup");
        setError("");
      } else {
        setError("Invalid or already used invite code.");
      }
    } catch (err) {
      setError("Error verifying code. Please try again.");
    }
  };

  const handleInviteSignup = async () => {
    try {
      const res = await axios.post("http://localhost:5000/auth/signup", {
        name,
        email,
        password,
        code, // backend should accept invite code too
      });
      if (res.status === 201) {
        alert("Signup successful! You can now log in.");
        window.location.href = "/login";
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  const handleNormalSignup = async () => {
    try {
      const res = await axios.post("http://localhost:5000/auth/signup", {
        name,
        email,
        password,
      });
      if (res.status === 201) {
        alert("Signup successful! You can now log in.");
        window.location.href = "/login";
      }
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  return (
    <div className="admin-signup-container">
      <div className="admin-signup-card">
        <h2 className="admin-signup-title">Create Account</h2>

        {!method && (
          <>
            <button
              onClick={() => setMethod("invite")}
              className="btn-primary"
            >
              Sign Up with Code
            </button>
            <button
              onClick={() => setMethod("normal")}
              className="btn-secondary"
            >
              Sign Up Normally
            </button>
          </>
        )}

        {method === "invite" && step === "code" && (
          <>
            <label className="form-label">Invite Code</label>
            <input
              type="text"
              className="form-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              onClick={handleVerifyCode}
              className="btn-primary"
            >
              Verify Code
            </button>
          </>
        )}

        {method === "invite" && step === "signup" && (
          <>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input readonly"
              value={email}
              readOnly
            />

            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleInviteSignup}
              className="btn-success"
            >
              Complete Signup
            </button>
          </>
        )}

        {method === "normal" && (
          <>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleNormalSignup}
              className="btn-success"
            >
              Sign Up
            </button>
          </>
        )}

        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default AdminSignupPage;
