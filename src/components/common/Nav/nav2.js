import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useKeylessAccounts } from "@/libs/useKeylessAccounts";
import useAptos from "@/context/useAptos";
import axios from "axios";

const Nav2 = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    {
      title: "Launch",
      subItems: [
        { title: "Create Proposal", path: "/launch/create-proposal" },
        { title: "Convert Proposal", path: "/launch/convert-proposal" },
      ],
    },
    {
      title: "Explore",
      subItems: [
        { title: "Ongoing Proposals", path: "/explore/ongoing-proposals" },
        { title: "Crowdfunding Events", path: "/explore/crowdfunding-events" },
      ],
    },
  ];

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

  return (
    <div className="px-6 py-4 shadow-sm flex justify-between items-center  bg-transparent text-white">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="hidden md:flex gap-4 items-center">
          {navLinks.map((navItem) => (
            <div
              key={navItem.title}
              className="relative cursor-pointer"
              onMouseEnter={() => setActiveDropdown(navItem.title)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              {navItem.title}
              {navItem.subItems && (
                <div
                  className={`absolute left-0 w-48 py-2 px-2 rounded-md shadow-xl bg-gray-800 ${
                    activeDropdown === navItem.title ? "block" : "hidden"
                  }`}
                >
                  {navItem.subItems.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.path}
                      className="block px-4 py-2 text-sm hover:bg-gray-700 rounded-md"
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="/community/create-community" className="hover:text-gray-400">
            Community
          </Link>
          <Link href="/dashboard/crowdfunding-events" className="hover:text-gray-400">
            Dashboard
          </Link>
        </div>
      </div>
      {wallet && (
        <button
          onClick={handleDeleteCookie}
          className="bg-white text-black px-3 py-2 rounded-xl hover:bg-gray-200"
        >
          Logout
        </button>
      )}
      {!wallet && !activeAccount && (
        <button
          className="bg-black text-white border border-white px-3 py-2 rounded-full hover:bg-gray-700"
          onClick={() => setloginbox(true)}
        >
          Login Now
        </button>
      )}
      {loginbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-black text-white rounded-lg shadow-lg overflow-hidden w-full max-w-md">
            <div className="flex justify-end p-2">
              <button
                onClick={() => setloginbox(false)}
                className="text-white hover:text-gray-400"
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
            <div className="p-4 text-center">
              <h2 className="text-2xl font-bold mb-4">Login Options</h2>
              <button
                className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
                onClick={connectWallet}
              >
                Connect with Petra
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden absolute top-16 left-0 right-0 bg-black text-white z-50`}
      >
        {navLinks.map((navItem) => (
          <div key={navItem.title} className="border-b border-gray-700">
            <div
              className="cursor-pointer px-4 py-2"
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === navItem.title ? null : navItem.title
                )
              }
            >
              {navItem.title}
            </div>
            {navItem.subItems && activeDropdown === navItem.title && (
              <div className="bg-gray-800">
                {navItem.subItems.map((subItem) => (
                  <Link
                    key={subItem.title}
                    href={subItem.path}
                    className="block px-4 py-2 text-sm hover:bg-gray-700"
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <Link
          href="/community/create-community"
          className="block px-4 py-2 border-b border-gray-700 hover:bg-gray-700"
        >
          Community
        </Link>
        <Link
          href="/dashboard/crowdfunding-events"
          className="block px-4 py-2 border-b border-gray-700 hover:bg-gray-700"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Nav2;
