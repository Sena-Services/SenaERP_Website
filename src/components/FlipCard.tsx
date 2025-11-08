"use client";

type FlipCardProps = {
  cardWidth: number;
  currentWidthValue: number;
  cardGap: number;
  borderRadius: number;
  elevation: string;
  splitProgress: number;
  rotateProgress: number;
  position: "left" | "center" | "right";
  imageOffset: number;
  videoSrc: string;
  videoBg: string;
  videoPosition: string;
  cardNumber: number;
  cardTitle: string;
  cardDescription: string;
};

export default function FlipCard({
  cardWidth,
  currentWidthValue,
  cardGap,
  borderRadius,
  elevation,
  splitProgress,
  rotateProgress,
  position,
  imageOffset,
  videoSrc,
  videoBg,
  videoPosition,
  cardNumber,
  cardTitle,
  cardDescription,
}: FlipCardProps) {
  const borderRadiusStyle =
    position === "left"
      ? {
          borderTopLeftRadius: `${borderRadius}px`,
          borderBottomLeftRadius: `${borderRadius}px`,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }
      : position === "right"
      ? {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderTopRightRadius: `${borderRadius}px`,
          borderBottomRightRadius: `${borderRadius}px`,
        }
      : { borderRadius: 0 };

  return (
    <div
      className="relative"
      style={{
        width: `${cardWidth}px`,
        height: "100%",
        boxShadow: splitProgress > 0 ? elevation : "none",
        transform: `rotateY(${rotateProgress * 180}deg)`,
        transformStyle: "preserve-3d",
        transition: "width 300ms ease-out, box-shadow 200ms ease, transform 600ms ease-out",
      }}
    >
      {/* Front face - Monet image */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          backfaceVisibility: "hidden",
          backgroundColor: "#EBE5D9",
          ...borderRadiusStyle,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: `${imageOffset}px`,
            width: `${currentWidthValue}px`,
            height: "100%",
          }}
        >
          <img
            src="/illustrations/monet-intro-expanded2.png"
            alt="Monet painting"
            className="absolute inset-0 w-full h-full object-cover object-center md:object-right"
            style={{
              opacity: 0.95,
            }}
          />
        </div>
      </div>

      {/* Back face - How It Works card */}
      <div
        className="absolute inset-0 overflow-hidden flex flex-col border border-blue-200/40 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          ...borderRadiusStyle,
        }}
      >
        <div className={`relative w-full ${videoBg}`} style={{ aspectRatio: "1/1" }}>
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-70 transition-opacity duration-300 hover:opacity-100"
            style={{ objectPosition: videoPosition }}
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
        <div className="flex flex-1 flex-col border-t border-blue-200/30 px-4 py-3.5">
          <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {cardNumber}
              </span>
              <h3 className="text-[15px] font-bold text-gray-900 leading-snug">
                {cardTitle}
              </h3>
            </div>
            <p className="text-[12px] leading-relaxed text-gray-600/90">
              {cardDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
