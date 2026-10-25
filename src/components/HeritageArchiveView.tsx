import React from 'react';
import { History, Shield, Award, Sparkles, Smartphone, ArrowRight, Play } from 'lucide-react';

interface HeritageArchiveViewProps {
  onStartClassicMatch: () => void;
}

export const HeritageArchiveView: React.FC<HeritageArchiveViewProps> = ({ onStartClassicMatch }) => {
  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8 animate-apple-spring">
      {/* Hero */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[12px] font-semibold">
          <History className="w-3.5 h-3.5" />
          <span>Historical Archive (2008 – 2026)</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">
          From Java ME Feature Phones to Apple Design
        </h2>
        <p className="text-[15px] text-muted-foreground leading-relaxed">
          How the 2008 J2ME classic <em>Ludo & Friends</em> by ANYPLAYS was preserved, upgraded, and transformed into an Apple-grade spatial experience.
        </p>
      </div>

      {/* Side-by-side evolution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2008 J2ME Era */}
        <div className="p-6 rounded-[24px] apple-glass border border-black/10 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-mono px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-muted-foreground">
              Year 2008
            </span>
            <Smartphone className="w-5 h-5 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Ludo & Friends 1.0 (J2ME)</h3>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Targeting Nokia Series 40/60, Sony Ericsson, and BlackBerry devices with 176x208 to 240x320 screen resolutions. Included custom bitmap fonts, MIDI synthesizers, and 4 fantasy character classes.
          </p>
          <ul className="text-[12px] text-muted-foreground space-y-1.5 list-disc pl-5">
            <li>Developed by ANYPLAYS (Movilenio Servicios Móviles S.L.)</li>
            <li>Softkey navigation & keypad controls (Q-key on BlackBerry)</li>
            <li>Bluetooth multiplayer & GPRS online matchmaking</li>
            <li>Original audio tracks: <code>menu.mid</code> & <code>play.mid</code></li>
          </ul>
        </div>

        {/* 2026 Apple Edition */}
        <div className="p-6 rounded-[24px] apple-glass border border-[#0066cc]/30 dark:border-[#2997ff]/30 shadow-apple-subtle space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-mono px-2 py-0.5 rounded-full bg-[#0066cc]/10 text-[#0066cc] dark:text-[#2997ff] font-semibold">
              Year 2026
            </span>
            <Sparkles className="w-5 h-5 text-[#0066cc] dark:text-[#2997ff]" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">Ludo & Friends Pro (Apple Edition)</h3>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            Re-engineered with Apple’s Human Interface Guidelines, fluid spring physics, Liquid Glass materials, and TypeSafe System One AI intelligence.
          </p>
          <ul className="text-[12px] text-muted-foreground space-y-1.5 list-disc pl-5">
            <li>SF Pro Display typography with signature negative tracking</li>
            <li>Apple Fluid Motion with critically damped springs</li>
            <li>TypeSafe System One (Jev) real-time strategic routing</li>
            <li>Real-time Supabase multiplayer & YouTube Playables support</li>
          </ul>
        </div>
      </div>

      {/* Roster Showcase */}
      <div className="rounded-[28px] apple-glass border border-black/10 dark:border-white/10 p-6 sm:p-8 apple-elevation space-y-6">
        <h3 className="text-[18px] font-semibold text-foreground tracking-tight flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#0066cc] dark:text-[#2997ff]" />
          <span>The 4 Original Fantasy Character Classes</span>
        </h3>
        <p className="text-[13px] text-muted-foreground">
          In the original J2ME release, each player color was represented by an authentic Fantasy archetype:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              role: 'Paladin',
              color: 'Red Player',
              avatar: '🦁',
              tint: 'border-[#FF3B30]/30 bg-[#FF3B30]/5',
              desc: 'Noble protector of the realm. Specializes in frontline yard breakthroughs and relentless pursuit.',
            },
            {
              role: 'Knight',
              color: 'Blue Player',
              avatar: '🐲',
              tint: 'border-[#007AFF]/30 bg-[#007AFF]/5',
              desc: 'Armored vanguard. Masters the tactical art of wall blockades to halt advancing rivals.',
            },
            {
              role: 'Wizard',
              color: 'Green Player',
              avatar: '🧙',
              tint: 'border-[#34C759]/30 bg-[#34C759]/5',
              desc: 'Arcane strategist. Computes high-probability goal corridors and safe star cell transits.',
            },
            {
              role: 'Orc',
              color: 'Yellow Player',
              avatar: '🦊',
              tint: 'border-[#FF9500]/30 bg-[#FF9500]/5',
              desc: 'Fierce conqueror. Seeks sudden ambush strikes to claim the prized 20-cell elimination bonuses.',
            },
          ].map(c => (
            <div key={c.role} className={`p-4 rounded-2xl border ${c.tint} space-y-2`}>
              <div className="text-3xl">{c.avatar}</div>
              <div>
                <strong className="text-[16px] text-foreground block">{c.role}</strong>
                <span className="text-[11px] text-muted-foreground font-semibold">{c.color}</span>
              </div>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Quick Launch Button */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={onStartClassicMatch}
            className="apple-pill-btn bg-[#0066cc] hover:bg-[#0071e3] text-white flex items-center gap-2 text-[15px] shadow-sm py-3 px-6"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Match with Classic 2008 Archetypes</span>
          </button>
        </div>
      </div>

      {/* Original Credits */}
      <div className="p-6 rounded-[24px] apple-glass border border-black/10 dark:border-white/10 space-y-3">
        <h4 className="text-[15px] font-semibold text-foreground flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Original J2ME Development Credits</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[13px] text-muted-foreground">
          <div>
            <strong className="text-foreground block">Software Engine</strong>
            Iñaki Segrelles
          </div>
          <div>
            <strong className="text-foreground block">Graphics & Sprites</strong>
            Pablo Sánchez
          </div>
          <div>
            <strong className="text-foreground block">Music & MIDI Audio</strong>
            José Vázquez
          </div>
          <div>
            <strong className="text-foreground block">Quality Assurance</strong>
            José Jimeno
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground/80 pt-2 border-t border-black/10 dark:border-white/10">
          (c) 2008 Movilenio Servicios Móviles S.L. All rights reserved. Preserved with reverence in modern TypeScript & React.
        </p>
      </div>
    </div>
  );
};

export default HeritageArchiveView;
