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
  updateCustomName,
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

  // Dynamically set title for Android PWA "Add to Home Screen"
  useEffect(() => {
    document.title = `${displayName} ${config.userAvatar} Deutsch Minute`;
  }, [displayName, config.userAvatar]);

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

  const handleSaveOnboardingName = (newName: string) => {
    const updated = updateCustomName(squadState, activeProfile, newName);
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
        setActiveTab={setActiveTab}
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
                onNavigateToSquad={() => setActiveTab('squad')}
                onNavigateToArchive={() => setActiveTab('archive')}
              />
            ) : (
              <ChatSession
                lesson={currentLesson}
                config={config}
                userName={displayName}
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

      {/* First-Time Name Onboarding Modal */}
      {!progress.hasCompletedOnboarding && (
        <OnboardingModal
          config={config}
          currentName={displayName}
          onSaveName={handleSaveOnboardingName}
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
