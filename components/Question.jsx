'use client';

import React, { useEffect, useState } from 'react';
import '@/styles/audio.css';
import Media from './Media';
import Option from './Option';
import { useRouter } from 'next/navigation';
import api from '@/lib/api/client';

export default function Questions({ questions, number, textSize, size }) {
  const router = useRouter();
  const question = questions[number];
  const [answer, setAnswer] = useState(question.answer);

  useEffect(() => {
    setAnswer(question.answer);
  }, [number, question.answer]);

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
      await api.patch('student/answer', {
        index: number,
        answer: index,
      });
      setAnswer(index);
    } catch (error) {
      if (error.response?.status === 403) {
        router.push('/score');
      }
      console.log(error);
      alert('Error, please check your internet connection');
    }
  };

  const handleActive = (index) => {
    return answer === index;
  };

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
          dangerouslySetInnerHTML={{
            __html: question.text.replace(/\n/g, '<br>'),
          }}
        ></p>
      </div>
      {question.options.map((option) => (
        <Option
          key={option.id}
          answerId={option.id}
          option={option.text}
          active={handleActive(option.id)}
          handleAnswer={handleAnswer}
          textSize={textSize}
          size={size}
        />
      ))}
    </div>
  );
}
