"use client"
import { IoLocation } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface LocationInputProps {
    location: string;
    setLocation: (location: string) => void;
}

export default function LocationInput({ location, setLocation }: LocationInputProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [customLocation, setCustomLocation] = useState(false);
    const router = useRouter();

    // ✅ Check Location Permission on Page Load
    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        navigator.permissions.query({ name: "geolocation" }).then((result) => {
            if (result.state === "denied") {
                // ❌ Redirect to permission page if denied
                router.push("/pages/onboarding/permissions/location");
            } else {
                fetchLocation();
            }
        });
    }, []);

    // ✅ Fetch Current Location
    const fetchLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newLocation = `Lat: ${latitude.toFixed(3)}, Lng: ${longitude.toFixed(3)}`;
                setLocation(newLocation);
                setError(null);
                setCustomLocation(false);
            },
            () => {
                setError("Failed to fetch location. Please enable location services.");
            }
        );
    };

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
                <IoLocation className="text-blue-500 text-xl shrink-0" />
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <button type="button" className="text-blue-500 font-bold text-left">
                            {location ? location : "Fetching location..."}{" "}
                            <span className="text-gray-400">(click to change)</span>
                        </button>
                    </DialogTrigger>

                    <DialogContent className={""}>
                        <DialogHeader className={""}>
                            <DialogTitle className="text-lg font-bold mb-3">Enter New Location</DialogTitle>
                        </DialogHeader>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type location here..."
                            className="h-14 border-2 w-full px-4 rounded-lg"
                        />
                        <DialogFooter className="mt-3">
                            <Button
                                size={100}
                                variant={"primary"}
                                onClick={() => {
                                    if (!inputValue.trim()) {
                                        setError("Location cannot be empty.");
                                        return;
                                    }
                                    setLocation(inputValue);
                                    setCustomLocation(true);
                                    setError(null);
                                    setOpen(false);
                                }}
                                className="w-full h-12 bg-green-600 text-white font-bold"
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* ✅ Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* ✅ Reset Button (Only visible if user set a custom location) */}
            {customLocation && (
                <Button
                    size={100}
                    variant={"primary"}
                    onClick={fetchLocation}
                    className="w-full h-12 bg-gray-600 text-white font-bold mt-2"
                >
                    Use Current Location
                </Button>
            )}
        </div>
    );
}
