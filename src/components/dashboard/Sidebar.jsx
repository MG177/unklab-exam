import React, { useState, useContext, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const [isHidden, setIsHidden] = useState(false);
  const location = useLocation();

  const toggleHidden = useCallback(() => {
    setIsHidden((prevHidden) => !prevHidden);
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.clear();
    window.location.href = '/';
  }, []);

  function selectedClass(path) {
    return location.pathname === path
      ? 'text-white bg-accent2'
      : 'text-gray bg-white';
  }

  return (
    <div
      className={`fixed z-20 flex flex-col h-screen transition-all duration-300 bg-whitePlus w-fit shadow-right ${
        !isHidden && 'items-center'
      }`}
    >
      <div
        className={`flex w-fit items-center ${
          !isHidden ? 'justify-center' : 'justify-between'
        } p-3 h-16`}
      >
        {isHidden ? (
          <h1 className="mr-4 w-fit whitespace-nowrap text-2xl font-bold font-Nunito text-accent1">
            Unklab <span className="text-black">Exams</span>
          </h1>
        ) : (
          <h1 className="text-2xl font-bold text-center font-Nunito text-accent1">
            U<span className="text-black">E</span>
          </h1>
        )}
        {isHidden && (
          <button
            onClick={handleLogout}
            className="items-center w-8 h-8 text-white rounded-full bg-accent2"
          >
            <i className="pl-1 pi pi-sign-out" style={{ fontSize: '1rem' }} />
          </button>
        )}
      </div>
      <nav className="flex-1 px-4">
        <ul className={`space-y-2 font-Nunito `}>
          <Link
            className={`flex flex-row ${
              !isHidden
                ? 'justify-center items-center'
                : 'justify-start items-center'
            } p-2 ${selectedClass(
              '/dashboard/home'
            )} rounded-xl h-fit transition-all duration-300`}
            to="/dashboard/home"
          >
            <i className="pi pi-home" style={{ fontSize: '1.5rem' }} />
            <p
              className={`ml-3 leading-none text-xl font-semibold ${
                !isHidden && 'hidden'
              }`}
            >
              Home
            </p>
          </Link>
          <Link
            className={`flex flex-row ${
              !isHidden
                ? 'justify-center items-center'
                : 'justify-start items-center'
            }  p-2 ${selectedClass(
              '/dashboard/questions'
            )} rounded-xl h-fit transition-all duration-300`}
            to="/dashboard/questions"
          >
            <i className="pi pi-file-edit" style={{ fontSize: '1.5rem' }} />
            <p
              className={`ml-3 leading-none text-xl font-semibold ${
                !isHidden && 'hidden'
              }`}
            >
              Question
            </p>
          </Link>
        </ul>
      </nav>
      <div
        className={`sticky bottom-0 right-0 flex ${
          isHidden ? 'justify-end' : 'justify-center'
        } w-full p-4`}
      >
        <button
          onClick={toggleHidden}
          className="w-8 h-8 text-white transition-all duration-300 rounded-full bg-accent2"
        >
          <i
            className={isHidden ? 'pi pi-chevron-left' : 'pi pi-chevron-right'}
          />
        </button>
      </div>
    </div>
  );
}
