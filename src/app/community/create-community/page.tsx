"use client"
import React from 'react';
import Nav3 from '@/components/common/Nav/nav3.js'; // Assuming this is the correct path

const Page = () => {
  return (
    <div>
      <Nav3 />
      <div className="bg-cover bg-center"
        style={{
          backgroundImage: `url('/communityback.png')`,
          minHeight: '100vh',
          padding: '20px',
          boxSizing: 'border-box',
        }}
      >
        <div className="max-w-4xl mx-auto bg-blue-200 bg-opacity-80 backdrop-blur-md rounded-lg p-8">
          <div className="flex flex-col md:flex-row items-center justify-center md:space-x-8">
            <div className="bg-cover bg-center w-full md:w-1/2 h-80 md:h-96 rounded-lg mb-8 md:mb-0"
              style={{ backgroundImage: `url('/luffy.png')` }}
            ></div>
            <div className="text-center md:text-left md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold font-space-mono leading-tight mb-4 text-white">
                Start your own <br />voyage in web 3
              </h1>
              <p className="text-lg md:text-xl font-normal leading-relaxed mb-8 text-white">
                Explore Dapp with contribution and bounties.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <button className="text-base font-normal leading-6 rounded-lg bg-blue-800 text-yellow-400 px-4 py-2 shadow-lg backdrop-blur-sm hover:bg-blue-900 transition duration-300">
                  Meet new friends
                </button>
                <button className="text-base font-normal leading-6 rounded-lg bg-blue-800 text-yellow-400 px-4 py-2 shadow-lg backdrop-blur-sm hover:bg-blue-900 transition duration-300">
                  Earn rewards
                </button>
                <button className="text-base font-normal leading-6 rounded-lg bg-blue-800 text-yellow-400 px-4 py-2 shadow-lg backdrop-blur-sm hover:bg-blue-900 transition duration-300">
                  Collect NFTs
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mt-8 md:flex-row md:items-stretch md:justify-center md:mt-12 gap-6">
          <div className="bg-cover bg-center w-full md:w-1/3 h-80 md:h-96 rounded-lg"
            style={{ backgroundImage: `url('/luffy2.png')` }}
          ></div>
          <div className="bg-cover bg-center w-full md:w-1/3 h-80 md:h-96 rounded-lg"
            style={{ backgroundImage: `url('/game1.png')` }}
          ></div>
          <div className="bg-cover bg-center w-full md:w-1/3 h-80 md:h-96 rounded-lg"
            style={{ backgroundImage: `url('/game2.png')` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Page;
