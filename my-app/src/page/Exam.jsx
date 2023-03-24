import React from "react";
import Footer from "../components/Footer";
import Question from "../components/Question";
import Option from "../components/Option";
import Header from "../components/Header";

export default function Exam() {
  return (
    <body className="relative">
      <Header />
      <div className="flex flex-col w-[1920px] h-screen gap-[33px] justify-center items-center mt-[106px] bg-[#FAFAFA]">
        <Question />
        <Option />
        <Option />
        <Option />
        <Option />
      </div>
      <Footer />
    </body>
  );
}
