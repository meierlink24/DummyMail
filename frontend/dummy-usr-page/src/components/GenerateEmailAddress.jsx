import { useState } from "react";

function GenerateEmailAddress({ onEmailGenerated }) {
  const [duration, setDuration] = useState(1);
  const [useDays, setUseDays] = useState(false);
  const [useHours, setUseHours] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let ttlMinutes = 0;
    if (useDays) ttlMinutes += duration * 1440;
    if (useHours) ttlMinutes += duration * 60;

    // Replace with real POST request
    await fetch("http://localhost:3000/generate", {
      method: "POST",
    });

    onEmailGenerated(); // callback to App.jsx
  };

  return (
    <div className="generate-form">
      <form onSubmit={handleSubmit}>
        <label htmlFor="duration">Duration:</label>
        <input
          type="number"
          id="duration"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          min="1"
        />

        <div>
          <input
            type="checkbox"
            id="days"
            checked={useDays}
            onChange={() => setUseDays(!useDays)}
          />
          <label htmlFor="days">Days</label>

          <input
            type="checkbox"
            id="hours"
            checked={useHours}
            onChange={() => setUseHours(!useHours)}
          />
          <label htmlFor="hours">Hours</label>
        </div>

        <input type="submit" value="Generate Email Address" />
      </form>
    </div>
  );
}

export default GenerateEmailAddress;
