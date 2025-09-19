import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { Venue } from "../types/venue";
import VenueCard from "./venueCard";

// Custom Left Arrow
const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <div
    className="absolute -left-6 sm:-left-8 md:-left-10 top-1/2 -translate-y-1/2 z-20 
               bg-black rounded-full w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 
               flex items-center justify-center shadow-md cursor-pointer 
               hover:bg-blue-400 transition"
    onClick={onClick}
  >
    <FaChevronLeft className="text-white w-4 h-4 sm:w-5 sm:h-5" />
  </div>
);

// Custom Right Arrow
const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <div
    className="absolute -right-6 sm:-right-8 md:-right-10 top-1/2 -translate-y-1/2 z-20 
               bg-black rounded-full w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 
               flex items-center justify-center shadow-md cursor-pointer 
               hover:bg-gray-700 transition"
    onClick={onClick}
  >
    <FaChevronRight className="text-white w-4 h-4 sm:w-5 sm:h-5" />
  </div>
);

interface Props {
  venues: Venue[];
}

const VenueCarousel = ({ venues }: Props) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // desktop
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1536, settings: { slidesToShow: 3 } }, // xl screens
      { breakpoint: 1024, settings: { slidesToShow: 2 } }, // lg
      { breakpoint: 768, settings: { slidesToShow: 1 } },  // sm
      { breakpoint: 640, settings: { slidesToShow: 1 } },  
      { breakpoint: 375, settings: { slidesToShow: 1 } },  

    ],
  };

  return (
    <div className="relative px-2 sm:px-4 lg:px-6"> 
      <Slider {...settings}>
        {venues.map((venue) => (
          <div key={venue.id} className="px-1 sm:px-2">
            <VenueCard venue={venue} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default VenueCarousel;
