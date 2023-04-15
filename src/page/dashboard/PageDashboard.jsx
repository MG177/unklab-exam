import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import QuestionEditor from '../../components/dashboard/QuestionEditor';
import classHeader from '../../image/class-header.svg';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from './ProductService';

export default function PageDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    ProductService.getProductsMini().then((data) => setProducts(data));
  }, []);
  return (
    <div className='flex '>
      <Sidebar />
      <div className='container p-4 w-full bg-[#FCF9FF] flex-1'>
        <div className='mb-12'>
          <div className='flex justify-start relative'>
            <img
              src={classHeader}
              alt=''
              className='absolute top-0 left-0 -z-0 w-full h-full object-cover rounded-2xl'
            />
            <h1 className='z-10 text-[60px] max-w-xl font-Nunito p-4 text-white font-bold leading-tight'>
              Business English Communication
            </h1>
            <div className='z-10 font-Nunito absolute right-4 bottom-4 flex gap-2 text-accent1'>
              <button className='py-2 px-4 bg-white rounded-2xl font-bold text-2xl'>
                <i className='fa-solid fa-bars ' />
              </button>
              <button className='py-2 px-4 bg-white rounded-2xl font-bold text-2xl'>
                Click here to start
              </button>
            </div>
          </div>
        </div>
        <div class='mb-3 bg-white shadow-md rounded-lg'>
          <div class='relative mb-4 flex flex-row-reverse w-full flex-wrap items-stretch'>
            <input
              type='search'
              class='relative m-0 block w-[1px] min-w-0 flex-auto rounded border-none text-base font-normal leading-[1.6] text-black outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:text-neutral-200 dark:placeholder:text-black dark:focus:border-primary'
              placeholder='Search'
              aria-label='Search'
              aria-describedby='button-addon2'
            />
            <span
              class='input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-black dark:text-neutral-200'
              id='basic-addon2'>
              <i className='fa-solid fa-magnifying-glass text-black' />
            </span>
          </div>
        </div>
        <div>
          <DataTable value={products} className='shadow-md'>
            <Column field='code' header='Code'></Column>
            <Column field='name' header='Name'></Column>
            <Column field='category' header='Category'></Column>
            <Column field='quantity' header='Quantity'></Column>
          </DataTable>
        </div>
      </div>
      <QuestionEditor />
    </div>
  );
}
