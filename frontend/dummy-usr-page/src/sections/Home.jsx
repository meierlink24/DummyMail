

function Home() {
  return (
    <div className="home-section full-page">
      <div className="home-content">
        <div className="logo-name">
          <h1>DummyMail</h1>
        </div>

        <div className="about">
          <p>
            DummyMail is a Firefox extension that allows you to create temporary or long-term dummy email addresses. 
            It helps you avoid spam, newsletters, and promotional emails by using disposable accounts. 
            You can choose how long your dummy account should last, making it ideal for one-time signups 
            or long-term anonymity.
          </p>
        </div>

        <div className="features">
          <h2>Features</h2>
          <ul>
            <li>Create temporary email addresses with custom expiration times</li>
            <li>View received emails in real-time</li>
            <li>Clean, minimalist interface</li>
            <li>Completely free to use</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;