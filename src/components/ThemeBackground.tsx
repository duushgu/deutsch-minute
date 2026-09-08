import React from 'react';
import { ThemeId } from '../types';

interface ThemeBackgroundProps {
  theme: ThemeId;
}

export const ThemeBackground: React.FC<ThemeBackgroundProps> = ({ theme }) => {
  if (theme === 'standard') {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* ========================================================================= */}
      {/* 1. INFJ THEMES (Мөнгөнчимэг)                                              */}
      {/* ========================================================================= */}

      {/* 1.1 K-Drama & Aesthetic Twilight */}
      {theme === 'kdrama' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#11091d] via-[#1c0d2a] to-[#0d0617]">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-pink-500/20 blur-3xl animate-aura-slow" />
          <div className="absolute top-1/3 -right-28 w-88 h-88 rounded-full bg-purple-500/20 blur-3xl animate-aura-reverse" />
          <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-rose-500/15 blur-3xl animate-aura-slow" />

          {/* Floating Sakura Petals */}
          <div className="sakura-container absolute inset-0">
            <div className="sakura-petal petal-1">🌸</div>
            <div className="sakura-petal petal-2">✨</div>
            <div className="sakura-petal petal-3">🌸</div>
            <div className="sakura-petal petal-4">🌷</div>
            <div className="sakura-petal petal-5">✨</div>
            <div className="sakura-petal petal-6">🌸</div>
          </div>

          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/50" />
        </div>
      )}

      {/* 1.2 Catppuccin Macchiato */}
      {theme === 'catppuccin' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#1e2030] via-[#24273a] to-[#181926]">
          {/* Soft Mauve, Lavender, Peach Pastel Auras */}
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[#c6a0f6]/15 blur-3xl animate-aura-slow" />
          <div className="absolute top-1/3 -right-28 w-88 h-88 rounded-full bg-[#b7bdf8]/15 blur-3xl animate-aura-reverse" />
          <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-[#f5a97f]/10 blur-3xl animate-aura-slow" />

          {/* Floating pastel stars and sparkles */}
          <div className="catppuccin-stars-container absolute inset-0">
            <div className="catppuccin-star star-1">⭐</div>
            <div className="catppuccin-star star-2">✨</div>
            <div className="catppuccin-star star-3">🌸</div>
            <div className="catppuccin-star star-4">⭐</div>
            <div className="catppuccin-star star-5">✨</div>
          </div>

          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/40" />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ISFJ THEMES (Жижгээ) - Strictly Separated Animes                       */}
      {/* ========================================================================= */}

      {/* 2.1 Demon Slayer: Tanjiro (Water & Sun Breathing) */}
      {(theme === 'cozy' || theme === 'tanjiro') && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#021812] via-[#04241b] to-[#010e0a]">
          {/* Tanjiro Checkered Haori Pattern */}
          <div
            className="absolute inset-0 opacity-[0.07]"
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

          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl animate-aura-slow" />
          <div className="absolute top-1/3 -right-28 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl animate-aura-reverse" />
          <div className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl animate-aura-slow" />

          {/* Water & Sun Breathing Sparks */}
          <div className="hero-sparks-container absolute inset-0">
            <div className="hero-spark spark-1" />
            <div className="hero-spark spark-3" />
            <div className="hero-spark spark-4" />
            <div className="hero-spark spark-6" />
          </div>

          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60" />
        </div>
      )}

      {/* 2.2 Demon Slayer: Rengoku (Fire Hashira - Flame Breathing) */}
      {theme === 'rengoku' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#1b0704] via-[#2d0c06] to-[#120302]">
          {/* Flame cape auras */}
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-orange-600/25 blur-3xl animate-aura-slow" />
          <div className="absolute top-1/3 -right-28 w-88 h-88 rounded-full bg-red-600/25 blur-3xl animate-aura-reverse" />
          <div className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl animate-aura-slow" />

          {/* Rising Flame Embers */}
          <div className="flame-embers-container absolute inset-0">
            <div className="flame-ember ember-1" />
            <div className="flame-ember ember-2" />
            <div className="flame-ember ember-3" />
            <div className="flame-ember ember-4" />
            <div className="flame-ember ember-5" />
            <div className="flame-ember ember-6" />
          </div>

          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/70" />
        </div>
      )}

      {/* 2.3 My Hero Academia: Deku (One For All Full Cowl) */}
      {theme === 'mha_deku' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#021815] via-[#042820] to-[#01140e]">
          {/* One For All Emerald Energy Orbs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-500/25 blur-3xl animate-aura-slow" />
          <div className="absolute top-1/2 -left-28 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl animate-aura-reverse" />
          <div className="absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl animate-aura-slow" />

          {/* Full Cowl lightning sparks */}
          <div className="hero-sparks-container absolute inset-0">
            <div className="hero-spark spark-1" />
            <div className="hero-spark spark-2" />
            <div className="hero-spark spark-3" />
            <div className="hero-spark spark-4" />
            <div className="hero-spark spark-5" />
          </div>

          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60" />
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. ISTP THEMES (Томоо) - Mobile Legends Universe                          */}
      {/* ========================================================================= */}

      {/* 3.1 MLBB: Cyber Arena */}
      {theme === 'gamer' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#040914] via-[#061324] to-[#02060e]">
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

          <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full bg-cyan-500/25 blur-3xl animate-aura-slow" />
          <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl animate-aura-reverse" />
          <div className="absolute -bottom-20 right-10 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl animate-aura-slow" />

          <div className="hud-scanline absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

          <div className="absolute top-16 left-4 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
          <div className="absolute top-40 right-6 w-1 h-1 rounded-full bg-emerald-400 animate-ping opacity-60" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-32 left-8 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping opacity-50" style={{ animationDelay: '2s' }} />

          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/70" />
        </div>
      )}

      {/* 3.2 MLBB x Jujutsu Kaisen (Cursed Energy Domain) */}
      {theme === 'mlbb_jjk' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0517] via-[#160829] to-[#080210]">
          {/* Cursed Energy Domain Orbs */}
          <div className="absolute -top-28 -left-28 w-96 h-96 rounded-full bg-purple-600/25 blur-3xl animate-aura-slow" />
          <div className="absolute top-1/3 -right-28 w-88 h-88 rounded-full bg-indigo-600/25 blur-3xl animate-aura-reverse" />
          <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-violet-500/20 blur-3xl animate-aura-slow" />

          {/* Cursed Energy Sparks */}
          <div className="cursed-sparks-container absolute inset-0">
            <div className="cursed-spark cursed-1" />
            <div className="cursed-spark cursed-2" />
            <div className="cursed-spark cursed-3" />
            <div className="cursed-spark cursed-4" />
          </div>

          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/75" />
        </div>
      )}

      {/* 3.3 MLBB x Transformers (Cybertron Mecha) */}
      {theme === 'mlbb_transformers' && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a101d] via-[#101c30] to-[#060b14]">
          {/* Cybertronian Hex Dots */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          <div className="absolute -top-28 -right-28 w-96 h-96 rounded-full bg-blue-600/25 blur-3xl animate-aura-slow" />
          <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-yellow-500/15 blur-3xl animate-aura-reverse" />
          <div className="absolute -bottom-20 right-10 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl animate-aura-slow" />

          {/* Energon Welding Sparks */}
          <div className="mecha-sparks-container absolute inset-0">
            <div className="mecha-spark mecha-1" />
            <div className="mecha-spark mecha-2" />
            <div className="mecha-spark mecha-3" />
            <div className="mecha-spark mecha-4" />
          </div>

          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/70" />
        </div>
      )}
    </div>
  );
};
