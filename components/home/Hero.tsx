"use client";

import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { DEMO_PRESETS } from "@/data/seed/demo-presets";
import { DemoPreset } from "@/types/project";

interface HeroProps {
  onSelectPreset: (preset: DemoPreset) => void;
  onScrollToForm: () => void;
  onOpenTalent: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSelectPreset,
  onScrollToForm,
  onOpenTalent,
}) => {
  return (
    <div>
      {/* Hero Section */}
      <section aria-label="Hero introduction" className="py-16 md:py-24 px-4 sm:px-8 md:px-16 max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-primary leading-[1.1] font-sans">
            Build the right team, not just a team.
          </h1>
          <p className="text-lg md:text-xl text-secondary max-w-2xl font-normal leading-relaxed">
            Describe your project idea and our AI will find the perfect teammates based on skills, interests, availability, and experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              onClick={onScrollToForm}
              className="bg-primary text-on-primary text-sm font-semibold px-8 py-4 rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              Create a Project
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <button
              onClick={onOpenTalent}
              className="border border-outline-variant bg-surface-container-lowest text-primary text-sm font-semibold px-8 py-4 rounded-full hover:bg-surface-container-low transition-colors flex items-center justify-center"
            >
              Explore Talent
            </button>
          </div>

          {/* Quick Demo Presets Pills */}
          <div className="pt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-secondary font-medium">Quick Demo Ideas:</span>
            {DEMO_PRESETS.slice(0, 3).map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="px-3 py-1 text-xs rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors border border-outline-variant font-medium flex items-center gap-1"
              >
                <span>{preset.title.split(" ")[1] || preset.title}</span>
                <span className="text-[10px] text-secondary">→</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Hero Graphic Mockup */}
        <div className="flex-1 w-full relative max-w-xl lg:max-w-none">
          <div className="absolute inset-0 bg-surface-container-highest rounded-[3rem] transform -rotate-3 z-0 animate-floatSlow"></div>
          <div className="relative z-10 w-full rounded-xl bg-white border border-outline-variant shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-6 sm:p-8 space-y-6 hover-lift">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400 animate-pulse" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-mono text-secondary">team-matching-engine.ai</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-base text-primary">AI Waste Segregation Project</h4>
                  <p className="text-xs text-secondary">4 Complementary Roles • 94% Compatibility</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-bold shadow-sm">
                  94% Match
                </span>
              </div>

              {/* Mini Avatars Stack */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant flex items-center gap-2.5 transition-all duration-200 hover:bg-white hover:shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                    alt="Aarav"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-xs">
                    <div className="font-semibold text-primary">Aarav Sharma</div>
                    <div className="text-[10px] text-secondary">ML / Computer Vision</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant flex items-center gap-2.5 transition-all duration-200 hover:bg-white hover:shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100"
                    alt="Arjun"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-xs">
                    <div className="font-semibold text-primary">Arjun Mehta</div>
                    <div className="text-[10px] text-secondary">Full Stack Lead</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant flex items-center gap-2.5 transition-all duration-200 hover:bg-white hover:shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100"
                    alt="Priya"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-xs">
                    <div className="font-semibold text-primary">Priya Nair</div>
                    <div className="text-[10px] text-secondary">UI/UX Designer</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant flex items-center gap-2.5 transition-all duration-200 hover:bg-white hover:shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100"
                    alt="Rahul"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-xs">
                    <div className="font-semibold text-primary">Rahul Verma</div>
                    <div className="text-[10px] text-secondary">Sustainability Lead</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-surface-container-lowest border-y border-outline-variant">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center md:text-left space-y-2 group cursor-default">
              <p className="text-4xl md:text-5xl font-bold text-primary group-hover:scale-105 transition-transform duration-300">500+</p>
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Students</p>
            </div>
            <div className="text-center md:text-left space-y-2 group cursor-default">
              <p className="text-4xl md:text-5xl font-bold text-primary group-hover:scale-105 transition-transform duration-300">120+</p>
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Projects</p>
            </div>
            <div className="text-center md:text-left space-y-2 group cursor-default">
              <p className="text-4xl md:text-5xl font-bold text-primary group-hover:scale-105 transition-transform duration-300">90%</p>
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Match Success</p>
            </div>
            <div className="text-center md:text-left space-y-2 group cursor-default">
              <p className="text-4xl md:text-5xl font-bold text-primary group-hover:scale-105 transition-transform duration-300">25+</p>
              <p className="text-xs font-semibold text-secondary uppercase tracking-wider">Colleges</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section id="features-section" className="py-20 px-4 sm:px-8 md:px-16 max-w-[1280px] mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-primary tracking-tight">How AI connects you</h2>
          <p className="text-base text-secondary">
            Our intelligent matching engine analyzes complex data points to form high-performing academic and professional groups.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Card: Smart Skill Mapping */}
          <div className="md:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[300px] hover-lift">
            <div className="space-y-4">
              <span className="material-symbols-outlined text-4xl text-primary">psychology</span>
              <h3 className="text-2xl font-semibold text-primary">Smart Skill Mapping</h3>
              <p className="text-base text-secondary leading-relaxed">
                Beyond just listing skills, our AI understands context, proficiency levels, and complementary abilities to balance your team&apos;s technical and soft skills.
              </p>
            </div>
            <div className="mt-8 h-32 bg-surface-container rounded-xl border border-outline-variant flex items-center justify-center text-xs text-secondary font-mono">
              [ Semantic Skill Graph • Computer Vision ↔ ML ↔ Full Stack ↔ Domain ]
            </div>
          </div>

          {/* Small Card 1: Availability Sync */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col justify-between hover-lift">
            <div className="space-y-4">
              <span className="material-symbols-outlined text-4xl text-primary">schedule</span>
              <h3 className="text-lg font-semibold text-primary">Availability Sync</h3>
              <p className="text-sm text-secondary leading-relaxed">
                Automatically find time overlap across different schedules and sprint deadlines for seamless collaboration.
              </p>
            </div>
          </div>

          {/* Small Card 2: Culture Fit */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col justify-between hover-lift">
            <div className="space-y-4">
              <span className="material-symbols-outlined text-4xl text-primary">diversity_3</span>
              <h3 className="text-lg font-semibold text-primary">Culture Fit</h3>
              <p className="text-sm text-secondary leading-relaxed">
                Matches based on working styles, communication preferences, and shared project passion.
              </p>
            </div>
          </div>

          {/* Wide Card Bottom: CTA */}
          <div className="md:col-span-2 bg-primary text-on-primary border border-outline-variant rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center justify-between gap-8 hover-lift">
            <div className="space-y-2 max-w-md">
              <h3 className="text-2xl font-semibold">Ready to find your team?</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                Stop scrolling through endless profiles. Let data drive your team formation process today.
              </p>
            </div>
            <button
              onClick={onScrollToForm}
              className="bg-surface text-on-surface font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-surface-container transition-all whitespace-nowrap btn-press"
            >
              Start Matching Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
