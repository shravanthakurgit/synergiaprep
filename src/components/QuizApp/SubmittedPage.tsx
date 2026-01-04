import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, X } from "lucide-react";
import StudyTracker from "../StudyTracker";

const SubmittedPage: React.FC = () => {
  const date = new Date().toLocaleString();
  return (
    <StudyTracker>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 bg-white border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Link href="/examprep/dashboard">
            <ArrowLeft className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </Link>
          <h1 className="font-medium text-gray-800">Exam Platform</h1>
        </div>
        <Link href="/examprep/dashboard">
          <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-md max-w-lg w-full p-8 text-center space-y-6 border border-gray-100">
          <div className="flex justify-center">
            <div className="bg-green-50 p-4 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            Submission Confirmed
          </h2>

          <div className="text-gray-600 space-y-4">
            <p>Your exam has been successfully submitted and received.</p>
            <p>
              Your exam has been submitted successfully. You can now close the
              browser or return to dashboard.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-left">
                <p className="text-sm text-gray-500">Exam</p>
                <p className="font-medium">Final Assessment</p>
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Submission Time</p>
                <p className="font-medium">{date}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col space-y-3">
            <Link href="/examprep/dashboard" className="block">
              <Button className="w-full py-6 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all duration-200 shadow-sm">
                Return to Dashboard
              </Button>
            </Link>
            <Link href="/examprep/analysis" className="block">
              <Button
                variant="outline"
                className="w-full py-6 border-gray-300 hover:bg-gray-100 text-gray-700 hover:text-gray-700 font-medium rounded-lg transition-all duration-200"
              >
                View Analysis
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 bg-white border-t border-gray-200">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">© 2025 Exam Platform</p>
          <div className="flex space-x-4">
            <Link
              href="/help"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Help
            </Link>
            <Link
              href="/contact"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
    </StudyTracker>
  );
};

export default SubmittedPage;
