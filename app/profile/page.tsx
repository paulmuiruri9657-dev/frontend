'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Lock, MapPin, Package, Settings, Edit2, Trash2, Check, X, Plus, Camera, Bell, Shield, Globe, ChevronRight, ShoppingBag, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { ProfileSkeleton } from '@/components/skeletons/ProfileSkeleton';

type TabType = 'profile' | 'password' | 'addresses' | 'orders' | 'returns' | 'settings';

interface Address {
    _id: string;
    label: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    region: string;
    isDefault: boolean;
}

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('profile');

    // Profile edit state
    const [editMode, setEditMode] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        phone: ''
    });
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [changingPassword, setChangingPassword] = useState(false);

    // Address state
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<string | null>(null);
    const [addressForm, setAddressForm] = useState({
        label: 'Home',
        fullName: '',
        phone: '',
        address: '',
        city: '',
        region: '',
        isDefault: false
    });

    // Settings state
    const [settings, setSettings] = useState({
        emailNotifications: true,
        orderUpdates: true,
        promotions: false,
        newsletter: false,
        privateProfile: false,
        language: 'en'
    });

    // Orders state
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

    // Returns state  
    const [returns, setReturns] = useState<any[]>([]);
    const [loadingReturns, setLoadingReturns] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState<any>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        }

        if (user) {
            setProfileData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || ''
            });
            setAddresses(user.addresses || []);

            // Load orders when tab is active
            if (activeTab === 'orders') {
                loadOrders();
            }

            // Load returns when tab is active
            if (activeTab === 'returns') {
                loadReturns();
            }
        }
    }, [user, authLoading, router, activeTab]);

    const handleProfileUpdate = async () => {
        setSaving(true);
        try {
            await api.updateProfile(profileData);
            alert('Profile updated successfully!');
            setEditMode(false);
            window.location.reload(); // Refresh to get updated user data
        } catch (error: any) {
            alert(error.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        setChangingPassword(true);
        try {
            await api.changePassword(passwordData.currentPassword, passwordData.newPassword);
            alert('Password changed successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            alert(error.message || 'Failed to change password');
        } finally {
            setChangingPassword(false);
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.addAddress(addressForm);
            setAddresses(response.data);
            setShowAddressForm(false);
            setAddressForm({ label: 'Home', fullName: '', phone: '', address: '', city: '', region: '', isDefault: false });
            alert('Address added successfully!');
        } catch (error: any) {
            alert(error.message || 'Failed to add address');
        }
    };

    const handleUpdateAddress = async (addressId: string) => {
        try {
            const response = await api.updateAddress(addressId, addressForm);
            setAddresses(response.data);
            setEditingAddress(null);
            setAddressForm({ label: 'Home', fullName: '', phone: '', address: '', city: '', region: '', isDefault: false });
            alert('Address updated successfully!');
        } catch (error: any) {
            alert(error.message || 'Failed to update address');
        }
    };

    const handleDeleteAddress = async (addressId: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            const response = await api.deleteAddress(addressId);
            setAddresses(response.data);
            alert('Address deleted successfully!');
        } catch (error: any) {
            alert(error.message || 'Failed to delete address');
        }
    };

    const loadOrders = async () => {
        setLoadingOrders(true);
        try {
            const response = await api.getUserOrders({ limit: 50 });
            setOrders(response.data || []);
        } catch (error) {
            console.error('Failed to load orders:', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const viewOrderDetails = async (orderId: string) => {
        try {
            const response = await api.getUserOrder(orderId);
            setSelectedOrder(response.data);
        } catch (error) {
            console.error('Failed to load order details:', error);
            alert('Could not load order details');
        }
    };

    const loadReturns = async () => {
        setLoadingReturns(true);
        try {
            const response = await api.getUserReturns();
            setReturns(response.data || []);
        } catch (error) {
            console.error('Failed to load returns:', error);
        } finally {
            setLoadingReturns(false);
        }
    };

    const startEditAddress = (address: Address) => {
        setEditingAddress(address._id);
        setAddressForm({
            label: address.label,
            fullName: address.fullName,
            phone: address.phone,
            address: address.address,
            city: address.city,
            region: address.region,
            isDefault: address.isDefault
        });
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        setUploadingAvatar(true);
        try {
            // Create FormData to send file
            const formData = new FormData();
            formData.append('avatar', file);

            // Directly call the API endpoint for multipart/form-data
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to upload picture');
            }

            alert('Profile picture updated!');
            window.location.reload();
        } catch (error: any) {
            console.error('Upload Error:', error);
            alert(error.message || 'Failed to upload picture');
            // Revert preview on error
            setAvatarPreview(null);
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleDeleteAvatar = async () => {
        if (!confirm('Are you sure you want to remove your profile picture?')) return;

        setUploadingAvatar(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/profile/avatar`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to remove picture');
            }

            alert('Profile picture removed!');
            window.location.reload();
        } catch (error: any) {
            console.error('Delete Error:', error);
            alert(error.message || 'Failed to remove picture');
        } finally {
            setUploadingAvatar(false);
        }
    };

    if (authLoading) {
        return (
            <ProfileSkeleton />
        );
    }

    if (!user) return null;

    const tabs = [
        { id: 'profile' as TabType, label: 'Profile', icon: User },
        { id: 'password' as TabType, label: 'Password', icon: Lock },
        { id: 'addresses' as TabType, label: 'Addresses', icon: MapPin },
        { id: 'orders' as TabType, label: 'Orders', icon: Package },
        { id: 'returns' as TabType, label: 'Returns', icon: RefreshCw },
        { id: 'settings' as TabType, label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
            {/* Mobile-Optimized Header */}
            <div className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white px-4 py-6 md:py-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-2 border-white/30">
                                {avatarPreview || user.avatar ? (
                                    <img src={avatarPreview || user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="h-8 w-8 md:h-10 md:w-10 text-white/80" />
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2 relative">
                            <label className="bg-white text-[#8b5cf6] p-2 rounded-full cursor-pointer hover:bg-gray-100 shadow-lg transition-transform hover:scale-110">
                                <Camera className="h-4 w-4" />
                                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploadingAvatar} />
                            </label>
                            {(user.avatar || avatarPreview) && (
                                <button
                                    onClick={handleDeleteAvatar}
                                    disabled={uploadingAvatar}
                                    className="bg-white text-red-500 p-2 rounded-full hover:bg-red-50 shadow-lg transition-transform hover:scale-110"
                                    title="Remove picture"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-lg md:text-2xl font-bold truncate">{user.fullName}</h1>
                            <p className="text-xs md:text-sm text-white/80 truncate">{user.email}</p>
                            <p className="text-xs text-white/60 mt-1">Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</p>
                        </div>
                    </div>

                    {/* Quick Stats - Mobile Compact */}
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 text-center">
                            <div className="text-base md:text-xl font-bold">0</div>
                            <div className="text-[10px] md:text-xs text-white/80">Orders</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 text-center">
                            <div className="text-base md:text-xl font-bold">{user.wishlist?.length || 0}</div>
                            <div className="text-[10px] md:text-xs text-white/80">Wishlist</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-3 text-center">
                            <div className="text-base md:text-xl font-bold">{addresses.length}</div>
                            <div className="text-[10px] md:text-xs text-white/80">Addresses</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Seller Analytics Access - Show only for sellers */}
            {(user.role === 'seller' || user.role === 'admin') && (
                <div className="max-w-7xl mx-auto px-4 -mt-3 relative z-10 space-y-3">
                    <button
                        onClick={() => router.push('/seller-dashboard')}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all rounded-lg p-4 flex items-center justify-between group shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2.5 rounded-lg">
                                <ShoppingBag className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-left text-white">
                                <p className="font-bold text-sm md:text-base">📦 Seller Dashboard</p>
                                <p className="text-xs text-white/80">Manage orders & products</p>
                            </div>
                        </div>
                        <ChevronRight className="h-6 w-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </button>

                    <button
                        onClick={() => router.push('/seller-analytics')}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all rounded-lg p-4 flex items-center justify-between group shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2.5 rounded-lg">
                                <Package className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-left text-white">
                                <p className="font-bold text-sm md:text-base">📊 Analytics</p>
                                <p className="text-xs text-white/80">View performance & revenue</p>
                            </div>
                        </div>
                        <ChevronRight className="h-6 w-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </button>
                </div>
            )}

            {/* Admin Dashboard Access - Show only for admin */}
            {user.role === 'admin' && (
                <div className="max-w-7xl mx-auto px-4 mt-4 relative z-10">
                    <button
                        onClick={() => router.push('/admin')}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all rounded-lg p-4 flex items-center justify-between group shadow-lg"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2.5 rounded-lg">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-left text-white">
                                <p className="font-bold text-sm md:text-base">🔐 Admin Dashboard</p>
                                <p className="text-xs text-white/80">100% website control - manage users, products & orders</p>
                            </div>
                        </div>
                        <ChevronRight className="h-6 w-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </button>
                </div>
            )}

            {/* Become a Seller - Show only for regular users */}
            {user.role === 'user' && (
                <div className="max-w-7xl mx-auto px-4 -mt-3 relative z-10">
                    <button
                        onClick={() => router.push('/sell')}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all rounded-lg p-4 flex items-center justify-between group shadow-lg border border-white/20"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2.5 rounded-lg">
                                <Package className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-left text-white">
                                <p className="font-bold text-sm md:text-base">🚀 Become a Seller</p>
                                <p className="text-xs text-white/80">Start selling your products on EcoLooP today!</p>
                            </div>
                        </div>
                        <ChevronRight className="h-6 w-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </button>
                </div>
            )}


            {/* Desktop Tabs - Hidden on Mobile */}
            <div className="hidden md:block bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-[#8b5cf6] text-[#8b5cf6]'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <tab.icon className="h-5 w-5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
                {/* Mobile Section Header */}
                <div className="md:hidden mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                        {tabs.find(t => t.id === activeTab)?.label}
                    </h2>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="space-y-4">
                            {!editMode ? (
                                <>
                                    <div className="flex items-center justify-between pb-4 border-b md:hidden">
                                        <h3 className="font-semibold text-gray-900">Personal Information</h3>
                                        <button onClick={() => setEditMode(true)} className="text-[#8b5cf6] text-sm font-medium flex items-center gap-1">
                                            <Edit2 className="h-4 w-4" />
                                            Edit
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {/* Compact Info Cards */}
                                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                            <span className="text-sm text-gray-500">First Name</span>
                                            <span className="font-medium text-gray-900">{user.firstName}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                            <span className="text-sm text-gray-500">Last Name</span>
                                            <span className="font-medium text-gray-900">{user.lastName}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                            <span className="text-sm text-gray-500">Email</span>
                                            <span className="font-medium text-gray-900 truncate max-w-[60%]">{user.email}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                            <span className="text-sm text-gray-500">Phone</span>
                                            <span className="font-medium text-gray-900">{user.phone || 'Not set'}</span>
                                        </div>
                                    </div>

                                    <button onClick={() => setEditMode(true)} className="hidden md:flex w-full items-center justify-center gap-2 bg-[#8b5cf6] text-white px-6 py-3 rounded-lg hover:bg-[#7c3aed] mt-6">
                                        <Edit2 className="h-4 w-4" />
                                        Edit Profile
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                        <div>
                                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                                            <input type="text" value={profileData.firstName} onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                                            <input type="text" value={profileData.lastName} onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                                        <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent" />
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-2 md:gap-3 pt-2">
                                        <button onClick={handleProfileUpdate} disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-[#8b5cf6] text-white px-6 py-2.5 rounded-lg hover:bg-[#7c3aed] disabled:opacity-50 text-sm font-medium">
                                            <Check className="h-4 w-4" />
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button onClick={() => { setEditMode(false); setProfileData({ firstName: user.firstName || '', lastName: user.lastName || '', phone: user.phone || '' }); }} className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 text-sm font-medium">
                                            <X className="h-4 w-4" />
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                                <input type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} required className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                                <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required minLength={6} className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent" />
                                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                            </div>
                            <div>
                                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
                                <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required minLength={6} className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent" />
                            </div>
                            <button type="submit" disabled={changingPassword} className="w-full bg-[#8b5cf6] text-white px-6 py-3 rounded-lg hover:bg-[#7c3aed] font-medium disabled:opacity-50 text-sm md:text-base">
                                {changingPassword ? 'Changing Password...' : 'Change Password'}
                            </button>
                        </form>
                    )}

                    {/* Addresses Tab - Mobile Optimized */}
                    {activeTab === 'addresses' && (
                        <div className="space-y-4">
                            {!showAddressForm && !editingAddress && (
                                <button onClick={() => setShowAddressForm(true)} className="w-full flex items-center justify-center gap-2 bg-[#8b5cf6] text-white px-4 py-2.5 rounded-lg hover:bg-[#7c3aed] text-sm font-medium">
                                    <Plus className="h-4 w-4" />
                                    Add New Address
                                </button>
                            )}

                            {(showAddressForm || editingAddress) && (
                                <form onSubmit={(e) => { e.preventDefault(); editingAddress ? handleUpdateAddress(editingAddress) : handleAddAddress(e); }} className="bg-gray-50 p-3 md:p-4 rounded-lg space-y-3">
                                    <h3 className="font-semibold text-sm">{editingAddress ? 'Edit Address' : 'New Address'}</h3>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
                                            <select value={addressForm.label} onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5cf6]">
                                                <option value="Home">Home</option>
                                                <option value="Work">Work</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                                            <input type="text" value={addressForm.fullName} onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5cf6]" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                                            <input type="tel" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5cf6]" />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                                            <textarea value={addressForm.address} onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })} required rows={2} className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5cf6]" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                                            <input type="text" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5cf6]" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Region</label>
                                            <input type="text" value={addressForm.region} onChange={(e) => setAddressForm({ ...addressForm, region: e.target.value })} required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5cf6]" />
                                        </div>
                                    </div>

                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })} className="w-4 h-4 text-[#8b5cf6] rounded" />
                                        <span>Set as default address</span>
                                    </label>

                                    <div className="flex gap-2 pt-2">
                                        <button type="submit" className="flex-1 bg-[#8b5cf6] text-white px-4 py-2 rounded-lg hover:bg-[#7c3aed] text-sm font-medium">
                                            {editingAddress ? 'Update' : 'Add'}
                                        </button>
                                        <button type="button" onClick={() => { setShowAddressForm(false); setEditingAddress(null); setAddressForm({ label: 'Home', fullName: '', phone: '', address: '', city: '', region: '', isDefault: false }); }} className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm font-medium">
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="space-y-3">
                                {addresses.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8 text-sm">No addresses saved yet.</p>
                                ) : (
                                    addresses.map((addr) => (
                                        <div key={addr._id} className={`border-2 rounded-lg p-3 ${addr.isDefault ? 'border-[#8b5cf6] bg-purple-50' : 'border-gray-200'}`}>
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-sm">{addr.label}</span>
                                                    {addr.isDefault && <span className="text-[10px] bg-[#8b5cf6] text-white px-2 py-0.5 rounded">Default</span>}
                                                </div>
                                                <div className="flex gap-1">
                                                    <button onClick={() => startEditAddress(addr)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                                                        <Edit2 className="h-3.5 w-3.5" />
                                                    </button>
                                                    <button onClick={() => handleDeleteAddress(addr._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="text-xs md:text-sm space-y-1 text-gray-700">
                                                <p className="font-medium">{addr.fullName}</p>
                                                <p>{addr.phone}</p>
                                                <p>{addr.address}</p>
                                                <p>{addr.city}, {addr.region}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div>
                            {loadingOrders ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5cf6] mx-auto"></div>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                                    <p className="text-sm text-gray-600">Your order history will appear here</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order: any) => (
                                        <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <p className="font-semibold text-sm">Order #{order._id.slice(-8)}</p>
                                                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                                'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>

                                            <div className="space-y-2 mb-3">
                                                {order.items?.slice(0, 2).map((item: any, idx: number) => (
                                                    <div key={idx} className="flex gap-3">
                                                        {item.product?.images?.[0] && (
                                                            <img src={item.product.images[0]} alt={item.title} className="w-12 h-12 object-contain bg-gray-50 rounded" />
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium line-clamp-1">{item.title || item.product?.title}</p>
                                                            <p className="text-xs text-gray-500">Qty: {item.quantity} × KSh {item.price?.toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {(order.items?.length || 0) > 2 && (
                                                    <p className="text-xs text-gray-500">+{order.items.length - 2} more items</p>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t">
                                                <p className="font-bold text-[#8b5cf6]">KSh {order.totalAmount?.toLocaleString()}</p>
                                                <button
                                                    onClick={() => viewOrderDetails(order._id)}
                                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    View Details →
                                                </button>
                                            </div>

                                            {/* Order Tracking */}
                                            {order.trackingNumber && (
                                                <div className="mt-3 pt-3 border-t">
                                                    <p className="text-xs text-gray-600">Tracking: <span className="font-mono font-semibold">{order.trackingNumber}</span></p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Order Details Modal */}
                            {selectedOrder && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedOrder(null)}>
                                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold">Order Details</h3>
                                                    <p className="text-sm text-gray-500">#{selectedOrder._id.slice(-8)}</p>
                                                </div>
                                                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                                                    <X className="h-6 w-6" />
                                                </button>
                                            </div>

                                            {/* Order Timeline */}
                                            <div className="mb-6">
                                                <h4 className="font-semibold mb-3">Order Timeline</h4>
                                                <div className="space-y-3">
                                                    {['pending', 'processing', 'shipped', 'delivered'].map((status, idx) => {
                                                        const currentIndex = ['pending', 'processing', 'shipped', 'delivered'].indexOf(selectedOrder.status);
                                                        const isCompleted = idx <= currentIndex;
                                                        const isCurrent = idx === currentIndex;

                                                        return (
                                                            <div key={status} className="flex items-center gap-3">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                                                                    }`}>
                                                                    {isCompleted && <Check className="h-4 w-4" />}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className={`font-medium text-sm capitalize ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                                                                        }`}>
                                                                        {status}
                                                                    </p>
                                                                    {isCurrent && selectedOrder.trackingNumber && status === 'shipped' && (
                                                                        <p className="text-xs text-gray-500">Tracking: {selectedOrder.trackingNumber}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            <div className="mb-6">
                                                <h4 className="font-semibold mb-3">Items</h4>
                                                <div className="space-y-3">
                                                    {selectedOrder.items?.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex gap-3 pb-3 border-b last:border-0">
                                                            {item.product?.images?.[0] && (
                                                                <img src={item.product.images[0]} alt={item.title} className="w-16 h-16 object-contain bg-gray-50 rounded" />
                                                            )}
                                                            <div className="flex-1">
                                                                <p className="font-medium text-sm">{item.title || item.product?.title}</p>
                                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                                <p className="text-sm font-semibold mt-1">KSh {(item.price * item.quantity)?.toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Shipping Address */}
                                            <div className="mb-6">
                                                <h4 className="font-semibold mb-2">Shipping Address</h4>
                                                <div className="text-sm text-gray-600">
                                                    <p>{selectedOrder.shippingAddress?.fullName}</p>
                                                    <p>{selectedOrder.shippingAddress?.address}</p>
                                                    <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.region}</p>
                                                    <p>{selectedOrder.shippingAddress?.phone}</p>
                                                </div>
                                            </div>

                                            {/* Total */}
                                            <div className="pt-4 border-t">
                                                <div className="flex items-center justify-between text-lg font-bold">
                                                    <span>Total</span>
                                                    <span className="text-[#8b5cf6]">KSh {selectedOrder.totalAmount?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Returns Tab */}
                    {activeTab === 'returns' && (
                        <div>
                            {loadingReturns ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5cf6] mx-auto"></div>
                                </div>
                            ) : returns.length === 0 ? (
                                <div className="text-center py-12">
                                    <RefreshCw className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Returns Yet</h3>
                                    <p className="text-sm text-gray-600">Your return requests will appear here</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {returns.map((returnItem: any) => (
                                        <div key={returnItem._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <p className="font-semibold text-sm">Return #{returnItem._id.slice(-8)}</p>
                                                    <p className="text-xs text-gray-500">{new Date(returnItem.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${returnItem.status === 'refunded' ? 'bg-green-100 text-green-700' :
                                                    returnItem.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                                                        returnItem.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {returnItem.status}
                                                </span>
                                            </div>

                                            <div className="mb-3">
                                                <p className="text-sm text-gray-700">
                                                    <strong>Refund Amount:</strong> KSh {returnItem.refundAmount?.toLocaleString()}
                                                </p>
                                                <p className="text-sm text-gray-700">
                                                    <strong>Items:</strong> {returnItem.items?.length} item(s)
                                                </p>
                                            </div>

                                            {returnItem.adminNotes && (
                                                <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
                                                    <strong>Admin Note:</strong> {returnItem.adminNotes}
                                                </div>
                                            )}

                                            <button
                                                onClick={() => setSelectedReturn(returnItem)}
                                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                View Details →
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Return Details Modal */}
                            {selectedReturn && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedReturn(null)}>
                                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold">Return Details</h3>
                                                    <p className="text-sm text-gray-500">#{selectedReturn._id.slice(-8)}</p>
                                                </div>
                                                <button onClick={() => setSelectedReturn(null)} className="text-gray-400 hover:text-gray-600">
                                                    <X className="h-6 w-6" />
                                                </button>
                                            </div>

                                            {/* Status */}
                                            <div className="mb-6">
                                                <h4 className="font-semibold mb-2">Status</h4>
                                                <span className={`px-4 py-2 rounded-full text-sm font-medium inline-block ${selectedReturn.status === 'refunded' ? 'bg-green-100 text-green-700' :
                                                    selectedReturn.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                                                        selectedReturn.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {selectedReturn.status.charAt(0).toUpperCase() + selectedReturn.status.slice(1)}
                                                </span>
                                            </div>

                                            {/* Return Items */}
                                            <div className="mb-6">
                                                <h4 className="font-semibold mb-3">Items</h4>
                                                <div className="space-y-3">
                                                    {selectedReturn.items?.map((item: any, idx: number) => (
                                                        <div key={idx} className="flex gap-3 pb-3 border-b last:border-0">
                                                            <div className="flex-1">
                                                                <p className="font-medium text-sm">{item.title}</p>
                                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                                <p className="text-xs text-gray-600 mt-1"><strong>Reason:</strong> {item.reason}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Refund Amount */}
                                            <div className="mb-6">
                                                <h4 className="font-semibold mb-2">Refund Amount</h4>
                                                <p className="text-2xl font-bold text-[#8b5cf6]">KSh {selectedReturn.refundAmount?.toLocaleString()}</p>
                                            </div>

                                            {/* Admin Notes */}
                                            {selectedReturn.adminNotes && (
                                                <div className="mb-6">
                                                    <h4 className="font-semibold mb-2">Admin Notes</h4>
                                                    <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded">{selectedReturn.adminNotes}</p>
                                                </div>
                                            )}

                                            {/* User Notes */}
                                            {selectedReturn.userNotes && (
                                                <div className="mb-6">
                                                    <h4 className="font-semibold mb-2">Your Notes</h4>
                                                    <p className="text-sm text-gray-700">{selectedReturn.userNotes}</p>
                                                </div>
                                            )}

                                            {/* Dates */}
                                            <div className="text-sm text-gray-600">
                                                <p><strong>Requested:</strong> {new Date(selectedReturn.requestedAt).toLocaleString()}</p>
                                                {selectedReturn.processedAt && (
                                                    <p><strong>Processed:</strong> {new Date(selectedReturn.processedAt).toLocaleString()}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Settings Tab - Mobile Optimized */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6">
                            {/* Notifications */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Bell className="h-5 w-5 text-gray-700" />
                                    <h3 className="text-base md:text-lg font-semibold">Notifications</h3>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                                        { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified about order status' },
                                        { key: 'promotions', label: 'Promotions', desc: 'Receive promotional offers' },
                                        { key: 'newsletter', label: 'Newsletter', desc: 'Subscribe to our newsletter' }
                                    ].map(item => (
                                        <label key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100">
                                            <div>
                                                <p className="font-medium text-sm">{item.label}</p>
                                                <p className="text-xs text-gray-500 hidden md:block">{item.desc}</p>
                                            </div>
                                            <input type="checkbox" checked={settings[item.key as keyof typeof settings] as boolean} onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })} className="w-5 h-5 text-[#8b5cf6] rounded" />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Privacy */}
                            <div className="border-t pt-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Shield className="h-5 w-5 text-gray-700" />
                                    <h3 className="text-base md:text-lg font-semibold">Privacy</h3>
                                </div>
                                <label className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="font-medium text-sm">Private Profile</p>
                                        <p className="text-xs text-gray-500">Hide your profile from search engines</p>
                                    </div>
                                    <input type="checkbox" checked={settings.privateProfile} onChange={(e) => setSettings({ ...settings, privateProfile: e.target.checked })} className="w-5 h-5 text-[#8b5cf6] rounded" />
                                </label>
                            </div>

                            {/* Language */}
                            <div className="border-t pt-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Globe className="h-5 w-5 text-gray-700" />
                                    <h3 className="text-base md:text-lg font-semibold">Language</h3>
                                </div>
                                <select value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })} className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5cf6]">
                                    <option value="en">English</option>
                                    <option value="sw">Swahili</option>
                                    <option value="fr">French</option>
                                </select>
                            </div>

                            {/* Save Button */}
                            <div className="border-t pt-6">
                                <button onClick={() => alert('Settings saved!')} className="w-full bg-[#8b5cf6] text-white px-6 py-3 rounded-lg hover:bg-[#7c3aed] font-medium text-sm md:text-base">
                                    Save Settings
                                </button>
                            </div>

                            {/* Danger Zone */}
                            <div className="border-t pt-6">
                                <h3 className="text-base font-semibold text-red-600 mb-3">Danger Zone</h3>
                                <button className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                                    Delete Account
                                </button>
                                <p className="text-xs text-gray-500 mt-2 text-center">This action cannot be undone</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Bottom Tab Navigation - Sticky */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
                <div className="grid grid-cols-5 gap-1 px-2 py-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors ${activeTab === tab.id
                                ? 'bg-[#8b5cf6]/10 text-[#8b5cf6]'
                                : 'text-gray-500'
                                }`}
                        >
                            <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'scale-110' : ''} transition-transform`} />
                            <span className={`text-[10px] mt-1 font-medium ${activeTab === tab.id ? 'text-[#8b5cf6]' : 'text-gray-600'}`}>
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

