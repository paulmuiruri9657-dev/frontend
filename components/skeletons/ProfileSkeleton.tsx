import { Skeleton } from "@/components/ui/Skeleton";

export function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
            {/* Mobile-Optimized Header Skeleton */}
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 px-4 py-6 md:py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        {/* Avatar Skeleton */}
                        <div className="relative">
                            <Skeleton className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white/30" />
                        </div>

                        {/* User Info Skeleton */}
                        <div className="flex-1 min-w-0 space-y-2">
                            <Skeleton className="h-6 w-32 md:w-48 bg-white/20" />
                            <Skeleton className="h-4 w-40 bg-white/20" />
                            <Skeleton className="h-3 w-24 bg-white/20" />
                        </div>
                    </div>

                    {/* Quick Stats Skeleton */}
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 text-center space-y-1">
                                <Skeleton className="h-6 w-8 mx-auto bg-white/20" />
                                <Skeleton className="h-3 w-12 mx-auto bg-white/20" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Desktop Tabs Skeleton */}
            <div className="hidden md:block bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-1">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="px-6 py-4">
                                <Skeleton className="h-5 w-20" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
                <div className="md:hidden mb-4">
                    <Skeleton className="h-6 w-32" />
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 space-y-4">
                    {/* Info Rows Skeleton */}
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-5 w-48" />
                        </div>
                    ))}

                    <div className="hidden md:block pt-4">
                        <Skeleton className="h-10 w-40" />
                    </div>
                </div>
            </div>
        </div>
    );
}
