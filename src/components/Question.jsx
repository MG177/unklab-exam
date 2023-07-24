import React, { useEffect, useState } from 'react';
import '../styles/audio.css';
import Media from './Media';
import Option from '../components/Option';
import { useOutletContext, useNavigate } from 'react-router-dom';
import api from '../config';

export default function Questions({ questions, number, textSize, size }) {
  // const [questions, answer, setAnswer, number] = useOutletContext();
  const navigate = useNavigate();
  const question = questions[number];
  const [answer, setAnswer] = useState(question.answer);
  // console.log(`question ${question.id}: ` + question);

  useEffect(() => {
    setAnswer(question.answer);
  }, [number]);

  const hasContent = () => {
    if (question.image) {
      return question.image;
    } else if (question.audio) {
      return question.audio;
    } else {
      return null;
    }
  };

  const handleAnswer = async (index) => {
    try {
      const res = await api.patch('student/answer', {
        index: number,
        answer: index,
      });
      setAnswer(index);
    } catch (error) {
      if (error.response.status === 403) {
        navigate('/score');
      }
      console.log(error);
      alert('Error, please check your internet connection');
    }
  };

  const handleActive = (index) => {
    return answer === index;
  };

  console.log('question', question);
  return (
    <div className="flex flex-col w-fit min-w-[550px] max-w-[600px] gap-4 font-Nunito">
      <div className="flex flex-col w-full min-h-fit rounded-3xl p-5 gap-1 bg-whitePlus shadow-md border-[1px] border-gray/20 cursor-default select-none mb-2">
        <h1
          className={`font-bold ${textSize[size + 2]} md:${textSize[size + 3]
            } text-accent1`}
        >
          Question #{number + 1}
        </h1>

        {hasContent() && <Media id={hasContent()} />}
        <p
          className={`leading-normal ${textSize[size]} md:${textSize[size + 1]
            } xl:${textSize[size + 2]} text-black`}
          dangerouslySetInnerHTML={
            {
              __html: question.text.replace(/\n/g, '<br>'),
            } || 'null'
          }
        ></p>
      </div>
      {/* <div className="flex flex-col mb-10"> */}
      {question.options.map((option) => (
        <Option
          key={option.id} // Use option.id as the key
          answerId={option.id} // Pass option.id to handleAnswer
          option={option.text} // Use option.text as the option
          active={handleActive(option.id)} // Pass option.text to handleActive
          handleAnswer={handleAnswer}
          textSize={textSize}
          size={size}
        />
      ))}
      {/* </div> */}
    </div>
  );
}
