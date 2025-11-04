'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Image from 'next/image';

const ImageCarouselDialog = ({
  images,
  title = '',
  trigger,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-6xl w-full bg-[#ababab]">
        <DialogHeader>
          <DialogTitle className="items-center text-center text-[15px] md:text-[20px] text-[#002e6e] font-poppins font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2">
              {images.map((src, index) => (
                <CarouselItem
                  key={index}
                  className="pl-2 basis-full sm:basis-1/2 lg:basis-1/4"
                >
                  <div className="relative h-72 w-full rounded-xl overflow-hidden">
                    <Image
                      src={src}
                      fill
                      alt={`Ambulance ${index}`}
                      className="object-cover border-white border rounded-xl  "
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-white" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white hover:bg-white" />
          </Carousel>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCarouselDialog;
