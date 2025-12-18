import { Skeleton } from "@/components/ui/Skeleton";

export function SellPageSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Skeleton className="h-10 w-64 mb-8 bg-purple-100" />

                <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6 md:p-8 space-y-6">
                    {/* Product Info Skeleton */}
                    <div className="rounded-lg p-5 border border-gray-100 mb-6">
                        <Skeleton className="h-8 w-48 mb-4 bg-purple-50" />
                        <div className="space-y-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </div>

                    {/* Pricing Skeleton */}
                    <div className="rounded-lg p-5 border border-gray-100 mb-6">
                        <Skeleton className="h-8 w-32 mb-4 bg-green-50" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </div>

                    {/* Category & Brand Skeleton */}
                    <div className="rounded-lg p-5 border border-gray-100 mb-6">
                        <Skeleton className="h-8 w-48 mb-4 bg-orange-50" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-48 w-full col-span-2" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </div>

                    {/* Stock & Warranty Skeleton */}
                    <div className="rounded-lg p-5 border border-gray-100 mb-6">
                        <Skeleton className="h-8 w-48 mb-4 bg-blue-50" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </div>

                    {/* Media Skeleton */}
                    <div className="rounded-lg p-5 border border-gray-100 mb-6">
                        <Skeleton className="h-8 w-40 mb-4 bg-pink-50" />
                        <Skeleton className="h-48 w-full rounded-lg" />
                    </div>

                    {/* Submit Button Skeleton */}
                    <Skeleton className="h-14 w-full rounded-lg bg-purple-100" />
                </div>
            </div>
        </div>
    );
}
