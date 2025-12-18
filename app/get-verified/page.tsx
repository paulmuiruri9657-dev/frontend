'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Check, AlertCircle, Shield, Building, User, FileText, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

import AuthModal from '@/components/AuthModal';

export default function GetVerifiedPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [pageLoading, setPageLoading] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);

    React.useEffect(() => {
        if (!authLoading) {
            if (!user) {
                // Do nothing, show login UI
                setPageLoading(false);
            } else if (user.role !== 'seller') {
                toast.error('You must be a registered seller to request verification');
                router.push('/sell');
            } else {
                setPageLoading(false);
            }
        }
    }, [user, authLoading, router]);

    const [logo, setLogo] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>('');
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        businessName: '',
        businessType: 'individual',
        idNumber: '', // Business ID or National ID
        description: ''
    });

    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (authLoading || pageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5cf6]"></div>
            </div>
        );
    }

    // If user is not logged in
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                        <User className="h-10 w-10 text-[#8b5cf6]" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Login Required</h1>
                    <p className="text-gray-600">
                        Please sign in or create an account to apply for seller verification.
                    </p>
                    <button
                        onClick={() => setShowAuthModal(true)}
                        className="w-full bg-[#8b5cf6] text-white py-3 rounded-xl font-bold shadow-lg hover:bg-[#7c3aed] transition-colors"
                    >
                        Sign In / Register
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full text-gray-500 font-medium hover:text-gray-700 transition-colors"
                    >
                        Return to Home
                    </button>

                    <AuthModal
                        isOpen={showAuthModal}
                        onClose={() => setShowAuthModal(false)}
                    />
                </div>
            </div>
        );
    }

    // If user is already pending
    if (user?.verificationStatus === 'pending') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                        <Shield className="h-10 w-10 text-yellow-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Application Pending</h1>
                    <p className="text-gray-600">
                        We have received your verification request. Our team is currently reviewing your details.
                        You will be notified once the review is complete.
                    </p>
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-sm text-yellow-800">
                        Status: <span className="font-bold uppercase tracking-wide">Waiting for Admin Approval</span>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // If user is already approved
    if (user?.verificationStatus === 'approved') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                        <Check className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">You are Verified!</h1>
                    <p className="text-gray-600">
                        Your account is fully verified. You have the verified badge on your profile and products.
                    </p>
                    <button
                        onClick={() => router.push('/sell')}
                        className="w-full bg-[#8b5cf6] text-white py-3 rounded-xl font-bold shadow-lg hover:bg-[#7c3aed] transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogo(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async (): Promise<string | null> => {
        if (!logo) return user?.avatar || null;

        setUploading(true);
        try {
            // Use Backend Proxy Upload to bypass CORS
            const response = await api.uploadFileProxy(logo);

            if (response.success && response.data) {
                return response.data.uploadUrl;
            } else {
                throw new Error(response.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Failed to upload profile picture');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!logo && !user?.avatar) {
            toast.error('Please upload a profile picture or business logo');
            return;
        }

        setSubmitting(true);

        try {
            // 1. Upload Header/Profile Image if new one selected
            let avatarUrl = user?.avatar;
            if (logo) {
                const uploadedUrl = await handleUpload();
                if (!uploadedUrl) {
                    setSubmitting(false);
                    return;
                }
                avatarUrl = uploadedUrl;

                // Update user profile immediately with new avatar? 
                // Requirement said "compalsary profile picture that will be uplaoded to s3 and will be updated as their new profile picture"
                // So yes, we should update the user's avatar too.
                await api.updateProfile({ avatar: avatarUrl });
            }

            // 2. Submit Verification Request
            await api.submitVerification(formData);

            toast.success('Application submitted successfully!');
            router.refresh(); // Refresh to catch status update

            // Force re-fetch user or update local state manually?
            // Ideally auth context should update, but we can verify status on page load
            window.location.reload();

        } catch (error: any) {
            console.error('Verification submisison error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Become a Verified Seller
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Gain trust, unlock badges, and boost your sales with a verified account.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header Banner */}
                    <div className="h-2 bg-gradient-to-r from-[#8b5cf6] to-[#ec4899]" />

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Section 1: Identity */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                                <User className="h-6 w-6 text-[#8b5cf6]" />
                                Professional Identity
                            </h2>

                            <div className="grid md:grid-cols-[200px_1fr] gap-8 items-start">
                                {/* Profile Picture Upload */}
                                <div className="space-y-3 text-center">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-40 h-40 mx-auto rounded-full border-4 border-dashed border-gray-300 hover:border-[#8b5cf6] flex flex-col items-center justify-center cursor-pointer transition-colors bg-gray-50 overflow-hidden relative group"
                                    >
                                        {logoPreview || user?.avatar ? (
                                            <>
                                                <img
                                                    src={logoPreview || user?.avatar}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Upload className="h-8 w-8 text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                                <span className="text-sm text-gray-500 font-medium">Upload Photo</span>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <p className="text-xs text-gray-500">Required. Professional photo or logo.</p>
                                </div>

                                {/* Basic Fields */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Business / Display Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.businessName}
                                            onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] outline-none transition-all"
                                            placeholder="e.g. EcoLooP Official Store"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Account Type</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, businessType: 'individual' })}
                                                className={`p-4 border rounded-lg text-left transition-all ${formData.businessType === 'individual'
                                                    ? 'border-[#8b5cf6] bg-purple-50 ring-1 ring-[#8b5cf6]'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="font-bold text-gray-900 mb-1">Individual</div>
                                                <div className="text-xs text-gray-500">For personal sellers</div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, businessType: 'company' })}
                                                className={`p-4 border rounded-lg text-left transition-all ${formData.businessType === 'company'
                                                    ? 'border-[#8b5cf6] bg-purple-50 ring-1 ring-[#8b5cf6]'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="font-bold text-gray-900 mb-1">Registered Business</div>
                                                <div className="text-xs text-gray-500">For companies</div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100" />

                        {/* Section 2: Verification Details */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                                <FileText className="h-6 w-6 text-[#8b5cf6]" />
                                Verification Details
                            </h2>

                            <div className="grid gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        {formData.businessType === 'company' ? 'Business Registration Number' : 'National ID / Passport Number'}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.idNumber}
                                        onChange={e => setFormData({ ...formData, idNumber: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] outline-none transition-all font-mono"
                                        placeholder="XXXX-XXXX-XXXX"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">About Your Business</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] outline-none transition-all h-32 resize-none"
                                        placeholder="Tell us about what you sell, your history, and why you should be verified..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Actions */}
                        <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || uploading}
                                className="px-8 py-3 bg-[#8b5cf6] text-white font-bold rounded-lg shadow-lg hover:bg-[#7c3aed] focus:ring-4 focus:ring-purple-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {submitting || uploading ? (
                                    <>
                                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        Submit Application <ChevronRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-sm text-gray-500">
                    <div className="flex flex-col items-center">
                        <Shield className="h-8 w-8 text-gray-400 mb-2" />
                        <p>Verified Badge Everywhere</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <User className="h-8 w-8 text-gray-400 mb-2" />
                        <p>Increased Trust & Sales</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Building className="h-8 w-8 text-gray-400 mb-2" />
                        <p>Priority Support</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
