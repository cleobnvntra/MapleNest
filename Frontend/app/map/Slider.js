"use client";
import { Carousel, IconButton } from "@material-tailwind/react";

export default function ImageSlider({ images }) {
  console.log(images);

  return (
    <Carousel
      className="rounded-md w-full h-full"
      prevArrow={({ handlePrev }) => (
        <IconButton
          variant="text"
          color="white"
          size="lg"
          onClick={handlePrev}
          className="!absolute top-2/4 left-4 -translate-y-2/4"
        >
          <div
            className="flex items-center justify-center p-3"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </div>
        </IconButton>
      )}
      nextArrow={({ handleNext }) => (
        <IconButton
          variant="text"
          color="white"
          size="lg"
          onClick={handleNext}
          className="!absolute top-2/4 !right-4 -translate-y-2/4"
        >
          <div
            className="flex items-center justify-center p-3"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.8)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </div>
        </IconButton>
      )}
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              style={
                activeIndex === i
                  ? {
                      backgroundColor: "white",
                    }
                  : {
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                    }
              }
              className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] w-4`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
    >
      {images.map((src, index) => (
        <div className=" w-full h-full">
          <img src={src} alt={index} className="h-full w-full object-cover" />
        </div>
      ))}
    </Carousel>
  );
}
