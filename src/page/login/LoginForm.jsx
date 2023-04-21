import React, { useState, useContext } from "react";
import api from "../../config";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

export default function Form() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [student, setStudent] = useState({
    noreg: "",
    token: "",
  });
  const [admin, setAdmin] = useState({
    username: "",
    password: "",
  });
  const [adminForm, setAdminForm] = useState(false);

  const handleAdminInputChange = (event) => {
    const { name, value } = event.target;
    setAdmin((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStudentInputChange = (event) => {
    const { name, value } = event.target;
    setStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    localStorage.clear();
    try {
      const studentData = await api.post("/auth/login/student", student);
      const startResponse = await api.post(
        `/students/start/${studentData.data.data.examId}`,
        {
          name: studentData.data.data.username,
          noreg: studentData.data.data.noreg,
        },
        {
          headers: {
            Authorization: `Bearer ${studentData.data.data.access_token}`,
          },
        }
      );
      if (startResponse.data.id) {
        localStorage.setItem(
          "studentId",
          JSON.stringify(startResponse.data.id)
        );
        console.log(studentData.data.data);
        Object.entries(studentData.data.data).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });
        window.location.reload();
      } else {
        throw new Error("Student not found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleLoginAdmin = (event) => {
    event.preventDefault();
    localStorage.clear();
    try {
      api.post("/auth/login/admin", admin).then((response) => {
        const admin = response.data.data;
        Object.entries(admin).forEach(([key, value]) => {
          localStorage.setItem(key, JSON.stringify(value));
        });
        setUser(response.data);
        navigate("/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
    console.log("login admin");
  };

  const toggleForm = () => {
    setAdminForm(!adminForm);
  };
  return (
    <div>
      <button
        type="button"
        className="py-4 rounded-full bg-[#ff032d] text-[#FAFAFA] font-semibold text-lg md:text-[24px] opacity-10 absolute top-0 w-2 h-2 left-390 right-0"
        onClick={() => toggleForm()}
      ></button>
      {adminForm ? (
        <form onSubmit={handleLoginAdmin}>
          <div className="max-w-[625px] text-center p-12 md:p-[60px] gap-[32px] rounded-[12px] bg-[#FAFAFA] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
            <div className="flex flex-col items-center justify-center">
              <div className="flex text-5xl md:text-[62px] font-inter font-bold ">
                <h1 className="text-[#37474F]">Welcome Admin</h1>
                <h1 className="text-[#FF6593]">!</h1>
              </div>
              <p className="font-Nunito font-normal text-lg md:text-[24px] leading-[29.05px] ">
                Let's get you started with your exams. Enter your login details
                and token to access your account.
              </p>
            </div>
            <div className="flex flex-col w-full gap-6">
              <div className="flex flex-col items-start ">
                <label htmlFor="username" className="mb-2">
                  Username
                </label>
                <input
                  name="username"
                  id="username"
                  value={admin.username}
                  onChange={handleAdminInputChange}
                  type="text"
                  placeholder="John"
                  className="w-full py-6 border-none rounded-xl shadow-lg shadow-[#00000026] font-inter font-normal text-lg md:text-[24px] pl-[22px] placeholder:text-[#37474F40]"
                />
              </div>
              <div className="flex flex-col items-start ">
                <label htmlFor="password" className="mb-2">
                  Token
                </label>
                <input
                  name="password"
                  id="password"
                  value={admin.password}
                  onChange={handleAdminInputChange}
                  type="password"
                  placeholder="********"
                  className="w-full py-6 border-none rounded-xl shadow-lg shadow-[#00000026] font-inter font-normal text-lg md:text-[24px] pl-[22px] placeholder:text-[#37474F40]"
                />
              </div>
            </div>
            <button
              type="submit"
              className="uppercase w-full py-4 rounded-full bg-[#B55FFE] text-[#FAFAFA] font-semibold text-lg md:text-[24px]"
              onClick={() => setAdminForm(true)}
            >
              Login as admin
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <div className="max-w-[625px] text-center p-12 md:p-[60px] gap-[32px] rounded-[12px] bg-[#FAFAFA] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.25)] flex flex-col justify-center items-center">
            <div className="flex flex-col items-center justify-center">
              <div className="flex text-5xl md:text-[62px] font-inter font-bold ">
                <h1 className="text-[#37474F]">Welcome</h1>
                <h1 className="text-[#FF6593]">!</h1>
              </div>
              <p className="font-Nunito font-normal text-lg md:text-[24px] leading-[29.05px] ">
                Let's get you started with your exams. Enter your login details
                and token to access your account.
              </p>
            </div>
            <div className="flex flex-col w-full gap-6">
              <div className="flex flex-col items-start ">
                <label htmlFor="noreg" className="mb-2">
                  Registration Number
                </label>
                <input
                  name="noreg"
                  id="noreg"
                  value={student.noreg}
                  onChange={handleStudentInputChange}
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
                  value={student.token}
                  onChange={handleStudentInputChange}
                  type="text"
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
      )}
    </div>
  );
}
