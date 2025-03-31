"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import interestsList from "@/public/json/interestList.json";

interface MainContentProps {
  interest: string[];
}

function MainContent({ interest }: MainContentProps) {
  const router = useRouter();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(interest);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("====================================");
    console.log("Received Interests:", interest);
    console.log("====================================");

    setSelectedInterests(interest);
  }, [interest]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSaveInterests = async () => {
    if (selectedInterests.length < 3) return;

    setLoading(true);
    try {
      const response = await fetch("/api/userProfile/interest", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ interests: selectedInterests }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("====================================");
        console.log("Interests saved successfully:", data);
        console.log("====================================");

        router.replace("/");
      } else {
        console.log("====================================");
        console.error("Failed to save interests:", data.error);
        console.log("====================================");
      }
    } catch (error) {
      console.log("====================================");
      console.error("Error saving interests:", error);
      console.log("====================================");
    } finally {
      setLoading(false);
    }
  };

  // Categorizing interests
  const categorizedInterests = [
    {
      title: "Recommended",
      data: interestsList.filter((item) => item.recommendation),
    },
    {
      title: "All Topics",
      data: interestsList.filter((item) => !item.recommendation),
    },
  ];

  return (
    <>
      <div className="text-left px-4 pt-10 space-y-4">
        <h2 className="text-4xl font-bold">What interests you?</h2>
        <p className="text-2xl font-semibold text-gray-400">
          Select at least <span className="text-green-600">3 topics</span>.
        </p>
      </div>

      <div className="p-5">
        {categorizedInterests.map((section, index) => (
          <div key={index} className="w-full">
            <p className="text-2xl font-extrabold mt-10 mb-6 text-black">
              {section.title}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {section.data.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleInterest(item.name)}
                  className={`px-4 py-8 rounded-xl text-medium text-black ${selectedInterests.includes(item.name)
                    ? "bg-green-300"
                    : "bg-gray-50"
                    }`}
                >
                  <p className="text-5xl mb-4">{item.icon}</p>
                  <p className="text-lg font-bold">{item.name}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 space-y-6">
        <button
          type="button"
          onClick={handleSaveInterests}
          disabled={selectedInterests.length < 3 || loading}
          className={`w-full px-20 py-4 text-white text-xl font-extrabold rounded-full flex items-center justify-center gap-2
          ${selectedInterests.length < 3 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 active:bg-green-500 active:scale-95"}`}
        >
          {loading ? "Saving..." : "Build my Feed"}
        </button>

        <div className="flex items-center justify-center">
          <Link href="/home" className="text-black text-xl font-extrabold">
            Skip
          </Link>
        </div>
      </div>
    </>
  );
}

export default MainContent;
