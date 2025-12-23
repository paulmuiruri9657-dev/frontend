import { api } from './api';

interface ErrorLogData {
    message: string;
    stack?: string;
    context?: any;
    deviceInfo?: {
        userAgent: string;
        platform: string;
        language: string;
    };
    url?: string;
}

class ErrorLogger {
    private static instance: ErrorLogger;

    private constructor() {
        if (typeof window !== 'undefined') {
            this.initGlobalHandlers();
        }
    }

    public static getInstance(): ErrorLogger {
        if (!ErrorLogger.instance) {
            ErrorLogger.instance = new ErrorLogger();
        }
        return ErrorLogger.instance;
    }

    // Capture window errors and unhandled rejections
    private initGlobalHandlers() {
        window.addEventListener('error', (event) => {
            this.log({
                message: event.message,
                stack: event.error?.stack,
                context: { source: 'window.onerror' }
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.log({
                message: `Unhandled Rejection: ${event.reason}`,
                stack: event.reason?.stack,
                context: { source: 'window.unhandledrejection' }
            });
        });
    }

    public async log(data: ErrorLogData) {
        // Prevent infinite loops if logging itself fails
        try {
            const payload = {
                ...data,
                deviceInfo: {
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    language: navigator.language
                },
                url: window.location.href
            };

            // Use fetch directly or valid API method to avoid circular dependency if API uses this logger
            // Using standard fetch to keep it isolated
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/errors/log`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

        } catch (err) {
            console.error('Failed to report error to backend:', err);
        }
    }
}

export const errorLogger = ErrorLogger.getInstance();
