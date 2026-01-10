import Script from 'next/script';

interface Product {
    _id: string;
    name: string;
    description: string;
    images: string[];
    price: number;
    comparePrice?: number;
    stock: number;
    brand?: string;
    category?: {
        name: string;
    };
    reviews?: any[];
    rating?: number;
}

interface ProductSchemaProps {
    product: Product;
}

export default function ProductSchema({ product }: ProductSchemaProps) {
    // Calculate average rating
    const averageRating = product.rating || 0;
    const reviewCount = product.reviews?.length || 0;

    const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.images?.map(img => `https://ecoloop.co.ke${img}`) || [],
        "sku": product._id,
        "brand": {
            "@type": "Brand",
            "name": product.brand || "EcoLooP"
        },
        "offers": {
            "@type": "Offer",
            "url": `https://ecoloop.co.ke/products/${product._id}`,
            "priceCurrency": "KES",
            "price": product.price,
            "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition",
            "seller": {
                "@type": "Organization",
                "name": "EcoLooP Ke"
            }
        },
        ...(reviewCount > 0 && {
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": averageRating,
                "reviewCount": reviewCount,
                "bestRating": 5,
                "worstRating": 1
            }
        }),
        ...(product.category && {
            "category": product.category.name
        })
    };

    return (
        <Script
            id="product-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
