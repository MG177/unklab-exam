import React, { useState } from "react";
import axios from "axios";

export default function Form() {
  const [data, setData] = useState({
    noreg: "",
    token: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://33f10474-0db4-4900-872d-54da6bf75c67.mock.pstmn.io/api/auth/student",
        data
      );
      console.log(response.data);
      // Perform any necessary actions upon successful login
    } catch (error) {
      console.log(error);
      // Perform any necessary actions upon failed login
    }
  };

  return (
    <form onSubmit={handleLogin}>
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
              id="noreg"
              value={data.noreg}
              onChange={handleInputChange}
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
              id="token"
              value={data.token}
              onChange={handleInputChange}
              type="number"
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
