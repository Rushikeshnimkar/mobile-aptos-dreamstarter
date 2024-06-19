"use client";

import { FaDiscord, FaXTwitter } from "react-icons/fa6";
import Cookies from "js-cookie";
import { BsTelegram } from "react-icons/bs";
import Nav from "@/components/common/Nav";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useKeylessAccounts } from "@/libs/useKeylessAccounts";
import { collapseAddress } from "@/libs/collapseAddress";
import useAptos from "@/context/useAptos";
import { Account, SimpleTransaction } from "@aptos-labs/ts-sdk";
import GoogleLogo from "../components/GoogleLogo";
import axios from "axios";

export default function Home() {
  const wallet = Cookies.get("dream_starter_wallet");

  const { aptos, moduleAddress } = useAptos();

  const { activeAccount, disconnectKeylessAccount } = useKeylessAccounts();
  console.log("activeAccount", activeAccount);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [loginbox, setloginbox] = useState(false);
  const [accountdetails, setaccountdetails] = useState(true);
  const [balance, setbalance] = useState(null);
  const [faucetTrigger, setFaucetTrigger] = useState(false);

  const getAptosWallet = () => {
    if ("aptos" in window) {
      return window.aptos;
    } else {
      window.open("https://petra.app/", "_blank");
    }
  };

  const connectWallet = async () => {
    const aptosWallet = getAptosWallet();
    try {
      const response = await aptosWallet.connect();
      console.log(response); // { address: string, publicKey: string }
      // Check the connected network
      const network = await aptosWallet.network();
      if (network === "Testnet") {
        // signing message
        const payload = {
          message: "Hello! from dream starter",
          nonce: Math.random().toString(16),
        };
        const res = await aptosWallet.signMessage(payload);
        // signing message

        Cookies.set("dream_starter_wallet", response.address, { expires: 7 });
        window.location.reload();
      } else {
        alert(`Switch to Testnet in your Petra wallet`);
      }
    } catch (error) {
      console.error(error); // { code: 4001, message: "User rejected the request."}
    }
  };

  const handleDeleteCookie = () => {
    Cookies.remove("dream_starter_wallet");
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getRandomNumber = () => Math.floor(Math.random() * 1000);
        const apiUrl = `https://api.multiavatar.com/${getRandomNumber()}`;

        const response = await axios.get(apiUrl);
        const svgDataUri = `data:image/svg+xml,${encodeURIComponent(
          response.data
        )}`;
        setAvatarUrl(svgDataUri);
      } catch (error) {
        console.error("Error fetching avatar:", error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const getAccountAPTAmount = async (accountAddress) => {
          const amount = await aptos.getAccountAPTAmount({
            accountAddress,
          });
          return amount;
        };

        const senderBalance = await getAccountAPTAmount(
          activeAccount.accountAddress
        );
        console.log("Sender balance:", senderBalance);
        setbalance(senderBalance);
        setFaucetTrigger(false);
      } catch (error) {
        console.error("Error fetching balance:", error.message);
      }
    };

    fetchBalance();
  }, [activeAccount, faucetTrigger]);

  const faucetapt = async () => {
    try {
      await aptos.fundAccount({
        accountAddress: activeAccount.accountAddress,
        amount: 100_000_000,
      });
      // After faucet, set the faucetTrigger to true to re-run useEffect
      setFaucetTrigger(true);
    } catch (error) {
      console.error("Error funding account:", error.message);
    }
  };

  const signmessage = async () => {
    try {
      // ----------------------------------------------------- for faucet account and transfer transaction ----------------------------------------

      // const balance = async (
      //   name,
      //   accountAddress,
      //  ) => {
      //   const amount = await aptos.getAccountAPTAmount({
      //     accountAddress,
      //   });
      //   console.log(`${name}'s balance is: ${amount}`);
      //   return amount;
      // };

      //   const bob = Account.generate();

      //   await aptos.fundAccount({
      //     accountAddress: activeAccount.accountAddress,
      //     amount: 100_000_000,
      //   });

      // const transaction = await aptos.transferCoinTransaction({
      //     sender: activeAccount.accountAddress,
      //     recipient: bob.accountAddress,
      //     amount: 100_100_100,
      // });

      // ------------------------------------------------------- smart contract fucntion transaction --------------------------------

      const transaction = await aptos.transaction.build.simple({
        sender: activeAccount.accountAddress,
        data: {
          function: `0x973d0f394a028c4fc74e069851114509e78aba9e91f52d000df2d7e40ec5205b::tarot::draws_card`,
          functionArguments: [],
        },
      });

      const committedTxn = await aptos.signAndSubmitTransaction({
        signer: activeAccount,
        transaction: transaction,
      });

      const committedTransactionResponse = await aptos.waitForTransaction({
        transactionHash: committedTxn.hash,
      });

      // const senderBalance = await balance("Alice", activeAccount.accountAddress);
      // const recieverBalance = await balance("Bob", bob.accountAddress);

      console.log(
        "Transaction submitted successfully:",
        committedTransactionResponse
      );
    } catch (error) {
      console.error("Error signing and submitting transaction:", error);
    }
  };

  return (
    <>
      <div className="bg-[#101010] min-h-screen flex flex-col">
        <main
          className="flex flex-col lg:flex-row bg-cover bg-center h-full lg:h-[710px]"
          style={{
            backgroundImage: `url('/home.png')`,
          }}
        >
          <div className="flex flex-col justify-center items-start p-10 lg:p-20 w-full lg:w-1/2">
            {wallet ? (
              <button
                onClick={handleDeleteCookie}
                className="bg-[#9999] p-2 px-3 hover:bg-sky-500 rounded-xl mb-6"
              >
                Logout
              </button>
            ) : (
              !activeAccount && (
                <button
                  className="bg-[#9999] p-2 px-3 text-white border border-white rounded-full hover:bg-sky-500 mb-6"
                  onClick={() => setloginbox(true)}
                >
                  Login Now
                </button>
              )
            )}
            <div className="bg-[#01494f] p-8 rounded-lg w-full">
              <Nav />
              <div className="mt-10">
                <div className="flex flex-wrap gap-4">
                  {["Innovate.", "Funds.", "Build.", "Collaborate."].map((text, idx) => (
                    <div key={idx} className="border border-white rounded-full p-2">
                      <h1 className="text-white font-raleway font-medium text-5xl">{text}</h1>
                    </div>
                  ))}
                </div>
                <h1 className="mt-8 text-white font-raleway font-medium text-lg">
                  Crowdfund Your Next Big Event with Us
                </h1>
                {!wallet && !activeAccount && (
                  <button
                    className="bg-[#9999] p-2 px-3 text-white border border-white rounded-full hover:bg-sky-500 mt-6"
                    onClick={() => setloginbox(true)}
                  >
                    Login Now
                  </button>
                )}
                <h1 className="mt-10 text-white font-raleway font-medium text-xl">
                  Where Dreams Meet Reality
                </h1>
              </div>
            </div>
          </div>
        </main>

        <div className="flex flex-col lg:flex-row justify-center items-center p-10 lg:p-36 bg-[#101010]">
          <h1 className="text-white font-raleway font-medium text-5xl text-center leading-tight lg:leading-none">
            We help local Communities to <span className="text-purple-600">Crowdfund</span> <br />
            and <span className="text-purple-600">Launch</span> Events Successfully
          </h1>
        </div>

        <div className="flex flex-wrap justify-center gap-10 mx-10 lg:mx-28">
          {[
            {
              image: "/build.png",
              title: "1.Build Your Community",
              text: "Shape a digital community where you and like-minded individuals govern together.",
            },
            {
              image: "/plan.png",
              title: "2.Plan your Events",
              text: "Easily organize events with a seamless process to ensure all steps are covered.",
            },
            {
              image: "/create.png",
              title: "3.Create Fundraiser",
              text: "Generate the necessary funds for your event with our efficient platform.",
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl w-72 lg:w-96 shadow-lg">
              <div className="flex justify-center">
                <img src={item.image} alt={item.title} className="w-28 h-28" />
              </div>
              <h1 className="text-2xl font-raleway text-center mt-5">{item.title}</h1>
              <h1 className="text-center mt-4">{item.text}</h1>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-20 bg-[#101010] py-20">
          <h1 className="text-white font-raleway font-medium text-5xl text-center lg:text-left">
            All the Tools You Need to Make it Happen
          </h1>
        </div>

        <div className="flex flex-wrap justify-center gap-10 mx-10 lg:mx-28 mb-20">
          {[
            {
              icon: <FaDiscord className="text-6xl" />,
              title: "Join our Discord Community",
              text: "Connect with like-minded individuals and share ideas.",
              link: "#",
            },
            {
              icon: <FaXTwitter className="text-6xl" />,
              title: "Follow us on Twitter",
              text: "Stay updated with our latest news and updates.",
              link: "#",
            },
            {
              icon: <BsTelegram className="text-6xl" />,
              title: "Join our Telegram Channel",
              text: "Engage with our community in real-time.",
              link: "#",
            },
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              className="bg-white p-5 rounded-xl w-72 lg:w-96 shadow-lg text-center hover:bg-gray-200 transition-all duration-300"
            >
              <div className="flex justify-center">{item.icon}</div>
              <h1 className="text-2xl font-raleway mt-5">{item.title}</h1>
              <h1 className="mt-4">{item.text}</h1>
            </a>
          ))}
        </div>

        <footer className="bg-[#101010] text-white py-10 text-center">
          <h1 className="text-sm">
            &copy; 2023 Dream Starter. All rights reserved.
          </h1>
        </footer>
      </div>

      {loginbox && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-80">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-raleway">Login</h2>
              <button
                onClick={() => setloginbox(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                &times;
              </button>
            </div>
            <div className="mt-4">
              <button
                onClick={connectWallet}
                className="bg-black text-white p-2 px-4 rounded-md w-full hover:bg-gray-800"
              >
                Connect Wallet
              </button>
            </div>
            <div className="mt-4 flex justify-center">
              <GoogleLogo />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
