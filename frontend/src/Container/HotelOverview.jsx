import React, { useState } from 'react';
import { Container, Row, Col, Card, Image, Button, Badge } from 'react-bootstrap';
import { FaStar, FaUtensils, FaMapMarkerAlt, FaPhoneAlt, FaWifi, FaSwimmer, FaConciergeBell, FaCar, FaQuoteLeft, FaEnvelope, FaInstagram, FaFacebook, FaTwitter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import hotelImg from '../Image/Loogin_bg.png';
import dish1 from '../Image/Screenshot 2025-06-11 095330.png';
import dish2 from '../Image/Screenshot 2025-06-11 095330.png';
import dish3 from '../Image/Screenshot 2025-06-11 095330.png';
import styles from './HotelOverview.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const dishes = [
  {
    img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=1317&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name: 'Paneer Tikka',
    desc: 'A classic North Indian starter, marinated paneer grilled to perfection.',
    badge: 'Best Seller',
    badgeType: 'warning',
    rating: 4.8,
  },
  {
    img: 'https://plus.unsplash.com/premium_photo-1661419883163-bb4df1c10109?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QnV0dGVyJTIwQ2hpY2tlbnxlbnwwfHwwfHx8MA%3D%3D',
    name: 'Butter Chicken',
    desc: 'Rich, creamy, and full of flavor, our butter chicken is a guest favorite.',
    badge: "Chef's Choice",
    badgeType: 'success',
    rating: 4.9,
  },
  {
    img: 'https://media.istockphoto.com/id/1659939047/photo/lalmohan-or-gulab-jamun.webp?a=1&b=1&s=612x612&w=0&k=20&c=h9mVL-f7yZG5e1sV08Qa5cUK3zP7V-7vu3LxMk21dAQ=',
    name: 'Gulab Jamun',
    desc: 'Soft, sweet, and melt-in-the-mouth, our gulab jamun is the perfect dessert.',
    badge: 'Most Loved',
    badgeType: 'info',
    rating: 4.7,
  },
  {
    img: 'https://media.istockphoto.com/id/1156887040/photo/cheese-masala-dosa-recipe-with-sambar-and-chutney-selective-focus.webp?a=1&b=1&s=612x612&w=0&k=20&c=NFLxgTo1tJc5fEJcPgku6mV6PVrG165305vDKRShIVE=',
    name: 'Masala Dosa',
    desc: 'Crispy rice crepe filled with spicy potato masala, served with chutneys.',
    badge: 'South Indian Special',
    badgeType: 'success',
    rating: 4.8,
  },
  {
    img: 'https://images.unsplash.com/photo-1701579231305-d84d8af9a3fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QmlyeWFuaXxlbnwwfHwwfHx8MA%3D%3D',
    name: 'Biryani',
    desc: 'Aromatic basmati rice cooked with spices and tender meat or vegetables.',
    badge: 'Most Ordered',
    badgeType: 'warning',
    rating: 4.9,
  },
  {
    img: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8U2Ftb3NhfGVufDB8fDB8fHww',
    name: 'Samosa',
    desc: 'Crispy pastry filled with spicy potatoes and peas, a perfect snack.',
    badge: 'Snack Star',
    badgeType: 'info',
    rating: 4.6,
  },
  {
    img: 'https://media.istockphoto.com/id/1461228644/photo/dal-makhani-with-naan.webp?a=1&b=1&s=612x612&w=0&k=20&c=GViojxv1lNOw8RvYoDQNEPtC5MTWoIKN2a-UJUGRhgc=',
    name: 'Dal Makhani',
    desc: 'Slow-cooked black lentils in a creamy, buttery sauce.',
    badge: 'Vegetarian Delight',
    badgeType: 'success',
    rating: 4.7,
  },
  {
    img: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8VGFuZG9vcmklMjBDaGlja2VufGVufDB8fDB8fHww',
    name: 'Tandoori Chicken',
    desc: 'Chicken marinated in yogurt and spices, roasted in a tandoor oven.',
    badge: 'Tandoor Special',
    badgeType: 'warning',
    rating: 4.8,
  },
  {
    img: 'https://media.istockphoto.com/id/873539518/photo/deep-fried-bread-spicy-chickpeas-curry-and-salad.webp?a=1&b=1&s=612x612&w=0&k=20&c=qZP4pFv7bTarFakFrB6nDdjmAtwZzm1RA7ZOGTJlQRA=',
    name: 'Chole Bhature',
    desc: 'Spicy chickpeas served with fluffy fried bread, a Punjabi favorite.',
    badge: 'Punjabi Favorite',
    badgeType: 'info',
    rating: 4.7,
  },
  {
    img: 'https://media.istockphoto.com/id/1413557034/photo/indian-mumbai-street-style-pav-bhaji-garnished-with-peas-raw-onions-coriander-and-butter.webp?a=1&b=1&s=612x612&w=0&k=20&c=M6FvF0kVuffVXSwExd3R3HVAjRv6HOAjwX8VFf6vmqk=',
    name: 'Pav Bhaji',
    desc: 'Spicy mashed vegetable curry served with buttered bread rolls.',
    badge: 'Mumbai Street Food',
    badgeType: 'success',
    rating: 4.8,
  },
];

const testimonials = [
  {
    text: 'Amazing food and wonderful hospitality! Will visit again.',
    author: 'Priya S.'
  },
  {
    text: 'The rooms were spotless and the staff was very friendly.',
    author: 'Rahul M.'
  },
  {
    text: 'Best butter chicken I have ever had!',
    author: 'Ayesha K.'
  }
];

export default function HotelOverview() {
  const sliderRef = React.useRef(null);
  const testimonialRef = React.useRef(null);
  const [isDown, setIsDown] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const scrollSlider = (dir) => {
    if (sliderRef.current) {
      const scrollAmount = 292; // 260px card + 32px gap
      sliderRef.current.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
    }
  };
  const scrollTestimonial = (dir) => {
    if (testimonialRef.current) {
      const card = testimonialRef.current.querySelector(`.${styles['d_ho-testimonial-modern']}`);
      const cardWidth = card ? card.offsetWidth + 32 : 260; // 32px gap
      testimonialRef.current.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
    }
  };

  // Mouse drag-to-scroll handlers for desktop
  const handleMouseDown = (e) => {
    setIsDown(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };
  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);
  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.2; // scroll-fast
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };
  const handleTouchMove = (e) => {
    setTouchEndX(e.touches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (sliderRef.current) {
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) scrollSlider(1);
        else scrollSlider(-1);
      }
    }
    setTouchStartX(0);
    setTouchEndX(0);
  };

  return (
    <div className={styles['d_ho-bg']}>
      {/* Modern Hero Section */}
      <section className={styles['d_ho-hero-split']}>
        <Container className={styles['d_ho-hero-split-container']}>
          <Row className="align-items-center g-4 flex-column-reverse flex-md-row">
            <Col md={6} className={styles['d_ho-hero-info']}>
              <h1 className={`${styles['d_ho-hero-title']} mb-3`}>RestroBoard Hotel</h1>
              <p className={`${styles['d_ho-hero-desc']} mb-3`}>
                Experience luxury, comfort, and the best cuisine in town. Enjoy modern amenities and a warm, welcoming atmosphere.
              </p>
              <div className={`${styles['d_ho-hero-contact']} mb-3`}>
                <span><FaMapMarkerAlt className="me-2 text-primary" />123 Main Street, Food City, India</span><br />
                <span><FaPhoneAlt className="me-2 text-primary" />+91 98765 43210</span>
              </div>
              <Button variant="dark" className={styles['d_ho-btn']}>Book Now</Button>
            </Col>
            <Col md={6} className={`text-center ${styles['d_ho-hero-imgcol']}`}>
              <div className={styles['d_ho-hero-imgwrap']}>
                <Image src={hotelImg} alt="Hotel" fluid className={styles['d_ho-hero-img']} />
              </div>
            </Col>
          </Row>
        </Container>
        {/* SVG Divider */}
        <div className={styles['d_ho-divider']}>
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="var(--white-color)" d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z"></path></svg>
        </div>
      </section>

      {/* About Section */}
      <section className="py-5" style={{background: 'var(--white-color)'}}>
        <Container>
          <Row className="justify-content-center align-items-center">
            <Col md={8} className="text-center">
              <h2 className="fw-bold mb-3" style={{color: 'var(--button-color)'}}>About RestroBoard Hotel</h2>
              <p style={{fontSize: '1.1rem', color: '#3a4a5a'}}>
                RestroBoard Hotel blends modern luxury with traditional hospitality. Our mission is to provide guests with an unforgettable stay, whether you are here for business or leisure. Enjoy our state-of-the-art amenities, delicious cuisine, and personalized service.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className={`py-5 ${styles['d_ho-features-bg']}`}>
        <Container>
          <Row className={`mb-5 ${styles['d_ho-features-row']} justify-content-center`}>
            <Col xs={6} md={3} className="text-center mb-4">
              <div className={styles['d_ho-feature-card']}>
                <FaWifi className={styles['d_ho-feature-icon']} />
                <div className={styles['d_ho-feature-title']}>Free Wi-Fi</div>
              </div>
            </Col>
            <Col xs={6} md={3} className="text-center mb-4">
              <div className={styles['d_ho-feature-card']}>
                <FaSwimmer className={styles['d_ho-feature-icon']} />
                <div className={styles['d_ho-feature-title']}>Swimming Pool</div>
              </div>
            </Col>
            <Col xs={6} md={3} className="text-center mb-4">
              <div className={styles['d_ho-feature-card']}>
                <FaConciergeBell className={styles['d_ho-feature-icon']} />
                <div className={styles['d_ho-feature-title']}>24/7 Service</div>
              </div>
            </Col>
            <Col xs={6} md={3} className="text-center mb-4">
              <div className={styles['d_ho-feature-card']}>
                <FaCar className={styles['d_ho-feature-icon']} />
                <div className={styles['d_ho-feature-title']}>Free Parking</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Dish Image Slider Section */}
      <section className={styles['d_ho-dishcards-section']}>
      
          <Row className="mb-4">
            <Col>
              <h3 className={`${styles['d_ho-section-title']} text-center mb-4`} style={{color: 'var(--button-color)'}}>
                Our Signature Dishes
              </h3>
            </Col>
          </Row>
          <div className={styles['d_ho-slider-outer']}>
            <button
              className={`${styles['d_ho-slider-arrow']} ${styles['d_ho-slider-arrow--left']}`}
              onClick={() => scrollSlider(-1)}
              aria-label="Scroll Left"
              style={{visibility: dishes.length > 3 ? 'visible' : 'hidden'}}
            >
              <FaChevronLeft />
            </button>
            <div
              ref={sliderRef}
              className={styles['d_ho-dishcards-slider-inner']}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ cursor: isDown ? 'grabbing' : 'grab' }}
            >
              {dishes.map((dish, idx) => (
                <div key={idx} className={styles['d_ho-dishcard-modern']}>
                  <div className={styles['d_ho-dishcard-imgwrap']}>
                    <img
                      src={dish.img}
                      alt={dish.name}
                      className={styles['d_ho-dishcard-img']}
                    />
                    {/* <span className={`${styles['d_ho-dishcard-badge']} ${styles[`d_ho-dishcard-badge--${dish.badgeType}`]}`}>{dish.badge}</span> */}
                  </div>
                  <div className={styles['d_ho-dishcard-content']}>
                    <div className={styles['d_ho-dishcard-title']}>{dish.name}</div>
                    <div className={styles['d_ho-dishcard-desc']}>{dish.desc}</div>
                    <div className={styles['d_ho-dishcard-rating']}>
                      <FaStar style={{color: '#ffc107', marginRight: '4px'}} />
                      {dish.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className={`${styles['d_ho-slider-arrow']} ${styles['d_ho-slider-arrow--right']}`}
              onClick={() => scrollSlider(1)}
              aria-label="Scroll Right"
              style={{visibility: dishes.length > 3 ? 'visible' : 'hidden'}}
            >
              <FaChevronRight />
            </button>
          </div>
        
      </section>

      {/* Testimonials Carousel */}
      <section className={`py-5 ${styles['d_ho-testimonial-bg']}`}>
        <Container>
          <Row className="mb-4">
            <Col>
              <h3 className={`${styles['d_ho-section-title']} text-center mb-4`} style={{color: 'var(--button-color)'}}>
                <FaQuoteLeft className="me-2 text-primary" /> What Our Guests Say
              </h3>
            </Col>
          </Row>
          <div style={{position: 'relative'}}>
            <button
              className={`${styles['d_ho-testimonial-arrow']} ${styles['d_ho-testimonial-arrow--left']}`}
              onClick={() => scrollTestimonial(-1)}
              aria-label="Scroll Left"
              style={{visibility: testimonials.length > 1 ? 'visible' : 'hidden'}}
            >
              <FaChevronLeft />
            </button>
            <div
              ref={testimonialRef}
              className={styles['d_ho-testimonial-carousel-modern']}
            >
              {testimonials.map((t, i) => (
                <div className={styles['d_ho-testimonial-modern']} key={i}>
                  <FaQuoteLeft className={styles['d_ho-testimonial-quoteicon']} />
                  <p className={styles['d_ho-testimonial-text']}>&quot;{t.text}&quot;</p>
                  <div className={styles['d_ho-testimonial-author']}>- {t.author}</div>
                </div>
              ))}
            </div>
            <button
              className={`${styles['d_ho-testimonial-arrow']} ${styles['d_ho-testimonial-arrow--right']}`}
              onClick={() => scrollTestimonial(1)}
              aria-label="Scroll Right"
              style={{visibility: testimonials.length > 1 ? 'visible' : 'hidden'}}
            >
              <FaChevronRight />
            </button>
          </div>
        </Container>
      </section>

    </div>
  );
}


