import { HeaderQuestionEditor } from '../Header';
import QuestionEditorItem from './QuestionEditorItem';

export default function QuestionEditor() {
  const questions = [
    {
      id: 1,
      text: 'A: helooo\nB: asdasdasd',
      options: [
        {
          id: '1',
          text: 'A:asdasd\nsdasd\nasd',
        },
        {
          id: '2',
          text: 'B\n\nsd',
        },
        {
          id: '3',
          text: 'C\n\n',
        },
        {
          id: '4',
          text: 'D\nsda\n\n\nsd',
        },
      ],
      correctAnswer: '2',
      type: 'reading',
    },
    {
      id: 2,
      options: [
        {
          id: 1,
          text: 'ds\nsds\n\nsd',
        },
      ],
      answer: 1,
      audio: null,
      image: null,
      type: 'grammar',
      text: 'dasdasdas',
      correctAnswer: 1,
    },
  ];
  return (
    <>
      <HeaderQuestionEditor />
      <div className="flex flex-col items-center justify-center w-full gap-5 my-24">
        {questions.map((question, index) => (
          <QuestionEditorItem
            key={index}
            question={question}
            currentQuestion={index}
          />
        ))}
      </div>
    </>
  );
}
