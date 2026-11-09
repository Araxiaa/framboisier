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
    rich: (k, label, o) => ({ t: "rich", k, label, ...o }),
    sel: (k, label, opts, o) => ({ t: "sel", k, label, opts, ...o }),
    yes: (k, label, o) => ({ t: "yes", k, label, ...o }),
    img: (k, label, o) => ({ t: "img", k, label, ...o }),
    color: (k, label, o) => ({ t: "color", k, label, ...o }),
    tags: (k, label, o) => ({ t: "tags", k, label, ...o }),
    strs: (k, label, o) => ({ t: "strs", k, label, ...o }),
    group: (k, title, fields, o) => ({ t: "group", k, title, fields, ...o }),
    row: (fields) => ({ t: "group", k: "", title: "", fields, cols: true }),
    items: (k, label, fields, o) => ({ t: "items", k, label, fields, ...o }),
  };
  const R = (k, label, o) => F.rich(k, label, o);
  const traits = (k, label, o) => F.items(k, label, [F.text("titre", "Titre"), R("texte", "Texte")], { sum: (it) => ({ title: it.titre || "(sans titre)", sub: O.plain(it.texte).slice(0, 90) }), addLabel: "+ Ajouter", ...o });
  const THEMES = [["calme", "🌿 Scène calme"], ["ceremonie", "✨ Cérémonie · baptême · discours"], ["tension", "⚔️ Bataille · tension"], ["activite", "🌲 Chasse · patrouille · entraînement"], ["etoiles", "🌙 Songe · Clan des Étoiles"], ["deuil", "🌧️ Deuil · tristesse"]];
  const APPS = [["", "— (aucune : juste un événement)"], ...Object.entries(O.APP).map(([k, v]) => [k, v.glyph + "  " + v.label])];
  const clans = () => [...new Set([...(state.famille || []), ...(state.relations || [])].map((m) => m.groupe).filter(Boolean))];
  const names = () => [...(state.famille || []), ...(state.relations || [])].map((m) => m.nom).filter(Boolean);
  const lunesNow = () => state.identite.lunes;

  const sumAvis = (it) => { const a = O.APP[it.appreciation]; return { title: "Lune " + (it.lune === "" || it.lune == null ? "?" : it.lune), sub: [a ? a.label : "", it.respect === "oui" ? "respect" : "", it.mitige === "oui" ? "mitigé" : "", O.ETAT[it.etat] || "", O.plain(it.texte).slice(0, 60)].filter(Boolean).join(" · "), badges: a ? [a.glyph] : [] }; };
  const relFields = (famille) => [
    F.row([F.text("nom", "Nom actuel"), F.text("lien", "Lien avec Framboisier", { ph: famille ? "Mère, frère…" : "Mentor, ami, rival…" })]),
    F.row([F.text("groupe", famille ? "Rubrique (Famille maternelle…)" : "Clan / groupe", { list: clans }), F.text("rang", "Rang"), F.sel("statut", "Statut actuel", [["vivant", "Vivant·e"], ["mort", "Décédé·e"], ["disparu", "Disparu·e"]])]),
    F.row([F.sel("joueur", "Joué par", [["PNJ", "PNJ"], ["PJ", "PJ"]]), F.text("pseudo", "Pseudo du joueur (si PJ)")]),
    F.img("image", "Image (cadrée en carré)", { crop: true, hint: "« Envoyer une image » ouvre le recadrage ; « Recadrer » reprend l'image actuelle." }),
    R("notes", "Présentation (optionnel)"),
    F.text("avant", "Nom d'origine (avant un changement de nom)", { hint: "à remplir seulement si le nom a changé" }),
    F.items("renoms", "Changements de nom", [F.row([F.num("lune", "À la lune de Framboisier"), F.text("nom", "Nouveau nom")]), F.text("note", "Pourquoi (optionnel)")], { sum: (it) => ({ title: it.nom || "—", sub: "à la lune " + (it.lune === "" || it.lune == null ? "?" : it.lune) }), addLabel: "+ Ajouter un changement de nom", blank: () => ({ lune: "", nom: "", note: "" }) }),
    F.items("avis", "Avis au fil des lunes", [
      F.row([F.num("lune", "À la lune de Framboisier"), F.sel("appreciation", "Appréciation", APPS)]),
      F.row([F.yes("respect", "Il le·la respecte", { def: "non" }), F.yes("mitige", "Avis mitigé", { def: "non" })]),
      F.sel("etat", "Événement", [["", "— aucun"], ["mort", "Décédé·e (à cette lune)"], ["disparu", "Disparu·e (à cette lune)"], ["revenu", "Revenu·e"]]),
      R("texte", "Ce qui s'est passé / ce qu'il en pense"),
    ], { sum: sumAvis, sortBy: (it) => O.lunes(it), addLabel: "+ Ajouter un avis", blank: () => ({ lune: lunesNow(), appreciation: "neutre", respect: "non", mitige: "non", etat: "", texte: "" }) }),
  ];
  const sumRel = (it) => ({ title: it.nom || "(sans nom)", sub: [it.lien, it.groupe].filter(Boolean).join(" · "), thumb: it.image, badges: [it.statut === "mort" ? "✦" : it.statut === "disparu" ? "?" : "", (O.APP[(O.avisAt(it) || {}).appreciation] || {}).glyph || ""].filter(Boolean) });
  const relBlank = () => ({ nom: "", lien: "", groupe: "", rang: "", statut: "vivant", joueur: "PNJ", pseudo: "", image: "", notes: "", avant: "", renoms: [], avis: [] });

  const SECTIONS = [
    { g: "Général", list: [
      { id: "vue", ic: "🏠", label: "Vue d'ensemble", help: "Bienvenue ! Ici, tu contrôles tout le site d'Étoile de Framboisier. Rien n'est publié tant que tu n'as pas cliqué sur « Enregistrer »." },
      { id: "identite", ic: "🪪", label: "Identité & accueil", help: "Les informations de base, les chiffres de la fiche et les images de l'accueil.", defs: [F.group("identite", "", [
        F.group("", "Nom & accroche", [F.text("nom", "Nom"), F.text("sous_titre", "Sous-titre"), F.area("accroche", "Phrase d'accroche", { rows: 3 }), F.text("citation", "Citation d'accueil")], { bare: true }),
        F.group("", "Images", [F.img("image", "Portrait (accueil, en rond)", { crop: true, hint: "carré, recadrable" }), F.img("image2", "Illustration en pied (fiche physique)")], { bare: true, cols: true }),
        F.group("", "Fiche", [F.num("lunes", "Âge (lunes)"), F.num("lunes_meneur", "Âge à la nomination"), F.text("clan", "Clan"), F.text("rang", "Rang"), F.text("sexe", "Sexe"), F.text("orientation", "Orientation"), F.text("pelage", "Pelage"), F.text("yeux", "Yeux"), F.text("taille", "Taille"), F.text("poids", "Poids")], { bare: true, cols: true }),
        F.group("", "Statistiques", [F.num("pv", "PV"), F.num("pv_max", "PV maximum possible", { hint: "50 pour un chat ordinaire, 60 pour un meneur : le maximum du maximum." }), F.text("pv_note", "Note sous les PV"), F.num("pa", "PA"), F.num("vies", "Vies restantes"), F.num("vies_max", "Vies au total"), F.num("origine_tonnerre", "Origine : % Clan du Tonnerre"), F.num("origine_domestique", "Origine : % Domestique")], { bare: true, cols: true }),
        F.group("", "Joueur", [F.text("pseudo_joueur", "Pseudo du joueur"), F.text("credits", "Crédits (pied de page)")], { bare: true, cols: true }),
      ], { bare: true })] },
      { id: "reglages", ic: "⚙️", label: "Réglages du site", help: "Les pages du menu (ordre et visibilité), les couleurs et quelques textes. Les couleurs s'appliquent au thème « jour ».", defs: [
        F.items("reglages.sections", "Pages du menu (ordre d'affichage)", [F.text("nom", "Nom"), F.yes("actif", "Afficher cette page")], { fixed: true, sum: (it) => ({ title: it.nom, sub: it.actif === "non" ? "masquée" : "affichée" }), help: "↑ ↓ pour réordonner, la case pour masquer une page entière." }),
        F.group("reglages", "Apparence", [F.yes("particules", "Pétales et étoiles qui flottent en fond"), F.row([F.color("couleur_creme", "Fond crème"), F.color("couleur_abricot", "Abricot"), F.color("couleur_brun", "Brun (titres, trait)"), F.color("couleur_turquoise", "Turquoise"), F.color("couleur_mauve", "Mauve (freesias)")])]),
        F.group("reglages", "Textes", [F.text("titre_page", "Titre de l'onglet du navigateur"), F.text("texte_pied", "Pied de page : « Personnage créé par… »")]),
      ] },
    ] },
    { g: "Personnage", list: [
      { id: "caractere", ic: "💭", label: "Caractère", help: "Portrait général, puis qualités et défauts (cartes dépliantes).", defs: [R("caractere.intro", "Description générale", { tall: true }), F.area("caractere.conclusion", "Phrase de conclusion", { rows: 2 }), traits("caractere.qualites", "Qualités"), traits("caractere.defauts", "Défauts")] },
      { id: "physique", ic: "🐾", label: "Physique", help: "Description, points forts/faibles, accessoires, cicatrices. Les parties vides ne s'affichent pas.", defs: [R("physique.description", "Description", { tall: true }), F.strs("physique.signes", "Signes distinctifs (petites étiquettes)"), traits("physique.forts", "Points forts"), traits("physique.faibles", "Points faibles"), R("physique.accessoires", "Accessoires"), R("physique.cicatrices", "Cicatrices"), R("physique.handicap", "Handicap")] },
      { id: "gouts", ic: "🍃", label: "Goûts & peurs", help: "Ce qu'il aime, déteste, craint, ses habitudes. Une catégorie vide disparaît du site.", defs: [traits("gouts.aime", "Ce qu'il aime"), traits("gouts.deteste", "Ce qu'il déteste"), traits("gouts.peurs", "Peurs & phobies"), traits("gouts.habitudes", "Habitudes & tics")] },
      { id: "noms", ic: "🏷️", label: "Noms", help: "Un nom par étape. « Ancien nom » le barre sur le site.", defs: [F.items("noms", "Noms", [F.row([F.text("etape", "Étape"), F.text("nom", "Nom"), F.num("lune", "Lune (optionnel)")]), F.yes("ancien", "Ancien nom (affiché barré)"), R("texte", "Explication")], { sum: (it) => ({ title: it.nom || "—", sub: it.etape }), addLabel: "+ Ajouter une étape" })] },
      { id: "convictions", ic: "⭐", label: "Convictions", help: "Son rapport au clan, aux autres clans et au Clan des Étoiles.", defs: [R("convictions.clan", "Relation au clan"), F.items("convictions.autres_clans", "Avis sur les autres clans", [F.text("nom", "Clan"), R("texte", "Avis")], { sum: (it) => ({ title: it.nom || "—", sub: O.plain(it.texte).slice(0, 80) }), addLabel: "+ Ajouter un clan" }), R("convictions.etoiles", "Croyance (Clan des Étoiles)")] },
    ] },
    { g: "Histoire", list: [
      { id: "histoire", ic: "📜", label: "Histoire (chapitres)", help: "Un chapitre = une sous-page de « Histoire » sur le site. Écris librement : paragraphes, sauts de ligne, intertitres, citations, séparateurs… Utilise ↑ ↓ pour les réordonner.", defs: [F.items("histoire", "Chapitres", [F.row([F.text("titre", "Titre du chapitre"), F.text("periode", "Période (étiquette)")]), R("paragraphes", "Texte du chapitre", { tall: true })], { sum: (it) => ({ title: it.titre || "(chapitre)", sub: it.periode || O.plain(it.paragraphes).slice(0, 70) }), addLabel: "+ Ajouter un chapitre" })] },
    ] },
    { g: "Relations", list: [
      { id: "famille", ic: "🏡", label: "Famille", help: "Chaque membre a sa fiche : image cadrée, statut, changements de nom et avis datés. La « rubrique » crée les groupes de la page (Famille maternelle, Adelphité…).", defs: [F.items("famille", "Membres de la famille", relFields(true), { sum: sumRel, addLabel: "+ Ajouter un membre", search: true, blank: relBlank })] },
      { id: "relations", ic: "🍓", label: "Relations diverses", help: "Mentors, amis, rivaux… Pour faire évoluer un lien, ouvre la fiche et ajoute un avis à telle lune : le site en tire la fiche détaillée et la vue d'ensemble avec son curseur des lunes.", defs: [F.items("relations", "Relations", relFields(false), { sum: sumRel, addLabel: "+ Ajouter une relation", search: true, blank: relBlank })] },
    ] },
    { g: "Role-play", list: [
      { id: "scenes", ic: "✎", label: "Scènes RP", help: "Tous les fils de Framboisier. Un clic sur un titre ouvre la scène sur le site, avec ton texte et un fond selon l'ambiance choisie. Le lien Discord est un bouton à part.", defs: [F.items("scenes", "Scènes", [
        F.text("titre", "Titre"),
        F.row([F.text("lune", "Lune de Framboisier", { ph: "15 ou 14–15" }), F.sel("theme", "Ambiance (fond de la page)", THEMES), F.yes("en_cours", "Scène toujours en cours", { def: "non" })]),
        F.text("lien", "Lien du fil Discord", { ph: "https://discord.com/channels/…" }),
        F.tags("participants", "Participants", { suggest: names, hint: "Ceux qui correspondent à une fiche deviennent des liens." }),
        F.area("description", "Résumé (affiché sur la carte)", { rows: 3 }),
        R("texte", "Texte de la scène", { tall: true }),
      ], { sum: (it) => ({ title: it.titre || "(sans titre)", sub: [it.lune ? "lune " + it.lune : "", (THEMES.find((t) => t[0] === it.theme) || [])[1]].filter(Boolean).join(" · "), badges: [it.en_cours === "oui" ? "en cours" : "terminée"] }), addLabel: "+ Ajouter une scène", search: true, sortBy: (it) => { const m = String(it.lune ?? "").match(/\d+/); return m ? +m[0] : 1e9; }, blank: () => ({ titre: "", lune: lunesNow(), theme: "calme", en_cours: "non", lien: "", participants: [], description: "", texte: "" }) })] },
    ] },
    { g: "Médias & extras", list: [
      { id: "galerie", ic: "🖼️", label: "Galerie", help: "Les illustrations de la galerie (cliquables en grand sur le site).", defs: [F.items("galerie", "Images", [F.text("titre", "Titre"), F.img("image", "Image"), F.area("description", "Légende", { rows: 2 })], { sum: (it) => ({ title: it.titre || "(sans titre)", sub: it.description, thumb: it.image }), addLabel: "+ Ajouter une image" })] },
      { id: "libres", ic: "✨", label: "Pages libres", help: "Crée tes propres pages (ex. « Ses rêves », « Anecdotes »). Elles apparaissent dans le menu.", defs: [F.items("libres", "Pages", [F.text("titre", "Titre"), R("paragraphes", "Texte", { tall: true }), F.img("image", "Image (optionnelle)")], { sum: (it) => ({ title: it.titre || "(page)", sub: O.plain(it.paragraphes).slice(0, 80), thumb: it.image }), addLabel: "+ Ajouter une page" })] },
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
    draftTimer = setTimeout(() => { try { dirty ? localStorage.setItem(DRAFT, JSON.stringify(state)) : localStorage.removeItem(DRAFT); } catch (e) {} }, 500);
  }
  function toast(msg, bad) { const t = $("toast"); t.textContent = msg; t.className = "toast show" + (bad ? " bad" : ""); clearTimeout(toast.t); toast.t = setTimeout(() => (t.className = "toast"), 3400); }
  async function load() {
    let remote = null;
    try { const { data, error } = await sb.from(C.TABLE).select("data").eq("id", C.CONTENT_ID).maybeSingle(); if (error) throw error; remote = data && data.data; } catch (e) { banner("La base n'est pas joignable (" + (e.message || e) + "). Tu travailles sur le contenu par défaut : exécute supabase/setup.sql dans Supabase si ce n'est pas encore fait.", true); }
    saved = O.load(remote || {}); state = clone(saved);
    try { const d = JSON.parse(localStorage.getItem(DRAFT)); if (d && JSON.stringify(O.load(d)) !== JSON.stringify(saved)) banner('Un brouillon non enregistré a été retrouvé. <button class="link" id="b-restore">Le restaurer</button> · <button class="link" id="b-drop">L\'ignorer</button>'); } catch (e) {}
    touch();
  }
  function banner(html, bad) { const b = $("banner"); b.hidden = false; b.className = "banner" + (bad ? " bad" : ""); b.innerHTML = html + ' <button class="link" id="b-close" aria-label="Fermer">✕</button>'; b.onclick = (e) => { const id = e.target.id; if (id === "b-close") b.hidden = true; if (id === "b-restore") { state = O.load(JSON.parse(localStorage.getItem(DRAFT))); b.hidden = true; touch(); show(current); } if (id === "b-drop") { try { localStorage.removeItem(DRAFT); } catch (x) {} b.hidden = true; } }; }
  async function save() {
    if (!dirty) return;
    setStatus("busy", "Enregistrement…"); $("btn-save").disabled = true;
    const { error } = await sb.from(C.TABLE).upsert({ id: C.CONTENT_ID, data: state, updated_at: new Date().toISOString() });
    if (error) { setStatus("dirty", "● Échec de l'enregistrement"); $("btn-save").disabled = false; toast("Échec : " + error.message, true); if (/does not exist|relation|schema cache/i.test(error.message)) banner("La table n'existe pas encore : exécute <code>supabase/setup.sql</code> dans Supabase (SQL Editor).", true); return; }
    saved = clone(state); touch(); toast("Enregistré ✓ — le site est à jour");
  }

  /* ---------- images : réduction en WebP, recadrage, envoi dans Supabase Storage ---------- */
  const loadImg = (src) => new Promise((res, rej) => { const im = new Image(); im.crossOrigin = "anonymous"; im.onload = () => res(im); im.onerror = () => rej(new Error("image illisible (ou protégée)")); im.src = src; });
  const fileUrl = (f) => URL.createObjectURL(f);
  async function shrink(file, max = 1600) {
    const url = fileUrl(file), im = await loadImg(url), k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement("canvas");
    c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(url);
    return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("conversion impossible"))), "image/webp", 0.86));
  }
  async function upload(blob, name) {
    const ext = blob.type === "image/webp" ? "webp" : (String(name).split(".").pop() || "png").toLowerCase();
    const path = `${Date.now().toString(36)}-${O.slug(String(name).replace(/\.[^.]+$/, "")) || "image"}.${ext}`;
    const { error } = await sb.storage.from(C.BUCKET).upload(path, blob, { contentType: blob.type, cacheControl: "31536000" });
    if (error) throw error;
    return sb.storage.from(C.BUCKET).getPublicUrl(path).data.publicUrl;
  }
  // Fenêtre de recadrage : glisser pour déplacer, curseur / molette pour zoomer. Renvoie un carré WebP (ou null).
  function cropper(src, size = 640) {
    return new Promise(async (resolve) => {
      let im; try { im = await loadImg(src); } catch (e) { toast("Recadrage impossible : " + e.message, true); return resolve(null); }
      const V = Math.min(340, innerWidth - 56), ov = el("div", "crop-ov"), box = el("div", "crop-box");
      box.innerHTML = `<h3>Recadrer l'image</h3><p class="hint">Fais glisser l'image, zoome avec le curseur ou la molette. Le cercle montre ce qui sera visible sur le site.</p><div class="crop-view" style="width:${V}px;height:${V}px"><canvas width="${V}" height="${V}"></canvas><i class="crop-mask"></i></div><input type="range" class="crop-zoom" min="0" max="100" value="0" aria-label="Zoom"><div class="crop-actions"><button class="btn small" type="button" id="c-cancel">Annuler</button><button class="btn small primary" type="button" id="c-ok">Valider le cadrage</button></div>`;
      ov.append(box); document.body.append(ov);
      const cv = box.querySelector("canvas"), ctx = cv.getContext("2d"), zoom = box.querySelector(".crop-zoom");
      const base = Math.max(V / im.width, V / im.height); let s = base, ox = (V - im.width * s) / 2, oy = (V - im.height * s) / 2;
      const clamp = () => { ox = Math.min(0, Math.max(V - im.width * s, ox)); oy = Math.min(0, Math.max(V - im.height * s, oy)); };
      const draw = () => { clamp(); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, V, V); ctx.drawImage(im, ox, oy, im.width * s, im.height * s); };
      const setScale = (ns, cx = V / 2, cy = V / 2) => { ns = Math.min(base * 4, Math.max(base, ns)); ox = cx - ((cx - ox) / s) * ns; oy = cy - ((cy - oy) / s) * ns; s = ns; zoom.value = Math.round(((s - base) / (base * 3)) * 100); draw(); };
      zoom.oninput = () => setScale(base + (zoom.value / 100) * base * 3);
      cv.onwheel = (e) => { e.preventDefault(); setScale(s * (e.deltaY < 0 ? 1.08 : 0.92), e.offsetX, e.offsetY); };
      let drag = null; cv.onpointerdown = (e) => { drag = [e.clientX - ox, e.clientY - oy]; cv.setPointerCapture(e.pointerId); }; cv.onpointermove = (e) => { if (drag) { ox = e.clientX - drag[0]; oy = e.clientY - drag[1]; draw(); } }; cv.onpointerup = () => (drag = null);
      draw();
      const close = (v) => { ov.remove(); resolve(v); };
      box.querySelector("#c-cancel").onclick = () => close(null);
      box.querySelector("#c-ok").onclick = () => { const out = document.createElement("canvas"); out.width = out.height = size; const k = size / V; const c2 = out.getContext("2d"); c2.fillStyle = "#fff"; c2.fillRect(0, 0, size, size); c2.drawImage(im, ox * k, oy * k, im.width * s * k, im.height * s * k); out.toBlob((b) => close(b), "image/webp", 0.88); };
    });
  }

  /* ---------- éditeur de texte riche ---------- */
  const COLORS = ["#4a2c17", "#8a4f26", "#d98a3d", "#c2395a", "#9a62a8", "#1f9db8", "#4f8f4a", "#6b6b6b"];
  const MARKS = ["#ffe27a", "#ffc4d0", "#bfeaf5", "#cdeab5", "#e6d2f2"];
  try { document.execCommand("defaultParagraphSeparator", false, "p"); } catch (e) {}
  function richField(f, obj, wrap, ctx) {
    const get = () => O.get(obj, f.k);
    const box = el("div", "rte"), bar = el("div", "rte-bar"), ed = el("div", "rte-area"), foot = el("div", "rte-foot");
    ed.contentEditable = "true"; ed.spellcheck = true; ed.lang = "fr"; ed.dataset.ph = "Écris ici… (Entrée = nouveau paragraphe, Maj+Entrée = saut de ligne)"; ed.setAttribute("role", "textbox"); ed.setAttribute("aria-multiline", "true"); ed.setAttribute("aria-label", f.label || "Texte");
    if (f.tall) ed.classList.add("tall");
    ed.innerHTML = O.html(get());
    const words = () => { const t = (ed.textContent || "").trim(); foot.textContent = (t ? t.split(/\s+/).length : 0) + " mot" + (t.split(/\s+/).length > 1 ? "s" : "") + " · " + t.length + " caractères"; };
    const commit = () => { O.set(obj, f.k, O.clean(ed.innerHTML)); words(); touch(); ctx && ctx.onInput && ctx.onInput(); };
    const cmd = (c, v) => { ed.focus(); document.execCommand("styleWithCSS", false, c === "foreColor" || c === "hiliteColor"); document.execCommand(c, false, v); document.execCommand("styleWithCSS", false, false); commit(); };
    const btn = (label, title, fn, cls) => { const b = el("button", "rb" + (cls ? " " + cls : ""), label); b.type = "button"; b.title = title; b.setAttribute("aria-label", title); b.onmousedown = (e) => e.preventDefault(); b.onclick = fn; bar.append(b); return b; };
    const sep = () => bar.append(el("span", "rsep"));
    const blk = el("select", "rb-sel"); blk.title = "Style du paragraphe"; [["p", "Paragraphe"], ["h2", "Titre"], ["h3", "Sous-titre"], ["h4", "Intertitre (petites capitales)"], ["blockquote", "Citation / paroles"]].forEach(([v, l]) => blk.append(new Option(l, v)));
    blk.onchange = () => { cmd("formatBlock", blk.value); blk.value = "p"; }; bar.append(blk); sep();
    btn("<b>G</b>", "Gras (Ctrl+B)", () => cmd("bold")); btn("<i>I</i>", "Italique (Ctrl+I)", () => cmd("italic")); btn("<u>S</u>", "Souligné (Ctrl+U)", () => cmd("underline")); btn("<s>B</s>", "Barré", () => cmd("strikeThrough")); sep();
    const pal = (label, title, list, command, reset) => { const d = el("details", "rpal"), s = el("summary", "rb", label); s.title = title; s.onmousedown = (e) => e.preventDefault(); const p = el("div", "rpal-list"); list.forEach((c) => { const b = el("button", "sw"); b.type = "button"; b.style.background = c; b.title = c; b.onmousedown = (e) => e.preventDefault(); b.onclick = () => { cmd(command, c); d.open = false; }; p.append(b); }); if (reset) { const b = el("button", "mini", "Aucun"); b.type = "button"; b.onmousedown = (e) => e.preventDefault(); b.onclick = () => { reset(); d.open = false; }; p.append(b); } d.append(s, p); bar.append(d); };
    pal('<span class="ic-col">A</span>', "Couleur du texte", COLORS, "foreColor", () => cmd("foreColor", "#4a2c17"));
    pal('<span class="ic-mark">▮</span>', "Surligner", MARKS, "hiliteColor", () => cmd("hiliteColor", "transparent")); sep();
    btn("•", "Liste à puces", () => cmd("insertUnorderedList")); btn("1.", "Liste numérotée", () => cmd("insertOrderedList")); btn("❝", "Citation", () => cmd("formatBlock", "blockquote")); sep();
    btn("⇤", "Aligner à gauche", () => cmd("justifyLeft")); btn("↔", "Centrer", () => cmd("justifyCenter")); btn("⇥", "Aligner à droite", () => cmd("justifyRight")); sep();
    btn("✦", "Séparateur ✦ ✦ ✦", () => cmd("insertHorizontalRule"));
    btn("🔗", "Lien", () => { const u = prompt("Adresse du lien (https://…) :"); if (u && O.safeLink(u.trim())) cmd("createLink", u.trim()); else if (u) toast("Le lien doit commencer par https://", true); });
    const fi = el("input"); fi.type = "file"; fi.accept = "image/*"; fi.hidden = true;
    fi.onchange = async () => { if (!fi.files[0]) return; try { const u = await upload(await shrink(fi.files[0]), fi.files[0].name); cmd("insertImage", u); toast("Image insérée ✓"); } catch (e) { toast("Envoi impossible : " + (e.message || e), true); } fi.value = ""; };
    btn("🖼", "Insérer une image", () => fi.click()); bar.append(fi); sep();
    btn("⌫", "Effacer la mise en forme", () => { document.execCommand("removeFormat"); cmd("formatBlock", "p"); });
    btn("↶", "Annuler", () => cmd("undo")); btn("↷", "Rétablir", () => cmd("redo"));
    btn("⛶", "Plein écran (Échap pour quitter)", () => { box.classList.toggle("full"); document.body.classList.toggle("rte-full", box.classList.contains("full")); ed.focus(); }, "right");
    ed.addEventListener("input", commit);
    ed.addEventListener("blur", () => { const c = O.clean(ed.innerHTML); if (c !== ed.innerHTML) ed.innerHTML = c; });
    ed.addEventListener("paste", (e) => {
      e.preventDefault(); const cd = e.clipboardData, h = cd.getData("text/html"), t = cd.getData("text/plain");
      const out = h ? O.clean(h) : t.split(/\n{2,}/).map((p) => "<p>" + esc(p).replace(/\n/g, "<br>") + "</p>").join("");
      document.execCommand("insertHTML", false, out); commit();
    });
    ed.addEventListener("keydown", (e) => { if (e.key === "Escape" && box.classList.contains("full")) { box.classList.remove("full"); document.body.classList.remove("rte-full"); } });
    box.append(bar, ed, foot); wrap.append(box); words();
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
      inp = el("input"); inp.type = "text"; if (f.t === "num") inp.inputMode = "numeric"; inp.value = get() ?? ""; if (f.ph) inp.placeholder = f.ph;
      if (f.list) { const dl = el("datalist"); dl.id = id + "l"; f.list().forEach((v) => dl.append(new Option(v))); inp.setAttribute("list", dl.id); wrap.append(dl); }
      inp.oninput = () => put(f.t === "num" ? (inp.value.trim() === "" ? "" : isNaN(Number(inp.value)) ? inp.value : Number(inp.value)) : inp.value);
    } else if (f.t === "area") {
      inp = el("textarea"); inp.rows = f.rows || 4; inp.value = get() ?? ""; inp.oninput = () => put(inp.value);
    } else if (f.t === "sel") {
      inp = el("select"); f.opts.forEach(([v, l]) => inp.append(new Option(l, v))); inp.value = get() ?? f.opts[0][0]; inp.onchange = () => put(inp.value);
    } else if (f.t === "yes") {
      wrap.className = "fld check"; const cb = el("input"); cb.type = "checkbox"; cb.id = id; cb.checked = (get() ?? f.def ?? "oui") !== "non"; cb.onchange = () => put(cb.checked ? "oui" : "non"); wrap.prepend(cb);
    } else if (f.t === "color") {
      inp = el("input"); inp.type = "color"; inp.value = /^#[0-9a-f]{6}$/i.test(get()) ? get() : "#ffffff"; inp.oninput = () => put(inp.value); wrap.append(inp);
      const rst = el("button", "mini", "Réinitialiser"); rst.type = "button"; rst.onclick = () => { const d = O.get(window.DEFAULT_CONTENT, "reglages." + f.k); inp.value = d; put(d); }; wrap.append(rst); inp = null;
    } else if (f.t === "img") {
      const row = el("div", "imgrow"), prev = el("div", "thumb"), url = el("input"); url.type = "text"; url.id = id; url.placeholder = "https://… ou assets/…"; url.value = get() ?? "";
      const paint = () => { const s = O.safeSrc(url.value); prev.innerHTML = s ? `<img src="${esc(s)}" alt="">` : "🖼"; rc.hidden = !f.crop || !s; };
      url.oninput = () => { put(url.value); paint(); };
      const file = el("input"); file.type = "file"; file.accept = "image/*"; file.hidden = true;
      const btn = el("button", "btn small", "Envoyer une image"); btn.type = "button"; btn.onclick = () => file.click();
      const rc = el("button", "btn small", "Recadrer"); rc.type = "button";
      const run = async (job) => { btn.disabled = rc.disabled = true; try { const u = await job(); if (u) { url.value = u; put(u); paint(); toast("Image prête ✓ (pense à enregistrer)"); } } catch (e) { toast("Envoi impossible : " + (e.message || e), true); } btn.disabled = rc.disabled = false; };
      file.onchange = () => { const fl = file.files[0]; if (!fl) return; run(async () => { if (f.crop) { const b = await cropper(fileUrl(fl)); return b ? upload(b, fl.name) : null; } return upload(await shrink(fl), fl.name); }); file.value = ""; };
      rc.onclick = () => run(async () => { const b = await cropper(O.safeSrc(url.value)); return b ? upload(b, "cadrage") : null; });
      const clr = el("button", "mini", "Retirer"); clr.type = "button"; clr.onclick = () => { url.value = ""; put(""); paint(); };
      row.append(prev, url, btn, rc, clr, file); wrap.append(row); paint(); inp = null;
    } else if (f.t === "rich") {
      richField(f, obj, wrap, ctx); inp = null;
    } else if (f.t === "tags" || f.t === "strs") {
      const list = el("div", "tags-in"), arr = () => get() || (O.set(obj, f.k, []), get());
      const draw = () => {
        list.innerHTML = ""; arr().forEach((t, i) => { const c = el("span", "tg", esc(t) + " "); const x = el("button", "", "✕"); x.type = "button"; x.setAttribute("aria-label", "Retirer " + t); x.onclick = () => { arr().splice(i, 1); touch(); draw(); }; c.append(x); list.append(c); });
        const i = el("input"); i.type = "text"; i.placeholder = f.t === "tags" ? "Ajouter un nom puis Entrée…" : "Ajouter puis Entrée…"; i.id = id; if (f.suggest) { const dl = el("datalist"); dl.id = id + "d"; f.suggest().forEach((v) => dl.append(new Option(v))); i.setAttribute("list", dl.id); list.append(dl); }
        const add = () => { const v = i.value.replace(/,$/, "").trim(); if (v) { arr().push(v); touch(); draw(); list.querySelector("input").focus(); } };
        i.onkeydown = (e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } else if (e.key === "Backspace" && !i.value && arr().length) { arr().pop(); touch(); draw(); list.querySelector("input").focus(); } };
        i.onchange = add; list.append(i);
      };
      draw(); wrap.append(list); inp = null;
    }
    if (inp) { inp.id = id; wrap.append(inp); }
    if (f.hint) wrap.append(el("small", "hint", esc(f.hint)));
    host.append(wrap);
  }

  function itemsField(f, obj, ctx) {
    const arr = O.get(obj, f.k) || (O.set(obj, f.k, []), O.get(obj, f.k)), box = el("div", "items"), key = (ctx.path || "") + f.k;
    const blank = () => (f.blank ? f.blank() : (function mk(fs) { const o = {}; fs.forEach((x) => { if (x.t === "group") Object.assign(o, mk(x.fields)); else if (x.k) o[x.k] = x.t === "tags" || x.t === "strs" ? [] : x.t === "yes" ? (x.def || "oui") : ""; }); return o; })(f.fields));
    const redraw = () => { const y = scrollY; const n = itemsField(f, obj, ctx); box.replaceWith(n); scrollTo(0, y); };
    box.append(el("div", "items-head", `<h3>${esc(f.label)} <span class="count">${arr.length}</span></h3>${f.help ? `<p class="hint">${esc(f.help)}</p>` : ""}`));
    if (f.sortBy && arr.length > 1) { const sb2 = el("button", "mini sortbtn", "↕ Trier par lune (chronologique)"); sb2.type = "button"; sb2.onclick = () => { const s = arr.map((x, i) => [x, i]).sort((a, b) => f.sortBy(a[0]) - f.sortBy(b[0]) || a[1] - b[1]).map((x) => x[0]); arr.splice(0, arr.length, ...s); open.clear(); touch(); redraw(); toast("Trié par lune ✓"); }; box.append(sb2); }
    if (f.search && arr.length > 6) { const s = el("input"); s.type = "search"; s.placeholder = "Filtrer…"; s.className = "filter"; s.oninput = () => box.querySelectorAll(":scope > details.item").forEach((d) => (d.hidden = !O.norm(d.dataset.t).includes(O.norm(s.value)))); box.append(s); }
    arr.forEach((it, i) => {
      const d = el("details", "item"), k = key + "." + i, s = () => f.sum(it);
      const sm = el("summary"), paint = () => { const v = s(); d.dataset.t = v.title + " " + (v.sub || ""); sm.innerHTML = `${v.thumb && O.safeSrc(v.thumb) ? `<img class="mini-thumb" src="${esc(O.safeSrc(v.thumb))}" alt="">` : `<span class="num">${i + 1}</span>`}<span class="t"><b>${esc(v.title)}</b>${v.sub ? `<small>${esc(v.sub)}</small>` : ""}</span>${(v.badges || []).map((b) => `<span class="tag">${esc(b)}</span>`).join("")}`; };
      paint(); d.append(sm);
      const body = el("div", "item-body"); let built = false;
      const build = () => {
        if (built) return; built = true;
        f.fields.forEach((x) => field(x, it, body, { ...ctx, path: k + ".", onInput: () => { paint(); } }));
        const bar = el("div", "item-bar");
        const mv = (lbl, fn) => { const b = el("button", "mini", lbl); b.type = "button"; b.onclick = (e) => { e.preventDefault(); fn(); touch(); redraw(); }; bar.append(b); };
        mv("↑ Monter", () => i > 0 && ([arr[i - 1], arr[i]] = [arr[i], arr[i - 1]], open.clear()));
        mv("↓ Descendre", () => i < arr.length - 1 && ([arr[i + 1], arr[i]] = [arr[i], arr[i + 1]], open.clear()));
        if (!f.fixed) {
          mv("⧉ Dupliquer", () => (arr.splice(i + 1, 0, clone(it)), open.clear()));
          const del = el("button", "mini danger", "✕ Supprimer"); del.type = "button"; del.onclick = (e) => { e.preventDefault(); if (confirm("Supprimer « " + s().title + " » ?")) { arr.splice(i, 1); open.clear(); touch(); redraw(); } }; bar.append(del);
        }
        body.append(bar);
      };
      d.open = open.has(k); if (d.open) build();
      d.addEventListener("toggle", () => { if (d.open) { open.add(k); build(); } else open.delete(k); });
      d.append(body); box.append(d);
    });
    if (!f.fixed) { const add = el("button", "btn", esc(f.addLabel || "+ Ajouter")); add.type = "button"; add.onclick = () => { arr.push(blank()); open.add(key + "." + (arr.length - 1)); touch(); redraw(); }; box.append(add); }
    return box;
  }

  /* ---------- vue d'ensemble ---------- */
  function overview(host) {
    const n = (k) => (O.get(state, k) || []).length, I = state.identite;
    const stats = [["Chapitres", n("histoire")], ["Fiches de relations", n("famille") + n("relations")], ["Scènes RP", n("scenes")], ["Images", n("galerie")], ["Pages libres", n("libres")]];
    host.innerHTML = `<div class="ov"><div class="ov-hero">${O.safeSrc(I.image) ? `<img src="${esc(O.safeSrc(I.image))}" alt="">` : ""}<div><h2>${esc(I.nom)}</h2><p>${esc(I.sous_titre)} · ${esc(I.lunes)} lunes · ${esc(I.vies)}/${esc(I.vies_max)} vies</p><a class="btn primary" href="index.html" target="_blank" rel="noopener">Voir le site ↗</a></div></div>
      <div class="ov-stats">${stats.map(([l, v]) => `<div><strong>${v}</strong><span>${l}</span></div>`).join("")}</div>
      <div class="ov-tips"><h3>Comment ça marche</h3><ul><li>Choisis une rubrique à gauche, modifie, puis <b>Enregistrer</b> (ou <kbd>Ctrl</kbd>+<kbd>S</kbd>) : le site se met à jour tout de suite.</li><li><b>Éditeur de texte</b> : barre d'outils au-dessus de chaque texte (gras, titres, citations, couleurs, séparateurs, images…). <kbd>Entrée</kbd> = nouveau paragraphe, <kbd>Maj</kbd>+<kbd>Entrée</kbd> = saut de ligne. Le bouton ⛶ passe en plein écran pour écrire confortablement.</li><li><b>Relations</b> : ouvre une fiche, ajoute des <i>avis</i> à telle lune (appréciation, respect, mitigé, décès, disparition) et des changements de nom.</li><li><b>Scènes RP</b> : colle le texte du fil dans l'éditeur, choisis l'ambiance (le fond de la page change) et le lien Discord.</li><li>Un brouillon est gardé automatiquement dans ce navigateur. <b>⋯ → Exporter</b> télécharge une sauvegarde complète.</li></ul></div></div>`;
  }

  function show(id) {
    current = id; const s = ALL.find((x) => x.id === id) || ALL[0];
    document.querySelectorAll("#side a").forEach((a) => a.classList.toggle("on", a.dataset.id === s.id));
    $("sec-title").textContent = s.label; $("sec-help").textContent = s.help || "";
    const ed = $("editor"); ed.innerHTML = ""; uid = 0;
    if (s.id === "vue") overview(ed); else s.defs.forEach((f) => field(f, state, ed, {}));
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
  $("file-import").onchange = async (e) => { try { const j = JSON.parse(await e.target.files[0].text()); state = O.load(j); touch(); show(current); toast("Sauvegarde importée : clique sur Enregistrer pour la publier"); } catch (x) { toast("Fichier invalide", true); } e.target.value = ""; };
  $("btn-reset").onclick = () => { if (confirm("Revenir au contenu par défaut (non enregistré tant que tu ne cliques pas sur Enregistrer) ?")) { state = O.load({}); touch(); show(current); } };
  $("btn-menu").onclick = () => document.body.classList.toggle("side-open");
  addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); save(); } });
  addEventListener("beforeunload", (e) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } });
  boot();
})();
