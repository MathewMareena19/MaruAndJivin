/**
 * @author Basil Sajeev <basilsajeevthevarmadam@gmail.com>
 */
(function ($) {
  "use strict";

  tsParticles.load("sakura-container", {
    particles: {
      number: { value: 0 },
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
        animation: { enable: true, speed: 0.5, sync: false }
      },
      size: { value: { min: 10, max: 30 } },
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
        animation: { enable: true, speed: 2, sync: false }
      }
    },
    tilt: {
      enable: true,
      value: { min: 0, max: 30 },
      animation: { enable: true, speed: 1.5, sync: false }
    },
    emitters: {
      position: { x: 50, y: -10 },
      rate: { quantity: 1, delay: 1.1 }
    },
    // Disable all interactivity so tsParticles never registers
    // touch/pointer listeners on its canvas (Android scroll fix)
    interactivity: {
      detectsOn: "window",
      events: {
        onClick: { enable: false },
        onHover: { enable: false },
        resize:  { enable: true  }
      }
    }
  }).then(function () {
    // After canvas is injected, strip pointer-events so it can never
    // intercept touches on Android Chrome
    var canvas = document.querySelector("#sakura-container canvas");
    if (canvas) {
      canvas.style.pointerEvents = "none";
      canvas.style.touchAction   = "pan-y";
    }
  });

})(jQuery);


// Countdown timer
var countDownDate = new Date("APR 19, 2026 05:30:00").getTime();
var x = setInterval(function () {
  var now      = new Date().getTime();
  var distance = countDownDate - now;
  var days     = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours    = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes  = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  document.getElementById("time").innerHTML =
    "<div class='title'><p class=\"time-med\">" +
    days + " Days " + hours + " Hours " + minutes + " Minutes" +
    "</p></div>";

  if (distance < 0) {
    clearInterval(x);
    document.getElementById("time").innerHTML = "Bless the couple for happy life!";
  }
}, 1000);


// ── Overlay — single unified controller ──────────────────────────────────────
//
// ANDROID SCROLL BUG — root cause analysis:
//
//   1. index.html had:  user-scalable=no  in the viewport meta tag.
//      On Android Chrome this disables the browser's native touch-scroll
//      handling for the ENTIRE page. iOS ignores this flag (Apple removed
//      it in iOS 10 for accessibility), which is why iOS worked but Android
//      didn't. → FIXED IN index.html (removed user-scalable=no).
//
//   2. The old script had THREE separate, conflicting scroll-lock handlers:
//      a) document.body.style.overflow = 'hidden'  (set immediately, globally)
//      b) closeOverlayBtn click → document.body.style.overflow = 'auto'
//      c) IIFE closeOverlay()  → document.documentElement.style.overflow = ''
//      On close, (b) and (c) each unlocked only one of the two elements,
//      leaving the other still locked. Android enforces this strictly.
//      → FIXED BELOW: one lockScroll(), one unlockScroll(), both elements.
//
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("overlay");
  const closeBtns = overlay.querySelectorAll(".close-overlay");
  const audio = document.getElementById("my_audio");

  // ---- scroll lock helpers (ANDROID-SAFE) ----
  function lockScroll() {
    // lock BOTH html and body to avoid Android half-locked state
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }

  function unlockScroll() {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  function openOverlay() {
    lockScroll();
    overlay.classList.remove("is-hidden"); // visible
  }

  function closeOverlay() {
    overlay.classList.add("is-hidden"); // hidden (pointer-events: none via CSS)
    unlockScroll();

    // play audio on user gesture (safe)
    try { audio && audio.play(); } catch (e) {}
  }

  // Open on load
  openOverlay();

  // Close actions
  closeBtns.forEach((btn) => btn.addEventListener("click", closeOverlay));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeOverlay();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeOverlay();
  });
});
