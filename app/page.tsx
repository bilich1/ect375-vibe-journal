"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import LoginForm from "@/components/auth/LoginForm";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showTestMode, setShowTestMode] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setIsLoggedIn(true);
          router.push("/dashboard");
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, supabase.auth]);

  const handleTestMode = () => {
    // Set a test session in localStorage to bypass auth
    localStorage.setItem('test_mode', 'true');
    localStorage.setItem('test_user', JSON.stringify({
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'test@linde.com',
      name: 'Test User',
      role: 'leadership'
    }));
    router.push("/dashboard");
  };

  if (isLoading) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h1 style={{ marginBottom: "1.5rem", fontSize: "2.5rem" }}>LAMT AI Demand Request Dashboard</h1>
          <p style={{ fontSize: "1.25rem", color: "#666", marginBottom: "2rem" }}>
            Loading...
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#007bff", animation: "bounce 1.4s infinite" }}></div>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#007bff", animation: "bounce 1.4s infinite 0.2s" }}></div>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#007bff", animation: "bounce 1.4s infinite 0.4s" }}></div>
          </div>
          <style>{`
            @keyframes bounce {
              0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
              40% { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f5f5", padding: "1rem" }}>
      <div style={{ width: "100%", maxWidth: "500px" }}>
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", color: "#333", margin: "0 0 0.5rem 0" }}>LAMT AI Demand Request Dashboard</h1>
          <p style={{ color: "#666", fontSize: "1.1rem", margin: "0" }}>AI-Powered Demand Request Management</p>
        </div>

        {!showTestMode ? (
          <>
            <LoginForm />
            <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <button
                onClick={() => setShowTestMode(true)}
                style={{
                  background: "none",
                  border: "2px solid #007bff",
                  color: "#007bff",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                }}
              >
                🚀 Try Test Mode (No Auth Required)
              </button>
            </div>
          </>
        ) : (
          <div style={{
            padding: "2rem",
            borderRadius: "8px",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}>
            <h3 style={{ marginBottom: "1rem", color: "#333" }}>Test Mode</h3>
            <p style={{ marginBottom: "1.5rem", color: "#666" }}>
              Skip authentication and go straight to the dashboard with sample data.
            </p>
            <button
              onClick={handleTestMode}
              style={{
                padding: "0.75rem 2rem",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Start Test Mode
            </button>
            <button
              onClick={() => setShowTestMode(false)}
              style={{
                marginTop: "1rem",
                background: "none",
                border: "none",
                color: "#007bff",
                cursor: "pointer",
                fontSize: "0.9rem",
                textDecoration: "underline",
              }}
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
