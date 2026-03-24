import HomepageClient from './HomepageClient';

export const revalidate = 60; // ISR cache every 60 seconds

async function getHomepageData() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    
    try {
        const [flashSalesRes, productsRes, categoriesRes, brandsRes, homepageCatRes] = await Promise.all([
            fetch(`${API_URL}/products/flash-sales`, { next: { revalidate: 60 } }).then(res => res.json()).catch(() => ({ data: [], endsAt: null })),
            fetch(`${API_URL}/products?limit=50&sort=-createdAt`, { next: { revalidate: 60 } }).then(res => res.json()).catch(() => ({ data: [] })),
            fetch(`${API_URL}/categories?level=0`, { next: { revalidate: 60 } }).then(res => res.json()).catch(() => ({ data: [] })),
            fetch(`${API_URL}/brands`, { next: { revalidate: 60 } }).then(res => res.json()).catch(() => ({ data: [] })),
            fetch(`${API_URL}/products/homepage-categories`, { next: { revalidate: 60 } }).then(res => res.json()).catch(() => ({ data: [] }))
        ]);

        const brands = brandsRes.data || [];
        const topBrands = brands.slice(0, 16).map((b: any) => b.brand);

        return {
            flashSaleProducts: flashSalesRes.data || [],
            flashSaleEndsAt: flashSalesRes.endsAt || null,
            allProducts: productsRes.data || [],
            categories: categoriesRes.data || [],
            topBrands: topBrands,
            homepageGroups: homepageCatRes.data || []
        };
    } catch (error) {
        console.error('Failed to pre-fetch homepage data server-side:', error);
        return {
            flashSaleProducts: [],
            flashSaleEndsAt: null,
            allProducts: [],
            categories: [],
            topBrands: [],
            homepageGroups: []
        };
    }
}

export default async function Home() {
    const initialData = await getHomepageData();
    return <HomepageClient initialData={initialData} />;
}
