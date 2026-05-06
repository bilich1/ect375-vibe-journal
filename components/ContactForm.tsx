"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    
    // Simulate API delay
    setTimeout(() => {
      setStatus("success");
    }, 800);
  };

  return (
    <div className="glass-card animate-fade-in delay-200" id="contact-form-section">
      <h2 style={{ marginBottom: "0.5rem" }}>Get in Touch</h2>
      <p>Want to order custom cakes or reserve a table? Drop us a line!</p>
      
      {status === "success" && (
        <div className="status-message status-success">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          Success! Your message has been sent to our bakers.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: status === "success" ? "none" : "block" }}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input type="text" id="name" name="name" className="form-input" required placeholder="Jane Doe" />
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email Address</label>
          <input type="email" id="email" name="email" className="form-input" required placeholder="jane@example.com" />
        </div>
        
        <div className="form-group">
          <label htmlFor="message" className="form-label">Message</label>
          <textarea id="message" name="message" className="form-textarea" required placeholder="I'd like to order a birthday cake..."></textarea>
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={status === "submitting"} style={{ width: "100%" }}>
          {status === "submitting" ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
