"use client";

import React, { useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import hoverAnimation from "@/icons/warn.json"; // تأكد من المسار حسب مشروعك

const LottieHover: React.FC = () => {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const handleMouseEnter = () => {
    lottieRef.current?.play();
  };

  const handleMouseLeave = () => {
    lottieRef.current?.stop();
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-40 h-40 cursor-pointer"
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={hoverAnimation}
        loop={false}
        autoplay={false}
      />
    </div>
  );
};

export default LottieHover;
