/**
 * @author Basil Sajeev <basilsajeevthevarmadam@gmail.com>
 */
(function ($) {
    "use strict";
      tsParticles.load("sakura-container", {
  particles: {
    number: {
      value: 0           // FIX 1: start with 0, let only emitter control spawning
    },
    color: {
      value: ["#256fc485", "#2b77ce96", "#0771ebc7", "#14467e9f"]  
    },
    shape: {
    type: "image",
    options: {
        image: {
        src: "./assets/img/leaf.svg",
        width: 64,
        height: 64
        }
    }
    },
    opacity: {
      value: { min: 0.4, max: 0.9 },
      animation: {
        enable: true,
        speed: 0.5,
        sync: false
      }
    },
    size: {
      value: { min: 10, max: 30 }
    },
    move: {
        enable: true,
        speed: 1,          // slow steady speed
        direction: "bottom",
        drift: 0,            // remove sideways acceleration
        gravity: {
    enable: false
  },
  outModes: {
    default: "out"
  }
    },
    wobble: {
    enable: false        // remove wobble acceleration effect
    },
    rotate: {
    value: { min: 0, max: 360 },
    animation: {
        enable: true,
        speed: 2,        // very slow rotation
        sync: false
    }
    }
    },
    tilt: {
    enable: true,
    value: { min: 0, max: 30 },
    animation: {
        enable: true,
        speed: 1.5,
        sync: false
    }
    },
  emitters: {
    position: { x: 50, y: -10 },
    rate: {
      quantity: 1,
      delay: 1.1
    }
  }
});
})(jQuery);


$(document).on('click', function(){
    console.log('playing song');
});

// Set the date we're counting down to
var countDownDate = new Date("APR 19, 2026 05:30:00").getTime();

// Update the count down every 1 second
var x = setInterval(function() {

    // Get todays date and time
    var now = new Date().getTime();
    
    // Find the distance between now and the count down date
    var distance = countDownDate - now;
    
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Output the result in an element with id="demo"
    document.getElementById("time").innerHTML = "<div class='title'><p class=\"time-med\">"+days + " Days " + hours + " Hours " + minutes + " Minutes  </p></div>"
     
    // If the count down is over, write some text 
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("time").innerHTML = "Bless the couple for happy life!";
    }
}, 1000);

// being a bit cool :p  
var styles = [
    'background: linear-gradient(#D33106, #571402)'
    , 'border: 4px solid #3E0E02'
    , 'color: white'
    , 'display: block'
    , 'text-shadow: 0 2px 0 rgba(0, 0, 0, 0.3)'
    , 'box-shadow: 0 2px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset'
    , 'line-height: 40px'
    , 'text-align: center'
    , 'font-weight: bold'
    , 'font-size: 32px'
].join(';');

var styles1 = [
    'color: #FF6C37'
    , 'display: block'
    , 'text-shadow: 0 2px 0 rgba(0, 0, 0, 1)'
    , 'line-height: 40px'
    , 'font-weight: bold'
    , 'font-size: 32px'
].join(';');

var styles2 = [
    'color: teal'
    , 'display: block'
    , 'text-shadow: 0 2px 0 rgba(0, 0, 0, 1)'
    , 'line-height: 40px'
    , 'font-weight: bold'
    , 'font-size: 32px'
].join(';');


// ─── Unified Overlay Logic ────────────────────────────────────────────────────
// Root cause of Android scroll bug:
//   • document.body.style.overflow = 'hidden'  was set globally on page load
//   • One click handler reset document.body.style.overflow = 'auto'
//   • But the IIFE only cleared document.documentElement.style.overflow
//   • Android Chrome enforces body overflow strictly; iOS Safari is more lenient
// Fix: lock/unlock scroll ONLY on <html> (documentElement) in one unified place.
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  const overlay   = document.getElementById('overlay');
  const closeBtns = overlay.querySelectorAll('.close-overlay');

  /* ── Lock scroll: target both html and body to cover all Android browsers ── */
  function lockScroll() {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow             = 'hidden';
  }

  /* ── Unlock scroll: clear both so Android Chrome fully restores scrolling ── */
  function unlockScroll() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow             = '';
  }

  function openOverlay() {
    lockScroll();
    overlay.classList.remove('is-hidden');
  }

  function closeOverlay() {
    overlay.classList.add('is-hidden');
    unlockScroll();
    // Play audio when the invitation is opened
    var audio = document.getElementById('my_audio');
    if (audio) {
      audio.play().catch(function () {
        // Autoplay may be blocked; ignore silently
      });
    }
  }

  // Close on button click
  closeBtns.forEach(function (btn) {
    btn.addEventListener('click', closeOverlay);
  });

  // Close on backdrop click
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeOverlay();
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeOverlay();
  });

  // Auto-open on page load
  window.addEventListener('load', function () {
    openOverlay();
  });
})();
