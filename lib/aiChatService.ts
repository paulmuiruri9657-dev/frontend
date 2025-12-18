import { KNOWLEDGE_BASE, KnowledgeArticle, FALLBACK_RESPONSES } from './knowledgeBase';
import { Product } from '../types';

interface AIResponse {
    text: string;
    relatedTopics?: string[];
    products?: Product[];
}

const GREETING_PATTERNS = ['hello', 'hi', 'hey', 'morning', 'evening', 'greetings', 'niaje'];
const GREETING_TEMPLATES = [
    "Hello! Ready to find some great deals today? 🛍️",
    "Hi there! What can I help you shop for on EcoLooP?",
    "Welcome! I'm here to help you buy or sell. What's on your mind?",
    "Greetings! 👋 How can I assist you with your orders today?"
];

const SEARCH_PATTERNS = ['find', 'search', 'looking for', 'buy', 'get', 'price of', 'have', 'selling', 'show me'];
const SEARCH_FOUND_TEMPLATES = [
    "I found {count} items that match your search. Here are the top ones:",
    "Check these out! I found {count} listings for you:",
    "Good news! We have {count} items available. Take a look:",
    "Here is what I found. Prices start at KSh {minPrice}."
];

const SEARCH_EMPTY_TEMPLATES = [
    "I couldn't find any exact matches for that right now. Maybe try a broader term?",
    "It looks like we don't have that in stock at the moment. Check back soon!",
    "No luck finding that specific item today. Try searching for something else like 'Electronics' or 'Shoes'."
];

export class AIChatService {

    private normalizeText(text: string | undefined | null): string[] {
        if (!text) return [];
        return text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 1);
    }

    private getRandomTemplate(templates: string[]): string {
        return templates[Math.floor(Math.random() * templates.length)];
    }

    private extractSearchTerm(message: string): string | null {
        const lowerMsg = message.toLowerCase();
        for (const pattern of SEARCH_PATTERNS) {
            if (lowerMsg.includes(pattern)) {
                // simple extraction: take everything after the pattern
                const parts = lowerMsg.split(pattern);
                if (parts.length > 1 && parts[1].trim().length > 2) {
                    return parts[1].trim();
                }
            }
        }
        // Heuristic: if message is short (e.g. "iPhone 15"), treat as search
        if (message.split(' ').length < 4) return message;
        return null;
    }

    public async processUserMessage(message: string, products: Product[] = []): Promise<AIResponse> {
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));

        const normalizedMsg = message.toLowerCase();
        const queryTokens = this.normalizeText(message);

        // 0. Greeting Check
        if (queryTokens.some(t => GREETING_PATTERNS.includes(t)) && queryTokens.length < 5) {
            return { text: this.getRandomTemplate(GREETING_TEMPLATES) };
        }

        // 1. Safety Filter
        const forbiddenTerms = ['backend', 'database', 'mongo', 'react', 'code', 'stack', 'developer', 'made this'];
        if (forbiddenTerms.some(term => normalizedMsg.includes(term))) {
            return {
                text: "I'm here to help you with shopping and selling on EcoLooP. I can't discuss technical details or my internal configuration."
            };
        }

        // 2. Product Search Intent
        const searchTerm = this.extractSearchTerm(message);
        const isSearchIntent = SEARCH_PATTERNS.some(p => normalizedMsg.includes(p)) || (products.length > 0 && queryTokens.length < 4);

        if (isSearchIntent && searchTerm && products.length > 0) {
            // Perform basic search
            const searchTokens = this.normalizeText(searchTerm);
            const matches = products.filter(p => {
                const titleTokens = this.normalizeText(p.title);
                const categoryTokens = this.normalizeText(typeof p.category === 'string' ? p.category : p.category.name);
                // Check if any search token matches title or category
                return searchTokens.some(st => titleTokens.includes(st) || categoryTokens.includes(st));
            }).slice(0, 3); // Limit to 3 results

            if (matches.length > 0) {
                const minPrice = Math.min(...matches.map(p => p.price));
                const template = this.getRandomTemplate(SEARCH_FOUND_TEMPLATES)
                    .replace('{count}', matches.length.toString())
                    .replace('{query}', searchTerm)
                    .replace('{minPrice}', minPrice.toLocaleString());

                return {
                    text: template,
                    products: matches
                };
            }
            // If explicit search but no results, fall through to KB or return empty template
            if (SEARCH_PATTERNS.some(p => normalizedMsg.includes(p))) {
                return { text: this.getRandomTemplate(SEARCH_EMPTY_TEMPLATES).replace('{query}', searchTerm) };
            }
        }

        // 3. Knowledge Base Match
        let bestMatch: KnowledgeArticle | null = null;
        let highestScore = 0;

        KNOWLEDGE_BASE.forEach(article => {
            let score = 0;
            queryTokens.forEach(token => {
                if (article.keywords.includes(token)) score += 2;
                if (this.normalizeText(article.title).includes(token)) score += 3;
            });
            score += (article.priority * 0.5);

            if (score > highestScore) {
                highestScore = score;
                bestMatch = article;
            }
        });

        if (bestMatch && highestScore >= 3) {
            // Randomize logic could be added here too for variety if multiple answers exist
            return {
                text: (bestMatch as KnowledgeArticle).content,
                relatedTopics: (bestMatch as KnowledgeArticle).topics
            };
        }

        // 4. Fallback
        const randomFallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
        return { text: randomFallback };
    }
}

export const aiChatService = new AIChatService();
