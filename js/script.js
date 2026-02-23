/**
 * @author Basil Sajeev <basilsajeevthevarmadam@gmail.com>
 */
(function ($) {
  "use strict";

  tsParticles.load("sakura-container", {
    particles: {
      number: { value: 0 },
      color: { value: ["#256fc485", "#2b77ce96", "#0771ebc7", "#14467e9f"] },
      shape: {
        type: "image",
        options: { image: { src: "./assets/img/leaf.svg", width: 64, height: 64 } }
      },
      opacity: {
        value: { min: 0.4, max: 0.9 },
        animation: { enable: true, speed: 0.5, sync: false }
      },
      size: { value: { min: 10, max: 30 } },
      move: {
        enable: true, speed: 1, direction: "bottom", drift: 0,
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
    interactivity: {
      detectsOn: "window",
      events: {
        onClick: { enable: false },
        onHover: { enable: false },
        resize:  { enable: true }
      }
    }
  }).then(function () {
    var canvas = document.querySelector("#sakura-container canvas");
    if (canvas) {
      canvas.style.pointerEvents = "none";
      canvas.style.touchAction   = "pan-y";
    }
  });

})(jQuery);


// Countdown timer
var countDownDate = new Date("APR 19, 2026 05:30:00").getTime();
var countdownInterval = setInterval(function () {
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
    clearInterval(countdownInterval);
    document.getElementById("time").innerHTML = "Bless the couple for happy life!";
  }
}, 1000);


// ── Overlay controller ────────────────────────────────────────────────────────
// NO overflow/scroll manipulation in JS at all.
// The overlay uses display:none (via .is-hidden) to hide — this fully removes
// it from Android's touch event tree. visibility:hidden does NOT do this on
// Android Chrome; it can still intercept touches on a position:fixed full-
// screen element. display:none is the only reliable cross-platform fix.
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  var overlay   = document.getElementById("overlay");
  var closeBtns = overlay.querySelectorAll(".close-overlay");
  var audio     = document.getElementById("my_audio");

  function openOverlay() {
    overlay.classList.remove("is-hidden");
  }

  function closeOverlay() {
    overlay.classList.add("is-hidden");
    if (audio) {
      audio.play().catch(function () { /* autoplay blocked — ignore */ });
    }
  }

  closeBtns.forEach(function (btn) {
    btn.addEventListener("click", closeOverlay);
  });

  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeOverlay();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeOverlay();
  });

  // Show on load
  window.addEventListener("load", function () {
    openOverlay();
  });
})();
