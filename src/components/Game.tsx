import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';
import confetti from 'canvas-confetti';
import { RinkBg, RinkBgGoalieView, ViewportGoalNet, NetSVG, PuckSVG, KnightHelmet, Stick75, GoalieGlove, CrowdSVG } from './Graphics';
import { GameConfig } from './Settings';
import { playShootSound, playGoalSound, playBlockSound, playBuzzer, playMissSound } from '../lib/audio';
import { Settings as SettingsIcon } from 'lucide-react';

interface GameProps {
  config: GameConfig;
  onOpenSettings: () => void;
}

type GameState = 'idle' | 'countdown' | 'approaching' | 'paused_in_zone' | 'action' | 'result';

export function Game({ config, onOpenSettings }: GameProps) {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [resultMessage, setResultMessage] = useState('');
  const [score, setScore] = useState(0);
  const [countdownNum, setCountdownNum] = useState(3);
  const [gloveStatus, setGloveStatus] = useState<'idle' | 'save' | 'miss'>('idle');
  
  // Refs for collision
  const puckRef = useRef<HTMLDivElement>(null);
  const blockZoneRef = useRef<HTMLDivElement>(null);

  // Controls
  const crosshairX = useMotionValue(0);
  const goalieX = useMotionValue(0);
  
  const puckControls = useAnimation();
  const goalieControls = useAnimation(); // Scorer's goalie
  const crosshairControls = useAnimation();
  const stickControls = useAnimation();
  const gloveControls = useAnimation(); // Defender's glove
  
  const stateRef = useRef({ gameState });
  useEffect(() => { stateRef.current.gameState = gameState; }, [gameState]);

  const [audioInitialized, setAudioInitialized] = useState(false);
  const initAudio = () => { if (!audioInitialized) setAudioInitialized(true); };

  const handleSwitchPress = () => {
    initAudio();
    if (stateRef.current.gameState === 'idle') {
      if (config.mode === 'score') handleScoreAction();
      else startCountdown();
    } else if (stateRef.current.gameState === 'approaching' || stateRef.current.gameState === 'paused_in_zone') {
      if (config.mode === 'defend') handleDefendAction();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleSwitchPress();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config.mode, config.difficulty]);

  useEffect(() => {
    if (gameState === 'idle') {
      if (config.mode === 'score') {
        crosshairControls.start({
          x: [-180, 180],
          transition: { duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
        });
        goalieControls.start({
          x: [-80, 80],
          transition: { duration: 3.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }
        });
        puckControls.start({ x: 0, y: 0, scale: 1, rotate: 0 });
      } else {
        puckControls.start({ x: 0, y: 0, scale: 0.2, rotate: 0 }); 
        gloveControls.start({ x: "200%", y: "150%", rotate: 45, transition: { duration: 0 } }); 
        setGloveStatus('idle');
      }
    }
  }, [gameState, config.mode]);

  const handleScoreAction = async () => {
    if (stateRef.current.gameState !== 'idle') return;
    setGameState('action');
    crosshairControls.stop();
    goalieControls.stop();
    
    const isErrorless = config.difficulty === 'errorless';
    const currentTargetX = crosshairX.get();
    const currentGoalieX = goalieX.get();
    
    let isGoal = true;
    let isMissedNet = false;
    let finalGoalieX = currentGoalieX;
    
    if (Math.abs(currentTargetX) > 135) {
      isMissedNet = true;
      isGoal = false;
    } else if (isErrorless) {
      isGoal = true;
      finalGoalieX = currentTargetX > 0 ? -100 : 100;
    } else {
      isGoal = Math.abs(currentTargetX - currentGoalieX) > 50;
      if (!isGoal) finalGoalieX = currentTargetX;
    }

    goalieControls.start({ x: finalGoalieX, transition: { duration: 0.3 } });

    await stickControls.start({
      rotate: -45, x: -40, y: 20,
      transition: { duration: 0.15, ease: 'easeIn' }
    });

    playShootSound();

    stickControls.start({
      rotate: 0, x: 0, y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    });

    const wh = typeof window !== 'undefined' ? window.innerHeight : 800;
    const baseDistance = -(wh - 350);
    const distToGoalie = baseDistance;
    const distToNet = baseDistance - 140;
    const distToBoards = baseDistance - 190;

    if (isGoal) {
      // Shoot deep into the net and stay there
      await puckControls.start({
        y: distToNet, x: currentTargetX, scale: 0.12,
        transition: { duration: 0.35, ease: 'easeIn' }
      });
      handleSuccess("GOAL!");
    } else if (isMissedNet) {
      // Shoot past the net into the boards
      await puckControls.start({
        y: distToBoards, x: currentTargetX * 1.5, scale: 0.1,
        transition: { duration: 0.35, ease: 'easeIn' }
      });
      
      playMissSound();

      // Bounce off boards
      await puckControls.start({
        y: baseDistance + 60, x: currentTargetX > 0 ? 100 : -100, scale: 0.2,
        rotate: (Math.random() > 0.5 ? 1 : -1) * 720,
        transition: { duration: 0.5, ease: 'easeOut' }
      });
      handleFail("MISSED!");
    } else {
      // Hit the goalie
      await puckControls.start({
        y: distToGoalie, x: finalGoalieX, scale: 0.35, 
        transition: { duration: 0.25, ease: 'easeIn' }
      });
      
      playBlockSound();

      // Bounce off aggressively
      await puckControls.start({
        y: baseDistance + 310, x: finalGoalieX + (Math.random() > 0.5 ? 400 : -400), scale: 1.2,
        rotate: (Math.random() > 0.5 ? 1 : -1) * 720,
        transition: { duration: 0.5, ease: 'easeOut' }
      });
      handleFail("BLOCKED!");
    }
  };

  const startCountdown = () => {
    setGameState('countdown');
    setCountdownNum(3);
    setTimeout(() => {
      setCountdownNum(2);
      setTimeout(() => {
        setCountdownNum(1);
        setTimeout(() => {
          startDefendApproach();
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const startDefendApproach = async () => {
    setGameState('approaching');
    const targetX = (Math.random() - 0.5) * 500; // -250 to 250
    stateRef.current.targetX = targetX;

    await puckControls.set({ x: targetX * 0.05, y: "0vh", scale: 0.1 });
    
    playShootSound();

    gloveControls.start({
      x: ["200%", `${targetX * 0.4}px`],
      y: ["150%", "80%"],
      rotate: [45, targetX > 0 ? 30 : -10],
      transition: { duration: 1.2, ease: "easeOut" }
    });

    if (config.difficulty === 'errorless') {
      puckControls.start({
        x: targetX * 0.5,
        y: "55vh", 
        scale: 1.5,
        transition: { duration: 1.5, ease: 'linear' }
      }).then(() => {
         if (stateRef.current.gameState === 'approaching') {
           setGameState('paused_in_zone');
         }
      });
    } else {
      puckControls.start({
        x: targetX,
        y: "85vh",
        scale: 4,
        transition: { duration: 2, ease: 'linear' }
      }).then(() => {
         if (stateRef.current.gameState === 'approaching') {
           handleFail("OPPONENT SCORED!");
         }
      });
    }
  };

  const handleDefendAction = async () => {
    puckControls.stop();
    setGameState('action');
    
    let isSave = false;
    if (config.difficulty === 'errorless') {
      isSave = true;
    } else {
      if (puckRef.current && blockZoneRef.current) {
         const pRect = puckRef.current.getBoundingClientRect();
         const zRect = blockZoneRef.current.getBoundingClientRect();
         const pCenter = pRect.top + pRect.height / 2;
         const margin = 80;
         if (pCenter >= zRect.top - margin && pCenter <= zRect.bottom + margin) {
            isSave = true;
         }
      }
    }

    const tX = stateRef.current.targetX || 0;

    if (isSave) {
      // Swipe glove across to catch/block
      await gloveControls.start({
        x: [`${tX * 0.4}px`, `${tX}px`, "-150%"],
        y: ["80%", "40%", "150%"],
        rotate: [tX > 0 ? 30 : -10, 0, -45],
        scale: [1, 1.3, 1],
        transition: { duration: 0.6, times: [0, 0.4, 1], ease: "easeInOut" }
      });
      puckControls.start({
        y: "-20vh",
        x: tX > 0 ? 300 : -300,
        scale: 0.5,
        transition: { duration: 0.4, ease: "easeOut" }
      });
      setGloveStatus('save');
      handleSuccess("GREAT SAVE!");
    } else {
      // Missed shot: glove goes wrong way
      await gloveControls.start({
        x: [`${tX * 0.4}px`, `${tX * -0.6}px`],
        y: ["80%", "90%"],
        rotate: [tX > 0 ? 30 : -10, tX > 0 ? -20 : 45],
        transition: { duration: 0.3, ease: "easeIn" }
      });
      await puckControls.start({
        x: tX,
        y: "110vh",
        scale: 6,
        transition: { duration: 0.3, ease: 'easeIn' }
      });
      setGloveStatus('miss');
      handleFail("OPPONENT SCORED!");
    }
  };

  const handleSuccess = (msg: string) => {
    setGameState('result');
    setResultMessage(msg);
    setScore(s => s + 1);
    config.mode === 'score' ? playGoalSound() : playBlockSound();
    confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#FFFFFF', '#C0C0C0', '#B9975B', '#000000'] });
    setTimeout(() => setGameState('idle'), 3000);
  };

  const handleFail = (msg: string) => {
    setGameState('result');
    setResultMessage(msg);
    playBuzzer();
    setTimeout(() => setGameState('idle'), 3000);
  };

  const renderScoreMode = () => (
    <>
      <RinkBg />
      <div className="absolute top-0 w-full h-[25%] z-0 opacity-80 pointer-events-none">
        <CrowdSVG className="w-full h-full" isCheering={gameState === 'result' && resultMessage === 'GOAL!'} />
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
         <div className="relative mt-20">
           <div className="w-80 h-40 relative z-0">
             <NetSVG className="w-full h-full drop-shadow-2xl" />
           </div>
           <motion.div 
             className="absolute bottom-0 left-1/2 -ml-16 w-32 h-40 z-10 origin-bottom"
             animate={goalieControls}
             style={{ x: goalieX }}
           >
             <KnightHelmet className="w-full h-full drop-shadow-xl" isGoalie={true} />
           </motion.div>
           {gameState === 'idle' && (
             <motion.div 
               className="absolute top-10 left-1/2 -ml-12 w-24 h-24 border-8 border-red-500 rounded-full flex items-center justify-center z-20 shadow-[0_0_15px_rgba(239,68,68,0.8)] bg-red-500/10"
               animate={crosshairControls}
               style={{ x: crosshairX }}
             >
               <div className="w-4 h-4 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,1)]" />
               <div className="absolute w-full h-2 bg-red-500" />
               <div className="absolute h-full w-2 bg-red-500" />
             </motion.div>
           )}
         </div>

         <div className="flex-1 w-full relative">
           <motion.div 
             className="absolute left-1/2 bottom-20 -ml-10 w-20 h-16 z-30"
             animate={puckControls}
             initial={{ y: 0, x: 0 }}
           >
             <PuckSVG className="w-full h-full drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" />
           </motion.div>

           {config.mode === 'score' && (
             <motion.div
               className="absolute left-1/2 bottom-20 ml-2 w-24 h-48 z-40 origin-bottom-right"
               initial={{ rotate: 0 }}
               animate={stickControls}
             >
               <Stick75 className="w-full h-full drop-shadow-[0_15px_15px_rgba(0,0,0,0.4)]" />
             </motion.div>
           )}

           {gameState === 'idle' && (
             <motion.div 
               className="absolute bottom-40 w-full text-center z-40"
               animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }}
               transition={{ duration: 1.5, repeat: Infinity }}
             >
               <h2 className="text-4xl font-black text-amber-500 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] px-4 bg-slate-900/50 rounded-full inline-block py-2 border-2 border-amber-500/50">
                 PRESS SWITCH TO SHOOT!
               </h2>
             </motion.div>
           )}
         </div>
      </div>
    </>
  );

  const renderDefendMode = () => (
    <>
      <RinkBgGoalieView />
      <ViewportGoalNet />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none overflow-hidden">
         <div className="absolute top-[10%] left-1/2 -ml-12 w-24 h-24 z-0 opacity-90">
           <KnightHelmet className="w-full h-full drop-shadow-xl" isGoalie={false} />
           <Stick75 className="absolute -right-12 bottom-0 w-20 h-32 rotate-12" />
         </div>
         
         <motion.div 
            ref={puckRef}
            className="absolute left-1/2 top-[12%] -ml-10 mt-8 w-20 h-16 z-30 pointer-events-none"
            animate={puckControls}
         >
            <PuckSVG className="w-full h-full drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]" />
         </motion.div>

         {(gameState === 'approaching' || gameState === 'paused_in_zone' || gameState === 'action') && (
           <div 
             ref={blockZoneRef}
             className={`absolute bottom-32 left-0 w-full h-40 border-y-8 flex items-center justify-center z-20 transition-colors duration-300 ${
               gameState === 'paused_in_zone' 
                 ? 'border-yellow-300 bg-yellow-400/40 shadow-[0_0_40px_rgba(253,224,71,0.8)] animate-[pulse_0.4s_ease-in-out_infinite]' 
                 : 'border-emerald-500 bg-emerald-500/20 animate-pulse'
             }`}
           >
             <h2 className={`font-black text-6xl md:text-8xl tracking-widest uppercase opacity-80 ${
               gameState === 'paused_in_zone' ? 'text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]' : 'text-emerald-300'
             }`}>
               BLOCK ZONE
             </h2>
           </div>
         )}

         <motion.div
           className="absolute bottom-10 left-1/2 w-64 h-64 z-40 origin-bottom"
           animate={gloveControls}
           initial={{ x: "200%", y: "150%", rotate: 45 }}
           style={{ marginLeft: '-128px' }}
         >
           <GoalieGlove className="w-full h-full drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]" status={gloveStatus} />
         </motion.div>

         {gameState === 'idle' && (
             <motion.div 
               className="absolute bottom-40 w-full text-center z-40"
               animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }}
               transition={{ duration: 1, repeat: Infinity }}
             >
               <h2 className="text-4xl font-black text-amber-500 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] px-4 bg-slate-900/50 rounded-full inline-block py-2 border-2 border-amber-500/50">
                 PRESS SWITCH TO START!
               </h2>
             </motion.div>
         )}

         {gameState === 'paused_in_zone' && (
             <motion.div 
               className="absolute bottom-12 w-full text-center z-50"
               animate={{ scale: [0.9, 1.1, 0.9] }}
               transition={{ duration: 0.8, repeat: Infinity }}
             >
               <h2 className="text-5xl md:text-7xl font-black text-amber-400 drop-shadow-[0_0_20px_rgba(0,0,0,1)] px-6 bg-slate-900/90 rounded-full inline-block py-3 border-4 border-amber-400">
                 PRESS TO BLOCK!
               </h2>
             </motion.div>
         )}
      </div>
    </>
  );

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-slate-900 select-none cursor-pointer"
      onPointerDown={handleSwitchPress}
    >
      {config.mode === 'score' ? renderScoreMode() : renderDefendMode()}

      {/* Header & Score Overlay */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
        <button 
          onClick={(e) => { e.stopPropagation(); onOpenSettings(); }}
          className="p-3 bg-slate-800 text-slate-300 rounded-full hover:bg-slate-700 shadow-lg border border-slate-600 pointer-events-auto"
        >
          <SettingsIcon size={24} />
        </button>

        <div className="bg-slate-900 text-amber-500 font-black text-4xl px-8 py-3 rounded-2xl shadow-[0_0_20px_rgba(185,151,91,0.3)] border border-amber-900/50 backdrop-blur-sm">
          SCORE: {score}
        </div>
        
        <div className="w-12" /> 
      </div>

      {gameState === 'countdown' && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <motion.h1 
            key={countdownNum}
            initial={{ scale: 3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.5 }}
            className="text-[12rem] font-black text-amber-500 italic drop-shadow-[0_0_40px_rgba(0,0,0,0.8)]"
            style={{ WebkitTextStroke: '6px #000' }}
          >
            {countdownNum}
          </motion.h1>
        </div>
      )}

      {gameState === 'result' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <h1 className="text-7xl md:text-9xl font-black text-white italic tracking-tighter drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
              style={{ WebkitTextStroke: '4px #000' }}>
            {resultMessage}
          </h1>
        </motion.div>
      )}
    </div>
  );
}
