/** @format */

// components/ui/ScrollRevealComponent.tsx
import { FC, ReactNode, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
type Props = {
  children?: ReactNode;
  animations?:
  | "fade"
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "fade-up-right"
  | "fade-up-left"
  | "fade-down-right"
  | "fade-down-left"
  | "flip-up"
  | "flip-down"
  | "flip-left"
  | "flip-right"
  | "zoom-in"
  | "zoom-in-up"
  | "zoom-in-down"
  | "zoom-in-left"
  | "zoom-in-right"
  | "zoom-out"
  | "zoom-out-up"
  | "zoom-out-down"
  | "zoom-out-left"
  | "zoom-out-right"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right";
  offset?: number;
  delay?: number;
  duration?: number;
  easing?:
  | "linear"
  | "ease"
  | "ease-in"
  | "ease-out"
  | "ease-in-out"
  | "ease-in-back"
  | "ease-out-back"
  | "ease-in-out-back"
  | "ease-in-sine"
  | "ease-out-sine"
  | "ease-in-out-sine"
  | "ease-in-quad"
  | "ease-out-quad"
  | "ease-in-out-quad"
  | "ease-in-cubic"
  | "ease-out-cubic"
  | "ease-in-quart"
  | "ease-out-quart"
  | "ease-in-out-quart";
  mirror?: boolean;
  once?: boolean;
  anchorPlacement?:
  | "top-bottom"
  | "top-center"
  | "top-top"
  | "center-bottom"
  | "center-center"
  | "center-top"
  | "bottom-bottom"
  | "bottom-center"
  | "bottom-top";
  className?: string;
};

const ScrollRevealComponent: FC<Props> = ({
  children,
  animations = "zoom-in",
  offset = 100,
  delay = 50,
  duration = 1000,
  easing = "ease-in-out",
  mirror = false,
  once = true,
  anchorPlacement = "top-bottom",
  className,
}) => {
  useEffect(() => {
    AOS.init();
  }, []);
  return (
    <div
      data-aos={animations}
      data-aos-offset={offset}
      data-aos-delay={delay}
      data-aos-duration={duration}
      data-aos-easing={easing}
      data-aos-mirror={mirror}
      data-aos-once={once}
      data-aos-anchor-placement={anchorPlacement}
      className={className}
    >
      {children}
    </div>
  );
};

export default ScrollRevealComponent;
