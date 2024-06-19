import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useKeylessAccounts } from "@/libs/useKeylessAccounts";
import useAptos from "@/context/useAptos";
import axios from "axios";

const DashboardNav = () => {
  const wallet = Cookies.get("dream_starter_wallet");

  const { aptos, moduleAddress } = useAptos();

  const { activeAccount } = useKeylessAccounts();
  console.log("activeAccount", activeAccount);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [loginBox, setLoginBox] = useState(false);
  const [balance, setBalance] = useState(null);
  const [faucetTrigger, setFaucetTrigger] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        const senderBalance = await aptos.getAccountAPTAmount(
          activeAccount.accountAddress
        );
        console.log("Sender balance:", senderBalance);
        setBalance(senderBalance);
        setFaucetTrigger(false);
      } catch (error) {
        console.error("Error fetching balance:", error.message);
      }
    };

    if (activeAccount) {
      fetchBalance();
    }
  }, [activeAccount, aptos, faucetTrigger]);

  const faucetApt = async () => {
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

  const signMessage = async () => {
    try {
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

      console.log(
        "Transaction submitted successfully:",
        committedTransactionResponse
      );
    } catch (error) {
      console.error("Error signing and submitting transaction:", error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-blue-900 px-4 py-2 md:px-6 md:py-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img src="/nav.png" alt="" className="w-8 h-8 mr-2" />
          <div className="text-white text-lg font-semibold">
            <a href="/">Dreamstarter</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-4 text-white">
            <a href="/dashboard/crowdfunding-events">Crowdfunding Events</a>
            <a href="/dashboard/started-events">Started Events</a>
            <a href="/dashboard/yourpoaps">Your Poaps</a>
          </div>

          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="flex flex-col items-center mt-4 md:hidden">
          <a
            href="/dashboard/crowdfunding-events"
            className="text-white hover:text-blue-500 mb-2"
          >
            Crowdfunding Events
          </a>
          <a
            href="/dashboard/started-events"
            className="text-white hover:text-blue-500 mb-2"
          >
            Started Events
          </a>
          <a
            href="/dashboard/yourpoaps"
            className="text-white hover:text-blue-500 mb-2"
          >
            Your Poaps
          </a>

          {!wallet && !activeAccount && (
            <button
              className="bg-white text-black py-2 px-4 mt-4 rounded-lg"
              onClick={() => setLoginBox(true)}
            >
              Login Now
            </button>
          )}
        </div>
      )}

      {loginBox && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-sm mx-auto">
            <div className="flex justify-end">
              <button
                className="text-gray-400 hover:text-gray-800 focus:outline-none"
                onClick={() => setLoginBox(false)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-4">
              <p className="text-xl font-semibold mb-4">Login Options</p>
              <button
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                onClick={connectWallet}
              >
                Connect with Petra
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default DashboardNav;
