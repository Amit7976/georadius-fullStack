"use client";
import { Button } from "@/components/ui/button";
import interestsList from "@/public/json/interestList.json";
import { useEffect, useMemo, useState, useCallback } from "react";

function MainContent() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchInterests = async () => {
      try {
        const res = await fetch(`/api/userProfile/interest`, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to fetch user interests");
        const { interest } = await res.json();
        if (Array.isArray(interest)) {
          setSelectedInterests(interest);
        }
      } catch (error) {
        console.error("Failed to fetch interests: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();

    return () => controller.abort(); // clean up fetch on unmount
  }, []);

  const toggleInterest = useCallback((interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  }, []);

  const handleSaveInterests = async () => {
    if (selectedInterests.length < 3 || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/userProfile/interest", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests: selectedInterests }),
      });

      if (res.ok) {
        window.location.replace("/");
      } else {
        console.error("Failed to save interests: ", res.status);
      }
    } catch (err) {
      console.error("Error saving interests:", err);
    } finally {
      setLoading(false);
    }
  };

  const categorizedInterests = useMemo(() => [
    {
      title: "Recommended",
      data: interestsList.filter((item) => item.recommendation),
    },
    {
      title: "All Topics",
      data: interestsList.filter((item) => !item.recommendation),
    },
  ], []);

  const isDisabled = selectedInterests.length < 3 || loading;

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
              {section.data.map((item, idx) => {
                const isSelected = selectedInterests.includes(item.name);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleInterest(item.name)}
                    className={`px-4 py-6 rounded-xl text-medium text-gray-500 ${isSelected ? "bg-green-200 dark:bg-green-400 dark:text-white" : "bg-gray-50 dark:bg-neutral-800"
                      }`}
                  >
                    <p className="text-4xl mb-6">{item.icon}</p>
                    <p className="text-sm font-semibold">{item.name}</p>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-5 pt-14 space-y-6">
        <Button
          onClick={handleSaveInterests}
          disabled={isDisabled}
          className={`w-full px-20 h-16 text-white text-xl font-extrabold rounded-full flex items-center justify-center gap-2 ${isDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 active:bg-green-500"
            }`}
        >
          {loading ? "Saving..." : "Build my Feed"}
        </Button>

        <div className="flex items-center justify-center fixed top-3 right-3">
          <Button
            variant="ghost"
            size="sm"
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
