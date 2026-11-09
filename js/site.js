(function () {
  const C = window.SITE_CONFIG, O = window.Outils, esc = O.esc, fmt = O.fmt;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => [...(r || document).querySelectorAll(s)];
  const CACHE = "fr-content";
  let D = O.load({});
  let io, RELS = [], SCENES = [], CHAPS = [];

  const THEMES = {
    calme: { l: "Scène calme", ic: "🌿" },
    ceremonie: { l: "Cérémonie · discours", ic: "✨" },
    tension: { l: "Bataille · tension", ic: "⚔️" },
    activite: { l: "Chasse · patrouille · entraînement", ic: "🌲" },
    etoiles: { l: "Songe · Clan des Étoiles", ic: "🌙" },
    deuil: { l: "Deuil · tristesse", ic: "🌧️" },
  };

  /* ---------- chargement : contenu enregistré (cache) puis base en ligne ---------- */
  const cached = () => { try { return JSON.parse(localStorage.getItem(CACHE)); } catch (e) { return null; } };
  async function remote() {
    if (!window.supabase || /[?&]local\b/.test(location.search)) return null; // ?local : aperçu sans la base
    try {
      const sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_KEY);
      const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 5000));
      const { data, error } = await Promise.race([sb.from(C.TABLE).select("data").eq("id", C.CONTENT_ID).maybeSingle(), timeout]);
      if (error) throw error;
      return data && data.data ? data.data : null;
    } catch (e) { return null; }
  }

  /* ---------- données dérivées ---------- */
  function uniqSlugs(list, key, fallback) {
    const used = {};
    return list.map((x, i) => { const base = O.slug(x[key]) || fallback + "-" + (i + 1); let s = base, n = 2; while (used[s]) s = base + "-" + n++; used[s] = 1; return s; });
  }
  function derive() {
    RELS = [...(D.famille || []).map((r) => ({ ...r, _k: "famille" })), ...(D.relations || []).map((r) => ({ ...r, _k: "diverses" }))];
    uniqSlugs(RELS, "nom", "fiche").forEach((s, i) => (RELS[i]._s = s));
    SCENES = (D.scenes || []).map((s) => ({ ...s }));
    uniqSlugs(SCENES, "titre", "scene").forEach((s, i) => (SCENES[i]._s = s));
    const lu = (s) => { const m = String(s.lune ?? "").match(/\d+/); return m ? +m[0] : 1e9; };
    SCENES = SCENES.map((s, i) => [s, i]).sort((a, b) => lu(a[0]) - lu(b[0]) || a[1] - b[1]).map((x) => x[0]); // chronologique : lune croissante, sans lune a la fin
    CHAPS = (D.histoire || []).map((c) => ({ ...c }));
    uniqSlugs(CHAPS, "titre", "chapitre").forEach((s, i) => (CHAPS[i]._s = s));
  }
  const enabled = (id) => ((D.reglages.sections || []).find((s) => s.id === id) || { actif: "oui" }).actif !== "non";
  const nameIndex = () => { const m = {}; RELS.forEach((r) => [r.nom, r.avant, ...(r.renoms || []).map((x) => x.nom)].filter(Boolean).forEach((n) => (m[O.slug(n)] = r._s))); return m; };
  const maxLune = () => Math.max(+D.identite.lunes || 0, ...RELS.flatMap((r) => [...(r.avis || []), ...(r.renoms || [])].map(O.lunes)), ...SCENES.map((s) => parseInt(s.lune) || 0));

  /* ---------- petites briques ---------- */
  const rich = (v, cls) => { const h = O.html(v); return h ? `<div class="rich${cls ? " " + cls : ""}">${h}</div>` : ""; };
  const star = (on) => `<svg class="star ${on ? "on" : "off"}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5l2.7 6 6.5.6-4.9 4.3 1.5 6.4L12 16.5l-5.8 3.3 1.5-6.4L2.8 9.1l6.5-.6z"/></svg>`;
  const img = (src, alt, o = {}) => { const s = O.safeSrc(src); return s ? `<img src="${esc(s)}" alt="${esc(alt || "")}" ${o.eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${o.w ? ` width="${o.w}" height="${o.h}"` : ""}>` : ""; };
  const head = (kicker, title, sub) => `<header class="sec-head reveal"><p class="kicker">${esc(kicker)}</p><h1>${esc(title)}</h1>${sub ? `<p class="sec-sub">${fmt(sub)}</p>` : ""}</header>`;
  const empty = (t) => `<p class="empty reveal">${t}</p>`;
  const subnav = (base, items, cur) => `<nav class="subnav reveal" aria-label="Sous-pages">${items.map(([id, l]) => `<a href="#/${base}/${id}"${id === cur ? ' class="on" aria-current="page"' : ""}>${esc(l)}</a>`).join("")}</nav>`;
  const pager = (prev, next) => `<nav class="pager">${prev ? `<a class="prev" href="${prev[0]}"><small>Précédent</small>${esc(prev[1])}</a>` : "<span></span>"}${next ? `<a class="next" href="${next[0]}"><small>Suivant</small>${esc(next[1])}</a>` : ""}</nav>`;
  const cards = (list, kind) => (list || []).map((t) => `<details class="trait ${kind}"><summary><span class="glyph">${kind === "defaut" ? "✧" : "✦"}</span>${esc(t.titre)}<span class="chev" aria-hidden="true"></span></summary><div class="trait-body">${rich(t.texte)}</div></details>`).join("");
  const unique = (a) => [...new Set(a.filter(Boolean))];

  /* ---------- accueil ---------- */
  function home() {
    const I = D.identite, vies = +I.vies || 0, max = +I.vies_max || 9, pvMax = +I.pv_max || 60, pv = Math.min(100, ((+I.pv || 0) / pvMax) * 100), pa = +I.pa || 0, t = +I.origine_tonnerre || 0, d = +I.origine_domestique || 0;
    const crown = Array.from({ length: max }, (_, i) => star(i < vies)).join("");
    const first = (D.reglages.sections.find((s) => s.actif !== "non" && s.id !== "libres") || {}).id || "personnage";
    const tiles = [
      ["personnage", "🪞", "Personnage", "Caractère, physique, goûts, noms et convictions."],
      ["histoire", "📜", "Histoire", `${CHAPS.length} chapitre${CHAPS.length > 1 ? "s" : ""}, de la Fratrie des Baies au Clan du Tonnerre.`],
      ["relations", "🍓", "Relations", `${RELS.length} fiche${RELS.length > 1 ? "s" : ""} : famille, relations diverses, vue d'ensemble.`],
      ["scenes", "✎", "Scènes RP", `${SCENES.length} fil${SCENES.length > 1 ? "s" : ""} de role-play à lire sans quitter le site.`],
      ["galerie", "🖼️", "Galerie", "Les illustrations."],
    ].filter((x) => enabled(x[0]));
    const live = SCENES.filter((s) => s.en_cours === "oui").slice(0, 3);
    return `<section class="hero">
      <div class="hero-text">
        <p class="kicker reveal">${esc(I.clan)} · ${esc(I.rang)}</p>
        <h1 class="reveal"><span>${esc(String(I.nom).split(" de ")[0])} de</span> ${esc(String(I.nom).split(" de ").slice(1).join(" de "))}</h1>
        <p class="hero-sub reveal">${esc(I.sous_titre)}</p>
        <p class="hero-lead reveal">${fmt(I.accroche)}</p>
        ${I.citation ? `<blockquote class="hero-quote reveal">${fmt(I.citation)}</blockquote>` : ""}
        <div class="chips reveal"><span class="chip">${esc(I.lunes)} lunes</span><span class="chip">${esc(I.sexe)}</span><span class="chip">${esc(I.orientation)}</span><span class="chip mauve">Meneur à ${esc(I.lunes_meneur)} lunes</span></div>
        <div class="lives reveal" role="img" aria-label="${vies} vies sur ${max}"><div class="crown">${crown}</div><p>${vies} vies sur ${max} <span>· la première perdue aux Rochers du Soleil</span></p></div>
        <div class="hero-cta reveal"><a class="btn primary" href="#/${first}">Faire connaissance</a>${enabled("scenes") ? '<a class="btn" href="#/scenes">Lire les scènes RP</a>' : ""}</div>
      </div>
      <div class="hero-art reveal" id="art"><div class="halo" aria-hidden="true"></div><div class="portrait">${img(I.image, "Portrait d'Étoile de Framboisier", { eager: true, w: 900, h: 900 })}</div><span class="petal p1" aria-hidden="true"></span><span class="petal p2" aria-hidden="true"></span><span class="petal p3" aria-hidden="true"></span></div>
    </section>
    <section class="glance" aria-label="En un regard">
      <div class="g-card reveal"><b>Âge</b><strong>${esc(I.lunes)} lunes</strong><small>meneur depuis ses ${esc(I.lunes_meneur)} lunes</small></div>
      <div class="g-card reveal"><b>PV</b><strong>${esc(I.pv)} <small>/ ${pvMax}</small></strong><div class="bar"><i style="--w:${pv}%"></i></div><small>${esc(I.pv_note || "")}</small></div>
      <div class="g-card reveal"><b>PA</b><strong>${esc(I.pa)}</strong><div class="pips">${Array.from({ length: Math.max(pa, 6) }, (_, i) => `<i class="${i < pa ? "on" : ""}"></i>`).join("")}</div></div>
      <div class="g-card reveal"><b>Gabarit</b><strong>${esc(I.taille)}</strong><small>${esc(I.poids)}</small></div>
      <div class="g-card reveal"><b>Pelage</b><strong>${esc(I.pelage)}</strong><small>yeux : ${esc(I.yeux)}</small></div>
      <div class="g-card wide reveal"><b>Origines</b><div class="split"><i style="--w:${t}%"><span>${t}% Clan du Tonnerre</span></i><i class="b" style="--w:${d}%"><span>${d}% Domestique</span></i></div></div>
    </section>
    <section class="tiles">${tiles.map(([id, ic, n, t]) => `<a class="tile reveal" href="#/${id}"><span class="tile-ic">${ic}</span><h2>${esc(n)}</h2><p>${esc(t)}</p><span class="go" aria-hidden="true">→</span></a>`).join("")}</section>
    ${live.length ? `<section class="live reveal"><h2 class="sub">Scènes en cours</h2><ul class="scene-list">${live.map(sceneCard).join("")}</ul></section>` : ""}`;
  }

  /* ---------- personnage ---------- */
  const PERSO = [["caractere", "Caractère"], ["physique", "Physique"], ["gouts", "Goûts & peurs"], ["noms", "Les noms"], ["convictions", "Convictions"]];
  function personnage(sub) {
    const cur = PERSO.some((x) => x[0] === sub) ? sub : PERSO[0][0], i = PERSO.findIndex((x) => x[0] === cur);
    const P = { caractere, physique, gouts, noms, convictions }[cur]();
    return head("Personnage", PERSO[i][1]) + subnav("personnage", PERSO, cur) + `<div class="sub-page">${P}</div>` + pager(PERSO[i - 1] && ["#/personnage/" + PERSO[i - 1][0], PERSO[i - 1][1]], PERSO[i + 1] && ["#/personnage/" + PERSO[i + 1][0], PERSO[i + 1][1]]);
  }
  function caractere() {
    const c = D.caractere || {};
    return `<div class="reader reveal">${rich(c.intro)}${c.conclusion ? `<p class="closing">${fmt(c.conclusion)}</p>` : ""}</div>
      <div class="duo"><div class="reveal"><h2 class="sub">Qualités</h2>${cards(c.qualites, "qualite")}</div><div class="reveal"><h2 class="sub">Défauts</h2>${cards(c.defauts, "defaut")}</div></div>`;
  }
  function gouts() {
    const g = D.gouts || {}, T = [["aime", "Ce qu'il aime"], ["deteste", "Ce qu'il déteste"], ["peurs", "Peurs & phobies"], ["habitudes", "Habitudes & tics"]].filter(([k]) => (g[k] || []).length);
    if (!T.length) return empty("Rien à lire ici pour le moment.");
    return `<div class="tabs reveal" role="tablist">${T.map(([k, l], i) => `<button role="tab" id="tab-${k}" aria-selected="${i === 0}" aria-controls="pan-${k}" data-tab="${k}">${l}</button>`).join("")}</div>` +
      T.map(([k], i) => `<div class="panel" role="tabpanel" id="pan-${k}" aria-labelledby="tab-${k}" ${i ? "hidden" : ""}>${cards(g[k], k === "deteste" || k === "peurs" ? "defaut" : "qualite")}</div>`).join("");
  }
  function physique() {
    const p = D.physique || {}, I = D.identite;
    return `<div class="phys"><div class="reader reveal">${rich(p.description)}</div>
        <aside class="fiche reveal"><div class="fiche-img">${img(I.image2, "Étoile de Framboisier, en pose")}</div>
          <dl><dt>Taille</dt><dd>${esc(I.taille)}</dd><dt>Poids</dt><dd>${esc(I.poids)}</dd><dt>Pelage</dt><dd>${esc(I.pelage)}</dd><dt>Yeux</dt><dd>${esc(I.yeux)}</dd></dl>
          ${(p.signes || []).length ? `<ul class="tags">${p.signes.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>` : ""}</aside></div>
      <div class="duo"><div class="reveal"><h2 class="sub">Points forts</h2>${cards(p.forts, "qualite")}</div><div class="reveal"><h2 class="sub">Points faibles</h2>${cards(p.faibles, "defaut")}</div></div>
      <div class="feats">${p.accessoires ? `<article class="feat mauve reveal"><span class="feat-ic">✿</span><h2>Accessoires</h2>${rich(p.accessoires)}</article>` : ""}${p.cicatrices ? `<article class="feat reveal"><span class="feat-ic">〰</span><h2>Cicatrices</h2>${rich(p.cicatrices)}</article>` : ""}${O.plain(p.handicap) ? `<article class="feat reveal"><span class="feat-ic">◌</span><h2>Handicap</h2>${rich(p.handicap)}</article>` : ""}</div>`;
  }
  function noms() {
    return `<p class="sec-sub reveal">Un nom à chaque étape de sa vie. Les anciens sont barrés, le dernier est celui qu'il porte aujourd'hui.</p><ol class="names">${(D.noms || []).map((n, i) => `<li class="name reveal ${n.ancien === "oui" ? "old" : "now"}" style="--d:${i * 70}ms"><span class="step">${esc(n.etape)}${n.lune !== "" && n.lune != null ? ` · lune ${esc(n.lune)}` : ""}</span><strong>${n.ancien === "oui" ? `<s>${esc(n.nom)}</s>` : esc(n.nom)}</strong>${rich(n.texte)}</li>`).join("")}</ol>`;
  }
  function convictions() {
    const v = D.convictions || {};
    return `<div class="conv"><article class="reveal"><h2 class="sub">Relation au clan</h2>${rich(v.clan, "reader")}</article>
      <article class="reveal"><h2 class="sub">Avis sur les autres clans</h2><div class="clans">${(v.autres_clans || []).map((c) => `<div class="clan-card"><h3>${esc(c.nom)}</h3>${rich(c.texte)}</div>`).join("")}</div></article>
      <article class="stars-card reveal"><h2 class="sub">Croyance — le Clan des Étoiles</h2>${rich(v.etoiles, "reader")}</article></div>`;
  }

  /* ---------- histoire (chapitres = sous-pages) ---------- */
  function histoire(sub) {
    if (!CHAPS.length) return head("Son parcours", "Histoire") + empty("Aucun chapitre pour le moment.");
    let i = CHAPS.findIndex((c) => c._s === sub); if (i < 0) i = 0;
    const c = CHAPS[i];
    return head("Son parcours", "Histoire") +
      `<nav class="subnav chaps reveal" aria-label="Chapitres">${CHAPS.map((x, j) => `<a href="#/histoire/${x._s}"${j === i ? ' class="on" aria-current="page"' : ""}><b>${j + 1}</b>${esc(x.titre)}</a>`).join("")}</nav>
      <article class="chapter sub-page"><p class="period">Chapitre ${i + 1}${c.periode ? " · " + esc(c.periode) : ""}</p><h2>${esc(c.titre)}</h2>${rich(c.paragraphes, "reader story")}</article>` +
      pager(CHAPS[i - 1] && ["#/histoire/" + CHAPS[i - 1]._s, CHAPS[i - 1].titre], CHAPS[i + 1] && ["#/histoire/" + CHAPS[i + 1]._s, CHAPS[i + 1].titre]);
  }

  /* ---------- relations ---------- */
  const REL = [["famille", "Famille"], ["diverses", "Relations diverses"], ["ensemble", "Toutes les relations"]];
  const appBadge = (a, L) => { const k = O.avisAt(a, L); return k ? `<span class="app ${O.APP[k.appreciation].g}" title="${esc(O.APP[k.appreciation].label)}">${O.APP[k.appreciation].glyph}</span>` : ""; };
  const stBadge = (st) => (st === "mort" ? '<em class="dec">✦ Décédé·e</em>' : st === "disparu" ? '<em class="gone">? Disparu·e</em>' : '<em class="alive">Vivant·e</em>');
  function avatar(r, big) {
    const s = O.safeSrc(r.image), n = r.nom || "?";
    return `<div class="avatar${big ? " big" : ""}" style="--h:${[...n].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7)}">${s ? `<img src="${esc(s)}" alt="" loading="lazy" decoding="async">` : esc(O.initials(n))}</div>`;
  }
  function relCard(r, L) {
    const st = O.statutAt(r, L), av = O.avisAt(r, L), nom = O.nomAt(r, L);
    return `<li class="member ${st !== "vivant" ? "dead" : ""}"><a class="mem-link" href="#/relations/fiche/${r._s}" aria-label="Fiche de ${esc(nom)}"></a>${avatar(r)}
      <div><strong>${esc(nom)}</strong><span class="rel">${esc(r.lien)}</span>${(r._k === "famille" ? r.rang : r.groupe || r.rang) ? `<small>${esc((r._k === "famille" ? [r.rang] : [r.groupe, r.rang]).filter(Boolean).join(" · "))}</small>` : ""}
      <span class="badges">${stBadge(st)}${r.joueur ? `<em class="${r.joueur === "PJ" ? "pj" : ""}">${esc(r.joueur)}</em>` : ""}${av ? appBadge(r, L) : ""}${av && av.respect === "oui" ? '<em class="resp">Respect</em>' : ""}${av && av.mitige === "oui" ? '<em class="mit">Mitigé</em>' : ""}</span></div></li>`;
  }
  function groups(list, base) {
    if (!list.length) return empty("Rien ici pour le moment — les fiches s'ajoutent depuis le dashboard.");
    return unique(list.map((r) => r.groupe || "Autres")).map((g) => `<div class="fam-group reveal"><h2 class="sub">${esc(g)}</h2><ul class="members">${list.filter((r) => (r.groupe || "Autres") === g).map((r) => relCard(r)).join("")}</ul></div>`).join("");
  }
  function relations(sub, id) {
    if (sub === "fiche") return fiche(id);
    const cur = REL.some((x) => x[0] === sub) ? sub : "famille";
    let body = "";
    if (cur === "famille") body = `<p class="sec-sub reveal">Une lignée de chats domestiques et de guerriers, une fratrie des Baies, et beaucoup de vide.</p>${groups(RELS.filter((r) => r._k === "famille"))}`;
    if (cur === "diverses") body = `<p class="sec-sub reveal">Mentors, apprentis, amis, rivaux… Clique sur une carte pour ouvrir la fiche et suivre l'évolution de son avis, lune après lune.</p>${groups(RELS.filter((r) => r._k === "diverses"))}`;
    if (cur === "ensemble") {
      const M = maxLune(), clans = unique(RELS.map((r) => r.groupe));
      body = `<p class="sec-sub reveal">Toutes les fiches (famille et relations diverses) sur une seule page, avec recherche et filtres : par clan, par état (vivant, décédé, disparu) ou par appréciation. Le curseur « À la lune » remonte le temps : il montre ce que Framboisier pensait de chacun à cette lune, et qui était encore là.</p>
        <div class="ens reveal"><div class="ens-row"><input type="search" id="q" placeholder="Chercher un nom…" aria-label="Chercher un nom">
          <select id="f-kind" aria-label="Type"><option value="">Toutes les fiches</option><option value="famille">Famille</option><option value="diverses">Relations diverses</option></select>
          <select id="f-clan" aria-label="Clan"><option value="">Tous les clans</option>${clans.map((c) => `<option>${esc(c)}</option>`).join("")}</select>
          <select id="f-app" aria-label="Appréciation"><option value="">Toutes appréciations</option><option value="pos">🍓 Positives</option><option value="neutre">☁️ Neutres</option><option value="neg">🐛 Négatives</option><option value="none">Sans avis</option></select>
          <select id="f-st" aria-label="État"><option value="">Tous les états</option><option value="vivant">Vivant·e·s</option><option value="mort">Décédé·e·s</option><option value="disparu">Disparu·e·s</option></select></div>
          <label class="slider">À la lune <output id="lv">${M}</output><input type="range" id="lune" min="0" max="${M}" value="${M}" aria-label="Lune"></label>
          <div class="ens-index" id="ens-index" aria-live="polite"></div></div><ul class="members" id="ens-list"></ul>`;
    }
    const i = REL.findIndex((x) => x[0] === cur);
    return head("Les autres chats", "Relations") + subnav("relations", REL, cur) + `<div class="sub-page">${body}</div>` + pager(REL[i - 1] && ["#/relations/" + REL[i - 1][0], REL[i - 1][1]], REL[i + 1] && ["#/relations/" + REL[i + 1][0], REL[i + 1][1]]);
  }
  function bindEnsemble() {
    const list = $("#ens-list"); if (!list) return;
    const g = (id) => $(id).value;
    const draw = () => {
      const L = +g("#lune"), q = O.norm(g("#q")); $("#lv").textContent = L;
      const rows = RELS.filter((r) => {
        const av = O.avisAt(r, L), st = O.statutAt(r, L);
        return (!q || O.norm(r.nom + " " + O.nomAt(r, L)).includes(q)) && (!g("#f-kind") || r._k === g("#f-kind")) && (!g("#f-clan") || r.groupe === g("#f-clan")) && (!g("#f-st") || st === g("#f-st")) &&
          (!g("#f-app") || (g("#f-app") === "none" ? !av : av && O.APP[av.appreciation].g === g("#f-app")));
      });
      const count = { pos3: 0, pos2: 0, pos1: 0, neutre: 0, neg1: 0, neg2: 0, neg3: 0, none: 0 };
      rows.forEach((r) => { const a = O.avisAt(r, L); count[a ? a.appreciation : "none"]++; });
      $("#ens-index").innerHTML = `<span><b>${rows.length}</b> fiche${rows.length > 1 ? "s" : ""}</span>` + Object.keys(O.APP).map((k) => (count[k] ? `<span class="app ${O.APP[k].g}" title="${esc(O.APP[k].label)}">${O.APP[k].glyph} <b>${count[k]}</b></span>` : "")).join("") + (count.none ? `<span class="app">Sans avis <b>${count.none}</b></span>` : "");
      list.innerHTML = rows.length ? rows.map((r) => relCard(r, L)).join("") : '<li class="empty">Aucune fiche ne correspond.</li>';
    };
    $$(".ens input, .ens select").forEach((e) => e.addEventListener("input", draw));
    draw();
  }
  function fiche(id) {
    const r = RELS.find((x) => x._s === id);
    if (!r) return head("Relations", "Fiche introuvable") + empty('Cette fiche n\'existe pas. <a href="#/relations/ensemble">Voir toutes les relations</a>.');
    const st = O.statutAt(r), cur = O.avisAt(r), avis = O.sortedAvis(r), same = RELS.filter((x) => x._k === r._k), i = same.indexOf(r);
    const ren = [...(r.renoms || [])].filter((x) => x.nom).sort((a, b) => O.lunes(a) - O.lunes(b));
    return `<p class="back reveal"><a href="#/relations/${r._k}">← ${r._k === "famille" ? "Famille" : "Relations diverses"}</a> · <a href="#/relations/ensemble">Vue d'ensemble</a></p>
      <article class="rel-page">
        <header class="rel-head reveal">${avatar(r, true)}<div><p class="kicker">${esc(r.lien)}</p><h1>${esc(r.nom)}</h1>
          <div class="chips">${r.groupe ? `<span class="chip">${esc(r.groupe)}</span>` : ""}${r.rang ? `<span class="chip">${esc(r.rang)}</span>` : ""}<span class="chip ${r.joueur === "PJ" ? "mauve" : ""}">${esc(r.joueur || "PNJ")}${r.joueur === "PJ" && r.pseudo ? " · " + esc(r.pseudo) : ""}</span></div>
          <p class="badges big">${stBadge(st)}${cur ? `<span class="app ${O.APP[cur.appreciation].g}">${O.APP[cur.appreciation].glyph} ${esc(O.APP[cur.appreciation].label)}</span>` : ""}${cur && cur.respect === "oui" ? '<em class="resp">Respect</em>' : ""}${cur && cur.mitige === "oui" ? '<em class="mit">Mitigé</em>' : ""}</p></div></header>
        ${ren.length ? `<section class="renoms reveal"><h2 class="sub">Changements de nom</h2><ol><li>${r.avant ? `<s>${esc(r.avant)}</s> <small>à l'origine</small>` : ""}</li>${ren.map((x, j) => `<li>${j < ren.length - 1 ? `<s>${esc(x.nom)}</s>` : `<strong>${esc(x.nom)}</strong>`} <small>depuis la lune ${esc(x.lune)}${x.note ? " · " + esc(x.note) : ""}</small></li>`).join("")}</ol></section>` : ""}
        ${O.plain(r.notes) ? `<section class="reveal">${rich(r.notes, "reader")}</section>` : ""}
        <section class="avis reveal"><h2 class="sub">Son avis, lune après lune</h2>
          ${avis.length ? `<div class="avis-trail" aria-hidden="true">${avis.filter((a) => a.appreciation).map((a) => `<span class="app ${O.APP[a.appreciation].g}" title="Lune ${esc(a.lune)}">${O.APP[a.appreciation].glyph}</span>`).join("<i></i>")}</div>
          <ol class="avis-list">${avis.map((a) => `<li class="${a.etat ? "ev" : ""}"><span class="lune">${a.lune === "" || a.lune == null ? "—" : "Lune " + esc(a.lune)}</span><div class="avis-body"><p class="badges">${a.appreciation ? `<span class="app ${O.APP[a.appreciation].g}">${O.APP[a.appreciation].glyph} ${esc(O.APP[a.appreciation].label)}</span>` : ""}${a.respect === "oui" ? '<em class="resp">Respect</em>' : ""}${a.mitige === "oui" ? '<em class="mit">Mitigé</em>' : ""}${a.etat ? `<em class="${a.etat === "revenu" ? "alive" : a.etat === "mort" ? "dec" : "gone"}">${esc(O.ETAT[a.etat] || a.etat)}</em>` : ""}</p>${rich(a.texte)}</div></li>`).join("")}</ol>` : empty("Pas encore d'avis enregistré.")}</section>
        ${pager(same[i - 1] && ["#/relations/fiche/" + same[i - 1]._s, same[i - 1].nom], same[i + 1] && ["#/relations/fiche/" + same[i + 1]._s, same[i + 1].nom])}
      </article>`;
  }

  /* ---------- scènes RP ---------- */
  const partChips = (s) => { const idx = nameIndex(); return (s.participants || []).map((n) => (idx[O.slug(n)] ? `<a class="chip pc" href="#/relations/fiche/${idx[O.slug(n)]}">${esc(n)}</a>` : `<span class="chip pc">${esc(n)}</span>`)).join(""); };
  const sceneState = (s) => (s.en_cours === "oui" ? '<span class="state live">● En cours</span>' : '<span class="state done">✓ Terminée</span>');
  function sceneCard(s) {
    const T = THEMES[s.theme] || THEMES.calme;
    return `<li class="scene-card" data-i="${SCENES.indexOf(s)}" data-u="${/\d/.test(String(s.lune ?? "")) ? 0 : 1}" data-theme="${esc(THEMES[s.theme] ? s.theme : "calme")}" data-live="${s.en_cours === "oui" ? 1 : 0}" data-q="${esc(O.norm([s.titre, s.description, (s.participants || []).join(" ")].join(" ")))}">
      <span class="sc-theme" title="${esc(T.l)}">${T.ic} ${esc(T.l)}</span>
      <h3><a class="sc-link" href="#/scenes/${s._s}">${esc(s.titre)}</a></h3>
      <p class="sc-meta">${s.lune !== "" && s.lune != null ? `Lune ${esc(s.lune)} · ` : ""}${sceneState(s)}</p>
      ${s.description ? `<p class="sc-desc">${esc(s.description)}</p>` : ""}
      <div class="chips">${(s.participants || []).map((n) => `<span class="chip pc">${esc(n)}</span>`).join("")}</div>
      <div class="sc-actions"><span class="read">Lire la scène →</span>${O.safeLink(s.lien) ? `<a class="btn small discord" href="${esc(s.lien)}" target="_blank" rel="noopener noreferrer">Discord ↗</a>` : ""}</div></li>`;
  }
  function scenes(id) {
    if (id) return scene(id);
    const used = unique(SCENES.map((s) => s.theme || "calme"));
    return head("Role-play", "Scènes RP", "Tous les fils de Framboisier, retranscrits pour pouvoir être lus ici. Le bouton Discord ouvre le fil d'origine.") +
      (SCENES.length ? `<div class="ens reveal"><div class="ens-row"><input type="search" id="sq" placeholder="Chercher un titre, un participant…" aria-label="Chercher une scène">
        <select id="sf-live" aria-label="Statut"><option value="">Toutes</option><option value="1">En cours</option><option value="0">Terminées</option></select>
        <select id="sf-theme" aria-label="Ambiance"><option value="">Toutes les ambiances</option>${used.map((t) => `<option value="${t}">${(THEMES[t] || THEMES.calme).ic} ${(THEMES[t] || THEMES.calme).l}</option>`).join("")}</select>
        <select id="sf-order" aria-label="Ordre"><option value="asc">Du plus ancien au plus récent</option><option value="desc">Du plus récent au plus ancien</option></select></div></div>
        <ul class="scene-list" id="scene-list">${SCENES.map(sceneCard).join("")}</ul><p class="empty" id="scene-none" hidden>Aucune scène ne correspond.</p>` : empty("Aucune scène pour le moment."));
  }
  function bindScenes() {
    const l = $("#scene-list"); if (!l) return;
    const f = () => { const q = O.norm($("#sq").value), lv = $("#sf-live").value, th = $("#sf-theme").value; let n = 0; $$(".scene-card", l).forEach((c) => { const ok = (!q || c.dataset.q.includes(q)) && (!lv || c.dataset.live === lv) && (!th || c.dataset.theme === th); c.hidden = !ok; if (ok) n++; }); $("#scene-none").hidden = n > 0; };
    $$(".ens input, .ens select").forEach((e) => e.addEventListener("input", f));
    $("#sf-order").addEventListener("input", (e) => { const c = [...l.children]; c.sort((a, b) => +a.dataset.i - +b.dataset.i); (e.target.value === "desc" ? [...c.filter((x) => x.dataset.u === "0").reverse(), ...c.filter((x) => x.dataset.u === "1")] : c).forEach((x) => l.append(x)); });
  }
  const FS = () => { try { return +localStorage.getItem("fr-fs") || 1.1; } catch (e) { return 1.1; } };
  function scene(id) {
    const i = SCENES.findIndex((s) => s._s === id), s = SCENES[i];
    if (!s) return head("Role-play", "Scène introuvable") + empty('<a href="#/scenes">Retour aux scènes</a>');
    const T = THEMES[s.theme] || THEMES.calme, th = THEMES[s.theme] ? s.theme : "calme", body = rich(s.texte, "reader story");
    return `<p class="back reveal"><a href="#/scenes">← Toutes les scènes</a></p>
      <article class="scene" data-theme="${th}">
        <header class="scene-head reveal"><p class="sc-theme">${T.ic} ${esc(T.l)}</p><h1>${esc(s.titre)}</h1>
          <p class="sc-meta">${s.lune !== "" && s.lune != null ? `Lune ${esc(s.lune)} · ` : ""}${sceneState(s)}</p>
          ${s.participants && s.participants.length ? `<div class="chips">${partChips(s)}</div>` : ""}
          <div class="scene-tools"><span class="fs" role="group" aria-label="Taille du texte"><button type="button" data-fs="-1" aria-label="Réduire le texte">A−</button><button type="button" data-fs="1" aria-label="Agrandir le texte">A+</button></span>${O.safeLink(s.lien) ? `<a class="btn small discord" href="${esc(s.lien)}" target="_blank" rel="noopener noreferrer">Ouvrir sur Discord ↗</a>` : ""}</div></header>
        ${s.description ? `<p class="scene-resume reveal">${esc(s.description)}</p>` : ""}
        <div class="scene-body" style="--fs:${FS()}rem">${body || '<p class="empty">Le récit de cette scène n\'est pas encore retranscrit.</p>'}</div>
        ${s.en_cours === "oui" ? '<p class="scene-note">La scène est toujours en cours : la suite arrivera au fil des posts.</p>' : '<p class="scene-end">✦ Fin de la scène ✦</p>'}
        ${pager(SCENES[i - 1] && ["#/scenes/" + SCENES[i - 1]._s, SCENES[i - 1].titre], SCENES[i + 1] && ["#/scenes/" + SCENES[i + 1]._s, SCENES[i + 1].titre])}
      </article>`;
  }

  /* ---------- galerie et pages libres ---------- */
  function galerie() {
    const g = (D.galerie || []).filter((x) => O.safeSrc(x.image));
    return head("Illustrations", "Galerie") + (g.length ? `<div class="gallery">${g.map((x, i) => `<figure class="shot reveal"><button data-lb="${i}" aria-label="Agrandir : ${esc(x.titre)}">${img(x.image, x.titre)}</button><figcaption><strong>${esc(x.titre)}</strong>${x.description ? `<span>${fmt(x.description)}</span>` : ""}</figcaption></figure>`).join("")}</div>` : empty("Aucune image pour le moment."));
  }
  const libreSlugs = () => uniqSlugs(D.libres || [], "titre", "page");
  function libre(id) {
    const s = libreSlugs(), i = s.indexOf(id), l = (D.libres || [])[i];
    if (!l) return head("Page", "Introuvable") + empty('<a href="#/">Retour à l\'accueil</a>');
    return head("À découvrir", l.titre) + `<div class="phys"><div class="reveal">${rich(l.paragraphes, "reader")}</div>${O.safeSrc(l.image) ? `<aside class="fiche reveal"><div class="fiche-img">${img(l.image, l.titre)}</div></aside>` : ""}</div>`;
  }

  /* ---------- routeur ---------- */
  function buildMenu() {
    const items = [["accueil", "#/", "Accueil"]];
    const lab = { personnage: "Personnage", histoire: "Histoire", relations: "Relations", scenes: "Scènes RP", galerie: "Galerie" };
    (D.reglages.sections || []).filter((s) => s.actif !== "non").forEach((s) => { if (s.id === "libres") (D.libres || []).forEach((l, i) => items.push(["page:" + libreSlugs()[i], "#/page/" + libreSlugs()[i], l.titre])); else if (lab[s.id]) items.push([s.id, "#/" + s.id, lab[s.id]]); });
    $("#menu").innerHTML = items.map(([id, h, l]) => `<a href="${h}" data-id="${id}">${esc(l)}</a>`).join("");
  }
  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean).map((p) => { try { return decodeURIComponent(p); } catch (e) { return p; } });
    const [p, s, t] = parts; let html, nav = p || "accueil", theme = "", title = "";
    if (!p) html = home();
    else if (p === "personnage" && enabled(p)) { html = personnage(s); title = "Personnage"; }
    else if (p === "histoire" && enabled(p)) { html = histoire(s); title = "Histoire"; }
    else if (p === "relations" && enabled(p)) { html = relations(s, t); title = "Relations"; }
    else if (p === "scenes" && enabled(p)) { html = scenes(s); title = "Scènes RP"; const sc = SCENES.find((x) => x._s === s); if (sc) { theme = THEMES[sc.theme] ? sc.theme : "calme"; title = sc.titre; } }
    else if (p === "galerie" && enabled(p)) { html = galerie(); title = "Galerie"; }
    else if (p === "page") { html = libre(s); nav = "page:" + s; title = ((D.libres || [])[libreSlugs().indexOf(s)] || {}).titre || ""; }
    else { html = home(); nav = "accueil"; }
    const app = $("#app"); app.innerHTML = html; app.className = "page-in";
    document.body.dataset.scene = theme; document.body.classList.toggle("in-scene", !!theme);
    document.title = (title ? title + " — " : "") + (D.reglages.titre_page || "Étoile de Framboisier");
    $$("#menu a").forEach((a) => { const on = a.dataset.id === nav; a.classList.toggle("on", on); if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    document.body.classList.remove("menu-open"); $("#burger").setAttribute("aria-expanded", "false");
    scrollTo(0, 0); bind(); bindEnsemble(); bindScenes();
  }
  function render() {
    const R = D.reglages, root = document.documentElement.style;
    [["creme", "--cream"], ["abricot", "--apricot"], ["brun", "--ink"], ["turquoise", "--aqua"], ["mauve", "--mauve"]].forEach(([k, v]) => { const c = R["couleur_" + k]; if (/^#[0-9a-f]{3,8}$/i.test(c || "")) root.setProperty(v + "-set", c); else root.removeProperty(v + "-set"); });
    $("#credits").textContent = D.identite.credits || ""; $("#foot-text").textContent = R.texte_pied || "Personnage créé par";
    derive(); buildMenu(); route(); particles();
  }

  function bind() {
    if (io) io.disconnect();
    io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    $$(".reveal").forEach((el) => { io.observe(el); if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in"); });
    $$("[data-tab]").forEach((b) => b.addEventListener("click", () => { $$("[data-tab]").forEach((x) => x.setAttribute("aria-selected", x === b)); $$(".panel").forEach((p) => (p.hidden = p.id !== "pan-" + b.dataset.tab)); }));
    $$("[data-lb]").forEach((b) => b.addEventListener("click", () => lb(+b.dataset.lb)));
    $$("[data-fs]").forEach((b) => b.addEventListener("click", () => { const v = Math.min(1.7, Math.max(0.9, FS() + 0.1 * +b.dataset.fs)); try { localStorage.setItem("fr-fs", v); } catch (e) {} $(".scene-body").style.setProperty("--fs", v + "rem"); }));
    const art = $("#art");
    if (art && matchMedia("(hover:hover) and (prefers-reduced-motion:no-preference)").matches) {
      art.addEventListener("pointermove", (e) => { const r = art.getBoundingClientRect(); art.style.setProperty("--rx", ((e.clientY - r.top) / r.height - 0.5) * -6 + "deg"); art.style.setProperty("--ry", ((e.clientX - r.left) / r.width - 0.5) * 8 + "deg"); });
      art.addEventListener("pointerleave", () => { art.style.setProperty("--rx", "0deg"); art.style.setProperty("--ry", "0deg"); });
    }
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
  const themeBtn = $("#theme");
  const paintTheme = () => { themeBtn.textContent = document.documentElement.dataset.theme === "nuit" ? "☀" : "☾"; };
  themeBtn.onclick = () => { const n = document.documentElement.dataset.theme === "nuit" ? "jour" : "nuit"; document.documentElement.dataset.theme = n; try { localStorage.setItem("fr-theme", n); } catch (e) {} paintTheme(); particles(); };
  paintTheme();
  const up = $("#up"), bar = $("#progress"), nav = $("#nav");
  let tick = false;
  addEventListener("scroll", () => { if (tick) return; tick = true; requestAnimationFrame(() => { const h = document.documentElement, y = h.scrollTop, m = h.scrollHeight - h.clientHeight; bar.style.transform = `scaleX(${m > 0 ? y / m : 0})`; up.classList.toggle("show", y > 700); nav.classList.toggle("solid", y > 24); tick = false; }); }, { passive: true });
  up.onclick = () => scrollTo({ top: 0, behavior: "smooth" });
  addEventListener("hashchange", route);

  /* ---------- pétales / étoiles qui dérivent ---------- */
  let raf = 0, resizeBound = false, PW = 0, PH = 0;
  function particles() {
    cancelAnimationFrame(raf);
    const cv = $("#fx"), ctx = cv.getContext("2d"), night = document.documentElement.dataset.theme === "nuit";
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    if (D.reglages.particules === "non" || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const size = () => { PW = innerWidth; PH = innerHeight; cv.width = PW * dpr; cv.height = PH * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size(); if (!resizeBound) { resizeBound = true; addEventListener("resize", size); }
    const N = PW < 700 ? 14 : 26, cols = night ? ["#ffe9a8", "#bfe9f5", "#d9b8e6"] : ["#9a62a8", "#f2a65a", "#3ec3df", "#f7c98e"];
    const P = Array.from({ length: N }, () => ({ x: Math.random() * PW, y: Math.random() * PH, r: 2 + Math.random() * 4, vy: 0.12 + Math.random() * 0.3, vx: (Math.random() - 0.5) * 0.25, a: Math.random() * 6.28, s: 0.005 + Math.random() * 0.012, c: cols[(Math.random() * cols.length) | 0], o: 0.25 + Math.random() * 0.4 }));
    const draw = () => {
      ctx.clearRect(0, 0, PW, PH);
      for (const p of P) {
        p.y += night ? -p.vy * 0.5 : p.vy; p.x += p.vx + Math.sin(p.a) * 0.3; p.a += p.s;
        if (p.y > PH + 10) p.y = -10; if (p.y < -10) p.y = PH + 10; if (p.x > PW + 10) p.x = -10; if (p.x < -10) p.x = PW + 10;
        ctx.globalAlpha = p.o * (night ? 0.5 + Math.sin(p.a * 3) * 0.5 : 1); ctx.fillStyle = p.c;
        ctx.beginPath(); if (night) ctx.arc(p.x, p.y, p.r * 0.45, 0, 6.28); else ctx.ellipse(p.x, p.y, p.r, p.r * 0.55, p.a, 0, 6.28); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    document.onvisibilitychange = () => { cancelAnimationFrame(raf); if (!document.hidden) draw(); };
  }

  /* ---------- démarrage ---------- */
  const c0 = cached();
  if (c0) D = O.load(c0);
  render();
  remote().then((r) => {
    if (!r) return;
    const next = O.load(r);
    try { localStorage.setItem(CACHE, JSON.stringify(r)); } catch (e) {}
    if (JSON.stringify(next) !== JSON.stringify(D)) { D = next; const y = scrollY; render(); scrollTo(0, y); }
  });
})();
