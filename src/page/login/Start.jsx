import React, {
  useState
  // useContext
} from 'react';
import { Link } from 'react-router-dom';
// import AuthContext from "../../contexts/AuthContext";
import TermsConditions from '../../image/terms and conditions.svg';

export default function Start() {
  // const { user } = useContext(AuthContext);
  const [isChecked, setIsChecked] = useState(false);
  const handleChange = (event) => {
    setIsChecked((current) => !current);
  };

  const logout = async () => {
    //clear local storage
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className='p-[54px] h-max rounded-[12px] bg-[#FAFAFA] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.25)] flex flex-col justify-evenly items-center'>
      <button
        type='button'
        className='py-4 rounded-full bg-[#ff032d] text-[#FAFAFA] font-semibold text-lg md:text-[24px] opacity-10 absolute top-0 w-2 h-2 left-390 right-0'
        onClick={logout}></button>
      <div className='font-Nunito text-[29px] font-bold text-black'>
        <p>
          Welcome to the English Exam Test
          <span className='text-accent2'>!</span>
        </p>
      </div>
      <div className='mt-[31px]'>
        <img src={TermsConditions} alt='' />
      </div>
      <div className='flex flex-col items-center justify-between h-7 mt-[31.5px] mb-[54px]'>
        <form action='' className='flex gap-1 mb-[14.5px]'>
          <input
            type='checkbox'
            id='agree'
            name='agreement'
            value={isChecked}
            onChange={handleChange}
            className='w-[17.91px] h-[17.91px] rounded-full focus:ring-white focus:checked:bg-accent2 checked:bg-accent2 checked:hover:bg-accent2'
          />
          <label
            htmlFor='agree'
            className='font-montserrat font-bold text-[14px] leading-[17.07px] text-black'>
            I agree to the Software Exam Test terms and conditions.
          </label>
        </form>
        <Link
          to={'/exam/' + JSON.parse(localStorage.getItem('examId'))}
          className='mb-[54px]'>
          {/* { !isChecked? <ErrorCheck />} */}
          <button
            disabled={!isChecked}
            className='font-Nunito font-bold text-2xl py-[14px] px-[211px] rounded-[34px] disabled:text-black disabled:bg-[#E0E0E0] enabled:text-white enabled:bg-accent1'>
            START
          </button>
        </Link>
      </div>
    </div>
  );
}
