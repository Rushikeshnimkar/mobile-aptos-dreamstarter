"use client";
import DashboardNav from '@/components/common/Nav/dashboardnav.js';
import React from 'react';

const Page = () => {
  return (
    <div className='bg-[#01494f] h-screen'>
      <DashboardNav />
      <div className='h-auto sm:h-[630px]'>
        <h1 className='p-6 text-white text-2xl mb-1 font-Raleway'>Crowdfunding-Events</h1>
        <div className='flex flex-col sm:flex-row mx-8 gap-6 my-4'>
          <div className='h-auto sm:h-[400px] w-full sm:w-[350px] p-6 bg-amber-400'>
            <div className='bg-cover bg-center h-[260px] sm:h-[300px] w-full' style={{ backgroundImage: `url('/crowdfund.png')` }}></div>
            <h1 className='text-black font-raleway text-2xl font-semibold leading-normal capitalize py-4'>Your Music Collection</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
