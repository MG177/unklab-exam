import React from 'react';

export default function Answer({ question, index }) {
  // const [colors, setColor] = useState('');
  // useEffect(() => {
  //   if (question.correct) {
  //     setColor('green');
  //   } else {
  //     setColor('accent2');
  //   }
  //   console.log('correct? ' + question.correct);
  // }, [question.correct]);
  // console.log(question);
  // console.log(question.correctAnswer);
  // console.log(question.answer);
  const color = () => {
    if (question.correctAnswer === question.answer) {
      return 'green';
    } else {
      return 'accent2';
    }
  };
  const icon = () => {
    if (question.correctAnswer === question.answer) {
      return 'pi-times';
    } else {
      return 'pi-check';
    }
  };
  // console.log(color());
  return (
    <div className={`p-1.5 pt-5 bg-${color()} shadow-lg rounded-3xl`}>
      <div className="bg-[#FFFFFF] w-full rounded-[24px] px-[24px] py-[14px] shadow-lg ">
        <div className="flex flex-col gap-1 mb-2">
          <p
            className={`font-bold text-${color()} font-Nunito text-[29px] max-[960px]:text-[24px] mt-[15px] mb-2}`}
          >
            Question #{index + 1}
          </p>
          <p className="w-full mb-4 font-bold font-Nunito text-[#37474F] max-[960px]:text-[16px] text-[20px] leading-[24px]">
            {question.text}
          </p>
        </div>

        <div className="relative left-[40px] border-x-[2px] border-t-[2px] border-[#cccccc] w-fit px-2.5 pt-0.5 bg-white drop-shadow-lg font-semibold font-Nunito max-[960px]:text-[8px] text-[12px] text-black rounded-t-[15px] ">
          Your answer
        </div>
        <div className="w-full h-fit max-[960px]:w-[500px] max-[960px]:h-[40px] rounded-[24px] px-[15px] py-[20px] flex bg-white items-center drop-shadow-lg border-[2px] border-[#cccccc] mb-6">
          <div className="max-[960px]:w-7 max-[960px]:h-7 w-[45px] h-[40px] rounded-full bg-[#fAfAfA] border-[#D9D9D9] border-[1px] flex justify-center items-center ml-2">
            <i
              className={`pi ${icon()} text-${color()}`}
              style={{ fontSize: '1.5rem' }}
            ></i>
          </div>
          <p className="w-full ml-6  text-left font-Nunito font-bold max-[960px]:text-[15px] text-[17px] text-black">
            {question.answer || ' -- no answer --'}
          </p>
        </div>
      </div>
    </div>
  );
}
