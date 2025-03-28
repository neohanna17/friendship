import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface Image {
  src: string;
  alt: string;
}

interface GalleryCarouselProps {
  images: Image[];
  className?: string;
  aspectRatio?: "square" | "video" | "wide" | "auto";
  autoplay?: boolean;
  interval?: number;
}

const GalleryCarousel = ({
  images,
  className = "",
  aspectRatio = "square",
  autoplay = false,
  interval = 5000,
}: GalleryCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || !autoplay) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api, autoplay, interval]);

  if (!images || images.length === 0) {
    return null;
  }

  const aspectRatioClass = 
    aspectRatio === "square" ? "aspect-square" :
    aspectRatio === "video" ? "aspect-video" :
    aspectRatio === "wide" ? "aspect-[16/9]" : "";

  const handleImageClick = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  return (
    <>
      <Carousel setApi={setApi} className={className}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div 
                className={`overflow-hidden rounded-md ${aspectRatioClass}`}
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover cursor-pointer transition-transform hover:scale-105"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      <div className="flex justify-center mt-2">
        {images.map((_, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className={`w-2 h-2 rounded-full p-0 mx-1 ${
              current === index ? "bg-primary" : "bg-muted"
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>

      {/* Modal for fullscreen image viewing */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-5xl p-0 bg-transparent border-none">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-50 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={() => setModalOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            <Carousel defaultIndex={modalIndex}>
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="flex items-center justify-center">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="max-h-[80vh] max-w-full object-contain"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryCarousel;