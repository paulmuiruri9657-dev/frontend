# NOTIFICATION TAB CODE TO ADD

Add this function inside the AdminDashboard component (around line 110, after handleOrderStatusUpdate):

```typescript
const handleSendBroadcast = async () => {
    if (!broadcastSubject || !broadcastMessage) {
        alert('Please fill in both subject and message');
        return;
    }

    setSending(true);
    try {
        const response = await api.broadcastEmail({
            subject: broadcastSubject,
            message: broadcastMessage,
            target: broadcastTarget
        });
        
        setBroadcastResults(response.results);
        alert(`Broadcast sent! ${response.results.sent} emails sent successfully.`);
        
        // Reset form
        setBroadcastSubject('');
        setBroadcastMessage('');
    } catch (error: any) {
        alert(error.message || 'Failed to send broadcast');
    } finally {
        setSending(false);
    }
};
```

Add this UI section AFTER the Orders Tab (after line 438, before the closing </div>):

```typescript
{/* Notifications Tab */}
{activeTab === 'notifications' && (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h2 className="text-xl font-bold mb-4">📢 Broadcast Notifications</h2>
        <p className="text-sm text-gray-600 mb-6">Send email notifications to all users, sellers, or everyone</p>

        <div className="space-y-4 max-w-2xl">
            {/* Target Selection */}
            <div>
                <label className="block text-sm font-medium mb-2">Send To</label>
                <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg"
                >
                    <option value="all">Everyone (Users + Sellers)</option>
                    <option value="sellers">Sellers Only</option>
                    <option value="users">Users Only</option>
                </select>
            </div>

            {/* Subject */}
            <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                    type="text"
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                    placeholder="e.g., Flash Sale Alert!"
                    className="w-full px-3 py-2 border rounded-lg"
                />
            </div>

            {/* Message */}
            <div>
                <label className="block text-sm font-medium mb-2">Message (HTML supported)</label>
                <textarea
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Write your message here... You can use HTML tags like <strong>, <p>, <br>, etc."
                    rows={8}
                    className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Tip: Use HTML for formatting, e.g., &lt;p&gt;Hello!&lt;/p&gt;</p>
            </div>

            {/* Send Button */}
            <button
                onClick={handleSendBroadcast}
                disabled={sending}
                className="flex items-center gap-2 bg-[#8b5cf6] text-white px-6 py-3 rounded-lg hover:bg-[#7c3aed] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Send className="h-5 w-5" />
                {sending ? 'Sending...' : 'Send Broadcast'}
            </button>

            {/* Results */}
            {broadcastResults && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">✅ Broadcast Sent!</h3>
                    <div className="text-sm text-green-800 space-y-1">
                        <p>✅ Sent: {broadcastResults.sent}</p>
                        <p>❌ Failed: {broadcastResults.failed}</p>
                        <p>📊 Total: {broadcastResults.total}</p>
                    </div>
                </div>
            )}
        </div>
    </div>
)}
```
