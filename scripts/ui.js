/**
 * EFACTICOM — Renderizado UI, plantillas y componentes reutilizables.
 */
(function () {
  "use strict";

  var DATA = function () {
    return window.EFACTICOM_DATA;
  };

  function escapeHtml(text) {
    var map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return String(text).replace(/[&<>"']/g, function (m) {
      return map[m];
    });
  }

  /** Enlace de navegación: ancla en index, o ../index.html# desde /pages/. */
  function docNavHref(item) {
    var nested = document.body.getAttribute("data-doc-base") === "nested";
    var h = item.hash || "#";
    if (nested) return "../index.html" + h;
    return h;
  }

  /** Prefijo para assets (logos) en subcarpeta pages/. */
  function assetPath(rel) {
    if (document.body.getAttribute("data-doc-base") === "nested") {
      return "../" + rel;
    }
    return rel;
  }

  /** URL absoluta (p. ej. enlaces LinkedIn en datos). */
  function absoluteHttpUrl(url) {
    var s = String(url || "").trim();
    if (!s) return "";
    if (/^https?:\/\//i.test(s)) return s;
    return "https://" + s.replace(/^\/+/, "");
  }

  function qs(root, sel) {
    return (root || document).querySelector(sel);
  }

  function qsa(root, sel) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  var readingModeEventsBound = false;

  function readingModePreventDefault(e) {
    e.preventDefault();
  }

  /**
   * Barreras suaves en pantalla (no afecta exportar PDF desde el botón).
   * @param {boolean} on
   */
  function setReadingModeEnabled(on) {
    var root = document.documentElement;
    var body = document.body;
    if (on) {
      root.classList.add("efacticom--reading-mode");
      body.classList.add("efacticom--reading-mode");
      if (!readingModeEventsBound) {
        document.addEventListener("contextmenu", readingModePreventDefault, true);
        document.addEventListener("copy", readingModePreventDefault, true);
        document.addEventListener("cut", readingModePreventDefault, true);
        document.addEventListener("dragstart", readingModePreventDefault, true);
        readingModeEventsBound = true;
      }
    } else {
      root.classList.remove("efacticom--reading-mode");
      body.classList.remove("efacticom--reading-mode");
      if (readingModeEventsBound) {
        document.removeEventListener("contextmenu", readingModePreventDefault, true);
        document.removeEventListener("copy", readingModePreventDefault, true);
        document.removeEventListener("cut", readingModePreventDefault, true);
        document.removeEventListener("dragstart", readingModePreventDefault, true);
        readingModeEventsBound = false;
      }
    }
    syncReadingModeToggleUI();
  }

  function syncReadingModeToggleUI() {
    var btn = qs(document, "[data-reading-mode-toggle]");
    if (!btn || btn.style.display === "none") return;
    var on = document.documentElement.classList.contains("efacticom--reading-mode");
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    var lab = qs(btn, "[data-reading-mode-label]");
    if (lab) {
      lab.textContent = on ? "Modo selección" : "Modo lectura";
    }
    btn.setAttribute(
      "aria-label",
      on
        ? "Modo lectura activo. Activar para permitir copiar y seleccionar texto."
        : "Modo selección. Activar para desactivar copia y selección de texto."
    );
  }

  function bindReadingModeToggle() {
    if (isWebPublicEdition()) return;
    var btn = qs(document, "[data-reading-mode-toggle]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var nowOn = document.documentElement.classList.contains("efacticom--reading-mode");
      setReadingModeEnabled(!nowOn);
    });
    syncReadingModeToggleUI();
  }

  /**
   * Barras horizontales CSS — valores 0–100.
   */
  function renderBarChart(container, opts) {
    var labels = opts.labels || [];
    var series = opts.series || [];
    var title = opts.title || "";
    var cardClass = "chart-card" + (opts.cardClass ? " " + opts.cardClass : "");
    var fillStyle = opts.barFillStyle || "";
    var html =
      '<div class="' +
      cardClass +
      '">' +
      (title ? '<h4 class="chart-card__title">' + escapeHtml(title) + "</h4>" : "") +
      '<div class="bar-chart" role="img" aria-label="' +
      escapeHtml(title || "Gráfico de barras") +
      '">';
    for (var i = 0; i < labels.length; i++) {
      var v = series[i] != null ? series[i] : 0;
      html +=
        '<div class="bar-chart__row">' +
        '<span class="bar-chart__label">' +
        escapeHtml(labels[i]) +
        "</span>" +
        '<div class="bar-chart__track"><span class="bar-chart__fill" style="width:' +
        v +
        "%" +
        (fillStyle ? ";" + fillStyle : "") +
        '"></span></div>' +
        '<span class="bar-chart__value">' +
        v.toFixed(1) +
        "</span>" +
        "</div>";
    }
    html += "</div></div>";
    container.innerHTML = html;
  }

  /**
   * Columnas agrupadas por mes — barras sólidas, escala 0–maxY (informe analítico).
   */
  function renderGroupedMonthlyChart(container, opts) {
    var monthLabels = opts.monthLabels || [];
    var seriesDefs = opts.seriesDefs || [];
    var title = opts.title || "";
    var maxY = typeof opts.maxY === "number" ? opts.maxY : 100;
    var minY = typeof opts.minY === "number" ? opts.minY : 0;
    var range = maxY - minY || 1;
    var cardClass =
      "chart-card chart-card--grouped-monthly" + (opts.cardClass ? " " + opts.cardClass : "");
    var html = '<div class="' + cardClass + '">';
    if (title) {
      html += '<h4 class="chart-card__title">' + escapeHtml(title) + "</h4>";
    }
    html += '<div class="grouped-monthly__legend">';
    for (var s = 0; s < seriesDefs.length; s++) {
      html +=
        '<span class="grouped-monthly__legend-item"><i style="background:' +
        escapeHtml(seriesDefs[s].color) +
        '"></i>' +
        escapeHtml(seriesDefs[s].label) +
        "</span>";
    }
    html += '</div><div class="grouped-monthly__plot" role="img" aria-label="' + escapeHtml(title) + '">';
    
    html += '<div class="grouped-monthly__y-axis">';
    html += '<span class="grouped-monthly__y-tick">' + String(maxY) + '</span>';
    html += '<span class="grouped-monthly__y-tick">' + String((minY + range / 2).toFixed(0)) + '</span>';
    html += '<span class="grouped-monthly__y-tick">' + String(minY) + '</span>';
    html += '</div>';

    var showVals = opts.showValues !== false;
    for (var m = 0; m < monthLabels.length; m++) {
      html += '<div class="grouped-monthly__col">';
      if (showVals && seriesDefs.length) {
        var vTop = seriesDefs[0].values[m] != null ? seriesDefs[0].values[m] : null;
        html +=
          '<span class="grouped-monthly__val" title="' +
          escapeHtml(seriesDefs[0].label + " " + monthLabels[m]) +
          '">' +
          (vTop != null ? Number(vTop).toFixed(2) : "—") +
          "</span>";
      }
      html += '<div class="grouped-monthly__bars">';
      for (var t = 0; t < seriesDefs.length; t++) {
        var val = seriesDefs[t].values[m] != null ? seriesDefs[t].values[m] : minY;
        var pct = Math.max(0.5, Math.min(100, ((val - minY) / range) * 100));
        html +=
          '<div class="grouped-monthly__bar-wrap" title="' +
          escapeHtml(seriesDefs[t].label + " " + monthLabels[m] + ": " + val.toFixed(2)) +
          '"><span class="grouped-monthly__bar" style="height:' +
          pct +
          "%;background:" +
          escapeHtml(seriesDefs[t].color) +
          '"></span></div>';
      }
      html +=
        '</div><span class="grouped-monthly__tick">' + escapeHtml(monthLabels[m]) + "</span></div>";
    }
    html += "</div></div>";
    container.innerHTML = html;
  }

  /**
   * Referencia horizontal (productividad total) vs valor por categoría (misma escala).
   */
  function renderBenchmarkCategoryChart(container, opts) {
    var labels = opts.categoryLabels || [];
    var actual = opts.actualValues || [];
    var benchmark = opts.benchmark != null ? opts.benchmark : 0;
    var colors = opts.colors || [];
    var title = opts.title || "";
    var maxY = typeof opts.maxY === "number" ? opts.maxY : 100;
    var cardClass =
      "chart-card chart-card--benchmark" + (opts.cardClass ? " " + opts.cardClass : "");
    var html = '<div class="' + cardClass + '">';
    if (title) {
      html += '<h4 class="chart-card__title">' + escapeHtml(title) + "</h4>";
    }
    html += '<div class="benchmark-chart__legend">';
    html +=
      '<span class="benchmark-chart__legend-item benchmark-chart__legend-item--ref"><i></i>Productividad total (referencia)</span>';
    html +=
      '<span class="benchmark-chart__legend-item benchmark-chart__legend-item--act"><i></i>Valor por categoría</span>';
    html += '</div><div class="benchmark-chart__rows">';
    for (var i = 0; i < labels.length; i++) {
      var a = actual[i] != null ? actual[i] : 0;
      var wA = Math.min(100, Math.max(0, (a / maxY) * 100));
      var wB = Math.min(100, Math.max(0, (benchmark / maxY) * 100));
      var col = colors[i] || "#153a5c";
      html += '<div class="benchmark-chart__row">';
      html += '<span class="benchmark-chart__label">' + escapeHtml(labels[i]) + "</span>";
      html += '<div class="benchmark-chart__cell">';
      html +=
        '<div class="benchmark-chart__track benchmark-chart__track--ref" title="' +
        escapeHtml("Referencia " + benchmark.toFixed(2)) +
        '"><span style="width:' +
        wB +
        '%"></span></div>';
      html +=
        '<div class="benchmark-chart__track benchmark-chart__track--act" title="' +
        escapeHtml(labels[i] + " " + a.toFixed(2)) +
        '"><span style="width:' +
        wA +
        "%;background:" +
        escapeHtml(col) +
        '"></span></div>';
      html +=
        '</div><div class="benchmark-chart__vals"><span class="benchmark-chart__val-ref">' +
        benchmark.toFixed(2) +
        '</span><span class="benchmark-chart__val-act">' +
        a.toFixed(2) +
        "</span></div></div>";
    }
    html += "</div></div>";
    container.innerHTML = html;
  }

  function resolveDtLabels(block, db) {
    if (block.labels && block.labels.length) return block.labels;
    if (block.labelsRef && db[block.labelsRef]) return db[block.labelsRef];
    return [];
  }

  function dtNum(v) {
    return Math.round(Number(v) * 100) / 100;
  }

  function dtWrapChart(title, subtitle, svgInner, extraClass) {
    var cls = "dt-chart" + (extraClass ? " " + extraClass : "");
    return (
      '<div class="' +
      cls +
      '">' +
      '<h5 class="dt-chart__title">' +
      escapeHtml(title) +
      "</h5>" +
      (subtitle
        ? '<p class="dt-chart__sub">' + escapeHtml(subtitle) + "</p>"
        : "") +
      '<div class="dt-chart__frame">' +
      svgInner +
      "</div></div>"
    );
  }

  /** Curva suave tipo Catmull-Rom → cúbicas; `close` añade Z al final. */
  function smoothSvgPathThroughPoints(pts, close) {
    if (!pts || pts.length < 2) return "";
    if (pts.length === 2) {
      return "M " + pts[0].x + " " + pts[0].y + " L " + pts[1].x + " " + pts[1].y + (close ? " Z" : "");
    }
    var d = "M " + pts[0].x + " " + pts[0].y;
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i === 0 ? 0 : i - 1];
      var p1 = pts[i];
      var p2 = pts[i + 1];
      var p3 = pts[pts.length - 1];
      if (i + 2 < pts.length) p3 = pts[i + 2];
      var cp1x = p1.x + (p2.x - p0.x) / 6;
      var cp1y = p1.y + (p2.y - p0.y) / 6;
      var cp2x = p2.x - (p3.x - p1.x) / 6;
      var cp2y = p2.y - (p3.y - p1.y) / 6;
      d += " C " + cp1x + " " + cp1y + " " + cp2x + " " + cp2y + " " + p2.x + " " + p2.y;
    }
    return close ? d + " Z" : d;
  }

  function dtSvgColumns(block, labels, compact) {
    var values = block.values;
    var n = values.length;
    var w = compact ? 440 : 340;
    var h = compact ? 200 : 172;
    var pl = 46;
    var pr = compact ? 10 : 14;
    var pt = 18;
    var pb = compact ? 46 : 40;
    var ymin = block.yMin != null ? block.yMin : Math.min.apply(null, values);
    var ymax = block.yMax != null ? block.yMax : Math.max.apply(null, values);
    if (ymax <= ymin) ymax = ymin + 1;
    var iw = w - pl - pr;
    var ih = h - pt - pb;
    var slot = iw / n;
    var bw = slot * (compact ? 0.55 : 0.62);
    var gap = slot - bw;
    var col = block.color || "#153a5c";
    var baseY = h - pb;
    var o = [];
    o.push(
      '<svg class="dt-svg' +
        (compact ? " dt-svg--compact" : "") +
        '" viewBox="0 0 ' +
        w +
        " " +
        h +
        '" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">'
    );
    o.push(
      '<line class="dt-svg__axis" x1="' +
        pl +
        '" y1="' +
        baseY +
        '" x2="' +
        (w - pr) +
        '" y2="' +
        baseY +
        '"/>'
    );
    for (var g = 0; g <= 3; g++) {
      var gy = pt + (ih * g) / 3;
      o.push(
        '<line class="dt-svg__grid" x1="' +
          pl +
          '" y1="' +
          gy +
          '" x2="' +
          (w - pr) +
          '" y2="' +
          gy +
          '"/>'
      );
    }
    for (var i = 0; i < n; i++) {
      var cx = pl + gap / 2 + i * slot;
      var v = values[i];
      var bh = ((v - ymin) / (ymax - ymin)) * ih;
      var y = baseY - bh;
      o.push(
        '<rect class="dt-svg__bar" x="' +
          cx +
          '" y="' +
          y +
          '" width="' +
          bw +
          '" height="' +
          Math.max(bh, 1) +
          '" rx="3" ry="3" fill="' +
          escapeHtml(col) +
          '"/>'
      );
      o.push(
        '<text class="dt-svg__val" x="' +
          (cx + bw / 2) +
          '" y="' +
          (y - 5) +
          '" text-anchor="middle">' +
          dtNum(v).toFixed(2) +
          "</text>"
      );
      var lx = cx + bw / 2;
      var ly = baseY + (compact ? 20 : 14);
      if (compact) {
        o.push(
          '<text class="dt-svg__lab dt-svg__lab--rot" transform="translate(' +
            lx +
            "," +
            ly +
            ') rotate(-48)">' +
            escapeHtml(labels[i] || "") +
            "</text>"
        );
      } else {
        o.push(
          '<text class="dt-svg__lab" x="' +
            lx +
            '" y="' +
            ly +
            '" text-anchor="middle">' +
            escapeHtml(labels[i] || "") +
            "</text>"
        );
      }
    }
    if (block.yAxisLabel) {
      var yc = pt + ih / 2;
      o.push(
        '<text class="dt-svg__ylab" transform="translate(14,' +
          yc +
          ') rotate(-90)" text-anchor="middle">' +
          escapeHtml(block.yAxisLabel) +
          "</text>"
      );
    }
    o.push("</svg>");
    return o.join("");
  }

  function dtSvgLine(block, labels) {
    var values = block.values;
    var n = values.length;
    var w = n > 5 ? 440 : 340;
    var h = n > 5 ? 200 : 172;
    var pl = 46;
    var pr = 14;
    var pt = 22;
    var pb = n > 5 ? 48 : 42;
    var ymin = block.yMin != null ? block.yMin : Math.min.apply(null, values);
    var ymax = block.yMax != null ? block.yMax : Math.max.apply(null, values);
    if (ymax <= ymin) ymax = ymin + 1;
    var iw = w - pl - pr;
    var ih = h - pt - pb;
    var baseY = h - pb;
    var col = block.color || "#2563ab";
    var pts = [];
    for (var i = 0; i < n; i++) {
      var x = pl + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw);
      var y = baseY - ((values[i] - ymin) / (ymax - ymin)) * ih;
      pts.push({ x: x, y: y });
    }
    var d;
    if (block.smooth && pts.length > 2) {
      d = smoothSvgPathThroughPoints(pts, false);
    } else {
      d = "M " + pts[0].x + " " + pts[0].y;
      for (var j = 1; j < pts.length; j++) {
        d += " L " + pts[j].x + " " + pts[j].y;
      }
    }
    var o = [];
    o.push(
      '<svg class="dt-svg dt-svg--line" viewBox="0 0 ' +
        w +
        " " +
        h +
        '" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">'
    );
    for (var g2 = 0; g2 <= 3; g2++) {
      var gy = pt + (ih * g2) / 3;
      o.push(
        '<line class="dt-svg__grid" x1="' +
          pl +
          '" y1="' +
          gy +
          '" x2="' +
          (w - pr) +
          '" y2="' +
          gy +
          '"/>'
      );
    }
    o.push(
      '<line class="dt-svg__axis" x1="' +
        pl +
        '" y1="' +
        baseY +
        '" x2="' +
        (w - pr) +
        '" y2="' +
        baseY +
        '"/>'
    );
    o.push(
      '<path class="dt-svg__linepath" d="' +
        d +
        '" fill="none" stroke="' +
        escapeHtml(col) +
        '" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/>'
    );
    for (var k = 0; k < pts.length; k++) {
      o.push(
        '<circle class="dt-svg__dot" cx="' +
          pts[k].x +
          '" cy="' +
          pts[k].y +
          '" r="4.5" fill="#fff" stroke="' +
          escapeHtml(col) +
          '" stroke-width="2"/>'
      );
      o.push(
        '<text class="dt-svg__val" x="' +
          pts[k].x +
          '" y="' +
          (pts[k].y - 10) +
          '" text-anchor="middle">' +
          dtNum(values[k]).toFixed(2) +
          "</text>"
      );
      var labY = baseY + (n > 5 ? 20 : 15);
      if (n > 5) {
        o.push(
          '<text class="dt-svg__lab dt-svg__lab--rot" transform="translate(' +
            pts[k].x +
            "," +
            labY +
            ') rotate(-50)">' +
            escapeHtml(labels[k] || "") +
            "</text>"
        );
      } else {
        o.push(
          '<text class="dt-svg__lab" x="' +
            pts[k].x +
            '" y="' +
            labY +
            '" text-anchor="middle">' +
            escapeHtml(labels[k] || "") +
            "</text>"
        );
      }
    }
    if (block.yAxisLabel) {
      var yc2 = pt + ih / 2;
      o.push(
        '<text class="dt-svg__ylab" transform="translate(14,' +
          yc2 +
          ') rotate(-90)" text-anchor="middle">' +
          escapeHtml(block.yAxisLabel) +
          "</text>"
      );
    }
    o.push("</svg>");
    return o.join("");
  }

  function dtSvgHbars(block, labels) {
    var values = block.values;
    var colors = block.colors || [];
    var n = values.length;
    var vmax = Math.max.apply(null, values);
    var xMin = block.xMin != null ? Number(block.xMin) : 0;
    var xmax = block.xMax != null ? Number(block.xMax) : vmax * 1.08;
    if (xmax <= xMin) xmax = xMin + Math.max(Math.abs(vmax) * 0.02, 1e-6);
    var xSpan = xmax - xMin;
    if (xSpan <= 0) xSpan = 1;
    var w = 360;
    var rowH = 34;
    var lh = 20 + n * rowH;
    var lw = 78;
    var left = lw + 10;
    var barW = w - left - 52;
    var o = [];
    o.push(
      '<svg class="dt-svg dt-svg--hbar" viewBox="0 0 ' +
        w +
        " " +
        lh +
        '" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">'
    );
    for (var i = 0; i < n; i++) {
      var y = 16 + i * rowH;
      var v = values[i];
      var t = (Number(v) - xMin) / xSpan;
      if (t < 0) t = 0;
      if (t > 1) t = 1;
      var bw = t * barW;
      var c = colors[i] || block.color || "#2563ab";
      o.push(
        '<text class="dt-svg__hlab" x="' +
          (lw - 4) +
          '" y="' +
          (y + rowH / 2 + 4) +
          '" text-anchor="end">' +
          escapeHtml(labels[i] || "") +
          "</text>"
      );
      o.push(
        '<rect class="dt-svg__track" x="' +
          left +
          '" y="' +
          (y + 6) +
          '" width="' +
          barW +
          '" height="' +
          (rowH - 14) +
          '" rx="4" fill="rgba(226,232,240,0.85)"/>'
      );
      o.push(
        '<rect class="dt-svg__hfill" x="' +
          left +
          '" y="' +
          (y + 6) +
          '" width="' +
          Math.max(bw, 2) +
          '" height="' +
          (rowH - 14) +
          '" rx="4" fill="' +
          escapeHtml(c) +
          '"/>'
      );
      o.push(
        '<text class="dt-svg__hval" x="' +
          (left + Math.max(bw, 2) + 6) +
          '" y="' +
          (y + rowH / 2 + 5) +
          '">' +
          dtNum(v).toFixed(2) +
          "</text>"
      );
    }
    if (block.xAxisLabel) {
      o.push(
        '<text class="dt-svg__xcap" x="' +
          (left + barW / 2) +
          '" y="' +
          (lh - 2) +
          '" text-anchor="middle">' +
          escapeHtml(block.xAxisLabel) +
          "</text>"
      );
    }
    o.push("</svg>");
    return o.join("");
  }

  function dtSvgHbarsMany(block, labels) {
    var values = block.values;
    var n = values.length;
    var vmaxM = Math.max.apply(null, values);
    var xMinM = block.xMin != null ? Number(block.xMin) : 0;
    var xmax = block.xMax != null ? Number(block.xMax) : vmaxM * 1.06;
    if (xmax <= xMinM) xmax = xMinM + Math.max(Math.abs(vmaxM) * 0.02, 1e-6);
    var xSpanM = xmax - xMinM;
    if (xSpanM <= 0) xSpanM = 1;
    var w = 400;
    var rowH = 22;
    var top = 10;
    var lh = top + n * rowH + 22;
    var lw = 52;
    var left = lw + 6;
    var barW = w - left - 44;
    var col = block.color || "#153a5c";
    var o = [];
    o.push(
      '<svg class="dt-svg dt-svg--hbar dt-svg--dense" viewBox="0 0 ' +
        w +
        " " +
        lh +
        '" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">'
    );
    for (var i = 0; i < n; i++) {
      var y = top + i * rowH;
      var v = values[i];
      var tm = (Number(v) - xMinM) / xSpanM;
      if (tm < 0) tm = 0;
      if (tm > 1) tm = 1;
      var bw = tm * barW;
      o.push(
        '<text class="dt-svg__hlab" x="' +
          (lw - 2) +
          '" y="' +
          (y + rowH / 2 + 3) +
          '" text-anchor="end">' +
          escapeHtml(labels[i] || "") +
          "</text>"
      );
      o.push(
        '<rect x="' +
          left +
          '" y="' +
          (y + 4) +
          '" width="' +
          barW +
          '" height="' +
          (rowH - 8) +
          '" rx="3" fill="rgba(241,245,249,0.95)"/>'
      );
      o.push(
        '<rect x="' +
          left +
          '" y="' +
          (y + 4) +
          '" width="' +
          Math.max(bw, 1.5) +
          '" height="' +
          (rowH - 8) +
          '" rx="3" fill="' +
          escapeHtml(col) +
          '"/>'
      );
      o.push(
        '<text class="dt-svg__hval" x="' +
          (left + Math.max(bw, 1.5) + 4) +
          '" y="' +
          (y + rowH / 2 + 3) +
          '">' +
          dtNum(v).toFixed(2) +
          "</text>"
      );
    }
    if (block.xAxisLabel) {
      o.push(
        '<text class="dt-svg__xcap" x="' +
          (left + barW / 2) +
          '" y="' +
          (lh - 4) +
          '" text-anchor="middle">' +
          escapeHtml(block.xAxisLabel) +
          "</text>"
      );
    }
    o.push("</svg>");
    return o.join("");
  }

  function donutWedgePath(cx, cy, rIn, rOut, a0, a1) {
    var c0 = Math.cos(a0),
      s0 = Math.sin(a0);
    var c1 = Math.cos(a1),
      s1 = Math.sin(a1);
    var x0 = cx + rOut * c0,
      y0 = cy + rOut * s0;
    var x1 = cx + rOut * c1,
      y1 = cy + rOut * s1;
    var x2 = cx + rIn * c1,
      y2 = cy + rIn * s1;
    var x3 = cx + rIn * c0,
      y3 = cy + rIn * s0;
    var large = a1 - a0 > Math.PI ? 1 : 0;
    return (
      "M" +
      x0 +
      "," +
      y0 +
      " A" +
      rOut +
      "," +
      rOut +
      " 0 " +
      large +
      " 1 " +
      x1 +
      "," +
      y1 +
      " L" +
      x2 +
      "," +
      y2 +
      " A" +
      rIn +
      "," +
      rIn +
      " 0 " +
      large +
      " 0 " +
      x3 +
      "," +
      y3 +
      " Z"
    );
  }

  /** Torta / dona multiporción: proporciones según valores; etiquetas en cada sector (sin lista leyenda). */
  function dtSvgDonutGroup(block, labels) {
    var values = block.values || [];
    var n = values.length;
    var sum = 0;
    for (var i = 0; i < n; i++) {
      sum += Math.max(0, Number(values[i]) || 0);
    }
    if (sum <= 0) sum = 1;
    var dense = n > 5;
    /* Unificar tamaño de dona en turno y centro para paridad visual. */
    var W = 336;
    var H = 188;
    var cx = W / 2;
    var cy = H / 2;
    var rOut = 62;
    var rIn = rOut * 0.54;
    var rLabel = rOut + 8;
    var base = block.color || "#334155";
    var segmentColors = block.segmentColors;
    if (!segmentColors || segmentColors.length < n) {
      segmentColors = [];
      for (var sc = 0; sc < n; sc++) {
        segmentColors.push(base);
      }
    }
    var segs = [];
    var ang = -Math.PI / 2;
    for (var k = 0; k < n; k++) {
      var v = Math.max(0, Number(values[k]) || 0);
      var frac = v / sum;
      var a0 = ang;
      var a1 = ang + frac * 2 * Math.PI;
      if (a1 - a0 > 0.004) {
        segs.push({ a0: a0, a1: a1, v: v, k: k, frac: frac });
      }
      ang = a1;
    }
    var o = [];
    o.push(
      '<svg class="dt-svg dt-svg--donut' +
        (dense ? " dt-svg--donut-dense" : "") +
        '" viewBox="0 0 ' +
        W +
        " " +
        H +
        '" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">'
    );
    for (var si = 0; si < segs.length; si++) {
      var sg = segs[si];
      var col = segmentColors[sg.k] || base;
      o.push(
        '<path d="' +
          donutWedgePath(cx, cy, rIn, rOut, sg.a0, sg.a1) +
          '" fill="' +
          escapeHtml(col) +
          '" stroke="#fff" stroke-width="0.85"/>'
      );
    }
    o.push(
      '<circle cx="' +
        cx +
        '" cy="' +
        cy +
        '" r="' +
        Math.max(0, rIn - 1.5) +
        '" fill="#fafbfd"/>'
    );
    for (var lj = 0; lj < segs.length; lj++) {
      var s = segs[lj];
      var am = (s.a0 + s.a1) / 2;
      var tx = cx + rLabel * Math.cos(am);
      var ty = cy + rLabel * Math.sin(am);
      var lbl = labels[s.k] != null ? String(labels[s.k]) : "";
      var vStr = dtNum(s.v).toFixed(2);
      var tcls = "dt-svg__donut-callout" + (dense ? " dt-svg__donut-callout--dense" : "");
      o.push(
        '<text class="' +
          tcls +
          '" text-anchor="middle" dominant-baseline="middle" x="' +
          tx +
          '" y="' +
          ty +
          '">' +
          '<tspan x="' +
          tx +
          '" dy="' +
          (dense ? "-0.42em" : "-0.45em") +
          '">' +
          escapeHtml(lbl) +
          '</tspan><tspan x="' +
          tx +
          '" dy="' +
          (dense ? "0.95em" : "1em") +
          '">' +
          escapeHtml(vStr) +
          "</tspan></text>"
      );
    }
    o.push("</svg>");
    return o.join("");
  }

  function renderDtBlock(block, db) {
    var labels = resolveDtLabels(block, db);
    var kind = block.kind;
    var svg = "";
    if (kind === "columns") svg = dtSvgColumns(block, labels, false);
    else if (kind === "line") svg = dtSvgLine(block, labels);
    else if (kind === "hbars") svg = dtSvgHbars(block, labels);
    else if (kind === "donut") svg = dtSvgDonutGroup(block, labels);
    else if (kind === "columnsMany") svg = dtSvgColumns(block, labels, true);
    else if (kind === "lineMany") svg = dtSvgLine(block, labels);
    else if (kind === "hbarsMany") svg = dtSvgHbarsMany(block, labels);
    return dtWrapChart(
      block.title || "",
      block.subtitle || "",
      svg,
      block.highlight ? "dt-chart--highlight" : ""
    );
  }

  function renderDashboardTotalSection(container, blocks, db) {
    if (!container || !blocks || !blocks.length) return;
    var html = "";
    for (var bi = 0; bi < blocks.length; bi++) {
      html += renderDtBlock(blocks[bi], db);
    }
    container.innerHTML = html;
  }

  function renderLineSpark(container, series) {
    var w = 280;
    var h = 64;
    var pad = 6;
    var max = 100;
    var min = 0;
    var pts = [];
    for (var i = 0; i < series.length; i++) {
      var x = pad + (i * (w - 2 * pad)) / Math.max(1, series.length - 1);
      var y = h - pad - ((series[i] - min) / (max - min)) * (h - 2 * pad);
      pts.push(x + "," + y);
    }
    var pathD = "M " + pts.join(" L ");
    container.innerHTML =
      '<svg class="spark-svg" viewBox="0 0 ' +
      w +
      " " +
      h +
      '" preserveAspectRatio="none" aria-hidden="true">' +
      '<path class="spark-svg__grid" d="M ' +
      pad +
      " " +
      (h / 2) +
      " H " +
      (w - pad) +
      '" />' +
      '<path class="spark-svg__line" d="' +
      pathD +
      '" fill="none" />' +
      "</svg>";
  }

  function renderFilterBar(container, filters, opts) {
    opts = opts || {};
    var inner = "";
    for (var i = 0; i < (filters || []).length; i++) {
      var f = filters[i];
      inner +=
        '<div class="filter-pill"><span class="filter-pill__label">' +
        escapeHtml(f.label) +
        '</span><span class="filter-pill__value">' +
        escapeHtml(f.value) +
        "</span></div>";
    }
    if (opts.bare) {
      container.innerHTML = inner;
      return;
    }
    container.innerHTML = '<div class="filter-bar" role="group">' + inner + "</div>";
  }

  function renderKpiCard(container, opts) {
    var cardClass = opts.cardClass || "kpi-card";
    container.innerHTML =
      '<article class="' +
      cardClass +
      '">' +
      '<p class="kpi-card__label">' +
      escapeHtml(opts.label) +
      "</p>" +
      '<p class="kpi-card__value">' +
      escapeHtml(String(opts.value)) +
      (opts.suffix != null ? '<span class="kpi-card__suffix">' + escapeHtml(opts.suffix) + "</span>" : "") +
      "</p>" +
      (opts.hint ? '<p class="kpi-card__hint">' + escapeHtml(opts.hint) + "</p>" : "") +
      "</article>";
  }

  function renderDonutRow(container, items, variant) {
    var rowClass = "donut-row" + (variant === "editorial" ? " donut-row--editorial" : "");
    var html = '<div class="' + rowClass + '">';
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var pct = Math.min(100, Math.max(0, it.value));
      html +=
        '<div class="donut-mini">' +
        '<div class="donut-mini__ring" style="--p:' +
        pct +
        ";--c:" +
        escapeHtml(it.color) +
        '"><span class="donut-mini__val">' +
        pct.toFixed(2) +
        "</span></div>" +
        '<span class="donut-mini__lbl">' +
        escapeHtml(it.label) +
        "</span>" +
        "</div>";
    }
    html += "</div>";
    container.innerHTML = html;
  }

  function renderDashboardGrid(container, cards) {
    var html = '<div class="dashboard-grid">';
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i];
      html +=
        '<div class="dashboard-tile" data-dashboard-tile>' +
        '<h4 class="dashboard-tile__title">' +
        escapeHtml(c.title) +
        "</h4>" +
        '<div class="dashboard-tile__chart" data-spark="' +
        i +
        '"></div>' +
        "</div>";
    }
    html += "</div>";
    container.innerHTML = html;
    var nodes = qsa(container, "[data-spark]");
    for (var j = 0; j < nodes.length; j++) {
      renderLineSpark(nodes[j], cards[j].series);
    }
  }

  function renderExcelCategoryBars(values) {
    var cats = [
      { key: "eficiencia", label: "Eficiencia" },
      { key: "eficacia", label: "Eficacia" },
      { key: "flexibilidad", label: "Flexibilidad" },
      { key: "crecimiento", label: "Crecimiento" },
    ];
    var w = 356;
    var h = 180;
    var pl = 28;
    var pr = 10;
    var pt = 14;
    var pb = 26;
    var iw = w - pl - pr;
    var ih = h - pt - pb;
    var maxY = 90;
    var n = cats.length;
    var slot = iw / n;
    var barW = Math.min(58, slot * 0.64);
    var out = [];
    out.push(
      '<svg class="excel-bars-svg" viewBox="0 0 ' +
        w +
        " " +
        h +
        '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Productividad total por categoría">'
    );
    for (var gy = 0; gy <= 9; gy++) {
      var yVal = 90 - gy * 10;
      var y = pt + (ih * gy) / 9;
      out.push(
        '<text class="excel-bars-svg__ytick" x="' +
          (pl - 4) +
          '" y="' +
          (y + 3) +
          '" text-anchor="end" style="fill:#475569;font-size:8px;font-weight:600">' +
          yVal +
          "</text>"
      );
    }
    out.push(
      '<line class="excel-bars-svg__axis" x1="' +
        pl +
        '" y1="' +
        (h - pb) +
        '" x2="' +
        (w - pr) +
        '" y2="' +
        (h - pb) +
        '" style="stroke:#94a3b8;stroke-width:1.2"/>'
    );
    out.push(
      '<text class="excel-bars-svg__axis-cap" x="' +
        (pl + iw / 2) +
        '" y="' +
        (h - 4) +
        '" text-anchor="middle" style="fill:#475569;font-size:8px;font-weight:600">Categoría</text>'
    );
    out.push(
      '<text class="excel-bars-svg__axis-cap" transform="translate(10,' +
        (pt + ih / 2) +
        ') rotate(-90)" text-anchor="middle" style="fill:#475569;font-size:8px;font-weight:600">Valor</text>'
    );

    for (var i = 0; i < n; i++) {
      var total = 84.04;
      var v = dtNum(values[cats[i].key] || 0);
      var cx = pl + i * slot + slot / 2;
      var outerH = (total / maxY) * ih;
      var innerH = (v / maxY) * ih;
      var ox = cx - barW / 2;
      var oy = h - pb - outerH;
      var ix = cx - (barW * 0.82) / 2;
      var iy = h - pb - innerH;

      out.push(
        '<rect class="excel-bars-svg__bar-total" x="' +
          ox +
          '" y="' +
          oy +
          '" width="' +
          barW +
          '" height="' +
          outerH +
          '" style="fill:#c8ddf1"/>'
      );
      out.push(
        '<text class="excel-bars-svg__val excel-bars-svg__val--max" x="' +
          cx +
          '" y="' +
          (oy - 4) +
          '" text-anchor="middle" style="fill:#334155;font-size:8.5px;font-weight:700">' +
          total.toFixed(2) +
          "</text>"
      );
      out.push(
        '<rect class="excel-bars-svg__bar-part" x="' +
          ix +
          '" y="' +
          iy +
          '" width="' +
          barW * 0.82 +
          '" height="' +
          innerH +
          '" style="fill:#3f7bbc;stroke:#1f4e85;stroke-width:1"/>'
      );
      out.push(
        '<text class="excel-bars-svg__val" x="' +
          cx +
          '" y="' +
          (iy - 4) +
          '" text-anchor="middle" style="fill:#1e293b;font-size:8px;font-weight:700">' +
          v.toFixed(2) +
          "</text>"
      );
      out.push(
        '<text class="excel-bars-svg__xtick" x="' +
          cx +
          '" y="' +
          (h - pb + 14) +
          '" text-anchor="middle" style="fill:#475569;font-size:8px;font-weight:600">' +
          escapeHtml(cats[i].label) +
          "</text>"
      );
    }
    out.push("</svg>");
    return '<div class="excel-bars">' + out.join("") + "</div>";
  }

  function renderDashboardProductividadExcel(container, db) {
    if (!container || !db) return;
    var pillars = {};
    for (var i = 0; i < (db.kpiPillars || []).length; i++) {
      pillars[db.kpiPillars[i].key] = dtNum(db.kpiPillars[i].value);
    }
    var total = dtNum(db.kpiTotal);
    container.innerHTML =
      '<div class="dashboard-excel">' +
      '<div class="dashboard-excel__summary">' +
      '<table class="dashboard-excel__table" style="width:100%;border-collapse:collapse;table-layout:fixed;">' +
      "<thead><tr><th>Productividad total</th><th>Eficiencia</th><th>Eficacia</th><th>Flexibilidad</th><th>Crecimiento</th></tr></thead>" +
      "<tbody><tr><td>" +
      total.toFixed(2) +
      "</td><td>" +
      (pillars.eficiencia || 0).toFixed(2) +
      "</td><td>" +
      (pillars.eficacia || 0).toFixed(2) +
      "</td><td>" +
      (pillars.flexibilidad || 0).toFixed(2) +
      "</td><td>" +
      (pillars.crecimiento || 0).toFixed(2) +
      "</td></tr></tbody></table></div>" +
      '<div class="dashboard-excel__charts">' +
      '<div class="dashboard-excel__slicers dashboard-excel__slicers--top">' +
      '<div class="dashboard-excel__slicer" style="border:1px solid #d5e3f1;background:#f8fbff;padding:0.2rem 0.24rem;"><span>Fecha</span><strong>Todos los periodos · 2025</strong></div>' +
      '<div class="dashboard-excel__slicer" style="border:1px solid #d5e3f1;background:#f8fbff;padding:0.2rem 0.24rem;"><span>Centro Trabajo</span><strong>INY 01 · INY 02 · INY 03 · INY 04 · INY 05 · INY 06 · INY 19 · INY 20 · INY 24 · INY 25</strong></div>' +
      '<div class="dashboard-excel__slicer" style="border:1px solid #d5e3f1;background:#f8fbff;padding:0.2rem 0.24rem;"><span>Turno</span><strong>1 · 2 · 3</strong></div>' +
      "</div>" +
      '<div class="dashboard-excel__left"><div class="dashboard-excel__chart" data-excel-monthly></div></div>' +
      '<div class="dashboard-excel__right dashboard-excel__right--solo">' +
      '<h5 class="dashboard-excel__mini-title">Productividad total <span class="dashboard-excel__max">Valor máximo: ' +
      total.toFixed(2) +
      "</span></h5>" +
      renderExcelCategoryBars(pillars) +
      "</div></div></div>";

    var left = qs(container, "[data-excel-monthly]");
    if (left) {
      var ms = db.monthlySeries || {};
      var cats = db.categories || [];
      renderIntegratedMonthlySvg(left, {
        title: "Productividad Transdisciplinar",
        monthLabels: db.monthlyLabels || [],
        seriesDefs: [
          { label: "Prod. Transdisciplinar", color: db.monthlyTotalColor || "#0f3d6b", values: ms.total || [] },
          { label: "Eficiencia", color: cats[0] ? cats[0].color : "#2563eb", values: ms.eficiencia || [] },
          { label: "Eficacia", color: cats[1] ? cats[1].color : "#0284c7", values: ms.eficacia || [] },
          { label: "Flexibilidad", color: cats[2] ? cats[2].color : "#475569", values: ms.flexibilidad || [] },
          { label: "Crecimiento", color: cats[3] ? cats[3].color : "#1e3a8a", values: ms.crecimiento || [] },
        ],
        maxY: 100,
        yAxisTitle: "Valor",
        xAxisTitle: "Tiempo",
        compact: false,
        overlayBars: true,
      });
    }
  }

  function renderImageMosaic(container, items) {
    if (!container || !items || !items.length) return;
    var html = '<div class="image-mosaic">';
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var cls = "image-mosaic__item image-mosaic__item--" + (i + 1);
      html +=
        '<figure class="' +
        cls +
        '">' +
        '<img loading="lazy" src="' +
        escapeHtml(it.src) +
        '" alt="' +
        escapeHtml(it.alt || "Imagen de portada") +
        '" />' +
        "</figure>";
    }
    html += "</div>";
    container.innerHTML = html;
  }

  /** Portada: una sola imagen a pantalla completa detrás del degradado. */
  function fillCoverVisual(container, item) {
    if (!container || !item || !item.src) return;
    container.innerHTML =
      '<img class="cover-hero__bg-img" src="' +
      escapeHtml(item.src) +
      '" alt="' +
      escapeHtml(item.alt || "Imagen de portada") +
      '" width="1920" height="1080" decoding="async" fetchpriority="high" loading="eager" />';
  }

  function renderStatsTable(container, rows) {
    var html =
      '<div class="table-scroll">' +
      '<table class="stats-table">' +
      "<thead><tr>" +
      "<th>Variable</th><th>Media</th><th>Máx.</th><th>Mín.</th><th>Rango</th><th>DE</th><th>Varianza</th><th>CV %</th>" +
      "</tr></thead><tbody>";
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      html +=
        "<tr>" +
        "<td>" +
        escapeHtml(r.name) +
        "</td>" +
        "<td>" +
        r.mean.toFixed(1) +
        "</td>" +
        "<td>" +
        r.max +
        "</td>" +
        "<td>" +
        r.min +
        "</td>" +
        "<td>" +
        r.range +
        "</td>" +
        "<td>" +
        r.std.toFixed(1) +
        "</td>" +
        "<td>" +
        r.var +
        "</td>" +
        "<td>" +
        r.cv.toFixed(1) +
        "</td>" +
        "</tr>";
    }
    html += "</tbody></table></div>";
    container.innerHTML = html;
  }

  var _miniAreaUid = 0;

  function renderResultsHeroKpi(container, value, suffix) {
    container.innerHTML =
      '<div class="results-kpi-hero">' +
      '<p class="results-kpi-hero__label">Productividad total</p>' +
      '<p class="results-kpi-hero__value">' +
      escapeHtml(String(value)) +
      '<span class="results-kpi-hero__suffix">' +
      escapeHtml(suffix) +
      "</span></p></div>";
  }

  function renderCategoryStrip(container, categories, pillars) {
    var html = '<ul class="category-strip" role="list">';
    for (var i = 0; i < categories.length; i++) {
      html +=
        '<li class="category-strip__item">' +
        '<span class="category-strip__name">' +
        escapeHtml(categories[i].label) +
        '</span><span class="category-strip__val">' +
        pillars[i].value.toFixed(2) +
        '</span><span class="category-strip__unit">/100</span></li>';
    }
    html += "</ul>";
    container.innerHTML = html;
  }

  /** Donas: alinea categorías con valores por `key` (DRY con filtros turno/centro). */
  function buildDonutItemsFromView(categories, kpiPillars) {
    var byKey = {};
    for (var i = 0; i < kpiPillars.length; i++) {
      byKey[kpiPillars[i].key] = kpiPillars[i].value;
    }
    return categories.map(function (c) {
      return {
        label: c.label,
        value: byKey[c.key] != null ? byKey[c.key] : 0,
        color: c.color,
      };
    });
  }

  /** Donas SVG (trazo grueso, sin degradados CSS). */
  function renderReportDonutRow(container, items) {
    if (!container || !items || !items.length) return;
    var R = 34;
    var cLen = 2 * Math.PI * R;
    var html = '<div class="donut-row donut-row--report" role="list">';
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var pct = Math.min(100, Math.max(0, Number(it.value)));
      var dash = (pct / 100) * cLen;
      var gap = Math.max(0.001, cLen - dash);
      var vStr = pct.toFixed(2);
      html +=
        '<div class="donut-report" role="listitem">' +
        '<svg class="donut-report__svg" viewBox="0 0 92 92" aria-hidden="true">' +
        '<circle class="donut-report__bg" cx="46" cy="46" r="' +
        R +
        '" fill="none" stroke="rgba(226,232,240,0.95)" stroke-width="12"/>' +
        '<circle cx="46" cy="46" r="' +
        R +
        '" fill="none" stroke="' +
        escapeHtml(it.color) +
        '" stroke-width="12" stroke-linecap="round" transform="rotate(-90 46 46)" stroke-dasharray="' +
        dash +
        " " +
        gap +
        '"/>' +
        '<text class="donut-report__num" x="46" y="50" text-anchor="middle">' +
        escapeHtml(vStr) +
        "</text></svg>" +
        '<span class="donut-report__lbl">' +
        escapeHtml(it.label) +
        "</span></div>";
    }
    html += "</div>";
    container.innerHTML = html;
  }

  /** Barras verticales mensuales (informe): rejilla, valor encima. */
  function renderMonthlyBarsReport(container, opts) {
    if (!container) return;
    var labels = opts.monthLabels || [];
    var values = opts.values || [];
    var color = opts.color || "#0f3d6b";
    var title = opts.title || "";
    var maxY = typeof opts.maxY === "number" ? opts.maxY : 100;
    var w = 620;
    var h = 198;
    var pl = 44;
    var pr = 10;
    var pt = title ? 34 : 22;
    var pb = 34;
    var n = labels.length;
    var iw = w - pl - pr;
    var ih = h - pt - pb;
    var baseY = h - pb;
    var slot = n ? iw / n : iw;
    var bw = Math.max(4, slot * 0.52);
    var gap = slot - bw;
    var o = [];
    o.push(
      '<div class="monthly-bars-report chart-card chart-card--editorial">' +
        (title ? '<h4 class="chart-card__title">' + escapeHtml(title) + "</h4>" : "") +
        '<div class="monthly-bars-report__frame">'
    );
    o.push(
      '<svg class="monthly-bars-report__svg" viewBox="0 0 ' +
        w +
        " " +
        h +
        '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' +
        escapeHtml(title || "Índice por mes") +
        '">'
    );
    for (var g = 0; g <= 4; g++) {
      var gy = pt + (ih * g) / 4;
      o.push(
        '<line class="monthly-bars-report__grid" x1="' +
          pl +
          '" y1="' +
          gy +
          '" x2="' +
          (w - pr) +
          '" y2="' +
          gy +
          '"/>'
      );
    }
    o.push(
      '<line class="monthly-bars-report__axis" x1="' +
        pl +
        '" y1="' +
        baseY +
        '" x2="' +
        (w - pr) +
        '" y2="' +
        baseY +
        '"/>'
    );
    for (var i = 0; i < n; i++) {
      var v = values[i] != null ? Number(values[i]) : 0;
      var bh = (v / maxY) * ih;
      var x = pl + gap / 2 + i * slot;
      var y = baseY - bh;
      o.push(
        '<rect class="monthly-bars-report__bar" x="' +
          x +
          '" y="' +
          y +
          '" width="' +
          bw +
          '" height="' +
          Math.max(bh, 1.5) +
          '" rx="2" ry="2" fill="' +
          escapeHtml(color) +
          '"/>'
      );
      var vs = (Math.round(v * 100) / 100).toFixed(2);
      o.push(
        '<text class="monthly-bars-report__val" x="' +
          (x + bw / 2) +
          '" y="' +
          (y - 6) +
          '" text-anchor="middle">' +
          escapeHtml(vs) +
          "</text>"
      );
      o.push(
        '<text class="monthly-bars-report__tick" x="' +
          (x + bw / 2) +
          '" y="' +
          (baseY + 16) +
          '" text-anchor="middle">' +
          escapeHtml(labels[i] || "") +
          "</text>"
      );
    }
    o.push("</svg></div></div>");
    container.innerHTML = o.join("");
  }

  function renderComparativoReport(container, db, ropts) {
    ropts = ropts || {};
    if (!container || !db) return;
    var ref = db.kpiTotal != null ? db.kpiTotal : 84.04;
    var categories = db.categories || [];
    var pillars = db.kpiPillars || [];
    var deltas = db.categoryComparison || [];
    var deltaByKey = {};
    for (var di = 0; di < deltas.length; di++) {
      deltaByKey[deltas[di].key] = deltas[di].delta;
    }
    var byKey = {};
    for (var pj = 0; pj < pillars.length; pj++) {
      byKey[pillars[pj].key] = pillars[pj].value;
    }
    var ranked = categories
      .map(function (cat) {
        return {
          key: cat.key,
          label: cat.label,
          color: cat.color,
          value: byKey[cat.key] != null ? byKey[cat.key] : 0,
          delta: deltaByKey[cat.key] != null ? String(deltaByKey[cat.key]) : "—",
        };
      })
      .sort(function (a, b) {
        return b.value - a.value;
      });
    var html =
      '<div class="comparativo-report chart-card chart-card--editorial' +
      (ropts.compact ? " comparativo-report--compact" : "") +
      '">' +
      (ropts.skipTitle
        ? ""
        : '<h4 class="chart-card__title">Comparativo de categorías frente a la referencia global</h4>') +
      '<p class="comparativo-report__legend">' +
      '<span class="comparativo-report__leg comparativo-report__leg--ref">Referencia: productividad total</span>' +
      '<span class="comparativo-report__leg comparativo-report__leg--cat">Magnitud por categoría</span>' +
      "</p>" +
      '<div class="comparativo-report__head">' +
      '<span class="comparativo-report__h-rank">#</span>' +
      '<span class="comparativo-report__h-lbl">Categoría</span>' +
      '<span class="comparativo-report__h-bar">Distribución (0–100)</span>' +
      '<span class="comparativo-report__h-val">Valor</span>' +
      '<span class="comparativo-report__h-delta">Δ</span>' +
      "</div>" +
      '<div class="comparativo-report__rows">';
    for (var r = 0; r < ranked.length; r++) {
      var row = ranked[r];
      var wRef = Math.min(100, Math.max(0, ref));
      var wAct = Math.min(100, Math.max(0, row.value));
      var d0 = row.delta.length ? row.delta.charAt(0) : "";
      var deltaExtra =
        d0 === "-" || d0 === "\u2212"
          ? " comparativo-report__delta--down"
          : d0 === "+"
            ? " comparativo-report__delta--up"
            : " comparativo-report__delta--neutral";
      html +=
        '<div class="comparativo-report__row">' +
        '<span class="comparativo-report__rank">' +
        (r + 1) +
        "</span>" +
        '<span class="comparativo-report__label">' +
        escapeHtml(row.label) +
        '</span><div class="comparativo-report__track">' +
        '<span class="comparativo-report__ref" style="width:' +
        wRef +
        '%"></span>' +
        '<span class="comparativo-report__act" style="width:' +
        wAct +
        "%;background:" +
        escapeHtml(row.color) +
        '"></span></div>' +
        '<span class="comparativo-report__num">' +
        row.value.toFixed(2) +
        '</span><span class="comparativo-report__delta' +
        deltaExtra +
        '">' +
        escapeHtml(row.delta) +
        "</span></div>";
    }
    html += "</div></div>";
    container.innerHTML = html;
  }

  function applyResultsView(d) {
    var data = d || DATA();
    var db = data.dashboards;
    if (!db) return;
    var ri = data.resultsIntro || {};

    var root = qs(document, "[data-results-content]");
    if (root) {
      var eyebrow = qs(root, "[data-results-page-eyebrow]");
      if (eyebrow && ri.pageEyebrow) eyebrow.textContent = ri.pageEyebrow;
      var deckEl = qs(root, "[data-results-deck]");
      if (deckEl && ri.deck) deckEl.textContent = ri.deck;
      var scopeTitleEl = qs(root, "[data-results-scope-title]");
      if (scopeTitleEl) {
        var scopeTitle = ri.scopeTitle || "";
        scopeTitleEl.textContent = scopeTitle;
        scopeTitleEl.hidden = !scopeTitle;
      }
      var chips = qs(root, "[data-results-static-chips]");
      if (chips && db.overviewChips) renderFilterBar(chips, db.overviewChips, { bare: true });
      var heroK = qs(root, "[data-results-main-kpi]");
      if (heroK) renderResultsHeroKpi(heroK, db.kpiTotal.toFixed(2), " / 100");
      var donuts = qs(root, "[data-results-donut-row]");
      if (donuts) renderReportDonutRow(donuts, buildDonutItemsFromView(db.categories, db.kpiPillars));
      var trend = qs(root, "[data-results-trend-chart]");
      if (trend && ri.trendSeriesTotal && ri.trendSeriesTotal.length && ri.trendLabels) {
        renderGroupedMonthlyChart(trend, {
          monthLabels: ri.trendLabels,
          seriesDefs: [
            {
              label: "Productividad Global",
              color: "#2563ab",
              values: ri.trendSeriesTotal,
            },
          ],
          minY: 75,
          maxY: 90,
          showValues: true,
          cardClass: "chart-card--no-border",
        });
      }
      var interp = qs(root, "[data-results-interpretation]");
      if (interp && ri.interpretation) interp.textContent = ri.interpretation;
    }

    var a = qs(document, "[data-dash-a]");
    if (a) {
      var excelHost = qs(a, "[data-dashboard-productividad]");
      if (excelHost) renderDashboardProductividadExcel(excelHost, db);
      var analysis = qs(a, "[data-dash-analysis-main]");
      if (analysis && db.analysisMain) analysis.textContent = db.analysisMain;
    }

  }

  function buildTrendAreaSvg(labels, series, opts) {
    var o = opts || {};
    var w = o.width || 560;
    var h = o.height || 172;
    var padL = o.padL != null ? o.padL : 48;
    var padR = o.padR || 12;
    var padT = o.padT != null ? o.padT : 18;
    var padB = o.padB != null ? o.padB : 30;
    var stroke = o.stroke || "#2563ab";
    var fill = o.fill || "#2563ab";
    var innerW = w - padL - padR;
    var innerH = h - padT - padB;
    var n = series.length;
    var dataMin = Math.min.apply(null, series);
    var dataMax = Math.max.apply(null, series);
    var span = Math.max(dataMax - dataMin, 0.5);
    var padY = Math.max(span * 0.12, 0.45);
    var min = o.yMin != null ? o.yMin : dataMin - padY;
    var max = o.yMax != null ? o.yMax : dataMax + padY;
    if (!(max > min)) max = min + 1;
    min = Math.floor(min * 10) / 10;
    max = Math.ceil(max * 10) / 10;
    if (!(max > min)) max = min + 0.5;
    var yRange = max - min;
    function yAt(v) {
      return padT + innerH - ((v - min) / yRange) * innerH;
    }
    var pts = [];
    for (var i = 0; i < n; i++) {
      var x = padL + (n <= 1 ? innerW / 2 : (i / Math.max(1, n - 1)) * innerW);
      var y = yAt(series[i]);
      pts.push({ x: x, y: y, lab: labels[i] || "", val: series[i] });
    }
    var baseline = h - padB;
    var useSmooth = o.smooth !== false && pts.length > 2;
    var dLine;
    var dArea;
    if (useSmooth) {
      dLine = smoothSvgPathThroughPoints(pts, false);
      dArea =
        dLine + " L " + pts[pts.length - 1].x + " " + baseline + " L " + pts[0].x + " " + baseline + " Z";
    } else {
      dLine = "M " + pts[0].x + " " + pts[0].y;
      for (var j = 1; j < pts.length; j++) {
        dLine += " L " + pts[j].x + " " + pts[j].y;
      }
      dArea = dLine + " L " + pts[pts.length - 1].x + " " + baseline + " L " + pts[0].x + " " + baseline + " Z";
    }
    var tickCount = 5;
    var gridSvg = "";
    var yTickSvg = "";
    for (var ti = 0; ti < tickCount; ti++) {
      var tv = max - (ti / Math.max(1, tickCount - 1)) * yRange;
      var gy = yAt(tv);
      gridSvg +=
        '<line class="trend-svg__grid" x1="' +
        padL +
        '" y1="' +
        gy +
        '" x2="' +
        (w - padR) +
        '" y2="' +
        gy +
        '"/>';
      var tickStr = Math.round(tv * 100) / 100;
      var tickLabel = tickStr % 1 === 0 ? String(tickStr) : tickStr.toFixed(1);
      yTickSvg +=
        '<text class="trend-svg__ytick" text-anchor="end" x="' +
        (padL - 6) +
        '" y="' +
        (gy + 3) +
        '">' +
        escapeHtml(tickLabel) +
        "</text>";
    }
    var xAxisTitle = o.xAxisTitle ? String(o.xAxisTitle) : "";
    var yAxisTitle = o.yAxisTitle ? String(o.yAxisTitle) : "";
    var monthLabY = xAxisTitle ? h - 18 : h - 5;
    var labelStep = n <= 12 ? 1 : Math.max(1, Math.ceil(n / 6));
    var labelsSvg = "";
    for (var k = 0; k < n; k += labelStep) {
      labelsSvg +=
        '<text class="trend-svg__label" text-anchor="middle" x="' +
        pts[k].x +
        '" y="' +
        monthLabY +
        '">' +
        escapeHtml(String(pts[k].lab)) +
        "</text>";
    }
    var axisCapSvg = "";
    if (yAxisTitle) {
      axisCapSvg +=
        '<text class="trend-svg__axis-cap trend-svg__axis-cap--y" transform="translate(14,' +
        (padT + innerH / 2) +
        ') rotate(-90)" text-anchor="middle">' +
        escapeHtml(yAxisTitle) +
        "</text>";
    }
    if (xAxisTitle) {
      axisCapSvg +=
        '<text class="trend-svg__axis-cap trend-svg__axis-cap--x" x="' +
        (padL + innerW / 2) +
        '" y="' +
        (h - 4) +
        '" text-anchor="middle">' +
        escapeHtml(xAxisTitle) +
        "</text>";
    }
    var showPt = o.showPointValues === true;
    var ptsSvg = "";
    if (showPt) {
      for (var p = 0; p < n; p++) {
        var pv = Math.round(pts[p].val * 100) / 100;
        var pvs = pv % 1 === 0 ? String(pv) : pv.toFixed(2);
        ptsSvg +=
          '<circle class="trend-svg__ptdot" cx="' +
          pts[p].x +
          '" cy="' +
          pts[p].y +
          '" r="3.2" fill="#fff" stroke="' +
          escapeHtml(stroke) +
          '" stroke-width="1.6"/>' +
          '<text class="trend-svg__ptval" text-anchor="middle" x="' +
          pts[p].x +
          '" y="' +
          (pts[p].y - 9) +
          '">' +
          escapeHtml(pvs) +
          "</text>";
      }
    }
    var fillOp = typeof o.fillOpacity === "number" ? o.fillOpacity : 0.14;
    return (
      '<svg class="trend-svg trend-svg--scaled" viewBox="0 0 ' +
      w +
      " " +
      h +
      '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Tendencia mensual del índice global">' +
      gridSvg +
      yTickSvg +
      '<line class="trend-svg__axis" x1="' +
      padL +
      '" y1="' +
      baseline +
      '" x2="' +
      (w - padR) +
      '" y2="' +
      baseline +
      '"/>' +
      '<path class="trend-svg__area trend-svg__area--flat" d="' +
      dArea +
      '" fill="' +
      escapeHtml(fill) +
      '" fill-opacity="' +
      fillOp +
      '"/>' +
      '<path class="trend-svg__line" d="' +
      dLine +
      '" stroke="' +
      escapeHtml(stroke) +
      '"/>' +
      ptsSvg +
      labelsSvg +
      axisCapSvg +
      "</svg>"
    );
  }

  /**
   * Barras agrupadas por mes — cinco series (total + dimensiones), ejes Valor / Tiempo.
   */
  function renderIntegratedMonthlySvg(container, opts) {
    if (!container) return;
    var monthLabels = opts.monthLabels || [];
    var seriesDefs = opts.seriesDefs || [];
    var title = opts.title || "";
    var maxY = typeof opts.maxY === "number" ? opts.maxY : 100;
    var yCap = opts.yAxisTitle || "Valor";
    var xCap = opts.xAxisTitle || "Tiempo";
    var nM = monthLabels.length;
    var nS = seriesDefs.length;
    if (!nM || !nS) return;

    var compact = opts.compact === true;
    var overlayBars = opts.overlayBars === true;
    var w = compact ? 652 : 688;
    /* pt alto: deja margen para la etiqueta «100» del eje Y y los valores sobre barras máximas */
    var h = compact ? 200 : 258;
    var pl = compact ? 44 : 50;
    var pr = compact ? 8 : 14;
    var pt = compact ? 16 : 16;
    var pb = compact ? 34 : 46;
    var iw = w - pl - pr;
    var ih = h - pt - pb;
    var baseY = h - pb;
    var monthSlot = iw / nM;
    var groupPad = monthSlot * (overlayBars ? 0.12 : 0.06);
    var groupW = monthSlot - 2 * groupPad;
    var innerGap = 1.25;
    var barW = Math.max(2.2, (groupW - innerGap * (nS - 1)) / nS);

    var o = [];
    o.push(
      '<div class="integrated-monthly chart-card chart-card--editorial' +
        (compact ? " integrated-monthly--compact" : "") +
        '">' +
        (title ? '<h4 class="chart-card__title">' + escapeHtml(title) + "</h4>" : "") +
        '<div class="integrated-monthly__legend">'
    );
    for (var lg = 0; lg < nS; lg++) {
      o.push(
        '<span class="integrated-monthly__leg-item"><i style="background:' +
          escapeHtml(seriesDefs[lg].color) +
          '"></i>' +
          escapeHtml(seriesDefs[lg].label) +
          "</span>"
      );
    }
    o.push(
      '</div><svg class="integrated-monthly__svg" viewBox="0 0 ' +
        w +
        " " +
        h +
        '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' +
        escapeHtml(title || "Indicadores por mes") +
        '">'
    );

    var tickSteps = 5;
    for (var g = 0; g <= tickSteps; g++) {
      var tv = (maxY * (tickSteps - g)) / tickSteps;
      var gy = pt + (ih * g) / tickSteps;
      var tlab = tv % 1 === 0 ? String(Math.round(tv)) : tv.toFixed(1);
      o.push(
        '<text class="integrated-monthly__ytick" text-anchor="end" dominant-baseline="middle" x="' +
          (pl - 5) +
          '" y="' +
          (g === 0 ? gy + 5 : gy + 3) +
          '">' +
          escapeHtml(tlab) +
          "</text>"
      );
    }

    o.push(
      '<line class="integrated-monthly__axis" x1="' +
        pl +
        '" y1="' +
        baseY +
        '" x2="' +
        (w - pr) +
        '" y2="' +
        baseY +
        '"/>'
    );

    o.push(
      '<text class="integrated-monthly__axis-cap integrated-monthly__axis-cap--y" transform="translate(12,' +
        (pt + ih / 2) +
        ') rotate(-90)" text-anchor="middle">' +
        escapeHtml(yCap) +
        "</text>"
    );
    o.push(
      '<text class="integrated-monthly__axis-cap integrated-monthly__axis-cap--x" x="' +
        (pl + iw / 2) +
        '" y="' +
        (h - 6) +
        '" text-anchor="middle">' +
        escapeHtml(xCap) +
        "</text>"
    );

    for (var m = 0; m < nM; m++) {
      var gx0 = pl + m * monthSlot + groupPad;
      if (overlayBars) {
        var cx0 = gx0 + groupW / 2;
        var outerVal = seriesDefs[0].values[m] != null ? Number(seriesDefs[0].values[m]) : 0;
        var outerH = (outerVal / maxY) * ih;
        var outerW = Math.max(10, groupW * 0.68);
        var outerX = cx0 - outerW / 2;
        var outerY = baseY - outerH;
        o.push(
          '<rect class="integrated-monthly__bar integrated-monthly__bar--outline" x="' +
            outerX +
            '" y="' +
            outerY +
            '" width="' +
            outerW +
            '" height="' +
            Math.max(outerH, 1.2) +
            '" rx="1.4" ry="1.4" fill="none" stroke="' +
            escapeHtml(seriesDefs[0].color) +
            '" stroke-width="2.6"/>'
        );
        o.push(
          '<text class="integrated-monthly__barval" x="' +
            cx0 +
            '" y="' +
            (outerY - 3) +
            '" text-anchor="middle">' +
            escapeHtml((Math.round(outerVal * 100) / 100).toFixed(2)) +
            "</text>"
        );
        for (var os = 1; os < nS; os++) {
          var oval = seriesDefs[os].values[m] != null ? Number(seriesDefs[os].values[m]) : 0;
          var oh = (oval / maxY) * ih;
          var ow = Math.max(5.5, outerW * (0.68 - (os - 1) * 0.1));
          var ox = cx0 - ow / 2;
          var oy = baseY - oh;
          o.push(
            '<rect class="integrated-monthly__bar" x="' +
              ox +
              '" y="' +
              oy +
              '" width="' +
              ow +
              '" height="' +
              Math.max(oh, 1.1) +
              '" rx="1.1" ry="1.1" fill="' +
              escapeHtml(seriesDefs[os].color) +
              '" fill-opacity="0.92"/>'
          );
          o.push(
            '<text class="integrated-monthly__barval" x="' +
              cx0 +
              '" y="' +
              (oy - 2.5) +
              '" text-anchor="middle">' +
              escapeHtml((Math.round(oval * 100) / 100).toFixed(2)) +
              "</text>"
          );
        }
      } else {
        for (var s = 0; s < nS; s++) {
          var val = seriesDefs[s].values[m] != null ? Number(seriesDefs[s].values[m]) : 0;
          var bh = (val / maxY) * ih;
          var bx = gx0 + s * (barW + innerGap);
          var by = baseY - bh;
          o.push(
            '<rect class="integrated-monthly__bar" x="' +
              bx +
              '" y="' +
              by +
              '" width="' +
              barW +
              '" height="' +
              Math.max(bh, 1.2) +
              '" rx="1.2" ry="1.2" fill="' +
              escapeHtml(seriesDefs[s].color) +
              '"/>'
          );
          var vs = (Math.round(val * 100) / 100).toFixed(2);
          o.push(
            '<text class="integrated-monthly__barval" x="' +
              (bx + barW / 2) +
              '" y="' +
              (by - 3) +
              '" text-anchor="middle">' +
              escapeHtml(vs) +
              "</text>"
          );
        }
      }
      var cx = pl + m * monthSlot + monthSlot / 2;
      o.push(
        '<text class="integrated-monthly__xtick" text-anchor="middle" x="' +
          cx +
          '" y="' +
          (baseY + 14) +
          '">' +
          escapeHtml(monthLabels[m] || "") +
          "</text>"
      );
    }

    o.push("</svg></div>");
    container.innerHTML = o.join("");
  }

  function renderMiniAreaSvg(series, accent) {
    var w = 280;
    var h = 72;
    var pad = 4;
    var innerW = w - 2 * pad;
    var innerH = h - 2 * pad;
    var min = 0;
    var max = 100;
    var n = series.length;
    var pts = [];
    for (var i = 0; i < n; i++) {
      var x = pad + (n <= 1 ? innerW / 2 : (i / Math.max(1, n - 1)) * innerW);
      var y = pad + innerH - ((series[i] - min) / (max - min)) * innerH;
      pts.push({ x: x, y: y });
    }
    var baseline = h - pad;
    var dLine = "M " + pts[0].x + " " + pts[0].y;
    for (var j = 1; j < pts.length; j++) {
      dLine += " L " + pts[j].x + " " + pts[j].y;
    }
    var dArea = dLine + " L " + pts[pts.length - 1].x + " " + baseline + " L " + pts[0].x + " " + baseline + " Z";
    var ac = accent || "#2563ab";
    var gid = "miniFill" + _miniAreaUid++;
    return (
      '<svg class="trend-svg" viewBox="0 0 ' +
      w +
      " " +
      h +
      '" preserveAspectRatio="none" aria-hidden="true">' +
      "<defs>" +
      '<linearGradient id="' +
      gid +
      '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="' +
      escapeHtml(ac) +
      '" stop-opacity="0.3"/>' +
      '<stop offset="100%" stop-color="' +
      escapeHtml(ac) +
      '" stop-opacity="0.04"/></linearGradient></defs>' +
      '<path class="trend-svg__area" d="' +
      dArea +
      '" fill="url(#' +
      gid +
      ')"/>' +
      '<path class="trend-svg__line" d="' +
      dLine +
      '" stroke="' +
      escapeHtml(ac) +
      '"/>' +
      "</svg>"
    );
  }

  function renderAreaChartGrid(container, cards) {
    var html = '<div class="area-chart-grid">';
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i];
      html +=
        '<div class="area-chart-tile">' +
        '<h5 class="area-chart-tile__title">' +
        escapeHtml(c.title) +
        "</h5>" +
        '<div class="area-chart-tile__viz">' +
        renderMiniAreaSvg(c.series, c.accent) +
        "</div></div>";
    }
    html += "</div>";
    container.innerHTML = html;
  }

  function renderRankingBars(container, sortedPillars, categoryAverage) {
    var html =
      '<div class="rank-bars"><p class="rank-bars__ref">Promedio aritmético de categorías: <strong>' +
      categoryAverage.toFixed(2) +
      "</strong></p>";
    for (var i = 0; i < sortedPillars.length; i++) {
      var p = sortedPillars[i];
      var rank = i + 1;
      var gap = p.value - categoryAverage;
      var gapStr = (gap >= 0 ? "+" : "") + gap.toFixed(1);
      html +=
        '<div class="rank-bars__row">' +
        '<span class="rank-bars__rank">' +
        rank +
        "</span>" +
        '<span class="rank-bars__label">' +
        escapeHtml(p.label) +
        "</span>" +
        '<div class="rank-bars__track"><span class="rank-bars__fill" style="width:' +
        p.value +
        "%;background:" +
        escapeHtml(p.color) +
        '"></span></div>' +
        '<span class="rank-bars__val">' +
        p.value.toFixed(2) +
        '</span><span class="rank-bars__gap">' +
        gapStr +
        "</span></div>";
    }
    html += "</div>";
    container.innerHTML = html;
  }

  function computeStatsInsights(rows) {
    var sum = 0;
    var maxVar = rows[0];
    var minCv = rows[0];
    for (var i = 0; i < rows.length; i++) {
      sum += rows[i].mean;
      if (rows[i].var > maxVar.var) maxVar = rows[i];
      if (rows[i].cv < minCv.cv) minCv = rows[i];
    }
    return {
      meanOfMeans: sum / rows.length,
      highestVariance: maxVar,
      mostStable: minCv,
    };
  }

  function renderStatsSummary(container, insights) {
    container.innerHTML =
      '<div class="stats-summary">' +
      '<div class="stats-summary__item"><span class="stats-summary__k">Media de las medias</span><span class="stats-summary__v">' +
      insights.meanOfMeans.toFixed(2) +
      "</span></div>" +
      '<div class="stats-summary__item"><span class="stats-summary__k">Mayor varianza</span><span class="stats-summary__v">' +
      escapeHtml(insights.highestVariance.name) +
      " — " +
      insights.highestVariance.var +
      "</span></div>" +
      '<div class="stats-summary__item"><span class="stats-summary__k">Mayor estabilidad (menor CV)</span><span class="stats-summary__v">' +
      escapeHtml(insights.mostStable.name) +
      " — " +
      insights.mostStable.cv.toFixed(1) +
      "%</span></div></div>";
  }

  function renderStatsTableEditorial(container, rows) {
    var insights = computeStatsInsights(rows);
    var maxMean = rows[0].mean;
    var minMean = rows[0].mean;
    for (var m = 1; m < rows.length; m++) {
      if (rows[m].mean > maxMean) maxMean = rows[m].mean;
      if (rows[m].mean < minMean) minMean = rows[m].mean;
    }
    var html =
      '<div class="table-scroll stats-table-wrap"><table class="stats-table stats-table--editorial"><thead><tr>' +
      "<th>Variable</th><th>Media</th><th>Máx.</th><th>Mín.</th><th>Rango</th><th>DE</th><th>Varianza</th><th>CV %</th>" +
      "</tr></thead><tbody>";
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      var trCls = "";
      if (r.name === insights.highestVariance.name) trCls += "stats-table__row--variance ";
      if (r.name === insights.mostStable.name) trCls += "stats-table__row--stable ";
      var meanClass = "";
      if (Math.abs(r.mean - maxMean) < 0.05) meanClass = "stats-table__cell--max";
      else if (Math.abs(r.mean - minMean) < 0.05) meanClass = "stats-table__cell--min";
      html +=
        "<tr" +
        (trCls.trim() ? ' class="' + trCls.trim() + '"' : "") +
        ">" +
        "<td>" +
        escapeHtml(r.name) +
        "</td>" +
        "<td" +
        (meanClass ? ' class="' + meanClass + '"' : "") +
        ">" +
        r.mean.toFixed(1) +
        "</td>" +
        "<td>" +
        r.max +
        "</td>" +
        "<td>" +
        r.min +
        "</td>" +
        "<td>" +
        r.range +
        "</td>" +
        "<td>" +
        r.std.toFixed(1) +
        "</td>" +
        "<td>" +
        r.var +
        "</td>" +
        "<td>" +
        r.cv.toFixed(1) +
        "</td></tr>";
    }
    html += "</tbody></table></div>";
    container.innerHTML = html;
  }

  /**
   * Diagrama de clústeres — SVG con posiciones fijas (reinterpretación premium, tonos azules).
   */
  function clusterDiagramSvg() {
    var nodes = [
      { id: "n1", x: 80, y: 200, r: 38, label: "Individual" },
      { id: "n2", x: 200, y: 90, r: 40, label: "Organizacional" },
      { id: "n3", x: 200, y: 310, r: 38, label: "Grupal" },
      { id: "n4", x: 400, y: 200, r: 44, label: "Mano de obra" },
      { id: "n5", x: 600, y: 90, r: 40, label: "Finanzas corp." },
      { id: "n6", x: 600, y: 310, r: 38, label: "Procesos" },
      { id: "n7", x: 720, y: 200, r: 40, label: "Maquinaria…" },
    ];
    var edges = [
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 3],
      [3, 4],
      [3, 5],
      [3, 6],
      [4, 5],
      [4, 6],
      [5, 6],
    ];
    var colors = ["#1e3a5f", "#1e4976", "#2563ab", "#2f6fb3", "#3b82c4", "#4f8fce", "#6ba7d6"];
    var svg =
      '<svg class="cluster-diagram" viewBox="0 0 800 440" xmlns="http://www.w3.org/2000/svg" aria-label="Diagrama de clústeres de entrada hacia productividad">';
    svg += '<defs><marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8"/></marker></defs>';
    for (var e = 0; e < edges.length; e++) {
      var a = nodes[edges[e][0]];
      var b = nodes[edges[e][1]];
      svg +=
        '<path class="cluster-edge" data-cluster-edge d="M ' +
        a.x +
        " " +
        a.y +
        " L " +
        b.x +
        " " +
        b.y +
        '" stroke="#64748b" stroke-width="2" stroke-dasharray="4 6" fill="none" opacity="0.55"/>';
    }
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var c = colors[i % colors.length];
      svg += '<g class="cluster-node" data-cluster-node transform="translate(' + n.x + "," + n.y + ')">';
      svg += '<circle r="' + (n.r + 18) + '" fill="none" stroke="' + c + '" stroke-width="1" stroke-dasharray="3 6" opacity="0.35"/>';
      svg += '<circle r="' + (n.r + 8) + '" fill="none" stroke="' + c + '" stroke-width="1.5" stroke-dasharray="6 8" opacity="0.5"/>';
      svg += '<circle r="' + n.r + '" fill="' + c + '" opacity="0.92"/>';
      svg +=
        '<text text-anchor="middle" dy="4" fill="#fff" font-size="11" font-family="system-ui,sans-serif" font-weight="600">' +
        escapeHtml(n.label) +
        "</text>";
      svg += "</g>";
    }
    svg += '<text x="400" y="382" text-anchor="middle" fill="#0f172a" font-size="15" font-weight="800" font-family="system-ui,sans-serif">Productividad</text>';
    var outY = 400;
    var outs = ["Eficiencia", "Eficacia", "Flexibilidad", "Crecimiento"];
    var ox = [220, 320, 420, 520];
    for (var o = 0; o < 4; o++) {
      svg +=
        '<g transform="translate(' +
        ox[o] +
        " " +
        outY +
        ')" data-output-node>';
      svg += '<circle r="12" fill="#475569" opacity="0.9"/>';
      svg +=
        '<text y="22" text-anchor="middle" fill="#0f172a" font-size="9" font-weight="600" font-family="system-ui,sans-serif">' +
        escapeHtml(outs[o]) +
        "</text>";
      svg += "</g>";
    }
    svg += "</svg>";
    return svg;
  }

  function fillHero() {
    var d = DATA();
    var hero = qs(document, "[data-section-hero]");
    if (!hero) return;
    var hl = qs(hero, "[data-hero-headline], .cover__headline");
    if (hl) hl.innerHTML = d.hero.headline;
    var sl = qs(hero, "[data-hero-subline], .cover__subline");
    if (sl) sl.textContent = d.hero.subline;
    var bd = qs(hero, "[data-hero-badge], .cover__badge");
    if (bd) bd.textContent = d.hero.badge;
    /* Alternativas de titular omitidas en la portada full-bleed */
    var coverVis = qs(hero, "[data-cover-visual]");
    if (coverVis && d.hero.coverImage) {
      fillCoverVisual(coverVis, d.hero.coverImage);
    }
    var logo = qs(hero, "[data-logo-in3], .cover__logo-in3");
    if (logo && d.assets.logoIn3) {
      logo.src = assetPath(d.assets.logoIn3);
      logo.alt = "Corporación IN3";
    }
    var logoEfa = qs(hero, "[data-logo-efacticom]");
    if (logoEfa && d.assets.logoEfacticomWordmark) {
      logoEfa.src = assetPath(d.assets.logoEfacticomWordmark);
      logoEfa.alt = "EFACTICOM";
    }
    var explore = qs(hero, "[data-hero-explore]");
    if (explore && d.hero.ctaExplore) {
      explore.setAttribute("href", d.hero.ctaExplore.href);
      explore.textContent = d.hero.ctaExplore.label;
    }
    var yr = qs(hero, "[data-cover-year]");
    if (yr && d.meta && d.meta.year) {
      yr.textContent = d.meta.year;
    }
    var designCred = qs(hero, "[data-hero-design-credit]");
    if (designCred) {
      var dgHero = d.closing && d.closing.backCover && d.closing.backCover.designer;
      if (dgHero && dgHero.name) {
        var hHref = absoluteHttpUrl(dgHero.linkedin);
        var roleH = escapeHtml(dgHero.role || "Diseño editorial y digital");
        var nameH = escapeHtml(dgHero.name);
        designCred.innerHTML =
          roleH +
          ": " +
          (hHref
            ? '<a href="' +
              escapeHtml(hHref) +
              '" target="_blank" rel="noopener noreferrer">' +
              nameH +
              "</a>"
            : nameH);
      } else {
        designCred.innerHTML = "";
      }
    }
  }

  function fillPageNav() {
    var d = DATA();
    var nodes = qsa(document, "[data-doc-page-nav]");
    if (!nodes.length) return;
    var home = docNavHref({ hash: "#hero" });
    var globalCurrent = document.body.getAttribute("data-doc-current") || "";
    
    for (var n = 0; n < nodes.length; n++) {
      var navEl = nodes[n];
      var parentSec = navEl.closest ? navEl.closest("section.doc-page") : null;
      var secId = parentSec ? (parentSec.id || "") : "";
      
      var localCurrent = globalCurrent;
      if (secId) {
        if (secId.indexOf("hero") > -1) localCurrent = "portada";
        else if (secId.indexOf("contenido") > -1) localCurrent = "contenido";
        else if (secId.indexOf("acerca") > -1) localCurrent = "acerca";
        else if (secId.indexOf("contexto") > -1) localCurrent = "contexto";
        else if (secId.indexOf("resultado") > -1 || secId.indexOf("dash") > -1) localCurrent = "resultados";
        else if (secId.indexOf("cierre") > -1) localCurrent = "cierre";
      }

      var linkParts = [];
      for (var i = 0; i < d.nav.length; i++) {
        var item = d.nav[i];
        
        var isCurrent = item.slug === localCurrent;
        linkParts.push(
          '<a class="doc-page__nav-link' +
            (isCurrent ? " doc-page__nav-link--current" : "") +
            '" data-nav-slug="' +
            escapeHtml(item.slug) +
            '" href="' +
            escapeHtml(docNavHref(item)) +
            '"' +
            (isCurrent ? ' aria-current="page" data-local-current="true"' : "") +
            '>' +
            escapeHtml(item.label) +
            "</a>"
        );
      }
      
      var isHomeCurrent = localCurrent === "portada";
      var navHtml =
        '<span class="doc-page__nav-inner">' +
        '<a class="doc-page__nav-home' + (isHomeCurrent ? ' doc-page__nav-home--current' : '') + '" href="' +
        escapeHtml(home) +
        '" data-nav-slug="portada" title="Portada" aria-label="Portada"' +
        (isHomeCurrent ? ' data-local-current="true"' : '') + '>' +
        '<svg class="doc-page__nav-home-icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>' +
        "</svg></a>" +
        '<span class="doc-page__nav-links">' +
        linkParts.join('<span class="doc-page__nav-sep" aria-hidden="true">·</span>') +
        "</span></span>";
        
      navEl.innerHTML = navHtml;

      var pageNum = escapeHtml(navEl.getAttribute("data-page-num") || "");
      if (pageNum) {
        navEl.insertAdjacentHTML("beforeend", '<span class="doc-page__nav-num">' + pageNum + "</span>");
      }
    }
  }

  function bindQuickNavCurrent() {
    var d = DATA();
    var rawTargets = [];
    for (var i = 0; i < d.nav.length; i++) {
      var item = d.nav[i];
      if (!item.hash) continue;
      var id = String(item.hash).replace(/^#/, "");
      if (!id) continue;
      // Include section cover page (cover-{slug}) so nav highlights correctly
      var coverEl = document.getElementById("cover-" + item.slug);
      if (coverEl) rawTargets.push({ slug: item.slug, el: coverEl });
      var el = document.getElementById(id);
      if (!el) continue;
      rawTargets.push({ slug: item.slug, el: el });
    }
    // Sort by document order so scroll tracker is accurate
    var targets = rawTargets.slice().sort(function (a, b) {
      var da = a.el.getBoundingClientRect().top + window.scrollY;
      var db = b.el.getBoundingClientRect().top + window.scrollY;
      return da - db;
    });
    if (!targets.length) return;

    function setCurrentSlug(slug) {
      var links = qsa(document, ".doc-page__nav-link");
      for (var j = 0; j < links.length; j++) {
        var link = links[j];
        var isCurrent = link.getAttribute("data-nav-slug") === slug;
        if (isCurrent) {
          link.classList.add("doc-page__nav-link--current");
          link.setAttribute("aria-current", "page");
        } else {
          link.classList.remove("doc-page__nav-link--current");
          link.removeAttribute("aria-current");
        }
      }
      var homes = qsa(document, ".doc-page__nav-home");
      for (var k = 0; k < homes.length; k++) {
        var home = homes[k];
        if (slug === "portada") {
          home.classList.add("doc-page__nav-home--current");
          home.setAttribute("aria-current", "page");
        } else {
          home.classList.remove("doc-page__nav-home--current");
          home.removeAttribute("aria-current");
        }
      }
    }

    function update() {
      // Don't run scroll tracker during print — the static per-page data-local-current handles it
      if (window.matchMedia && window.matchMedia('print').matches) return;
      var marker = (window.innerHeight || 700) * 0.28;
      var activeSlug = targets[0].slug;
      for (var n = 0; n < targets.length; n++) {
        var rect = targets[n].el.getBoundingClientRect();
        if (rect.top <= marker) activeSlug = targets[n].slug;
      }
      setCurrentSlug(activeSlug);
    }

    var ticking = false;
    function onScrollOrResize() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        update();
      });
    }
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("hashchange", onScrollOrResize);
    window.addEventListener("load", onScrollOrResize);
    
    // Freeze nav highlighting during print to preserve per-page data-local-current
    window.addEventListener("beforeprint", function () {
      var links = qsa(document, ".doc-page__nav-link, .doc-page__nav-home");
      for (var i = 0; i < links.length; i++) {
        links[i].setAttribute("data-print-class", links[i].className);
        // Strip all JS-applied current classes — only data-local-current survives
        links[i].classList.remove("doc-page__nav-link--current");
        links[i].classList.remove("doc-page__nav-home--current");
        links[i].removeAttribute("aria-current");
      }
      // Re-apply correct active state from data-local-current
      var currents = qsa(document, "[data-local-current='true']");
      for (var j = 0; j < currents.length; j++) {
        if (currents[j].classList.contains("doc-page__nav-home")) {
          currents[j].classList.add("doc-page__nav-home--current");
        } else {
          currents[j].classList.add("doc-page__nav-link--current");
        }
      }
    });
    
    window.addEventListener("afterprint", function () {
      // Restore original classes after print
      var links = qsa(document, ".doc-page__nav-link, .doc-page__nav-home");
      for (var i = 0; i < links.length; i++) {
        var saved = links[i].getAttribute("data-print-class");
        if (saved !== null) links[i].className = saved;
        links[i].removeAttribute("data-print-class");
      }
      update();
    });
    
    update();
  }

  function fillNav() {
    var nav = qs(document, "[data-nav-list]");
    if (!nav) return;
    var d = DATA();
    var current = document.body.getAttribute("data-doc-current") || "";
    var html = "";
    for (var i = 0; i < d.nav.length; i++) {
      var item = d.nav[i];
      var href = docNavHref(item);
      var isCurrent = item.slug === current;
      html +=
        "<li><a class=\"doc-toolbar__link" +
        (isCurrent ? " doc-toolbar__link--current" : "") +
        '" href="' +
        escapeHtml(href) +
        '"' +
        (isCurrent ? ' aria-current="page"' : "") +
        ">" +
        escapeHtml(item.label) +
        "</a></li>";
    }
    nav.innerHTML = html;
  }

  function tocItemsForSectionNum(d, sectionNum) {
    var cols = d.toc && d.toc.columns;
    if (!cols) return [];
    var all = [].concat(cols.left || []).concat(cols.right || []);
    var sn = String(sectionNum);
    for (var i = 0; i < all.length; i++) {
      if (String(all[i].sectionNum) === sn) return all[i].items || [];
    }
    return [];
  }

  function renderSectionQuickJump(items) {
    if (!items || !items.length) return "";
    var label = "Acceso rápido a esta sección";
    function stripNumericPrefix(text) {
      return String(text || "").replace(/^\s*\d+(?:\.\d+)?\.?\s+/, "");
    }
    var lis = items
      .map(function (it) {
        var h = it.hash || "#";
        return (
          "<li><a class=\"section-cover__jump-link\" href=\"" +
          escapeHtml(h) +
          '"><span class="section-cover__jump-p">' +
          escapeHtml(it.page) +
          '</span><span class="section-cover__jump-txt">' +
          escapeHtml(stripNumericPrefix(it.label)) +
          "</span></a></li>"
        );
      })
      .join("");
    return (
      '<nav class="section-cover__jump" aria-label="' +
      escapeHtml(label) +
      '"><span class="section-cover__jump-label">' +
      escapeHtml(label) +
      '</span><ul class="section-cover__jump-list">' +
      lis +
      "</ul></nav>"
    );
  }

  function renderCoverFigure(img) {
    if (!img || !img.src) return "";
    return (
      '<figure class="section-cover__figure">' +
      '<img class="section-cover__img" src="' +
      escapeHtml(img.src) +
      '" alt="' +
      escapeHtml(img.alt || "") +
      '" loading="lazy" decoding="async" fetchpriority="low" />' +
      "</figure>"
    );
  }

  function renderCoverKpis(cards) {
    if (!cards || !cards.length) return "";
    var items = cards
      .map(function (c) {
        return (
          '<div class="cover-kpi-card">' +
          '<span class="cover-kpi-card__val">' +
          escapeHtml(c.value) +
          (c.unit ? '<span class="cover-kpi-card__unit">' + escapeHtml(c.unit) + "</span>" : "") +
          "</span>" +
          '<span class="cover-kpi-card__label">' +
          escapeHtml(c.label) +
          "</span>" +
          "</div>"
        );
      })
      .join("");
    return '<div class="cover-kpi-grid">' + items + "</div>";
  }

  function renderTocZigzagSection(sec, index) {
    var accent = sec.accent || "lime";
    var ac = escapeHtml(accent);
    var side = index % 2 === 0 ? "left" : "right";
    var titleInner;
    if (sec.anchor) {
      titleInner =
        '<a class="toc-zigzag__panel-title-link" href="' +
        escapeHtml(sec.anchor) +
        '"><span class="toc-zigzag__panel-title">' +
        escapeHtml(sec.title) +
        "</span></a>";
    } else {
      titleInner =
        '<span class="toc-zigzag__panel-title">' + escapeHtml(sec.title) + "</span>";
    }
    var panelHtml =
      '<div class="toc-zigzag__panel toc-zigzag__panel--' +
      ac +
      '">' +
      '<span class="toc-zigzag__panel-num">' +
      escapeHtml(sec.sectionNum) +
      "</span>" +
      "<h3 class=\"toc-zigzag__panel-heading\">" +
      titleInner +
      "</h3></div>";
    var listHtml =
      '<ul class="toc-block__list toc-block__list--minimal toc-zigzag__list">' +
      sec.items
        .map(function (it) {
          var h = it.hash || "#";
          var isCamino = /el camino hacia efacticom/i.test(it.label || "");
          var labelHtml;
          if (isCamino) {
            var raw = String(it.label || "");
            var parts = raw.split(/efacticom/i);
            labelHtml =
              escapeHtml(parts[0] || "") +
              "<em>EFACTICOM</em>" +
              escapeHtml(parts.slice(1).join("efacticom") || "");
          } else {
            labelHtml = escapeHtml(it.label);
          }
          return (
            "<li><a class=\"toc-block__row-link\" href=\"" +
            escapeHtml(h) +
            '"><span class="toc-block__text">' +
            labelHtml +
            "</span></a></li>"
          );
        })
        .join("") +
      "</ul>";
    var bodyHtml =
      '<div class="toc-zigzag__body">' +
      '<span class="toc-zigzag__bg-num" aria-hidden="true">' +
      escapeHtml(sec.sectionNum) +
      "</span>" +
      listHtml +
      "</div>";
    var cardInner = side === "left" ? panelHtml + bodyHtml : bodyHtml + panelHtml;
    return (
      '<article class="toc-zigzag__item toc-zigzag__item--' +
      side +
      ' toc-zigzag__item--accent-' +
      ac +
      '">' +
      '<div class="toc-zigzag__card">' +
      cardInner +
      "</div></article>"
    );
  }

  function fillToc() {
    var root = qs(document, "[data-toc-body]");
    if (!root) return;
    var d = DATA();
    var toc = d.toc;
    if (!toc || !toc.columns) return;
    var wm = qs(document, "[data-toc-watermark]");
    if (wm) wm.textContent = "CONTENIDO";
    var sections = [].concat(toc.columns.left || []).concat(toc.columns.right || []);
    sections = sections.map(function (sec, idx) {
      var next = {};
      var key;
      for (key in sec) {
        if (Object.prototype.hasOwnProperty.call(sec, key)) next[key] = sec[key];
      }
      next.sectionNum = String(idx + 1).padStart(2, "0");
      next.items = sec.items || [];
      return next;
    });
    var zigzagHtml = sections
      .map(function (sec, i) {
        return renderTocZigzagSection(sec, i);
      })
      .join("");
    var mainBlock =
      '<div class="toc-main-block">' +
      '<div class="toc-zigzag">' +
      zigzagHtml +
      "</div></div>";
    root.innerHTML =
      mainBlock +
      '<p class="toc-doc-line"><img class="toc-doc-line__logo" src="assets/logos/efacticom-blue.png" alt="EFACTICOM" width="190" height="41" /></p>';
    equalizeTocCards();
  }

  function equalizeTocCards() {
    var cards = qsa(document, ".toc-zigzag__card");
    if (!cards.length) return;
    for (var i = 0; i < cards.length; i++) {
      cards[i].style.removeProperty("min-height");
    }
    var max = 0;
    for (var j = 0; j < cards.length; j++) {
      if (cards[j].offsetHeight > max) max = cards[j].offsetHeight;
    }
    if (!max) return;
    for (var k = 0; k < cards.length; k++) {
      cards[k].style.minHeight = max + "px";
    }
  }

  function fillSectionCover() {
    var nodes = qsa(document, "[data-section-cover]");
    if (!nodes.length) return;
    var d = DATA();
    for (var n = 0; n < nodes.length; n++) {
      var el = nodes[n];
      var key = el.getAttribute("data-section-key");
      if (!key) continue;
      var sc = d.sectionCovers && d.sectionCovers[key];
      if (!sc) continue;
      var accent = sc.accent || "lime";
      var layout = sc.layout || "a";
      var deck = (sc.deck != null ? sc.deck : sc.intro) || "";
      var num = escapeHtml(sc.num);
      var title = escapeHtml(sc.title);
      var ac = escapeHtml(accent);
      var mega = '<p class="section-cover__mega" aria-hidden="true">' + num + "</p>";
      var serial = '<span class="section-cover__serial">' + num + "</span>";
      var h2 =
        '<h2 class="section-cover__heading">' + title + "</h2>";
      var deckP =
        deck ? '<p class="section-cover__deck">' + escapeHtml(deck) + "</p>" : "";
      var jumpHtml = renderSectionQuickJump(tocItemsForSectionNum(d, sc.num));
      var figHtml = renderCoverFigure(sc.coverImage);

      if (layout === "b") {
        el.innerHTML =
          '<div class="section-cover__shell section-cover__shell--b section-cover__shell--' +
          ac +
          '">' +
          mega +
          '<div class="section-cover__panel section-cover__panel--' +
          ac +
          '" aria-hidden="true"></div>' +
          '<div class="section-cover__split-main">' +
          serial +
          h2 +
          deckP +
          jumpHtml +
          figHtml +
          "</div></div>";
      } else if (layout === "c") {
        el.innerHTML =
          '<div class="section-cover__shell section-cover__shell--c section-cover__shell--' +
          ac +
          '">' +
          mega +
          '<div class="section-cover__centered">' +
          serial +
          h2 +
          deckP +
          jumpHtml +
          "</div>" +
          figHtml +
          "</div>";
      } else {
        el.innerHTML =
          '<div class="section-cover__shell section-cover__shell--a section-cover__shell--' +
          ac +
          '">' +
          mega +
          '<div class="section-cover__upper section-cover__upper--' +
          ac +
          '">' +
          '<div class="section-cover__upper-inner">' +
          serial +
          h2 +
          "</div></div>" +
          '<div class="section-cover__lower">' +
          deckP +
          jumpHtml +
          figHtml +
          "</div></div>";
      }
    }
  }

  function fillAbout() {
    var d = DATA();
    var ab = d.about;
    if (!ab) return;

    var narr = qs(document, "[data-about-narrative]");
    if (narr && ab.narrativeParas && ab.narrativeParas.length) {
      narr.innerHTML = ab.narrativeParas
        .map(function (p) {
          return "<p>" + p + "</p>";
        })
        .join("");
    }
    var eyebrow = qs(document, "[data-about-eyebrow]");
    if (eyebrow) {
      if (ab.aboutEyebrow && String(ab.aboutEyebrow).trim()) {
        eyebrow.textContent = ab.aboutEyebrow;
        eyebrow.hidden = false;
      } else {
        eyebrow.hidden = true;
      }
    }
    var ch = qs(document, "[data-about-chapter-title]");
    if (ch && ab.chapterTitle) ch.textContent = ab.chapterTitle;

    var cgl = qs(document, "[data-about-cong-continued]");
    if (cgl && ab.conglomeradoContinuedLead) cgl.textContent = ab.conglomeradoContinuedLead;

    var ct = qs(document, "[data-about-conglomerado-title]");
    if (ct && ab.conglomeradoTitle) ct.textContent = ab.conglomeradoTitle;
    var lt = qs(document, "[data-about-cong-label-table]");
    if (lt && ab.conglomeradoTableLead) lt.textContent = ab.conglomeradoTableLead;
    var capT = qs(document, "[data-about-cap-table]");
    if (capT && ab.conglomeradoTableCaption) capT.textContent = ab.conglomeradoTableCaption;

    var sl = qs(document, "[data-about-synth-lead]");
    if (sl && ab.synthFigureLead) sl.textContent = ab.synthFigureLead;
    var sc = qs(document, "[data-about-synth-caption]");
    if (sc && ab.conglomeradoFigureCaption) sc.textContent = ab.conglomeradoFigureCaption;

    var clusterTableHost = qs(document, "[data-about-cluster-table-component]");
    if (clusterTableHost) {
      var clusters = (ab && ab.clusters) || [];
      var incidentVars = (ab && ab.incidentVariables) || [];
      var blocks = d.variablesByCluster || [];
      var selectedClusterId = (ab && ab.selectedClusterId) || "maquinaria";
      var selectedIncidentVars = (ab && ab.selectedIncidentVariables) || [];
      var clusterHtml = "";
      var incidentHtml = "";
      var varsHtml = "";
      var selectedVarsHtml = "";
      var regularVarsHtml = "";
      var seenVars = {};
      var selectedObservedSet = {};
      var selectedIncidentSet = {};
      for (var si = 0; si < selectedIncidentVars.length; si++) {
        var incidentKey = String(selectedIncidentVars[si] || "").trim().toLowerCase();
        if (incidentKey) selectedIncidentSet[incidentKey] = true;
      }
      for (var sb = 0; sb < blocks.length; sb++) {
        var selBlock = blocks[sb];
        if (selBlock.clusterId !== selectedClusterId) continue;
        var selVars = selBlock.sampleVars || [];
        for (var sv = 0; sv < selVars.length; sv++) {
          var selectedKey = String(selVars[sv] || "").trim().toLowerCase();
          if (selectedKey) selectedObservedSet[selectedKey] = true;
        }
      }
      for (var ci = 0; ci < clusters.length; ci++) {
        var cItem = clusters[ci];
        var cClass = "cluster-card__cluster-item";
        if (cItem.id === selectedClusterId) cClass += " cluster-card__cluster-item--accent";
        clusterHtml += '<span class="' + cClass + '">' + escapeHtml(cItem.label) + "</span>";
      }
      for (var ii = 0; ii < incidentVars.length; ii++) {
        var rawIncident = String(incidentVars[ii] || "").trim();
        if (!rawIncident) continue;
        var incidentCls = "cluster-card__var-item cluster-card__var-item--incident";
        if (selectedIncidentSet[rawIncident.toLowerCase()]) {
          incidentCls += " cluster-card__var-item--selected";
        }
        incidentHtml += '<span class="' + incidentCls + '" title="' + escapeHtml(rawIncident) + '">' + escapeHtml(rawIncident) + "</span>";
      }
      for (var bi = 0; bi < blocks.length; bi++) {
        var sampleVars = blocks[bi].sampleVars || [];
        for (var vi = 0; vi < sampleVars.length; vi++) {
          var rawVar = String(sampleVars[vi] || "").trim();
          if (!rawVar) continue;
          var keyVar = rawVar.toLowerCase();
          if (seenVars[keyVar]) continue;
          seenVars[keyVar] = true;
          var observedCls = "cluster-card__var-item";
          if (selectedObservedSet[keyVar]) observedCls += " cluster-card__var-item--selected";
          var itemHtml = '<span class="' + observedCls + '" title="' + escapeHtml(rawVar) + '">' + escapeHtml(rawVar) + "</span>";
          if (selectedObservedSet[keyVar]) {
            selectedVarsHtml += itemHtml;
          } else {
            regularVarsHtml += itemHtml;
          }
        }
      }
      varsHtml = selectedVarsHtml + regularVarsHtml;
      clusterTableHost.innerHTML =
        '<section class="cluster-card" aria-label="Clusterización de variables para un modelo de productividad">' +
        '<h3 class="cluster-card__title">Clusterización de variables para un modelo de productividad</h3>' +
        '<div class="cluster-card__section">' +
        '<p class="cluster-card__section-title">Clúster</p>' +
        '<div class="cluster-card__cluster-grid">' +
        clusterHtml +
        "</div></div>" +
        '<div class="cluster-card__section">' +
        '<p class="cluster-card__section-title">Variables incidentes</p>' +
        '<div class="cluster-card__vars-grid cluster-card__vars-grid--incident">' +
        incidentHtml +
        "</div></div>" +
        '<div class="cluster-card__section">' +
        '<p class="cluster-card__section-title">Variables observadas</p>' +
        '<div class="cluster-card__vars-grid cluster-card__vars-grid--observed">' +
        varsHtml +
        "</div></div></section>";
    }

    var diag = qs(document, "[data-cluster-diagram]");
    if (diag) {
      var imgSrc =
        d.assets && d.assets.clusterDiagramJpg
          ? d.assets.clusterDiagramJpg
          : "assets/img/clusteres-diagram.jpg";
      diag.innerHTML =
        '<img class="about-synth-diagram__img" src="' +
        escapeHtml(imgSrc) +
        '" alt="Diagrama sintetizado: siete clústeres de entrada y cuatro indicadores de salida hacia la productividad." width="1600" height="900" decoding="async" loading="lazy" fetchpriority="low" />';
    }

    var met = qs(document, "[data-about-conglomerado-metrics]");
    if (met && d.metricsNote) {
      met.innerHTML =
        "<strong>" +
        escapeHtml(d.metricsNote.title) +
        ".</strong> " +
        escapeHtml(d.metricsNote.body);
    }

    var fm = qs(document, "[data-about-functions-merged]");
    if (fm && ab.functionsMerged) {
      fm.innerHTML = "<p>" + ab.functionsMerged + "</p>";
    }

    var cst = qs(document, "[data-about-clusters-section-title]");
    if (cst && ab.clustersSectionTitle) cst.textContent = ab.clustersSectionTitle;


    var acc = qs(document, "[data-variables-accordion]");
    if (acc) {
      var vb = d.variablesByCluster;
      var rows = "";
      for (var i = 0; i < vb.length; i++) {
        var block = vb[i];
        var cluster = d.about.clusters.filter(function (c) {
          return c.id === block.clusterId;
        })[0];
        var title = cluster ? cluster.label : block.clusterId;
        var varsCell = block.sampleVars.map(function (v) {
          return escapeHtml(v);
        }).join(" · ");
        rows +=
          "<tr>" +
          '<th scope="row" class="vars-table__cluster">' +
          escapeHtml(title) +
          "</th>" +
          '<td class="vars-table__desc">' +
          escapeHtml(block.summary) +
          "</td>" +
          '<td class="vars-table__vars">' +
          varsCell +
          "</td>" +
          "</tr>";
      }
      acc.innerHTML =
        '<table class="vars-cluster-table">' +
        "<thead><tr>" +
        '<th scope="col">Clúster</th>' +
        '<th scope="col">Alcance</th>' +
        '<th scope="col">Variables de muestra</th>' +
        "</tr></thead><tbody>" +
        rows +
        "</tbody></table>";
    }
  }

  function fillContext() {
    var d = DATA();
    var root = qs(document, "[data-context-content]");
    if (!root) return;
    var pageEyebrow = qs(document, "#contexto [data-context-page-eyebrow]");
    if (pageEyebrow) {
      pageEyebrow.textContent = "";
      pageEyebrow.hidden = true;
    }

    var lead = qs(root, "[data-context-lead]");
    if (lead) lead.textContent = d.context.lead;
    var paras = qs(root, "[data-context-paras]");
    if (paras && d.context.paragraphs && d.context.paragraphs.length) {
      paras.innerHTML = d.context.paragraphs
        .map(function (p) {
          var html = escapeHtml(p).replace(/\b(Efacticom)\b/g, "<em>$1</em>");
          return "<p>" + html + "</p>";
        })
        .join("");
    }
    var kickerEl = qs(root, "[data-context-insight-kicker]");
    if (kickerEl && d.context.insightKicker) {
      kickerEl.textContent = d.context.insightKicker;
    }
    var attrName = qs(root, "[data-context-attribution-name]");
    if (attrName) {
      attrName.textContent = d.context.attributionName || "";
    }
    var attrDetail = qs(root, "[data-context-attribution-detail]");
    if (attrDetail) {
      attrDetail.textContent = d.context.attributionDetail || "";
    }

    var miniWrap = qs(root, "[data-context-mini-timeline]");
    if (miniWrap && d.context.miniTimeline && d.context.miniTimeline.length) {
      var miniItems = d.context.miniTimeline
        .map(function (step) {
          return (
            '<li class="context-mini-tl__item">' +
            '<span class="context-mini-tl__year">' +
            escapeHtml(step.year) +
            "</span>" +
            '<div class="context-mini-tl__rail" aria-hidden="true">' +
            '<span class="context-mini-tl__tick"></span>' +
            "</div>" +
            '<span class="context-mini-tl__label">' +
            escapeHtml(step.label) +
            "</span>" +
            "</li>"
          );
        })
        .join("");
      miniWrap.innerHTML =
        '<ol class="context-mini-tl" role="list">' + miniItems + "</ol>";
    }

    var ecoRoot = qs(document, "[data-context-ecosystem]");
    if (ecoRoot && d.context.ecosystem && d.context.ecosystem.pillars) {
      var eco = d.context.ecosystem;
      var arrowBetween =
        '<div class="context-ecosystem__arrow" aria-hidden="true">' +
        '<svg class="context-ecosystem__arrow-svg" viewBox="0 0 96 20" width="96" height="20" focusable="false">' +
        '<path d="M2 10h78M80 4l12 6-12 6" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>' +
        "</svg></div>";

      function ecosystemIconSvg(id) {
        if (id === "academia") {
          return (
            '<svg class="context-ecosystem__icon" viewBox="0 0 24 24" width="36" height="36" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>' +
            '<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>' +
            "</svg>"
          );
        }
        if (id === "empresa") {
          return (
            '<svg class="context-ecosystem__icon" viewBox="0 0 24 24" width="36" height="36" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M3 21h18"/>' +
            '<path d="M6 21V8l6-3 6 3v13"/>' +
            '<path d="M9 21v-4h2v4"/>' +
            '<path d="M13 21v-4h2v4"/>' +
            "</svg>"
          );
        }
        return (
          '<svg class="context-ecosystem__icon" viewBox="0 0 24 24" width="36" height="36" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M12 22V10"/>' +
          '<path d="M8 22v-6l4-3 4 3v6"/>' +
          '<path d="M4 22h16"/>' +
          '<path d="M10 10V6h4v4"/>' +
          "</svg>"
        );
      }

      var cols = "";
      for (var pi = 0; pi < eco.pillars.length; pi++) {
        var pl = eco.pillars[pi];
        cols +=
          '<div class="context-ecosystem__col">' +
          ecosystemIconSvg(pl.id) +
          '<div class="context-ecosystem__text">' +
          '<span class="context-ecosystem__label">' +
          escapeHtml(pl.label) +
          "</span>" +
          '<span class="context-ecosystem__subtitle">' +
          escapeHtml(pl.subtitle) +
          "</span>" +
          "</div></div>";
        if (pi < eco.pillars.length - 1) {
          cols += arrowBetween;
        }
      }
      ecoRoot.innerHTML =
        '<div class="context-ecosystem">' +
        '<p class="context-ecosystem__title">' +
        escapeHtml(eco.title) +
        "</p>" +
        '<div class="context-ecosystem__row">' +
        cols +
        "</div></div>";
    }

    function timelineCardsHtml(slice) {
      var stages = "";
      for (var i = 0; i < slice.length; i++) {
        var t = slice[i];
        stages +=
          '<article class="timeline-card" data-timeline-card>' +
          '<header class="timeline-card__head">' +
          '<span class="timeline-card__phase">' +
          escapeHtml(t.phase) +
          "</span>" +
          '<h3 class="timeline-card__title">' +
          escapeHtml(t.title) +
          "</h3>" +
          '<span class="timeline-card__range">' +
          escapeHtml(t.range) +
          "</span>" +
          "</header>" +
          "<ul>" +
          t.items
            .map(function (it) {
              return "<li>" + escapeHtml(it) + "</li>";
            })
            .join("") +
          "</ul>" +
          "</article>";
      }
      return stages;
    }

    function injectTimelineTrack(container, slice) {
      if (!container || !slice.length) return;
      container.innerHTML =
        '<div class="timeline-track" data-timeline-track>' +
        '<svg class="timeline-line" data-timeline-svg viewBox="0 0 8 100" preserveAspectRatio="none" aria-hidden="true"><line x1="4" y1="0" x2="4" y2="100" stroke="currentColor" stroke-width="2" stroke-dasharray="4 4"/></svg>' +
        timelineCardsHtml(slice) +
        "</div>";
    }

    var tl1 = qs(document, '[data-timeline-slice="1"]');
    var tl2 = qs(document, '[data-timeline-slice="2"]');
    if (tl1 && tl2 && d.timeline && d.timeline.length) {
      var mid = Math.ceil(d.timeline.length / 2);
      injectTimelineTrack(tl1, d.timeline.slice(0, mid));
      injectTimelineTrack(tl2, d.timeline.slice(mid));
    } else if (tl1 && d.timeline && d.timeline.length) {
      injectTimelineTrack(tl1, d.timeline);
    } else {
      var tl = qs(root, "[data-timeline]");
      if (tl) {
        injectTimelineTrack(tl, d.timeline);
      }
    }
  }

  function fillResults() {
    var d = DATA();
    var db = d.dashboards;

    for (var key in db.pageTitles) {
      if (!Object.prototype.hasOwnProperty.call(db.pageTitles, key)) continue;
      var h = qs(document, '[data-dash-heading="' + key + '"]');
      if (h) h.textContent = db.pageTitles[key];
    }

    if (db.halfTitles) {
      var hCom = qs(document, '[data-dash-half-title="comparativo"]');
      var hInd = qs(document, '[data-dash-half-title="indicadores"]');
      if (hCom && db.halfTitles.comparativo) hCom.textContent = db.halfTitles.comparativo;
      if (hInd && db.halfTitles.indicadores) hInd.textContent = db.halfTitles.indicadores;
    }

    applyResultsView(d);

    var b = qs(document, "[data-dash-b]");
    if (b) {
      var turnoEl = qs(b, "[data-turno-charts]");
      if (turnoEl && db.dashboardTotalTurno) {
        renderDashboardTotalSection(turnoEl, db.dashboardTotalTurno, db);
      }
      var analysisB = qs(b, "[data-dash-b-analysis]");
      if (analysisB && db.analysisB && db.analysisB.length) {
        analysisB.innerHTML = db.analysisB.map(function (p) {
          return '<p class="report-dash__analysis-p">' + escapeHtml(p) + "</p>";
        }).join("");
      }
    }

    var bc = qs(document, "[data-dash-b-centro]");
    if (bc) {
      var noteBc = qs(bc, "[data-dash-note-b-centro]");
      if (noteBc && db.notes && db.notes.bCentro) noteBc.textContent = db.notes.bCentro;
      var centroEl = qs(bc, "[data-centro-charts]");
      if (centroEl && db.dashboardTotalCentro) {
        renderDashboardTotalSection(centroEl, db.dashboardTotalCentro, db);
      }
    }
  }

  function closingBackCoverIcons() {
    return {
      pin:
        '<svg class="back-cover__ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"/><circle cx="12" cy="10" r="3"/></svg>',
      phone:
        '<svg class="back-cover__ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>',
      mail:
        '<svg class="back-cover__ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="m22 6-10 7L2 6"/></svg>',
    };
  }

  function fillClosing() {
    var d = DATA();
    var cl = d.closing;
    if (!cl) return;
    var root = qs(document, "[data-closing-content]");
    if (!root) return;
    var title = qs(root, "[data-closing-title]");
    if (title) title.textContent = cl.title;
    var blocksEl = qs(root, "[data-closing-blocks]");
    var hasCta = cl.blocks && cl.blocks.some(function(b) { return b.ctaBlock; });
    if (blocksEl && cl.blocks && cl.blocks.length) {
      blocksEl.innerHTML = cl.blocks
        .map(function (b, idx) {
          var blockId = b.id || "cierre-bloque-" + (idx + 1);
          var bodyContent;
          if (b.ctaBlock) {
            // Render the CTA card component inline instead of plain text
            var btn = cl.ctaButton || {};
            bodyContent =
              '<a class="closing-cta__block closing-cta__block--inline" href="' +
              escapeHtml(btn.href || "#") +
              '" target="_blank" rel="noopener noreferrer">' +
              '<span class="closing-cta__intro">' +
              escapeHtml(cl.ctaText || "") +
              "</span>" +
              '<span class="closing-cta__btn-label">' +
              '<svg class="closing-cta__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
              '<path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>' +
              "</svg>" +
              '<span>' + escapeHtml(btn.label || "") + "</span>" +
              "</span>" +
              "</a>";
          } else {
            bodyContent = '<p class="closing-block__text">' + (b.bodyHtml || escapeHtml(b.body || "")) + "</p>";
          }
          return (
            '<article id="' +
            escapeHtml(blockId) +
            '" class="closing-block' + (b.ctaBlock ? ' closing-block--cta' : '') + '">' +
            '<h3 class="closing-block__title">' +
            escapeHtml(b.title) +
            "</h3>" +
            bodyContent +
            "</article>"
          );
        })
        .join("");
    }
    // If any block has ctaBlock flag, hide the standalone CTA (no duplication)
    var standalone = qs(root, "[data-closing-cta-standalone]");
    if (standalone) standalone.style.display = hasCta ? "none" : "";
    var ctaLink = qs(root, "[data-closing-cta-link]");
    if (ctaLink && cl.ctaButton) {
      ctaLink.href = cl.ctaButton.href || "#";
      var ctaIntro = qs(ctaLink, "[data-closing-cta-text]");
      if (ctaIntro) ctaIntro.textContent = cl.ctaText || "";
      var ctaLbl = qs(ctaLink, "[data-closing-cta-btn-label]");
      if (ctaLbl) ctaLbl.textContent = cl.ctaButton.label || "";
    }
    var bc = cl.backCover;
    if (bc) {
      var tg = qs(document, "[data-back-tagline]");
      if (tg) tg.innerHTML = bc.taglineHtml || "";
      var ct = qs(document, "[data-back-contact]");
      if (ct) {
        var ico = closingBackCoverIcons();
        var colL = [];
        colL.push('<div class="back-cover__contact-block">');
        colL.push(
          '<div class="back-cover__contact-head">' +
            ico.mail +
            '<span class="back-cover__contact-kicker">Correos Electrónicos</span></div>'
        );
        (bc.emails || []).forEach(function (e) {
          colL.push(
            '<p class="back-cover__contact-line"><a class="back-cover__mail" href="mailto:' +
              escapeHtml(e) +
              '">' +
              escapeHtml(e) +
              "</a></p>"
          );
        });
        colL.push("</div>");

        var colR = [];
        if (bc.linkedin) {
          colR.push('<div class="back-cover__contact-block">');
          colR.push(
            '<div class="back-cover__contact-head">' +
              '<svg class="back-cover__ico" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>' +
              '<span class="back-cover__contact-kicker">LinkedIn</span></div>'
          );
          colR.push(
            '<p class="back-cover__contact-line"><a class="back-cover__mail" href="https://' +
              escapeHtml(bc.linkedin) +
              '" target="_blank" rel="noopener noreferrer">Gisela Patricia Monsalve</a></p>'
          );
          colR.push("</div>");
        }

        ct.innerHTML =
          '<div class="back-cover__contact-inner">' +
          '<div class="back-cover__contact-col back-cover__contact-col--left">' +
          colL.join("") +
          "</div>" +
          '<div class="back-cover__contact-col back-cover__contact-col--right">' +
          colR.join("") +
          "</div>" +
          "</div>";
      }
      var cr = qs(document, "[data-back-copyright]");
      if (cr) cr.textContent = bc.copyright || "";
      var dsg = qs(document, "[data-back-designer]");
      if (dsg) {
        var dg = bc.designer;
        if (dg && dg.name) {
          var dHref = absoluteHttpUrl(dg.linkedin);
          var roleLine = escapeHtml(dg.role || "Diseño editorial y digital");
          var nameLine = escapeHtml(dg.name);
          dsg.innerHTML =
            roleLine +
            ": " +
            (dHref
              ? '<a class="back-cover__mail" href="' +
                escapeHtml(dHref) +
                '" target="_blank" rel="noopener noreferrer">' +
                nameLine +
                "</a>"
              : nameLine);
        } else {
          dsg.innerHTML = "";
        }
      }
    }
  }

  function bindPdfButtons() {
    qsa(document, "[data-action-print]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.disabled) return;
        btn.disabled = true;
        setTimeout(function () {
          btn.disabled = false;
        }, 2000);
        if (window.EFACTICOM_PDF && typeof window.EFACTICOM_PDF.exportPdf === "function") {
          window.EFACTICOM_PDF.exportPdf();
        } else {
          window.print();
        }
      });
    });
  }

  function setMeta() {
    var d = DATA();
    var cur = document.body.getAttribute("data-doc-current");
    var titles = {
      portada: d.meta.title,
      contenido: "Contenido — " + d.meta.title,
      acerca: "Acerca del software — " + d.meta.title,
      contexto: "Contexto — " + d.meta.title,
      resultados: "Resultados — " + d.meta.title,
      cierre: "Cierre — " + d.meta.title,
    };
    document.title = cur && titles[cur] ? titles[cur] : d.meta.title;
    var m = qs(document, 'meta[name="description"]');
    if (m) m.setAttribute("content", d.hero.subline);
  }

  function bindDocToolbarPageNum() {
    var pages = qsa(document, ".doc-main > .doc-page:not(.doc-page--footer)");
    var out = qs(document, "[data-doc-page-num]");
    if (!out || !pages.length) return;

    function update() {
      var vh = window.innerHeight || 600;
      var centerY = vh * 0.32;
      var bestIdx = 0;
      var bestScore = -Infinity;
      var i;
      for (i = 0; i < pages.length; i++) {
        var r = pages[i].getBoundingClientRect();
        if (r.bottom <= 0 || r.top >= vh) continue;
        var visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        var mid = (r.top + r.bottom) / 2;
        var score = visible - Math.abs(mid - centerY) * 0.03;
        if (score > bestScore) {
          bestScore = score;
          bestIdx = i;
        }
      }
      if (bestScore === -Infinity) {
        for (i = 0; i < pages.length; i++) {
          var r2 = pages[i].getBoundingClientRect();
          if (r2.top < vh && r2.bottom > 0) {
            bestIdx = i;
            break;
          }
        }
      }
      out.textContent = String(bestIdx + 1).padStart(2, "0");
    }

    var ticking = false;
    function onScrollOrResize() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(function () {
          ticking = false;
          update();
        });
      }
    }

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    window.addEventListener("hashchange", onScrollOrResize);
    window.addEventListener("load", onScrollOrResize);
    update();
  }

  function isWebPublicEdition() {
    try {
      return new URLSearchParams(window.location.search || "").get("edicion") === "web";
    } catch (e) {
      return false;
    }
  }

  /**
   * Vista publicación web (?edicion=web): oculta PDF e interruptor de modo; fuerza modo lectura.
   */
  function applyWebPublicEdition() {
    if (!isWebPublicEdition()) return;
    document.documentElement.classList.add("efacticom--web-edicion");
    document.body.classList.add("efacticom--web-edicion");
    var pdfBtn = qs(document, "[data-action-print]");
    if (pdfBtn) pdfBtn.style.display = "none";
    var modeBtn = qs(document, "[data-reading-mode-toggle]");
    if (modeBtn) modeBtn.style.display = "none";
    var badge = qs(document, "[data-web-edicion-badge]");
    if (badge) badge.removeAttribute("hidden");
    setReadingModeEnabled(true);
  }

  function init() {
    applyWebPublicEdition();
    setMeta();
    fillNav();
    fillPageNav();
    bindQuickNavCurrent();
    bindDocToolbarPageNum();
    fillHero();
    fillToc();
    fillSectionCover();
    fillAbout();
    fillContext();
    fillResults();
    fillClosing();
    bindPdfButtons();
    bindReadingModeToggle();
  }

  window.EFACTICOM_UI = {
    init: init,
    escapeHtml: escapeHtml,
    renderBarChart: renderBarChart,
    renderFilterBar: renderFilterBar,
    renderKpiCard: renderKpiCard,
    renderDonutRow: renderDonutRow,
    renderImageMosaic: renderImageMosaic,
    fillCoverVisual: fillCoverVisual,
    renderDashboardGrid: renderDashboardGrid,
    renderStatsTable: renderStatsTable,
    clusterDiagramSvg: clusterDiagramSvg,
  };
})();
