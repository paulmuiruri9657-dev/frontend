export interface KnowledgeArticle {
    id: string;
    keywords: string[];
    topics: string[];
    title: string;
    content: string;
    priority: number; // 1-10, higher match priority
}

export const KNOWLEDGE_BASE: KnowledgeArticle[] = [
    // --- DELIVERY & SHIPPING ---
    {
        id: 'delivery_time',
        keywords: ['how long', 'take', 'arrive', 'when', 'wait', 'delivery', 'time', 'shipping', 'duration'],
        topics: ['delivery'],
        title: 'Delivery Timelines',
        content: "Our delivery times depend on your location:\n• Nairobi & Environs: 1-24 hours (Next Day Delivery available).\n• Major Towns (Mombasa, Kisumu, Nakuru, Eldoret): 2-3 business days.\n• Rural/Remote Areas: 3-5 business days.\n\nWe work to get your order to you as fast as possible!",
        priority: 10
    },
    {
        id: 'delivery_cost',
        keywords: ['cost', 'price', 'fee', 'charge', 'much', 'shipping', 'delivery', 'free'],
        topics: ['delivery', 'payment'],
        title: 'Delivery Fees',
        content: "Delivery fees are calculated based on your location and the size of the item. You will see the exact delivery fee at checkout before you pay. We often run 'Free Delivery' promotions for specific items or order amounts!",
        priority: 9
    },
    {
        id: 'delivery_areas',
        keywords: ['where', 'coverage', 'location', 'country', 'kenya', 'deliver', 'ship'],
        topics: ['delivery'],
        title: 'Delivery Coverage',
        content: "We deliver to all 47 counties in Kenya! Whether you're in Nairobi Central, Turkana, or Mombasa, EcoLooP will reach you. We use a network of trusted riders and courier partners.",
        priority: 8
    },

    // --- PAYMENTS ---
    {
        id: 'payment_methods',
        keywords: ['pay', 'payment', 'mpesa', 'cash', 'card', 'visa', 'mastercard', 'method', 'how to pay'],
        topics: ['payment'],
        title: 'Payment Methods',
        content: "We accept the following secure payment methods:\n• M-PESA (Integrated checkout)\n• Credit/Debit Cards (Visa & Mastercard)\n• Airtel Money\n• Cash on Delivery (Available in Nairobi only for orders under KSh 15,000).",
        priority: 10
    },
    {
        id: 'payment_safety',
        keywords: ['safe', 'secure', 'scam', 'trust', 'security', 'steal'],
        topics: ['payment', 'safety'],
        title: 'Payment Security',
        content: "Your security is our top priority. We use SSL encryption for all transactions. Payments are processed by licensed gateways. We do NOT store your full card details or M-Pesa PIN. You are safe with EcoLooP.",
        priority: 9
    },

    // --- RETURNS & REFUNDS ---
    {
        id: 'return_policy',
        keywords: ['return', 'refund', 'back', 'broken', 'wrong', 'fake', 'policy', 'exchange'],
        topics: ['returns'],
        title: 'Return Policy',
        content: "We have a 7-Day Free Return Policy. If you receive an item that is:\n• Wrong item\n• Damaged/Broken\n• Defective\n• Counterfeit\n\nYou can return it for FREE within 7 days. The item must be unused and in its original packaging with all seals intact.",
        priority: 10
    },
    {
        id: 'return_process',
        keywords: ['how to return', 'start return', 'process'],
        topics: ['returns'],
        title: 'How to Return',
        content: "To initiate a return:\n1. Go to 'My Account' > 'Orders'.\n2. Select the order and click 'Return Item'.\n3. Fill in the reason and select your preferred refund method.\n4. Drop off the item at our nearest station or wait for pick-up.",
        priority: 9
    },

    // --- SELLING ON ECOLOOP ---
    {
        id: 'how_to_sell',
        keywords: ['sell', 'seller', 'vendor', 'shop', 'store', 'business', 'registration', 'register'],
        topics: ['selling'],
        title: 'Become a Seller',
        content: "Selling on EcoLooP is easy!\n1. Create an account or Log in.\n2. Click 'Sell on EcoLooP' in the top header.\n3. Register your shop details.\n4. Start listing your products!\n\nWe charge a small commission only when you sell.",
        priority: 10
    },
    {
        id: 'seller_fees',
        keywords: ['commission', 'fee', 'charge', 'cost', 'selling fee', 'deduct'],
        topics: ['selling'],
        title: 'Seller Fees',
        content: "Openin a shop is FREE! We only charge a commission fee of 5-10% (depending on the category) when you successfully make a sale. There are no monthly subscription fees.",
        priority: 9
    },

    // --- ACCOUNT ---
    {
        id: 'reset_password',
        keywords: ['password', 'reset', 'forgot', 'login', 'cant login', 'change password'],
        topics: ['account'],
        title: 'Reset Password',
        content: "If you forgot your password, go to the Login page and click 'Forgot Password'. Enter your email address, and we will send you a link to reset it.",
        priority: 9
    },
    {
        id: 'delete_account',
        keywords: ['delete', 'remove', 'close', 'account', 'profile'],
        topics: ['account'],
        title: 'Delete Account',
        content: "We're sad to see you go. To delete your account, please contact our support team directly at support@ecoloop.co.ke. Note that this action is irreversible.",
        priority: 7
    },

    // --- GENERAL ---
    {
        id: 'about_ecoloop',
        keywords: ['what is', 'who are', 'about', 'company', 'ecoloop', 'owner', 'location'],
        topics: ['general'],
        title: 'About EcoLooP',
        content: "EcoLooP Ke is Kenya's premier e-commerce platform connecting buyers and sellers. We focus on speed, trust, and variety. We are a Kenyan company built for Kenyans.",
        priority: 8
    },
    {
        id: 'contact_support',
        keywords: ['contact', 'support', 'customer care', 'phone', 'email', 'call', 'help', 'agent', 'human'],
        topics: ['general'],
        title: 'Contact Support',
        content: "You can reach our customer support team via:\n• Phone/WhatsApp: 0705424364\n• Email: ecoloopke@gmail.com\n• Live Chat: Right here!\n\nWe are available Mon-Sat 8am-6pm.",
        priority: 10
    }
];

// Fallback responses for unknown queries
export const FALLBACK_RESPONSES = [
    "I'm not quite sure I understand. Could you rephrase that? I can help with delivery, returns, payments, and selling.",
    "I'm still learning! Could you try asking about shipping, payments, or how to sell?",
    "That's a bit outside my knowledge base right now. Would you like to contact a human agent? Call us at 0705424364.",
    "I didn't catch that. Try asking something like 'How do I pay?' or 'When will my order arrive?'"
];
