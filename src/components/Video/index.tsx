"use client";

import { useState } from "react";
import SectionTitle from "../common/Common/SectionTitle";

const Video = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="relative z-10 py-16 md:py-20 lg:py-28">
      <div className="container">
        <SectionTitle
          title="Learn to Play "
          paragraph="Discover how startup decisions shape real business outcomes. 
          Learn to play by launching tasks, hiring smart, and mastering metrics that matter."
          center
          mb="80px"
        />

        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div
              className="wow fadeInUp mx-auto max-w-[970px] overflow-hidden rounded-md"
              data-wow-delay=".15s"
            >
              <div className="relative aspect-[87/40] items-center justify-center">
                {!isPlaying && (
                  <>
                    <video
                      src="/play.mp4"
                      className="h-full w-full object-cover rounded-md"
                      preload="metadata"
                      muted
                      loop
                      playsInline
                      poster="/demo.png"
                    />
                    <div className="absolute right-0 top-0 flex h-full w-full items-center justify-center">
                      <button
                        aria-label="video play button"
                        onClick={() => setIsPlaying(true)}
                        className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white bg-opacity-75 text-primary transition hover:bg-opacity-100"
                      >
                        <svg
                          width="16"
                          height="18"
                          viewBox="0 0 16 18"
                          className="fill-current"
                        >
                          <path d="M15.5 8.13397C16.1667 8.51888 16.1667 9.48112 15.5 9.86602L2 17.6603C1.33333 18.0452 0.499999 17.564 0.499999 16.7942L0.5 1.20577C0.5 0.43597 1.33333 -0.0451549 2 0.339745L15.5 8.13397Z" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
                {isPlaying && (
                  <video
                    src="/play.mp4"
                    className="h-full w-full object-cover rounded-md"
                    controls
                    autoPlay
                    playsInline
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-[-1] h-full w-full  bg-cover bg-center bg-no-repeat"></div>
    </section>
  );
};

export default Video;
