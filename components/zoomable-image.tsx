"use client";

import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { AnimatePresence, motion, spring } from "motion/react";
import type { ImageProps } from "next/image";
import Image from "next/image";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface Position {
  x: number;
  y: number;
}

interface ZoomableImageProps extends ImageProps {
  images?: Array<{ url: string; alt: string }>;
  currentImageIndex?: number;
  onImageChange?: (index: number) => void;
}

const MotionImage = motion.create(Image);

export const ZoomableImage: React.FC<ZoomableImageProps> = ({
  src,
  alt,
  images = [],
  currentImageIndex = 0,
  onImageChange,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [currentIndex, setCurrentIndex] = useState<number>(currentImageIndex);
  const [isMounted, setIsMounted] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update current index when prop changes
  useEffect(() => {
    setCurrentIndex(currentImageIndex);
  }, [currentImageIndex]);

  // Reset zoom and position when modal opens
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          setIsOpen(false);
          break;
        case "=":
        case "+":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
        case "0":
          handleReset();
          break;
        case "ArrowLeft":
          handlePreviousImage();
          break;
        case "ArrowRight":
          handleNextImage();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, scale, currentIndex]);

  const handleZoomIn = (): void => {
    setScale((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = (): void => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = (): void => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handlePreviousImage = (): void => {
    if (images.length > 1) {
      const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
      setCurrentIndex(newIndex);
      onImageChange?.(newIndex);
      handleReset();
    }
  };

  const handleNextImage = (): void => {
    if (images.length > 1) {
      const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
      setCurrentIndex(newIndex);
      onImageChange?.(newIndex);
      handleReset();
    }
  };

  const handleThumbnailClick = (index: number): void => {
    setCurrentIndex(index);
    onImageChange?.(index);
    handleReset();
  };

  // Direction-aware zoom based on mouse position
  const handleZoomAtPoint = (
    clientX: number,
    clientY: number,
    zoomIn: boolean
  ): void => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = clientX - centerX;
    const mouseY = clientY - centerY;

    const newScale = zoomIn
      ? Math.min(scale + 0.2, 2)
      : Math.max(scale - 0.2, 0.5);

    if (newScale !== scale) {
      const scaleDiff = newScale - scale;
      const newX = position.x - (mouseX * scaleDiff) / scale;
      const newY = position.y - (mouseY * scaleDiff) / scale;

      setScale(newScale);
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseDown = (e: React.MouseEvent): void => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent): void => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = (): void => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent): void => {
    if (!isOpen) return;
    e.preventDefault();

    const zoomIn = e.deltaY < 0;
    handleZoomAtPoint(e.clientX, e.clientY, zoomIn);
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const imageVariants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: spring,
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  const currentImage =
    images.length > 0 ? images[currentIndex] : { url: src, alt };

  return (
    <>
      <motion.div
        className="cursor-zoom-in"
        onClick={() => setIsOpen(true)}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Image src={currentImage.url} alt={currentImage.alt} {...props} />
      </motion.div>

      {isMounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="bg-opacity-95 bg-background fixed inset-0 z-50 flex"
                onClick={(e) =>
                  e.target === e.currentTarget && setIsOpen(false)
                }
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                  <div className="hidden bg-background/80 w-24 overflow-y-auto backdrop-blur-sm">
                    <div className="flex h-full flex-col items-center justify-center space-y-2 p-2">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => handleThumbnailClick(index)}
                          className={cn(
                            "relative aspect-square w-full overflow-hidden rounded-none border-2 transition-all",
                            currentIndex === index
                              ? "border-primary ring-primary/20 ring-2"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main Image Area */}
                <div className="relative flex-1">
                  <div className="absolute top-3 right-4 z-60 flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size={"icon"}
                      onClick={() => {
                        if (scale === 1) {
                          setScale(2);
                        } else {
                          setScale(1);
                          setPosition({ x: 0, y: 0 });
                        }
                      }}
                    >
                      {scale === 1 ? <Maximize2 /> : <Minimize2 />}
                    </Button>
                    <Button
                      onClick={() => setIsOpen(false)}
                      variant="ghost"
                      size={"icon"}
                    >
                      <X />
                    </Button>
                  </div>

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 left-4 z-60 -translate-y-1/2"
                        onClick={handlePreviousImage}
                      >
                        <ChevronLeft />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1/2 right-4 z-60 -translate-y-1/2"
                        onClick={handleNextImage}
                      >
                        <ChevronRight />
                      </Button>
                    </>
                  )}

                  <motion.div
                    ref={containerRef}
                    className="relative flex h-full w-full items-center justify-center overflow-hidden"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                    style={{
                      cursor:
                        scale > 1
                          ? isDragging
                            ? "grabbing"
                            : "grab"
                          : "default",
                    }}
                    variants={imageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <MotionImage
                      ref={imageRef}
                      src={currentImage.url}
                      alt={currentImage.alt}
                      fill
                      className="h-auto w-auto object-contain"
                      animate={{
                        x: position.x,
                        y: position.y,
                        scale: scale,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        duration: 0.3,
                      }}
                      draggable={false}
                    />
                  </motion.div>

                  <div className="absolute bottom-4 left-1/2 z-60 flex -translate-x-1/2 items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handleZoomOut}>
                      <ZoomOut />
                    </Button>
                    <span className="px-2 text-sm">
                      {Math.round(scale * 100)}%
                    </span>
                    <Button variant="ghost" size="icon" onClick={handleZoomIn}>
                      <ZoomIn />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};
