"use client";

type PinwheelLogoProps = {
  size?: number;
  className?: string;
  animationDuration?: number; // seconds
  showStick?: boolean; // whether to show the stick part
  filter?: string; // CSS filter for color adjustment
};

export default function PinwheelLogo({
  size = 40,
  className = "",
  animationDuration = 10,
  showStick = false,
  filter,
}: PinwheelLogoProps) {
  // Scale factor based on original 100px container size
  const scale = size / 100;

  return (
    <div
      className={`pinwheel-logo-container ${className}`}
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style jsx>{`
        @keyframes senaSpinSlow {
          0% {
            transform: translate(${5 * scale}px, ${-9 * scale}px) rotate(0deg);
          }
          100% {
            transform: translate(${5 * scale}px, ${-9 * scale}px) rotate(360deg);
          }
        }
        .logo-pinwheel {
          position: absolute;
          width: ${95 * scale}px;
          height: auto;
          z-index: 2;
          animation: senaSpinSlow ${animationDuration}s linear infinite;
          transform-origin: center center;
          transform: translate(${5 * scale}px, ${-9 * scale}px) rotate(0deg);
          will-change: transform;
          display: block;
        }
        .logo-stick {
          position: absolute;
          width: ${90 * scale}px;
          height: auto;
          z-index: 1;
          display: block;
          transform: translateY(${10 * scale}px);
        }
      `}</style>

      {showStick && (
        // eslint-disable-next-line @next/next/no-img-element -- CSS-class-based sizing via <style jsx> is incompatible with next/image wrapper
        <img
          className="logo-stick"
          src="/sena-logo-stick.png"
          alt=""
          style={filter ? { filter } : undefined}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element -- CSS-class-based sizing via <style jsx> is incompatible with next/image wrapper */}
      <img
        className="logo-pinwheel"
        src="/sena-logo-pinwheel.png"
        alt="Sena"
        style={filter ? { filter } : undefined}
      />
    </div>
  );
}
