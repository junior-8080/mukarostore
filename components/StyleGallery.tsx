"use client";

import Image from "next/image";

const GALLERY = [
  "/landingPage/clientStyle/img01.JPG",
  "/landingPage/clientStyle/IMG_6110.JPG",
  "/landingPage/clientStyle/IMG_8743.JPG",
  "/landingPage/clientStyle/img03.JPG",
  "/landingPage/clientStyle/img04.JPG",
  "/landingPage/clientStyle/img05.jpeg",
  "/landingPage/clientStyle/IMG_1878.JPG"
];

export default function StyleGallery() {
  return (
    <section className="pt-20 pb-14">
      <div className="text-center mb-9 px-6">
        <h2 className="font-serif italic text-3xl sm:text-4xl text-brand-black">
          How She Wears Sutura
        </h2>
        <p className="text-[13px] text-brand-black/50 mt-1.5">
          Real clients, styled with poise —{" "}
          <a
            href="https://instagram.com/suturabyfeesah"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-gold-dark hover:text-brand-gold transition-colors"
          >
            tag @suturabyfeesah
          </a>
        </p>
      </div>

      <div className="overflow-x-auto no-scrollbar px-6 lg:px-12">
        <div className="flex gap-4 w-max mx-auto">
          {GALLERY.map((src, i) => (
            <div
              key={src}
              className="relative w-[190px] h-[240px] flex-none rounded overflow-hidden bg-brand-ivory"
            >
              <Image
                src={src}
                alt={`Sutura by Feesah client style ${i + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
                sizes="190px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}