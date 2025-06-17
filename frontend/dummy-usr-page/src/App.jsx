import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GenerateEmailAddress from "./components/GenerateEmailAddress";
import ShowPanel from "./components/ShowPanel";
import Menu from "./components/Menu";
import './App.css';
import Home from "./sections/Home";

function App() {
  const [emailList, setEmailList] = useState([]);
  const [localEmails, setLocalEmails] = useState(() => {
    const saved = localStorage.getItem('tempEmails');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchEmails = async () => {
    try {
      const res = await fetch("http://localhost:3000/emails");
      const data = await res.json();
      const mapped = data.map((e) => ({
        address: e.email,
        active: Date.now() < e.expiresAt,
        expiresAt: e.expiresAt
      }));
      setEmailList(mapped);
      
      const combined = [...mapped, ...localEmails];
      localStorage.setItem('tempEmails', JSON.stringify(combined));
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const handleEmailGenerated = (newEmail) => {
    if (newEmail) {
      const updatedEmails = [...localEmails, {
        address: newEmail.email,
        active: true,
        expiresAt: newEmail.expiresAt
      }];
      setLocalEmails(updatedEmails);
      localStorage.setItem('tempEmails', JSON.stringify(updatedEmails));
    }
  };

  useEffect(() => {
    fetchEmails();
    const interval = setInterval(fetchEmails, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setLocalEmails(prev => 
        prev.map(email => ({
          ...email,
          active: Date.now() < email.expiresAt
        }))
      );
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Menu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/section/Home" element={<Home />} />
          <Route 
            path="/create-mail" 
            element={
              <>
                <GenerateEmailAddress onEmailGenerated={handleEmailGenerated} />
                <ShowPanel emailList={[...emailList, ...localEmails]} />
              </>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;