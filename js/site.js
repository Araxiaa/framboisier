(function () {
  const C = window.SITE_CONFIG, O = window.Outils, esc = O.esc, fmt = O.fmt;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const CACHE = "fr-content";
  let D = O.merge(window.DEFAULT_CONTENT, {});
  let io;

  /* ---------- chargement : contenu enregistré (cache) puis base en ligne ---------- */
  function cached() { try { return JSON.parse(localStorage.getItem(CACHE)); } catch (e) { return null; } }
  async function remote() {
    if (!window.supabase) return null;
    try {
      const sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_KEY);
      const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 5000));
      const { data, error } = await Promise.race([sb.from(C.TABLE).select("data").eq("id", C.CONTENT_ID).maybeSingle(), timeout]);
      if (error) throw error;
      return data && data.data ? data.data : null;
    } catch (e) { return null; }
  }

  /* ---------- petites briques ---------- */
  const paras = (a, cls) => (a || []).filter(Boolean).map((t) => `<p${cls ? ` class="${cls}"` : ""}>${fmt(t)}</p>`).join("");
  const star = (on) => `<svg class="star ${on ? "on" : "off"}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.500l2.700 6 6.500.6-4.900 4.300 1.500 6.400L12 16.500l-5.800 3.300 1.500-6.400L2.800 9.100l6.500-.6z"/></svg>`;
  const img = (src, alt, o = {}) => { const s = O.safeSrc(src); return s ? `<img src="${esc(s)}" alt="${esc(alt || "")}" ${o.eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${o.w ? ` width="${o.w}" height="${o.h}"` : ""}>` : ""; };
  const head = (kicker, title, sub) => `<header class="sec-head reveal"><p class="kicker">${esc(kicker)}</p><h2>${esc(title)}</h2>${sub ? `<p class="sec-sub">${fmt(sub)}</p>` : ""}</header>`;
  const sec = (id, inner, cls) => `<section class="sec${cls ? " " + cls : ""}" id="${id}" data-nav>${inner}</section>`;
  const cards = (list, kind) => (list || []).map((t, i) => `<details class="trait ${kind}" ${i === 0 && kind === "tab" ? "open" : ""}><summary><span class="glyph">${kind === "defaut" ? "✧" : "✦"}</span>${esc(t.titre)}<span class="chev" aria-hidden="true"></span></summary><div class="trait-body">${fmt(t.texte)}</div></details>`).join("");

  /* ---------- sections ---------- */
  function hero() {
    const I = D.identite, vies = +I.vies || 0, max = +I.vies_max || 9;
    const crown = Array.from({ length: max }, (_, i) => star(i < vies)).join("");
    return `<section class="hero" id="accueil" data-nav>
      <div class="hero-text">
        <p class="kicker reveal">${esc(I.clan)} · ${esc(I.rang)}</p>
        <h1 class="reveal"><span>${esc(String(I.nom).split(" de ")[0])} de</span> ${esc(String(I.nom).split(" de ").slice(1).join(" de "))}</h1>
        <p class="hero-sub reveal">${esc(I.sous_titre)}</p>
        <p class="hero-lead reveal">${fmt(I.accroche)}</p>
        ${I.citation ? `<blockquote class="hero-quote reveal">${fmt(I.citation)}</blockquote>` : ""}
        <div class="chips reveal"><span class="chip">${esc(I.lunes)} lunes</span><span class="chip">${esc(I.sexe)}</span><span class="chip">${esc(I.orientation)}</span><span class="chip mauve">Meneur à ${esc(I.lunes_meneur)} lunes</span></div>
        <div class="lives reveal" role="img" aria-label="${vies} vies sur ${max}"><div class="crown">${crown}</div><p>${vies} vies sur ${max} <span>· la première perdue aux Rochers du Soleil</span></p></div>
        <div class="hero-cta reveal"><a class="btn primary" href="#${firstId() || "galerie"}">Faire connaissance</a><a class="btn" href="#galerie">Voir la galerie</a></div>
      </div>
      <div class="hero-art reveal" id="art">
        <div class="halo" aria-hidden="true"></div>
        <div class="portrait">${img(I.image, "Portrait d'Étoile de Framboisier", { eager: true, w: 900, h: 900 })}</div>
        <span class="petal p1" aria-hidden="true"></span><span class="petal p2" aria-hidden="true"></span><span class="petal p3" aria-hidden="true"></span>
      </div>
    </section>`;
  }

  function glance() {
    const I = D.identite, pv = Math.min(+I.pv || 0, 100), pa = +I.pa || 0, t = +I.origine_tonnerre || 0, d = +I.origine_domestique || 0;
    return `<section class="glance" aria-label="En un regard">
      <div class="g-card reveal"><b>Âge</b><strong>${esc(I.lunes)} lunes</strong><small>meneur depuis ses ${esc(I.lunes_meneur)} lunes</small></div>
      <div class="g-card reveal"><b>PV</b><strong>${esc(I.pv)}</strong><div class="bar"><i style="--w:${pv}%"></i></div></div>
      <div class="g-card reveal"><b>PA</b><strong>${esc(I.pa)}</strong><div class="pips">${Array.from({ length: Math.max(pa, 6) }, (_, i) => `<i class="${i < pa ? "on" : ""}"></i>`).join("")}</div></div>
      <div class="g-card reveal"><b>Gabarit</b><strong>${esc(I.taille)}</strong><small>${esc(I.poids)}</small></div>
      <div class="g-card reveal"><b>Pelage</b><strong>${esc(I.pelage)}</strong><small>yeux : ${esc(I.yeux)}</small></div>
      <div class="g-card wide reveal"><b>Origines</b><div class="split"><i style="--w:${t}%"><span>${t}% Clan du Tonnerre</span></i><i class="b" style="--w:${d}%"><span>${d}% Domestique</span></i></div></div>
    </section>`;
  }

  function noms() {
    return sec("noms", head("Nomenclature", "Les noms", "Un nom à chaque étape de sa vie. Les anciens sont barrés, le dernier est celui qu'il porte aujourd'hui.") +
      `<ol class="names">${(D.noms || []).map((n, i) => `<li class="name reveal ${n.ancien === "oui" ? "old" : "now"}" style="--d:${i * 70}ms"><span class="step">${esc(n.etape)}</span><strong>${n.ancien === "oui" ? `<s>${esc(n.nom)}</s>` : esc(n.nom)}</strong>${n.texte ? `<p>${fmt(n.texte)}</p>` : ""}</li>`).join("")}</ol>`);
  }

  function caractere() {
    const c = D.caractere || {};
    return sec("caractere", head("Personnalité", "Caractère") +
      `<div class="reader reveal">${paras(c.intro)}${c.conclusion ? `<p class="closing">${fmt(c.conclusion)}</p>` : ""}</div>` +
      `<div class="duo"><div class="reveal"><h3 class="sub">Qualités</h3>${cards(c.qualites, "qualite")}</div><div class="reveal"><h3 class="sub">Défauts</h3>${cards(c.defauts, "defaut")}</div></div>`);
  }

  function gouts() {
    const g = D.gouts || {}, T = [["aime", "Ce qu'il aime"], ["deteste", "Ce qu'il déteste"], ["peurs", "Peurs & phobies"], ["habitudes", "Habitudes & tics"]].filter(([k]) => (g[k] || []).length);
    return sec("gouts", head("Au quotidien", "Goûts & peurs") +
      `<div class="tabs reveal" role="tablist">${T.map(([k, l], i) => `<button role="tab" id="tab-${k}" aria-selected="${i === 0}" aria-controls="pan-${k}" data-tab="${k}">${l}</button>`).join("")}</div>` +
      T.map(([k], i) => `<div class="panel" role="tabpanel" id="pan-${k}" aria-labelledby="tab-${k}" ${i ? "hidden" : ""}>${cards(g[k], k === "deteste" || k === "peurs" ? "defaut" : "qualite")}</div>`).join(""));
  }

  function physique() {
    const p = D.physique || {}, I = D.identite;
    return sec("physique", head("Apparence", "Physique") +
      `<div class="phys"><div class="reader reveal">${paras(p.description)}</div>
        <aside class="fiche reveal"><div class="fiche-img">${img(I.image2, "Étoile de Framboisier, en pose")}</div>
          <dl><dt>Taille</dt><dd>${esc(I.taille)}</dd><dt>Poids</dt><dd>${esc(I.poids)}</dd><dt>Pelage</dt><dd>${esc(I.pelage)}</dd><dt>Yeux</dt><dd>${esc(I.yeux)}</dd></dl>
          ${(p.signes || []).length ? `<ul class="tags">${p.signes.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>` : ""}
        </aside></div>` +
      `<div class="duo"><div class="reveal"><h3 class="sub">Points forts</h3>${cards(p.forts, "qualite")}</div><div class="reveal"><h3 class="sub">Points faibles</h3>${cards(p.faibles, "defaut")}</div></div>` +
      `<div class="feats">${p.accessoires ? `<article class="feat mauve reveal"><span class="feat-ic">✿</span><h3>Accessoires</h3><p>${fmt(p.accessoires)}</p></article>` : ""}${p.cicatrices ? `<article class="feat reveal"><span class="feat-ic">〰</span><h3>Cicatrices</h3><p>${fmt(p.cicatrices)}</p></article>` : ""}${p.handicap ? `<article class="feat reveal"><span class="feat-ic">◌</span><h3>Handicap</h3><p>${fmt(p.handicap)}</p></article>` : ""}</div>`);
  }

  function member(m) {
    const dead = m.statut === "mort", src = O.safeSrc(m.image);
    return `<li class="member ${dead ? "dead" : ""}" data-vivant="${dead ? "non" : "oui"}"><div class="avatar" style="--h:${[...m.nom].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7)}">${src ? `<img src="${esc(src)}" alt="" loading="lazy" decoding="async">` : esc(O.initials(m.nom))}</div>
      <div><strong>${esc(m.nom)}</strong><span class="rel">${esc(m.lien)}</span>${m.note ? `<small>${fmt(m.note)}</small>` : ""}<span class="badges"><em class="${dead ? "star" : "alive"}">${dead ? "✦ Aux étoiles" : "Vivant"}</em>${m.joueur ? `<em class="${m.joueur === "PJ" ? "pj" : ""}">${esc(m.joueur)}</em>` : ""}</span></div></li>`;
  }
  function famille() {
    const groups = [...new Set((D.famille || []).map((m) => m.groupe || "Autres"))];
    return sec("famille", head("Les siens", "Famille", "Une lignée de chats domestiques et de guerriers, une fratrie des Baies, et beaucoup de vide.") +
      `<div class="tabs reveal" role="group" aria-label="Filtrer"><button data-fam="tous" aria-pressed="true">Tous</button><button data-fam="oui" aria-pressed="false">Vivants</button><button data-fam="non" aria-pressed="false">Aux étoiles</button></div>` +
      groups.map((g) => `<div class="fam-group reveal"><h3 class="sub">${esc(g)}</h3><ul class="members">${D.famille.filter((m) => (m.groupe || "Autres") === g).map(member).join("")}</ul></div>`).join("") +
      ((D.mentorat || []).length ? `<h3 class="sub reveal" style="margin-top:2.4rem">Mentorat</h3><div class="mentors">${D.mentorat.map((m) => `<article class="mentor reveal"><span class="role">${esc(m.role)}</span><h4>${esc(m.nom)}</h4><p>${fmt(m.texte)}</p></article>`).join("")}</div>` : ""));
  }

  function histoire() {
    return sec("histoire", head("Son parcours", "Histoire", "De la Fratrie des Baies à la tête du Clan du Tonnerre.") +
      `<ol class="timeline">${(D.histoire || []).map((c, i) => `<li class="chap reveal"><span class="dot" aria-hidden="true">${i + 1}</span><div class="chap-card"><p class="period">${esc(c.periode)}</p><h3>${esc(c.titre)}</h3>${paras(c.paragraphes)}</div></li>`).join("")}</ol>`);
  }

  function convictions() {
    const v = D.convictions || {};
    return sec("convictions", head("Ce en quoi il croit", "Convictions") +
      `<div class="conv"><article class="reveal"><h3 class="sub">Relation au clan</h3><div class="reader">${paras(v.clan)}</div></article>
       <article class="reveal"><h3 class="sub">Avis sur les autres clans</h3><div class="clans">${(v.autres_clans || []).map((c) => `<div class="clan-card"><h4>${esc(c.nom)}</h4><p>${fmt(c.texte)}</p></div>`).join("")}</div></article>
       <article class="stars-card reveal"><h3 class="sub">Croyance — le Clan des Étoiles</h3><div class="reader">${paras(v.etoiles)}</div></article></div>`);
  }

  function libres() {
    return (D.libres || []).map((l, i) => sec("libre-" + i, head("À découvrir", l.titre) + `<div class="phys"><div class="reader reveal">${paras(l.paragraphes)}</div>${O.safeSrc(l.image) ? `<aside class="fiche reveal"><div class="fiche-img">${img(l.image, l.titre)}</div></aside>` : ""}</div>`)).join("");
  }

  function galerie() {
    const g = (D.galerie || []).filter((x) => O.safeSrc(x.image));
    return sec("galerie", head("Illustrations", "Galerie") +
      `<div class="gallery">${g.map((x, i) => `<figure class="shot reveal"><button data-lb="${i}" aria-label="Agrandir : ${esc(x.titre)}">${img(x.image, x.titre)}</button><figcaption><strong>${esc(x.titre)}</strong>${x.description ? `<span>${fmt(x.description)}</span>` : ""}</figcaption></figure>`).join("")}</div>`);
  }

  const SECTIONS = { noms, caractere, gouts, physique, famille, histoire, convictions, libres, galerie };
  const labels = { noms: "Noms", caractere: "Caractère", gouts: "Goûts", physique: "Physique", famille: "Famille", histoire: "Histoire", convictions: "Convictions", galerie: "Galerie" };
  const order = () => (D.reglages.sections || []).filter((s) => s.actif !== "non" && SECTIONS[s.id]);
  const firstId = () => (order()[0] || {}).id;

  /* ---------- rendu ---------- */
  function render() {
    const R = D.reglages, root = document.documentElement.style;
    [["creme", "--cream"], ["abricot", "--apricot"], ["brun", "--ink"], ["turquoise", "--aqua"], ["mauve", "--mauve"]].forEach(([k, v]) => { const c = R["couleur_" + k]; if (/^#[0-9a-f]{3,8}$/i.test(c || "")) root.setProperty(v + "-set", c); else root.removeProperty(v + "-set"); });
    document.title = R.titre_page || document.title;
    $("#credits").textContent = D.identite.credits || "";
    $("#foot-text").textContent = R.texte_pied || "Personnage créé par";
    $("#app").innerHTML = hero() + glance() + order().map((s) => SECTIONS[s.id]()).join("");
    // menu
    const items = [["accueil", "Accueil"]];
    order().forEach((s) => (s.id === "libres" ? (D.libres || []).forEach((l, i) => items.push(["libre-" + i, l.titre])) : items.push([s.id, labels[s.id]])));
    $("#menu").innerHTML = items.map(([id, l]) => `<a href="#${id}" data-id="${id}">${esc(l)}</a>`).join("");
    bind();
    particles();
  }

  function bind() {
    if (io) io.disconnect();
    io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    $$(".reveal").forEach((el) => { io.observe(el); if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in"); });
    // scroll-spy
    const spy = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) $$("#menu a").forEach((a) => a.classList.toggle("on", a.dataset.id === e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
    $$("[data-nav]").forEach((s) => spy.observe(s));
    // onglets goûts
    $$("[data-tab]").forEach((b) => b.addEventListener("click", () => {
      $$("[data-tab]").forEach((x) => x.setAttribute("aria-selected", x === b));
      $$(".panel").forEach((p) => (p.hidden = p.id !== "pan-" + b.dataset.tab));
    }));
    // filtre famille
    $$("[data-fam]").forEach((b) => b.addEventListener("click", () => {
      $$("[data-fam]").forEach((x) => x.setAttribute("aria-pressed", x === b));
      $$(".member").forEach((m) => (m.hidden = b.dataset.fam !== "tous" && m.dataset.vivant !== b.dataset.fam));
      $$(".fam-group").forEach((g) => (g.hidden = !$$(".member:not([hidden])", g).length));
    }));
    // galerie
    $$("[data-lb]").forEach((b) => b.addEventListener("click", () => lb(+b.dataset.lb)));
    // légère inclinaison du portrait
    const art = $("#art");
    if (art && matchMedia("(hover:hover) and (prefers-reduced-motion:no-preference)").matches) {
      art.addEventListener("pointermove", (e) => { const r = art.getBoundingClientRect(); art.style.setProperty("--rx", ((e.clientY - r.top) / r.height - 0.5) * -6 + "deg"); art.style.setProperty("--ry", ((e.clientX - r.left) / r.width - 0.5) * 8 + "deg"); });
      art.addEventListener("pointerleave", () => { art.style.setProperty("--rx", "0deg"); art.style.setProperty("--ry", "0deg"); });
    }
    // ancre initiale
    if (location.hash) { const t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
  }

  /* ---------- lightbox ---------- */
  let cur = 0;
  function lb(i) {
    const g = (D.galerie || []).filter((x) => O.safeSrc(x.image)); if (!g.length) return;
    cur = (i + g.length) % g.length;
    const L = $("#lightbox"); $("img", L).src = O.safeSrc(g[cur].image); $("img", L).alt = g[cur].titre || ""; $("figcaption", L).textContent = [g[cur].titre, g[cur].description].filter(Boolean).join(" — ");
    L.hidden = false; document.body.style.overflow = "hidden"; $(".lb-close", L).focus();
  }
  const closeLb = () => { $("#lightbox").hidden = true; document.body.style.overflow = ""; };
  $(".lb-close").onclick = closeLb; $(".lb-nav.prev").onclick = () => lb(cur - 1); $(".lb-nav.next").onclick = () => lb(cur + 1);
  $("#lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") closeLb(); });
  document.addEventListener("keydown", (e) => { if ($("#lightbox").hidden) return; if (e.key === "Escape") closeLb(); if (e.key === "ArrowLeft") lb(cur - 1); if (e.key === "ArrowRight") lb(cur + 1); });

  /* ---------- nav, thème, progression ---------- */
  const burger = $("#burger");
  burger.onclick = () => { const o = document.body.classList.toggle("menu-open"); burger.setAttribute("aria-expanded", o); };
  $("#menu").addEventListener("click", (e) => { if (e.target.closest("a")) { document.body.classList.remove("menu-open"); burger.setAttribute("aria-expanded", "false"); } });
  const themeBtn = $("#theme");
  const paintTheme = () => { themeBtn.textContent = document.documentElement.dataset.theme === "nuit" ? "☀" : "☾"; };
  themeBtn.onclick = () => { const n = document.documentElement.dataset.theme === "nuit" ? "jour" : "nuit"; document.documentElement.dataset.theme = n; try { localStorage.setItem("fr-theme", n); } catch (e) {} paintTheme(); particles(); };
  paintTheme();
  const up = $("#up"), bar = $("#progress"), nav = $("#nav");
  let tick = false;
  addEventListener("scroll", () => { if (tick) return; tick = true; requestAnimationFrame(() => { const h = document.documentElement, y = h.scrollTop, m = h.scrollHeight - h.clientHeight; bar.style.transform = `scaleX(${m > 0 ? y / m : 0})`; up.classList.toggle("show", y > 700); nav.classList.toggle("solid", y > 24); tick = false; }); }, { passive: true });
  up.onclick = () => scrollTo({ top: 0, behavior: "smooth" });

  /* ---------- pétales / étoiles qui dérivent (léger, mis en pause hors écran) ---------- */
  let raf = 0;
  function particles() {
    cancelAnimationFrame(raf);
    const cv = $("#fx"), ctx = cv.getContext("2d"), night = document.documentElement.dataset.theme === "nuit";
    ctx.clearRect(0, 0, cv.width, cv.height);
    if (D.reglages.particules === "non" || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const dpr = Math.min(devicePixelRatio || 1, 2); let W, H;
    const size = () => { W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); addEventListener("resize", size);
    const N = W < 700 ? 14 : 26, cols = night ? ["#ffe9a8", "#bfe9f5", "#d9b8e6"] : ["#9a62a8", "#f2a65a", "#3ec3df", "#f7c98e"];
    const P = Array.from({ length: N }, () => ({ x: Math.random() * W, y: Math.random() * H, r: 2 + Math.random() * 4, vy: 0.12 + Math.random() * 0.3, vx: (Math.random() - 0.5) * 0.25, a: Math.random() * 6.28, s: 0.005 + Math.random() * 0.012, c: cols[(Math.random() * cols.length) | 0], o: 0.25 + Math.random() * 0.4 }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of P) {
        p.y += night ? -p.vy * 0.5 : p.vy; p.x += p.vx + Math.sin(p.a) * 0.3; p.a += p.s;
        if (p.y > H + 10) p.y = -10; if (p.y < -10) p.y = H + 10; if (p.x > W + 10) p.x = -10; if (p.x < -10) p.x = W + 10;
        ctx.globalAlpha = p.o * (night ? 0.5 + Math.sin(p.a * 3) * 0.5 : 1); ctx.fillStyle = p.c;
        ctx.beginPath();
        if (night) ctx.arc(p.x, p.y, p.r * 0.45, 0, 6.28); else ctx.ellipse(p.x, p.y, p.r, p.r * 0.55, p.a, 0, 6.28);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    document.onvisibilitychange = () => { cancelAnimationFrame(raf); if (!document.hidden) draw(); };
  }

  /* ---------- démarrage ---------- */
  const c0 = cached();
  if (c0) D = O.merge(window.DEFAULT_CONTENT, c0);
  render();
  remote().then((r) => {
    if (!r) return;
    const next = O.merge(window.DEFAULT_CONTENT, r);
    try { localStorage.setItem(CACHE, JSON.stringify(r)); } catch (e) {}
    if (JSON.stringify(next) !== JSON.stringify(D)) { D = next; render(); }
  });
})();
