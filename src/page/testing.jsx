import {useState} from 'react';

export default function Testing () {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleChange = event => {
    if (event.target.checked) {
      console.log('✅ Checkbox is checked');
    } else {
      console.log('⛔️ Checkbox is NOT checked');
    }
    setIsSubscribed(current => !current);
  };

  return (  
    <div>
      <label htmlFor="subscribe">
        <input
          type="checkbox"
          value={isSubscribed}
          onChange={handleChange}
          id="subscribe"
          name="subscribe"
        />
        Subscribe
      </label>

      <hr />

      <button disabled={!isSubscribed} className="disabled:bg-red-400 enabled:bg-black">Proceed</button>

      {/* {isSubscribed && <h2>bobbyhadz.com</h2>} */}
    </div>
  );
}
