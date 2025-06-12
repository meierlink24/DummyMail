function ShowPanel({ emailList = [] }) {
  const formatTimeLeft = (expiresAt) => {
    if (!expiresAt) return '';
    const now = Date.now();
    if (now >= expiresAt) return 'Expired';
    
    const secondsLeft = Math.floor((expiresAt - now) / 1000);
    const hours = Math.floor(secondsLeft / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    
    return `${hours}h ${minutes}m left`;
  };

  return (
    <div className="show-panel">
      <h2>Your Email Addresses</h2>
      <ul>
        {emailList.length === 0 ? (
          <li>No emails yet.</li>
        ) : (
          emailList.map((email, index) => (
            <li key={index}>
              <strong>{email.address}</strong> –{" "}
              {email.active ? `Active (${formatTimeLeft(email.expiresAt)})` : "Expired"}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default ShowPanel;