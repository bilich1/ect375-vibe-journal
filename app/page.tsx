"use client";

import ContactForm from "@/components/ContactForm";

export default function Home() {
  const scrollToContact = () => {
    document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="section" style={{ minHeight: "80vh", display: "flex", alignItems: "center" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <div className="animate-fade-in">
            <h1 style={{ marginBottom: "1.5rem" }}>Baking the World a Better Place</h1>
            <p style={{ fontSize: "1.25rem", maxWidth: "600px", margin: "0 auto 2.5rem" }}>
              Experience the magic of artisanal pastries and breads, baked fresh every morning with love, passion, and immaculate vibes.
            </p>
            <button id="get-started-btn" onClick={scrollToContact} className="btn btn-primary" style={{ padding: "1rem 2.5rem", fontSize: "1.1rem" }}>
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Features / Highlights */}
      <section className="section">
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
          <div className="glass-card animate-fade-in delay-100">
            <h3>Artisan Breads</h3>
            <p>Our sourdough starter has been passed down for generations. Crunchy on the outside, soft and fluffy inside.</p>
          </div>
          <div className="glass-card animate-fade-in delay-200">
            <h3>Sweet Pastries</h3>
            <p>From buttery croissants to decadent eclairs, we have everything to satisfy your sweet cravings.</p>
          </div>
          <div className="glass-card animate-fade-in delay-300">
            <h3>Custom Cakes</h3>
            <p>Make your special occasions unforgettable with our custom-designed, handcrafted celebration cakes.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="section" style={{ paddingBottom: "8rem" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2>Ready to Taste the Magic?</h2>
            <p>Reach out to us for orders, reservations, or just to say hi.</p>
          </div>
          
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
