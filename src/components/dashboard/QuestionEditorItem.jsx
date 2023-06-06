import React, { useContext, useEffect, useRef, useState } from 'react';
import EditableOptions from './EditableOptions';
import QuestionContext from '../../contexts/QuestionContext';
import AuthContext from '../../contexts/AuthContext';
import SelectableDropdown from './SelectableDropdown';
import AddImage from '../../image/imageicon.svg';
import AddAudio from '../../image/audio.svg';
import Delete from '../../image/trash.svg';
import api from '../../config';
import Media from '../Media';

export default function QuestionEditorItem({ question }) {
  const { questions, setQuestions, setSaveStatus } =
    useContext(QuestionContext);
  const { user } = useContext(AuthContext);
  const questionRef = useRef(null);
  const hasContent =
    question.media || question.audio || question.image || question.question;
  // const [mediaId, setMediaId] = useState(null);

  // useEffect(() => {
  //   console.log('useEffect QuestionEditorItem');
  //   if (question.audio) {
  //     if (!audioLoading) {
  //       setAudioLoading(true);
  //     }
  //     api
  //       .get(`/file/${question.audio}`, {
  //         headers: {
  //           Authorization: `Bearer ${user.access_token}`,
  //         },
  //       })
  //       .then((response) => {
  //         setAudioSrc(response.data);
  //         setImageSrc(null);
  //         setAudioLoading(false);
  //       })
  //       .catch((error) => console.log(error));
  //   }
  //   if (question.image) {
  //     if (!imageLoading) {
  //       setImageLoading(true);
  //     }
  //     api
  //       .get(`/file/${question.image}`, {
  //         headers: {
  //           Authorization: `Bearer ${user.access_token}`,
  //         },
  //       })
  //       .then((response) => {
  //         setImageSrc(response.data);
  //         setAudioSrc(null);
  //         setImageLoading(false);
  //       })
  //       .catch((error) => console.log(error));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [question.audio, question.image, user.access_token]);

  // console.log('imageSrc', imageSrc);

  const resizeTextArea = () => {
    questionRef.current.style.height = 'auto';
    questionRef.current.style.height = questionRef.current.scrollHeight + 'px';
  };

  useEffect(resizeTextArea, [question.question]);

  const handleSetActive = (valueId) => {
    return question.correctAnswer === valueId;
  };

  const handleOverwriteDataQuestion = (questionId, value) => {
    let newData = [...questions];
    newData.find((question) => question.id === questionId).text = value;
    setQuestions(newData);
    setSaveStatus(false);
  };

  const handleMusicFileChange = (e, questionId) => {
    const file = e.target.files[0];
    if (file.size > 1000000) {
      alert('File size exceeds 1MB limit');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    api
      .post('/file', formData, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      })
      .then((response) => {
        const fileId = response.data.id;
        setQuestions((prevData) => {
          const index = prevData.findIndex(
            (question) => question.id === questionId
          );
          if (index === -1) return prevData;
          const newData = [...prevData];
          newData[index] = {
            ...newData[index],
            audio: fileId,
            image: null,
          };
          return newData;
        });
        setSaveStatus(false);
        // setAudioLoading(true)  ;
      })
      .catch((error) => {
        console.error(error);
      });

    e.target.value = '';
  };

  const handleImageFileChange = (e, questionId) => {
    const file = e.target.files[0];
    if (file.size > 1000000) {
      alert('File size exceeds 1MB limit');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    api
      .post('/file', formData, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      })
      .then((response) => {
        // console.log('response', response);
        const fileId = response.data.id;
        setQuestions((prevData) => {
          const index = prevData.findIndex(
            (question) => question.id === questionId
          );
          if (index === -1) return prevData;
          const newData = [...prevData];
          newData[index] = {
            ...newData[index],
            image: fileId,
            audio: null,
          };
          return newData;
        });
        setSaveStatus(false);
        // setImageLoading(true);
      })
      .catch((error) => {
        console.error(error);
      });

    e.target.value = '';
  };

  const handleRemoveMusicFile = (questionId) => {
    setQuestions((prevData) => {
      const newData = [...prevData];
      newData.find((question) => question.id === questionId).audio = null;
      return newData;
    });
    // setAudioSrc(null);
    setSaveStatus(false);
  };

  const handleRemoveImageFile = (questionId) => {
    setQuestions((prevData) => {
      const newData = [...prevData];
      newData.find((question) => question.id === questionId).image = null;
      return newData;
    });
    // setImageSrc(null);
    setSaveStatus(false);
  };

  const handleAddOption = (questionId) => {
    setQuestions((prevData) => {
      const newData = prevData.map((question) => {
        let newId = 1;
        // eslint-disable-next-line no-loop-func
        while (question.options.find((option) => option.id === newId)) {
          newId++;
        }
        if (question.id === questionId) {
          return {
            ...question,
            options: [
              ...question.options,
              {
                id: newId,
                text: '',
              },
            ],
          };
        }
        return question;
      });

      setSaveStatus(false);
      return newData;
    });
  };

  const handleDeleteQuestion = (questionId) => {
    setQuestions((prevData) => {
      const newData = [...prevData];
      newData.splice(
        newData.findIndex((question) => question.id === questionId),
        1
      );
      return newData;
    });
    setSaveStatus(false);
  };

  // console.log('imageSrc', imageSrc);

  return (
    <div className="flex gap-3 mb-6 w-full ">
      <div className="flex flex-col w-full gap-6">
        <div className="flex flex-col gap-3 px-3 py-5 bg-whitePlus shadow-right rounded-2xl">
          <div className="flex flex-row justify-between w-full">
            <h3 className="text-xl font-bold text-accent1">
              Question #{question.id}
            </h3>
            <SelectableDropdown question={question} />
          </div>
          {hasContent && (
            <Media
              id={
                question.image ||
                question.audio ||
                question.file ||
                question.media
              }
              dashboard
            />
          )}
          <div className="grid grid-cols-1 grid-rows-1 after:whitespace-pre-wrap after:content-[attr(data-replicated-value)] after:invisible ">
            <textarea
              placeholder="Question..."
              value={questions.find((q) => q.id === question.id).text}
              onChange={(e) =>
                handleOverwriteDataQuestion(question.id, e.target.value)
              }
              className="w-full col-start-1 row-start-1 overflow-hidden text-base text-black bg-transparent border-none resize-none h-fit active:ring-0 focus:ring-0 ring-0"
              ref={questionRef}
              onInput={resizeTextArea}
            />
          </div>
        </div>
        <div className="flex flex-col gap-[18px] min-w-full ">
          {question.options &&
            question.options.map((option) => (
              <EditableOptions
                key={option.id}
                option={option}
                active={handleSetActive(option.id)}
                optionId={option.id}
                questionId={question.id}
              />
            ))}
          <button
            className="w-full gap-[18px] flex justify-center items-center rounded-[24px] px-[15px] py-[20px] hover:backdrop-brightness-95  shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)] bg-whitePlus"
            onClick={() => handleAddOption(question.id)}
          >
            <i className="fa-solid fa-plus" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <button
          className="flex items-center justify-center w-8 h-8 text-white rounded-full bg-accent2"
          onClick={() => handleDeleteQuestion(question.id)}
        >
          {/* <i className='fa-solid fa-trash' /> */}
          <img src={Delete} alt="" className="scale-75" />
        </button>
        {!question.audio ? (
          <label
            htmlFor={`audio-file-input${question.id}`}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-whitePlus shadow-right"
          >
            {/* <i className='text-black fa-solid fa-audio' /> */}
            <img src={AddAudio} alt="" className="scale-75" />
          </label>
        ) : (
          <button
            className="px-2 py-1 text-white bg-red-500 rounded-full"
            onClick={() => handleRemoveMusicFile(question.id)}
          >
            <i className="fa-solid fa-times" />
          </button>
        )}
        <input
          id={`audio-file-input${question.id}`}
          type="file"
          accept="audio/*"
          onChange={(e) => handleMusicFileChange(e, question.id)}
          style={{ display: 'none' }}
        />
        {!question.image ? (
          <label
            htmlFor={`image-file-input${question.id}`}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-whitePlus shadow-right"
          >
            {/* <i className='text-black fa-regular fa-image' /> */}
            <img src={AddImage} alt="" className="scale-75" />
          </label>
        ) : (
          <button
            className="flex items-center justify-center px-2 py-2 text-white rounded-full bg-accent2"
            onClick={() => handleRemoveImageFile(question.id)}
          >
            <i className="fa-solid fa-times" />
          </button>
        )}
        <input
          id={`image-file-input${question.id}`}
          type="file"
          accept="image/*"
          onChange={(e) => handleImageFileChange(e, question.id)}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
