import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

interface CrossedSabersProps {
  className?: string;
}

const BLUE_BLADE =
  'M20.523 10.977C17.8869 8.34099 13.6131 8.34099 10.977 10.977C8.34097 13.6131 8.34097 17.8869 10.977 20.523L107.497 117.043C110.133 119.679 114.407 119.679 117.043 117.043C119.679 114.407 119.679 110.133 117.043 107.497L20.523 10.977Z';
const BLUE_CORE =
  'M20.5229 17.8713C19.7907 17.1391 18.6035 17.1391 17.8713 17.8713C17.1391 18.6036 17.1391 19.7907 17.8713 20.523L105.376 108.027C106.108 108.76 107.295 108.76 108.027 108.027C108.76 107.295 108.76 106.108 108.027 105.376L20.5229 17.8713Z';
const BLUE_HILT =
  'M122.877 108.027L108.027 122.877L126.059 140.908L140.908 126.059L122.877 108.027Z';
const BLUE_EMITTER =
  'M138.787 128.18L128.18 138.787L136.665 147.272L147.272 136.665L138.787 128.18Z';

const RED_BLADE =
  'M138.416 20.523C141.052 17.8869 141.052 13.6131 138.416 10.977C135.78 8.34097 131.506 8.34097 128.87 10.977L32.3502 107.497C29.7141 110.133 29.7141 114.407 32.3502 117.043C34.9862 119.679 39.2601 119.679 41.8961 117.043L138.416 20.523Z';
const RED_CORE =
  'M131.522 20.5229C132.254 19.7907 132.254 18.6035 131.522 17.8713C130.79 17.1391 129.602 17.1391 128.87 17.8713L41.3658 105.376C40.6335 106.108 40.6335 107.295 41.3658 108.027C42.098 108.76 43.2852 108.76 44.0174 108.027L131.522 20.5229Z';
const RED_HILT =
  'M41.3657 122.877L26.5165 108.027L8.48528 126.059L23.3345 140.908L41.3657 122.877Z';
const RED_EMITTER =
  'M21.2132 138.787L10.6066 128.18L2.12131 136.665L12.7279 147.272L21.2132 138.787Z';

/**
 * Crossed lightsabers that ignite when they enter the viewport. The blade
 * shapes are revealed by animated SVG masks, so the hilts stay visible while
 * the blades extend from them. Reduced-motion users see the sabers already lit.
 */
export function CrossedSabers({ className }: CrossedSabersProps) {
  const ref = useRef<SVGSVGElement>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setLit(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setLit(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 150 150"
      className={clsx('crossed-sabers', lit && 'is-lit', className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter id="saber-blue-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>
        <filter id="saber-red-glow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="4.5" />
        </filter>

        <mask
          id="saber-blue-reveal"
          maskUnits="userSpaceOnUse"
          x="-10"
          y="-10"
          width="170"
          height="170"
        >
          <path
            d="M117.043 117.043L10.977 10.977"
            pathLength={1}
            stroke="#fff"
            strokeWidth="28"
            strokeLinecap="round"
            className="crossed-sabers__reveal crossed-sabers__reveal--blue"
          />
        </mask>
        <mask
          id="saber-red-reveal"
          maskUnits="userSpaceOnUse"
          x="-10"
          y="-10"
          width="170"
          height="170"
        >
          <path
            d="M41.896 117.043L138.416 20.523"
            pathLength={1}
            stroke="#fff"
            strokeWidth="28"
            strokeLinecap="round"
            className="crossed-sabers__reveal crossed-sabers__reveal--red"
          />
        </mask>
      </defs>

      <g mask="url(#saber-red-reveal)">
        <path
          d={RED_BLADE}
          fill="#FF3B30"
          filter="url(#saber-red-glow)"
          opacity="0.85"
          className="crossed-sabers__aura crossed-sabers__aura--red"
        />
        <path d={RED_BLADE} fill="#FF3B30" />
        <path d={RED_CORE} fill="#fff" />
      </g>

      <g mask="url(#saber-blue-reveal)">
        <path
          d={BLUE_BLADE}
          fill="#22A8FF"
          filter="url(#saber-blue-glow)"
          opacity="0.85"
          className="crossed-sabers__aura crossed-sabers__aura--blue"
        />
        <path d={BLUE_BLADE} fill="#22A8FF" />
        <path d={BLUE_CORE} fill="#fff" />
      </g>

      <g stroke="#05060D" strokeWidth="1.5">
        <path d={BLUE_HILT} fill="#C9D1DE" />
        <path d={BLUE_EMITTER} fill="#22A8FF" />
        <path d={RED_HILT} fill="#C9D1DE" />
        <path d={RED_EMITTER} fill="#FF3B30" />
      </g>
    </svg>
  );
}
