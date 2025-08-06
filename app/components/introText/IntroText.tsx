"use client";

import { useEffect, useRef, useState } from "react";

export default function IntroText() {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-labelledby="intro-heading"
      className={[
        "mx-auto max-w-prose px-5",
        "font-[Prata] text-[#3a3a3a] text-[1.1rem] leading-[1.6]",
        "transition-all duration-700",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
      ].join(" ")}
    >
      <h2 id="intro-heading" className="sr-only">
        Notre philosophie
      </h2>

      <p className="mb-2 text-center">
        <strong>Un vin, un visage. Une bouteille, une histoire.</strong>
      </p>
      <p className="text-center">
        Chez Edouard, chaque vin est choisi avec soin, directement auprès de
        vignerons passionnés.
      </p>
      <p className="text-center">
        Des cuvées confidentielles, issues de petites parcelles cultivées avec
        amour — souvent en bio, parfois en biodynamie, toujours avec sincérité.
      </p>
    </section>
  );
}
