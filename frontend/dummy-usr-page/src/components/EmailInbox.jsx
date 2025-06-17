import { useState, useEffect } from 'react';

function EmailInbox({ email }) {
  const [inbox, setInbox] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    if (!email) return;
    
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:3000/inbox/${email}`);
        const data = await response.json();
        setInbox(data);
      } catch (error) {
        console.error('Error fetching inbox:', error);
      }
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, [email]);

  const viewEmail = async (mailId) => {
    try {
      const response = await fetch(`http://localhost:3000/email/${email}/${mailId}`);
      const data = await response.json();
      setSelectedEmail(data);
    } catch (error) {
      console.error('Error fetching email:', error);
    }
  };

  return (
    <div className="email-inbox">
      <h3>Inbox for {email}</h3>
      
      {inbox.length === 0 ? (
        <p>No emails received yet</p>
      ) : (
        <ul className="email-list">
          {inbox.map((mail) => (
            <li key={mail.id} onClick={() => viewEmail(mail.id)}>
              <strong>{mail.from}</strong>: {mail.subject}
            </li>
          ))}
        </ul>
      )}

      {selectedEmail && (
        <div className="email-viewer">
          <h4>{selectedEmail.subject}</h4>
          <p><strong>From:</strong> {selectedEmail.from}</p>
          <p><strong>Date:</strong> {new Date(selectedEmail.date).toLocaleString()}</p>
          <div className="email-body">
            {selectedEmail.textBody || selectedEmail.body}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmailInbox; 