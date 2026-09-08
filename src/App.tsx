import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ChatSession } from './components/ChatSession';
import { LockoutScreen } from './components/LockoutScreen';
import { SquadLeaderboard } from './components/SquadLeaderboard';
import { ArchiveScreen } from './components/ArchiveScreen';
import { SettingsModal } from './components/SettingsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { PROFILES } from './data/profiles';
import { CURRICULUM } from './data/curriculum';
import {
  loadSquadState,
  completeDayLesson,
  isCompletedToday,
  updateOnboarding,
  syncWithCloud,
} from './services/storage';
import { ProfileId, SquadState } from './types';

export const App: React.FC = () => {
  const [squadState, setSquadState] = useState<SquadState>(() => loadSquadState());
  const [activeTab, setActiveTab] = useState<'chat' | 'squad' | 'archive'>('chat');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const activeProfile = squadState.activeProfileId;
  const config = PROFILES[activeProfile];
  const progress = squadState.profiles[activeProfile];
  const lessons = CURRICULUM[activeProfile] || [];
  
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
    syncWithCloud(squadState).then((latest) => {
      if (mounted) setSquadState(latest);
    });

    const handleSync = () => {
      syncWithCloud(squadState).then((latest) => {
        if (mounted) setSquadState(latest);
      });
    };

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
    setActiveTab(tab);
    if (tab === 'squad') {
      syncWithCloud(squadState).then(setSquadState);
    }
  };

  const handleCompleteLesson = (day: number) => {
    const updated = completeDayLesson(squadState, activeProfile, day);
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
  const themeClass = `theme-${config.theme}`;

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col ${themeClass}`}>
      {/* Top Navigation */}
      <Navbar
        config={config}
        progress={progress}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenSettings={() => setIsSettingsOpen(true)}
        testModeUnlocked={squadState.testModeUnlocked}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'chat' && (
          <>
            {isTodayDone ? (
              <LockoutScreen
                lesson={currentLesson}
                config={config}
                progress={progress}
                partnerName={partnerName}
                partnerAvatar={partnerAvatar}
              />
            ) : (
              <ChatSession
                lesson={currentLesson}
                config={config}
                userName={displayName}
                partnerName={partnerName}
                partnerAvatar={partnerAvatar}
                onComplete={handleCompleteLesson}
              />
            )}
          </>
        )}

        {activeTab === 'squad' && (
          <SquadLeaderboard
            squadState={squadState}
            onSelectProfile={handleSelectProfile}
          />
        )}

        {activeTab === 'archive' && (
          <ArchiveScreen config={config} progress={progress} />
        )}
      </main>

      {/* First-Time Name & Hero Selection Onboarding Modal */}
      {!progress.hasCompletedOnboarding && (
        <OnboardingModal
          config={config}
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
