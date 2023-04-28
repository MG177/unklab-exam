import React, { useContext, useEffect } from 'react';
import QuestionContext from '../../contexts/QuestionContext';

function UnsaveWarning() {
  const { saveStatus } = useContext(QuestionContext);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!saveStatus) {
        // Cancel the event
        event.preventDefault();
        // Chrome requires returnValue to be set
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveStatus]);

  if (saveStatus) {
    return null; // If saveStatus is true (saved), don't display the warning component
  }

  return (
    <div className='absolute top-0 bg-red-500 z-50 w-full text-white p-2 flex justify-center items-center'>
      <i className='fas fa-exclamation-triangle mr-3' />
      Questions have not been saved!
    </div>
  );
}

export default UnsaveWarning;
