"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up with email and password
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }

        // Create user profile
        if (data.user) {
          const { error: profileError } = await supabase.from("users").insert({
            id: data.user.id,
            email,
            name,
            role: "analyst",
          });

          if (profileError) {
            setError(profileError.message);
            setLoading(false);
            return;
          }

          setSuccess("Account created successfully! Logging you in...");
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        }
      } else {
        // Sign in with email and password
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
          setLoading(false);
          return;
        }

        setSuccess("Logged in successfully! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }

    setLoading(false);
  };

  return (
    <div style={{
      maxWidth: "400px",
      margin: "0 auto",
      padding: "2rem",
      borderRadius: "8px",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    }}>
      <h2 style={{ marginBottom: "1.5rem", textAlign: "center", color: "#333" }}>
        {isSignUp ? "Create Account" : "Login to Dashboard"}
      </h2>

      {error && (
        <div style={{
          padding: "0.75rem",
          marginBottom: "1rem",
          backgroundColor: "#fee",
          color: "#c00",
          borderRadius: "4px",
          fontSize: "0.9rem",
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          padding: "0.75rem",
          marginBottom: "1rem",
          backgroundColor: "#efe",
          color: "#060",
          borderRadius: "4px",
          fontSize: "0.9rem",
        }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {isSignUp && (
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#333" }}>
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Smith"
              required={isSignUp}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "1rem",
              }}
            />
          </div>
        )}

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#333" }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500", color: "#333" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem",
            }}
          />
          {isSignUp && (
            <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.5rem" }}>
              Minimum 6 characters
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.75rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "1rem",
            fontWeight: "500",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Loading..." : (isSignUp ? "Sign Up" : "Login")}
        </button>
      </form>

      <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
            setSuccess(null);
            setPassword("");
          }}
          style={{
            background: "none",
            border: "none",
            color: "#007bff",
            cursor: "pointer",
            fontSize: "0.9rem",
            textDecoration: "underline",
          }}
        >
          {isSignUp ? "Have an account? Login" : "Don't have an account? Sign Up"}
        </button>
      </div>

      <div style={{
        marginTop: "2rem",
        paddingTop: "1.5rem",
        borderTop: "1px solid #eee",
        fontSize: "0.85rem",
        color: "#666",
        textAlign: "center",
      }}>
        <p style={{ margin: "0 0 0.5rem 0" }}>
          Sign up or login with your email and password.
        </p>
      </div>
    </div>
  );
}
