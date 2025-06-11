import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import AdminPanel from './pages/AdminPanel'
import Home from "./pages/Home/Home";
import Kittens  from "./pages/Kittens/Kittens"; 
import Breeding  from "./pages/Breeding/Breeding";
import About from "./pages/About/About";
import AddEventModal from "./pages/AdminPanel/AddEventModal";
import Shows from "./pages/Shows/Shows";
import Contacts from "./pages/Contacts/Contact"
import { SearchProvider } from "./context/SearchContext";
import Footer from "./components/Footer/Footer";
import './app.scss';




function App() {
  return (
    <SearchProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/kittens" element={<Kittens />}    />
        <Route path="/breeding" element={<Breeding />} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin/events"   element={<AddEventModal />}  />
        <Route path="/contacts"   element={<Contacts />}  />
      </Routes>
      <Footer /> 
    </Router>
    </SearchProvider>
  );
}

export default App;
