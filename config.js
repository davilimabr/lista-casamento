/* ==========================================================
   EDITE AQUI — todo o conteúdo do site vem deste arquivo.
   Fotos: coloque os arquivos na pasta /fotos com os nomes abaixo.
   ========================================================== */
window.CASAMENTO = {
  ele: "Davi",
  ela: "Marcelly",

  // Data e hora da cerimônia (formato ISO, com fuso de Brasília)
  data: "2027-03-23T16:00:00-03:00",
  dataExtenso: "Terça, 23 de março de 2027",

  // Data do noivado: início da "trajetória do sol" na contagem regressiva
  noivado: "2026-08-01T15:00:00-03:00",

  local: {
    nome: "Bistrô do Mato",
    endereco: "Estrada do Mato Alto, 1716 - Guaratiba, Rio de Janeiro - RJ",
    mapa: "https://www.google.com/maps/place/Bistr%C3%B4+do+Mato/@-22.947253,-43.577275,1045m/data=!3m2!1e3!4b1!4m6!3m5!1s0x9be5904ca5ffcd:0x9934a8cf79267b8b!8m2!3d-22.947253!4d-43.577275!16s%2Fg%2F11qbrrr4kd?entry=ttu&g_ep=EgoyMDI2MTAwNy4wIKXMDSoASAFQAw%3D%3D"
  },

  // Anotações "à mão" sobre as fotos (deixe "" para esconder)
  legendaHero: "a gente vai casar!",
  legendaFinal: "um brinde ao que vem aí",

  traje: "Esporte fino. Venha chique e confortável! ;)",

  // RSVP via WhatsApp: número com DDI + DDD, só dígitos
  whatsapp: "5521986099459",
  rsvpAte: "15 de abril de 2027",

  pix: {
    chave: "chave-pix@exemplo.com",
    titular: "Nome do Titular",
    banco: "Banco"
  },

  historia: [
    {
      titulo: "Como nos conhecemos",
      texto: "De um rolé cultural pelo Centro, com direito a visita no museu e café ao pôr do sol, floreceu uma cumplicidade que se fortaleceu com o tempo.",
      foto: "fotos/historia-1.jpg",
      legenda: "rolé cultural no Centro"
    },
    {
      titulo: "A vida a dois",
      texto: "Entre trilhas, praias, viagens e muitos fins de semana maratonando séries em casa, fomos descobrindo que tudo fica melhor junto.",
      foto: "fotos/historia-2.jpg",
      legenda: "sol, mar e a gente"
    },
    {
      titulo: "O pedido",
      texto: "Quando o peito não segurava mais o sentimento, veio o pedido. Um lugar especial, uma noite especial e memórias que ficarão para sempre.",
      foto: "fotos/historia-3.jpg",
      legenda: "o dia do pedido"
    }
  ],

  programacao: [
    { hora: "15:30", titulo: "Recepção", texto: "Chegada dos convidados." },
    { hora: "16:00", titulo: "Cartório", texto: "Cerimônia no cartório." },
    { hora: "17:30", titulo: "Comemoração", texto: "Jantar, brindes e fotos." }
  ],

  // O site separa os itens em dois grupos automaticamente:
  //   link: ""            -> "Presente em Pix" (a pessoa envia o valor do card)
  //   link: "https://..." -> "Lista de presentes" (comprar na loja ou mandar Pix do mesmo valor)
  // destaque: true deixa o item maior na lista
  presentes: [

    //pix
    { nome: "Livros para a estante", desc: "Para a nossa coleção continuar crescendo.", valor: 50, link: "" },
    { nome: "Café da manhã a dois", desc: "Para começar bem os primeiros dias de casados.", valor: 80, link: "" },
    { nome: "Noite de pizza e filme", desc: "Sofá, pipoca e a pizza favorita da gente.", valor: 100, link: "" },
    { nome: "Kit de piquenique", desc: "Para as tardes ao ar livre a dois.", valor: 250, link: "" },
    { nome: "Jantar na lua de mel", desc: "Uma noite especial durante a viagem.", valor: 500, link: "" },
    { nome: "Bate e volta na região dos lagos", desc: "Curtir uma praia em grande estilo.", valor: 1000, link: "" },
    
    { nome: "Air Fryer", desc: "", valor: 400, link: "https://loja.electrolux.com.br/air-fryer-electrolux-por-rita-lobo-7l-cinza-efficient-1700w-eaf71/p?idsku=310130875&skuId=310130875&region_id=1_3" },

    { nome: "Micro-ondas", desc: "", valor: 550, link: "https://www.amazon.com.br/Micro-ondas-Bancada-Electrolux-Efficient-ME23S/dp/B0B8P3T3VM/ref=asc_df_B0B8P3T3VM?mcid=1afd954c0e6d3fc49a1901a58f8aed01&hvadid=709864975911&hvpos=&hvnetw=g&hvrand=14915989133397014792&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9100840&hvtargid=pla-1930383194608&hvocijid=14915989133397014792-B0B8P3T3VM-&hvexpln=0&language=pt_BR"},

    { nome: "Sofá cama", desc: "", valor: 4700, link: "https://www.madeiramadeira.com.br/sofa-cama-modular-3-lugares-organico-210cm-base-madeira-macica-cancun-502169359.html?index=search-web&seller=1", destaque: true },
    { nome: "Jogo de Xícaras", desc: "", valor: 234, link: "https://www.westwing.com.br/p/jogo-de-xicaras-para-cha-bio-raio-geometrico/PO719CP78PORWW-1955259.html" },
    { nome: "Rack sala", desc: "", valor: 980, link: "https://www.madeiramadeira.com.br/rack-retro-para-tv-ate-85-polegadas-100-mdf-220cm-2-gavetas-marrom-pinhao-140636318.html?origem=pla-140636318&utm_term=", destaque: true },
    { nome: "Mesa de jantar", desc: "", valor: 2050, link: "https://www.madeiramadeira.com.br/conjunto-mesa-de-jantar-redonda-4-cadeiras-estofadas-encosto-tela-100-mdf-pinhao-bege-rustico-dal-398058436.html?index=search-web&seller=21322", destaque: true },
    { nome: "Tapete sala", desc: "", valor: 450, link: "https://www.madeiramadeira.com.br/tapete-sala-escritorio-sisal-antiderrapante-2-50-x-2-00-s478-2521118.html",  },
    { nome: "Luminária Pendente de Banbu", desc: "", valor: 550, link: "https://casainno.com.br/products/luminaria-pendente-bambu-luz-do-campo?currency=BRL&country=BR&variant=48087233560809&stkn=e20611bca2b0", },
    // { nome: "Sofá cama", desc: "", valor: 4700, link: "", destaque: true },
    // { nome: "Sofá cama", desc: "", valor: 4700, link: "", destaque: true },
    // { nome: "Sofá cama", desc: "", valor: 4700, link: "", destaque: true },
    // { nome: "Sofá cama", desc: "", valor: 4700, link: "", destaque: true },
    // { nome: "Sofá cama", desc: "", valor: 4700, link: "", destaque: true },
  ]
};
