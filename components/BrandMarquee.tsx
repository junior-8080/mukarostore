const PHRASES = [
  "The Feesaheffect",
  "Bespoke tailoring, Accra-made",
  "Modest wear, elevated",
  "Bridal ready",
  "Eid ready",
  "Made to measure",
  "Worn with confidence",
  "Designed in Accra",
];

export default function BrandMarquee() {
  return (
    <div className="bg-brand-black py-4 overflow-hidden whitespace-nowrap">
      <div className="inline-flex animate-marquee">
        {[...PHRASES, ...PHRASES].map((phrase, i) => (
          <span
            key={i}
            className="inline-flex items-center text-brand-gold text-[13px] tracking-[0.5px] px-7"
          >
            <span className="w-[5px] h-[5px] rounded-full bg-brand-gold mr-7" />
            {phrase}
          </span>
        ))}
      </div>
    </div>
  );
}