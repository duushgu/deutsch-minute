import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ChatSession } from './components/ChatSession';
import { LockoutScreen } from './components/LockoutScreen';
import { SquadLeaderboard } from './components/SquadLeaderboard';
import { ArchiveScreen } from './components/ArchiveScreen';
import { SettingsModal } from './components/SettingsModal';
import { PROFILES } from './data/profiles';
import { CURRICULUM } from './data/curriculum';
import {
  loadSquadState,
  completeDayLesson,
  isCompletedToday,
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

      {/* Settings / Admin Modal */}
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
