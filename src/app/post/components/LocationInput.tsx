"use client";
import { IoLocation } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAddress, getCoordinates } from "@/src/helpers/AddressFunc";
import debounce from "lodash.debounce";

interface LocationInputProps {
    register: any;
    setValue: any;
    errors: any;
}

export default function LocationInput({ register, setValue, errors }: LocationInputProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [customLocation, setCustomLocation] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [location, setLocation] = useState("");

    const router = useRouter();

    console.log("Component Rendered");

    useEffect(() => {
        console.log("Checking location permissions...");
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }

        navigator.permissions.query({ name: "geolocation" }).then((result) => {
            if (result.state === "denied") {
                router.replace("/pages/onboarding/permissions/location");
            } else {
                handleGetLocation();
            }
        });
    }, []);

    // ✅ Fetch Current Location
    const handleGetLocation = async () => {
        console.log("Fetching current location...");
        const location = await getAddress();
        console.log("Location fetched:", location);
        setLocation(location);
        setInputValue(location);
        setError(null);
        setCustomLocation(false);

        // ✅ Update Form Values with Address & Coordinates
        const coordinates = await getCoordinates(location);
        if (coordinates) {
            setLatitude(coordinates.latitude);
            setLongitude(coordinates.longitude);
            setValue("location", location);
            setValue("latitude", coordinates.latitude);
            setValue("longitude", coordinates.longitude);
        }
    };

    // ✅ Fetch Coordinates for Custom Address
    const fetchCoordinatesForCustomLocation = async (customAddress: string) => {
        console.log("Fetching coordinates for custom address:", customAddress);
        const coordinates = await getCoordinates(customAddress);
        if (coordinates) {
            setLatitude(coordinates.latitude);
            setLongitude(coordinates.longitude);
            console.log("📍 Coordinates:", coordinates);

            // ✅ Update Form Values with Address & Coordinates
            setValue("location", customAddress);
            setValue("latitude", coordinates.latitude);
            setValue("longitude", coordinates.longitude);
        }
    };

    // ✅ Fetch Location Suggestions from Ola Maps API
    const fetchLocationSuggestions = async (query: string) => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        const API_KEY = "txBOleR58lHkyz1Aio6WJc5zPW223xIabWR3Yd4k";
        const url = `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(query)}&api_key=${API_KEY}`;

        try {
            console.log("🔍 Fetching suggestions from:", url);
            const response = await fetch(url, { method: "GET" });
            const data = await response.json();
            console.log("📜 API Response Data:", data);

            if (data.predictions) {
                setSuggestions(data.predictions.map((item: any) => item.description));
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error("❌ Error fetching suggestions:", error);
        }
    };

    // ✅ Debounce Input Changes
    const debouncedFetchSuggestions = useCallback(debounce(fetchLocationSuggestions, 300), []);

    // ✅ Handle Input Change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        debouncedFetchSuggestions(value);
    };

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
                <IoLocation className="text-blue-500 text-xl shrink-0" />
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <button type="button" className="text-blue-500 font-bold text-left">
                            {location ? location : "Fetching location..."} {" "}
                            <span className="text-gray-400">(click to change)</span>
                        </button>
                    </DialogTrigger>

                    <DialogContent className={""}>
                        <DialogHeader className={""}>
                            <DialogTitle className="text-lg font-bold mb-3">Enter New Location</DialogTitle>
                        </DialogHeader>

                        {/* ✅ Autocomplete Input */}
                        <input
                            type="text"
                            {...register("location")}
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Type location here..."
                            className="h-14 border-2 w-full px-4 rounded-lg"
                        />
                        {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}

                        {/* ✅ Show Suggestions */}
                        {suggestions.length > 0 && (
                            <ul className="bg-white border rounded-lg mt-2 max-h-40 overflow-auto">
                                {suggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onClick={() => {
                                            setInputValue(suggestion);
                                            setSuggestions([]);
                                            fetchCoordinatesForCustomLocation(suggestion);
                                        }}
                                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}

                        <DialogFooter className="mt-3">
                            <Button
                                size={100}
                                variant="primary"
                                onClick={() => {
                                    console.log("Saving custom location:", inputValue);
                                    if (!inputValue.trim()) {
                                        setError("Location cannot be empty.");
                                        return;
                                    }
                                    setLocation(inputValue);
                                    setCustomLocation(true);
                                    fetchCoordinatesForCustomLocation(inputValue);
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

            {/* ✅ Show Latitude & Longitude */}
            {latitude !== null && longitude !== null && (
                <p className="text-gray-600 text-sm">📍 Lat: {latitude}, Lng: {longitude}</p>
            )}

            {/* ✅ Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* ✅ Reset Button */}
            {customLocation && (
                <Button
                    size={100}
                    variant="primary"
                    onClick={handleGetLocation}
                    className="w-full h-12 bg-gray-600 text-white font-bold mt-2"
                >
                    Use Current Location
                </Button>
            )}
        </div>
    );
}
