import { Routes, Route } from "react-router-dom";
import './App.css';
import HomePage from "./pages/HomePage";
import CountryDetailsPage from "./pages/CountryDetailsPage";
import SignInPage from "./pages/SignInPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/country/:code" element={<CountryDetailsPage />} />
      <Route path="/sign-in" element={<SignInPage />} />
    </Routes>
  );
}

export default App;
