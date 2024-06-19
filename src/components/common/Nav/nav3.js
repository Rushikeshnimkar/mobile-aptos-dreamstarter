import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useKeylessAccounts } from "@/libs/useKeylessAccounts";
import useAptos from "@/context/useAptos";
import axios from "axios";

const Nav3 = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
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
        {
          title: "Crowdfunding Events",
          path: "/explore/crowdfunding-events",
        },
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
    <div className="px-6 py-4 shadow-sm flex justify-between items-center z-20 bg-[#0F4C81]">
      <div className="flex gap-2 items-center">
        <div className="text-2xl">
          <img src="/nav.png" alt="" width="30px" height="10px" />
        </div>
        <div className="text-white text-xl font-semibold">
          <a href="/">Dreamstarter</a>
        </div>
      </div>

      <div className="hidden md:flex gap-4 items-center text-white z-20">
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
                className={`absolute left-0 w-48 py-2 px-2 rounded-md shadow-xl z-20 bg-[#32313199] ${
                  activeDropdown === navItem.title ? "block" : "hidden"
                }`}
              >
                {navItem.subItems.map((subItem) => (
                  <Link
                    key={subItem.title}
                    href={subItem.path}
                    className="block px-4 z-20 text-white py-2 text-sm hover:bg-blue-50 hover:text-blue-500 rounded-md"
                  >
                    {subItem.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        <a href="/community/create-community">Community</a>
        <a href="/dashboard/crowdfunding-events">Dashboard</a>
        {wallet && (
          <button
            onClick={handleDeleteCookie}
            className="bg-white p-2 px-3 text-black hover:bg-sky-500 rounded-xl"
          >
            Logout
          </button>
        )}
        {!wallet && !activeAccount && (
          <button
            style={{
              color: "black",
              borderRadius: "9999px",
              border: "1.5px solid black",
            }}
            className="bg-white p-2 text-black hover:bg-sky-500 {`btn-login ${provider}`}"
            onClick={() => {
              setloginbox(true);
            }}
          >
            Login Now
          </button>
        )}
      </div>
      <div className="md:hidden">
        <button
          className="text-white focus:outline-none"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
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
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
      {showMobileMenu && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#0F4C81] z-20">
          {navLinks.map((navItem) => (
            <div key={navItem.title} className="relative cursor-pointer border-b border-white">
              <div
                className="py-4 px-6 text-white"
                onClick={() =>
                  setActiveDropdown(activeDropdown === navItem.title ? null : navItem.title)
                }
              >
                {navItem.title}
              </div>
              {navItem.subItems && activeDropdown === navItem.title && (
                <div className="px-4 py-2 bg-[#32313199]">
                  {navItem.subItems.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.path}
                      className="block px-4 py-2 text-white hover:bg-blue-50 hover:text-blue-500 rounded-md"
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a href="/community/create-community" className="block py-4 px-6 text-white border-b border-white">Community</a>
          <a href="/dashboard/crowdfunding-events" className="block py-4 px-6 text-white border-b border-white">Dashboard</a>
          {wallet && (
            <button
              onClick={handleDeleteCookie}
              className="block w-full text-left py-4 px-6 text-black bg-white hover:bg-sky-500 rounded-none"
            >
              Logout
            </button>
          )}
          {!wallet && !activeAccount && (
            <button
              style={{
                color: "black",
                borderRadius: "9999px",
                border: "1.5px solid black",
              }}
              className="block w-full text-left py-4 px-6 text-black bg-white hover:bg-sky-500"
              onClick={() => {
                setloginbox(true);
              }}
            >
              Login Now
            </button>
          )}
        </div>
      )}
      {loginbox && (
        <div
          style={{ backgroundColor: "#222944E5" }}
          className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
          id="popupmodal"
        >
          <div className="relative p-4 lg:w-1/3 w-full max-w-2xl max-h-full">
            <div className="relative rounded-3xl shadow bg-black text-white">
              <div className="flex items-center justify-end p-4 md:p-5 rounded-t dark:border-gray-600">
                <button
                  onClick={() => setloginbox(false)}
                  type="button"
                  className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 space-y-4">
                <p
                  className="text-3xl text-center font-bold"
                  style={{ color: "#E8C6AA" }}
                >
                  Login Options
                </p>
              </div>
              <div className="flex justify-center p-4 pb-10">
                <button
                  className="text-black px-6 py-2 bg-white"
                  style={{ borderRadius: "10px" }}
                  onClick={connectWallet}
                >
                  Connect with Petra
                </button>
              </div>
              {/* <div className="flex justify-center p-4 pb-20">
                  <div
                    className="text-black px-8 py-2 bg-white"
                    style={{ borderRadius: "10px" }}
                  >
                    <Link href={"/login"}>Login with google</Link>
                  </div>
                </div> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nav3;
