"use client";
import { Button } from "@/components/ui/button";
import interestsList from "@/public/json/interestList.json";
import { useEffect, useState } from "react";

function MainContent() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUserInterest = async () => {
      try {
        // 🔹 Fetch only interest array
        console.log("====================================");
        console.log("Fetching user interests...");
        console.log("====================================");

        const userProfileRes = await fetch(`/api/userProfile/interest`);
        if (!userProfileRes.ok) throw new Error("Failed to fetch user interests");

        const { interest } = await userProfileRes.json();
        console.log("====================================");
        console.log("User Interests:", interest);
        console.log("====================================");


        setSelectedInterests(Array.isArray(interest) ? interest : []);

      } catch (error) {
        console.log("====================================");
        console.error("Error fetching user data:", error);
        console.log("====================================");
      } finally {
        setLoading(false);
      }
    };

    checkUserInterest();
  }, []);


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


      if (response.ok) {
        console.log("====================================");
        console.log("Interests saved successfully:");
        console.log("====================================");

        window.location.replace("/")
      } else {
        console.log("====================================");
        console.error("Failed to save interests: ", response.status);
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
      <div className="text-left px-4 pt-14 space-y-4">
        <h2 className="text-3xl font-semibold">What interests you?</h2>
        <p className="text-xl font-medium text-gray-400">
          Select at least <span className="text-green-600">3 topics</span>.
        </p>
      </div>

      <div className="p-5">
        {categorizedInterests.map((section, index) => (
          <div key={index} className="w-full">
            <p className="text-2xl font-semibold mt-10 mb-6 text-gray-500">
              {section.title}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {section.data.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleInterest(item.name)}
                  className={`px-4 py-6 rounded-xl text-medium text-gray-500 ${selectedInterests.includes(item.name)
                    ? "bg-green-200"
                    : "bg-gray-50"
                    }`}
                >
                  <p className="text-4xl mb-6">{item.icon}</p>
                  <p className="text-sm font-semibold">{item.name}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 pt-14 space-y-6">
        <Button
          onClick={handleSaveInterests}
          disabled={selectedInterests.length < 3 || loading}
          className={`w-full px-20 h-16 text-white text-xl font-extrabold rounded-full flex items-center justify-center gap-2
          ${selectedInterests.length < 3 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 active:bg-green-500"}`}
        >
          {loading ? "Saving..." : "Build my Feed"}
        </Button>

        <div className="flex items-center justify-center fixed top-3 right-3">
          <Button
            variant={'ghost'}
            size={'sm'}
            className="text-black text-sm font-semibold bg-gray-100 px-7 py-1 rounded-full duration-300 cursor-pointer"
            onClick={() => window.location.replace("/")}
          >
            Skip
          </Button>
        </div>
      </div>
    </>
  );
}

export default MainContent;
