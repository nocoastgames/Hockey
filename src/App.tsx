import React, { useState } from 'react';
import { GameConfig, Settings } from './components/Settings';
import { Game } from './components/Game';

export default function App() {
  const [view, setView] = useState<'settings' | 'game'>('settings');
  const [config, setConfig] = useState<GameConfig>({
    mode: 'score',
    difficulty: 'errorless',
  });

  if (view === 'settings') {
    return (
      <Settings 
        config={config} 
        setConfig={setConfig} 
        onStart={() => setView('game')} 
      />
    );
  }

  return (
    <Game 
      config={config} 
      onOpenSettings={() => setView('settings')} 
    />
  );
}
