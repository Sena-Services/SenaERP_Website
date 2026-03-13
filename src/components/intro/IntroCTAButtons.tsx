"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SignupModal from '@/components/shared/SignupModal';
import Toast from '@/components/shared/Toast';

type IntroCTAButtonsProps = {
  isMobile: boolean;
  getScaledValue: (base: number) => number;
};

export default function IntroCTAButtons({ isMobile, getScaledValue }: IntroCTAButtonsProps) {
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [isLaunchNotesHovered, setIsLaunchNotesHovered] = useState(false);
  const [isPitchHovered, setIsPitchHovered] = useState(false);
  const [isPdfHovered, setIsPdfHovered] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pdfHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Video hover play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVideoHovered && isVideoReady) {
      video.currentTime = 0;
      video.muted = true;
      video.play().then(() => { video.muted = false; }).catch(() => {});
    } else if (!isVideoHovered) {
      video.pause();
      video.currentTime = 0;
      video.muted = true;
    }
  }, [isVideoHovered, isVideoReady]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (videoHoverTimeoutRef.current) clearTimeout(videoHoverTimeoutRef.current);
      if (pdfHoverTimeoutRef.current) clearTimeout(pdfHoverTimeoutRef.current);
    };
  }, []);

  const handleVideoHoverEnter = () => {
    if (videoHoverTimeoutRef.current) {
      clearTimeout(videoHoverTimeoutRef.current);
      videoHoverTimeoutRef.current = null;
    }
    setIsVideoHovered(true);
  };

  const handleVideoHoverLeave = () => {
    videoHoverTimeoutRef.current = setTimeout(() => setIsVideoHovered(false), 100);
  };

  const handlePdfHoverEnter = () => {
    if (pdfHoverTimeoutRef.current) {
      clearTimeout(pdfHoverTimeoutRef.current);
      pdfHoverTimeoutRef.current = null;
    }
    setIsPdfHovered(true);
  };

  const handlePdfHoverLeave = () => {
    pdfHoverTimeoutRef.current = setTimeout(() => setIsPdfHovered(false), 100);
  };

  const arrowStyle = (hovered: boolean) => ({
    transform: hovered ? 'translateX(3px)' : 'translateX(0)',
    transition: 'transform 0.2s ease',
  });

  const textStyle = {
    fontFamily: "Georgia, serif",
    color: isMobile ? "#5a4938" : "#7a5f3a",
    fontSize: isMobile ? '0.85rem' : `${getScaledValue(16)}px`,
    fontWeight: 500 as const,
    textShadow: isMobile
      ? '0 2px 6px rgba(255, 255, 255, 1)'
      : '0 0 12px rgba(194, 160, 100, 0.4), 0 0 4px rgba(194, 160, 100, 0.2)',
  };

  const arrowSvg = (hovered: boolean) => (
    <svg
      width={isMobile ? 16 : getScaledValue(18)}
      height={isMobile ? 16 : getScaledValue(18)}
      viewBox="0 0 24 24"
      fill="none"
      stroke={isMobile ? "#5a4938" : "#7a5f3a"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={arrowStyle(hovered)}
    >
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );

  return (
    <>
      <div style={{
        marginTop: `-${getScaledValue(4)}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: `${getScaledValue(10)}px`,
      }}>
        {/* Launch notes link */}
        <Link
          href="/v01-beta"
          onMouseEnter={() => setIsLaunchNotesHovered(true)}
          onMouseLeave={() => setIsLaunchNotesHovered(false)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: `${getScaledValue(6)}px`, cursor: 'pointer', textDecoration: 'none' }}
        >
          <span style={{ ...textStyle, whiteSpace: 'nowrap' }}>Read our v0.1 Beta launch notes</span>
          {arrowSvg(isLaunchNotesHovered)}
        </Link>

        {/* Watch our video link with hover preview */}
        <div style={{ position: 'relative', display: 'flex' }}>
          <a
            href="https://www.youtube.com/watch?v=VAZctriaoUg"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsVideoHovered(false)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: `${getScaledValue(6)}px`, cursor: 'pointer', textDecoration: 'none' }}
          >
            <span
              style={{ ...textStyle, width: isMobile ? '150px' : `${getScaledValue(165)}px` }}
              onMouseEnter={handleVideoHoverEnter}
              onMouseLeave={handleVideoHoverLeave}
            >Watch our intro video</span>
            {arrowSvg(isVideoHovered)}
          </a>

          {!isMobile && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: `${getScaledValue(235)}px`,
              transform: isVideoHovered ? 'translateY(-50%) scale(1)' : 'translateY(-50%) translateX(-8px) scale(0.97)',
              width: `${getScaledValue(280)}px`,
              opacity: isVideoHovered ? 1 : 0,
              visibility: isVideoHovered ? 'visible' : 'hidden',
              transition: 'opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease',
              zIndex: 100,
            }}>
              <a
                href="https://www.youtube.com/watch?v=VAZctriaoUg"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsVideoHovered(false)}
                style={{
                  display: 'block',
                  borderRadius: `${getScaledValue(12)}px`,
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)',
                  textDecoration: 'none',
                  background: '#000',
                }}
              >
                <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/9' }}>
                  <video
                    ref={videoRef}
                    src="/videos/sena-preview.mp4"
                    loop
                    playsInline
                    muted
                    preload="auto"
                    onCanPlayThrough={() => setIsVideoReady(true)}
                    onLoadedData={() => setIsVideoReady(true)}
                    style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.2)',
                    opacity: isVideoHovered && isVideoReady ? 0 : 1,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                  }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#333"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                  <span style={{
                    position: 'absolute', bottom: '10px', left: '10px',
                    fontFamily: "'Tangerine', cursive", fontSize: '24px',
                    color: 'white', pointerEvents: 'none',
                    textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                  }}>Sena</span>
                </div>
                <div style={{
                  padding: '8px 12px',
                  background: 'rgba(90, 73, 56, 0.9)',
                  fontFamily: "Georgia, serif", fontSize: '11px',
                  color: 'rgba(255,255,255,0.9)', textAlign: 'center', letterSpacing: '0.03em',
                }}>
                  Click to watch full video
                </div>
              </a>
            </div>
          )}
        </div>

        {/* Download one pager link with hover preview */}
        <div style={{ position: 'relative', display: 'flex' }}>
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            onMouseEnter={handlePdfHoverEnter}
            onMouseLeave={handlePdfHoverLeave}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: `${getScaledValue(6)}px`,
              cursor: 'pointer', textDecoration: 'none', background: 'none', border: 'none', padding: 0,
            }}
          >
            <span style={{ ...textStyle, whiteSpace: 'nowrap' }}>Download our one pager</span>
            {arrowSvg(isPdfHovered)}
          </button>

          {!isMobile && (
            <div
              onMouseEnter={handlePdfHoverEnter}
              onMouseLeave={handlePdfHoverLeave}
              style={{
                position: 'absolute',
                top: '50%',
                left: `${getScaledValue(235)}px`,
                transform: isPdfHovered ? 'translateY(-50%) scale(1)' : 'translateY(-50%) translateX(-8px) scale(0.97)',
                width: `${getScaledValue(280)}px`,
                opacity: isPdfHovered ? 1 : 0,
                visibility: isPdfHovered ? 'visible' : 'hidden',
                transition: 'opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease',
                zIndex: 100,
              }}
            >
              <button
                aria-label="Preview PDF"
                onClick={() => { setIsPdfHovered(false); setIsDownloadModalOpen(true); }}
                style={{
                  display: 'block',
                  borderRadius: `${getScaledValue(12)}px`,
                  overflow: 'hidden',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer', background: '#f5f0eb', border: 'none', padding: 0,
                }}
                className="focus-visible:ring-2 focus-visible:ring-[#8FB7C5]"
              >
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <Image
                    src="/documents/sena-one-pager-thumb.png"
                    alt="Sena One Pager Preview"
                    width={280}
                    height={396}
                    style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'cover' }}
                  />
                </div>
                <div style={{
                  padding: '8px 12px', background: 'rgba(90, 73, 56, 0.9)',
                  fontFamily: "Georgia, serif", fontSize: '11px',
                  color: 'rgba(255,255,255,0.9)', textAlign: 'center', letterSpacing: '0.03em',
                }}>
                  Click to download
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Request Pitch Deck link */}
        <button
          onClick={() => setIsSignupModalOpen(true)}
          onMouseEnter={() => setIsPitchHovered(true)}
          onMouseLeave={() => setIsPitchHovered(false)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: `${getScaledValue(6)}px`,
            cursor: 'pointer', textDecoration: 'none', background: 'none', border: 'none', padding: 0,
          }}
        >
          <span style={{ ...textStyle, whiteSpace: 'nowrap' }}>Request Pitch Deck</span>
          {arrowSvg(isPitchHovered)}
        </button>
      </div>

      {/* Download One Pager Confirmation Modal */}
      {isDownloadModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
          }}
          onClick={() => setIsDownloadModalOpen(false)}
          onKeyDown={(e) => { if (e.key === 'Escape') setIsDownloadModalOpen(false); }}
        >
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }} />
          <div
            style={{
              position: 'relative', background: 'white', borderRadius: '24px',
              padding: '32px', maxWidth: '400px', width: '100%', textAlign: 'center',
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontFamily: 'Futura, sans-serif', fontSize: '22px', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px' }}>
              Download One Pager
            </h3>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>
              Would you like to download the Sena one pager?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setIsDownloadModalOpen(false)}
                style={{
                  padding: '10px 24px', borderRadius: '9999px', border: '1px solid #d1d5db',
                  background: 'white', fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '14px', fontWeight: 600, color: '#374151', cursor: 'pointer',
                }}
              >Cancel</button>
              <a
                href="/documents/sena-one-pager.pdf"
                download="Sena-One-Pager.pdf"
                onClick={() => setIsDownloadModalOpen(false)}
                style={{
                  padding: '10px 24px', borderRadius: '9999px', border: 'none',
                  background: '#8FB7C5', fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '14px', fontWeight: 600, color: 'white',
                  cursor: 'pointer', textDecoration: 'none', display: 'inline-block',
                }}
              >Yes, download</a>
            </div>
          </div>
        </div>
      )}

      {/* Pitch Deck Signup Modal */}
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onSuccess={(message) => { setToastMessage(message); setShowToast(true); }}
        initialView="pitch_deck"
      />

      {/* Toast */}
      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </>
  );
}
