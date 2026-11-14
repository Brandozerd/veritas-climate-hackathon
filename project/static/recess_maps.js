// Recess Ready: interactive maps (zoom, pan), animated wind arrows, and counting numbers.
// Written by our team during the hackathon. Uses Leaflet 1.9.4 (BSD-2 license, see leaflet/LICENSE)
// and OpenStreetMap map tiles (© OpenStreetMap contributors).
//
// How it works:
// 1. Python puts each map's data (pins, danger areas, winds) into a <div class="rrmap" data-config="...">.
// 2. This script watches the page. When a new map <div> appears, it builds a Leaflet map inside it.
// 3. Wind: we know today's wind at 35 places, so each place gets an animated arrow.
// 4. Numbers marked with data-count count up from 0 when a new day is shown.

(function () {
  const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
  const CREDIT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Show a plain-English problem message inside a map box
  function problem(el, text) {
    el.querySelector(".rr-loading")?.remove();
    let note = el.querySelector(".rr-problem");
    if (!note) { note = document.createElement("div"); note.className = "rr-problem"; el.appendChild(note); }
    note.textContent = text;
  }

  // Wait until Leaflet has loaded (give up after 10 seconds and say why)
  function whenReady(el, fn, waited = 0) {
    if (window.L) return fn();
    if (waited > 10000) {
      return problem(el, "The map library (Leaflet) didn't load, so the map can't be drawn. " +
        "Try refreshing the page. If it keeps happening, check that project/static/leaflet/leaflet.js exists.");
    }
    setTimeout(() => whenReady(el, fn, waited + 100), 100);
  }

  // ---------- Wind arrows ----------
  // One arrow per place, pointing where the wind blows TO. A small dot glides along each arrow:
  // stronger wind = longer arrow, faster dot, warmer color. Hover an arrow to read its wind.
  function windClass(speed) {      // km/h
    if (speed < 15) return "s1";
    if (speed < 30) return "s2";
    if (speed < 50) return "s3";
    return "s4";
  }

  function addArrows(map, winds) {
    for (const w of winds) {
      const speed = Math.hypot(w.u, w.v);
      const rot = (Math.atan2(w.u, w.v) * 180) / Math.PI;     // 0 = toward north, 90 = toward east
      const len = 22 + Math.min(speed, 60) * 0.6;             // pixels
      const dur = Math.max(0.9, 3 - speed * 0.04);            // seconds for the dot to glide along
      const icon = L.divIcon({
        className: "rr-arrow", iconSize: [80, 80], iconAnchor: [40, 40],
        html: `<div class="wa ${windClass(speed)}" style="--rot:${rot.toFixed(0)}deg;--len:${len.toFixed(0)}px;--dur:${dur.toFixed(2)}s">` +
              `<i class="wa-line"></i><i class="wa-head"></i><i class="wa-dot"></i></div>`,
      });
      L.marker([w.lat, w.lon], { icon, zIndexOffset: -1000, keyboard: false })
        .addTo(map).bindTooltip(`Wind from the ${w.from}, ${w.speed} km/h`, { direction: "top", offset: [0, -24] });
    }
  }

  // ---------- Numbers that count up when a new day loads ----------
  function countUp(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = "1";
    const target = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || "0", 10);
    if (calm || isNaN(target)) return;
    const start = performance.now(), ms = 900;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / ms), eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(dec);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ---------- The close-up "Life360" map ----------
  function closeMap(map, c) {
    const home = L.divIcon({ className: "rr-pin", iconSize: [52, 64], iconAnchor: [26, 64],
      html: '<span class="pulse"></span><span class="avatar">🏫</span>' });
    const up = L.divIcon({ className: "rr-pin", iconSize: [34, 34], iconAnchor: [17, 17],
      html: '<span class="up-dot">🌬️</span>' });
    L.polyline([[c.up_lat, c.up_lon], [c.lat, c.lon]],
      { color: "#C77C00", weight: 5, dashArray: "12 12", lineCap: "round", className: "rr-flow" }).addTo(map);
    L.marker([c.up_lat, c.up_lon], { icon: up }).addTo(map).bindTooltip("Air comes from here", { direction: "top", offset: [0, -16] });
    L.marker([c.lat, c.lon], { icon: home }).addTo(map).bindTooltip("Our data point (Center City)", { direction: "top", offset: [0, -64] });
    map.fitBounds([[c.up_lat, c.up_lon], [c.lat, c.lon]], { padding: [70, 70], maxZoom: 12 });
  }

  // ---------- The regional danger chart ----------
  function regionMap(map, c, uid) {
    map.fitBounds(c.bounds, { padding: [10, 10] });   // set the view first; Leaflet draws layers only after that
    const svg = L.svg({ padding: 0.5 });
    map.addLayer(svg);
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    for (const [name, color] of Object.entries(c.stripes)) {
      defs.innerHTML += `<pattern id="${uid}-${name}" width="14" height="14" patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"><rect width="14" height="14" fill="${color}" fill-opacity=".3"/>
        <rect width="5" height="14" fill="${color}"/></pattern>`;
    }
    svg._container.prepend(defs);
    for (const cell of c.cells) {
      const r = L.rectangle([[cell.s, cell.w], [cell.n, cell.e]],
        { renderer: svg, stroke: false, fillColor: cell.color, fillOpacity: cell.striped ? 0.85 : 0.55 }).addTo(map);
      if (cell.striped) r._path.setAttribute("fill", `url(#${uid}-${cell.name})`);
      r.bindTooltip(`${cell.label}: ${cell.pct}% chance`, { sticky: true });
    }
    L.circleMarker([c.lat, c.lon], { radius: 8, color: "#fff", weight: 3, fillColor: "#0F2A43", fillOpacity: 1 })
      .addTo(map).bindTooltip("Philadelphia", { permanent: true, direction: "right", className: "rr-city" });
  }

  let counter = 0;
  function build(el) {
    if (el.dataset.ready) return;
    el.dataset.ready = "1";
    let c;
    try { c = JSON.parse(el.dataset.config); }
    catch (err) { return problem(el, "The map's data couldn't be read: " + err.message); }
    whenReady(el, () => {
      el.querySelector(".rr-loading")?.remove();
      const map = L.map(el, { zoomSnap: 0.5, scrollWheelZoom: true, zoomControl: false });
      L.control.zoom({ position: "topright" }).addTo(map);
      let loaded = 0, failed = 0;
      L.tileLayer(TILES, { attribution: CREDIT, maxZoom: 18 })
        .on("tileload", () => loaded++)
        .on("tileerror", () => {
          failed++;
          if (failed >= 3 && loaded === 0) problem(el, "Map pictures from OpenStreetMap were blocked by this network or browser. " +
            "Pins, danger areas and wind arrows still work.");
        })
        .addTo(map);
      try {
        if (c.kind === "close") closeMap(map, c); else regionMap(map, c, "rr" + (++counter));
        addArrows(map, c.winds);
      } catch (err) {
        problem(el, "Something went wrong drawing the map: " + err.message);
        console.error(err);
      }
      setTimeout(() => map.invalidateSize(), 250);   // fix size if the page moved while loading
    });
  }

  // Build every map on the page, now and whenever the app shows a new date
  const scan = () => {
    document.querySelectorAll(".rrmap:not([data-ready])").forEach(build);
    document.querySelectorAll("[data-count]:not([data-counted])").forEach(countUp);
  };
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", scan);
})();
