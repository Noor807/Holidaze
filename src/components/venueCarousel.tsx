import { useKeenSlider } from "keen-slider/react";
import type { KeenSliderInstance } from "keen-slider";
import "keen-slider/keen-slider.min.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { Venue } from "../types/venue";
import VenueCard from "./venueCard";
import VenueCardSkeleton from "./venueCardSkeleton";

interface Props {
  /** Array of venues to display in the carousel */
  venues: Venue[];
  /** Whether the data is still loading */
  loading?: boolean;
  /** Number of skeleton cards to show while loading */
  skeletonCount?: number;
}

/**
 * Keen Slider Autoplay plugin.
 * Automatically moves to the next slide every 3 seconds.
 *
 * @param slider - The KeenSlider instance
 */
function Autoplay(slider: KeenSliderInstance) {
  let timeout: ReturnType<typeof setTimeout>;
  let mouseOver = false;

  const clearNextTimeout = () => clearTimeout(timeout);

  const nextTimeout = () => {
    clearTimeout(timeout);
    if (mouseOver) return;
    timeout = setTimeout(() => {
      slider.next();
    }, 3000);
  };

  slider.on("created", () => {
    slider.container.addEventListener("mouseenter", () => {
      mouseOver = true;
      clearNextTimeout();
    });
    slider.container.addEventListener("mouseleave", () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });

  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
}

/**
 * VenueCarousel component displays a horizontal carousel of Venue cards.
 *
 * @param venues - Array of venues to display
 * @param loading - Whether the carousel is in loading state
 * @param skeletonCount - Number of skeleton placeholders to show while loading
 */
const VenueCarousel = ({
  venues,
  loading = false,
  skeletonCount = 4,
}: Props) => {
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slides: {
        perView: 4,
        spacing: 8,
      },
      breakpoints: {
        "(max-width: 1536px)": { slides: { perView: 3, spacing: 8 } },
        "(max-width: 1024px)": { slides: { perView: 3, spacing: 8 } },
        "(max-width: 768px)": { slides: { perView: 2, spacing: 8 } },
        "(max-width: 640px)": { slides: { perView: 1, spacing: 8 } },
      },
    },
    [Autoplay]
  );

  const items = loading ? Array.from({ length: skeletonCount }) : venues;

  return (
    <div className="relative px-2 sm:px-4 lg:px-6">
      {/* Slider container */}
      <div ref={sliderRef} className="keen-slider">
        {items.map((item, index) => (
          <div
            key={loading ? `skeleton-${index}` : (item as Venue).id}
            className="keen-slider__slide px-1 sm:px-2"
          >
            {loading ? (
              <VenueCardSkeleton />
            ) : (
              <VenueCard venue={item as Venue} />
            )}
          </div>
        ))}
      </div>

      {/* Prev arrow */}
      <button
        type="button"
        onClick={() => slider.current?.prev()}
        aria-label="prev button"
        className="absolute -left-6 sm:-left-8 md:-left-10 top-1/2 -translate-y-1/2 z-20 
                   bg-black rounded-full w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 
                   flex items-center justify-center shadow-md cursor-pointer 
                   hover:bg-blue-400 transition"
      >
        <FaChevronLeft className="text-white w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Next arrow */}
      <button
        type="button"
        onClick={() => slider.current?.next()}
        aria-label="next button"
        className="absolute -right-6 sm:-right-8 md:-right-10 top-1/2 -translate-y-1/2 z-20 
                   bg-black rounded-full w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 
                   flex items-center justify-center shadow-md cursor-pointer 
                   hover:bg-gray-700 transition"
      >
        <FaChevronRight className="text-white w-4 h-4 sm:w-5 sm:h-5" />
      </button>
    </div>
  );
};

export default VenueCarousel;
