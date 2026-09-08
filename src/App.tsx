import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ChatSession } from './components/ChatSession';
import { LockoutScreen } from './components/LockoutScreen';
import { SquadLeaderboard } from './components/SquadLeaderboard';
import { ArchiveScreen } from './components/ArchiveScreen';
import { SettingsModal } from './components/SettingsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ThemeBackground } from './components/ThemeBackground';
import { PROFILES } from './data/profiles';
import { CURRICULUM } from './data/curriculum';
import {
  loadSquadState,
  completeDayLesson,
  isCompletedToday,
  updateOnboarding,
  syncWithCloud,
  getTodayDateString,
} from './services/storage';
import { ProfileConfig, ProfileId, SquadState, ThemeId } from './types';

export const App: React.FC = () => {
  const [squadState, setSquadState] = useState<SquadState>(() => loadSquadState());
  const [activeTab, setActiveTab] = useState<'chat' | 'squad' | 'archive'>('chat');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [currentDateStr, setCurrentDateStr] = useState<string>(() => getTodayDateString());

  // Check midnight rollover so the lock screen automatically unlocks next day's mission
  useEffect(() => {
    const dayCheck = setInterval(() => {
      const today = getTodayDateString();
      if (today !== currentDateStr) {
        setCurrentDateStr(today);
      }
    }, 5000);
    return () => clearInterval(dayCheck);
  }, [currentDateStr]);

  const activeProfile = squadState.activeProfileId;
  const config = PROFILES[activeProfile];
  const progress = squadState.profiles[activeProfile];
  const lessons = CURRICULUM[activeProfile] || [];
  
  // Custom user theme override or profile default
  const effectiveTheme: ThemeId = progress.customTheme || config.theme;
  const effectiveConfig: ProfileConfig = { ...config, theme: effectiveTheme };
  
  // Lesson for current day (clamped to available lessons)
  const currentLesson =
    lessons.find((l) => l.day === progress.currentDay) ||
    lessons[lessons.length - 1] ||
    lessons[0];

  const isTodayDone = isCompletedToday(progress, squadState.testModeUnlocked);
  const displayName = progress.name || config.name;
  const partnerName = progress.partnerName || config.partnerName;
  const partnerAvatar = progress.partnerAvatar || config.partnerAvatar;

  // Dynamically set title for Android PWA "Add to Home Screen"
  useEffect(() => {
    document.title = `${displayName} ${partnerAvatar} Герман хэл`;
  }, [displayName, partnerAvatar]);

  // Silent sync with Firebase Realtime Database
  useEffect(() => {
    let mounted = true;

    const handleSync = () => {
      const currentLocal = loadSquadState();
      syncWithCloud(currentLocal).then((latest) => {
        if (mounted) setSquadState(latest);
      });
    };

    // Initial sync on mount
    handleSync();

    window.addEventListener('focus', handleSync);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') handleSync();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    const interval = setInterval(handleSync, 30000);

    return () => {
      mounted = false;
      window.removeEventListener('focus', handleSync);
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, []);

  const handleTabChange = (tab: 'chat' | 'squad' | 'archive') => {
    if (tab === 'squad' && activeProfile !== 'brother1') {
      setActiveTab('chat');
      return;
    }
    setActiveTab(tab);
    if (tab === 'squad') {
      syncWithCloud(loadSquadState()).then(setSquadState);
    }
  };

  const handleCompleteLesson = (day: number, bonusXp: number = 0) => {
    const updated = completeDayLesson(squadState, activeProfile, day, bonusXp);
    setSquadState(updated);
  };

  const handleSelectProfile = (id: ProfileId) => {
    setSquadState((prev) => ({
      ...prev,
      activeProfileId: id,
    }));
  };

  const handleCompleteOnboarding = (
    customName: string,
    chosenPartnerName: string,
    chosenPartnerAvatar: string
  ) => {
    const updated = updateOnboarding(
      squadState,
      activeProfile,
      customName,
      chosenPartnerName,
      chosenPartnerAvatar
    );
    setSquadState(updated);
  };

  // Dynamic Theme Class
  const themeClass = `theme-${effectiveTheme}`;

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col relative overflow-x-hidden ${themeClass}`}>
      {/* Animated Immersive Theme Environment Background */}
      <ThemeBackground theme={effectiveTheme} />

      {/* Top Navigation */}
      <Navbar
        config={effectiveConfig}
        progress={progress}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenSettings={() => setIsSettingsOpen(true)}
        testModeUnlocked={squadState.testModeUnlocked}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10">
        {activeTab === 'chat' && (
          <>
            {isTodayDone ? (
              <LockoutScreen
                lesson={currentLesson}
                config={effectiveConfig}
                progress={progress}
                partnerName={partnerName}
                partnerAvatar={partnerAvatar}
              />
            ) : (
              <ChatSession
                lesson={currentLesson}
                config={effectiveConfig}
                userName={displayName}
                partnerName={partnerName}
                partnerAvatar={partnerAvatar}
                onComplete={handleCompleteLesson}
              />
            )}
          </>
        )}

        {activeTab === 'squad' && activeProfile === 'brother1' && (
          <SquadLeaderboard
            squadState={squadState}
            onSelectProfile={handleSelectProfile}
          />
        )}

        {activeTab === 'archive' && (
          <ArchiveScreen
            config={effectiveConfig}
            progress={progress}
            showPhoneticsArchiveDays1to5={Boolean(
              progress.showPhoneticsArchiveDays1to5 ?? squadState.showPhoneticsArchiveDays1to5
            )}
          />
        )}
      </main>

      {/* First-Time Name & Hero Selection Onboarding Modal */}
      {!progress.hasCompletedOnboarding && (
        <OnboardingModal
          config={effectiveConfig}
          defaultPartnerName={config.partnerName}
          defaultPartnerAvatar={config.partnerAvatar}
          onComplete={handleCompleteOnboarding}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        squadState={squadState}
        onUpdateSquadState={setSquadState}
      />
    </div>
  );
};

export default App;
