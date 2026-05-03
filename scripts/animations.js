/**
 * EFACTICOM — Animaciones GSAP (sutiles, con respeto a prefers-reduced-motion).
 */
(function () {
  "use strict";

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function init() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion()) {
      return;
    }

    var sections = document.querySelectorAll(".doc-page:not(.doc-page--cover)");
    sections.forEach(function (sec) {
      var heads = sec.querySelectorAll(".section-header, .section-title, .section-kicker");
      if (!heads.length) return;
      gsap.from(heads, {
        scrollTrigger: { trigger: sec, start: "top 88%", toggleActions: "play none none none" },
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.08,
      });
    });

    var diagramHost = document.querySelector("[data-cluster-diagram]");
    var diagramImg = diagramHost && diagramHost.querySelector("img");
    if (diagramImg) {
      gsap.from(diagramImg, {
        scrollTrigger: { trigger: "[data-cluster-diagram]", start: "top 80%" },
        scale: 0.97,
        opacity: 0,
        duration: 0.55,
        ease: "power2.out",
      });
    } else {
      gsap.utils.toArray("[data-cluster-node]").forEach(function (node, i) {
        gsap.from(node, {
          scrollTrigger: { trigger: "[data-cluster-diagram]", start: "top 80%" },
          scale: 0.92,
          opacity: 0,
          duration: 0.5,
          delay: i * 0.06,
          ease: "power2.out",
        });
      });
    }

    gsap.utils.toArray("[data-cluster-edge]").forEach(function (edge) {
      var len = typeof edge.getTotalLength === "function" ? edge.getTotalLength() : 200;
      if (!len || len < 2) {
        return;
      }
      edge.style.strokeDasharray = String(len);
      edge.style.strokeDashoffset = String(len);
      gsap.to(edge, {
        scrollTrigger: { trigger: "[data-cluster-diagram]", start: "top 75%" },
        strokeDashoffset: 0,
        duration: 1.2,
        ease: "power1.inOut",
      });
    });

    gsap.utils.toArray("[data-timeline-card]").forEach(function (card, i) {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: "top 90%" },
        y: 28,
        opacity: 0,
        duration: 0.55,
        delay: i * 0.05,
        ease: "power2.out",
      });
    });

    gsap.utils.toArray(".report-dash, .dashboard-section").forEach(function (el, i) {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 92%" },
        y: 20,
        opacity: 0,
        duration: 0.5,
        delay: (i % 6) * 0.04,
        ease: "power2.out",
      });
    });

    gsap.utils.toArray(".benefits-list li").forEach(function (li, i) {
      gsap.from(li, {
        scrollTrigger: { trigger: li, start: "top 95%" },
        x: -12,
        opacity: 0,
        duration: 0.45,
        delay: i * 0.05,
        ease: "power2.out",
      });
    });
  }

  window.EFACTICOM_ANIM = {
    init: init,
  };
})();
