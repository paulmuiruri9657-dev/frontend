'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Check, X, Eye, Calendar, User, Building, FileText, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface VerificationRequest {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    verificationStatus: 'pending' | 'approved' | 'rejected';
    verificationData: {
        businessName: string;
        businessType: string;
        idNumber: string;
        description: string;
        submittedAt: string;
    };
}

export default function AdminVerificationDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const [requests, setRequests] = useState<VerificationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);

    useEffect(() => {
        if (user && user.role !== 'admin') {
            router.push('/');
            return;
        }
        fetchRequests();
    }, [user, router]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await api.getPendingVerifications();
            setRequests(response.data || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
            toast.error('Failed to load verification requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (req: VerificationRequest) => {
        if (!confirm(`Are you sure you want to approve ${req.verificationData.businessName}?`)) return;

        setProcessingId(req._id);
        try {
            await api.updateVerificationStatus(req._id, 'approved');
            toast.success(`${req.firstName}'s application approved!`);
            setRequests(prev => prev.filter(r => r._id !== req._id));
            if (selectedRequest?._id === req._id) setSelectedRequest(null);
        } catch (error) {
            console.error('Approval failed:', error);
            toast.error('Failed to approve request');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async () => {
        if (!selectedRequest || !rejectReason.trim()) return;

        setProcessingId(selectedRequest._id);
        try {
            await api.updateVerificationStatus(selectedRequest._id, 'rejected', rejectReason);
            toast.success('Application rejected.');
            setRequests(prev => prev.filter(r => r._id !== selectedRequest._id));
            setShowRejectModal(false);
            setSelectedRequest(null);
            setRejectReason('');
        } catch (error) {
            console.error('Rejection failed:', error);
            toast.error('Failed to reject request');
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b5cf6]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Shield className="h-8 w-8 text-[#8b5cf6]" />
                            Verification Requests
                        </h1>
                        <p className="text-gray-600 mt-1">Review and manage seller applications</p>
                    </div>
                    <button
                        onClick={fetchRequests}
                        className="flex items-center gap-2 text-[#8b5cf6] hover:bg-purple-50 px-4 py-2 rounded-lg transition-colors"
                    >
                        <RefreshCw className="h-4 w-4" /> Refresh
                    </button>
                </div>

                {requests.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">All Caught Up!</h3>
                        <p className="text-gray-500">There are no pending verification requests at the moment.</p>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-[1fr_400px] gap-6">
                        {/* List Column */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Applicant</th>
                                            <th className="px-6 py-4">Business</th>
                                            <th className="px-6 py-4">Submitted</th>
                                            <th className="px-6 py-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {requests.map((req) => (
                                            <tr
                                                key={req._id}
                                                className={`hover:bg-purple-50 cursor-pointer transition-colors ${selectedRequest?._id === req._id ? 'bg-purple-50' : ''}`}
                                                onClick={() => setSelectedRequest(req)}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                                            {req.avatar ? (
                                                                <img src={req.avatar} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <User className="w-full h-full p-2 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900">{req.firstName} {req.lastName}</div>
                                                            <div className="text-xs text-gray-500">{req.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{req.verificationData.businessName}</div>
                                                    <div className="text-xs text-gray-500 capitalize">{req.verificationData.businessType}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(req.verificationData.submittedAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button className="text-[#8b5cf6] hover:underline text-sm font-medium">Review</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Details Panel - Sticky */}
                        <div className="lg:sticky lg:top-24 h-fit">
                            {selectedRequest ? (
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="bg-[#8b5cf6] p-6 text-white text-center">
                                        <div className="w-24 h-24 rounded-full border-4 border-white mx-auto mb-3 overflow-hidden bg-white shadow-md">
                                            {selectedRequest.avatar ? (
                                                <img src={selectedRequest.avatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-full h-full p-4 text-gray-300" />
                                            )}
                                        </div>
                                        <h2 className="text-xl font-bold">{selectedRequest.verificationData.businessName}</h2>
                                        <p className="opacity-90">{selectedRequest.firstName} {selectedRequest.lastName}</p>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        <div>
                                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Business Details</h3>
                                            <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                                                <div className="flex justify-between border-b pb-2">
                                                    <span className="text-gray-500">Type</span>
                                                    <span className="font-medium capitalize">{selectedRequest.verificationData.businessType}</span>
                                                </div>
                                                <div className="flex justify-between border-b pb-2">
                                                    <span className="text-gray-500">ID Number</span>
                                                    <span className="font-mono font-medium">{selectedRequest.verificationData.idNumber}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Submitted</span>
                                                    <span className="font-medium">{new Date(selectedRequest.verificationData.submittedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
                                            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 italic border border-gray-100">
                                                "{selectedRequest.verificationData.description}"
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 pt-2">
                                            <button
                                                onClick={() => { setRejectReason(''); setShowRejectModal(true); }}
                                                disabled={processingId === selectedRequest._id}
                                                className="flex flex-col items-center justify-center p-3 rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                            >
                                                <X className="h-6 w-6 mb-1" />
                                                <span className="font-bold text-sm">Reject</span>
                                            </button>
                                            <button
                                                onClick={() => handleApprove(selectedRequest)}
                                                disabled={processingId === selectedRequest._id}
                                                className="flex flex-col items-center justify-center p-3 rounded-lg border border-green-100 bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                            >
                                                {processingId === selectedRequest._id ? (
                                                    <div className="animate-spin h-6 w-6 border-2 border-green-600 border-t-transparent rounded-full mb-1" />
                                                ) : (
                                                    <Check className="h-6 w-6 mb-1" />
                                                )}
                                                <span className="font-bold text-sm">Approve</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500 h-64 flex flex-col items-center justify-center">
                                    <Eye className="h-10 w-10 mb-3 opacity-20" />
                                    <p>Select a request <br /> to view details</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Reject Application</h3>
                            <p className="text-sm text-gray-500">Please provide a reason for rejection.</p>
                        </div>

                        <textarea
                            value={rejectReason}
                            onChange={e => setRejectReason(e.target.value)}
                            className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none mb-4 h-24 resize-none"
                            placeholder="Reason for rejection (e.g. Invalid ID)..."
                            autoFocus
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="flex-1 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={!rejectReason.trim() || !!processingId}
                                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
