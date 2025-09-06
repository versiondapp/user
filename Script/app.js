const connectWalletBtn = document.getElementById('connectWallet');

connectWalletBtn.addEventListener('click', () => {
  window.location.href = 'login.html';
});


function animateCounter(id, target, duration = 1200) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = 0;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(progress * (target - start) + start);
    el.textContent = value.toLocaleString();
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString();
    }
  }
  requestAnimationFrame(update);
}

document.addEventListener('DOMContentLoaded', () => {

  animateCounter('counter-websockets', 5827611);
  
  const appsEl = document.getElementById('counter-apps');
  if (appsEl) appsEl.textContent = '728+';
  animateCounter('counter-active-websockets', 3729838);
  animateCounter('counter-messages', 31614);
  animateCounter('counter-wallets', 26821);

  function fluctuate(id, base, range, interval) {
    setInterval(() => {
      const fluct = Math.floor((Math.random() - 0.5) * 2 * range);
      const value = base + fluct;
      const el = document.getElementById(id);
      if (el) el.textContent = value.toLocaleString();
    }, interval);
  }
  fluctuate('counter-active-websockets', 3729838, 162, 1700);
  fluctuate('counter-messages', 31614, 162, 2300);
  fluctuate('counter-wallets', 26821, 117, 2800);

  const navigationElements = document.querySelectorAll('.cta-btn, .case-item-container, .soc');
  navigationElements.forEach(element => {
    element.addEventListener('click', function(e) {
      e.preventDefault();
      window.location.href = 'login.html';
    });
    
    if (element.classList.contains('case-item-container')) {
      element.style.cursor = 'pointer';
      element.style.transition = 'transform 0.2s ease';
      
      element.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
      });
      
      element.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
      });
    }
  });
}); 

document.addEventListener('DOMContentLoaded', () => {
  const heroHeading = document.querySelector('.hero-card h1');
  const heroCard = document.querySelector('.hero-card');

  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  function handleScroll() {
    if (isInViewport(heroCard) && !heroHeading.classList.contains('visible')) {
      heroHeading.classList.add('visible');
    }
  }

  window.addEventListener('scroll', handleScroll);

  handleScroll();
});




