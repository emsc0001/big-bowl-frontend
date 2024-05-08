import { useEffect, useState } from "react";
import { getInfo, Info } from "./services/apiFacade";
import "./Home.css";

export default function Home() {
  const [info, setInfo] = useState<Info | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    setErr("");
    getInfo()
      .then((data) => setInfo(data))
      .catch(() => {
        setErr("Fejl ved indlæsning af data fra backend");
      });
  }, []);

  return (
    <div className="home-container">
      <header className="hero-section">
        <img
          className="logo"
          src="https://files.oaiusercontent.com/file-8glmOSoVN7HHst8vnFxeP6uW?se=2024-05-08T12%3A08%3A49Z&sp=r&sv=2023-11-03&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3D3dae81c2-506f-4a8f-b341-d340d690d715.webp&sig=/BHRp6h9d9xtF/KWOSSQGlwzPhJffSv5HLt9nE%2Bq88o%3D"
          alt="Big Bowl Logo"
        />

        <h1>Velkommen til Big Bowl</h1>
        <p>Dit ultimative sted for sjov og bowling!</p>
      </header>

      <main className="main-content">
        <section className="info-section">
          <h2>Udforsk vores faciliteter</h2>
          <p style={{ color: "red" }}>{err}</p>
          {info && (
            <>
              <h3>Information om Backend-data</h3>
              <ul>
                <li>
                  <strong>Data hentet fra:</strong> {info.reference}
                </li>
                <li>
                  <strong>Data oprettet:</strong> {info.created}
                </li>
                <li>{info.info}</li>
              </ul>
            </>
          )}
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
