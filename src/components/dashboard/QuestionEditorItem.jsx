import React, { useContext } from "react";
import EditableOptions from "./EditableOptions";
import QuestionContext from "../../contexts/QuestionContext";
import SelectableButtons from "./SelectableButtons";
import AddImage from "../../image/imageicon.svg";
import AddAudio from "../../image/audio.svg";
import Delete from "../../image/trash.svg";

export default function QuestionEditorItem({ question }) {
  const { questions, setQuestions } = useContext(QuestionContext);

  const handleSetActive = (index) => {
    return question.answer === index;
  };

  const handleOverwriteDataQuestion = (questionId, value) => {
    let newData = [...questions];
    newData.find((question) => question.id === questionId).question = value;
    setQuestions(newData);
  };

  const handleMusicFileChange = (e, questionId) => {
    console.log("questionId(handleMusicfileChange): ", questionId);
    const file = e.target.files[0];
    if (file.size > 1000000) {
      alert("File size exceeds 1MB limit");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;
      setQuestions((prevData) => {
        const index = prevData.findIndex(
          (question) => question.id === questionId
        );
        if (index === -1) return prevData;
        const newData = [...prevData];
        newData[index] = {
          ...newData[index],
          music: base64String,
          image: null,
        };
        return newData;
      });
    };

    // remove the the music file from input
    e.target.value = "";
  };

  const handleImageFileChange = (e, questionId) => {
    console.log("questionId: ", questionId);
    const file = e.target.files[0];
    if (file.size > 1000000) {
      alert("File size exceeds 1MB limit");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;
      setQuestions((prevData) => {
        const index = prevData.findIndex(
          (question) => question.id === questionId
        );
        if (index === -1) return prevData;
        const newData = [...prevData];
        newData[index] = {
          ...newData[index],
          image: base64String,
          music: null,
        };
        return newData;
      });
    };

    // remove the the music file from input
    e.target.value = "";
  };

  const handleRemoveMusicFile = (questionId) => {
    setQuestions((prevData) => {
      const newData = [...prevData];
      newData.find((question) => question.id === questionId).music = null;
      return newData;
    });
  };

  // This function is used to remove the selected image file
  const handleRemoveImageFile = (questionId) => {
    setQuestions((prevData) => {
      const newData = [...prevData];
      newData.find((question) => question.id === questionId).image = null;
      return newData;
    });
  };

  const handleAddOptions = (questionId) => {
    const newData = [...questions];
    newData.find((question) => question.id === questionId).options.push("");
    setQuestions(newData);
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
  };

  return (
    <div className="flex w-full gap-3 mb-6">
      <div className="flex flex-col w-full gap-6">
        <div className="flex flex-col gap-3 p-3 bg-whitePlus shadow-right rounded-2xl">
          <SelectableButtons questionId={question.id} />
          <h3 className="text-2xl font-bold text-accent1">
            Question #{question.id}
          </h3>
          {question.music && typeof question.music === "string" && (
            <div className="flex items-center gap-2">
              <audio src={question.music} controls />
            </div>
          )}
          {question.image && typeof question.image === "string" && (
            <div className="flex items-center gap-2">
              <img
                src={question.image}
                alt="Selected"
                className="object-cover w-full h-auto"
                style={{ maxHeight: "300px" }}
              />
            </div>
          )}
          <textarea
            placeholder="Question..."
            onChange={(e) =>
              handleOverwriteDataQuestion(question.id, e.target.value)
            }
            className="w-full text-[20px] border-none bg-transparent text-md text-black active:ring-0 focus:ring-0 ring-0"
          />
        </div>
        <div className="flex flex-col gap-[18px] min-w-full">
          {question.options &&
            question.options.map((option, index) => (
              <EditableOptions
                key={index}
                option={option}
                active={handleSetActive(index)}
                index={index}
                questionId={question.id}
              />
            ))}
          <button
            className="w-full gap-[18px] flex justify-center items-center rounded-[24px] px-[15px] py-[20px] hover:backdrop-brightness-95  shadow-[2px_3px_7px_0px_rgba(0,0,0,0.15)] bg-whitePlus"
            onClick={() => handleAddOptions(question.id)}
          >
            <i className="fa-solid fa-plus" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <button
          className="w-[37px] h-[37px] text-white rounded-full bg-accent2 flex justify-center items-center"
          onClick={() => handleDeleteQuestion(question.id)}
        >
          {/* <i className='fa-solid fa-trash' /> */}
          <img src={Delete} />
        </button>
        {!question.music ? (
          <label
            htmlFor={`music-file-input${question.id}`}
            className="w-[37px] h-[37px] flex justify-center items-center rounded-full bg-whitePlus shadow-right"
          >
            {/* <i className='text-black fa-solid fa-music' /> */}
            <img src={AddAudio} />
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
          id={`music-file-input${question.id}`}
          type="file"
          accept="audio/*"
          onChange={(e) => handleMusicFileChange(e, question.id)}
          style={{ display: "none" }}
        />
        {!question.image ? (
          <label
            htmlFor={`image-file-input${question.id}`}
            className="w-[37px] h-[37px] flex justify-center items-center rounded-full bg-whitePlus shadow-right"
          >
            {/* <i className='text-black fa-regular fa-image' /> */}
            <img src={AddImage} />
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
          style={{ display: "none" }}
        />
      </div>
    </div>
  );
}
