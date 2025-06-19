"use client";

import type React from "react";

import { useState, useRef } from "react";
import UploadImagePreview from "./UploadImagePreview";

interface ImageCarouselProps {
  uploadedFiles: Array<File | null>;
  removeImageFromUploadList: (file: File) => void;
}

export default function ImageCarousel({
  uploadedFiles,
  removeImageFromUploadList,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;

    const diff = clientX - startX;
    setTranslateX(diff);
  };

  const handleEnd = () => {
    if (!isDragging) return;

    const threshold = 50;

    if (translateX > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (
      translateX < -threshold &&
      currentIndex < uploadedFiles?.length - 1
    ) {
      setCurrentIndex(currentIndex + 1);
    }

    setIsDragging(false);
    setTranslateX(0);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Dot click handler
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleDelete = (
    index: number,
    e: React.MouseEvent,
    uploadedFile: File
  ) => {
    e.stopPropagation();
    removeImageFromUploadList(uploadedFile);
    // Adjust current index if needed
    if (index === currentIndex && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (index < currentIndex) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Prevent context menu on long press
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Carousel Container */}
      <div className="relative overflow-hidden bg-white border-2">
        <div
          ref={carouselRef}
          className="flex transition-transform duration-300 ease-out cursor-grab active:cursor-grabbing"
          style={{
            transform: `translateX(${
              -currentIndex * 100 +
              (isDragging
                ? (translateX / (carouselRef.current?.offsetWidth || 1)) * 100
                : 0)
            }%)`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={isDragging ? handleMouseMove : undefined}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onContextMenu={handleContextMenu}
        >
          {uploadedFiles?.map((uploadedFile, index) => {
            if (!uploadedFile) {
              return;
            }
            const imageLocalUrl = URL.createObjectURL(uploadedFile);
            return (
              <div
                key={index}
                className="w-full flex-shrink-0 relative group max-sm:pt-7"
              >
                <UploadImagePreview uploadedImageUrl={imageLocalUrl} />

                {/* Neo-Brutalist Delete Button */}
                <button
                  onClick={(e) => handleDelete(index, e, uploadedFile)}
                  className="absolute top-4 right-4 max-sm:top-1 max-sm:right-1.5 w-12 h-12 max-sm:w-7 max-sm:h-7 bg-red-500 border-3 max-sm:border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:shadow-[1px_1px_0px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 flex items-center justify-center opacity-100 font-bold"
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  aria-label={`Delete image ${index + 1}`}
                >
                  <svg
                    className="w-6 h-6 max-sm:w-4 max-sm:h-4 text-white stroke-[3] max-sm:stroke-[1]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        {uploadedFiles?.length > 1 && (
          <>
            <button
              onClick={() =>
                currentIndex > 0 && setCurrentIndex(currentIndex - 1)
              }
              className={`absolute left-4 max-sm:left-2 top-1/2 -translate-y-1/8 bg-yellow-400 border-3 border-black shadow-[1px_1px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 p-3 max-sm:p-1 font-bold ${
                currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentIndex === 0}
            >
              <svg
                className="w-6 h-6 text-black stroke-[3]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() =>
                currentIndex < uploadedFiles?.length - 1 &&
                setCurrentIndex(currentIndex + 1)
              }
              className={`absolute right-4 max-sm:right-2 top-1/2 -translate-y-1/8 bg-yellow-400 border-3 border-black shadow-[1px_1px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-150 p-3 max-sm:p-1 font-bold ${
                currentIndex === uploadedFiles?.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={currentIndex === uploadedFiles?.length - 1}
            >
              <svg
                className="w-6 h-6 text-black stroke-[3]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dot Indicators */}
      {uploadedFiles?.length > 1 && (
        <div className="flex justify-center space-x-4 mt-8">
          {uploadedFiles?.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-6 h-6 border-2 border-black transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px] ${
                index === currentIndex
                  ? "bg-black shadow-none"
                  : "bg-white active:shadow-none"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
