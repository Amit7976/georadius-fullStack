"use client"
import { t } from '@/src/helpers/i18n';
import React, { useEffect, useState } from 'react';


/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////


const LocationDeniedBanner: React.FC = () => {
    const [locationDenied, setLocationDenied] = useState(false);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationDenied(true);
            return;
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////

        navigator.geolocation.getCurrentPosition(
            () => { }, // No-op for success
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    setLocationDenied(true);
                }
            }
        );
    }, []);

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    if (!locationDenied) return null;

    /////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <div className="bg-green-600 text-white font-medium p-2 pr-5 mt-4 mb-2 text-sm overflow-hidden whitespace-nowrap relative flex items-center">
            <div
                className="relative flex items-center gap-2 flex-1"
                style={{ animation: 'scrollText 30s linear infinite' }}
            >
                <span>
                    {typeof t === 'function' ? t('locationAccessDeniedBanner') : 'Location access was denied.'}
                </span>
            </div>

            <style jsx>{`
                @keyframes scrollText {
                    0% {
                        transform: translateX(10%);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
            `}</style>
        </div>
    );
};

export default LocationDeniedBanner;
