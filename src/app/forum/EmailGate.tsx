"use client";

import { useState } from "react";

export default function EmailGate({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/forum/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.exists) {
          // persist login for this browser until logout
          try {
            localStorage.setItem("nexus_forum_email", email);
          } catch (e) {
            /* ignore storage errors */
          }
          onSuccess();
        } else {
          window.alert("Email not found in dev.db");
        }
      } else {
        window.alert(data?.error || "Server error");
      }
    } catch (err) {
      console.error(err);
      window.alert("Network or server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
      <label style={{ display: "block", marginBottom: 8, color: "white" }}>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="you@example.com"
        style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb" }}
      />

      <div style={{ marginTop: 12 }}>
        <button className="nx-btn nx-btn-primary" type="submit" disabled={loading}>
          {loading ? "Checking..." : "Enter Forum"}
        </button>
      </div>
    </form>
  );
}
