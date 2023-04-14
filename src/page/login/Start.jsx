import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Start() {
  const [isChecked, setIsChecked] = useState(false);
  const handleChange = (event) => {
    setIsChecked((current) => !current);
  };

  const shuffleQuestion = () => {
    axios
      .post(
        "https://33f10474-0db4-4900-872d-54da6bf75c67.mock.pstmn.io/api/exam/shuffle?className=Elementary&noreg=s2200123"
      )
      .then((res) => {
        console.log("success");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="p-[54px] rounded-[12px] bg-[#FAFAFA] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.25)] flex flex-col justify-evenly items-center">
      <div className="w-[584px] h-[72px] top-[54px] left-[55.63px] flex flex-col justify-center items-center text-center">
        <div className="flex">
          <h1 className="font-bold font-Nunito text-[29px] text-black">
            Welcome to our Software Exam Test
            <span className="text-accent2">!</span>
          </h1>
        </div>
      </div>
      <div className="w-[581px] h-auto p-2 text-[14px] font-montserrat font-normal leading-[17px] flex flex-col justify-start">
        <p className="">
          Before taking the test, please carefully read and agree to the
          following terms and conditions:
        </p>
        <br />
        <p className="">
          1. Test Format: The test will consist of multiple-choice questions
          with some media like image and audio
        </p>
        <p>
          2. Test Rules: You must adhere to the following rules while taking the
          test:
        </p>
        <ol>
          <li>
            -You must not cheat or use any unauthorized resources during the
            test.
          </li>
          <li>
            -You must not share any information about the test or its contents
            with anyone else.
          </li>
          <li>
            -You must not attempt to record, copy, or reproduce any part of the
            test.
          </li>
          <li>
            -You must not disrupt or interfere with the testing environment or
            other test-takers.
          </li>
        </ol>
        <p>
          3. Test Results: Your test results will be provided to you immediately
          after completing the test, unless otherwise specified.
        </p>
        <p>
          4. Intellectual Property: All intellectual property related to the
          test, including but not limited to the test questions, coding
          exercises, and any accompanying materials, are the property of the
          test provider and may not be reproduced, distributed, or used without
          permission.
        </p>
        <p>
          By taking the test, you agree to be bound by these terms and
          conditions. If you do not agree to these terms and conditions, you may
          not take the test.
        </p>
      </div>
      <div className="flex flex-col items-center">
        <form action="" className="flex gap-1">
          <input
            type="checkbox"
            id="agree"
            name="agreement"
            value={isChecked}
            onChange={handleChange}
            className="w-[17.91px] h-[17.91px] rounded-full"
          />
          <label
            for="agree"
            className="font-montserrat font-bold text-[14px] leading-[17.07px] text-black"
          >
            I agree to the Software Exam Test terms and conditions.
          </label>
        </form>
        <Link>
          <button
            onClick={shuffleQuestion}
            disabled={!isChecked}
            className="mt-[14.5px] font-Nunito font-bold text-2xl py-[14px] px-[211px] rounded-[34px] disabled:text-black disabled:bg-[#E0E0E0] enabled:text-white enabled:bg-accent1"
          >
            START
          </button>
        </Link>
      </div>
    </div>
  );
}
