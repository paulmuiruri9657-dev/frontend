'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Upload, Package, CheckCircle, Truck, MapPin, Tag } from 'lucide-react';
import { Category } from '@/types';
import { SellPageSkeleton } from '@/components/skeletons/SellPageSkeleton';

const COUNTIES = [
    'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita/Taveta', 'Garissa', 'Wajir', 'Mandera', 'Marsabit',
    'Isiolo', 'Meru', 'Tharaka-Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua', 'Nyeri', 'Kirinyaga',
    'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot', 'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo/Marakwet', 'Nandi', 'Baringo',
    'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia',
    'Siaya', 'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi City'
].sort();

export default function SellPage() {
    const router = useRouter();
    const { user, refreshUser } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [images, setImages] = useState<File[]>([]);

    // Brand selection state
    const [availableBrands, setAvailableBrands] = useState<string[]>([]);
    const [brandSearch, setBrandSearch] = useState('');
    const [showBrandDropdown, setShowBrandDropdown] = useState(false);
    const [isCustomBrand, setIsCustomBrand] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        oldPrice: '',
        categories: [] as string[], // Explicitly type as string array
        brand: '',
        stock: '',
        warranty: '',
        keyFeatures: [''],
        isFlashSale: false,
        condition: 'new',
        location: '',
        deliveryType: 'platform',
        meetupPoint: ''
    });

    // Seller Upgrade State (Moved to top to avoid conditional hook call)
    const [upgradeForm, setUpgradeForm] = useState({
        businessName: '',
        phone: user?.phone || '',
        address: user?.addresses?.[0]?.address || '',
        city: user?.addresses?.[0]?.city || '',
        region: user?.addresses?.[0]?.region || '',
        businessRegistrationNumber: '',
        taxId: ''
    });

    const handleUpgradeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setUploading(true);

        try {
            await api.becomeSeller(upgradeForm);
            await refreshUser();
            // Success! The component will re-render and user.role will be 'seller'
            // showing the product form instead.
            setSuccess(true);
            setTimeout(() => setSuccess(false), 5000); // clear success msg after delay
        } catch (error: any) {
            setError(error.message || 'Failed to upgrade account');
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, brandsRes] = await Promise.all([
                    api.getCategories({ flat: true }),
                    api.getBrands()
                ]);

                if (categoriesRes.data) setCategories(categoriesRes.data);
                if (brandsRes.success && brandsRes.data) {
                    setAvailableBrands(brandsRes.data.map((b: any) => b.brand).sort());
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter brands based on search
    const filteredBrands = availableBrands.filter(b =>
        b.toLowerCase().includes(brandSearch.toLowerCase())
    );

    const handleBrandSelect = (brand: string) => {
        setFormData(prev => ({ ...prev, brand }));
        setBrandSearch(brand);
        setShowBrandDropdown(false);
        setIsCustomBrand(false);
    };

    const handleCustomBrand = () => {
        setFormData(prev => ({ ...prev, brand: brandSearch }));
        setShowBrandDropdown(false);
        setIsCustomBrand(true);
    };



    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleCategoryToggle = (categoryId: string) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(categoryId)
                ? prev.categories.filter(id => id !== categoryId)
                : [...prev.categories, categoryId]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.categories.length === 0) {
            setError('Please select at least one category');
            return;
        }

        if (!formData.brand) {
            setError('Please select or enter a brand');
            return;
        }

        setUploading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('price', formData.price);
            if (formData.oldPrice) data.append('oldPrice', formData.oldPrice);

            // Send all categories (backend will handle both single and multiple)
            if (formData.categories.length === 1) {
                data.append('category', formData.categories[0]);
            } else {
                data.append('category', JSON.stringify(formData.categories));
            }

            data.append('brand', formData.brand);
            data.append('stock', formData.stock);
            if (formData.warranty) data.append('warranty', formData.warranty);

            // Add new fields
            data.append('condition', formData.condition);
            data.append('location', formData.location);
            data.append('deliveryType', formData.deliveryType);
            if (formData.deliveryType === 'seller' && formData.meetupPoint) {
                data.append('meetupPoint', formData.meetupPoint);
            }

            data.append('keyFeatures', JSON.stringify(formData.keyFeatures.filter(f => f)));
            data.append('isFlashSale', formData.isFlashSale.toString());

            images.forEach(image => {
                data.append('images', image);
            });

            await api.createProduct(data);
            setSuccess(true);
            setFormData({
                title: '', description: '', price: '', oldPrice: '',
                categories: [], brand: '', stock: '', warranty: '', keyFeatures: [''], isFlashSale: false,
                condition: 'new', location: '', deliveryType: 'platform', meetupPoint: ''
            });
            setImages([]);
            setBrandSearch('');
            setIsCustomBrand(false);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <SellPageSkeleton />;
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
                    <p className="text-gray-600 mb-6">You need to be logged in as a seller to access this page.</p>
                    <p className="text-sm text-gray-500">
                        Don't have a seller account? Click "Sign In" at the top and select "Create Account",
                        then choose "Sell" during registration.
                    </p>
                </div>
            </div>
        );
    }



    if (user.role !== 'seller') {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-10">
                        <Package className="h-16 w-16 text-[#8b5cf6] mx-auto mb-4" />
                        <h1 className="text-3xl font-extrabold text-gray-900">Become a Seller</h1>
                        <p className="mt-2 text-lg text-gray-600">
                            Start selling on EcoLooP Ke today! Just fill in your business details below.
                        </p>
                    </div>

                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        {error && (
                            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleUpgradeSubmit}>
                            <div>
                                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                                    Business Name *
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="businessName"
                                        name="businessName"
                                        type="text"
                                        required
                                        value={upgradeForm.businessName}
                                        onChange={(e) => setUpgradeForm({ ...upgradeForm, businessName: e.target.value })}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#8b5cf6] focus:border-[#8b5cf6] sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                        City *
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="city"
                                            name="city"
                                            type="text"
                                            required
                                            value={upgradeForm.city}
                                            onChange={(e) => setUpgradeForm({ ...upgradeForm, city: e.target.value })}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#8b5cf6] focus:border-[#8b5cf6] sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                                        Region/County *
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            id="region"
                                            name="region"
                                            required
                                            value={upgradeForm.region}
                                            onChange={(e) => setUpgradeForm({ ...upgradeForm, region: e.target.value })}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8b5cf6] focus:border-[#8b5cf6] sm:text-sm"
                                        >
                                            <option value="">Select a county</option>
                                            {COUNTIES.map(county => (
                                                <option key={county} value={county}>{county}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                    Business Address *
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        required
                                        value={upgradeForm.address}
                                        onChange={(e) => setUpgradeForm({ ...upgradeForm, address: e.target.value })}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#8b5cf6] focus:border-[#8b5cf6] sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    Business Phone *
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        value={upgradeForm.phone}
                                        onChange={(e) => setUpgradeForm({ ...upgradeForm, phone: e.target.value })}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#8b5cf6] focus:border-[#8b5cf6] sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="regNumber" className="block text-sm font-medium text-gray-700">
                                        Business Reg. Number <span className="text-gray-400 text-xs">(Optional)</span>
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="regNumber"
                                            name="regNumber"
                                            type="text"
                                            value={upgradeForm.businessRegistrationNumber}
                                            onChange={(e) => setUpgradeForm({ ...upgradeForm, businessRegistrationNumber: e.target.value })}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#8b5cf6] focus:border-[#8b5cf6] sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">
                                        Tax ID / PIN <span className="text-gray-400 text-xs">(Optional)</span>
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="taxId"
                                            name="taxId"
                                            type="text"
                                            value={upgradeForm.taxId}
                                            onChange={(e) => setUpgradeForm({ ...upgradeForm, taxId: e.target.value })}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#8b5cf6] focus:border-[#8b5cf6] sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8b5cf6] hover:bg-[#7c3aed] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8b5cf6] disabled:opacity-50"
                                >
                                    {uploading ? 'Processing...' : 'Upgrade to Seller Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-[#8b5cf6] via-purple-600 to-[#7c3aed] bg-clip-text text-transparent">Add New Product</h1>

                {success && (
                    <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4 mb-6 flex items-center gap-3">
                        <CheckCircle className="h-6 w-6 text-green-700" />
                        <p className="text-green-900 font-semibold">Product uploaded successfully! It will appear on the homepage.</p>
                    </div>
                )}

                {error && <div className="bg-red-100 border-2 border-red-400 text-red-900 font-semibold p-4 rounded-lg mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6 md:p-8 space-y-6">
                    {/* Product Information Section */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-5 border-2 border-purple-200 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Package className="h-6 w-6 text-[#8b5cf6]" />
                            Product Information
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Product Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] text-gray-900 font-medium bg-white"
                                    placeholder="Enter product title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Description *</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] text-gray-900 font-medium bg-white"
                                    placeholder="Describe your product in detail"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 border-2 border-green-200 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Price (KSh) *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] text-gray-900 font-bold bg-white"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Old Price (KSh) <span className="text-gray-500 font-normal">(Optional)</span></label>
                                <input
                                    type="number"
                                    value={formData.oldPrice}
                                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] text-gray-900 font-bold bg-white"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category & Brand Section */}
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-5 border-2 border-orange-200 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Category & Brand</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-900 mb-3">
                                    Categories *
                                    {formData.categories.length > 0 && (
                                        <span className="ml-2 text-[#8b5cf6] font-bold">
                                            ({formData.categories.length} selected)
                                        </span>
                                    )}
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-2 border-2 border-gray-200 rounded-lg bg-white">
                                    {categories.map((cat) => (
                                        <label
                                            key={cat._id}
                                            className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${formData.categories.includes(cat._id)
                                                ? 'border-[#8b5cf6] bg-purple-50 shadow-md'
                                                : 'border-gray-300 hover:border-[#8b5cf6] hover:bg-purple-50'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.categories.includes(cat._id)}
                                                onChange={() => handleCategoryToggle(cat._id)}
                                                className="w-5 h-5 text-[#8b5cf6] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#8b5cf6]"
                                            />
                                            <span className="font-semibold text-sm text-gray-900">
                                                {cat.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Brand Selection with Autocomplete */}
                            <div className="relative">
                                <label className="block text-sm font-bold text-gray-900 mb-2">Brand *</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={brandSearch}
                                        onFocus={() => setShowBrandDropdown(true)}
                                        onChange={(e) => {
                                            setBrandSearch(e.target.value);
                                            setShowBrandDropdown(true);
                                            setFormData({ ...formData, brand: '' }); // Reset brand until selected or added
                                        }}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] text-gray-900 font-medium bg-white"
                                        placeholder="Search or enter brand name..."
                                        autoComplete="off"
                                    />
                                    {showBrandDropdown && brandSearch && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                            {filteredBrands.length > 0 && (
                                                <>
                                                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50">
                                                        Existing Brands
                                                    </div>
                                                    {filteredBrands.map(brand => (
                                                        <button
                                                            key={brand}
                                                            type="button"
                                                            onClick={() => handleBrandSelect(brand)}
                                                            className="w-full text-left px-4 py-2 hover:bg-purple-50 text-gray-800 font-medium transition-colors border-b border-gray-50 last:border-0"
                                                        >
                                                            {brand}
                                                        </button>
                                                    ))}
                                                </>
                                            )}

                                            {/* Option to add custom brand */}
                                            {brandSearch && !availableBrands.includes(brandSearch) && (
                                                <button
                                                    type="button"
                                                    onClick={handleCustomBrand}
                                                    className="w-full text-left px-4 py-3 hover:bg-purple-100 text-[#8b5cf6] font-bold transition-colors border-l-4 border-[#8b5cf6]"
                                                >
                                                    + Use "{brandSearch}" as brand
                                                </button>
                                            )}

                                            {/* If no filtered brands and not adding custom */}
                                            {filteredBrands.length === 0 && availableBrands.includes(brandSearch) && (
                                                <div className="px-4 py-3 text-center text-gray-500">
                                                    Brand already selected
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {/* Overlay to close dropdown when clicking outside (simplified) */}
                                    {showBrandDropdown && (
                                        <div
                                            className="fixed inset-0 z-0"
                                            onClick={() => {
                                                if (!formData.brand && brandSearch && isCustomBrand) {
                                                    // Keep custom brand if valid
                                                } else if (!formData.brand && brandSearch) {
                                                    // If user typed but didn't select/confirm, assume custom? 
                                                    // Or better, just clear or keep as is? 
                                                    // Let's force them to click buttons for clarity, 
                                                    // but if they click away we hide.
                                                }
                                                setShowBrandDropdown(false);
                                            }}
                                        />
                                    )}
                                </div>
                                {isCustomBrand && (
                                    <p className="text-xs text-[#8b5cf6] mt-1 font-semibold">
                                        ✨ Adding as a new brand
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stock & Warranty Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-5 border-2 border-blue-200 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Stock & Warranty</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Stock Quantity *</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] text-gray-900 font-bold bg-white"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Warranty <span className="text-gray-500 font-normal">(Optional)</span></label>
                                <input
                                    type="text"
                                    value={formData.warranty}
                                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                                    placeholder="e.g., 1 Year"
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] text-gray-900 font-medium bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Condition & Delivery Section */}
                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-5 border-2 border-teal-200 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Truck className="h-6 w-6 text-[#8b5cf6]" />
                            Condition & Delivery
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Condition */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2">Item Condition *</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['new', 'like-new', 'used', 'refurbished'].map((cond) => (
                                        <button
                                            key={cond}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, condition: cond })}
                                            className={`p-3 border-2 rounded-lg text-sm font-semibold capitalize transition-all ${formData.condition === cond
                                                ? 'border-[#8b5cf6] bg-purple-50 text-[#8b5cf6]'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                }`}
                                        >
                                            {cond.replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 mb-2 flex items-center gap-1">
                                    <MapPin className="h-4 w-4 text-gray-500" /> Location *
                                </label>
                                <select
                                    required
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] text-gray-900 font-medium bg-white"
                                >
                                    <option value="">Select County</option>
                                    {COUNTIES.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Delivery Options */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-900 mb-2">Delivery Mode *</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {[
                                        { id: 'platform', label: 'Platform Delivery', desc: 'We handle shipping' },
                                        { id: 'seller', label: 'Self Delivery', desc: 'You deliver to buyer' },
                                        { id: 'meetup', label: 'Meetup', desc: 'Meet buyer in person' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, deliveryType: opt.id })}
                                            className={`p-4 border-2 rounded-lg text-left transition-all ${formData.deliveryType === opt.id
                                                ? 'border-[#8b5cf6] bg-purple-50 ring-1 ring-[#8b5cf6]'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="font-bold text-gray-900">{opt.label}</div>
                                            <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
                                        </button>
                                    ))}
                                </div>

                                {/* Meetup Point Input */}
                                {(formData.deliveryType === 'meetup' || formData.deliveryType === 'seller') && (
                                    <div className="mt-4 animate-fadeIn">
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            {formData.deliveryType === 'meetup' ? 'Preferred Meetup Location' : 'Dispatch Location'}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.meetupPoint}
                                            onChange={(e) => setFormData({ ...formData, meetupPoint: e.target.value })}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] text-gray-900 font-medium bg-white"
                                            placeholder={formData.deliveryType === 'meetup' ? "e.g. Nairobi CBD, Westlands Mall" : "e.g. Industrial Area Godown"}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Media Upload Section */}
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-5 border-2 border-pink-200 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Product Images</h2>

                        <div className="border-3 border-dashed border-[#8b5cf6] rounded-lg p-8 text-center bg-white">
                            <Upload className="h-16 w-16 text-[#8b5cf6] mx-auto mb-4" />
                            <input
                                type="file"
                                required
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="images"
                            />
                            <label htmlFor="images" className="cursor-pointer inline-block bg-[#8b5cf6] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#7c3aed] transition-all text-lg">
                                Click to Upload Images *
                            </label>
                            <p className="text-base text-gray-700 font-semibold mt-4">
                                {images.length > 0 ? `✅ ${images.length} file(s) selected` : 'JPEG, PNG, GIF, WebP (Max 40MB each, Max 10 images)'}
                            </p>
                        </div>
                    </div>

                    {/* Flash Sale Option */}
                    <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-lg p-5 mb-6">
                        <label className="flex items-center gap-4 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isFlashSale}
                                onChange={(e) => setFormData({ ...formData, isFlashSale: e.target.checked })}
                                className="w-6 h-6 text-[#8b5cf6] border-2 border-gray-400 rounded focus:ring-[#8b5cf6] focus:ring-2 cursor-pointer"
                            />
                            <div className="flex-1">
                                <span className="font-bold text-gray-900 text-lg">⚡ Add to Flash Sale</span>
                                <p className="text-sm text-gray-800 font-medium mt-1">
                                    Mark this product as a flash sale item to appear in the homepage flash sale section
                                </p>
                            </div>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white py-4 rounded-lg hover:from-[#7c3aed] hover:to-[#6d28d9] transition-all font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? '⏳ Uploading Product...' : '🚀 Upload Product'}
                    </button>
                </form>
            </div >
        </div >
    );
}

