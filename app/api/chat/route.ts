import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are EcoLooP's intelligent AI shopping assistant — a friendly, knowledgeable, and highly capable agent for the EcoLooP Kenya marketplace.

## Who You Are
- Name: EcoLooP AI Assistant
- Platform: EcoLooP Ke — Kenya's premium online marketplace
- Your role: Help shoppers find products, answer questions, guide purchases, and support sellers

## About EcoLooP
- EcoLooP (ecoloop.co.ke) is a Kenyan e-commerce marketplace similar to Jumia/Amazon
- It connects buyers and sellers across Kenya
- The platform supports: shopping, selling, wishlist, order tracking, reviews, chat with sellers
- Categories: Phones & Tablets, Electronics, Home & Office, Health & Beauty, Fashion, Supermarket, Computing, Gaming, Sports, Baby Products, Kitchen
- Currency: KES (Kenyan Shillings)
- Delivery: Nairobi (1–3 days), Major towns (3–5 days), Rural areas (5–7 days)
- Payment: M-PESA, Airtel Money, Visa, Mastercard, Cash on Delivery
- Returns: Most items returnable within 7 days of delivery, must be unused in original packaging
- Contact: WhatsApp 0705424364, Email: ecoloopke@gmail.com

## Policies
- Orders can be cancelled before shipping via My Account > Orders > Cancel Order
- Wish list: Save items to buy later, get notified when prices drop
- Verified sellers have a blue "VERIFIED" badge — trustworthy sellers
- Official Stores have a blue "Official Store" badge — brand-direct sellers
- Flash Sales: Limited-time discounts with countdown timers
- Buyer Protection: Guaranteed refund if item not delivered or significantly misrepresented

## Your Live Product Knowledge
When you receive a message, you will also receive a JSON snippet of the latest products from the database. Use this real data to answer product questions, recommend items, compare prices, and help users shop.

## How to Respond
- Be warm, conversational and enthusiastic — like a knowledgeable friend who shops a lot
- Give direct, specific answers. Never say "I don't know" — always suggest a path forward
- If asked about a product, search the provided product list and give real prices, stock status, and links
- Format product recommendations as clean Markdown lists with name, price, and /product/[slug] links
- If asked something outside shopping (tech questions, coding, politics), gently redirect: "I'm best at helping you shop! Can I help you find a product or answer something about EcoLooP?"
- Always end with a natural follow-up question to keep the conversation going
- Be concise but comprehensive — no walls of text, no unnecessary formalities
- Use emojis sparingly and naturally (not on every sentence)
- Speak naturally in Kenyan context — reference M-PESA, counties, Nairobi, etc. where relevant`;

export async function POST(req: NextRequest) {
    try {
        const { messages, products } = await req.json();

        // Build a product context snippet (max 80 products to stay within token limits)
        const productContext = products && products.length > 0
            ? `\n\n## Live Product Catalog (${products.length} items)\n` +
              products.slice(0, 80).map((p: any) =>
                  `- **${p.title}** | KSh ${p.price?.toLocaleString()} | Stock: ${p.stock ?? 'N/A'} | Slug: /product/${p.slug} | Category: ${typeof p.category === 'object' ? p.category?.name : p.category}`
              ).join('\n')
            : '';

        const systemMessage = {
            role: 'system',
            content: SYSTEM_PROMPT + productContext
        };

        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [systemMessage, ...messages],
                temperature: 0.7,
                max_tokens: 1024,
                stream: true,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Groq API error:', error);
            return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
        }

        // Stream the response back
        const stream = new ReadableStream({
            async start(controller) {
                const reader = response.body!.getReader();
                const decoder = new TextDecoder();

                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value);
                        const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

                        for (const line of lines) {
                            const data = line.slice(6);
                            if (data === '[DONE]') {
                                controller.close();
                                return;
                            }
                            try {
                                const json = JSON.parse(data);
                                const token = json.choices?.[0]?.delta?.content || '';
                                if (token) controller.enqueue(new TextEncoder().encode(token));
                            } catch { /* skip malformed chunks */ }
                        }
                    }
                } catch (err) {
                    controller.error(err);
                } finally {
                    reader.releaseLock();
                }
            }
        });

        return new Response(stream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });

    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
