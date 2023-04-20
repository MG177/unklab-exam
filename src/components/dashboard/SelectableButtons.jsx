import { useState } from 'react';

export default function SelectableButtons() {
  const [selectedButton, setSelectedButton] = useState('Listening');

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  return (
    <div className='flex gap-3 mb-3'>
      <button
        className={`py-1 px-4 rounded-full ${
          selectedButton === 'Listening'
            ? 'bg-accent1 text-white'
            : 'bg-slate-300 text-white'
        } font-bold text-sm`}
        onClick={() => handleButtonClick('Listening')}>
        Listening
      </button>
      <button
        className={`py-1 px-4 rounded-full ${
          selectedButton === 'Reading'
            ? 'bg-accent1 text-white'
            : 'bg-slate-300 text-white'
        } font-bold text-sm`}
        onClick={() => handleButtonClick('Reading')}>
        Reading
      </button>
      <button
        className={`py-1 px-4 rounded-full ${
          selectedButton === 'Grammar'
            ? 'bg-accent1 text-white'
            : 'bg-slate-300 text-white'
        } font-bold text-sm`}
        onClick={() => handleButtonClick('Grammar')}>
        Grammar
      </button>
      <button
        className={`py-1 px-4 rounded-full ${
          selectedButton === 'Vocabulary'
            ? 'bg-accent1 text-white'
            : 'bg-slate-300 text-white'
        } font-bold text-sm`}
        onClick={() => handleButtonClick('Vocabulary')}>
        Vocabulary
      </button>
    </div>
  );
}
