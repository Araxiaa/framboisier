(function () {
  const C = window.SITE_CONFIG, O = window.Outils, esc = O.esc;
  const sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_KEY);
  const $ = (id) => document.getElementById(id);
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const DRAFT = "fr-draft";
  let state, saved, current = "vue", dirty = false, draftTimer, user;
  const open = new Set(); // éléments dépliés (pour ne pas tout refermer à chaque ajout)

  /* ---------- définition des champs ---------- */
  const F = {
    text: (k, label, o) => ({ t: "text", k, label, ...o }),
    num: (k, label, o) => ({ t: "num", k, label, ...o }),
    area: (k, label, o) => ({ t: "area", k, label, ...o }),
    sel: (k, label, opts, o) => ({ t: "sel", k, label, opts, ...o }),
    yes: (k, label, o) => ({ t: "yes", k, label, ...o }),
    img: (k, label, o) => ({ t: "img", k, label, ...o }),
    color: (k, label, o) => ({ t: "color", k, label, ...o }),
    paras: (k, label, o) => ({ t: "paras", k, label, ...o }),
    strs: (k, label, o) => ({ t: "paras", short: true, k, label, ...o }),
    group: (k, title, fields, o) => ({ t: "group", k, title, fields, ...o }),
    row: (fields) => ({ t: "group", k: "", title: "", fields, cols: true }),
    items: (k, label, fields, o) => ({ t: "items", k, label, fields, ...o }),
  };
  const traits = (k, label, o) => F.items(k, label, [F.text("titre", "Titre"), F.area("texte", "Texte", { rows: 6 })], { sum: (it) => ({ title: it.titre || "(sans titre)", sub: (it.texte || "").slice(0, 90) }), addLabel: "+ Ajouter", ...o });
  const STATUT = [["vivant", "Vivant"], ["mort", "Décédé (aux étoiles)"]];
  const groupes = () => [...new Set([...(state.famille || []).map((m) => m.groupe).filter(Boolean)])];

  const SECTIONS = [
    { g: "Général", list: [
      { id: "vue", ic: "🏠", label: "Vue d'ensemble", help: "Bienvenue ! Ici, tu contrôles tout le site d'Étoile de Framboisier. Rien n'est publié tant que tu n'as pas cliqué sur « Enregistrer »." },
      { id: "identite", ic: "🪪", label: "Identité & accueil", help: "Les informations de base, les chiffres de la fiche et les images de l'accueil.", defs: [F.group("identite", "", [
        F.group("", "Nom & accroche", [F.text("nom", "Nom"), F.text("sous_titre", "Sous-titre"), F.area("accroche", "Phrase d'accroche", { rows: 3 }), F.text("citation", "Citation d'accueil")], { bare: true }),
        F.group("", "Images", [F.img("image", "Portrait (accueil, en rond)", { hint: "idéalement carré, fond blanc" }), F.img("image2", "Illustration en pied (fiche physique)")], { bare: true, cols: true }),
        F.group("", "Fiche", [F.num("lunes", "Âge (lunes)"), F.num("lunes_meneur", "Âge à la nomination"), F.text("clan", "Clan"), F.text("rang", "Rang"), F.text("sexe", "Sexe"), F.text("orientation", "Orientation"), F.text("pelage", "Pelage"), F.text("yeux", "Yeux"), F.text("taille", "Taille"), F.text("poids", "Poids")], { bare: true, cols: true }),
        F.group("", "Statistiques", [F.num("pv", "PV"), F.num("pa", "PA"), F.num("vies", "Vies restantes"), F.num("vies_max", "Vies au total"), F.num("origine_tonnerre", "Origine : % Clan du Tonnerre"), F.num("origine_domestique", "Origine : % Domestique")], { bare: true, cols: true }),
        F.group("", "Joueur", [F.text("pseudo_joueur", "Pseudo du joueur"), F.text("credits", "Crédits (pied de page)")], { bare: true, cols: true }),
      ], { bare: true })] },
      { id: "reglages", ic: "⚙️", label: "Réglages du site", help: "L'ordre et la visibilité des sections, les couleurs et quelques textes. Les couleurs s'appliquent au thème « jour ».", defs: [
        F.items("reglages.sections", "Sections du site (ordre d'affichage)", [F.text("nom", "Nom"), F.yes("actif", "Afficher cette section")], { fixed: true, sum: (it) => ({ title: it.nom, sub: it.actif === "non" ? "masquée" : "affichée" }), help: "Utilise ↑ ↓ pour réordonner, la case pour masquer." }),
        F.group("reglages", "Apparence", [F.yes("particules", "Pétales et étoiles qui flottent en fond"), F.row([F.color("couleur_creme", "Fond crème"), F.color("couleur_abricot", "Abricot"), F.color("couleur_brun", "Brun (titres, trait)"), F.color("couleur_turquoise", "Turquoise"), F.color("couleur_mauve", "Mauve (freesias)")])], { bare: false }),
        F.group("reglages", "Textes", [F.text("titre_page", "Titre de l'onglet du navigateur"), F.text("texte_pied", "Pied de page : « Personnage créé par… »")], { bare: false }),
      ] },
    ] },
    { g: "Personnage", list: [
      { id: "noms", ic: "🏷️", label: "Noms", help: "Un nom par étape. « Ancien nom » le barre sur le site.", defs: [F.items("noms", "Noms", [F.row([F.text("etape", "Étape"), F.text("nom", "Nom")]), F.yes("ancien", "Ancien nom (affiché barré)"), F.area("texte", "Explication", { rows: 4 })], { sum: (it) => ({ title: it.nom || "—", sub: it.etape }), addLabel: "+ Ajouter une étape" })] },
      { id: "caractere", ic: "💭", label: "Caractère", help: "Portrait général, puis qualités et défauts (cartes dépliantes).", defs: [F.paras("caractere.intro", "Description générale (un bloc = un paragraphe)"), F.area("caractere.conclusion", "Phrase de conclusion", { rows: 2 }), traits("caractere.qualites", "Qualités"), traits("caractere.defauts", "Défauts")] },
      { id: "gouts", ic: "🍃", label: "Goûts & peurs", help: "Ce qu'il aime, déteste, craint, ses habitudes. Une catégorie vide disparaît du site.", defs: [traits("gouts.aime", "Ce qu'il aime"), traits("gouts.deteste", "Ce qu'il déteste"), traits("gouts.peurs", "Peurs & phobies"), traits("gouts.habitudes", "Habitudes & tics")] },
      { id: "physique", ic: "🐾", label: "Physique", help: "Description, points forts/faibles, accessoires, cicatrices. Les parties vides ne s'affichent pas.", defs: [F.paras("physique.description", "Description (un bloc = un paragraphe)"), F.strs("physique.signes", "Signes distinctifs (petites étiquettes)"), traits("physique.forts", "Points forts"), traits("physique.faibles", "Points faibles"), F.area("physique.accessoires", "Accessoires", { rows: 4 }), F.area("physique.cicatrices", "Cicatrices", { rows: 5 }), F.area("physique.handicap", "Handicap", { rows: 3 })] },
      { id: "histoire", ic: "📜", label: "Histoire", help: "Un chapitre = une carte sur la frise. Chaque paragraphe est un bloc.", defs: [F.items("histoire", "Chapitres", [F.row([F.text("titre", "Titre"), F.text("periode", "Période (étiquette)")]), F.paras("paragraphes", "Texte (un bloc = un paragraphe)")], { sum: (it) => ({ title: it.titre || "(chapitre)", sub: it.periode }), addLabel: "+ Ajouter un chapitre" })] },
      { id: "convictions", ic: "⭐", label: "Convictions", help: "Son rapport au clan, aux autres clans et au Clan des Étoiles.", defs: [F.paras("convictions.clan", "Relation au clan"), F.items("convictions.autres_clans", "Avis sur les autres clans", [F.text("nom", "Clan"), F.area("texte", "Avis", { rows: 5 })], { sum: (it) => ({ title: it.nom || "—", sub: (it.texte || "").slice(0, 80) }), addLabel: "+ Ajouter un clan" }), F.paras("convictions.etoiles", "Croyance (Clan des Étoiles)")] },
    ] },
    { g: "Entourage", list: [
      { id: "famille", ic: "🏡", label: "Famille", help: "Chaque membre peut avoir une photo. Le « groupe » crée les rubriques (Famille maternelle, Adelphité…).", defs: [F.items("famille", "Membres", [
        F.row([F.text("nom", "Nom"), F.text("lien", "Lien (Mère, frère…)")]),
        F.row([F.text("groupe", "Groupe / rubrique", { list: groupes }), F.sel("statut", "Statut", STATUT), F.sel("joueur", "Joué par", [["PNJ", "PNJ"], ["PJ", "PJ"], ["", "—"]])]),
        F.area("note", "Note (optionnel)", { rows: 2 }), F.img("image", "Photo"),
      ], { sum: (it) => ({ title: it.nom || "(sans nom)", sub: [it.lien, it.groupe].filter(Boolean).join(" · "), thumb: it.image, badges: it.statut === "mort" ? ["✦"] : [] }), addLabel: "+ Ajouter un membre", search: true, blank: () => ({ nom: "", lien: "", groupe: "", statut: "vivant", joueur: "PNJ", note: "", image: "" }) }),
      F.items("mentorat", "Mentorat", [F.row([F.text("nom", "Nom"), F.text("role", "Rôle")]), F.area("texte", "Texte", { rows: 4 })], { sum: (it) => ({ title: it.nom || "—", sub: it.role }), addLabel: "+ Ajouter" })] },
    ] },
    { g: "Médias & extras", list: [
      { id: "galerie", ic: "🖼️", label: "Galerie", help: "Les illustrations de la galerie (cliquables en grand sur le site).", defs: [F.items("galerie", "Images", [F.text("titre", "Titre"), F.img("image", "Image"), F.area("description", "Légende", { rows: 2 })], { sum: (it) => ({ title: it.titre || "(sans titre)", sub: it.description, thumb: it.image }), addLabel: "+ Ajouter une image" })] },
      { id: "libres", ic: "✨", label: "Sections libres", help: "Crée tes propres sections (ex. « Ses rêves », « Anecdotes »). Elles apparaissent dans le menu, avant la galerie.", defs: [F.items("libres", "Sections", [F.text("titre", "Titre"), F.paras("paragraphes", "Texte"), F.img("image", "Image (optionnelle)")], { sum: (it) => ({ title: it.titre || "(section)", sub: ((it.paragraphes || [])[0] || "").slice(0, 80), thumb: it.image }), addLabel: "+ Ajouter une section" })] },
    ] },
  ];
  const ALL = SECTIONS.flatMap((s) => s.list);

  /* ---------- état, brouillon, enregistrement ---------- */
  const setStatus = (kind, text) => { const s = $("status"); s.className = "status " + kind; s.textContent = text; };
  function touch() {
    dirty = JSON.stringify(state) !== JSON.stringify(saved);
    $("btn-save").disabled = !dirty; $("btn-undo").disabled = !dirty;
    setStatus(dirty ? "dirty" : "clean", dirty ? "● Modifications non enregistrées" : "✓ Tout est enregistré");
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => { try { dirty ? localStorage.setItem(DRAFT, JSON.stringify(state)) : localStorage.removeItem(DRAFT); } catch (e) {} }, 400);
  }
  function toast(msg, bad) { const t = $("toast"); t.textContent = msg; t.className = "toast show" + (bad ? " bad" : ""); clearTimeout(toast.t); toast.t = setTimeout(() => (t.className = "toast"), 3200); }
  async function load() {
    let remote = null;
    try { const { data, error } = await sb.from(C.TABLE).select("data").eq("id", C.CONTENT_ID).maybeSingle(); if (error) throw error; remote = data && data.data; } catch (e) { banner("La base n'est pas joignable (" + (e.message || e) + "). Tu travailles sur le contenu par défaut : exécute supabase/setup.sql dans Supabase si ce n'est pas encore fait.", true); }
    saved = O.merge(window.DEFAULT_CONTENT, remote || {}); state = clone(saved);
    try { const d = JSON.parse(localStorage.getItem(DRAFT)); if (d && JSON.stringify(d) !== JSON.stringify(saved)) banner('Un brouillon non enregistré a été retrouvé. <button class="link" id="b-restore">Le restaurer</button> · <button class="link" id="b-drop">L\'ignorer</button>'); } catch (e) {}
    touch();
  }
  function banner(html, bad) { const b = $("banner"); b.hidden = false; b.className = "banner" + (bad ? " bad" : ""); b.innerHTML = html + ' <button class="link" id="b-close" aria-label="Fermer">✕</button>'; b.onclick = (e) => { const id = e.target.id; if (id === "b-close") b.hidden = true; if (id === "b-restore") { state = O.merge(window.DEFAULT_CONTENT, JSON.parse(localStorage.getItem(DRAFT))); b.hidden = true; touch(); show(current); } if (id === "b-drop") { try { localStorage.removeItem(DRAFT); } catch (x) {} b.hidden = true; } }; }
  async function save() {
    if (!dirty) return;
    setStatus("busy", "Enregistrement…"); $("btn-save").disabled = true;
    const { error } = await sb.from(C.TABLE).upsert({ id: C.CONTENT_ID, data: state, updated_at: new Date().toISOString() });
    if (error) { setStatus("dirty", "● Échec de l'enregistrement"); $("btn-save").disabled = false; toast("Échec : " + error.message, true); if (/does not exist|relation|schema cache/i.test(error.message)) banner("La table n'existe pas encore : exécute <code>supabase/setup.sql</code> dans Supabase (SQL Editor).", true); return; }
    saved = clone(state); touch(); toast("Enregistré ✓ — le site est à jour");
  }

  /* ---------- images (réduites en WebP puis envoyées dans Supabase Storage) ---------- */
  function shrink(file, max = 1600) {
    return new Promise((res, rej) => {
      const url = URL.createObjectURL(file), im = new Image();
      im.onload = () => { const k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement("canvas"); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url); c.toBlob((b) => (b ? res(b) : rej(new Error("conversion impossible"))), "image/webp", 0.86); };
      im.onerror = () => rej(new Error("image illisible")); im.src = url;
    });
  }
  async function upload(file) {
    const blob = file.type === "image/gif" || file.type === "image/svg+xml" ? file : await shrink(file);
    const ext = blob.type === "image/webp" ? "webp" : (file.name.split(".").pop() || "png").toLowerCase();
    const path = `${Date.now().toString(36)}-${O.slug(file.name.replace(/\.[^.]+$/, "")) || "image"}.${ext}`;
    const { error } = await sb.storage.from(C.BUCKET).upload(path, blob, { contentType: blob.type, cacheControl: "31536000" });
    if (error) throw error;
    return sb.storage.from(C.BUCKET).getPublicUrl(path).data.publicUrl;
  }

  /* ---------- rendu des champs ---------- */
  let uid = 0;
  function field(f, obj, host, ctx) {
    if (f.t === "group") {
      const target = f.k ? (O.get(obj, f.k) ?? (O.set(obj, f.k, {}), O.get(obj, f.k))) : obj;
      const box = el("div", "grp" + (f.cols ? " cols" : "") + (f.bare ? " bare" : ""));
      if (f.title) box.append(el("h3", "", esc(f.title)));
      f.fields.forEach((x) => field(x, target, box, ctx));
      return host.append(box);
    }
    if (f.t === "items") return host.append(itemsField(f, obj, ctx));
    const id = "f" + ++uid, wrap = el("div", "fld"), lab = el("label", "", esc(f.label || "")); lab.htmlFor = id; wrap.append(lab);
    const get = () => O.get(obj, f.k), put = (v) => { O.set(obj, f.k, v); touch(); ctx && ctx.onInput && ctx.onInput(); };
    let inp;
    if (f.t === "text" || f.t === "num") {
      inp = el("input"); inp.type = "text"; if (f.t === "num") inp.inputMode = "numeric"; inp.value = get() ?? "";
      if (f.list) { const dl = el("datalist"); dl.id = id + "l"; f.list().forEach((v) => dl.append(new Option(v))); inp.setAttribute("list", dl.id); wrap.append(dl); }
      inp.oninput = () => put(f.t === "num" ? (inp.value.trim() === "" ? "" : isNaN(Number(inp.value)) ? inp.value : Number(inp.value)) : inp.value);
    } else if (f.t === "area") {
      inp = el("textarea"); inp.rows = f.rows || 4; inp.value = get() ?? ""; inp.oninput = () => put(inp.value);
    } else if (f.t === "sel") {
      inp = el("select"); f.opts.forEach(([v, l]) => inp.append(new Option(l, v))); inp.value = get() ?? f.opts[0][0]; inp.onchange = () => put(inp.value);
    } else if (f.t === "yes") {
      wrap.className = "fld check"; inp = el("input"); inp.type = "checkbox"; inp.id = id; inp.checked = get() !== "non"; inp.onchange = () => put(inp.checked ? "oui" : "non"); wrap.prepend(inp); inp = null;
    } else if (f.t === "color") {
      inp = el("input"); inp.type = "color"; inp.value = /^#[0-9a-f]{6}$/i.test(get()) ? get() : "#ffffff";
      const rst = el("button", "mini", "Réinitialiser"); rst.type = "button"; rst.onclick = () => { const d = O.get(window.DEFAULT_CONTENT, ctx.rootPath + "." + f.k); inp.value = d; put(d); };
      inp.oninput = () => put(inp.value); wrap.append(inp, rst);
      if (!ctx.rootPath) rst.remove(); inp = null;
    } else if (f.t === "img") {
      const row = el("div", "imgrow"), prev = el("div", "thumb"), url = el("input"); url.type = "text"; url.id = id; url.placeholder = "https://… ou assets/…"; url.value = get() ?? "";
      const paint = () => { const s = O.safeSrc(url.value); prev.innerHTML = s ? `<img src="${esc(s)}" alt="">` : "🖼"; };
      url.oninput = () => { put(url.value); paint(); };
      const file = el("input"); file.type = "file"; file.accept = "image/*"; file.hidden = true;
      const btn = el("button", "btn small", "Envoyer une image"); btn.type = "button"; btn.onclick = () => file.click();
      file.onchange = async () => { if (!file.files[0]) return; btn.disabled = true; btn.textContent = "Envoi…"; try { url.value = await upload(file.files[0]); put(url.value); paint(); toast("Image envoyée ✓ (pense à enregistrer)"); } catch (e) { toast("Envoi impossible : " + (e.message || e), true); } btn.disabled = false; btn.textContent = "Envoyer une image"; file.value = ""; };
      const clr = el("button", "mini", "Retirer"); clr.type = "button"; clr.onclick = () => { url.value = ""; put(""); paint(); };
      row.append(prev, url, btn, clr, file); wrap.append(row); paint(); inp = null;
    } else if (f.t === "paras") {
      const list = el("div", "paras");
      const draw = () => {
        list.innerHTML = ""; const arr = get() || (O.set(obj, f.k, []), get());
        arr.forEach((t, i) => {
          const r = el("div", "para"), ta = el(f.short ? "input" : "textarea"); if (!f.short) ta.rows = Math.max(3, Math.min(10, Math.ceil(String(t).length / 90))); ta.value = t; ta.oninput = () => { arr[i] = ta.value; touch(); };
          const bt = el("div", "pbtn"); [["↑", () => i > 0 && ([arr[i - 1], arr[i]] = [arr[i], arr[i - 1]], 1)], ["↓", () => i < arr.length - 1 && ([arr[i + 1], arr[i]] = [arr[i], arr[i + 1]], 1)], ["✕", () => (arr.splice(i, 1), 1)]].forEach(([s, fn]) => { const b = el("button", "mini", s); b.type = "button"; b.onclick = () => { if (fn()) { touch(); draw(); } }; bt.append(b); });
          r.append(ta, bt); list.append(r);
        });
        const add = el("button", "btn small", f.short ? "+ Ajouter" : "+ Ajouter un paragraphe"); add.type = "button"; add.onclick = () => { arr.push(""); touch(); draw(); list.querySelector(".para:last-of-type :is(input,textarea)").focus(); }; list.append(add);
      };
      draw(); wrap.append(list); inp = null;
    }
    if (inp) { inp.id = id; wrap.append(inp); }
    if (f.hint) wrap.append(el("small", "hint", esc(f.hint)));
    host.append(wrap);
  }

  function itemsField(f, obj, ctx) {
    const arr = O.get(obj, f.k) || (O.set(obj, f.k, []), O.get(obj, f.k)), box = el("div", "items"), key = (ctx.path || "") + f.k;
    const blank = () => (f.blank ? f.blank() : (function mk(fs) { const o = {}; fs.forEach((x) => { if (x.t === "group") Object.assign(o, mk(x.fields)); else if (x.k) o[x.k] = x.t === "paras" ? [] : x.t === "yes" ? "oui" : ""; }); return o; })(f.fields));
    const redraw = () => { const y = scrollY; const n = itemsField(f, obj, ctx); box.replaceWith(n); scrollTo(0, y); };
    box.append(el("div", "items-head", `<h3>${esc(f.label)} <span class="count">${arr.length}</span></h3>${f.help ? `<p class="hint">${esc(f.help)}</p>` : ""}`));
    if (f.search && arr.length > 6) { const s = el("input"); s.type = "search"; s.placeholder = "Filtrer…"; s.className = "filter"; s.oninput = () => box.querySelectorAll(":scope > details.item").forEach((d) => (d.hidden = !O.norm(d.dataset.t).includes(O.norm(s.value)))); box.append(s); }
    arr.forEach((it, i) => {
      const d = el("details", "item"), k = key + "." + i, s = () => f.sum(it);
      d.open = open.has(k); d.ontoggle = () => (d.open ? open.add(k) : open.delete(k));
      const sm = el("summary"), paint = () => { const v = s(); d.dataset.t = v.title + " " + (v.sub || ""); sm.innerHTML = `${v.thumb && O.safeSrc(v.thumb) ? `<img class="mini-thumb" src="${esc(O.safeSrc(v.thumb))}" alt="">` : `<span class="num">${i + 1}</span>`}<span class="t"><b>${esc(v.title)}</b>${v.sub ? `<small>${esc(v.sub)}</small>` : ""}</span>${(v.badges || []).map((b) => `<span class="tag">${esc(b)}</span>`).join("")}`; };
      paint(); d.append(sm);
      const body = el("div", "item-body");
      f.fields.forEach((x) => field(x, it, body, { ...ctx, path: k + ".", onInput: () => { paint(); } }));
      const bar = el("div", "item-bar");
      const mv = (lbl, ttl, fn) => { const b = el("button", "mini", lbl); b.type = "button"; b.title = ttl; b.onclick = (e) => { e.preventDefault(); fn(); touch(); redraw(); }; bar.append(b); };
      mv("↑ Monter", "Monter", () => i > 0 && ([arr[i - 1], arr[i]] = [arr[i], arr[i - 1]], open.clear()));
      mv("↓ Descendre", "Descendre", () => i < arr.length - 1 && ([arr[i + 1], arr[i]] = [arr[i], arr[i + 1]], open.clear()));
      if (!f.fixed) {
        mv("⧉ Dupliquer", "Dupliquer", () => (arr.splice(i + 1, 0, clone(it)), open.clear()));
        const del = el("button", "mini danger", "✕ Supprimer"); del.type = "button"; del.onclick = (e) => { e.preventDefault(); if (confirm("Supprimer « " + (s().title) + " » ?")) { arr.splice(i, 1); open.clear(); touch(); redraw(); } }; bar.append(del);
      }
      body.append(bar); d.append(body); box.append(d);
    });
    if (!f.fixed) { const add = el("button", "btn", esc(f.addLabel || "+ Ajouter")); add.type = "button"; add.onclick = () => { arr.push(blank()); open.add(key + "." + (arr.length - 1)); touch(); redraw(); }; box.append(add); }
    return box;
  }

  /* ---------- vue d'ensemble ---------- */
  function overview(host) {
    const n = (k) => (O.get(state, k) || []).length, I = state.identite;
    const stats = [["Chapitres", n("histoire")], ["Famille", n("famille")], ["Traits", n("caractere.qualites") + n("caractere.defauts")], ["Images", n("galerie")], ["Sections libres", n("libres")]];
    host.innerHTML = `<div class="ov"><div class="ov-hero">${O.safeSrc(I.image) ? `<img src="${esc(O.safeSrc(I.image))}" alt="">` : ""}<div><h2>${esc(I.nom)}</h2><p>${esc(I.sous_titre)} · ${esc(I.lunes)} lunes · ${esc(I.vies)}/${esc(I.vies_max)} vies</p><a class="btn primary" href="index.html" target="_blank" rel="noopener">Voir le site ↗</a></div></div>
      <div class="ov-stats">${stats.map(([l, v]) => `<div><strong>${v}</strong><span>${l}</span></div>`).join("")}</div>
      <div class="ov-tips"><h3>Comment ça marche</h3><ul><li>Choisis une rubrique à gauche, modifie, puis <b>Enregistrer</b> (ou <kbd>Ctrl</kbd>+<kbd>S</kbd>) : le site se met à jour tout de suite.</li><li>Un brouillon est gardé automatiquement dans ce navigateur si tu fermes l'onglet sans enregistrer.</li><li><b>⋯ → Exporter</b> télécharge une sauvegarde complète ; <b>Importer</b> la restaure.</li><li>« Réglages du site » permet de réordonner ou masquer les sections et de changer les couleurs.</li></ul></div></div>`;
  }

  function show(id) {
    current = id; const s = ALL.find((x) => x.id === id) || ALL[0];
    document.querySelectorAll("#side a").forEach((a) => a.classList.toggle("on", a.dataset.id === s.id));
    $("sec-title").textContent = s.label; $("sec-help").textContent = s.help || "";
    const ed = $("editor"); ed.innerHTML = ""; uid = 0;
    if (s.id === "vue") overview(ed); else s.defs.forEach((f) => field(f, state, ed, { rootPath: "reglages" }));
    history.replaceState(null, "", "#" + s.id); scrollTo(0, 0); document.body.classList.remove("side-open");
  }
  function buildSide() {
    $("side").innerHTML = SECTIONS.map((g) => `<p class="side-g">${esc(g.g)}</p>` + g.list.map((s) => `<a href="#${s.id}" data-id="${s.id}"><span>${s.ic}</span>${esc(s.label)}</a>`).join("")).join("");
    $("side").onclick = (e) => { const a = e.target.closest("a"); if (a) { e.preventDefault(); show(a.dataset.id); } };
  }

  /* ---------- connexion ---------- */
  const isAdmin = (u) => (u.identities || []).some((i) => i.provider === "discord" && String((i.identity_data || {}).provider_id || i.id) === C.ADMIN_DISCORD_ID) || String((u.user_metadata || {}).provider_id || "") === C.ADMIN_DISCORD_ID;
  async function boot() {
    const { data } = await sb.auth.getSession(), session = data.session;
    if (!session) { $("login").hidden = false; return; }
    if (!isAdmin(session.user)) { $("login").hidden = false; $("login-msg").textContent = "Ce compte Discord n'a pas accès au dashboard."; $("btn-login").textContent = "Changer de compte"; await sb.auth.signOut(); return; }
    user = session.user; $("login").hidden = true; $("dash").hidden = false;
    $("who").textContent = (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) || "Administrateur";
    await load(); buildSide(); show(ALL.some((s) => s.id === location.hash.slice(1)) ? location.hash.slice(1) : "vue");
  }
  $("btn-login").onclick = async () => { $("login-msg").textContent = "Redirection vers Discord…"; const { error } = await sb.auth.signInWithOAuth({ provider: "discord", options: { redirectTo: location.origin + location.pathname } }); if (error) $("login-msg").textContent = error.message; };
  $("btn-save").onclick = save;
  $("btn-undo").onclick = () => { if (confirm("Abandonner les modifications non enregistrées ?")) { state = clone(saved); touch(); show(current); } };
  $("btn-logout").onclick = async () => { await sb.auth.signOut(); location.reload(); };
  $("btn-export").onclick = () => { const a = el("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" })); a.download = "framboisier-" + new Date().toISOString().slice(0, 10) + ".json"; a.click(); };
  $("file-import").onchange = async (e) => { try { const j = JSON.parse(await e.target.files[0].text()); state = O.merge(window.DEFAULT_CONTENT, j); touch(); show(current); toast("Sauvegarde importée : clique sur Enregistrer pour la publier"); } catch (x) { toast("Fichier invalide", true); } e.target.value = ""; };
  $("btn-reset").onclick = () => { if (confirm("Revenir au contenu par défaut (non enregistré tant que tu ne cliques pas sur Enregistrer) ?")) { state = clone(window.DEFAULT_CONTENT); touch(); show(current); } };
  $("btn-menu").onclick = () => document.body.classList.toggle("side-open");
  addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); save(); } });
  addEventListener("beforeunload", (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } });
  boot();
})();
