import React from "react";

interface TurnLoaderProps {
  message?: string;
}

const TurnLoader: React.FC<TurnLoaderProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="loader-turn">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <defs>
            <mask id="turn-loader-clipping">
              <polygon points="0,0 100,0 100,100 0,100" fill="black"></polygon>
              <polygon points="25,25 75,25 50,75" fill="white"></polygon>
              <polygon points="50,25 75,75 25,75" fill="white"></polygon>
              <polygon points="35,35 65,35 50,65" fill="white"></polygon>
              <polygon points="35,35 65,35 50,65" fill="white"></polygon>
              <polygon points="35,35 65,35 50,65" fill="white"></polygon>
              <polygon points="35,35 65,35 50,65" fill="white"></polygon>
            </mask>
          </defs>
        </svg>
        <div className="turn-loader-box"></div>
      </div>

      {message && (
        <p className="mt-6 text-sm font-medium text-white text-center px-4">
          {message}
        </p>
      )}

      <style jsx global>{`
        .loader-turn {
          --color-one: #ffbf48;
          --color-two: #be4a1d;
          --color-three: #ffbf4780;
          --color-four: #bf4a1d80;
          --color-five: #ffbf4740;
          --time-animation: 2s;
          --size: 0.9;
          position: relative;
          border-radius: 50%;
          transform: scale(var(--size));
          box-shadow:
            0 0 25px 0 var(--color-three),
            0 20px 50px 0 var(--color-four);
          animation: turn-loader-colorize calc(var(--time-animation) * 3)
            ease-in-out infinite;
        }

        .loader-turn::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border-top: solid 1px var(--color-one);
          border-bottom: solid 1px var(--color-two);
          background: linear-gradient(180deg, var(--color-five), var(--color-four));
          box-shadow:
            inset 0 10px 10px 0 var(--color-three),
            inset 0 -10px 10px 0 var(--color-four);
        }

        .loader-turn .turn-loader-box {
          width: 100px;
          height: 100px;
          background: linear-gradient(
            180deg,
            var(--color-one) 30%,
            var(--color-two) 70%
          );
          mask: url(#turn-loader-clipping);
          -webkit-mask: url(#turn-loader-clipping);
        }

        .loader-turn svg {
          position: absolute;
        }

        .loader-turn svg #turn-loader-clipping {
          filter: contrast(15);
          animation: turn-loader-roundness
            calc(var(--time-animation) / 2)
            linear
            infinite;
        }

        .loader-turn svg #turn-loader-clipping polygon {
          filter: blur(7px);
        }

        .loader-turn svg #turn-loader-clipping polygon:nth-child(1) {
          transform-origin: 75% 25%;
          transform: rotate(90deg);
        }

        .loader-turn svg #turn-loader-clipping polygon:nth-child(2) {
          transform-origin: 50% 50%;
          animation: turn-loader-rotation var(--time-animation) linear infinite
            reverse;
        }

        .loader-turn svg #turn-loader-clipping polygon:nth-child(3) {
          transform-origin: 50% 60%;
          animation: turn-loader-rotation var(--time-animation) linear infinite;
          animation-delay: calc(var(--time-animation) / -3);
        }

        .loader-turn svg #turn-loader-clipping polygon:nth-child(4) {
          transform-origin: 40% 40%;
          animation: turn-loader-rotation var(--time-animation) linear infinite
            reverse;
        }

        .loader-turn svg #turn-loader-clipping polygon:nth-child(5) {
          transform-origin: 40% 40%;
          animation: turn-loader-rotation var(--time-animation) linear infinite
            reverse;
          animation-delay: calc(var(--time-animation) / -2);
        }

        .loader-turn svg #turn-loader-clipping polygon:nth-child(6) {
          transform-origin: 60% 40%;
          animation: turn-loader-rotation var(--time-animation) linear infinite;
        }

        .loader-turn svg #turn-loader-clipping polygon:nth-child(7) {
          transform-origin: 60% 40%;
          animation: turn-loader-rotation var(--time-animation) linear infinite;
          animation-delay: calc(var(--time-animation) / -1.5);
        }

        @keyframes turn-loader-rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes turn-loader-roundness {
          0% {
            filter: contrast(15);
          }
          20% {
            filter: contrast(3);
          }
          40% {
            filter: contrast(3);
          }
          60% {
            filter: contrast(15);
          }
          100% {
            filter: contrast(15);
          }
        }

        @keyframes turn-loader-colorize {
          0% {
            filter: hue-rotate(0deg);
          }
          20% {
            filter: hue-rotate(-30deg);
          }
          40% {
            filter: hue-rotate(-60deg);
          }
          60% {
            filter: hue-rotate(-90deg);
          }
          80% {
            filter: hue-rotate(-45deg);
          }
          100% {
            filter: hue-rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
};

export default TurnLoader;


