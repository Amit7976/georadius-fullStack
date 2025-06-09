"use client";
import { IoLocation } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getAddress, getCoordinates } from "@/src/helpers/AddressFunc";
import debounce from "lodash.debounce";
import {
    UseFormRegister,
    UseFormSetValue,
    FieldErrors
} from "react-hook-form";
import { FormValues } from "../MainContent";
import { t } from "@/src/helpers/i18n";

interface Prediction {
    description: string;
}

interface LocationInputProps {
    register: UseFormRegister<FormValues>;
    setValue: UseFormSetValue<FormValues>;
    errors: FieldErrors;
    data?: {
        location?: string;
        latitude?: number;
        longitude?: number;
    };
}


export default function LocationInput({
    register,
    setValue,
    errors,
    data,
}: LocationInputProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(data?.location || "");
    const [error, setError] = useState<string | null>(null);
    const [customLocation, setCustomLocation] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [latitude, setLatitude] = useState<number | null>(data?.latitude || null);
    const [longitude, setLongitude] = useState<number | null>(data?.longitude || null);
    const [location, setLocation] = useState<string | null>(data?.location || null);

    const router = useRouter();

    // ✅ Fetch current location
    const handleGetLocation = useCallback(async () => {
        console.log("Fetching current location...");
        const currentLocation = await getAddress();
        console.log("Location fetched:", currentLocation);

        setLocation(currentLocation);
        setInputValue(currentLocation);
        setError(null);
        setCustomLocation(false);

        const coordinates = await getCoordinates(currentLocation);
        if (coordinates) {
            setLatitude(coordinates.latitude);
            setLongitude(coordinates.longitude);
            setValue("location", currentLocation);
            setValue("latitude", coordinates.latitude);
            setValue("longitude", coordinates.longitude);
        }
    }, [setValue]);

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
    }, [handleGetLocation, router]);

    // ✅ Fetch coordinates for custom location
    const fetchCoordinatesForCustomLocation = async (customAddress: string) => {
        console.log("Fetching coordinates for custom address:", customAddress);
        const coordinates = await getCoordinates(customAddress);
        if (coordinates) {
            setLatitude(coordinates.latitude);
            setLongitude(coordinates.longitude);
            console.log("📍 Coordinates:", coordinates);

            setValue("location", customAddress);
            setValue("latitude", coordinates.latitude);
            setValue("longitude", coordinates.longitude);
        }
    };

    // ✅ Debounced fetch suggestions

    const debouncedFetchSuggestions = useMemo(() =>
        debounce(async (query: string) => {
            if (!query.trim()) {
                setSuggestions([]);
                return;
            }

            const API_KEY = "txBOleR58lHkyz1Aio6WJc5zPW223xIabWR3Yd4k";
            const url = `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(
                query
            )}&api_key=${API_KEY}`;

            try {
                console.log("🔍 Fetching suggestions from:", url);
                const response = await fetch(url);
                const data = await response.json();
                console.log("📜 API Response Data:", data);

                if (data.predictions) {
                    setSuggestions(
                        (data.predictions as Prediction[]).map((item) => item.description)
                    );
                } else {
                    setSuggestions([]);
                }
            } catch (err) {
                console.error("❌ Error fetching suggestions:", err);
            }
        }, 300)
        , []);


    // ✅ Handle input change
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
                        <button
                            type="button"
                            className="text-blue-500 font-bold text-left"
                        >
                            {location ? location : "Fetching location..."}{" "}
                            <span className="text-gray-400">({t("clickToChange")})</span>
                        </button>
                    </DialogTrigger>

                    <DialogContent className={""}>
                        <DialogHeader className={""}>
                            <DialogTitle className="text-lg font-bold mb-3">
                                {t("enterNewLocation")}
                            </DialogTitle>
                        </DialogHeader>

                        {/* ✅ Input with autocomplete */}
                        <input
                            type="text"
                            {...register("location")}
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder={t("typeLocationHere")}
                            className="h-14 border-2 w-full px-4 rounded-lg"
                        />
                        {errors.location && (
                            <p className="text-red-500 text-sm">
                                {errors.location.message as string}
                            </p>
                        )}

                        {/* ✅ Suggestions */}
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

                                variant="primary"
                                onClick={() => {
                                    if (!inputValue.trim()) {
                                        setError(t("locationEmpty"));
                                        return;
                                    }
                                    console.log("Saving custom location:", inputValue);
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

            {/* ✅ Coordinates display */}
            {latitude !== null && longitude !== null && (
                <p className="text-gray-600 text-sm">
                    📍 Lat: {latitude}, Lng: {longitude}
                </p>
            )}

            {/* ✅ Error message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* ✅ Reset to current location */}
            {customLocation && (
                <Button

                    variant="primary"
                    onClick={handleGetLocation}
                    className="w-full h-12 bg-gray-600 text-white font-bold mt-2"
                >
                    {t("useCurrentLocation")}
                </Button>
            )}
        </div>
    );
}
