import { MetadataRoute } from 'next';

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.ecoloop.co.ke/api';
const SITE_URL = 'https://ecoloop.co.ke';

// Helper function to fetch data with error handling
async function fetchData(endpoint: string) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            next: { revalidate: 3600 } // Revalidate every hour
        });
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Fetch categories
    const categoriesData = await fetchData('/categories?level=0');
    const categories = Array.isArray(categoriesData) ? categoriesData : [];

    // Fetch products (limit to most recent 1000 for performance)
    const productsData = await fetchData('/products?limit=1000&sort=-createdAt');
    const products = productsData?.products || [];

    // Fetch brands
    const brandsData = await fetchData('/brands');
    const brands = Array.isArray(brandsData) ? brandsData : [];

    // Static pages
    const staticPages = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1.0,
        },
        {
            url: `${SITE_URL}/categories`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/flash-sales`,
            lastModified: new Date(),
            changeFrequency: 'hourly' as const,
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/official-stores`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/help`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
    ];

    // Category pages
    const categoryPages = categories.map((category: any) => ({
        url: `${SITE_URL}/categories/${category.slug}`,
        lastModified: new Date(category.updatedAt || Date.now()),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));

    // Product pages
    const productPages = products.map((product: any) => ({
        url: `${SITE_URL}/products/${product._id}`,
        lastModified: new Date(product.updatedAt || Date.now()),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    // Brand pages
    const brandPages = brands.map((brand: any) => ({
        url: `${SITE_URL}/brands/${brand.slug || brand.name.toLowerCase().replace(/\s+/g, '-')}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [
        ...staticPages,
        ...categoryPages,
        ...productPages,
        ...brandPages,
    ];
}
