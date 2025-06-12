function ShowPanel({ emailList = [] }) {
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
              {email.active ? "Active" : "Expired"}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default ShowPanel;
