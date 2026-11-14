// Recess Ready: interactive maps (zoom, pan) and animated wind.
// Written by our team during the hackathon. Uses Leaflet 1.9.4 (BSD-2 license, see leaflet/LICENSE)
// and OpenStreetMap map tiles (© OpenStreetMap contributors).
//
// How it works:
// 1. Python puts each map's data (pins, danger areas, winds) into a <div class="rrmap" data-config="...">.
// 2. This script watches the page. When a new map <div> appears, it builds a Leaflet map inside it.
// 3. Wind: we know the wind at 35 places. For any spot on the map we blend the winds of nearby
//    places (closer places count more), then move hundreds of little streaks along that wind.

(function () {
  const TILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
  const CREDIT = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Wait until Leaflet has loaded
  function whenReady(fn) {
    if (window.L) fn(); else setTimeout(() => whenReady(fn), 100);
  }

  // ---------- Wind ----------
  // Blend the winds of all places: closer places count much more ("inverse distance weighting")
  function windAt(winds, lat, lon) {
    let su = 0, sv = 0, sw = 0;
    for (const w of winds) {
      const d2 = (w.lat - lat) ** 2 + ((w.lon - lon) * 0.77) ** 2 + 1e-6;
      const k = 1 / (d2 * d2);
      su += w.u * k; sv += w.v * k; sw += k;
    }
    return [su / sw, sv / sw];   // u = toward east, v = toward north (km/h)
  }

  function windColor(speed) {      // km/h
    if (speed < 15) return "rgba(92, 122, 150, 0.85)";
    if (speed < 30) return "rgba(15, 42, 67, 0.9)";
    if (speed < 50) return "rgba(199, 124, 0, 0.95)";
    return "rgba(214, 64, 43, 0.95)";
  }

  function addWind(map, winds) {
    const canvas = document.createElement("canvas");
    canvas.className = "rr-wind";
    map.getContainer().appendChild(canvas);
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0;
    function resize() {
      const s = map.getSize(), r = window.devicePixelRatio || 1;
      W = s.x; H = s.y;
      canvas.width = W * r; canvas.height = H * r;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(r, 0, 0, r, 0, 0);
    }
    resize();

    if (calm) {   // Reduced motion: draw still arrows instead of moving streaks
      const still = () => {
        ctx.clearRect(0, 0, W, H);
        for (const w of winds) {
          const p = map.latLngToContainerPoint([w.lat, w.lon]);
          const sp = Math.hypot(w.u, w.v), len = 10 + Math.min(sp, 60) * 0.4;
          const dx = (w.u / (sp || 1)) * len, dy = -(w.v / (sp || 1)) * len;
          ctx.strokeStyle = windColor(sp); ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(p.x - dx / 2, p.y - dy / 2); ctx.lineTo(p.x + dx / 2, p.y + dy / 2); ctx.stroke();
        }
      };
      still(); map.on("moveend zoomend resize", () => { resize(); still(); });
      return;
    }

    const count = Math.round(Math.min(1500, (W * H) / 450));
    const streaks = [];
    function respawn(s) {
      s.x = Math.random() * W; s.y = Math.random() * H;
      s.life = 40 + Math.floor(Math.random() * 80);
    }
    for (let i = 0; i < count; i++) { const s = {}; respawn(s); s.life = Math.floor(Math.random() * 120); streaks.push(s); }

    function frame() {
      if (!document.body.contains(canvas)) return;      // this map was replaced; stop
      // Fade old trails a little each frame, so streaks leave short tails
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
      ctx.lineWidth = 1.7; ctx.lineCap = "round";
      for (const s of streaks) {
        const ll = map.containerPointToLatLng([s.x, s.y]);
        const [u, v] = windAt(winds, ll.lat, ll.lng);
        const speed = Math.hypot(u, v);
        const nx = s.x + u * 0.07, ny = s.y - v * 0.07;   // screen y points down
        ctx.strokeStyle = windColor(speed);
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(nx, ny); ctx.stroke();
        s.x = nx; s.y = ny;
        if (--s.life < 0 || nx < 0 || ny < 0 || nx > W || ny > H) respawn(s);
      }
      requestAnimationFrame(frame);
    }
    map.on("movestart zoomstart", () => ctx.clearRect(0, 0, W, H));
    map.on("resize", resize);
    requestAnimationFrame(frame);
  }

  // ---------- The close-up "Life360" map ----------
  function closeMap(map, c) {
    const home = L.divIcon({ className: "rr-pin", iconSize: [52, 64], iconAnchor: [26, 64],
      html: '<span class="pulse"></span><span class="avatar">🏫</span>' });
    const up = L.divIcon({ className: "rr-pin", iconSize: [34, 34], iconAnchor: [17, 17],
      html: '<span class="up-dot">🌬️</span>' });
    L.polyline([[c.up_lat, c.up_lon], [c.lat, c.lon]],
      { color: "#C77C00", weight: 5, dashArray: "12 12", lineCap: "round" }).addTo(map);
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
    const c = JSON.parse(el.dataset.config);
    whenReady(() => {
      const map = L.map(el, { zoomSnap: 0.5, scrollWheelZoom: true, zoomControl: false });
      L.control.zoom({ position: "topright" }).addTo(map);
      L.tileLayer(TILES, { attribution: CREDIT, maxZoom: 18 }).addTo(map);
      if (c.kind === "close") closeMap(map, c); else regionMap(map, c, "rr" + (++counter));
      addWind(map, c.winds);
      setTimeout(() => map.invalidateSize(), 250);   // fix size if the page moved while loading
    });
  }

  // Build every map on the page, now and whenever the app shows a new date
  const scan = () => document.querySelectorAll(".rrmap:not([data-ready])").forEach(build);
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", scan);
})();
