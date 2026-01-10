import Script from 'next/script';

export default function WebSiteSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "EcoLooP Ke",
        "url": "https://ecoloop.co.ke",
        "description": "Online shopping for electronics, fashion, home & more in Kenya",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://ecoloop.co.ke/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        },
        "publisher": {
            "@type": "Organization",
            "name": "EcoLooP Ke",
            "logo": {
                "@type": "ImageObject",
                "url": "https://ecoloop.co.ke/images/logo.png"
            }
        }
    };

    return (
        <Script
            id="website-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
