"use client";

import { useState, useEffect } from "react";
import { Bike } from "lucide-react";
import Image from "next/image";

interface PreloaderProps {
  onComplete: () => void;
}

const loadingTexts = [
  { limit: 30, text: "Preparando tu aventura colonial..." },
  { limit: 60, text: "Ajustando frenos e inflando llantas..." },
  { limit: 85, text: "Explorando rutas de Granada..." },
  { limit: 100, text: "¡Todo listo para pedalear!" }
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState(loadingTexts[0].text);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Disable body scroll while loading
    document.body.style.overflow = "hidden";
    
    // Simulate loading progress using absolute time (bulletproof against mobile CPU throttling)
    const startTime = Date.now();
    const duration = 2000; // 2 seconds total loading time
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const nextProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(nextProgress);

      // Update text based on progress limits
      const activeText = loadingTexts.find(t => nextProgress <= t.limit)?.text || loadingTexts[loadingTexts.length - 1].text;
      setCurrentText(activeText);

      if (nextProgress >= 100) {
        clearInterval(interval);
        // Add a slight delay at 100% for smooth visual transition
        setTimeout(() => {
          setIsExiting(true);
          // Safety exit: unmount after CSS fade-out transition finishes
          setTimeout(() => {
            document.body.style.overflow = "unset";
            onComplete();
          }, 600);
        }, 400);
      }
    }, 30); // 30ms ticks

    return () => {
      clearInterval(interval);
      document.body.style.overflow = "unset";
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-anil-blue via-anil-blue/98 to-jungle-green/95 text-warm-white select-none transition-all duration-500 ease-in-out ${
        isExiting ? "opacity-0 pointer-events-none -translate-y-full" : "opacity-100"
      }`}
    >
      {/* Decorative colonial arches overlay background */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Logo Container with rotating glow and entry animation */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-8 animate-pulse [animation-duration:3s]">
          {/* Circular ambient glowing background */}
          <div className="absolute inset-2 bg-gradient-to-tr from-colonial-yellow/20 via-coral/25 to-jungle-green/20 rounded-full filter blur-xl z-0" />
          
          {/* Outer ring */}
          <svg 
            className="absolute inset-0 w-full h-full -rotate-90 z-20 pointer-events-none"
            viewBox="0 0 100 100"
          >
            <circle 
              cx="50" 
              cy="50" 
              r="46" 
              className="stroke-white/10" 
              strokeWidth="2" 
              fill="transparent" 
            />
            <circle 
              cx="50" 
              cy="50" 
              r="46" 
              className="stroke-colonial-yellow transition-all duration-100 ease-out" 
              strokeWidth="2.5" 
              fill="transparent"
              strokeDasharray="289"
              strokeDashoffset={289 - (289 * progress) / 100}
            />
          </svg>

          {/* The Brand Logo Image inside solid white circle card for maximum contrast */}
          <div
            className="absolute top-[8%] left-[8%] w-[84%] h-[84%] rounded-full bg-white shadow-2xl flex items-center justify-center p-4 border-4 border-colonial-yellow/15 z-10"
          >
            <div className="relative w-[90%] h-[90%] flex items-center justify-center">
              <Image
                src="/logo-transparent.png"
                alt="BiciVentura Logo"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
          </div>
        </div>

        {/* Title / Brand Name */}
        <h2 className="text-2xl font-bold tracking-wider text-colonial-yellow mb-2 font-display">
          BiciVentura
        </h2>

        {/* Dynamic Status Text */}
        <div className="h-6 mb-8 overflow-hidden">
          <p className="text-warm-white/70 text-xs sm:text-sm font-medium tracking-wide">
            {currentText}
          </p>
        </div>

        {/* Custom Interactive Progress Bar with Bouncing Bicycle */}
        <div className="w-64 sm:w-72 relative">
          {/* Progress track */}
          <div className="h-1 bg-white/15 rounded-full w-full overflow-visible relative">
            {/* Active progress fill */}
            <div 
              className="h-full bg-gradient-to-r from-colonial-yellow via-coral to-jungle-green rounded-full transition-all duration-100 ease-out" 
              style={{ width: `${progress}%` }}
            />
            
            {/* Moving Bicycle Icon on Track */}
            <div 
              className="absolute top-0 transition-all duration-100 ease-out"
              style={{ 
                left: `${progress}%`,
                transform: 'translate(-50%, -100%)'
              }}
            >
              <div className="p-1 -mt-1 text-colonial-yellow drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] animate-bounce [animation-duration:1s]">
                <Bike className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Progress Percentage */}
          <span className="absolute right-0 -bottom-6 text-[10px] sm:text-xs font-mono font-bold text-colonial-yellow">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}
