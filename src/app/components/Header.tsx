// filepath: d:\webprojects\thesis-portal-fe\src\components\Header.tsx
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';


const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };


    return (
        <header className="bg-white border-b border-gray-200 fixed top-0 right-0 left-64 z-30">
            <div className="px-4 py-3 flex items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 max-w-lg">
                    <div className="relative">
                        <input
                            type="search"
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                            placeholder="Search..."
                        />
                        <div className="absolute left-3 top-2.5">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Right Side Icons */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="p-2 hover:bg-gray-100 rounded-full relative">
                        <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* User Profile */}
                    <div className='relative'>
                        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg p-2"
                            onClick={toggleDropdown}>
                            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                                <Image
                                    src="/default-avatar.png"
                                    alt="User avatar"
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                />
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-gray-700">John Doe</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                            <Link
                                href="/profile"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Profile
                            </Link>
                            <Link
                                href="/settings"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Settings
                            </Link>
                            <div className="border-t border-gray-200"></div>
                            <button
                                onClick={() => {/* Add logout logic here */ }}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </header>
    );
};

export default Header;