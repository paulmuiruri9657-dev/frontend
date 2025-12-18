'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Sliders } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterOption {
    name: string;
    count: number;
}

interface FilterData {
    brands: FilterOption[];
    locations: FilterOption[];
    priceRange: { min: number; max: number };
    totalProducts: number;
}

interface FilterSidebarProps {
    onFilterChange?: () => void;
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filterData, setFilterData] = useState<FilterData | null>(null);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    const [inStock, setInStock] = useState(false);
    const [selectedCondition, setSelectedCondition] = useState('');

    // Expandable sections
    const [expandedSections, setExpandedSections] = useState({
        price: true,
        brands: true,
        location: true,
        other: true
    });

    // Load filter data
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                const response = await fetch(`${API_URL}/api/products/filters`);
                const data = await response.json();
                if (data.success) {
                    setFilterData(data.data);
                    setPriceRange(data.data.priceRange);
                }
            } catch (error) {
                console.error('Error fetching filters:', error);
            }
        };
        fetchFilters();
    }, []);

    // Load filters from URL
    useEffect(() => {
        const brands = searchParams.get('brand')?.split(',') || [];
        const location = searchParams.get('location') || '';
        const minPrice = parseInt(searchParams.get('minPrice') || '0');
        const maxPrice = parseInt(searchParams.get('maxPrice') || '100000');
        const stock = searchParams.get('inStock') === 'true';
        const condition = searchParams.get('condition') || '';

        setSelectedBrands(brands.filter(b => b));
        setSelectedLocation(location);
        if (minPrice) setPriceRange(prev => ({ ...prev, min: minPrice }));
        if (maxPrice) setPriceRange(prev => ({ ...prev, max: maxPrice }));
        setInStock(stock);
        setSelectedCondition(condition);
    }, [searchParams]);

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        // Update brand filter
        if (selectedBrands.length > 0) {
            params.set('brand', selectedBrands.join(','));
        } else {
            params.delete('brand');
        }

        // Update location filter
        if (selectedLocation) {
            params.set('location', selectedLocation);
        } else {
            params.delete('location');
        }

        // Update price range
        if (filterData) {
            if (priceRange.min > filterData.priceRange.min) {
                params.set('minPrice', priceRange.min.toString());
            } else {
                params.delete('minPrice');
            }

            if (priceRange.max < filterData.priceRange.max) {
                params.set('maxPrice', priceRange.max.toString());
            } else {
                params.delete('maxPrice');
            }
        }

        // Update stock filter
        if (inStock) {
            params.set('inStock', 'true');
        } else {
            params.delete('inStock');
        }

        // Update condition filter
        if (selectedCondition) {
            params.set('condition', selectedCondition);
        } else {
            params.delete('condition');
        }

        // Reset to page 1 when filters change
        params.set('page', '1');

        const query = searchParams.get('q');
        const path = query ? `/search?${params.toString()}` : `/?${params.toString()}`;
        router.push(path);

        if (onFilterChange) onFilterChange();
    };

    const clearAllFilters = () => {
        setSelectedBrands([]);
        setSelectedLocation('');
        if (filterData) {
            setPriceRange(filterData.priceRange);
        }
        setInStock(false);
        setSelectedCondition('');

        const query = searchParams.get('q');
        const path = query ? `/search?q=${query}` : '/';
        router.push(path);

        if (onFilterChange) onFilterChange();
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const hasActiveFilters = selectedBrands.length > 0 || selectedLocation || selectedCondition || inStock ||
        (filterData && (priceRange.min > filterData.priceRange.min || priceRange.max < filterData.priceRange.max));

    if (!filterData) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100/50">
            {/* Header */}
            <div className="p-4 border-b border-gray-100/80 flex items-center justify-between bg-gradient-to-b from-gray-50/50 to-white">
                <div className="flex items-center gap-2">
                    <Sliders className="h-5 w-5 text-gray-700" />
                    <h2 className="font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Filters</h2>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={clearAllFilters}
                        className="text-sm text-[#8b5cf6] hover:text-[#7c3aed] font-medium transition-colors duration-150 hover:underline"
                    >
                        Clear all
                    </button>
                )}
            </div>

            <div className="divide-y divide-gray-100/80">
                {/* Price Range */}
                <div className="p-4 hover:bg-gray-50/50 transition-colors duration-150">
                    <button
                        onClick={() => toggleSection('price')}
                        className="flex items-center justify-between w-full mb-3 group"
                    >
                        <span className="font-semibold text-gray-900">Price Range</span>
                        {expandedSections.price ? <ChevronUp className="h-4 w-4 text-gray-600 group-hover:text-gray-900 transition-colors" /> : <ChevronDown className="h-4 w-4 text-gray-600 group-hover:text-gray-900 transition-colors" />}
                    </button>

                    {expandedSections.price && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-600">KSh {priceRange.min.toLocaleString()}</span>
                                <span className="text-gray-400">-</span>
                                <span className="text-gray-600">KSh {priceRange.max.toLocaleString()}</span>
                            </div>
                            <div className="space-y-2">
                                <input
                                    type="range"
                                    min={filterData.priceRange.min}
                                    max={filterData.priceRange.max}
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                                    className="w-full accent-[#8b5cf6]"
                                />
                                <input
                                    type="range"
                                    min={filterData.priceRange.min}
                                    max={filterData.priceRange.max}
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                                    className="w-full accent-[#8b5cf6]"
                                />
                            </div>
                            <button
                                onClick={applyFilters}
                                className="w-full bg-gradient-to-r from-[#8b5cf6] to-[#f7941d] text-white py-2.5 rounded-lg hover:from-[#7c3aed] hover:to-[#e8851c] transition-all duration-150 text-sm font-semibold shadow-md hover:shadow-lg active:scale-95"
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </div>

                {/* Location */}
                {filterData.locations.length > 0 && (
                    <div className="p-4">
                        <button
                            onClick={() => toggleSection('location')}
                            className="flex items-center justify-between w-full mb-3"
                        >
                            <span className="font-semibold text-gray-900">Location</span>
                            {expandedSections.location ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>

                        {expandedSections.location && (
                            <div className="space-y-2">
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => {
                                        setSelectedLocation(e.target.value);
                                        setTimeout(applyFilters, 100);
                                    }}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6] text-sm bg-white hover:border-gray-300 transition-all duration-150 cursor-pointer shadow-sm"
                                >
                                    <option value="">All Locations</option>
                                    {filterData.locations.map((loc) => (
                                        <option key={loc.name} value={loc.name}>
                                            {loc.name} ({loc.count})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                )}

                {/* Brands */}
                {filterData.brands.length > 0 && (
                    <div className="p-4">
                        <button
                            onClick={() => toggleSection('brands')}
                            className="flex items-center justify-between w-full mb-3"
                        >
                            <span className="font-semibold text-gray-900">Brand</span>
                            {expandedSections.brands ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>

                        {expandedSections.brands && (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {filterData.brands.slice(0, 10).map((brand) => (
                                    <label key={brand.name} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors duration-150">
                                        <input
                                            type="checkbox"
                                            checked={selectedBrands.includes(brand.name)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedBrands([...selectedBrands, brand.name]);
                                                } else {
                                                    setSelectedBrands(selectedBrands.filter(b => b !== brand.name));
                                                }
                                                setTimeout(applyFilters, 100);
                                            }}
                                            className="accent-[#8b5cf6]"
                                        />
                                        <span className="text-sm text-gray-700 flex-1">{brand.name}</span>
                                        <span className="text-xs text-gray-500">({brand.count})</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Other Filters */}
                <div className="p-4">
                    <button
                        onClick={() => toggleSection('other')}
                        className="flex items-center justify-between w-full mb-3"
                    >
                        <span className="font-semibold text-gray-900">Other</span>
                        {expandedSections.other ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {expandedSections.other && (
                        <div className="space-y-3">
                            {/* Condition Filter */}
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">Product Condition</label>
                                <div className="space-y-1.5">
                                    {[
                                        { value: '', label: 'All Conditions' },
                                        { value: 'new', label: 'New' },
                                        { value: 'used', label: 'Used' },
                                        { value: 'refurbished', label: 'Refurbished' }
                                    ].map((option) => (
                                        <label key={option.value} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors duration-150">
                                            <input
                                                type="radio"
                                                name="condition"
                                                value={option.value}
                                                checked={selectedCondition === option.value}
                                                onChange={(e) => {
                                                    setSelectedCondition(e.target.value);
                                                    setTimeout(applyFilters, 100);
                                                }}
                                                className="accent-[#8b5cf6]"
                                            />
                                            <span className="text-sm text-gray-700">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* In Stock Toggle */}
                            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors duration-150">
                                <input
                                    type="checkbox"
                                    checked={inStock}
                                    onChange={(e) => {
                                        setInStock(e.target.checked);
                                        setTimeout(applyFilters, 100);
                                    }}
                                    className="accent-[#8b5cf6]"
                                />
                                <span className="text-sm text-gray-700">In Stock Only</span>
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

