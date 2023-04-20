import React, { useState } from "react";
import axios from "axios";

export default function Form() {
  const [data, setData] = useState({
    noreg: "",
    token: "",
  });
  const handleChange = (e) => {
    const value = e.target.value;
    setData({
      ...data,
      [e.target.name]: value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      noreg: data.noreg,
      token: data.token,
    };
    axios
      .post(
        "https://33f10474-0db4-4900-872d-54da6bf75c67.mock.pstmn.io/api/auth/admin",
        userData
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log("server responded");
        } else if (error.request) {
          console.log("network error");
        } else {
          console.log(error);
        }
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-[625px] text-center p-12 md:p-[60px] gap-[32px] rounded-[12px] bg-[#FAFAFA] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <div className="flex text-5xl md:text-[62px] font-inter font-bold ">
            <h1 className="text-[#37474F]">Welcome</h1>
            <h1 className="text-[#FF6593]">!</h1>
          </div>
          <p className="font-Nunito font-normal text-lg md:text-[24px] leading-[29.05px] ">
            Let's get you started with your exams. Enter your login details and
            token to access your account.
          </p>
        </div>
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col items-start ">
            <label htmlFor="noreg" className="mb-2">
              Registration Number
            </label>
            <input
              name="noreg"
              value={data.noreg}
              onChange={handleChange}
              type="text"
              placeholder="S2200000"
              className="w-full py-6 border-none rounded-xl shadow-lg shadow-[#00000026] font-inter font-normal text-lg md:text-[24px] pl-[22px] placeholder:text-[#37474F40]"
            />
          </div>
          <div className="flex flex-col items-start ">
            <label htmlFor="token" className="mb-2">
              Token
            </label>
            <input
              name="token"
              value={data.token}
              onChange={handleChange}
              type="password"
              placeholder="Token"
              className="w-full py-6 border-none rounded-xl shadow-lg shadow-[#00000026] font-inter font-normal text-lg md:text-[24px] pl-[22px] placeholder:text-[#37474F40]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="uppercase w-full py-4 rounded-full bg-[#B55FFE] text-[#FAFAFA] font-semibold text-lg md:text-[24px]"
        >
          Login
        </button>
      </div>
    </form>
  );
}
