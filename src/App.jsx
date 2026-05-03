import { useState } from "react";
import "./App.css";
import Home from "./pags/Home";
import Sidebar from "./compent/sidebar";
import Statistics from "./pags/Statistics";
import Artist from "./pags/Artist.jsx";
import ContactUs from "./pags/contactUs";
import { ListeningDataProvider } from "./context/ListeningDataContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ListeningDataProvider>
      <Router>
        <div className="app-root">
          <Sidebar
            isOpen={sidebarOpen}
            toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
          <div className="main-footer-wrapper">
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contactus" element={<ContactUs />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/artist/:artistName" element={<Artist />} />
                <Route path="*" element={<Home />} /> {/* في النهاية */}
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ListeningDataProvider>
  );
}

export default App;
