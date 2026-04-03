"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";

type ScrollDirection = "up" | "down";

const MOBILE_WAVE_QUERY = "(max-width: 1024px), (hover: none) and (pointer: coarse)";

interface PremiumWaveFrameProps {
  src: string;
  alt: string;
  sizes: string;
  outerClassName: string;
  surfaceClassName: string;
  imageClassName?: string;
  priority?: boolean;
  beforeSheen?: ReactNode;
  afterSheen?: ReactNode;
  children?: ReactNode;
}

export default function PremiumWaveFrame({
  src,
  alt,
  sizes,
  outerClassName,
  surfaceClassName,
  imageClassName = "object-cover",
  priority = false,
  beforeSheen,
  afterSheen,
  children,
}: PremiumWaveFrameProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const pulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasScrolledRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const scrollDirectionRef = useRef<ScrollDirection>("down");
  const pulseDoneRef = useRef(false);
  const [mobilePulseDirection, setMobilePulseDirection] = useState<ScrollDirection | null>(null);

  const triggerMobilePulse = (direction: ScrollDirection = scrollDirectionRef.current) => {
    if (pulseTimeoutRef.current) {
      clearTimeout(pulseTimeoutRef.current);
    }

    setMobilePulseDirection(null);

    window.requestAnimationFrame(() => {
      setMobilePulseDirection(direction);
      pulseTimeoutRef.current = setTimeout(() => {
        setMobilePulseDirection(null);
      }, 1720);
    });
  };

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const onScroll = () => {
      const nextScrollY = window.scrollY;
      const delta = nextScrollY - lastScrollYRef.current;

      if (Math.abs(delta) > 2) {
        hasScrolledRef.current = true;
        scrollDirectionRef.current = delta > 0 ? "down" : "up";
      }

      lastScrollYRef.current = nextScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const node = cardRef.current;
    if (!node || typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return;
    }

    const mobileMedia = window.matchMedia(MOBILE_WAVE_QUERY);

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) {
          return;
        }

        if (mobileMedia.matches && hasScrolledRef.current && !pulseDoneRef.current) {
          pulseDoneRef.current = true;
          triggerMobilePulse(scrollDirectionRef.current);
        }

        observer.unobserve(entry.target);
      },
      {
        threshold: 0.22,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
      }
    };
  }, []);

  const wrapperClassName = [
    outerClassName,
    "restaurant-wave-host",
    "group",
    mobilePulseDirection
      ? `restaurant-wave-mobile-pulse restaurant-wave-mobile-pulse-${mobilePulseDirection}`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const mediaSurfaceClassName = ["restaurant-wave-surface", surfaceClassName].filter(Boolean).join(" ");

  return (
    <div
      ref={cardRef}
      className={wrapperClassName}
      onTouchStart={() => {
        triggerMobilePulse();
      }}
    >
      <div className={mediaSurfaceClassName}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={imageClassName}
          sizes={sizes}
        />
        {beforeSheen}
        <span className="restaurant-wave-sheen" aria-hidden="true" />
        {afterSheen}
      </div>
      {children}
    </div>
  );
}
