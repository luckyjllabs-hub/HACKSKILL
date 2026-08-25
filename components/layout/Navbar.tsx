"use client";

import React from "react";
import { Bell, Sparkles } from "lucide-react";

interface NavbarProps {
  onOpenTalent: () => void;
  onScrollToBuilder: () => void;
  onScrollToFeatures?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTalent,
  onScrollToBuilder,
  onScrollToFeatures,
}) => {
  return (
    <header className="bg-surface sticky top-0 z-50 border-b border-outline-variant">
      <div className="flex justify-between items-center px-4 sm:px-8 md:px-16 h-20 w-full max-w-[1280px] mx-auto">
        {/* Brand */}
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-primary">
            PROJECT AI-X
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          <button
            onClick={onScrollToBuilder}
            className="text-sm text-primary font-bold border-b-2 border-primary py-2 transition-colors"
          >
            How it works
          </button>
          <button
            onClick={onScrollToFeatures}
            className="text-sm text-secondary hover:text-primary transition-colors"
          >
            Features
          </button>
          <button
            onClick={onOpenTalent}
            className="text-sm text-secondary hover:text-primary transition-colors flex items-center gap-1.5"
          >
            <span>For Students</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-surface-container font-semibold">
              35
            </span>
          </button>
          <button
            onClick={onScrollToBuilder}
            className="text-sm text-secondary hover:text-primary transition-colors"
          >
            About
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onOpenTalent}
            className="p-2 text-secondary hover:text-primary transition-colors rounded-full hover:bg-surface-container"
            title="Notifications & Talent"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
          </button>

          <button
            onClick={onScrollToBuilder}
            className="bg-primary text-on-primary text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-all flex items-center gap-1.5"
          >
            <span>Get Started</span>
          </button>

          <div
            onClick={onOpenTalent}
            className="w-8 h-8 rounded-full bg-surface-container overflow-hidden border border-outline-variant cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all"
            title="Explore Talent Pool"
          >
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
