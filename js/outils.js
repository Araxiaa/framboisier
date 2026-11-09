// Petits outils partagés entre le site et le dashboard.
window.Outils = (function () {
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Mise en forme légère (anciens textes) : **gras**  *italique*  ==surligné==  ~~barré~~
  const fmt = (s) => esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<u>$1</u>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/==(.+?)==/g, "<mark>$1</mark>")
    .replace(/~~(.+?)~~/g, "<s>$1</s>")
    .replace(/\n/g, "<br>");
  const safeSrc = (u) => (/^(https?:\/\/|assets\/|\/)/.test(u || "") ? u : "");
  const safeLink = (u) => (/^(https?:\/\/|mailto:)/.test(u || "") ? u : "");
  const norm = (s) => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const initials = (n) => String(n).split(/[\s'’-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const get = (o, path) => path.split(".").reduce((a, k) => (a == null ? a : a[k]), o);
  const set = (o, path, v) => { const ks = path.split("."); const last = ks.pop(); const t = ks.reduce((a, k) => (a[k] = a[k] ?? {}), o); t[last] = v; };
  // Fusionne le contenu enregistré par-dessus le contenu par défaut : les objets se complètent, les listes sont remplacées.
  const merge = (def, saved) => {
    if (Array.isArray(def) || !def || typeof def !== "object") return saved === undefined ? def : saved;
    const out = { ...def };
    if (saved && typeof saved === "object" && !Array.isArray(saved)) for (const k of Object.keys(saved)) out[k] = k in def ? merge(def[k], saved[k]) : saved[k];
    return out;
  };

  // Contenu complet = défaut + enregistré. La liste des pages est complétée (ajout des pages apparues depuis, retrait des anciennes sections).
  function load(saved) {
    const c = merge(window.DEFAULT_CONTENT, saved || {}), def = window.DEFAULT_CONTENT.reglages.sections;
    let have = (c.reglages.sections || []).filter((s) => def.some((d) => d.id === s.id));
    if (!have.some((s) => s.id === "personnage")) have = def.map((d) => ({ ...d, actif: (have.find((s) => s.id === d.id) || d).actif })); // ancienne structure → ordre par défaut
    def.forEach((d, i) => { if (!have.some((s) => s.id === d.id)) { const prev = def[i - 1], at = prev ? have.findIndex((s) => s.id === prev.id) : -1; have.splice(at + 1, 0, { ...d }); } }); // page apparue depuis : insérée à sa place par défaut
    c.reglages.sections = have;
    return c;
  }

  /* ---------- texte riche : nettoyage (liste blanche) ---------- */
  const TAGS = { P: 1, BR: 1, STRONG: 1, EM: 1, U: 1, S: 1, MARK: 1, H2: 1, H3: 1, H4: 1, BLOCKQUOTE: 1, UL: 1, OL: 1, LI: 1, HR: 1, A: 1, SPAN: 1, IMG: 1 };
  const MAP = { B: "STRONG", I: "EM", STRIKE: "S", DEL: "S", DIV: "P", H1: "H2", H5: "H4", H6: "H4", FONT: "SPAN" };
  const DROP = { SCRIPT: 1, STYLE: 1, IFRAME: 1, OBJECT: 1, EMBED: 1, NOSCRIPT: 1, TEMPLATE: 1, SVG: 1, FORM: 1, INPUT: 1, BUTTON: 1, TEXTAREA: 1, SELECT: 1, LINK: 1, META: 1 };
  const COLOR = /^(#[0-9a-f]{3,8}|rgba?\([\d\s,./%]+\)|hsla?\([\d\s,./%deg]+\))$/i;
  function copy(from, to, doc) {
    for (const n of [...from.childNodes]) {
      if (n.nodeType === 3) { to.append(doc.createTextNode(n.nodeValue)); continue; }
      if (n.nodeType !== 1) continue;
      let t = n.tagName; if (DROP[t]) continue;
      t = MAP[t] || t;
      if (!TAGS[t]) { copy(n, to, doc); continue; }
      const st = [], c = n.style && n.style.color || n.getAttribute("color"), bg = n.style && n.style.backgroundColor, ta = n.style && n.style.textAlign;
      if (c && COLOR.test(c.trim())) st.push("color:" + c.trim());
      if (bg && COLOR.test(bg.trim())) st.push("background-color:" + bg.trim());
      if (ta && /^(left|center|right|justify)$/.test(ta) && /^(P|H2|H3|H4|BLOCKQUOTE|LI)$/.test(t)) st.push("text-align:" + ta);
      if (t === "SPAN" && !st.length) { copy(n, to, doc); continue; }
      const e = doc.createElement(t.toLowerCase());
      if (st.length) e.setAttribute("style", st.join(";"));
      if (t === "A") { const h = n.getAttribute("href"); if (!safeLink(h)) { copy(n, to, doc); continue; } e.setAttribute("href", h); e.setAttribute("target", "_blank"); e.setAttribute("rel", "noopener noreferrer"); }
      if (t === "IMG") { const s = n.getAttribute("src"); if (!safeSrc(s)) continue; e.setAttribute("src", s); e.setAttribute("alt", n.getAttribute("alt") || ""); e.setAttribute("loading", "lazy"); }
      else copy(n, e, doc);
      to.append(e);
    }
  }
  function clean(html) {
    const doc = new DOMParser().parseFromString("<body>" + String(html ?? "") + "</body>", "text/html"), out = doc.createElement("div");
    copy(doc.body, out, doc);
    return out.innerHTML;
  }
  // Accepte : du HTML (éditeur), un texte simple (anciennes versions) ou une liste de paragraphes.
  function html(v) {
    if (Array.isArray(v)) return v.map(html).join("");
    const s = String(v ?? ""); if (!s.trim()) return "";
    if (/<(p|br|h[1-6]|ul|ol|blockquote|strong|em|div|hr|span|a|img|u|s|mark|b|i)\b/i.test(s)) return clean(s);
    return s.split(/\n{2,}/).map((p) => "<p>" + fmt(p) + "</p>").join("");
  }
  const plain = (v) => { const d = document.createElement("div"); d.innerHTML = html(v); return (d.textContent || "").replace(/\s+/g, " ").trim(); };

  /* ---------- relations : échelle des avis ---------- */
  const APP = {
    pos3: { g: "pos", n: 3, glyph: "🍓🍓🍓", label: "Coup de cœur" },
    pos2: { g: "pos", n: 2, glyph: "🍓🍓", label: "Bon·ne ami·e" },
    pos1: { g: "pos", n: 1, glyph: "🍓", label: "Plutôt sympa" },
    neutre: { g: "neutre", n: 0, glyph: "☁️", label: "Neutre" },
    neg1: { g: "neg", n: -1, glyph: "🐛", label: "Bof" },
    neg2: { g: "neg", n: -2, glyph: "🐛🐛", label: "Pas fan" },
    neg3: { g: "neg", n: -3, glyph: "🐛🐛🐛", label: "Beurk !" },
  };
  const ETAT = { mort: "Décédé·e", disparu: "Disparu·e", revenu: "Revenu·e" };
  const lunes = (a) => (a.lune === "" || a.lune == null || isNaN(Number(a.lune)) ? 0 : Number(a.lune));
  const sortedAvis = (r) => [...(r.avis || [])].sort((a, b) => lunes(a) - lunes(b));
  // Avis en vigueur à la lune L (sans L : le plus récent). Statut à la lune L : dernier « état » connu.
  function avisAt(r, L) { const l = sortedAvis(r).filter((a) => L == null || lunes(a) <= L && !(a.lune === "" && L < 0)); return l.filter((a) => a.appreciation).pop() || null; }
  function statutAt(r, L) {
    const ev = sortedAvis(r).filter((a) => a.etat && (L == null || lunes(a) <= L));
    if (ev.length) { const e = ev[ev.length - 1].etat; return e === "revenu" ? "vivant" : e; }
    return L == null ? (r.statut || "vivant") : (r.statut === "vivant" || !r.statut ? "vivant" : (sortedAvis(r).some((a) => a.etat) ? "vivant" : (r.statut)));
  }
  // Nom porté à la lune L (changements de nom : [{lune, nom}]).
  function nomAt(r, L) {
    const c = [...(r.renoms || [])].filter((x) => x.nom).sort((a, b) => lunes(a) - lunes(b));
    if (L == null || !c.length) return r.nom;
    let nom = c[0].nom && lunes(c[0]) > L ? (r.avant || r.nom) : r.nom;
    c.forEach((x) => { if (lunes(x) <= L) nom = x.nom; });
    return nom;
  }
  return { esc, fmt, safeSrc, safeLink, norm, slug, initials, get, set, merge, load, clean, html, plain, APP, ETAT, sortedAvis, avisAt, statutAt, nomAt, lunes };
})();
