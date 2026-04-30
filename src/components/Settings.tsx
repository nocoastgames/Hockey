import React from 'react';
import { Settings as SettingsIcon, Play, Shield, Target } from 'lucide-react';

export interface GameConfig {
  mode: 'score' | 'defend';
  difficulty: 'normal' | 'errorless';
}

interface SettingsProps {
  config: GameConfig;
  setConfig: (config: GameConfig) => void;
  onStart: () => void;
}

export function Settings({ config, setConfig, onStart }: SettingsProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700">
        <div className="flex items-center justify-center gap-3 mb-8 text-amber-500">
          <SettingsIcon size={32} />
          <h1 className="text-3xl font-bold tracking-tight">Teacher Settings</h1>
        </div>
        
        <div className="space-y-8">
          {/* Mode Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-300">Game Mode</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setConfig({ ...config, mode: 'score' })}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                  config.mode === 'score'
                    ? 'border-amber-500 bg-slate-700 text-white'
                    : 'border-slate-600 hover:border-slate-500 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Target size={40} className="mb-2" />
                <span className="font-bold">Score</span>
                <span className="text-xs opacity-70 mt-1">Shoot the puck</span>
              </button>

              <button
                onClick={() => setConfig({ ...config, mode: 'defend' })}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                  config.mode === 'defend'
                    ? 'border-amber-500 bg-slate-700 text-white'
                    : 'border-slate-600 hover:border-slate-500 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield size={40} className="mb-2" />
                <span className="font-bold">Defend</span>
                <span className="text-xs opacity-70 mt-1">Block the shot</span>
              </button>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-300">Difficulty Level</h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setConfig({ ...config, difficulty: 'errorless' })}
                className={`flex items-center p-4 rounded-xl border-2 text-left transition-all ${
                  config.difficulty === 'errorless'
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-100'
                    : 'border-slate-600 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold text-lg">Errorless (Cause & Effect)</div>
                  <div className="text-sm opacity-80">Guaranteed success on switch press. Best for learning action-reaction.</div>
                </div>
              </button>
              
              <button
                onClick={() => setConfig({ ...config, difficulty: 'normal' })}
                className={`flex items-center p-4 rounded-xl border-2 text-left transition-all ${
                  config.difficulty === 'normal'
                    ? 'border-amber-500 bg-amber-500/20 text-amber-100'
                    : 'border-slate-600 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold text-lg">Normal (Timing Based)</div>
                  <div className="text-sm opacity-80">Requires pressing the switch at the right time.</div>
                </div>
              </button>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={onStart}
            className="w-full py-6 mt-4 bg-amber-500 hover:bg-amber-400 text-slate-900 text-2xl font-black rounded-2xl flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg shadow-amber-500/20"
          >
            <Play fill="currentColor" size={28} />
            START GAME
          </button>
        </div>
      </div>
    </div>
  );
}
