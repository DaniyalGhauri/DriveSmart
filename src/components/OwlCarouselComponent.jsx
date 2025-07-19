'use client';
import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

const logos = [
  '/logo1.jpg',
  '/logo2.jpg',
  '/logo3.jpg',
  '/logo4.jpg',
  '/logo5.jpg',
  '/logo6.png',
];

const OwlCarouselComponent = () => {
  return (
    <div className="bg-green-200 py-10">
      <h1 className='text-3xl flex items-center justify-center m-11 font-extrabold text-gray-900'>Who we help</h1>
      <div className="container mx-auto">
        <Swiper
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
          loop={true}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          modules={[Autoplay]}
          className="flex items-center justify-center"
        >
          {logos.map((logo, index) => (
            <SwiperSlide key={index} className="flex justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 lg:w-35 lg:h-35 flex items-center justify-center rounded-full bg-white shadow-lg">
                <Image
                  src={logo}
                  alt={`Logo ${index}`}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover rounded-full"
                  priority
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default OwlCarouselComponent;
