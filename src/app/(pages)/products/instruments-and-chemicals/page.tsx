"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import Clients from "@/components/Home/Clients";

export default function InstrumentsAndChemicalsForm() {
  const [category, setCategory] = useState("Scientific Instruments");
  const [casEntries, setCasEntries] = useState([
    { cas: "", chemicalName: "", manufacturer: "", note: "" },
  ]);
  const [details, setDetails] = useState("");
  const [instituteName, setInstituteName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleAddCAS = () => {
    setCasEntries([
      ...casEntries,
      { cas: "", chemicalName: "", manufacturer: "", note: "" },
    ]);
  };

  const handleCASChange = (
    index: number,
    updatedEntry: (typeof casEntries)[0]
  ) => {
    const updated = [...casEntries];
    updated[index] = updatedEntry;
    setCasEntries(updated);
  };

  const handleDeleteCAS = (index: number) => {
    const updated = [...casEntries];
    updated.splice(index, 1);
    setCasEntries(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    const synergiaprep = "914040a6-f7c8-4750-91b9-8aef783befb2";

    formData.append("access_key", synergiaprep);
    formData.append("Institute/University Name", instituteName);
    formData.append("Your Name", userName);
    formData.append("Email", email);
    formData.append("Phone Number", phone);
    formData.append("Institute/University Address", address);
    formData.append("Category", category);

    if (category === "Chemicals") {
      casEntries.forEach((entry, idx) => {
        formData.append(`CAS Number ${idx + 1}`, entry.cas);
        formData.append(`Chemical Name ${idx + 1}`, entry.chemicalName);
        formData.append(`Manufacturer ${idx + 1}`, entry.manufacturer);
        formData.append(`Note ${idx + 1}`, entry.note);
      });
    } else if (category === "Scientific Instruments") {
      formData.append("Questions & Comments", details);
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Web3Forms response:", result);

      if (result.success) {
        alert("Form submitted successfully!");
        setInstituteName("");
        setUserName("");
        setEmail("");
        setPhone("");
        setAddress("");
        setDetails("");
        setCasEntries([
          { cas: "", chemicalName: "", manufacturer: "", note: "" },
        ]);
        setCategory("Scientific Instruments");
      } else {
        alert("Failed to submit the form. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong while submitting the form.");
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0f3bfe] via-blue-400 dark:via-blue-900 to-blue-200 py-10 bg-cover bg-center px-4 sm:px-6 lg:px-8 sm:pt-28 md:pt-32 lg:pt-36 m-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Card className="max-w-2xl w-full mx-auto p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl shadow-xl bg-white/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-800 mb-4 sm:mb-6">
                Request Quotation
              </h1>
            </motion.div>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Label className="block mb-1 sm:mb-2 text-blue-800 font-semibold text-base sm:text-lg">
                  Institute / University / Company Name
                </Label>
                <Input
                  type="text"
                  placeholder="Enter your institute or university name"
                  value={instituteName}
                  onChange={(e) => setInstituteName(e.target.value)}
                  required
                  className="bg-white/20 text-blue-800 placeholder-gray-400 border-none focus:ring-blue-300 focus:bg-white/30 transition-all duration-300 text-sm sm:text-base"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Label className="block mb-1 sm:mb-2 text-blue-800 font-semibold text-base sm:text-lg">
                  Your Name
                </Label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="bg-white/20 text-blue-800 placeholder-gray-400 border-none focus:ring-blue-300 focus:bg-white/30 transition-all duration-300 text-sm sm:text-base"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Label className="block mb-1 sm:mb-2 text-blue-800 font-semibold text-base sm:text-lg">
                  Email
                </Label>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/20 text-blue-800 placeholder-gray-400 border-none focus:ring-blue-300 focus:bg-white/30 transition-all duration-300 text-sm sm:text-base"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Label className="block mb-1 sm:mb-2 text-blue-800 font-semibold text-base sm:text-lg">
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="bg-white/20 text-blue-800 placeholder-gray-400 border-none focus:ring-blue-300 focus:bg-white/30 transition-all duration-300 text-sm sm:text-base"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Label className="block mb-1 sm:mb-2 text-blue-800 font-semibold text-base sm:text-lg">
                  Institute / University / Company Address
                </Label>
                <Textarea
                  placeholder="Enter full address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  required
                  className="bg-white/20 text-blue-800 placeholder-gray-400 border-none focus:ring-blue-300 focus:bg-white/30 transition-all duration-300 text-sm sm:text-base"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Label className="block mb-1 sm:mb-2 text-blue-800 font-semibold text-base sm:text-lg">
                  Select Category
                </Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 bg-white/20 text-blue-800 border-none rounded-md focus:ring-blue-300 focus:bg-white/30 transition-all duration-300 text-sm sm:text-base"
                >
                  <option value="Scientific Instruments">
                    Scientific Instruments
                  </option>
                  <option value="Chemicals">Chemicals</option>
                </select>
              </motion.div>

              {category === "Chemicals" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <Label className="block mb-1 sm:mb-2 text-blue-800 font-semibold text-base sm:text-lg">
                    Chemical Information
                  </Label>

                  {/* Chemical Information Header - Responsive */}
                  <div className="hidden sm:grid sm:grid-cols-5 gap-2 sm:gap-4 font-semibold text-xs sm:text-sm text-blue-500 mb-2">
                    <div className="text-center sm:text-left">CAS</div>
                    <div className="text-center sm:text-left">
                      Chemical Name
                    </div>
                    <div className="text-center sm:text-left">Manufacturer</div>
                    <div className="text-center sm:text-left">Note</div>
                    <div className="text-center sm:text-left">Action</div>
                  </div>

                  {casEntries.map((entry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-5 gap-2 sm:gap-4 mb-3 sm:mb-2 items-center"
                    >
                      {/* Mobile view labels */}
                      <div className="sm:hidden text-xs font-semibold text-blue-500">
                        CAS Number
                      </div>
                      <Input
                        placeholder="CAS Number"
                        value={entry.cas}
                        onChange={(e) =>
                          handleCASChange(index, {
                            ...entry,
                            cas: e.target.value,
                          })
                        }
                        className="bg-white/20 text-blue-800 placeholder-gray-400 border-none focus:ring-blue-300 focus:bg-white/30 transition-all duration-300 text-sm sm:text-base"
                      />

                      <div className="sm:hidden text-xs font-semibold text-blue-500">
                        Chemical Name
                      </div>
                      <Input
                        placeholder="Chemical Name"
                        value={entry.chemicalName}
                        onChange={(e) =>
                          handleCASChange(index, {
                            ...entry,
                            chemicalName: e.target.value,
                          })
                        }
                        className="bg-white/20 text-blue-800 placeholder-gray-400 border-none focus:ring-blue-300 focus:bg-white/30 transition-all duration-300 text-sm sm:text-base"
                      />

                      <div className="sm:hidden text-xs font-semibold text-blue-500">
                        Manufacturer
                      </div>
                      <Input
                        placeholder="Manufacturer"
                        value={entry.manufacturer}
                        onChange={(e) =>
                          handleCASChange(index, {
                            ...entry,
                            manufacturer: e.target.value,
                          })
                        }
                        className="bg-white/20 text-blue-800 placeholder-gray-400 border-none focus:ring-blue-300 focus:bg-white/30 transition-all duration-300 text-sm sm:text-base"
                      />

                      <div className="sm:hidden text-xs font-semibold text-blue-500">
                        Note
                      </div>
                      <Input
                        placeholder="Note"
                        value={entry.note}
                        onChange={(e) =>
                          handleCASChange(index, {
                            ...entry,
                            note: e.target.value,
                          })
                        }
                        className="bg-white/20 text-blue-800 placeholder-gray-400 border-none focus:ring-blue-300 focus:bg-white/30 transition-all duration-300 text-sm sm:text-base"
                      />

                      {casEntries.length > 1 && (
                        <div className="flex justify-center sm:justify-start">
                          <div className="sm:hidden text-xs font-semibold text-blue-500 mb-1">
                            Action
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => handleDeleteCAS(index)}
                            className="w-full sm:w-auto px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm rounded-xl sm:rounded-3xl transition-all duration-300"
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  <div className="mt-4 flex justify-center">
                    <Button
                      type="button"
                      className="rounded-xl sm:rounded-2xl bg-purple-400 hover:bg-purple-500 transition-all duration-300 text-xs sm:text-sm px-4 sm:px-6 py-1.5 sm:py-2"
                      onClick={handleAddCAS}
                    >
                      Add More
                    </Button>
                  </div>
                </motion.div>
              )}

              {category === "Scientific Instruments" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <Label className="block mb-1 sm:mb-2 text-blue-800 font-semibold text-base sm:text-lg">
                    Questions & Comments
                  </Label>
                  <Textarea
                    placeholder="Describe the instruments you need or any related comments"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={4}
                    className="bg-white/20 text-blue-800 placeholder-gray-400 border-none focus:ring-blue-300 focus:bg-white/30 transition-all duration-300 text-sm sm:text-base"
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
                className="flex justify-center mt-4"
              >
                <Button
                  type="submit"
                  className="w-full sm:w-1/2 max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl sm:rounded-2xl shadow-md transition-all duration-300 text-sm sm:text-base"
                >
                  Submit
                </Button>
              </motion.div>
            </form>
          </Card>
        </motion.div>
      </div>

      {/* Clients component added at the bottom */}
      <Clients />
    </>
  );
}
