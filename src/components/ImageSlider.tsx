"use client";

import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/pagination";

interface ImageSliderProps {
    images: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
    const [currentSlide, setCurrentSlide] = useState(1);
    const swiperRef = useRef<any>(null);

    return (
        <>
            <Swiper
                onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex + 1)}
                modules={[Pagination]}
                className="w-full h-[400px]"
                ref={swiperRef}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index} className="relative w-full h-[500px] bg-gray-100">
                        <Image src={image} alt={`Slide ${index}`} fill style={{ objectFit: "contain" }} />
                        {/* Slide count display */}
                        <div className="absolute top-2 right-2 bg-gray-500 rounded-full p-1.5 py-0.5 text-white text-[8px] border-2">
                            {index + 1} / {images.length}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="flex justify-center gap-2">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`w-1 h-1 rounded-full cursor-pointer ${currentSlide === index + 1 ? "bg-green-500" : "bg-gray-300"}`}
                        onClick={() => swiperRef.current?.swiper.slideTo(index)}
                    />
                ))}
            </div>
        </>
    );
};

export default ImageSlider;