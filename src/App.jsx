import { Routes, Route } from "react-router-dom";
import UserVerificationForm from "./components/UserVerificationForm";
import PaymentVerificationForm from "./components/PaymentVerificationForm";
import SuccessPage from "./components/SuccessPage";
import { useState } from "react";
import "./App.css";

export default function App() {
  const [userData, setUserData] = useState({});

  const handleUserSubmit = (data) => {
    setUserData(data);
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<UserVerificationForm onNext={handleUserSubmit} />}
        />
        <Route
          path="/payment"
          element={<PaymentVerificationForm userData={userData} />}
        />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </div>
  );
}
