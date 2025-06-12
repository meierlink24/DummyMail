import { useState, useEffect } from "react";
import GenerateEmailAddress from "./components/GenerateEmailAddress";
import ShowPanel from "./components/ShowPanel";

function App() {
  const [emailList, setEmailList] = useState([]);

  const fetchEmails = async () => {
    const res = await fetch("http://localhost:3000/emails");
    const data = await res.json();
    const mapped = data.map((e) => ({
      address: e.email,
      active: Date.now() < e.expiresAt,
    }));
    setEmailList(mapped);
  };

  const handleEmailGenerated = async () => {
    await fetch("http://localhost:3000/generate", {
      method: "POST",
    });
    fetchEmails(); // refresh list after generation
  };

  useEffect(() => {
    fetchEmails();
    const interval = setInterval(fetchEmails, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>Dummy Email Generator</h1>
      <GenerateEmailAddress onEmailGenerated={handleEmailGenerated} />
      <ShowPanel emailList={emailList} />
    </div>
  );
}

export default App;
