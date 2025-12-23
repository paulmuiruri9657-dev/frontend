'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, HelpCircle, ChevronDown, X, Menu, Heart, Package, LogOut, Eye, EyeOff, MessageCircle, Smartphone, Laptop, Shirt, ShoppingBasket, Gamepad as GamepadIcon, Dumbbell, Baby, Utensils, Monitor, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useCartStore } from '@/store/cartStore';
import LiveSearch from './LiveSearch';
import { useSocket } from '@/contexts/SocketContext';

import AuthModal from './AuthModal';
import PWAInstall from './PWAInstall';
import { ThemeToggle } from './ThemeToggle';

const Header = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { unreadCount } = useSocket();
  const { cart, fetchCart } = useCartStore();

  const cartCount = cart?.items?.length || 0;
  const [wishlistCount, setWishlistCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [showConversations, setShowConversations] = useState(false);


  const [canInstall, setCanInstall] = useState(true);

  useEffect(() => {
    // Only hide if running in standalone mode (PWA)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setCanInstall(false);
    }
  }, []);

  // Auth modal state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Handle logout
  const handleLogout = async () => {
    await logout();
  };

  // Fetch cart
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Fetch wishlist count
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setWishlistCount(0);
        return;
      }
      try {
        const response = await api.getWishlist();
        setWishlistCount(response.data?.count || 0);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };
    fetchWishlist();
  }, [user]);

  // Scroll detection for adaptive header
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dropdown state
  const [activeDropdown, setActiveDropdown] = useState<'account' | 'help' | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: 'account' | 'help') => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <div className={`flex flex-col w-full sticky top-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? '' : ''}`}>
      {/* Top Banner - Fully Transparent on Scroll */}
      <div className={`w-full transition-all duration-500 ease-in-out ${isScrolled
        ? 'bg-transparent border-b border-transparent'
        : 'bg-[#8b5cf6]'
        }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-1">
          {/* Left: Sell */}
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/sell"
              className={`text-xs font-bold hover:underline transition-colors duration-300 ${isScrolled ? 'text-[#8b5cf6] font-extrabold drop-shadow-sm' : 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]'
                }`}
            >
              Sell on EcoLooP
            </Link>
            {canInstall && (
              <button
                onClick={() => (window as any).installEcoloopApp && (window as any).installEcoloopApp()}
                className={`text-xs font-bold hover:underline transition-colors duration-300 flex items-center gap-1 ${isScrolled ? 'text-[#8b5cf6] font-extrabold drop-shadow-sm' : 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]'
                  }`}
              >
                <Smartphone className="h-3 w-3" />
                Install App
              </button>
            )}
          </div>

          {/* Center: Welcome Message */}
          <div className="flex-1 flex justify-center pl-4 md:pl-0">
            <span className={`text-xs font-bold transition-colors duration-300 ${isScrolled ? 'text-[#8b5cf6] font-extrabold drop-shadow-sm' : 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]'
              }`}>
              {user ? `Welcome, ${user.firstName}!` : 'Welcome to EcoLooP'}
            </span>
          </div>

          {/* Right: Get Verified */}
          <div className="flex items-center">
            <Link
              href="/get-verified"
              className={`text-xs font-bold transition-colors duration-300 ${isScrolled ? 'text-[#8b5cf6] font-extrabold drop-shadow-sm' : 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]'
                }`}
            >
              Get Verified
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header - Fully Transparent on Scroll */}
      <header className={`stunning-header transition-all duration-500 ease-in-out ${isScrolled
        ? 'bg-transparent py-2 border-b border-transparent'
        : 'bg-white shadow-sm py-3'
        }`}>
        {/* Floating Orbs */}
        <div className="header-orb header-orb-1"></div>
        <div className="header-orb header-orb-2"></div>
        <div className="header-orb header-orb-3"></div>

        {/* Energy Particles */}
        <div className="energy-particle"></div>
        <div className="energy-particle"></div>
        <div className="energy-particle"></div>
        <div className="energy-particle"></div>
        <div className="energy-particle"></div>
        <div className="energy-particle"></div>
        <div className="energy-particle"></div>
        <div className="energy-particle"></div>

        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4 md:gap-6 header-content" ref={dropdownRef}>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled ? 'hover:bg-purple-50 text-[#8b5cf6]' : 'hover:bg-white/10 text-gray-700'
              }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={`h-6 w-6 ${isScrolled ? 'drop-shadow-sm' : ''}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled ? 'drop-shadow-sm' : ''}`} />
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl md:text-3xl flex items-baseline">
              <span className={`logo-snake font-black tracking-tighter transition-colors duration-300 ${isScrolled ? 'text-[#8b5cf6] drop-shadow-sm' : 'text-[#8b5cf6]'
                }`}>
                <span>E</span>
                <span>c</span>
                <span>o</span>
                <span>L</span>
                <span>o</span>
                <span>o</span>
                <span>P</span>
              </span>
              <span className={`logo-ke font-bold text-sm ml-1 transition-colors duration-300 ${isScrolled ? 'text-[#8b5cf6]' : 'text-[#f68b1e]' // Keep original orange or switch to purple? keeping orange for identity, or maybe adaptive? Let's make "Ke" adaptive too for contrast if needed, or keep it distinct.
                }`}> Ke</span>
            </h1>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <LiveSearch />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 md:space-x-4 lg:space-x-6">

            {/* Account */}
            <div className="relative cursor-pointer">
              <div
                className="flex items-center space-x-1 hover:text-[#8b5cf6] py-2 header-icon select-none"
                onClick={() => toggleDropdown('account')}
              >
                <User className="h-5 w-5 md:h-6 md:w-6" />
                <span className="font-medium hidden lg:block">
                  {user ? `Hi, ${user.firstName}` : 'Account'}
                </span>
                <ChevronDown className={`h-4 w-4 hidden md:block transition-transform duration-200 ${activeDropdown === 'account' ? 'rotate-180' : ''}`} />
              </div>

              {/* Dropdown */}
              {activeDropdown === 'account' && (
                <div className="absolute top-full right-0 w-64 bg-white shadow-xl rounded-xl mt-2 py-2 block z-[60] border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                        <p className="font-bold text-sm text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link href="/account" className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 hover:text-[#8b5cf6] text-sm text-gray-700 font-medium transition-colors" onClick={() => setActiveDropdown(null)}>
                        <User className="h-4 w-4" /> My Account
                      </Link>
                      <Link href="/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 hover:text-[#8b5cf6] text-sm text-gray-700 font-medium transition-colors" onClick={() => setActiveDropdown(null)}>
                        <Package className="h-4 w-4" /> Orders
                      </Link>
                      <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 hover:text-[#8b5cf6] text-sm text-gray-700 font-medium transition-colors" onClick={() => setActiveDropdown(null)}>
                        <Heart className="h-4 w-4" /> Saved Items
                      </Link>
                      <button
                        onClick={() => { handleLogout(); setActiveDropdown(null); }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 hover:text-red-700 text-sm w-full text-left text-red-600 font-medium transition-colors border-t border-gray-100 mt-1"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-purple-50 to-white text-center">
                        <button
                          onClick={() => { setShowAuthModal(true); setIsLogin(true); setActiveDropdown(null); }}
                          className="w-full bg-[#8b5cf6] text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-[#7c3aed] hover:shadow-lg transition-all active:scale-95 mb-2"
                        >
                          SIGN IN
                        </button>
                        <button
                          onClick={() => { setShowAuthModal(true); setIsLogin(false); setActiveDropdown(null); }}
                          className="text-xs text-[#8b5cf6] font-semibold hover:underline"
                        >
                          Create an account
                        </button>
                      </div>
                      <Link href="/account" className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 hover:text-[#8b5cf6] text-sm text-gray-700 font-medium transition-colors" onClick={() => setActiveDropdown(null)}>
                        <User className="h-4 w-4" /> My Account
                      </Link>
                      <Link href="/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 hover:text-[#8b5cf6] text-sm text-gray-700 font-medium transition-colors" onClick={() => setActiveDropdown(null)}>
                        <Package className="h-4 w-4" /> Orders
                      </Link>
                      <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 hover:text-[#8b5cf6] text-sm text-gray-700 font-medium transition-colors" onClick={() => setActiveDropdown(null)}>
                        <Heart className="h-4 w-4" /> Saved Items
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Help */}
            <div className="relative cursor-pointer">
              <div
                className="flex items-center space-x-1 hover:text-[#8b5cf6] py-2 header-icon select-none"
                onClick={() => toggleDropdown('help')}
              >
                <HelpCircle className="h-6 w-6" />
                <span className="font-medium hidden lg:block">Help</span>
                <ChevronDown className={`h-4 w-4 hidden md:block transition-transform duration-200 ${activeDropdown === 'help' ? 'rotate-180' : ''}`} />
              </div>

              {activeDropdown === 'help' && (
                <div className="absolute top-full right-0 w-60 bg-white shadow-xl rounded-xl mt-2 py-2 block z-[60] border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link href="/help" className="block px-4 py-3 hover:bg-purple-50 hover:text-[#8b5cf6] text-sm text-gray-700 font-medium transition-colors" onClick={() => setActiveDropdown(null)}>Help Center</Link>
                  <Link href="/help/order" className="block px-4 py-3 hover:bg-purple-50 hover:text-[#8b5cf6] text-sm text-gray-700 font-medium transition-colors" onClick={() => setActiveDropdown(null)}>Place & Track Order</Link>
                  <Link href="/help/cancellation" className="block px-4 py-3 hover:bg-purple-50 hover:text-[#8b5cf6] text-sm text-gray-700 font-medium transition-colors" onClick={() => setActiveDropdown(null)}>Order Cancellation</Link>
                  <Link href="/help/returns" className="block px-4 py-3 hover:bg-purple-50 hover:text-[#8b5cf6] text-sm text-gray-700 font-medium transition-colors" onClick={() => setActiveDropdown(null)}>Returns & Refunds</Link>
                  <Link href="/help/payment" className="block px-4 py-3 hover:bg-purple-50 hover:text-[#8b5cf6] text-sm text-gray-700 font-medium transition-colors" onClick={() => setActiveDropdown(null)}>Payment & Account</Link>
                </div>
              )}
            </div>

            {/* Messages - only show for logged in users */}
            {user && (
              <Link
                href="/messages"
                className="flex items-center space-x-1 hover:text-[#8b5cf6] relative"
              >
                <div className="relative">
                  <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
                <span className="font-medium hidden lg:block">Messages</span>
              </Link>
            )}

            {/* Wishlist - only show for logged in users */}
            {user && (
              <Link
                href="/wishlist"
                className="flex items-center space-x-1 hover:text-[#8b5cf6] relative"
              >
                <div className="relative">
                  <Heart className="h-5 w-5 md:h-6 md:w-6" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#8b5cf6] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </span>
                  )}
                </div>
                <span className="font-medium hidden lg:block">Wishlist</span>
              </Link>
            )}



            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart */}
            <div className="relative">
              <Link href="/cart" className={`flex items-center hover:text-[#8b5cf6] transition-colors ${isScrolled ? 'text-[#8b5cf6]' : 'text-gray-700'
                }`}>
                <div className="relative">
                  <ShoppingCart className={`h-6 w-6 mr-2 ${isScrolled ? 'text-[#8b5cf6]' : 'text-gray-700'}`} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-0 bg-[#8b5cf6] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="font-bold text-sm hidden md:block">Cart</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 mt-3">
          <LiveSearch />
        </div>
      </header>

      {/* Professional Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden font-sans">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 opacity-100 backdrop-blur-sm transition-opacity" onClick={() => setMobileMenuOpen(false)} />

          {/* Menu Drawer */}
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-out">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 via-white to-white flex justify-between items-center sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-black text-gray-800 tracking-tight">Menu</h2>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Explore EcoLooP</p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 bg-gray-100/50 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User Section (Mobile) */}
            <div className="p-4 bg-purple-50/50 border-b border-purple-100">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-[#8b5cf6] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {user.firstName?.[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Hi, {user.firstName}</p>
                    <p className="text-xs text-gray-500">Welcome back!</p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); setShowAuthModal(true); setIsLogin(true); }}
                  className="w-full flex items-center justify-center gap-2 bg-[#8b5cf6] text-white py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-transform"
                >
                  <User className="h-4 w-4" /> Sign In / Register
                </button>
              )}
            </div>

            {/* Categories Navigation */}
            <div className="p-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Categories</h3>
              <nav className="space-y-1">
                {[
                  { name: 'Phones & Tablets', icon: <Smartphone className="h-5 w-5" />, color: 'text-blue-500', bg: 'bg-blue-50' },
                  { name: 'Electronics', icon: <Monitor className="h-5 w-5" />, color: 'text-purple-500', bg: 'bg-purple-50' },
                  { name: 'Home & Office', icon: <Package className="h-5 w-5" />, color: 'text-orange-500', bg: 'bg-orange-50' },
                  { name: 'Health & Beauty', icon: <Heart className="h-5 w-5" />, color: 'text-pink-500', bg: 'bg-pink-50' },
                  { name: 'Fashion', icon: <Shirt className="h-5 w-5" />, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                  { name: 'Supermarket', icon: <ShoppingBasket className="h-5 w-5" />, color: 'text-green-500', bg: 'bg-green-50' },
                  { name: 'Computing', icon: <Laptop className="h-5 w-5" />, color: 'text-cyan-500', bg: 'bg-cyan-50' },
                  { name: 'Gaming', icon: <GamepadIcon className="h-5 w-5" />, color: 'text-red-500', bg: 'bg-red-50' },
                  { name: 'Sports', icon: <Dumbbell className="h-5 w-5" />, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                  { name: 'Baby Products', icon: <Baby className="h-5 w-5" />, color: 'text-teal-500', bg: 'bg-teal-50' },
                  { name: 'Kitchen', icon: <Utensils className="h-5 w-5" />, color: 'text-stone-500', bg: 'bg-stone-50' },
                ].map((cat) => (
                  <Link
                    key={cat.name}
                    href={`/category/${cat.name.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-')}`}
                    className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-all active:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className={`p-2 rounded-lg ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform`}>
                      {cat.icon}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{cat.name}</span>
                    <ChevronDown className="h-4 w-4 ml-auto text-gray-300 -rotate-90" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* Value Added Services */}
            <div className="p-4 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Services</h3>
              <div className="space-y-1">
                <Link href="/sell" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-50 group" onClick={() => setMobileMenuOpen(false)}>
                  <div className="p-2 bg-purple-100 text-[#8b5cf6] rounded-lg group-hover:scale-110 transition-transform"><Plus className="h-5 w-5" /></div>
                  <span className="text-sm font-semibold text-gray-700">Sell on EcoLooP</span>
                </Link>
                <Link href="/help" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 group" onClick={() => setMobileMenuOpen(false)}>
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform"><HelpCircle className="h-5 w-5" /></div>
                  <span className="text-sm font-semibold text-gray-700">Help Center</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialIsLogin={isLogin}

      />
      <PWAInstall />
    </div>
  );
};

export default Header;

