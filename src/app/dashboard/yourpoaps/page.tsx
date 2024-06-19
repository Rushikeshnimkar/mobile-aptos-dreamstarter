"use client"
import DashboardNav from '@/components/common/Nav/dashboardnav.js';
import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const Page = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState<number>(0);
    const [review, setReview] = useState<string>("");

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmitFeedback = () => {
        console.log("Rating:", rating);
        console.log("Review:", review);
        closeModal();
    };

    return (
        <div className='bg-[#01494f] h-screen'>
            <DashboardNav />
            <div className='h-[630px]' >
                <h1 className='p-6 text-white text-2xl mb-1 font-Raleway'>Your Poaps</h1>
                <div className='flex mx-8 gap-6 my-4'>
                    <div className='h-[400px] w-[350px] p-6 bg-amber-400'>
                        <div className='' style={{
                            backgroundImage: `url('/nft.png')`, backgroundSize: 'cover',
                            height: '260px',
                            width: '300px',
                        }}>
                        </div>
                        <h1 className='text-black font-raleway text-2xl font-semibold leading-normal capitalize py-4'>Your Game Collections</h1>
                        <div>
                            <button
                                className='block mx-auto px-4 py-2 bg-blue-800 text-white rounded-lg mt-2'
                                onClick={openModal}
                            >
                                Claim and review
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#202020e4] p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-white"
                                    >
                                        Feedback Form
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <div className="flex items-center">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg
                                                    key={star}
                                                    onClick={() => setRating(star)}
                                                    className={`h-6 w-6 cursor-pointer ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M9.049 2.927C9.37 2.261 10.63 2.261 10.951 2.927l1.286 2.639 2.907.423c.687.1.963.947.466 1.42l-2.105 2.05.497 2.894c.118.686-.604 1.21-1.227.887L10 12.347l-2.595 1.365c-.623.324-1.345-.201-1.227-.887l.497-2.894-2.105-2.05c-.497-.473-.22-1.32.466-1.42l2.907-.423L9.049 2.927z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <textarea
                                            className="mt-4 w-full bg-[#4d4d4d99] text-white p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            rows={4}
                                            placeholder="Write your review here..."
                                            value={review}
                                            onChange={(e) => setReview(e.target.value)}
                                        />
                                    </div>

                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={handleSubmitFeedback}
                                        >
                                            Submit and Mint Poaps
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}

export default Page;
