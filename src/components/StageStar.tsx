import React from "react";

interface StageStarProps {
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
}

const StageStar: React.FC<StageStarProps> = ({
  isActive,
  isCompleted,
  isLocked,
}) => {
  const baseGlow =
    "absolute inset-0 rounded-full blur-lg bg-gradient-to-r from-[#FAA2FF] via-[#FF8EEE] to-[#7A38FF]";

  return (
    <div className="relative flex items-center justify-center">
      {(isActive || isCompleted) && (
        <span
          className={`${baseGlow} opacity-70`}
          aria-hidden="true"
        />
      )}
      <svg
        width="35"
        height="35"
        viewBox="0 0 35 35"
        xmlns="http://www.w3.org/2000/svg"
        className={`relative h-7 w-7 drop-shadow-md ${
          isLocked ? "opacity-40" : "opacity-100"
        }`}
      >
        <defs>
          <linearGradient
            id="stage-star-gradient"
            x1="9.55709"
            y1="32.0524"
            x2="38.4765"
            y2="-0.153282"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FAA2FF" />
            <stop offset="1" stopColor="#7A38FF" />
          </linearGradient>
        </defs>
        <path
          d="M3.39462 22.5879C-1.1314 20.406 -1.1314 13.9602 3.39462 11.7783L7.16262 9.9619C8.38553 9.37237 9.37236 8.38553 9.9619 7.16262L11.7783 3.39462C13.9602 -1.1314 20.406 -1.1314 22.5879 3.39462L24.4043 7.16262C24.9938 8.38553 25.9807 9.37237 27.2036 9.9619L30.9716 11.7783C35.4976 13.9602 35.4976 20.406 30.9716 22.5879L27.2036 24.4043C25.9807 24.9938 24.9938 25.9807 24.4043 27.2036L22.5879 30.9716C20.406 35.4976 13.9602 35.4976 11.7783 30.9716L9.9619 27.2036C9.37236 25.9807 8.38553 24.9938 7.16262 24.4043L3.39462 22.5879Z"
          fill="url(#stage-star-gradient)"
        />
      </svg>
    </div>
  );
};

export default StageStar;

