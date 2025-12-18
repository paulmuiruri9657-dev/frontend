'use client';

import React, { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';

interface Slide {
    id: number;
    title: string;
    subtitle: string;
    buttonText: string;
    link: string;
    bgGradient: string;
    image?: string;
}

// Gradient variations for categories
const gradients = [
    'from-purple-600 via-purple-700 to-pink-600',
    'from-blue-600 via-blue-700 to-cyan-600',
    'from-green-600 via-emerald-700 to-teal-600',
    'from-rose-500 via-pink-600 to-orange-500',
    'from-amber-500 via-orange-600 to-red-500',
    'from-indigo-600 via-purple-700 to-pink-500',
    'from-cyan-500 via-blue-600 to-indigo-600',
    'from-emerald-500 via-green-600 to-teal-600',
    'from-fuchsia-500 via-purple-600 to-pink-600',
    'from-violet-600 via-purple-700 to-fuchsia-600',
    'from-sky-500 via-blue-600 to-cyan-500',
    'from-lime-500 via-green-600 to-emerald-600'
];

interface HeroCarouselProps {
    autoPlayInterval?: number;
}

export default function HeroCarousel({ autoPlayInterval = 3000 }: HeroCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isUserInteracting, setIsUserInteracting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [slides, setSlides] = useState<Slide[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftStart, setScrollLeftStart] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
    const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch categories and create slides
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.getCategories({ level: 0 });
                const categories = response.data || [];

                // Category to image mapping
                const categoryImages: Record<string, string> = {
                    'electronics': '/category-images/electronics_hero_1766053496172.png',
                    'phones': '/category-images/phones_tablets_hero_1766053513429.png',
                    'phones-tablets': '/category-images/phones_tablets_hero_1766053513429.png',
                    'home': '/category-images/home_office_hero_1766053535102.png',
                    'home-office': '/category-images/home_office_hero_1766053535102.png',
                    'appliances': '/category-images/home_office_hero_1766053535102.png',
                    'beauty': '/category-images/beauty_health_hero.png',
                    'health': '/category-images/beauty_health_hero.png',
                    'health-beauty': '/category-images/beauty_health_hero.png',
                    'fashion': '/category-images/fashion_hero.jpg',
                    'clothing': '/category-images/fashion_hero.jpg',
                    'apparel': '/category-images/fashion_hero.jpg',
                    'supermarket': '/category-images/supermarket_hero.jpg',
                    'grocery': '/category-images/supermarket_hero.jpg',
                    'groceries': '/category-images/supermarket_hero.jpg',
                    'computing': '/category-images/computing_hero.jpg',
                    'computers': '/category-images/computing_hero.jpg',
                    'gaming': '/category-images/gaming_hero.jpg',
                    'games': '/category-images/gaming_hero.jpg',
                    'video-games': '/category-images/gaming_hero.jpg',
                    'sports': '/category-images/sports_hero.jpg',
                    'outdoor': '/category-images/sports_hero.jpg',
                    'outdoors': '/category-images/sports_hero.jpg',
                    'fitness': '/category-images/sports_hero.jpg',
                    'baby': '/category-images/baby_hero.jpg',
                    'baby-products': '/category-images/baby_hero.jpg',
                    'kids': '/category-images/baby_hero.jpg',
                    'kitchen': '/category-images/kitchen_hero.jpg',
                    'kitchenware': '/category-images/kitchen_hero.jpg',
                };

                const categorySlides: Slide[] = categories.map((category: any, index: number) => {
                    // Try to find matching image by category slug
                    const categorySlug = category.slug.toLowerCase();
                    const matchingImage = Object.keys(categoryImages).find(key =>
                        categorySlug.includes(key) || key.includes(categorySlug.split('-')[0])
                    );

                    return {
                        id: index + 1,
                        title: category.name,
                        subtitle: `Explore Amazing ${category.name} Deals`,
                        buttonText: 'Shop Now',
                        link: `/category/${category.slug}`,
                        bgGradient: gradients[index % gradients.length],
                        image: matchingImage ? categoryImages[matchingImage] : undefined
                    };
                });

                setSlides(categorySlides);
            } catch (error) {
                console.error('Error fetching categories:', error);
                // Fallback to default slides
                setSlides([
                    {
                        id: 1,
                        title: 'Shop All Categories',
                        subtitle: 'Discover Amazing Deals Across All Products',
                        buttonText: 'Explore',
                        link: '/products',
                        bgGradient: gradients[0]
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Auto-play with progress bar
    useEffect(() => {
        if (isUserInteracting) return;

        let progressValue = 0;
        setProgress(0);

        // Progress bar animation
        progressIntervalRef.current = setInterval(() => {
            progressValue += (100 / (autoPlayInterval / 100));
            setProgress(Math.min(progressValue, 100));
        }, 100);

        // Auto advance to next slide
        autoPlayTimerRef.current = setTimeout(() => {
            if (containerRef.current) {
                const nextSlide = (currentSlide + 1) % slides.length;
                const slideWidth = containerRef.current.offsetWidth;
                containerRef.current.scrollTo({
                    left: slideWidth * nextSlide,
                    behavior: 'smooth'
                });
            }
        }, autoPlayInterval);

        return () => {
            if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        };
    }, [slides.length, autoPlayInterval, isUserInteracting, currentSlide]);

    // Handle scroll to update current slide
    const handleScroll = () => {
        if (containerRef.current && !isDragging) {
            const slideWidth = containerRef.current.offsetWidth;
            const scrollLeft = containerRef.current.scrollLeft;
            const newSlide = Math.round(scrollLeft / slideWidth);

            if (newSlide !== currentSlide && newSlide >= 0 && newSlide < slides.length) {
                setCurrentSlide(newSlide);
                setProgress(0);
            }
        }
    };

    // Mouse drag handlers for desktop
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.pageX);
        if (containerRef.current) {
            setScrollLeftStart(containerRef.current.scrollLeft);
        }
        setIsUserInteracting(true);
        if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !containerRef.current) return;
        e.preventDefault();
        const x = e.pageX;
        const walk = (x - startX) * 2;

        // Only scroll if mouse moved more than 5px (distinguish click from drag)
        if (Math.abs(walk) > 5) {
            containerRef.current.scrollLeft = scrollLeftStart - walk;
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        const wasDragging = isDragging && Math.abs(e.pageX - startX) > 5;
        setIsDragging(false);

        // Prevent link navigation if user was dragging
        if (wasDragging) {
            e.preventDefault();
            e.stopPropagation();
        }

        setTimeout(() => {
            setIsUserInteracting(false);
        }, 3000);
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
        }
    };

    // Touch handlers for mobile
    const handleTouchStart = () => {
        setIsUserInteracting(true);
        if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };

    const handleTouchEnd = () => {
        setTimeout(() => {
            setIsUserInteracting(false);
        }, 3000);
    };

    const goToSlide = (index: number) => {
        if (containerRef.current) {
            const slideWidth = containerRef.current.offsetWidth;
            containerRef.current.scrollTo({
                left: slideWidth * index,
                behavior: 'smooth'
            });
            setCurrentSlide(index);
            setProgress(0);
        }
    };

    return (
        <div className="relative h-[160px] md:h-full rounded-none md:rounded-2xl overflow-hidden w-full max-w-full group">
            {/* Loading State */}
            {loading && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent mx-auto mb-3"></div>
                        <p className="text-xs md:text-base font-medium">Loading Categories...</p>
                    </div>
                </div>
            )}

            {/* Show slides when loaded */}
            {!loading && slides.length > 0 && (
                <>
                    {/* Enhanced Animated Particles - Don't block mouse events */}
                    <div className="particle-enhanced pointer-events-none" style={{ zIndex: 10 }}></div>
                    <div className="particle-enhanced pointer-events-none" style={{ zIndex: 10, animationDelay: '0.5s' }}></div>
                    <div className="particle-enhanced pointer-events-none" style={{ zIndex: 10, animationDelay: '1s' }}></div>
                    <div className="particle-enhanced pointer-events-none" style={{ zIndex: 10, animationDelay: '1.5s' }}></div>
                    <div className="particle-enhanced pointer-events-none" style={{ zIndex: 10, animationDelay: '2s' }}></div>
                    <div className="particle-enhanced pointer-events-none" style={{ zIndex: 10, animationDelay: '2.5s' }}></div>

                    {/* Slides Container with Ken Burns Effect */}
                    <div
                        ref={containerRef}
                        className={`flex h-full overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
                            }`}
                        onScroll={handleScroll}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                            userSelect: 'none',
                            WebkitUserSelect: 'none'
                        }}
                    >
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`flex-shrink-0 w-full h-full relative snap-start snap-always overflow-hidden`}
                            >
                                {/* Animated Background with Ken Burns Effect - Don't block drag */}
                                <div
                                    className={`absolute inset-0 pointer-events-none ${index === currentSlide ? 'animate-ken-burns' : ''}`}
                                    style={{
                                        transform: index === currentSlide ? 'scale(1.1)' : 'scale(1)',
                                        transition: 'transform 6s ease-in-out'
                                    }}
                                >
                                    {/* Background Image if available, otherwise gradient */}
                                    {slide.image ? (
                                        <>
                                            <div
                                                className="absolute inset-0 bg-cover bg-center pointer-events-none"
                                                style={{
                                                    backgroundImage: `url(${slide.image})`
                                                }}
                                            ></div>
                                            {/* Stronger overlay for image backgrounds to ensure text readability */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient} opacity-70 pointer-events-none`}></div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none"></div>
                                        </>
                                    ) : (
                                        <>
                                            {/* Gradient background for categories without images */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient} pointer-events-none`}></div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
                                        </>
                                    )}
                                </div>

                                {/* Content with Parallax Effect */}
                                <div className="relative h-full flex items-center justify-center text-center text-white px-4 md:px-8">
                                    <div className={`transform transition-all duration-1000 ${index === currentSlide
                                        ? 'translate-y-0 opacity-100'
                                        : 'translate-y-8 opacity-0'
                                        }`}>
                                        {/* Title with Stagger Animation */}
                                        <h2 className={`text-xl md:text-6xl font-black mb-2 md:mb-6 drop-shadow-2xl ${index === currentSlide ? 'animate-slide-up-fade' : ''
                                            }`}
                                            style={{
                                                textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                                animationDelay: '0.2s'
                                            }}
                                        >
                                            {slide.title}
                                        </h2>

                                        {/* Subtitle with Delayed Animation */}
                                        <p className={`text-sm md:text-3xl mb-3 md:mb-8 font-medium drop-shadow-xl ${index === currentSlide ? 'animate-slide-up-fade' : ''
                                            }`}
                                            style={{
                                                textShadow: '0 2px 15px rgba(0,0,0,0.4)',
                                                animationDelay: '0.4s'
                                            }}
                                        >
                                            {slide.subtitle}
                                        </p>

                                        {/* Button with Scale Animation */}
                                        <a
                                            href={slide.link}
                                            onClick={(e) => {
                                                // Prevent navigation if user was dragging
                                                if (isDragging || Math.abs(e.clientX - startX) > 5) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className={`inline-block bg-white text-gray-900 px-6 py-2 md:px-10 md:py-4 rounded-full font-bold text-sm md:text-xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 ${index === currentSlide ? 'animate-bounce-in' : ''
                                                }`}
                                            style={{
                                                animationDelay: '0.6s',
                                                boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                                            }}
                                        >
                                            {slide.buttonText}
                                            <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                                        </a>
                                    </div>
                                </div>

                                {/* Decorative Elements */}
                                {index === currentSlide && (
                                    <>
                                        <div className="absolute top-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none"></div>
                                        <div className="absolute bottom-0 right-0 w-40 h-40 md:w-80 md:h-80 bg-white/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '1s' }}></div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Animated Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
                        <div
                            className="h-full bg-gradient-to-r from-white via-purple-200 to-white transition-all duration-100 ease-linear"
                            style={{
                                width: `${progress}%`,
                                boxShadow: '0 0 10px rgba(255,255,255,0.5)'
                            }}
                        ></div>
                    </div>

                    {/* Enhanced Dot Indicators with Animation */}
                    <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-20">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`relative transition-all duration-300 ${index === currentSlide
                                    ? 'w-8 md:w-12 h-2 md:h-3'
                                    : 'w-2 md:w-3 h-2 md:h-3'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            >
                                <div className={`w-full h-full rounded-full transition-all duration-300 ${index === currentSlide
                                    ? 'bg-white shadow-lg shadow-white/50'
                                    : 'bg-white/40 hover:bg-white/60'
                                    }`}></div>
                                {index === currentSlide && (
                                    <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-75"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }

                @keyframes ken-burns {
                    0% { transform: scale(1) translateX(0); }
                    50% { transform: scale(1.15) translateX(-5%); }
                    100% { transform: scale(1.1) translateX(0); }
                }

                .animate-ken-burns {
                    animation: ken-burns 6s ease-in-out infinite;
                }

                @keyframes slide-up-fade {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-slide-up-fade {
                    animation: slide-up-fade 0.8s ease-out forwards;
                }

                @keyframes bounce-in {
                    0% {
                        opacity: 0;
                        transform: scale(0.3);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1.05);
                    }
                    70% {
                        transform: scale(0.9);
                    }
                    100% {
                        transform: scale(1);
                    }
                }

                .animate-bounce-in {
                    animation: bounce-in 0.8s ease-out forwards;
                }

                @keyframes pulse-slow {
                    0%, 100% {
                        opacity: 0.3;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.6;
                        transform: scale(1.1);
                    }
                }

                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }

                .particle-enhanced {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: white;
                    border-radius: 50%;
                    animation: float-enhanced 15s infinite ease-in-out;
                    opacity: 0.6;
                    box-shadow: 0 0 10px rgba(255,255,255,0.8);
                }

                @keyframes float-enhanced {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0.3;
                    }
                    25% {
                        transform: translate(100px, -50px) scale(1.5);
                        opacity: 0.8;
                    }
                    50% {
                        transform: translate(200px, 20px) scale(1);
                        opacity: 0.5;
                    }
                    75% {
                        transform: translate(100px, 80px) scale(1.2);
                        opacity: 0.7;
                    }
                }
            `}</style>
                </>
            )}
        </div>
    );
}
