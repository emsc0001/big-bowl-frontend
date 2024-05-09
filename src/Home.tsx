import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <header className="hero-section">
        <img
          className="logo1"
          src="https://i.ibb.co/9rQBkgw/DALL-E-2024-05-09-14-25-21-A-vibrant-and-modern-logo-for-a-bowling-alley-named-Big-Bowl-The-logo-inc.webp"
          alt="Big Bowl Logo"
        />

        <h1>Velkommen til Big Bowl🎳</h1>
        <p>Dit ultimative sted for sjov og bowling!</p>
      </header>

      <main className="main-content">
        <section className="faciliteter-section">
          <h2>Udforsk vores faciliteter</h2>
          <div className="faciliteter">
            <h3>Vælg din oplevelse</h3>
            <div className="facility-cards">
              <Link to="/bowling" className="facility-card">
                <h4>🎳 Bowling</h4>
                <img
                  className="bowlingImg"
                  src="https://i.ibb.co/42hMwNV/DALL-E-2024-05-09-18-45-14-A-vibrant-animated-scene-depicting-a-booking-area-for-bowling-The-scene-i.webp"
                  alt="🎳 Bowling"
                />
              </Link>
              <Link to="/airhockey" className="facility-card">
                <h4>🏒 Airhockey</h4>
                <img
                  className="bowlingImg"
                  src="https://i.ibb.co/L6QMnGd/DALL-E-2024-05-09-18-45-20-A-vibrant-animated-scene-of-an-air-hockey-game-in-action-featuring-colorf.webp"
                  alt="🏒 Airhockey"
                />
              </Link>
              <Link to="/spisning" className="facility-card">
                <h4> 🍽️ Spisning</h4>
                <img
                  className="bowlingImg"
                  src="https://i.ibb.co/sPVYnDD/DALL-E-2024-05-09-18-46-22-A-vibrant-animated-dining-scene-showing-a-beautifully-set-dining-table-wi.webp"
                  alt="🍽️ Spisning"
                />
              </Link>
            </div>
          </div>
        </section>

        <section className="promo-section">
          <h2>Deltag i vores bowlingturneringer</h2>
          <p>Tilmeld dig i dag og få en fantastisk oplevelse!</p>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Big Bowl. Alle rettigheder forbeholdes.</p>
      </footer>
    </div>
  );
}
