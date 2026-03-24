import CategoryClient from './CategoryClient';

export const revalidate = 60; // ISR cache every 60 seconds

async function getCategoryData(slug: string, searchParams: { [key: string]: string | string[] | undefined }) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    
    try {
        let category = null;
        let brands: string[] = [];

        if (slug === 'all') {
            category = {
                _id: 'all',
                name: 'All Products',
                slug: 'all',
                icon: '🛍️',
                level: 0,
                order: 0,
                isActive: true,
                productCount: 0,
                ancestors: [],
                createdAt: new Date(),
                updatedAt: new Date()
            };
            const brandsRes = await fetch(`${API_URL}/brands`, { next: { revalidate: 60 } })
                .then((res) => res.json())
                .catch(() => ({ data: [] }));
            brands = brandsRes.data?.map((b: any) => b.brand) || [];
        } else {
            const catRes = await fetch(`${API_URL}/categories/${slug}`, { next: { revalidate: 60 } })
                .then((res) => res.json())
                .catch(() => ({ data: null }));
            category = catRes.data;

            if (category) {
                const brandsRes = await fetch(`${API_URL}/categories/${slug}/brands`, { next: { revalidate: 60 } })
                    .then((res) => res.json())
                    .catch(() => ({ data: [] }));
                brands = brandsRes.data || [];
            }
        }

        const params = new URLSearchParams();
        if (slug !== 'all') params.append('category', slug);
        
        params.append('sort', (searchParams.sort as string) || '-createdAt');
        params.append('page', (searchParams.page as string) || '1');
        params.append('limit', '30');

        if (searchParams.brand) params.append('brand', searchParams.brand as string);
        if (searchParams.minPrice) params.append('minPrice', searchParams.minPrice as string);
        if (searchParams.maxPrice) params.append('maxPrice', searchParams.maxPrice as string);
        if (searchParams.rating) params.append('rating', searchParams.rating as string);

        const productsRes = await fetch(`${API_URL}/products?${params.toString()}`, { next: { revalidate: 60 } })
            .then((res) => res.json())
            .catch(() => ({ data: [], pagination: { page: 1, pages: 1, total: 0 } }));

        return {
            category,
            brands,
            products: productsRes.data || [],
            pagination: productsRes.pagination || { page: 1, pages: 1, total: 0 }
        };
    } catch (e) {
        console.error('Failed to pre-fetch category data server-side:', e);
        return null;
    }
}

export default async function CategoryPage({ params, searchParams }: { params: { slug: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
    const { slug } = params;
    const initialData = await getCategoryData(slug, searchParams);
    
    if (!initialData || !initialData.category) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
                <p className="text-gray-500 mb-6">The category you are looking for does not exist.</p>
                <a href="/" className="bg-[#8b5cf6] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#7c3aed]">
                    Return to Homepage
                </a>
            </div>
        );
    }

    return <CategoryClient initialData={initialData} slug={slug} />;
}
