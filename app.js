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
  document.title = `${C.ele} & ${C.ela} · ${C.dataCurta}`;

  const get = (path) => path.split(".").reduce((o, k) => (o ? o[k] : ""), C);
  $$("[data-c]").forEach((el) => (el.textContent = get(el.dataset.c)));
  $("#mapLink").href = C.local.mapa;

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
        <figure class="ph chapter__photo" data-label="${esc(h.foto)}">
          <img src="${esc(h.foto)}" alt="${esc(h.titulo)}" loading="lazy" onerror="this.remove()">
        </figure>
        <div class="chapter__text">
          <p class="chapter__num">${pad(n + 1)}</p>
          <h3>${esc(h.titulo)}</h3>
          <p>${esc(h.texto)}</p>
        </div>
      </article>`
    )
    .join("");

  /* ---------- programação ---------- */
  $("#schedule").innerHTML = C.programacao
    .map(
      (p) => `
      <li class="day__row reveal">
        <span class="day__time">${esc(p.hora)}</span>
        <span class="day__title">${esc(p.titulo)}</span>
        <span class="day__desc">${esc(p.texto)}</span>
      </li>`
    )
    .join("");

  /* ---------- presentes: sem link = Pix, com link = loja ---------- */
  // Pix abre o modal com a chave; loja leva direto para o site do produto
  const giftCard = (g, n, i) => {
    const abre = g.link
      ? `<a class="gift__card" href="${esc(g.link)}" target="_blank" rel="noopener">`
      : `<button class="gift__card" type="button" data-gift="${i}">`;
    return `
      <li class="gift${g.destaque ? " gift--destaque" : ""} reveal">
        ${abre}
          <span class="gift__tag">${pad(n + 1)}</span>
          <span>
            <span class="gift__name">${esc(g.nome)}</span>
            <span class="gift__desc">${esc(g.desc)}</span>
          </span>
          <span class="gift__foot">
            <span class="gift__price">${brl(g.valor)}</span>
            <span class="gift__go${g.link ? " gift__go--ext" : ""}">${g.link ? "Ir para a loja" : "Enviar Pix"}</span>
          </span>
        ${g.link ? "</a>" : "</button>"}
      </li>`;
  };
  const comIndice = C.presentes.map((g, i) => ({ g, i }));
  [["#giftsPix", "#groupPix", (g) => !g.link], ["#giftsStore", "#groupStore", (g) => !!g.link]].forEach(([list, group, filtro]) => {
    const itens = comIndice.filter(({ g }) => filtro(g));
    $(group).hidden = !itens.length;
    $(list).innerHTML = itens.map(({ g, i }, n) => giftCard(g, n, i)).join("");
  });

  /* ---------- modal Pix ---------- */
  const modal = $("#giftModal");
  $("#pixKey").textContent = C.pix.chave;

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-gift]");
    if (!btn) return;
    const id = btn.dataset.gift;
    const card = btn.closest(".gift");
    modal.style.setProperty("--rc", card ? getComputedStyle(card).getPropertyValue("--rc") : "var(--ouro)");
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
