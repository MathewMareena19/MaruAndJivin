/**
 * @author Basil Sajeev <basilsajeevthevarmadam@gmail.com>
 */
(function ($) {
  "use strict";

  // ── Android touch-scroll fix ──────────────────────────────────────────────
  // tsParticles injects a <canvas> that is position:fixed and covers the full
  // viewport. On Android Chrome it intercepts every single-finger touchmove,
  // making the page unscrollable after the overlay closes.
  // Fix:
  //   1. Set interactivity.events to all false so the library itself skips
  //      registering its own touch/pointer listeners on the canvas.
  //   2. In the .then() callback, force pointer-events:none + touch-action:pan-y
  //      via inline styles as a belt-and-suspenders guarantee.
  // iOS Safari is lenient about touch capture; Android enforces it strictly.
  // ─────────────────────────────────────────────────────────────────────────
  tsParticles.load("sakura-container", {
    particles: {
      number: {
        value: 0  // start with 0, let only emitter control spawning
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
        speed: 1,
        direction: "bottom",
        drift: 0,
        gravity: { enable: false },
        outModes: { default: "out" }
      },
      wobble: { enable: false },
      rotate: {
        value: { min: 0, max: 360 },
        animation: {
          enable: true,
          speed: 2,
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
    },
    // Tell tsParticles not to attach any hover/click/touch listeners at all.
    // This is the primary fix — without this the library registers passive
    // touchmove handlers on the canvas that eat Android scroll gestures.
    interactivity: {
      detectsOn: "window",
      events: {
        onClick: { enable: false },
        onHover: { enable: false },
        resize:  { enable: true  }
      }
    }
  }).then(function (container) {
    // Belt-and-suspenders: after the canvas is injected, force these via
    // inline style so no external CSS specificity war can override them.
    var canvas = document.querySelector("#sakura-container canvas");
    if (canvas) {
      canvas.style.pointerEvents = "none";
      canvas.style.touchAction   = "pan-y";
    }
  });

})(jQuery);


$(document).on("click", function () {
  console.log("playing song");
});

// ── Countdown timer ──────────────────────────────────────────────────────────
var countDownDate = new Date("APR 19, 2026 05:30:00").getTime();

var x = setInterval(function () {
  var now      = new Date().getTime();
  var distance = countDownDate - now;

  var days    = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  document.getElementById("time").innerHTML =
    "<div class='title'><p class=\"time-med\">" +
    days + " Days " + hours + " Hours " + minutes + " Minutes" +
    "</p></div>";

  if (distance < 0) {
    clearInterval(x);
    document.getElementById("time").innerHTML = "Bless the couple for happy life!";
  }
}, 1000);


// ── Overlay — unified controller ─────────────────────────────────────────────
// Previous bug: scroll was locked on BOTH html and body by two different code
// paths, but unlocked only partially on close. Android Chrome strictly enforces
// overflow:hidden on body; iOS Safari is lenient. Fix: one place locks both,
// one place unlocks both. No other code touches overflow.
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  var overlay   = document.getElementById("overlay");
  var closeBtns = overlay.querySelectorAll(".close-overlay");
  var audio     = document.getElementById("my_audio");

  function lockScroll() {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow            = "hidden";
    // Also block touchmove on the document so the background can't be
    // scrolled by a stray finger while the overlay is open.
    document.addEventListener("touchmove", preventTouch, { passive: false });
  }

  function unlockScroll() {
    document.documentElement.style.overflow = "";
    document.body.style.overflow            = "";
    document.removeEventListener("touchmove", preventTouch);
  }

  function preventTouch(e) {
    // Allow scrolling inside the overlay card itself, block everywhere else.
    if (!overlay.contains(e.target)) {
      e.preventDefault();
    }
  }

  function openOverlay() {
    lockScroll();
    overlay.classList.remove("is-hidden");
  }

  function closeOverlay() {
    overlay.classList.add("is-hidden");
    unlockScroll();
    if (audio) {
      audio.play().catch(function () { /* autoplay blocked — ignore */ });
    }
  }

  // Button(s) inside the overlay
  closeBtns.forEach(function (btn) {
    btn.addEventListener("click", closeOverlay);
  });

  // Tap the dark backdrop to close
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeOverlay();
  });

  // Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeOverlay();
  });

  // Auto-open on load
  window.addEventListener("load", function () {
    openOverlay();
  });
})();
