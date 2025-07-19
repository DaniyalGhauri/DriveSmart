'use client';
import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const teamMembers = [
  { id: 1, name: 'Ali Khan', role: 'CEO', image: '/team/ali.jpg' },
  { id: 2, name: 'Ayesha Tariq', role: 'Marketing Head', image: '/team/ayesha.jpg' },
  { id: 3, name: 'Bilal Ahmed', role: 'Lead Developer', image: '/team/bilal.jpg' },
  { id: 4, name: 'Sarah Malik', role: 'UI/UX Designer', image: '/team/sarah.jpg' },
  { id: 5, name: 'Hamza Riaz', role: 'Project Manager', image: '/team/hamza.jpg' },
];

const OurTeam = () => {
  return (
    <div className=" bg-gradient-to-br from-white via-white-100 to-green-200 p-10">
      <h2 className="text-4xl font-bold text-gray-800 text-center mb-6">Meet Our Team</h2>
      <div className="container mx-auto">
        <Swiper
           slidesPerView={2}
           breakpoints={{
             640: { slidesPerView: 3 },
             768: { slidesPerView: 4 },
             1024: { slidesPerView: 5 },
          }}
          loop={true}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          modules={[Autoplay]}
          className="flex items-center justify-center"
        >
          {teamMembers.map((member) => (
            <SwiperSlide key={member.id} className="flex flex-col items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 lg:w-35 lg:h-35 flex items-center justify-center rounded-full bg-white shadow-lg">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover rounded-full"
                  priority
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mt-3">{member.name}</h3>
              <p className="text-sm text-gray-600">{member.role}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default OurTeam;
