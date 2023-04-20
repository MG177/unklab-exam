import React, { useState, useEffect } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import QuestionEditor from "../../components/dashboard/QuestionEditor";
import classHeader from "../../image/class-header.svg";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "./ProductService";

export default function PageDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    ProductService.getProductsMini().then((data) => setProducts(data));
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    ProductService.getProductsMini().then((data) => {
      const filteredProducts = data.filter((product) => {
        return (
          product.name.toLowerCase().includes(query) ||
          product.code.toLowerCase().includes(query)
        );
      });
      setProducts(filteredProducts);
    });
  };

  return (
    <div className="relative flex w-full">
      <Sidebar />
      <div className="container p-4 w-full bg-[#FCF9FF] flex-1">
        <div className="mb-12">
          <div className="relative flex justify-start">
            <img
              src={classHeader}
              alt=""
              className="absolute top-0 left-0 object-cover w-full h-full -z-0 rounded-2xl"
            />
            <h1 className="z-10 text-[60px] max-w-xl font-Nunito p-4 text-white font-bold leading-tight">
              Business English Communication
            </h1>
            <div className="absolute z-10 flex gap-2 font-Nunito right-4 bottom-4 text-accent1">
              <button className="px-4 py-2 text-2xl font-bold bg-white rounded-2xl">
                <i className="fa-solid fa-bars " />
              </button>
              <button className="px-4 py-2 text-2xl font-bold bg-white rounded-2xl">
                Click here to start
              </button>
            </div>
          </div>
        </div>
        <div className="mb-3 bg-white rounded-lg shadow-md">
          <div className="relative flex flex-row-reverse flex-wrap items-stretch w-full mb-4">
            <input
              type="search"
              className="relative m-0 block w-[1px] min-w-0 flex-auto rounded border-none text-base font-normal leading-[1.6] text-black outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:text-neutral-200 dark:placeholder:text-black dark:focus:border-primary"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="button-addon2"
              onChange={handleSearch}
            />
            <span
              className="input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-black dark:text-neutral-200"
              id="basic-addon2"
            >
              <i className="text-black fa-solid fa-magnifying-glass" />
            </span>
          </div>
        </div>
        <div>
          <DataTable value={products} className="shadow-md">
            <Column field="noreg" header="Nomor registrasi"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="grade" header="Grade"></Column>
            <Column field="totalScore" header="Total Score"></Column>
            <Column field="vocab" header="Vocab"></Column>
            <Column field="reading" header="Reading"></Column>
            <Column field="listening" header="Listening"></Column>
            <Column field="status" header="Status"></Column>
            <Column field="reset" header="Reset"></Column>
          </DataTable>
        </div>
      </div>
      <QuestionEditor />
    </div>
  );
}
