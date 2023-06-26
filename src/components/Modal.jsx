import React, { useEffect, useState, useRef } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function Modal({
  // modal,
  modalId,
  text,
  loadingText,
  handleFunction,
}) {
  if (!modalId) {
    modalId = 'modal';
  }
  const [loading, setLoading] = useState(false);
  const modal = document.getElementById(modalId);
  const modalLoadingRef = useRef(null);
  modalLoadingRef.current = document.getElementById(modalId + '_loading');

  useEffect(() => {
    if (modal) {
      // console.log('modal', modal);
      modal.showModal();
    }
  }, []);

  if (modal) {
    modal.addEventListener('click', (e) => {
      const dialogDimensions = modal.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        modal.close();
      }
    });
  }

  const handlePositiveOption = () => {
    modal.close();
    setLoading(true);
    modalLoadingRef.current.showModal();
  };

  return (
    <>
      {/* <ModalConfirm
        modal={modal}
        modalId={modalId}
        title={text.title}
        text={text.body}
        negativeOption={text.negativeOption}
        positiveOption={text.positiveOption}
        handlePositiveOption={handlePositiveOption}
      /> */}
      <dialog id={modalId || 'modal'} className="rounded-xl shadow-lg">
        <div className="flex flex-col items-center p-3">
          <i
            className="pi pi-exclamation-triangle text-5xl text-accent2 mb-2"
            style={{ fontSize: '3rem' }}
          />
          <div className="font-bold font-Nunito text-xl">
            {text.title || 'Are you sure?'}
          </div>
          <div className="font-Roboto text-md">{text.body}</div>
          <div className="flex w-full justify-center gap-4 mt-5">
            <button
              className="px-10 py-2 bg-white rounded-lg text-black font-semibold shadow-md text-xl"
              onClick={() => modal.close()}
            >
              {text.negativeOption || 'Cancel'}
            </button>
            <button
              className="px-10 py-2 bg-accent2 rounded-lg text-white font-semibold shadow-md text-xl"
              onClick={handlePositiveOption}
            >
              {text.positiveOption || 'Confirm'}
            </button>
          </div>
        </div>
      </dialog>
      <ModalLoading
        modal={modalLoadingRef.current}
        modalId={modalId}
        loadingText={loadingText}
        handleFunction={handleFunction}
        isLoading={loading}
      />
    </>
  );
}

// function ModalConfirm({
//   modal,
//   modalId,
//   title,
//   text,
//   negativeOption,
//   positiveOption,
//   handlePositiveOption,
// }) {
//   return (

//   );
// }

function ModalLoading({
  negativeOption,
  loadingText,
  modalId,
  modal,
  handleFunction,
  isLoading,
}) {
  const [countdown, setCountdown] = useState(5);
  const countdownIntervalRef = useRef(null);

  console.log(countdown);

  useEffect(() => {
    if (isLoading) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => {
        clearInterval(countdownIntervalRef.current);
      };
    }
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      handleFunction();
      if (modal) {
        modal.close();
      }
      clearInterval(countdownIntervalRef.current);
    }
  }, [countdown, handleFunction]);

  const cancelCountdown = () => {
    clearInterval(countdownIntervalRef.current);
    if (modal) {
      modal.close();
    }
  };

  return (
    <dialog
      id={modalId + '_loading' || 'modal_loading'}
      className="rounded-xl shadow-lg"
    >
      <div className="flex flex-col items-center p-3 ">
        <ProgressSpinner
          style={{ width: '48px', height: '48px', marginBottom: '1rem' }}
          strokeWidth="5"
          pt={{
            circle: {
              style: {
                stroke: '#B55FFE',
                strokeWidth: 5,
                animation: 'none',
              },
            },
          }}
        />
        <div className="font-bold font-Nunito text-xl">Please wait</div>
        <div className="font-Roboto text-md">
          {loadingText || 'Loading your request...'}
        </div>
        <button
          className="mt-2 text-accent2 font-semibold text-lg"
          onClick={cancelCountdown}
        >
          {negativeOption || 'Cancel'}
        </button>
      </div>
    </dialog>
  );
}
