// Sparkle particle effect generator matching the approved designs

export const triggerSparkles = (
  x: number,
  y: number,
  theme: 'dashboard' | 'oopsie' | 'good_things' | 'plans' | 'tapper' = 'dashboard'
) => {
  if (typeof window === 'undefined') return;
  
  // Respect user preference for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const colors = ['#FFD54F', '#F8BBD0', '#E1BEE7', '#795465', '#6c586d', '#864e5a', '#fbb3c1'];
  
  if (theme === 'dashboard' || theme === 'tapper') {
    const icons = theme === 'tapper' 
      ? ['favorite', 'auto_awesome', 'star', 'flare', 'favorite_border', 'draw']
      : ['auto_awesome'];
      
    const count = theme === 'tapper' ? 8 : 8;
    
    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('span');
      sparkle.className = 'material-symbols-outlined sparkle-effect text-xl';
      sparkle.innerText = icons[Math.floor(Math.random() * icons.length)];
      
      const color = colors[Math.floor(Math.random() * colors.length)];
      sparkle.style.color = color;
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      
      if (sparkle.innerText === 'favorite') {
        sparkle.style.fontVariationSettings = "'FILL' 1";
      } else {
        sparkle.style.fontVariationSettings = "'wght' 300";
      }
      
      const destX = (Math.random() - 0.5) * 200;
      const destY = (Math.random() - 0.5) * 200;
      
      sparkle.style.setProperty('--dest-x', `${destX}px`);
      sparkle.style.setProperty('--dest-y', `${destY}px`);
      
      document.body.appendChild(sparkle);
      
      setTimeout(() => sparkle.remove(), 1500);
    }
  } 
  
  else if (theme === 'oopsie') {
    for (let i = 0; i < 8; i++) {
      const sparkle = document.createElement('span');
      sparkle.className = 'material-symbols-outlined sparkle text-primary';
      sparkle.innerText = i % 2 === 0 ? 'flare' : 'favorite';
      sparkle.style.left = `${x + (Math.random() - 0.5) * 80}px`;
      sparkle.style.top = `${y + (Math.random() - 0.5) * 80}px`;
      sparkle.style.fontSize = `${14 + Math.random() * 14}px`;
      
      if (sparkle.innerText === 'favorite') {
        sparkle.style.fontVariationSettings = "'FILL' 1";
      }
      
      const destX = (Math.random() - 0.5) * 100;
      const destY = (Math.random() - 0.5) * 100;
      sparkle.style.setProperty('--dest-x', `${destX}px`);
      sparkle.style.setProperty('--dest-y', `${destY}px`);
      
      document.body.appendChild(sparkle);
      
      setTimeout(() => sparkle.remove(), 800);
    }
  } 
  
  else if (theme === 'good_things') {
    const icons = ['sparkles', 'star', 'favorite'];
    for (let i = 0; i < 6; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle font-normal';
      sparkle.innerText = icons[Math.floor(Math.random() * icons.length)];
      sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];
      sparkle.style.fontSize = `${Math.random() * 24 + 16}px`;
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      
      if (sparkle.innerText === 'favorite') {
        sparkle.style.fontVariationSettings = "'FILL' 1";
      }
      
      const destX = (Math.random() - 0.5) * 150;
      const destY = (Math.random() - 0.5) * 150;
      sparkle.style.setProperty('--dest-x', `${destX}px`);
      sparkle.style.setProperty('--dest-y', `${destY}px`);
      
      document.body.appendChild(sparkle);
      
      setTimeout(() => sparkle.remove(), 800);
    }
  } 
  
  else if (theme === 'plans') {
    const iconList = ['star', 'favorite', 'cloud', 'sunny'];
    for (let i = 0; i < 8; i++) {
      const sparkle = document.createElement('span');
      sparkle.className = 'material-symbols-outlined absolute pointer-events-none transition-all duration-700 opacity-0';
      sparkle.innerText = iconList[Math.floor(Math.random() * iconList.length)];
      sparkle.style.color = '#795465';
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.fontSize = `${12 + Math.random() * 20}px`;
      
      document.body.appendChild(sparkle);
      
      // Force repaint
      sparkle.getBoundingClientRect();
      
      const destX = (Math.random() - 0.5) * 150;
      const destY = (Math.random() - 0.5) * 150;
      const rotate = Math.random() * 360;
      
      sparkle.style.transform = `translate(${destX}px, ${destY}px) rotate(${rotate}deg)`;
      sparkle.style.opacity = '0.6';
      sparkle.style.transition = 'transform 0.8s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.8s';
      
      setTimeout(() => sparkle.remove(), 800);
    }
  }
};
