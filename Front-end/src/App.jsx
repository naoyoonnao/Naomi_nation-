import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import AdminPanel from './pages/AdminPanel'
import Home from "./pages/Home/Home";
import Kittens  from "./pages/Kittens/Kittens"; 
import Breeding  from "./pages/Breeding/Breeding";
import AddEventModal from "./pages/AdminPanel/AddEventModal";
import Shows from "./pages/Shows/Shows";
import './app.scss';




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/kittens" element={<Kittens />}    />
        <Route path="/breeding" element={<Breeding />} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/admin/events"   element={<AddEventModal />}  />
      </Routes> 
    </Router>
  );
}

export default App;
