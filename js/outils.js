// Petits outils partagés entre le site et le dashboard.
window.Outils = (function () {
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Mise en forme légère : **gras**  *italique*  ==surligné==  ~~barré~~  (le texte est d'abord échappé)
  const fmt = (s) => esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/==(.+?)==/g, "<mark>$1</mark>")
    .replace(/~~(.+?)~~/g, "<s>$1</s>")
    .replace(/\n/g, "<br>");
  const safeSrc = (u) => (/^(https?:\/\/|assets\/|\/)/.test(u || "") ? u : "");
  const safeLink = (u) => (/^https?:\/\//.test(u || "") ? u : "");
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
  return { esc, fmt, safeSrc, safeLink, norm, slug, initials, get, set, merge };
})();
