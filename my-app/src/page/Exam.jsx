import React from "react";
import Footer from "../components/Footer";
import Question from "../components/Question";
import Option from "../components/Option";
import Header from "../components/Header";

export default function Exam() {
  return (
    <div className="relative">
      <Header />
      <div className="flex flex-col w-full h-screen gap-[18px] justify-center items-center bg-[#FAFAFA] static">
        <Question />
        <Option />
        <Option />
        <Option />
      </div>
      <Footer />
    </div>
  );
} 