'use client';

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number; // ms delay before animation starts
    direction?: 'up' | 'left' | 'right' | 'none';
}

export default function AnimatedSection({
    children,
    className = '',
    delay = 0,
    direction = 'up',
}: AnimatedSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [delay]);

    const getTransform = () => {
        if (isVisible) return 'translate3d(0,0,0)';
        switch (direction) {
            case 'up': return 'translate3d(0,32px,0)';
            case 'left': return 'translate3d(-32px,0,0)';
            case 'right': return 'translate3d(32px,0,0)';
            default: return 'translate3d(0,0,0)';
        }
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: getTransform(),
                transition: `opacity 0.6s ease, transform 0.6s ease`,
            }}
        >
            {children}
        </div>
    );
}
