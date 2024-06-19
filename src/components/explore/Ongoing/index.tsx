"use client"
import { useState } from "react";
import { useProposal } from "@/ContextProviders/ProposalProvider";
import Lottie from "lottie-react";
import notFound from "@/components/Empty/notFound.json";
import Button from "@/components/common/Button";
import { useAddress } from "@thirdweb-dev/react";
import { enqueueSnackbar } from "notistack";
import Nav3 from "@/components/common/Nav/nav3.js";

const Ongoing = () => {
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const { proposal, votes, setVotes, setVotesPercentage } = useProposal();
  const address = useAddress();

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const newVotes = { ...votes };
    if (selectedValue === "like") {
      newVotes.likes += 1;
    } else {
      newVotes.dislikes += 1;
    }
    setVotes(newVotes);

    const totalVotes = newVotes.likes + newVotes.dislikes;
    const percentage = (newVotes.likes / totalVotes) * 100;
    setVotesPercentage(percentage);

    enqueueSnackbar(`${selectedValue} `, {
      variant: selectedValue === "like" ? "success" : "error",
    });
  };

  if (!proposal)
    return (
      <div className="bg-black h-screen">
        <Nav3 />
        <div className="flex flex-col justify-center items-center mt-20 bg-black">
          <Lottie animationData={notFound} loop={true} />
          <div className="text-lg text-white">No ongoing proposal</div>
        </div>
      </div>
    );

  return (
    <>
      <Nav3 />
      <div className="flex justify-center p-4 h-screen bg-[#133c4a]">
        <div className="w-full max-w-screen-sm">
          <div className="w-full text-lg border rounded-md py-6 px-6 max-w-xl flex flex-col gap-3 shadow border-gray-600 shadow-2xl mt-4" style={{ background: "#0F4C81" }}>
            <div className="text-white text-2xl mb-1 font-semibold">{proposal.title}</div>
            <div className="text-white">{proposal.description}</div>
            <div className="text-white">Price Per NFT: {proposal.priceperNFT} APT </div>
            <div className="text-white">Funding Goal: {proposal.funding_goal} APT</div>
            <div className="text-white">Valid Till: {proposal.date.$d.toDateString()}</div>
            <div className="text-white">Created by: {address}</div>

            <form onSubmit={handleSubmit}>
              <div className="flex justify-center gap-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="dislike"
                    checked={selectedValue === "dislike"}
                    onChange={() => setSelectedValue("dislike")}
                    required
                    className="hidden"
                  />
                  <div className={`w-12 h-12 flex justify-center items-center text-lg hover:text-2xl py-2 border rounded-sm cursor-pointer ${selectedValue === "dislike" && "border-blue-500"}`}>
                    👎
                  </div>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    value="like"
                    checked={selectedValue === "like"}
                    onChange={() => setSelectedValue("like")}
                    required
                    className="hidden"
                  />
                  <div className={`w-12 h-12 flex justify-center items-center text-lg hover:text-2xl py-2 border rounded-sm cursor-pointer ${selectedValue === "like" && "border-blue-500"}`}>
                    👍
                  </div>
                </label>
              </div>

              <div className="flex justify-center mt-4">
                <Button variant="primary" size="lg" type="submit" style={{ background: "white", color: "black", borderRadius: "999px" }}>
                  Vote
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Ongoing;
