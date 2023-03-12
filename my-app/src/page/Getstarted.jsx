import React from "react";

export default function Login() {
  return (
    <body className="w-[1440px] h-[1060px] -top-[5px] bg-[url('./image/Background.svg')] bg-no-repeat flex justify-center items-center">
      <div className=" text-center w-[695.27px] h-[651.92px] top-[188.54px] left-[372.37px] px-[84px] gap-[31px] rounded-[12px] bg-[#FAFAFA] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.25)] flex flex-col justify-evenly items-center">
        <div className="w-[584px] h-[72px] top-[54px] left-[55.63px] font-montserrat text-[24px] leading-[24px] flex flex-col justify-center items-center">
          <div className="flex">
            <h1 className="font-bold">Welcome to our Software Exam Test!</h1>
            <h1 className="text-[#FF6593]">!</h1>
          </div>
          <p className="font-normal">
            Before taking the test, please carefully read and agree to the
            following terms and conditions:
          </p>
        </div>
        <div className="w-[581px] h-[296px] border-[#37474F] border-[2px] p-2 text-[14px] font-montserrat font-normal leading-[18.54px] ">
          <p className="">
            1. Test Format: The test will consist of multiple-choice questions
          </p>
          <p>
            2. Test Rules: You must adhere to the following rules while taking
            the test:
          </p>
          <ul>
            <li>
              You must not cheat or use any unauthorized resources during the
              test.
            </li>
            <li>
              You must not share any information about the test or its contents
              with anyone else.
            </li>
            <li>
              You must not attempt to record, copy, or reproduce any part of the
              test.
            </li>
            <li>
              You must not disrupt or interfere with the testing environment or
              other test-takers.
            </li>
          </ul>
          <p>
            3. Test Results: Your test results will be provided to you
            immediately after completing the test, unless otherwise specified.
          </p>
          <p>
            4. Intellectual Property: All intellectual property related to the
            test, including but not limited to the test questions, coding
            exercises, and any accompanying materials, are the property of the
            test provider and may not be reproduced, distributed, or used
            without permission.
          </p>
          <p>
            By taking the test, you agree to be bound by these terms and
            conditions. If you do not agree to these terms and conditions, you
            may not take the test.
          </p>
        </div>
        <div>
          <form action="">
            <input
              type="checkbox"
              id="agree"
              name="agreement"
              value="Agree"
              className="w-17.91px] h-[17.91px] rounded-full"
            />

            <label
              for="agree"
              className="font-montserrat font-normal text-[14px] leading-[17.07px] text-[#37474F] border-[1px] border-[#FFFFFF] box-border"
            >
              I agree to the Software Exam Test terms and conditions.
            </label>
          </form>
          <button className="w-[304px] h-[49px] rounded-[25px] py-[10px] bg-[#B55FFE] font-inter font-semibold text-[24px] leading-[29.05px] text-center text-[#FAFAFA]">
            START
          </button>
        </div>
      </div>
    </body>
  );
}
