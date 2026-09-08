import React from 'react';

interface ThemeBackgroundProps {
  theme: 'kdrama' | 'gamer' | 'cozy';
}

export const ThemeBackground: React.FC<ThemeBackgroundProps> = ({ theme }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* ========================================================================= */}
      {/* 1. ISFJ THEME (Жижгээ): Demon Slayer & My Hero Academia Emerald Hero World */}
      {/* ========================================================================= */}
      {theme === 'cozy' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#021812] via-[#04241b] to-[#010e0a]">
          {/* Tanjiro Checkered Haori Pattern (Subtle Japanese Ichimatsu grid) */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #10b981 25%, transparent 25%), 
                linear-gradient(-45deg, #10b981 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, #10b981 75%), 
                linear-gradient(-45deg, transparent 75%, #10b981 75%)
              `,
              backgroundSize: '36px 36px',
              backgroundPosition: '0 0, 0 18px, 18px -18px, -18px 0px',
            }}
          />

          {/* Deku Full Cowl & Tanjiro Breathing Energy Orbs */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl animate-aura-slow" />
          <div className="absolute top-1/3 -right-28 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl animate-aura-reverse" />
          <div className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl animate-aura-slow" />

          {/* Upward Floating Hero Sparks (One For All energy sparks) */}
          <div className="hero-sparks-container absolute inset-0">
            <div className="hero-spark spark-1" />
            <div className="hero-spark spark-2" />
            <div className="hero-spark spark-3" />
            <div className="hero-spark spark-4" />
            <div className="hero-spark spark-5" />
            <div className="hero-spark spark-6" />
          </div>

          {/* Top/Bottom ambient vignette */}
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60" />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ISTP THEME (Томоо): Mobile Legends Cyber HUD & Tactical Arena        */}
      {/* ========================================================================= */}
      {theme === 'gamer' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#040914] via-[#061324] to-[#02060e]">
          {/* Cyberpunk Tactical Grid */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `
                linear-gradient(to right, #06b6d4 1px, transparent 1px),
                linear-gradient(to bottom, #06b6d4 1px, transparent 1px)
              `,
              backgroundSize: '32px 32px',
            }}
          />

          {/* Neon Spotlights & Radar Orbs */}
          <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full bg-cyan-500/25 blur-3xl animate-aura-slow" />
          <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl animate-aura-reverse" />
          <div className="absolute -bottom-20 right-10 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl animate-aura-slow" />

          {/* Tactical HUD Scanline */}
          <div className="hud-scanline absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

          {/* Neon Cyber Circuit Dots */}
          <div className="absolute top-16 left-4 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
          <div className="absolute top-40 right-6 w-1 h-1 rounded-full bg-emerald-400 animate-ping opacity-60" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-8 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping opacity-50" style={{ animationDelay: '2s' }} />

          {/* Vignette */}
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/70" />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. INFJ THEME (Мөнгөнчимэг): K-Drama Aesthetic & Falling Sakura Petals */}
      {/* ========================================================================= */}
      {theme === 'kdrama' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#11091d] via-[#1c0d2a] to-[#0d0617]">
          {/* Dreamy Twilight Glow Orbs */}
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-pink-500/20 blur-3xl animate-aura-slow" />
          <div className="absolute top-1/3 -right-28 w-88 h-88 rounded-full bg-purple-500/20 blur-3xl animate-aura-reverse" />
          <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-rose-500/15 blur-3xl animate-aura-slow" />

          {/* Floating Sakura Petals (Soft romantic falling leaves) */}
          <div className="sakura-container absolute inset-0">
            <div className="sakura-petal petal-1">🌸</div>
            <div className="sakura-petal petal-2">✨</div>
            <div className="sakura-petal petal-3">🌸</div>
            <div className="sakura-petal petal-4">🌷</div>
            <div className="sakura-petal petal-5">✨</div>
            <div className="sakura-petal petal-6">🌸</div>
          </div>

          {/* Subtle starry background grain */}
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/50" />
        </div>
      )}
    </div>
  );
};
