(function () {
  const C = window.CASAMENTO;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  document.documentElement.classList.add("js");

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const data = new Date(C.data);
  const pad = (n, l = 2) => String(n).padStart(l, "0");
  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- valores derivados + textos ---------- */
  C.iniciais = `${C.ele[0]}&${C.ela[0]}`;
  C.dataCurta = `${pad(data.getDate())}.${pad(data.getMonth() + 1)}.${data.getFullYear()}`;
  C.hora = `${pad(data.getHours())}h${pad(data.getMinutes())}`;
  C.nomes = `${C.ele} & ${C.ela}`;
  document.title = `${C.nomes} · ${C.dataCurta}`;

  const get = (path) => path.split(".").reduce((o, k) => (o ? o[k] : ""), C);
  $$("[data-c]").forEach((el) => {
    el.textContent = get(el.dataset.c) || "";
    if (!el.textContent && el.matches("figcaption")) el.hidden = true;
  });
  $("#mapLink").href = C.local.mapa;

  // selo giratório do hero
  $("#sealText").textContent = `${C.nomes} · ${C.dataCurta} · Rio de Janeiro · `.toUpperCase();

  // mini-sol: um horizonte com o sol na altura de um horário (põe-se ~18h)
  const miniSun = (t, cls = "") => {
    const y = 30 - t * 22;
    return `<svg class="minisun ${cls}" viewBox="0 0 64 36" aria-hidden="true" style="--t:${t.toFixed(2)}">
      <clipPath id="ms${(t * 100) | 0}"><rect width="64" height="30"/></clipPath>
      <circle cx="32" cy="${y.toFixed(1)}" r="9" clip-path="url(#ms${(t * 100) | 0})"/>
      <line x1="6" y1="30.5" x2="58" y2="30.5"/><line x1="16" y1="34.5" x2="48" y2="34.5"/>
    </svg>`;
  };

  // nomes do hero letra por letra (para a animação de entrada)
  let i = 0;
  $$("[data-split]").forEach((el) => {
    const txt = el.textContent;
    el.innerHTML =
      `<span class="sr">${esc(txt)}</span>` +
      [...txt].map((ch) => `<span class="ch" aria-hidden="true" style="--i:${i++}">${ch === " " ? "&nbsp;" : esc(ch)}</span>`).join("");
  });

  /* ---------- história ---------- */
  $("#story").innerHTML = C.historia
    .map(
      (h, n) => `
      <article class="chapter reveal">
        <figure class="print chapter__print">
          <div class="ph print__img" data-label="${esc(h.foto)}">
            <img src="${esc(h.foto)}" alt="${esc(h.titulo)}" loading="lazy" onerror="this.remove()">
          </div>
          ${h.legenda ? `<figcaption class="print__cap">${esc(h.legenda)}</figcaption>` : ""}
        </figure>
        <div class="chapter__text">
          <p class="chapter__num" aria-hidden="true">${pad(n + 1)}</p>
          <h3>${esc(h.titulo)}</h3>
          <p>${esc(h.texto)}</p>
        </div>
      </article>`
    )
    .join("");

  /* ---------- programação ---------- */
  // o sol vai baixando ao longo da programação
  const sunAt = (hora) => {
    const [hh, mm] = hora.split(":").map(Number);
    return Math.min(1, Math.max(0.06, (18 - (hh + (mm || 0) / 60)) / 3));
  };
  $("#schedule").innerHTML = C.programacao
    .map(
      (p) => `
      <li class="day__row reveal">
        <span class="day__time">${esc(p.hora)}</span>
        ${miniSun(sunAt(p.hora), "day__sun")}
        <span class="day__title">${esc(p.titulo)}</span>
        <span class="day__desc">${esc(p.texto)}</span>
      </li>`
    )
    .join("");

  /* ---------- presentes: sem link = Pix, com link = loja ---------- */
  // Pix abre o modal com a chave; loja leva direto para o site do produto
  // inclinação "de mão": determinística por posição, para não pular a cada visita
  const tilt = (n) => [-2.2, 1.6, -1, 2.4, -1.8, 0.8][n % 6];
  const reais = (v) => brl(v).replace(/\s/g, " ");

  // Pix = selo postal (o sol sobe conforme o valor)
  const stamp = (g, n, i, total) => `
      <li class="stamp-wrap${g.destaque ? " is-destaque" : ""} reveal" style="--tilt:${tilt(n)}deg">
        <button class="stamp" type="button" data-gift="${i}">
          <span class="stamp__inner">
            <span class="stamp__top">
              <span class="stamp__val">${reais(g.valor)}</span>
              <span class="stamp__no">Nº ${pad(n + 1)}</span>
            </span>
            ${miniSun(total > 1 ? 0.15 + (0.8 * n) / (total - 1) : 0.6, "stamp__sun")}
            <span class="stamp__name">${esc(g.nome)}</span>
            ${g.desc ? `<span class="stamp__desc">${esc(g.desc)}</span>` : ""}
            <span class="stamp__foot">Correio dos noivos · Pix</span>
          </span>
          <span class="postmark" aria-hidden="true">
            <svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="44"/><circle cx="60" cy="60" r="34"/>
              <path d="M-10 46 q15 -8 30 0 t30 0 t30 0 t30 0 t30 0 M-10 60 q15 -8 30 0 t30 0 t30 0 t30 0 t30 0 M-10 74 q15 -8 30 0 t30 0 t30 0 t30 0 t30 0"/>
              <text x="60" y="64" text-anchor="middle">ENVIAR PIX</text></svg>
          </span>
        </button>
      </li>`;

  // loja = etiqueta de preço pendurada
  const tag = (g, n) => `
      <li class="tag-wrap${g.destaque ? " is-destaque" : ""} reveal" style="--tilt:${tilt(n + 1) * 0.8}deg">
        <a class="tag" href="${esc(g.link)}" target="_blank" rel="noopener">
          <span class="tag__no">${pad(n + 1)}</span>
          <span class="tag__name">${esc(g.nome)}</span>
          ${g.desc ? `<span class="tag__desc">${esc(g.desc)}</span>` : ""}
          <span class="tag__foot">
            <span class="tag__price">${reais(g.valor)}</span>
            <span class="tag__go">Ver na loja <span aria-hidden="true">↗</span></span>
          </span>
        </a>
      </li>`;

  const comIndice = C.presentes.map((g, i) => ({ g, i }));
  const pix = comIndice.filter(({ g }) => !g.link);
  const loja = comIndice.filter(({ g }) => !!g.link);
  $("#groupPix").hidden = !pix.length;
  $("#groupStore").hidden = !loja.length;
  $("#giftsPix").innerHTML = pix.map(({ g, i }, n) => stamp(g, n, i, pix.length)).join("");
  $("#giftsStore").innerHTML = loja.map(({ g }, n) => tag(g, n)).join("");

  /* ---------- modal Pix ---------- */
  const modal = $("#giftModal");
  $("#pixKey").textContent = C.pix.chave;

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-gift]");
    if (!btn) return;
    const id = btn.dataset.gift;
    modal.style.setProperty("--rc", getComputedStyle(btn).getPropertyValue("--paper") || "var(--ouro)");
    const g = C.presentes[id];
    $("#modalTitle").textContent = g.nome;
    $("#modalValue").textContent = brl(g.valor);
    $("#modalValueHint").textContent = ` de ${brl(g.valor)}`;
    $("#copyPix").textContent = "Copiar";
    modal.showModal();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });

  $("#copyPix").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(C.pix.chave);
    } catch {
      const r = document.createRange();
      r.selectNodeContents($("#pixKey"));
      getSelection().removeAllRanges();
      getSelection().addRange(r);
      document.execCommand("copy");
    }
    $("#copyPix").textContent = "Copiado ✓";
  });

  /* ---------- contagem: frase ---------- */
  const units = { d: $('[data-u="d"]'), h: $('[data-u="h"]'), m: $('[data-u="m"]'), s: $('[data-u="s"]') };
  const words = { d: ["dia", "dias"], h: ["hora", "horas"], m: ["minuto", "minutos"], s: ["segundo", "segundos"] };
  function tick() {
    let diff = Math.max(0, data - Date.now());
    if (!diff) {
      $("#countPhrase").innerHTML = "Hoje é o <em>nosso dia</em>.";
      return clearInterval(timer);
    }
    const v = {};
    v.d = Math.floor(diff / 864e5); diff -= v.d * 864e5;
    v.h = Math.floor(diff / 36e5); diff -= v.h * 36e5;
    v.m = Math.floor(diff / 6e4); diff -= v.m * 6e4;
    v.s = Math.floor(diff / 1e3);
    for (const k in units) {
      units[k].textContent = k === "s" ? pad(v.s) : v[k];
      $(`[data-w="${k}"]`).textContent = words[k][v[k] === 1 ? 0 : 1];
    }
    $('[data-w="faltam"]').textContent = v.d === 1 ? "Falta" : "Faltam";
  }
  const timer = setInterval(tick, 1000);
  tick();

  /* ---------- contagem: trajetória do sol (noivado → casamento) ---------- */
  const inicio = new Date(C.noivado);
  const prog = Math.min(1, Math.max(0, (Date.now() - inicio) / (data - inicio))) || 0;
  $("#arcStart").textContent = `${pad(inicio.getDate())}.${pad(inicio.getMonth() + 1)}.${inicio.getFullYear()}`;
  $("#arcPct").textContent = `${Math.round(prog * 100)}% do caminho`;

  function placeSun(t) {
    const a = Math.PI * (1 - t);
    $("#arcSun").setAttribute("transform", `translate(${(500 + 460 * Math.cos(a)).toFixed(1)} ${(500 - 460 * Math.sin(a)).toFixed(1)})`);
    $("#arcDone").style.strokeDashoffset = 100 - t * 100;
  }
  if (reduced) placeSun(prog);
  else {
    placeSun(0);
    new IntersectionObserver(([en], obs) => {
      if (!en.isIntersecting) return;
      obs.disconnect();
      $(".arc").classList.add("is-on");
      const t0 = performance.now(), dur = 2600;
      const step = (now) => {
        const k = Math.min(1, (now - t0) / dur);
        placeSun(prog * (1 - Math.pow(1 - k, 4)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 }).observe($(".arc"));
  }

  /* ---------- RSVP via WhatsApp ---------- */
  const form = $("#rsvpForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = form.nome.value.trim();
    if (!nome) {
      form.nome.setAttribute("aria-invalid", "true");
      $("#formErr").textContent = "Por favor, preencha seu nome.";
      form.nome.focus();
      return;
    }
    form.nome.removeAttribute("aria-invalid");
    $("#formErr").textContent = "";

    const vai = form.vai.value === "sim";
    const linhas = vai
      ? [`Oi, ${C.ele} e ${C.ela}! Confirmo minha presença no casamento.`, `Nome: ${nome}`]
      : [`Oi, ${C.ele} e ${C.ela}! Infelizmente não poderei ir ao casamento.`, `Nome: ${nome}`];
    if (form.msg.value.trim()) linhas.push(`Mensagem: ${form.msg.value.trim()}`);

    window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(linhas.join("\n"))}`, "_blank", "noopener");
  });

  /* ---------- reveal no scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    }),
    { rootMargin: "0px 0px -10% 0px" }
  );
  $$(".reveal, .sec-head").forEach((el) => { el.classList.add("reveal"); io.observe(el); });

  if (reduced) return;

  /* ==========================================================
     Hero vivo: parallax (mouse + scroll) e partículas de luz
     ========================================================== */
  const hero = $(".hero");
  const layers = $$(".hero .par").map((el) => ({
    el,
    depth: parseFloat(el.dataset.depth || 0),
    scroll: parseFloat(el.dataset.scroll || 0)
  }));
  const pointer = { x: 0, y: 0 };
  const smooth = { x: 0, y: 0 };
  let heroVisible = true;

  if (matchMedia("(hover: hover)").matches) {
    addEventListener("pointermove", (e) => {
      pointer.x = e.clientX / innerWidth - 0.5;
      pointer.y = e.clientY / innerHeight - 0.5;
    });
  }
  new IntersectionObserver(([en]) => (heroVisible = en.isIntersecting)).observe(hero);

  // partículas: poeira dourada flutuando na luz
  const cv = $("#dust");
  const ctx = cv.getContext("2d");
  let W, H, dpr, motes = [];
  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = hero.offsetWidth; H = hero.offsetHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(90, (W * H) / 16000));
    motes = Array.from({ length: n }, () => newMote(true));
  }
  function newMote(anywhere) {
    return {
      x: Math.random() * W,
      y: anywhere ? Math.random() * H : H + 10,
      r: 0.6 + Math.random() * 2.2,
      vy: 0.12 + Math.random() * 0.35,
      sway: 0.3 + Math.random() * 0.8,
      ph: Math.random() * Math.PI * 2,
      tw: 0.004 + Math.random() * 0.01,
      z: 0.3 + Math.random() * 0.7
    };
  }
  resize();
  addEventListener("resize", resize);

  function frame() {
    requestAnimationFrame(frame);
    if (!heroVisible) return;

    smooth.x += (pointer.x - smooth.x) * 0.06;
    smooth.y += (pointer.y - smooth.y) * 0.06;
    const sy = scrollY;
    for (const L of layers) {
      L.el.style.setProperty("--tx", `${(smooth.x * L.depth).toFixed(2)}px`);
      L.el.style.setProperty("--ty", `${(smooth.y * L.depth + sy * L.scroll).toFixed(2)}px`);
    }

    ctx.clearRect(0, 0, W, H);
    for (const m of motes) {
      m.y -= m.vy;
      m.ph += m.tw;
      const x = m.x + Math.sin(m.ph * 3) * 12 * m.sway - smooth.x * 30 * m.z;
      const y = m.y - smooth.y * 30 * m.z;
      const a = 0.25 + 0.6 * Math.abs(Math.sin(m.ph * 2));
      const g = ctx.createRadialGradient(x, y, 0, x, y, m.r * 3);
      g.addColorStop(0, `rgba(214, 168, 76, ${a})`);
      g.addColorStop(1, "rgba(201, 160, 78, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, m.r * 3, 0, Math.PI * 2);
      ctx.fill();
      if (m.y < -10) Object.assign(m, newMote(false));
    }
  }
  requestAnimationFrame(frame);
})();
