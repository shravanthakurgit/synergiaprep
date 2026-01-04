import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Exam } from "@/types/examTypes";
import StudyTracker from "../StudyTracker";

interface InfoPageProps {
  acceptedTerms: boolean;
  setAcceptedTerms: (value: boolean) => void;
  handleStart: () => void;
  loading: boolean;
  Exam: Exam;
  questionStatuses: { className: string; text: string }[];
}

const InfoPage: React.FC<InfoPageProps> = ({
  acceptedTerms,
  setAcceptedTerms,
  handleStart,
  loading,
  Exam,
  questionStatuses,
}) => {
  return (
    <StudyTracker>
    <div className="w-full mx-auto p-4 bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-900">
          GENERAL INSTRUCTIONS
        </h1>
        {/* <div className="w-full sm:w-auto">
          <label className="text-sm block sm:inline">Choose Language</label>
          <select className="w-full sm:w-auto mt-1 sm:mt-0 sm:ml-2 border p-2 rounded">
            <option>English</option>
            <option>Hindi</option>
          </select>
        </div> */}
      </div>

      <div className="space-y-2">
        <h2 className="text-center font-semibold mb-8">
          Please read the instructions carefully
        </h2>

        <section>
          <h3 className="font-semibold mb-2">General Instructions:</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>{`Total duration of the exam is ${
              Exam?.totalDurationInSeconds
                ? Exam.totalDurationInSeconds / 60
                : "N/A"
            } minutes.`}</li>
            <li>
              The clock will be set at the server. The countdown timer will
              display the remaining time available for you to complete the
              examination.
            </li>
            <li>
              <p className="mb-2">
                The Questions Palette displayed on the right side of screen will
                show the status of each question using one of the following
                symbols:
              </p>
              <div className="space-y-2 pl-4">
                {questionStatuses.map((status, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Button className={status.className}>{index + 1}</Button>
                    <span>{status.text}</span>
                  </div>
                ))}
              </div>
            </li>
          </ol>
        </section>

        <section>
          <h3 className="font-semibold mb-2">Navigating to a Question:</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              To answer a question, do the following:
              <ul className="list-disc pl-6 mt-1">
                <li>
                  Click on the question number to go to that question directly.
                </li>
                <li>
                  Click on Save & Next to save your answer and move to the next
                  question.
                </li>
                <li>
                  Click on Mark for Review & Next to flag it for review and
                  proceed.
                </li>
              </ul>
            </li>
          </ol>
        </section>

        <section>
          <h3 className="font-semibold mb-2">Answering a Question:</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              Select your answer by clicking on the appropriate option button.
            </li>
            <li>To change your answer, click the another option button.</li>
            <li>
              To save your answer, you MUST click on the Save & Next button.
            </li>
            <li>
              To mark the question for review, click on Mark for Review & Next
              button.
            </li>
          </ol>
        </section>

        <div
          className="mt-8 p-4 border rounded bg-gray-50 cursor-pointer"
          onClick={() => setAcceptedTerms(!acceptedTerms)}
        >
          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
            />
            <label htmlFor="terms" className="text-sm cursor-pointer w-full">
              I have read and understood the instructions. All computer hardware
              allotted to me are in proper working condition. I declare that I
              am not in possession of / not wearing / not carrying any
              prohibited gadget like mobile phone, Bluetooth devices, etc. I
              agree that in case of not adhering to the instructions, I shall be
              liable to be debarred from this Test and/or to disciplinary
              action.
            </label>
          </div>
        </div>

        <div className="text-center">
          <Button
            disabled={!acceptedTerms || loading}
            onClick={handleStart}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
          >
            PROCEED
          </Button>
        </div>
      </div>

      <footer className="mt-8 pt-4 border-t text-center text-sm text-gray-600">
        © All Rights Reserved - SynergiaPrep Pvt. Ltd.
      </footer>
    </div>
    </StudyTracker>
  );
};

export default InfoPage;
