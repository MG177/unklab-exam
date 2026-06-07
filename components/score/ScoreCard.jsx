'use client';

import React from 'react';

function convertName(fullName) {
  if (
    typeof fullName !== 'string' ||
    fullName.trim().length === 0 ||
    !fullName.includes(',')
  ) {
    const nameParts = fullName.split(' ');
    if (nameParts.length === 1) {
      return fullName;
    }
    return nameParts[0] + ' ' + nameParts[nameParts.length - 1];
  }

  const nameParts = fullName.split(', ');
  let lastName = nameParts[0];
  let givenNames = nameParts[1];

  if (!lastName) {
    const nameWords = givenNames.split(' ');
    if (nameWords.length === 1) {
      return nameWords[0];
    } else if (nameWords.length >= 2) {
      givenNames = nameWords.slice(-2).join(' ');
    } else {
      return '';
    }
    return givenNames;
  }

  const givenNameWords = givenNames.split(' ');
  if (givenNameWords.length === 1) {
    return fullName;
  } else if (givenNameWords.length >= 2) {
    givenNames = givenNameWords.slice(0, 2).join(' ');
  } else {
    return lastName;
  }

  return lastName + ', ' + givenNames;
}

export default function ScoreCard({ user, score }) {
  if (!score || !user) {
    return <div></div>;
  }

  const getFormattedScore = (s) => {
    const number = Math.round(parseFloat(s));
    return isNaN(number) ? '0' : number.toString();
  };

  return (
    <div className="relative flex flex-col justify-center items-center bg-accent1/70 rounded-3xl p-4 shadow-lg md:scale-125">
      <div className="flex flex-row justify-center items-center bg-white rounded-3xl py-4 px-6 gap-4 w-[400px] h-[200px]">
        <div className="flex flex-col border-[14px] min-h-[170px] min-w-[170px] border-accent2 rounded-full shadow-lg justify-center items-center">
          <p className="text-3xl indent-tight font-bold text-black font-Nunito z-10">
            {`${getFormattedScore(score.score)}/100`}
          </p>
        </div>
        <div className="flex flex-col justify-center h-full font-Nunito gap-3 max-w-[13rem]">
          <div className="bg-white shadow-lg rounded-3xl h-fit w-full py-2 px-4 min-h-[2.5rem] border border-gray/20">
            <p className="text-lg font-bold font-Nunito text-black text-center leading-tight">
              {convertName(user.studentName) || 'Your Name'}
            </p>
          </div>
          <div className="text-black w-fit bg-white shadow-lg rounded-3xl h-fit py-3 px-4 border border-gray/20 leading-none">
            <p className="text-3xl font-bold leading-none">
              {`${score.correct || '0'}/${score.total || '0'}`}
            </p>
            <span className="text-lg whitespace-nowrap leading-none">
              Right answers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
