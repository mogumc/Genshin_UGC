const BASES = {
    knowledge: `${window.location.protocol}//${window.location.host}/ugc-tutorial/knowledge/sea`,
    course: `${window.location.protocol}//${window.location.host}/ugc-tutorial/course/sea`,
  },
  LANGS = [
    "zh-cn",
    "zh-tw",
    "en-us",
    "de-de",
    "es-es",
    "fr-fr",
    "id-id",
    "ja-jp",
    "ko-kr",
    "pt-pt",
    "ru-ru",
    "th-th",
    "vi-vn",
    "tr-tr",
    "it-it",
  ],
  datasetSelect = document.getElementById("dataset"),
  langSelect = document.getElementById("lang"),
  loadBtn = document.getElementById("loadBtn"),
  catalogDiv = document.getElementById("catalog"),
  detailInfo = document.getElementById("detailInfo"),
  detailContent = document.getElementById("detailContent"),
  attemptsDiv = document.getElementById("attempts");
let activeCatalogItem = null;
const activeCatalogClasses = [
  "border-indigo-300",
  "bg-indigo-50",
  "text-indigo-700",
  "shadow-inner",
];
function setActiveCatalogItem(t) {
  activeCatalogItem !== t &&
    (activeCatalogItem &&
      activeCatalogItem.classList.remove(...activeCatalogClasses),
    (activeCatalogItem = t || null),
    activeCatalogItem &&
      activeCatalogItem.classList.add(...activeCatalogClasses));
}
function showError(t, e) {
  t.innerHTML = `<div class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">${escapeHtml(
    e
  )}</div>`;
}
function clearDetail() {
  (detailInfo.innerHTML = ""),
    (detailContent.innerHTML =
      '<p class="text-sm text-slate-500">Select a catalog item to preview its detail.</p>');
}
function renderCatalog(t, e, a, n) {
  (catalogDiv.innerHTML = ""), setActiveCatalogItem(null);
  const o = document.createElement("ul");
  o.className = "space-y-1";
  const l = (t) =>
      t
        ? Array.isArray(t)
          ? t
          : "object" == typeof t
          ? Object.values(t)
          : []
        : [],
    i = l(t?.data ?? t);
  !i || (Array.isArray(i) && !i.length)
    ? (catalogDiv.innerHTML =
        '<div class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm">Catalog is empty for this selection.</div>')
    : (!(function t(i, r = 0) {
        i.forEach((i) => {
          const s = document.createElement("li");
          s.className = "list-none";
          const d = document.createElement("button");
          (d.type = "button"),
            (d.className =
              "catalog-item group flex w-full items-center rounded-md border border-transparent bg-white px-3 py-2 text-left text-sm text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"),
            (d.style.paddingLeft = 12 + 12 * r + "px"),
            (d.textContent = i.title || i.name || i.path_id || "untitled"),
            (d.dataset.pathId = i.path_id || i.id || ""),
            (d.dataset.realId = i.real_id || ""),
            d.addEventListener("click", () => {
              selectCatalogItem(d, i, a, n, e);
            }),
            s.appendChild(d),
            o.appendChild(s);
          const c = l(i.children);
          c.length && t(c, r + 1);
        });
      })(i),
      catalogDiv.appendChild(o));
}
function selectCatalogItem(t, e, a, n, o) {
  setActiveCatalogItem(t), loadDetail(e, a, n, o);
}
async function loadDetail(t, e, a, n) {
  clearDetail(),
    (detailInfo.innerHTML = `<div class="text-sm font-semibold text-slate-700">${
      t.title || t.path_id || t.name || "(untitled)"
    }</div>`);
  const o = document.createElement("pre");
  (o.className =
    "mt-3 max-h-48 overflow-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600"),
    (o.textContent = JSON.stringify(t, null, 2)),
    detailInfo.appendChild(o);
  const l = new Set();
  if (
    ([
      "path_id",
      "real_id",
      "realId",
      "id",
      "resource_id",
      "resourceId",
      "file_name",
      "fileName",
      "name",
    ].forEach((e) => {
      t[e] && l.add(String(t[e]));
    }),
    t.title)
  ) {
    const e = String(t.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    e && l.add(e);
  }
  if (!l.size)
    return void (detailContent.textContent =
      "No candidate resource id/filename fields found on catalog item");
  const i = (t) => {
      const n = [];
      return (
        [t].forEach((t) => {
          n.push({ url: `${e}/${a}/${t}/content.html`, kind: "html" });
        }),
        n
      );
    },
    r = [];
  for (const t of l)
    for (const e of i(t)) r.find((t) => t.url === e.url) || r.push(e);
  let s = null;
  for (const { url: t, kind: e } of r) {
    console.debug("Trying candidate:", t);
    try {
      const a = await fetch(t, { cache: "no-store" });
      a.status;
      if ((console.debug("Response for", t, a.status), a.ok)) {
        if ("html" === e) {
          s = { url: t, kind: e, content: await a.text() };
          break;
        }
        if ("json" === e)
          try {
            s = { url: t, kind: e, json: await a.json() };
            break;
          } catch (t) {
            row.appendChild(document.createTextNode(" (json parse failed)"));
          }
      }
    } catch (e) {
      console.debug("Fetch error for", t, e && e.message ? e.message : e);
    }
  }
  if (!s)
    return void (detailContent.innerHTML =
      '<div class="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">No detail resource found with the tried patterns. Review the attempts above for response codes.</div>');
  const d = document.createElement("div");
  d.className = "mt-3 text-sm text-slate-600";
  const c = document.createElement("span");
  c.textContent = `Found (${s.kind}): `;
  const m = document.createElement("a");
  if (
    ((m.href = s.url),
    (m.target = "_blank"),
    (m.rel = "noopener noreferrer"),
    (m.className =
      "font-medium text-indigo-600 underline decoration-indigo-300 transition hover:text-indigo-700"),
    (m.textContent = s.url),
    d.append(c, m),
    detailInfo.appendChild(d),
    "html" === s.kind)
  ) {
    const t = sanitizeHtml(s.content || "");
    detailContent.innerHTML = t;
  } else {
    const t = s.json;
    if (
      (t.title &&
        (detailInfo.innerHTML += `<div class="mt-2 text-sm text-slate-600">Title: ${escapeHtml(
          t.title
        )}</div>`),
      t.content)
    ) {
      const e = sanitizeHtml(t.content || "");
      detailContent.innerHTML = e;
    } else {
      const e = document.createElement("pre");
      (e.className =
        "max-h-[60vh] overflow-auto rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600"),
        (e.textContent = JSON.stringify(t, null, 2)),
        (detailContent.innerHTML = ""),
        detailContent.appendChild(e);
    }
  }
}
function escapeHtml(t) {
  return (t + "").replace(
    /[&<>"]/g,
    (t) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[t])
  );
}
function sanitizeHtml(t) {
  try {
    const e = new DOMParser().parseFromString(t, "text/html");
    return (
      e.querySelectorAll("script").forEach((t) => t.remove()),
      e.querySelectorAll("*").forEach((t) => {
        [...t.attributes].forEach((e) => {
          /^on/i.test(e.name) && t.removeAttribute(e.name);
        });
      }),
      e.body.innerHTML
    );
  } catch (e) {
    return t;
  }
}
LANGS.forEach((t) => {
  const e = document.createElement("option");
  (e.value = t), (e.textContent = t), langSelect.appendChild(e);
}),
  (langSelect.value = "en-us"),
  loadBtn.addEventListener("click", async () => {
    clearDetail(),
      setActiveCatalogItem(null),
      (catalogDiv.innerHTML =
        '<div class="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-sm">Loading catalog…</div>');
    const t = datasetSelect.value,
      e = langSelect.value,
      a = BASES[t],
      n = `${a}/${e}/catalog.json`,
      o = `${a}/${e}/textMap.json`;
    try {
      const [t, l] = await Promise.all([fetch(n), fetch(o)]);
      if (!t.ok) throw new Error("catalog fetch failed: " + t.status);
      if (!l.ok) throw new Error("textMap fetch failed: " + l.status);
      const i = await t.json();
      renderCatalog(i, await l.json(), a, e);
    } catch (t) {
      (catalogDiv.innerHTML = ""),
        showError(catalogDiv, `Failed to load catalog/textMap: ${t.message}`),
        console.error(t);
    }
  }),
  (datasetSelect.value = "knowledge");
