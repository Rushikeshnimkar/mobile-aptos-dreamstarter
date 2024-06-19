"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import Button from "@/components/common/Button";
import { Input, InputNumber, Radio, DatePicker } from "antd";
import { useProposal } from "@/ContextProviders/ProposalProvider";
import { enqueueSnackbar } from "notistack";
import Nav2 from "@/components/common/Nav/nav2";

const CreateProposal = () => {
  const { setProposal } = useProposal();

  interface FormMessage {
    description: string;
    title: string;
    priceperNFT: number;
    funding_goal: number;
    proposal_type: string;
    date: any;
  }
  const initialValues: FormMessage = {
    title: "",
    description: "",
    priceperNFT: 1,
    funding_goal: 20,
    proposal_type: "",
    date: ``,
  };
  return (
    <>
      <main className="flex flex-col md:flex-row">
        <div
          className="md:w-[780px] md:h-[730px] bg-cover bg-center"
          style={{
            backgroundImage: `url('/form.png')`,
          }}
        >
          <div className="flex gap-2 items-center p-6 px-16">
            <div className="text-2xl">
              <img src="/nav.png" alt="" width="30px" height="10px" />
            </div>
            <div className="text-white text-xl font-semibold">
              <a href="/">Dreamstarter</a>
            </div>
          </div>
        </div>

        <div className="md:w-[750px] bg-[#1d3f71] text-white p-6 md:p-16">
          <div className="fixed top-0 right-0 md:static">
            <Nav2 />
          </div>
          <div className="mt-20 md:mt-0">
            <Formik
              initialValues={initialValues}
              onSubmit={(values, actions) => {
                setProposal(values);
                enqueueSnackbar(`${values.title} has been created`, {
                  variant: "success",
                });
                actions.setSubmitting(false);
              }}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form>
                  <div className="text-2xl mb-1 font-semibold">
                    Submit Proposal
                  </div>
                  <div className="mb-6 italic">
                    Submit your project proposals and ideas for community votes
                    and crowdfunding
                  </div>
                  <div className="flex flex-col gap-6">
                    {/* ------------------------  */}
                    <div>
                      <label className="font-medium" htmlFor="title">
                        Proposal Title
                      </label>
                      <div className="mt-2">
                        <Input
                          style={{ background: "#4AA5F4" }}
                          className="input px-4 py-3 rounded-lg focus:outline-none focus:shadow-lg focus:shadow-gray-500/50"
                          required
                          value={values.title}
                          onChange={(e) => {
                            setFieldValue("title", e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    {/* -------------  */}

                    {/* ------------------------  */}
                    <div>
                      <label className="font-medium" htmlFor="description">
                        Description
                      </label>
                      <div className="mt-2">
                        <Input.TextArea
                          style={{ background: "#4AA5F4" }}
                          className="input px-4 py-2 rounded-lg focus:outline-none focus:shadow-lg focus:shadow-gray-500/50"
                          required
                          value={values.description}
                          onChange={(e) => {
                            setFieldValue("description", e.target.value);
                          }}
                        />
                      </div>
                    </div>

                    {/* -------------  */}
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      {/* ------------------------  */}
                      <div>
                        <label className="font-medium" htmlFor="priceperNFT">
                          Price per NFT
                        </label>
                        <div className="mt-2">
                          <InputNumber
                            style={{ background: "#4AA5F4" }}
                            className="input px-4 py-1 rounded-lg focus:outline-none focus:shadow-lg focus:shadow-gray-500/50"
                            required
                            value={values.priceperNFT}
                            onChange={(e) => {
                              setFieldValue("priceperNFT", e);
                            }}
                          />
                        </div>
                      </div>

                      {/* -------------  */}

                      {/* ------------------------  */}
                      <div>
                        <label className="font-medium" htmlFor="funding_goal">
                          Funding Goal
                        </label>
                        <div className="mt-2">
                          <InputNumber
                            style={{ background: "#4AA5F4" }}
                            className="input px-4 py-1 rounded-lg focus:outline-none focus:shadow-lg focus:shadow-gray-500/50"
                            required
                            value={values.funding_goal}
                            onChange={(e) => {
                              setFieldValue("funding_goal", e);
                            }}
                          />
                        </div>
                      </div>

                      {/* -------------  */}
                    </div>
                    {/* ------------ */}
                    <Radio.Group
                      onChange={(e) => {
                        setFieldValue("proposal_type", e.target.value);
                      }}
                      value={values.proposal_type}
                    >
                      <Radio value={"collab"} className="font-raleway">
                        {" "}
                        Dreamstarter Collab
                      </Radio>
                      <Radio value={"holder"} className="font-raleway">
                        {" "}
                        Dreamstarter Holder
                      </Radio>
                    </Radio.Group>

                    {/* ----------  */}

                    {/* ----------------------  */}
                    <div>
                      <div>
                        <label htmlFor="date" className="block mb-2">
                          Valid till
                        </label>

                        <DatePicker
                          style={{ background: "#4AA5F4" }}
                          className="input px-4 py-1 rounded-lg focus:outline-none focus:shadow-lg focus:shadow-gray-500/50"
                          onChange={(e) => {
                            setFieldValue("date", e);
                          }}
                        />
                      </div>
                    </div>

                    {/* ---------------------- */}
                  </div>

                  <div className="mt-5">
                    <Button
                      style={{
                        color: "white",
                        borderRadius: "9999px",
                        background: "#0F4C81",
                      }}
                      className="hover:bg-sky-500 w-full md:w-auto"
                      type="submit"
                      _isSubmitting={isSubmitting}
                      disabled={isSubmitting}
                      variant={""}
                    >
                      Create Proposal
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </main>
    </>
  );
};

export default CreateProposal;