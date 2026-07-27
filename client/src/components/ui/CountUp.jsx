"use client";

import { useEffect, useState, useRef } from "react";

export default function CountUp({
  value,
  duration = 1500,
  prefix = "",
  suffix = "",
  decimals = null,
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef(null);
  const isAnimatedRef = useRef(false);

  // Parse decimals if not explicitly provided
  const targetDecimals =
    decimals !== null
      ? decimals
      : value.toString().split(".")[1]?.length || 0;

  const targetValue = parseFloat(value);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isAnimatedRef.current) {
          isAnimatedRef.current = true;
          animateCount();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value, duration]);

  const animateCount = () => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function - easeOutQuad
      const easedProgress = progress * (2 - progress);
      const currentValue = easedProgress * targetValue;

      setDisplayValue(currentValue);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
      }
    };
    window.requestAnimationFrame(step);
  };

  return (
    <span ref={elementRef} className="tabular-nums">
      {prefix}
      {displayValue.toFixed(targetDecimals)}
      {suffix}
    </span>
  );
}
