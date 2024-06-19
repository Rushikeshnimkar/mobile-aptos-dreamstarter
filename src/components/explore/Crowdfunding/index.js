"use client";

import { useProposal } from "@/ContextProviders/ProposalProvider";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import notFound from "@/components/Empty/notFound.json";
import Button from "@/components/common/Button";
import Nav3 from "@/components/common/Nav/nav3.js";
import Cookies from "js-cookie";
import { useKeylessAccounts } from "@/libs/useKeylessAccounts";
import useAptos from "@/context/useAptos";
import { Account, SimpleTransaction } from "@aptos-labs/ts-sdk";
import axios from "axios";

import React, { FC } from "react";
import { useSelectedLayoutSegment } from "next/navigation";

const Crowdfunding = () => {
  const [mintingDone, setMintingDone] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isStaked, setIsStaked] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  // ------------------------
  const [isLoading, setIsLoading] = useState(true);
  const [crowdFundingGoal, setCrowdFundingGoal] = useState(null);
  const [totalFunding, setTotalFunding] = useState(null);
  const [connectedNetwork, setConnectedNetwork] = useState(null);
  const [isCreatorAlreadyStaked, setIsCreatorAlreadyStaked] = useState(false);

  const { proposal } = useProposal();

  const wallet = Cookies.get("dream_starter_wallet");

  useEffect(() => {
    setIsLoading(false);
  }, []);

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

        Cookies.set("dream_starter_wallet", response.address, {
          expires: 7,
        });
        window.location.reload();
      } else {
        alert(`Switch to Testnet in your Petra wallet`);
      }
    } catch (error) {
      console.error(error); // { code: 4001, message: "User rejected the request."}
    }
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

  async function handleStake() {
    setIsStaking(true);
    try {
      const stake = {
        type: "entry_function_payload",
        function:
          "0x752d1c37fe7060e599af08f584b6ba0aa989ac163f83424622592f714a8df2e7::nft::stake",
        type_arguments: [],
        arguments: [],
      };
      const stakeResponse = await window.aptos.signAndSubmitTransaction(stake);
      console.log("stake Response:", stakeResponse);
    } catch (error) {
      console.error("Error handling draw card and fetching rap:", error);
    } finally {
    }
    setIsStaked(true);
  }

  async function handleMint() {
    setIsMinting(true);
    try {
      const mintCollection = {
        type: "entry_function_payload",
        function:
          "0x752d1c37fe7060e599af08f584b6ba0aa989ac163f83424622592f714a8df2e7::nft::user_mint",
        type_arguments: [],
        arguments: [],
      };

      const mintResponse = await window.aptos.signAndSubmitTransaction(
        mintCollection
      );
      console.log("mint Response:", mintResponse);
    } catch (error) {
      console.error("Error handling draw card and fetching rap:", error);
    } finally {
      // setLoading(false);
    }
    setMintingDone(true);
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!proposal)
    return (
      <div>
        <Nav3 />
        <div className="flex flex-col gap-4 justify-center items-center mt-20">
          <Lottie animationData={notFound} loop={true} />
          <div className="text-lg">No Crowdfunding Event</div>
        </div>
      </div>
    );
  return (
    <>
      <Nav3 />
      <div
        className="flex flex-col items-center h-screen justify-center py-8 px-4 bg-[#1d5e74] sm:px-6 lg:px-8"
        // style={{ background: "#BDE3F0" }}
      >
        <div
          className="text-sm border py-8 px-6 max-w-xl rounded-md flex flex-col gap-4 border-gray-600 shadow-2xl bg-[#0F4C81] sm:px-8 lg:px-10"
          style={{ background: "#0F4C81" }}
        >
          <div className="text-xl font-bold text-white">{proposal.title}</div>
          <div className="text-base mt-4 mb-3 text-white">
            <p>{proposal.description}</p>
          </div>

          {/* -------------------  */}
          <div>
            {mintingDone ? (
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  style={{
                    background: "white",
                    color: "black",
                    borderRadius: "999px",
                  }}
                >
                  Withdraw Funds
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  style={{
                    background: "white",
                    color: "black",
                    borderRadius: "999px",
                  }}
                >
                  Dispute
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  style={{
                    background: "white",
                    color: "black",
                    borderRadius: "999px",
                  }}
                >
                  Claimback
                </Button>
              </div>
            ) : (
              <div className="mt-4">
                {isStaked && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleMint}
                    style={{
                      background: "white",
                      color: "black",
                      borderRadius: "999px",
                    }}
                  >
                    {isMinting ? "Minting..." : "Mint NFT"}
                  </Button>
                )}

                {!isStaked && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => handleStake()}
                    style={{
                      background: "white",
                      color: "black",
                      borderRadius: "999px",
                    }}
                  >
                    {isStaking ? "Staking..." : "Stake Token"}
                  </Button>
                )}
              </div>
            )}
          </div>
          {isStaked && (
            <div className="mt-4">
              <p className="text-white" >Funding Progress:</p>
              <div className="w-full h-4 bg-gray-300 rounded">
                <div
                  style={{ width: `${5}%` }}
                  className="h-full bg-blue-500 rounded"
                ></div>
              </div>
              <p>{2 / 5} APT</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Crowdfunding;