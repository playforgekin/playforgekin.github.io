// Forgekin wiki -- istemci tarafi arama. Harici kutuphane YOK.
// Veri: ayni klasordeki ara_veri.js -> window.WIKI_ARA = [[ad, adres, tur, ikon], ...]
(function () {
  function sade(s) {
    return (s || "").toLocaleLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/ı/g, "i");
  }
  // r = [ad, adres, tur, ikon, ek metin (aciklama/rehber/esanlam)]
  var veri = (window.WIKI_ARA || []).map(function (r) { return { r: r, k: sade(r[0]), x: sade(r[4] || "") }; });
  var kutu = document.getElementById("ara-kutu");
  var liste = document.getElementById("ara-sonuc");
  if (!kutu || !liste) return;
  var secili = -1;

  function ciz(q) {
    liste.innerHTML = "";
    secili = -1;
    q = sade(q.trim());
    if (q.length < 2) return;
    var parca = q.split(/\s+/);
    var bulunan = [];
    for (var i = 0; i < veri.length && bulunan.length < 400; i++) {
      var v = veri[i], adda = true, her = true;
      for (var j = 0; j < parca.length; j++) {
        if (v.k.indexOf(parca[j]) < 0) adda = false;
        if (v.k.indexOf(parca[j]) < 0 && v.x.indexOf(parca[j]) < 0) { her = false; break; }
      }
      if (her) { v.p = adda ? 0 : 2; bulunan.push(v); }
    }
    bulunan.sort(function (a, b) {
      var ab = a.p + (a.k.indexOf(q) === 0 ? 0 : 1), bb = b.p + (b.k.indexOf(q) === 0 ? 0 : 1);
      return ab - bb || a.k.length - b.k.length;
    });
    bulunan.slice(0, 40).forEach(function (v) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = v.r[1];
      if (v.r[3]) {
        var img = document.createElement("img");
        img.src = v.r[3]; img.alt = ""; img.loading = "lazy";
        a.appendChild(img);
      }
      a.appendChild(document.createTextNode(v.r[0]));
      var s = document.createElement("small");
      s.textContent = v.r[2];
      a.appendChild(s);
      li.appendChild(a);
      liste.appendChild(li);
    });
  }
  function isaretle(n) {
    var a = liste.querySelectorAll("a");
    if (!a.length) return;
    if (secili >= 0 && a[secili]) a[secili].classList.remove("secili");
    secili = (n + a.length) % a.length;
    a[secili].classList.add("secili");
    a[secili].scrollIntoView({ block: "nearest" });
  }
  kutu.addEventListener("input", function () { ciz(kutu.value); });
  kutu.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { isaretle(secili + 1); e.preventDefault(); }
    else if (e.key === "ArrowUp") { isaretle(secili - 1); e.preventDefault(); }
    else if (e.key === "Enter") {
      var a = liste.querySelectorAll("a");
      var hedef = a[secili >= 0 ? secili : 0];
      if (hedef) location.href = hedef.href;
    } else if (e.key === "Escape") { kutu.value = ""; ciz(""); }
  });
})();

// Esya ailesi suzgeci: kademe + sinif (data-tier / data-sinif). Sinifi bos esya herkese.
(function () {
  var kutu = document.getElementById("suzgec");
  if (!kutu) return;
  var secim = { tier: "", sinif: "" };
  function uygula() {
    document.querySelectorAll("article.esya").forEach(function (a) {
      var t = !secim.tier || a.getAttribute("data-tier") === secim.tier;
      var sn = a.getAttribute("data-sinif") || "";
      var s = !secim.sinif || !sn || (" " + sn + " ").indexOf(" " + secim.sinif + " ") >= 0;
      a.style.display = t && s ? "" : "none";
    });
    kutu.querySelectorAll("button").forEach(function (b) {
      var tur = b.hasAttribute("data-tier") ? "tier" : "sinif";
      b.classList.toggle("etkin", (b.getAttribute("data-" + tur) || "") === secim[tur]);
    });
  }
  kutu.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    var tur = b.hasAttribute("data-tier") ? "tier" : "sinif";
    secim[tur] = b.getAttribute("data-" + tur) || "";
    uygula();
  });
  uygula();
})();
