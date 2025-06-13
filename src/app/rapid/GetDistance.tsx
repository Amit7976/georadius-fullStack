"use client";

import { getDistanceFromCurrentLocation } from "@/src/helpers/getDistanceFromCurrentLocation";
import { t } from "@/src/helpers/i18n";
import { useEffect, useState } from "react";
import "swiper/css";


function GetDistance({ lat, lng, location }: { lat: number, lng: number, location:string }) {

    const [distance, setDistance] = useState(t("nearby"));

    useEffect(() => {
        if (lat !== undefined && lng !== undefined) {
            getDistanceFromCurrentLocation(lat, lng)
                .then(({ formattedDistance }) => setDistance(formattedDistance))
                .catch(() => setDistance(t("nearby")));
        }
    }, [lat, lng]);


    return (
        <div className="flex items-center gap-4 mb-2">
            <p className="text-gray-500 text-sm">{distance}</p>
            <p className="text-gray-500 text-xs">{location}</p>
        </div>
    )
}

export default GetDistance
