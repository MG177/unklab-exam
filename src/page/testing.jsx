import { useState } from 'react';
import ProgressBar from './score/progress_bar.svg';
export default function Testing() {
  // const [isSubscribed, setIsSubscribed] = useState(false);

  // const handleChange = event => {
  //   if (event.target.checked) {
  //     console.log('✅ Checkbox is checked');
  //   } else {
  //     console.log('⛔️ Checkbox is NOT checked');
  //   }
  //   setIsSubscribed(current => !current);
  // };

  return (
    <div>
      <div className="bg-taccent1 w-max h-max mt-16 rounded-[37px] flex justify-center items-center p-[22px] shadow-[0_5.95px_29.74px_rgba(0,0,0,0.1)]">
        <div className="bg-white w-max h-max px-[40px] gap-7 py-[27px] rounded-[24px] flex flex-row justify-center items-center shadow-[0_5.95px_29.74px_rgba(0,0,0,0.58)]">
          <div className=" flex flex-col justify-center items-center drop-shadow-[2px_3px_7px_rgba(0,0,0,0.15)]">
            <img src={ProgressBar} alt="" />
            <div className="-mt-[120px] flex flex-col items-center justify-center">
              <p className="text-6xl font-bold text-black font-Nunito">
                100/100
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-row font-Nunito gap-[10px] ">
              <div className="text-black w-full max-w-[200px] bg-white shadow-[2px_3px_7px_rgba(0,0,0,0.15)] rounded-[24px] h-[111px] py-4 px-5">
                <p className="text-5xl font-bold">0/0</p>
                <p className="text-2xl">Right answers</p>
              </div>
              <div className="text-white bg-accent1 shadow-[2px_3px_7px_rgba(0,0,0,0.15)] rounded-[24px] py-4 px-7">
                <p className="text-5xl text-left font-bold">E</p>
                <p className="text-2xl font-bold">Grade</p>
              </div>
            </div>
            <div className="bg-white shadow-[2px_3px_7px_rgba(0,0,0,0.15)] rounded-3xl max-w-[350px] h-fit flex items-center justify-center px-[16px] py-[30px] leading-[35px]">
              <p className="text-[35px] font-bold font-[Nunito] text-black text-center">
                Tester
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
