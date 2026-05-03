/**
 * EFACTICOM — Arranque: UI + animaciones.
 */
(function () {
  "use strict";

  function boot() {
    if (window.EFACTICOM_UI) {
      window.EFACTICOM_UI.init();
    }
    if (window.EFACTICOM_ANIM) {
      window.EFACTICOM_ANIM.init();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
