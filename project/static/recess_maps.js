// Recess Ready: interactive maps (zoom, pan) and animated wind arrows.
// Written by our team during the hackathon. Uses Leaflet 1.9.4 (BSD-2 license, see leaflet/LICENSE)
// and OpenStreetMap map tiles (© OpenStreetMap contributors).
//
// How it works:
// 1. Python puts each map's data (pins, alert areas, winds) into a <div class="rrmap" data-config="...">.
// 2. This script watches the page. When a new map <div> appears, it builds a Leaflet map inside it.
// 3. Wind: we know today's wind at 35 places, so each place gets an animated arrow.

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

  function addArrows(layer, winds) {
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
        .addTo(layer).bindTooltip(`Wind from the ${w.from}, ${w.mph} mph`, { direction: "top", offset: [0, -24] });
    }
  }

  // ---------- The close-up "Life360" map ----------
  // Draws pins and the wind path into `layer` (a group we clear when the date changes)
  function drawClose(map, layer, c, first) {
    const home = L.divIcon({ className: "rr-pin", iconSize: [52, 64], iconAnchor: [26, 64],
      html: '<span class="pulse"></span><span class="avatar"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V10l7-5 7 5v11"/><path d="M10 21v-5h4v5"/><path d="M12 5V2l3 1-3 1"/></svg></span>' });
    const up = L.divIcon({ className: "rr-pin", iconSize: [34, 34], iconAnchor: [17, 17],
      html: '<span class="up-dot"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#0F2A43" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10a3 3 0 1 0-3-3"/><path d="M3 12h15a3 3 0 1 1-3 3"/><path d="M3 16h7"/></svg></span>' });
    L.polyline([[c.up_lat, c.up_lon], [c.lat, c.lon]],
      { color: "#C77C00", weight: 5, dashArray: "12 12", lineCap: "round", className: "rr-flow" }).addTo(layer);
    L.marker([c.up_lat, c.up_lon], { icon: up }).addTo(layer).bindTooltip("Air comes from here", { direction: "top", offset: [0, -16] });
    L.marker([c.lat, c.lon], { icon: home }).addTo(layer).bindTooltip("Our data point (Center City)", { direction: "top", offset: [0, -64] });
    if (first) map.fitBounds([[c.up_lat, c.up_lon], [c.lat, c.lon]], { padding: [70, 70], maxZoom: 12 });
  }

  // ---------- The regional danger chart ----------
  function setupRegion(map, c, uid) {
    // Runs once: set the view and add the striped patterns used for "possible" dangers
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
    L.circleMarker([c.lat, c.lon], { radius: 8, color: "#fff", weight: 3, fillColor: "#0F2A43", fillOpacity: 1 })
      .addTo(map).bindTooltip("Philadelphia", { permanent: true, direction: "right", className: "rr-city" });
    return svg;
  }

  function drawRegion(layer, c, uid, svg) {
    // Smooth alert areas: striped = alert, solid = strong alert (drawn on top), each with an outline
    for (const a of [...c.areas].sort((x, y) => x.strong - y.strong)) {
      const likely = a.strong;
      const area = L.polygon(a.rings, {
        renderer: svg, fillRule: "evenodd", color: a.color, weight: likely ? 2.5 : 2,
        dashArray: likely ? null : "6 5", fillColor: a.color, fillOpacity: likely ? 0.45 : 0.9,
        className: "rr-area",
      }).addTo(layer);
      if (!likely) area._path.setAttribute("fill", `url(#${uid}-${a.name})`);
      area.bindTooltip(a.tip, { sticky: true });
      const stripes = () => { if (!likely) area._path.setAttribute("fill", `url(#${uid}-${a.name})`); };
      // Hover: thicker outline (Leaflet resets the fill when restyling, so put the stripes back)
      area.on("mouseover", () => { area.setStyle({ weight: 4 }); stripes(); })
          .on("mouseout", () => { area.setStyle({ weight: likely ? 2.5 : 2 }); stripes(); });
    }
  }

  // ---------- Build each map ONCE, then reuse it ----------
  // When a new date is picked, the app sends new HTML. Instead of making a brand-new map (slow:
  // new map pictures, new everything), we move the existing map into the new spot and only
  // swap the pins, danger areas and arrows. The map pictures stay loaded and the zoom is kept.
  // (When the date changes, the app reuses the same box and clears what's inside it. We keep
  // the map in our own inner box and put it back whenever it goes missing. The box must start
  // empty: if it had its own placeholder, the app would turn our map INTO that placeholder.)
  const saved = {};      // kind ("close" or "region") -> { el, map, layer, svg, uid }
  let counter = 0;

  function draw(m, c, first) {
    m.layer.clearLayers();
    m.el.querySelector(".rr-problem")?.remove();
    try {
      if (c.kind === "close") drawClose(m.map, m.layer, c, first); else drawRegion(m.layer, c, m.uid, m.svg);
      addArrows(m.layer, c.winds);
      if (!c.winds.length) problem(m.el, "No regional weather data for this date (the newest days can be missing). Try an earlier date.");
    } catch (err) {
      problem(m.el, "Something went wrong drawing the map: " + err.message);
      console.error(err);
    }
  }

  function build(el) {
    const text = el.dataset.config;
    const kind = el.classList.contains("region") ? "region" : "close";
    const m0 = saved[kind];
    // Skip if this box already shows this exact data with the map inside it
    if (el._shown === text && m0 && el.contains(m0.inner)) return;
    el._shown = text;
    let c;
    try { c = JSON.parse(text); }
    catch (err) { return problem(el, "The map's data couldn't be read: " + err.message); }
    if (!window.L && !el.querySelector(".rr-loading")) {     // show a note while the map library loads
      const note = document.createElement("div");
      note.className = "rr-loading"; note.textContent = "Loading map…";
      el.appendChild(note);
    }
    whenReady(el, () => {
      el.querySelector(".rr-loading")?.remove();
      const old = saved[c.kind];
      if (old) {                                   // reuse: put the existing map back inside the box
        if (!el.contains(old.inner)) el.appendChild(old.inner);
        old.el = el;                               // messages go to this box
        old.map.invalidateSize();
        draw(old, c, false);
        return;
      }
      // The map lives in an inner box, so we can put it back if the app clears the outer box
      const inner = document.createElement("div");
      inner.className = "rrmap-inner";
      el.appendChild(inner);
      const map = L.map(inner, { zoomSnap: 0.5, scrollWheelZoom: true, zoomControl: false });
      L.control.zoom({ position: "topright" }).addTo(map);
      let loaded = 0, failed = 0;
      const m = { el, inner, map, layer: null, uid: "rr" + (++counter) };
      // 1) The map picture Python downloaded (works even if the browser can't load tiles)
      const picture = (window.RR_PICTURES || {})[c.kind];
      if (picture) {
        L.imageOverlay(picture.url, picture.bounds, { attribution: CREDIT }).addTo(map);
        map.setMaxBounds(L.latLngBounds(picture.bounds).pad(0.15));
      }
      // 2) Live tiles on top, sharper when you zoom in (if the browser is allowed to load them)
      L.tileLayer(TILES, { attribution: picture ? "" : CREDIT, maxZoom: 18 })
        .on("tileload", () => loaded++)
        .on("tileerror", () => {
          failed++;
          if (!picture && failed >= 3 && loaded === 0) problem(m.el, "Map pictures from OpenStreetMap were blocked by this network or browser. " +
            "Pins, alert areas and wind arrows still work.");
        })
        .addTo(map);
      m.layer = L.layerGroup().addTo(map);
      if (c.kind === "region") m.svg = setupRegion(map, c, m.uid);
      saved[c.kind] = m;
      draw(m, c, true);
      setTimeout(() => map.invalidateSize(), 250);   // fix size if the page moved while loading
    });
  }

  // ---------- "Copy message for staff" button ----------
  // Copies a short message the recess lead can paste into the staff group chat
  document.addEventListener("click", async (e) => {
    const button = e.target.closest(".share");
    if (!button) return;
    const text = button.dataset.share;
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {                      // older browsers: copy through a hidden text box
      const box = document.createElement("textarea");
      box.value = text; document.body.appendChild(box); box.select();
      document.execCommand("copy"); box.remove();
    }
    button.textContent = "Copied. Paste it into your staff chat.";
    button.classList.add("done");
    setTimeout(() => { button.textContent = "Copy message for staff"; button.classList.remove("done"); }, 2500);
  });

  // Check every map box, now and whenever the app changes the page (for example, a new date).
  // The app may reuse the same box and just change its data, so we compare the data each time.
  let pending = false;
  const scan = () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {      // wait for the app to finish its changes, then check once
      pending = false;
      document.querySelectorAll(".rrmap").forEach(build);
      });
  };
  new MutationObserver(scan).observe(document.documentElement,
    { childList: true, subtree: true, attributes: true, attributeFilter: ["data-config"] });
  document.addEventListener("DOMContentLoaded", scan);
})();
