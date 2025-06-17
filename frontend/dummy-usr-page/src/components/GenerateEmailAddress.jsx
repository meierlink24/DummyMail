import { useState } from 'react';
import EmailInbox from './EmailInbox';

function GenerateEmailAddress({ onEmailGenerated }) {
  const [duration, setDuration] = useState(60);
  const [emailData, setEmailData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ttlMinutes: duration })
      });
      
      const data = await response.json();
      setEmailData(data);
      onEmailGenerated(data);
    } catch (error) {
      console.error('Error generating email:', error);
      alert('Failed to generate email');
    }
  };

  return (
    <div className="email-generator">
      <form onSubmit={handleSubmit}>
        <label>
          Email Lifetime (minutes):
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min="1"
            required
          />
        </label>
        
        <button type="submit">Create Temporary Email</button>
      </form>

      {emailData && (
        <div className="email-result">
          <h3>Your Temporary Email:</h3>
          <p className="email-address">{emailData.email}</p>
          <p>Expires: {new Date(emailData.expiresAt).toLocaleString()}</p>
          
          <EmailInbox email={emailData.email} />
        </div>
      )}
    </div>
  );
}

export default GenerateEmailAddress;