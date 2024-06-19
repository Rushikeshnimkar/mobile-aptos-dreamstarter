"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import ConvertModal from "../ConvertModal";
import { useProposal } from "@/ContextProviders/ProposalProvider";
import Lottie from "lottie-react";
import notFound from "@/components/Empty/notFound.json";
import Nav3 from "@/components/common/Nav/nav3.js";

const ProposalSummary = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { proposal } = useProposal();

  // Loading state when proposal is not available
  if (!proposal)
    return (
      <div className="bg-black min-h-screen">
        <Nav3 />
        <div className="flex flex-col gap-4 justify-center items-center mt-20 px-4">
          <Lottie animationData={notFound} loop={true} />
          <div className="text-lg text-white text-center">No ongoing proposal</div>
        </div>
      </div>
    );

  // Displaying proposal when available
  return (
    <>
      <Nav3 />
      <div className="bg-blue-100 min-h-screen flex flex-col items-center justify-center">
        <div className="p-4 md:p-8 max-w-screen-sm">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <div className="text-lg font-medium mb-2 text-gray-800">
                {proposal?.title}
              </div>
              <div className="text-sm text-gray-600 mb-4">
                {proposal?.description}
              </div>
              <div className="flex items-center justify-center bg-gray-200 text-gray-700 py-2 px-4 rounded-full">
                ✅ <strong className="ml-1">55%</strong> of voters love your proposal
              </div>
            </div>
            <div className="p-4">
              <Button
                className="w-full bg-blue-500 text-white rounded-full py-2"
                onClick={() => setOpen(true)}
              >
                Launch
              </Button>
            </div>
          </div>
        </div>

        <Modal
          open={open}
          width={600}
          onCancel={() => setOpen(false)}
          closable={true}
          centered
        >
          <ConvertModal />
        </Modal>
      </div>
    </>
  );
};

export default ProposalSummary;
