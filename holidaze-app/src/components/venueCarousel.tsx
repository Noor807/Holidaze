import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { Venue } from "../types/venue";
import VenueCard from "./venueCard";

// Custom Left Arrow
const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <div
    className="absolute -left-10 top-1/2 -translate-y-1/2 z-20 bg-black rounded-full w-10 h-10 flex items-center justify-center shadow-md cursor-pointer hover:bg-blue-400"
    onClick={onClick}
  >
    <FaChevronLeft className="text-white w-5 h-5" />
  </div>
);

// Custom Right Arrow
const NextArrow = ({ onClick }: { onClick?: () => void }) => (
  <div
    className="absolute -right-8 top-1/2 -translate-y-1/2 z-20 bg-black rounded-full w-10 h-10 flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-700"
    onClick={onClick}
  >
    <FaChevronRight className="text-white w-5 h-5" />
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
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="relative px-1 sm:px-3"> {/* Padding prevents arrows from overlapping cards */}
      <Slider {...settings}>
        {venues.map((venue) => (
          <div key={venue.id} className="px-1">
            <VenueCard venue={venue} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default VenueCarousel;
