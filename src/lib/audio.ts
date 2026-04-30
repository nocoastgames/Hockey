export const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

export function playShootSound() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
  
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.2);
}

export function playGoalSound() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const freqs = [523.25, 659.25, 783.99, 1046.50]; // C E G C
  freqs.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.frequency.value = freq;
    
    const startTime = audioCtx.currentTime + i * 0.1;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
    
    osc.start(startTime);
    osc.stop(startTime + 0.4);
  });
  
  // Add a horn (siren)
  const horn = audioCtx.createOscillator();
  const hornGain = audioCtx.createGain();
  horn.type = 'sawtooth';
  horn.connect(hornGain);
  hornGain.connect(audioCtx.destination);
  
  horn.frequency.setValueAtTime(200, audioCtx.currentTime);
  horn.frequency.linearRampToValueAtTime(190, audioCtx.currentTime + 1);
  
  hornGain.gain.setValueAtTime(0, audioCtx.currentTime);
  hornGain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.1);
  hornGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
  
  horn.start(audioCtx.currentTime);
  horn.stop(audioCtx.currentTime + 1.5);
}

export function playBlockSound() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.frequency.setValueAtTime(100, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.2);
  
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
  
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.3);
}

export function playBuzzer() {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.4, audioCtx.currentTime + 0.5);
  gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
  
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.6);
}
