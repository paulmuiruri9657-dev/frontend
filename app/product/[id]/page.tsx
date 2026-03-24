import ProductClient from './ProductClient';

export const revalidate = 60; // ISR cache every 60 seconds

async function getProductData(slug: string) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    
    try {
        const productRes = await fetch(`${API_URL}/products/${slug}`, { next: { revalidate: 60 } }).then(res => res.json());
        
        if (!productRes || !productRes.data) {
            return null;
        }

        const productId = productRes.data._id;
        const reviewsRes = await fetch(`${API_URL}/products/${productId}/reviews`, { next: { revalidate: 60 } })
            .then(res => res.json())
            .catch(() => ({ data: { reviews: [], ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } } }));

        return {
            product: productRes.data,
            relatedProducts: productRes.data.relatedProducts || [],
            reviews: reviewsRes.data?.reviews || [],
            ratingBreakdown: reviewsRes.data?.ratingBreakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        };
    } catch (error) {
        console.error('Failed to pre-fetch product data server-side:', error);
        return null;
    }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
    // Next.js params are automatically available in server components via props
    const { id } = params;
    const initialData = await getProductData(id);
    
    if (!initialData) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[50vh]">
                <h1 className="text-2xl font-bold mb-4 text-gray-900">Product Not Found</h1>
                <p className="text-gray-500 mb-6">The item you are looking for is no longer available.</p>
                <a href="/" className="px-6 py-3 bg-[#8b5cf6] text-white rounded-xl font-bold hover:bg-[#7c3aed] transition-colors">
                    Return to Homepage
                </a>
            </div>
        );
    }
    
    return <ProductClient initialData={initialData} slug={id} />;
}
