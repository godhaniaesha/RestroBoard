import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import {
  FaStar, FaMapMarkerAlt, FaPhoneAlt, FaWifi, FaSwimmer, FaConciergeBell,
  FaCar, FaQuoteLeft, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import styles from './HotelOverview.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { getAllDish } from '../redux/slice/dish.slice';
import { getAllHotel } from '../redux/slice/hotel.slice';

const testimonials = [
  { text: 'Amazing food and wonderful hospitality! Will visit again.', author: 'Priya S.' },
  { text: 'The rooms were spotless and the staff was very friendly.', author: 'Rahul M.' },
  { text: 'Best butter chicken I have ever  perfectly spiced!', author: 'Ayesha K.' },
  { text: 'The ambiance is perfect for a family dinner. Highly recommended!', author: 'Sandeep J.' },
  { text: 'A delightful experience from start to finish. The service is impeccable.', author: 'Neha P.' }
];

const amenityIcons = {
  'Free Wi-Fi': <FaWifi className={styles['d_ho-feature-icon']} />,
  'Swimming Pool': <FaSwimmer className={styles['d_ho-feature-icon']} />,
  '24/7 Service': <FaConciergeBell className={styles['d_ho-feature-icon']} />,
  'Free Parking': <FaCar className={styles['d_ho-feature-icon']} />,
};

export default function HotelOverview() {
  const dispatch = useDispatch();
  const { dishes } = useSelector((state) => state.dish);
  const { hotels } = useSelector((state) => state.hotel);
  const prevDishRef = useRef(null);
  const nextDishRef = useRef(null);
  const prevTestimonialRef = useRef(null);
  const nextTestimonialRef = useRef(null);

  useEffect(() => {
    dispatch(getAllDish());
    dispatch(getAllHotel());
  }, [dispatch]);

  const hotel = hotels && hotels.length > 0 ? hotels[0] : null;
  const parsedAmenities = hotel?.amenities?.length ? JSON.parse(hotel.amenities[0]) : [];

  return (
    <div className={styles['d_ho-bg']}>
      {/* Hero Section */}
      <section className={styles['d_ho-hero-split']}>
        <Container className={styles['d_ho-hero-split-container']}>
          <Row className="align-items-center g-4 flex-column-reverse flex-md-row">
            <Col md={6} className={styles['d_ho-hero-info']}>
              <h1 className={`${styles['d_ho-hero-title']} mb-3`}>{hotel?.hotel_name || 'RestroBoard Hotel'}</h1>
              <p className={`${styles['d_ho-hero-desc']} mb-3`}>
                {hotel?.description || 'Experience luxury, comfort, and the best cuisine in town. Enjoy modern amenities and a warm, welcoming atmosphere.'}
              </p>
              <div className={`${styles['d_ho-hero-contact']} mb-3`}>
                <span><FaMapMarkerAlt className="me-2 text-primary" />{hotel?.address || '123 Main Street, Food City, India'}</span><br />
                <span><FaPhoneAlt className="me-2 text-primary" />{hotel?.phone || '+91 98765 43210'}</span>
              </div>
              {/* <Button variant="dark" className={styles['d_ho-btn']}>Book Now</Button> */}
            </Col>
            <Col md={6} className={`text-center ${styles['d_ho-hero-imgcol']}`}>
              <div className={styles['d_ho-hero-imgwrap']}>
                <Image src={`http://localhost:3000${hotel?.hotel_image || '/default.jpg'}`} alt="Hotel" fluid className={styles['d_ho-hero-img']} />
              </div>
            </Col>
          </Row>
        </Container>
        <div className={styles['d_ho-divider']}>
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="var(--white-color)" d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z"></path></svg>
        </div>
      </section>

      {/* About Section */}
      <section className="pt-1 pb-5" style={{ background: 'var(--white-color)' }}>
        <Container>
          <Row className="justify-content-center align-items-center">
            <Col md={8} className={` text-center`}>
              <h2 className={`fw-bold mb-3 ${styles['Z_resp_title']} ` }style={{ color: 'var(--button-color)' }}>About {hotel?.hotel_name || 'RestroBoard Hotel'}</h2>
              <p style={{ fontSize: '1.1rem', color: '#3a4a5a' }}>{hotel?.description}</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Amenities Section */}
      <section className={`py-5 ${styles['d_ho-features-bg']}`}>
        <Container>
          <Row className={`mb-md-5 mb-1 ${styles['d_ho-features-row']} justify-content-center`}>
            {parsedAmenities.map((amenity, index) => (
              <Col key={index} xs={6} md={3} className="text-center my-md-0 my-2">
                <div className={styles['d_ho-feature-card']}>
                  {amenityIcons[amenity] || <FaConciergeBell className={styles['d_ho-feature-icon']} />}
                  <div className={styles['d_ho-feature-title']}>{amenity}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Dishes Section */}
      <section className={styles['d_ho-dishcards-section']}>
        <Container fluid>
          <Row className="mb-md-4 mb-1">
            <Col>
              <h3 className={`${styles['d_ho-section-title']} text-center mb-md-4 mb-1`} style={{ color: 'var(--button-color)' }}>
                Our Signature Dishes
              </h3>
            </Col>
          </Row>
          <div className={styles['d_ho-slider-outer']}>
            <Swiper
              modules={[Navigation, Autoplay]}
              className={styles['d_ho_swiper_wrapper']}
              navigation={{
                prevEl: prevDishRef.current,
                nextEl: nextDishRef.current,
              }}
              onInit={swiper => {
                swiper.params.navigation.prevEl = prevDishRef.current;
                swiper.params.navigation.nextEl = nextDishRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 20 },
                576: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 30 },
                992: { slidesPerView: 4, spaceBetween: 30 },
                1200: { slidesPerView: 5, spaceBetween: 30 },
              }}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              loop={true}
            >
              {dishes?.map((dish, idx) => (
                <SwiperSlide key={idx}>
                  <div className={styles['d_ho-dishcard-modern']}>
                    <div className={styles['d_ho-dishcard-imgwrap']}>
                      <img
                        src={`http://localhost:3000${dish.dish_image}`}
                        alt={dish.dish_name}
                        className={styles['d_ho-dishcard-img']}
                      />
                    </div>
                    <div className={styles['d_ho-dishcard-content']}>
                      <div className={styles['d_ho-dishcard-title']}>{dish.dish_name}</div>
                      <div className={styles['d_ho-dishcard-desc']}>{dish.description}</div>
                      <div className={styles['d_ho-dishcard-rating']}>
                        <FaStar style={{ color: '#ffc107', marginRight: '4px' }} />
                        {dish.rating}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button ref={prevDishRef} className={`${styles['d_ho-slider-arrow']} ${styles['d_ho-slider-arrow--left']}`} aria-label="Scroll Left">
              <FaChevronLeft />
            </button>
            <button ref={nextDishRef} className={`${styles['d_ho-slider-arrow']} ${styles['d_ho-slider-arrow--right']}`} aria-label="Scroll Right">
              <FaChevronRight />
            </button>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className={`py-5 ${styles['d_ho-testimonial-bg Z_resp_slider']}`}>
        <Container>
          <Row className="mb-md-4 mb-1">
            <Col>
              <h3 className={`${styles['d_ho-section-title']} text-center mb-md-4 mb-1`} style={{ color: 'var(--button-color)' }}>
                <FaQuoteLeft className="me-2 text-primary" /> What Our Guests Say
              </h3>
            </Col>
          </Row>
          <div className={styles['d_ho-testimonial-outer']}>
            <Swiper
              modules={[Navigation, Autoplay]}
              className={styles['d_ho_swiper_wrapper']}
              navigation={{
                prevEl: prevTestimonialRef.current,
                nextEl: nextTestimonialRef.current,
              }}
              onInit={swiper => {
                swiper.params.navigation.prevEl = prevTestimonialRef.current;
                swiper.params.navigation.nextEl = nextTestimonialRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 30 },
                992: { slidesPerView: 3, spaceBetween: 30 },
              }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
            >
              {testimonials.map((t, i) => (
                <SwiperSlide key={i}>
                  <div className={styles['d_ho-testimonial-modern']}>
                    <FaQuoteLeft className={styles['d_ho-testimonial-quoteicon']} />
                    <p className={styles['d_ho-testimonial-text']}>&quot;{t.text}&quot;</p>
                    <div className={styles['d_ho-testimonial-author']}>- {t.author}</div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button ref={prevTestimonialRef} className={`${styles['d_ho-testimonial-arrow']} ${styles['d_ho-testimonial-arrow--left']}`} aria-label="Scroll Left">
              <FaChevronLeft />
            </button>
            <button ref={nextTestimonialRef} className={`${styles['d_ho-testimonial-arrow']} ${styles['d_ho-testimonial-arrow--right']}`} aria-label="Scroll Right">
              <FaChevronRight />
            </button>
          </div>
        </Container>
      </section>
    </div>
  );
}
