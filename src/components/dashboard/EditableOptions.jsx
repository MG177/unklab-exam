import React, { useState, useEffect } from 'react';
import check from '../../image/check_small.svg';

export default function EditableOptions({
  active,
  option,
  handleAnswer,
  handleOptionsChange,
  index
}) {
  const [data, setData] = useState(option);

  useEffect(() => {
    handleOptionsChange(index, data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div
      onClick={() => handleAnswer(option)}
      className={`w-full gap-[18px]  flex rounded-[24px] px-[15px] py-[20px] hover:backdrop-brightness-95  shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)]   ${
        active ? ' shadow-md' : 'bg-whitePlus'
      }`}>
      {active ? (
        <img src={check} alt='' />
      ) : (
        <div className='w-[29px] h-[29px] bg-white rounded-[50%] border'></div>
      )}
      <input
        type='text'
        value={data}
        className='text-[20px] border-none bg-transparent'
        onChange={(e) => setData(e.target.value)}
      />
      {/* <p className={`${active ? 'text-white ' : ''} text-[20px]`}>{option}</p> */}
    </div>
  );
}
