import React from "react";

const Loader = () => {
  return (
    <>
      <style jsx global>{`
        .website-loader {
          --fill-color: #5c3d99;
          --shine-color: #5c3d9933;
          transform: scale(0.5);
          width: 100px;
          height: auto;
          position: relative;
          filter: drop-shadow(0 0 10px var(--shine-color));
        }

        .website-loader #pegtopone {
          position: absolute;
          animation: flowe-one 1s linear infinite;
        }

        .website-loader #pegtoptwo {
          position: absolute;
          opacity: 0;
          transform: scale(0) translateY(-200px) translateX(-100px);
          animation: flowe-two 1s linear infinite;
          animation-delay: 0.3s;
        }

        .website-loader #pegtopthree {
          position: absolute;
          opacity: 0;
          transform: scale(0) translateY(-200px) translateX(100px);
          animation: flowe-three 1s linear infinite;
          animation-delay: 0.6s;
        }

        .website-loader svg g path:first-child {
          fill: var(--fill-color);
        }

        @keyframes flowe-one {
          0% {
            transform: scale(0.5) translateY(-200px);
            opacity: 0;
          }
          25% {
            transform: scale(0.75) translateY(-100px);
            opacity: 1;
          }
          50% {
            transform: scale(1) translateY(0px);
            opacity: 1;
          }
          75% {
            transform: scale(0.5) translateY(50px);
            opacity: 1;
          }
          100% {
            transform: scale(0) translateY(100px);
            opacity: 0;
          }
        }

        @keyframes flowe-two {
          0% {
            transform: scale(0.5) rotateZ(-10deg) translateY(-200px) translateX(-100px);
            opacity: 0;
          }
          25% {
            transform: scale(1) rotateZ(-5deg) translateY(-100px) translateX(-50px);
            opacity: 1;
          }
          50% {
            transform: scale(1) rotateZ(0deg) translateY(0px) translateX(-25px);
            opacity: 1;
          }
          75% {
            transform: scale(0.5) rotateZ(5deg) translateY(50px) translateX(0px);
            opacity: 1;
          }
          100% {
            transform: scale(0) rotateZ(10deg) translateY(100px) translateX(25px);
            opacity: 0;
          }
        }

        @keyframes flowe-three {
          0% {
            transform: scale(0.5) rotateZ(10deg) translateY(-200px) translateX(100px);
            opacity: 0;
          }
          25% {
            transform: scale(1) rotateZ(5deg) translateY(-100px) translateX(50px);
            opacity: 1;
          }
          50% {
            transform: scale(1) rotateZ(0deg) translateY(0px) translateX(25px);
            opacity: 1;
          }
          75% {
            transform: scale(0.5) rotateZ(-5deg) translateY(50px) translateX(0px);
            opacity: 1;
          }
          100% {
            transform: scale(0) rotateZ(-10deg) translateY(100px) translateX(-25px);
            opacity: 0;
          }
        }
      `}</style>
      <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
        <div className="website-loader">
          <svg
            id="pegtopone"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 100 100"
          >
            <defs>
              <filter id="shine-one">
                <feGaussianBlur stdDeviation="3"></feGaussianBlur>
              </filter>
              <mask id="mask-one">
                <path
                  d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                  fill="white"
                ></path>
              </mask>
              <radialGradient
                id="gradient-1-one"
                cx="50"
                cy="66"
                fx="50"
                fy="66"
                r="30"
                gradientTransform="translate(0 35) scale(1 0.5)"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="black" stopOpacity="0.3"></stop>
                <stop offset="50%" stopColor="black" stopOpacity="0.1"></stop>
                <stop offset="100%" stopColor="black" stopOpacity="0"></stop>
              </radialGradient>
              <radialGradient
                id="gradient-2-one"
                cx="55"
                cy="20"
                fx="55"
                fy="20"
                r="30"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="white" stopOpacity="0.3"></stop>
                <stop offset="50%" stopColor="white" stopOpacity="0.1"></stop>
                <stop offset="100%" stopColor="white" stopOpacity="0"></stop>
              </radialGradient>
              <radialGradient
                id="gradient-3-one"
                cx="85"
                cy="50"
                fx="85"
                fy="50"
                xlinkHref="#gradient-2-one"
              ></radialGradient>
              <radialGradient
                id="gradient-4-one"
                cx="50"
                cy="58"
                fx="50"
                fy="58"
                r="60"
                gradientTransform="translate(0 47) scale(1 0.2)"
                xlinkHref="#gradient-3-one"
              ></radialGradient>
              <linearGradient
                id="gradient-5-one"
                x1="50"
                y1="90"
                x2="50"
                y2="10"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="black" stopOpacity="0.2"></stop>
                <stop offset="40%" stopColor="black" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <g>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="currentColor"
              ></path>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="url(#gradient-1-one)"
              ></path>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="none"
                stroke="white"
                opacity="0.3"
                strokeWidth="3"
                filter="url(#shine-one)"
                mask="url(#mask-one)"
              ></path>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="url(#gradient-2-one)"
              ></path>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="url(#gradient-3-one)"
              ></path>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="url(#gradient-4-one)"
              ></path>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="url(#gradient-5-one)"
              ></path>
            </g>
          </svg>
          <svg
            id="pegtoptwo"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 100 100"
          >
            <defs>
              <filter id="shine-two">
                <feGaussianBlur stdDeviation="3"></feGaussianBlur>
              </filter>
              <mask id="mask-two">
                <path
                  d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                  fill="white"
                ></path>
              </mask>
              <radialGradient
                id="gradient-1-two"
                cx="50"
                cy="66"
                fx="50"
                fy="66"
                r="30"
                gradientTransform="translate(0 35) scale(1 0.5)"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="black" stopOpacity="0.3"></stop>
                <stop offset="50%" stopColor="black" stopOpacity="0.1"></stop>
                <stop offset="100%" stopColor="black" stopOpacity="0"></stop>
              </radialGradient>
              <radialGradient
                id="gradient-2-two"
                cx="55"
                cy="20"
                fx="55"
                fy="20"
                r="30"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="white" stopOpacity="0.3"></stop>
                <stop offset="50%" stopColor="white" stopOpacity="0.1"></stop>
                <stop offset="100%" stopColor="white" stopOpacity="0"></stop>
              </radialGradient>
              <radialGradient
                id="gradient-3-two"
                cx="85"
                cy="50"
                fx="85"
                fy="50"
                xlinkHref="#gradient-2-two"
              ></radialGradient>
              <radialGradient
                id="gradient-4-two"
                cx="50"
                cy="58"
                fx="50"
                fy="58"
                r="60"
                gradientTransform="translate(0 47) scale(1 0.2)"
                xlinkHref="#gradient-3-two"
              ></radialGradient>
              <linearGradient
                id="gradient-5-two"
                x1="50"
                y1="90"
                x2="50"
                y2="10"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="black" stopOpacity="0.2"></stop>
                <stop offset="40%" stopColor="black" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <g>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="currentColor"
              ></path>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="url(#gradient-1-two)"
              ></path>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="none"
                stroke="white"
                opacity="0.3"
                strokeWidth="3"
                filter="url(#shine-two)"
                mask="url(#mask-two)"
              ></path>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="url(#gradient-2-two)"
              ></path>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="url(#gradient-3-two)"
              ></path>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="url(#gradient-4-two)"
              ></path>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="url(#gradient-5-two)"
              ></path>
            </g>
          </svg>
          <svg
            id="pegtopthree"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 100 100"
          >
            <defs>
              <filter id="shine-three">
                <feGaussianBlur stdDeviation="3"></feGaussianBlur>
              </filter>
              <mask id="mask-three">
                <path
                  d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                  fill="white"
                ></path>
              </mask>
              <radialGradient
                id="gradient-1-three"
                cx="50"
                cy="66"
                fx="50"
                fy="66"
                r="30"
                gradientTransform="translate(0 35) scale(1 0.5)"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="black" stopOpacity="0.3"></stop>
                <stop offset="50%" stopColor="black" stopOpacity="0.1"></stop>
                <stop offset="100%" stopColor="black" stopOpacity="0"></stop>
              </radialGradient>
              <radialGradient
                id="gradient-2-three"
                cx="55"
                cy="20"
                fx="55"
                fy="20"
                r="30"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="white" stopOpacity="0.3"></stop>
                <stop offset="50%" stopColor="white" stopOpacity="0.1"></stop>
                <stop offset="100%" stopColor="white" stopOpacity="0"></stop>
              </radialGradient>
              <radialGradient
                id="gradient-3-three"
                cx="85"
                cy="50"
                fx="85"
                fy="50"
                xlinkHref="#gradient-2-three"
              ></radialGradient>
              <radialGradient
                id="gradient-4-three"
                cx="50"
                cy="58"
                fx="50"
                fy="58"
                r="60"
                gradientTransform="translate(0 47) scale(1 0.2)"
                xlinkHref="#gradient-3-three"
              ></radialGradient>
              <linearGradient
                id="gradient-5-three"
                x1="50"
                y1="90"
                x2="50"
                y2="10"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="black" stopOpacity="0.2"></stop>
                <stop offset="40%" stopColor="black" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <g>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="currentColor"
              ></path>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="url(#gradient-1-three)"
              ></path>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="none"
                stroke="white"
                opacity="0.3"
                strokeWidth="3"
                filter="url(#shine-three)"
                mask="url(#mask-three)"
              ></path>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="url(#gradient-2-three)"
              ></path>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="url(#gradient-3-three)"
              ></path>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="url(#gradient-4-three)"
              ></path>
              <path
                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                fill="url(#gradient-5-three)"
              ></path>
            </g>
          </svg>
        </div>
      </div>
    </>
  );
};

export default Loader;
