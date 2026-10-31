"use client";

import { useEffect, useState } from "react";

interface CountUpProps {
  value: number;
}

export default function CountUp({ value }: CountUpProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 900;
    const start = performance.now();
    let frame = 0;

    function animate(now: number) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setCount(value);
        return;
      }
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(value * (1 - (1 - progress) ** 3)));
      if (progress < 1) {
        frame = window.requestAnimationFrame(animate);
      }
    }

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [value]);

  return <span>{count.toLocaleString("es-ES")}</span>;
}
