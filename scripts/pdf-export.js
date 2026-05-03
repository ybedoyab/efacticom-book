/**
 * EFACTICOM — Exportación a PDF vía motor del navegador (misma vista que en pantalla).
 * - Espera a que las imágenes del documento estén cargadas (evita huecos por lazy-load).
 * - Antes de imprimir: quita animaciones GSAP sobre <img> (suelen dejar opacity:0 hasta hacer scroll).
 * Los PDF generados por Chromium/Opera/Edge suelen conservar enlaces <a href="#..."> internos.
 */
(function () {
  "use strict";
  var PRINT_WAIT_TIMEOUT_MS = 8000;
  var exportInProgress = false;

  var KILL_SELECTORS = [
    "main img",
    ".doc-page .section-header",
    ".doc-page .section-title",
    ".doc-page .section-kicker",
    "[data-cluster-node]",
    "[data-cluster-edge]",
    "[data-timeline-card]",
    ".report-dash",
    ".dashboard-section",
    ".benefits-list li",
  ];

  function prepareImagesForPrint() {
    var imgs = document.querySelectorAll("main img");
    var originalAttrs = [];
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      originalAttrs.push({
        node: img,
        loading: img.getAttribute("loading"),
        fetchpriority: img.getAttribute("fetchpriority"),
      });
      img.setAttribute("loading", "eager");
      if (!img.getAttribute("fetchpriority")) {
        img.setAttribute("fetchpriority", "high");
      }
      img.setAttribute("decoding", "async");
    }
    return originalAttrs;
  }

  function restoreImagesAfterPrint(originalAttrs) {
    if (!originalAttrs || !originalAttrs.length) return;
    for (var i = 0; i < originalAttrs.length; i++) {
      var entry = originalAttrs[i];
      if (!entry || !entry.node) continue;
      if (entry.loading === null) entry.node.removeAttribute("loading");
      else entry.node.setAttribute("loading", entry.loading);
      if (entry.fetchpriority === null) entry.node.removeAttribute("fetchpriority");
      else entry.node.setAttribute("fetchpriority", entry.fetchpriority);
    }
  }

  function waitForImages(timeoutMs) {
    var waitLimit = typeof timeoutMs === "number" ? timeoutMs : PRINT_WAIT_TIMEOUT_MS;
    var start = Date.now();
    var imgs = document.querySelectorAll("main img");
    var pending = [];
    function elapsed() {
      return Date.now() - start;
    }
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      var src = img.getAttribute("src");
      if (!src || !String(src).trim()) continue;
      if (img.complete && img.naturalWidth > 0) continue;
      pending.push(
        new Promise(function (resolve) {
          if (typeof img.decode === "function") {
            Promise.resolve(img.decode())
              .catch(function () {
                /* ignore */
              })
              .finally(resolve);
            return;
          }
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        })
      );
    }
    if (!pending.length) return Promise.resolve();
    return Promise.race([
      Promise.all(pending),
      new Promise(function (resolve) {
        setTimeout(resolve, Math.max(0, waitLimit - elapsed()));
      }),
    ]);
  }

  function prepareForPrint() {
    if (typeof gsap !== "undefined") {
      for (var k = 0; k < KILL_SELECTORS.length; k++) {
        try {
          gsap.killTweensOf(KILL_SELECTORS[k]);
        } catch (e) {
          /* ignore */
        }
      }
    }
    var imgs = document.querySelectorAll("main img");
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].style.setProperty("opacity", "1", "important");
      imgs[i].style.setProperty("transform", "none", "important");
      imgs[i].style.setProperty("visibility", "visible", "important");
    }
    var animated = document.querySelectorAll(
      ".doc-page .section-header, .doc-page .section-title, .doc-page .section-kicker, [data-cluster-node], [data-timeline-card], .report-dash, .dashboard-section, .benefits-list li"
    );
    for (var j = 0; j < animated.length; j++) {
      animated[j].style.setProperty("opacity", "1", "important");
      animated[j].style.setProperty("transform", "none", "important");
      animated[j].style.setProperty("visibility", "visible", "important");
    }
    var edges = document.querySelectorAll("[data-cluster-edge]");
    for (var e = 0; e < edges.length; e++) {
      var edge = edges[e];
      edge.style.strokeDashoffset = "0";
    }
  }

  function cleanupAfterPrint() {
    var imgs = document.querySelectorAll("main img");
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].style.removeProperty("opacity");
      imgs[i].style.removeProperty("transform");
      imgs[i].style.removeProperty("visibility");
    }
    var animated = document.querySelectorAll(
      ".doc-page .section-header, .doc-page .section-title, .doc-page .section-kicker, [data-cluster-node], [data-timeline-card], .report-dash, .dashboard-section, .benefits-list li"
    );
    for (var j = 0; j < animated.length; j++) {
      animated[j].style.removeProperty("opacity");
      animated[j].style.removeProperty("transform");
      animated[j].style.removeProperty("visibility");
    }
    var edges = document.querySelectorAll("[data-cluster-edge]");
    for (var e = 0; e < edges.length; e++) {
      edges[e].style.removeProperty("strokeDashoffset");
    }
    if (typeof ScrollTrigger !== "undefined") {
      try {
        ScrollTrigger.refresh();
      } catch (err) {
        /* ignore */
      }
    }
  }

  window.addEventListener("beforeprint", prepareForPrint);
  window.addEventListener("afterprint", cleanupAfterPrint);

  function exportPdf() {
    if (exportInProgress) return;
    exportInProgress = true;
    var originalAttrs = prepareImagesForPrint();
    waitForImages(PRINT_WAIT_TIMEOUT_MS).then(function () {
      prepareForPrint();
      requestAnimationFrame(function () {
        window.print();
        setTimeout(function () {
          restoreImagesAfterPrint(originalAttrs);
          exportInProgress = false;
        }, 500);
      });
    });
  }

  window.EFACTICOM_PDF = {
    exportPdf: exportPdf,
    waitForImages: waitForImages,
  };
})();
