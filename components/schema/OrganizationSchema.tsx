import Script from 'next/script';

export default function OrganizationSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "EcoLooP Ke",
        "alternateName": "EcoLoop Kenya",
        "url": "https://ecoloop.co.ke",
        "logo": "https://ecoloop.co.ke/images/logo.png",
        "description": "Your sustainable online shopping destination for electronics, fashion, home, beauty & more in Kenya",
        "email": "support@ecoloop.co.ke",
        "telephone": "+254-700-000000",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "KE",
            "addressLocality": "Nairobi",
            "addressRegion": "Nairobi County"
        },
        "sameAs": [
            "https://www.facebook.com/ecoloopke",
            "https://twitter.com/ecoloopke",
            "https://www.instagram.com/ecoloopke"
        ],
        "areaServed": {
            "@type": "Country",
            "name": "Kenya"
        },
        "foundingDate": "2024",
        "knowsAbout": [
            "Electronics",
            "Fashion",
            "Home Appliances",
            "Beauty Products",
            "Online Shopping"
        ]
    };

    return (
        <Script
            id="organization-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
