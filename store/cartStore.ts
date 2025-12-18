import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import { Cart, CartItem, Product } from '@/types';
import toast from 'react-hot-toast';

interface CartStore {
    cart: Cart | null;
    loading: boolean;

    // Actions
    fetchCart: () => Promise<void>;
    addToCart: (productId: string, quantity?: number) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            cart: null,
            loading: false,

            fetchCart: async () => {
                try {
                    set({ loading: true });
                    const response = await api.getCart();
                    set({ cart: response.data, loading: false });
                } catch (error) {
                    console.error('Error fetching cart:', error);
                    set({ loading: false });
                }
            },

            addToCart: async (productId: string, quantity = 1) => {
                try {
                    const response = await api.addToCart(productId, quantity);
                    set({ cart: response.data });

                    // Show success toast
                    toast.success('Added to cart!', {
                        duration: 2000,
                        position: 'top-right',
                        icon: '🛒',
                        style: {
                            background: '#8b5cf6',
                            color: '#fff',
                            fontWeight: '600',
                        },
                    });
                } catch (error: any) {
                    console.error('Error adding to cart:', error);
                    toast.error(error.message || 'Failed to add to cart', {
                        duration: 3000,
                        position: 'top-right',
                    });
                }
            },

            updateQuantity: async (productId: string, quantity: number) => {
                try {
                    const response = await api.updateCartItem(productId, quantity);
                    set({ cart: response.data });

                    toast.success('Cart updated!', {
                        duration: 1500,
                        position: 'top-right',
                        icon: '✓',
                    });
                } catch (error) {
                    console.error('Error updating cart:', error);
                    toast.error('Failed to update cart');
                }
            },

            removeFromCart: async (productId: string) => {
                try {
                    const response = await api.removeFromCart(productId);
                    set({ cart: response.data });

                    toast.success('Removed from cart', {
                        duration: 2000,
                        position: 'top-right',
                        icon: '🗑️',
                    });

                    // Auto-refresh if cart is empty
                    if (!response.data || response.data.items.length === 0) {
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 1500);
                    }
                } catch (error) {
                    console.error('Error removing from cart:', error);
                    toast.error('Failed to remove item');
                }
            },

            clearCart: async () => {
                try {
                    await api.clearCart();
                    set({ cart: null });

                    toast.success('Cart cleared', {
                        duration: 2000,
                        position: 'top-right',
                    });

                    // Redirect to home
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                } catch (error) {
                    console.error('Error clearing cart:', error);
                    toast.error('Failed to clear cart');
                }
            },
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({ cart: state.cart }),
        }
    )
);
