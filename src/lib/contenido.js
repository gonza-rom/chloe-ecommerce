// src/lib/contenido.js
// Contenido editable (textos + medios) del Home, Nosotros y Contacto.
// Los valores acá son el fallback que se usa mientras no haya nada guardado
// en la tabla ContenidoSitio (o para los campos que falten).

export const DEFAULT_HOME = {
  hero: {
    kicker: 'Archive Editions — Autumn Winter ´26',
    titulo: 'CITY\nICONS',
    subtitulo: 'Prendas que definen una ciudad. Diseñadas para mujeres que escriben su propio relato.',
    ctaLabel: 'Shop Collection',
    slides: [
      { label: 'Ciudad + Noche', nombre: 'Vestido Midi Ring', imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSHQOz5rQcqVMrPcxeg6ii1afPxh3ShCcXMCf65nqg9CpirkkKF_SRjn9a-puDq5co-kfjeOpRYBclk01nU1vu4AuiXwjl5lYTvV_yKTiNz3uVRq5DxAbIEn_xgpUc6vKc260KtQQ73IYGTFBZEFpWEi4gskTOPPUSJ7CAecOp4RDFeOHeKh3AWu9TeTfWwbhHV3LcicS6UMlOb6ct7OEZ_zRVII0OryxebmtUZCw7JElNNLN4EzCX6IbPdKsocvtr7Njpg1MrueE' },
      { label: 'Favorito de Temporada', nombre: 'Cardigan Ruffled Chocolate', imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvODIMhnLTK8WyS9NHgRRr3AAdzMAROuCq8GOt1IS90MZUtRb66_NCsLVE-9pTnKb-yb9zq6yObQ7kOlFRlEozxY5Epy7ilMhkNdwcXTQYlSCxPEw3QuHlkv0O7JAdF-5n8xQZk9vw3mhmWobc0MW2rBsPwr7_utQgaY3ZpU7tzFyHZ39D2_IePASGdNSdwxFsfykP8xlTB3CoxZiNhr7y737Qsu3oUMZ1c0f3EEySt4ZPtFsdaqY88p5Tit_lEbpoAx0JlNpbqHc' },
      { label: 'Color del Momento', nombre: 'Vestido Tiedye Dusk', imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-0QALhph06IyvtmPjACcKg65PrnHmLdu8y9ZupkSO-gf1D1AR6csd6g0AZyr5h3L8pfBDORsljN3cbBpgLYaJ-u_cUirYFfiIbocYlfj23MHlNZP5BtpsSk97mi-eIeeKa_lmMLhmCfsT3K1HGKkb75ukIEoZ7HAJi32cQVH266ZAWC66ts9X_J8fQYRNvZwl0ofPL8MOcCTl6awYTbW6aVphMTUKdXH6644J3v5HD0fa18sO5EmM7kgHXX09mi_XpJVNAIcXMwQ' },
      { label: 'Iconic Edition', nombre: 'Vestido Cutout Iconic', imagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuI5L75cqM4NNPu-LQaHSd_Tj8J343xrpzLkximBtMZR2W7iiqS1RWbCShrFIOkjXOXPArQM6BuxnGrLXDq0m4IjBRzf0lGvjfVYA67EHu084kyVlghYG7er1CTWmDzyhSxY8ysc457YENylvgy-23cNeSu03ZGzIpcAcOQW4uQ65vixdE-wMMHXAgYs_MBn1oBqXaIRsXt-wxo43cIG_3tUVtwr9rEVB8JhhwnSuZYu88_SzZ542f-XDxNfJx8Kjfc7Rn7b8O8KQ' },
    ],
  },
  valueProps: [
    { icon: 'payments', titulo: '20% OFF', desc: 'Abonando con transferencia bancaria' },
    { icon: 'credit_card', titulo: '3 & 6 CUOTAS', desc: 'Sin interés con todas las tarjetas' },
    { icon: 'local_shipping', titulo: 'ENVÍOS A TODO EL PAÍS', desc: 'Llegamos a cada rincón de Argentina' },
  ],
  shopTheLook: {
    titulo: 'SHOP THE LOOK',
    subtitulo: 'Mirá nuestras prendas en movimiento',
    videos: [
      { src: '/video.mp4', label: 'Look 01' },
      { src: '/video2.mp4', label: 'Look 02' },
      { src: '/video3.mp4', label: 'Look 03' },
      { src: '/video4.mp4', label: 'Look 04' },
    ],
  },
  favs: {
    titulo: 'FAVS ⋆˙⟡',
    subtitulo: 'Nuestros artículos más deseados de la temporada.',
  },
  night: {
    kicker: 'The After Hours Edit',
    titulo: 'NIGHT COLLECTION',
    ctaLabel: 'Ver Night Collection',
  },
  archive: {
    titulo: '⟡˙⋆ archive editions ⋆˙⟡',
    ctaLabel: 'Ver Archive Editions',
  },
  mediosDePago: {
    titulo: 'MEDIOS DE PAGO',
  },
};

export const DEFAULT_NOSOTROS = {
  hero: {
    kicker: 'Catamarca, Argentina — Desde el primer día',
    titulo: 'NOSOTROS.',
    subtitulo: 'Una boutique pensada para la mujer que transita la ciudad con confianza, estilo y autenticidad.',
  },
  stats: [
    { num: '3+', label: 'Años en Catamarca' },
    { num: '3', label: 'Colecciones Activas' },
    { num: '∞', label: 'Envíos a todo el país' },
    { num: '★', label: 'Atención Personalizada' },
  ],
  historia: {
    kicker: 'Nuestra Historia',
    titulo: 'La Boutique',
    parrafos: [
      'Situada en el corazón de San Fernando del Valle de Catamarca, Alpatauca 870 no es solo una dirección — es el refugio de la mujer moderna.',
      'En Chloe Showroom creemos que el estilo Urban Chic y la sofisticación Preppy no son opuestos, sino complementos de una identidad versátil y auténtica.',
      'Nuestra historia comenzó con la visión de curar prendas que hablen de calidad, durabilidad y tendencia. Cada pieza fue seleccionada personalmente, pensando en la mujer que transita la ciudad con confianza y elegancia.',
    ],
    imagen: 'https://lh3.googleusercontent.com/aida/ADBb0uj-xNipEI3TX-LtSWJ0hWIsTIeKr7EZ2k72YI0pE1fUbck3TENSwYa-8awYoEwG4GtsVEGvPj76_tp8VbJasEQ0hwfPfUr86M_UqEWdswVH4iCpc1PViFtYk7E6EA4yJA40_iJCpJ9ZM_pppYkRCDfg5FWGj5eJZtn9i1o4y2g4wi8Y_93raOscXNCC5lqndrigEIi2c7tFqgqS_dWBuQ9L2MicShZwnPJxtMLHe9HSkeozg2RMIp6lymQ',
  },
  pilares: [
    { icon: 'gallery_thumbnail', titulo: 'Curaduría Exclusiva', texto: 'No traemos cantidades, traemos calidad. Cada prenda es una pieza elegida bajo los estándares más altos del Urban Chic. Tu próximo favorito ya nos está esperando.' },
    { icon: 'star_rate', titulo: 'Preppy Moderno', texto: 'Reinterpretamos los clásicos. Siluetas estructuradas y tejidos premium que definen un look atemporal pero siempre vigente, adaptado a la mujer de hoy.' },
    { icon: 'local_shipping', titulo: 'Alcance Nacional', texto: 'Desde Catamarca para todo el país. Enviamos con cuidado cada detalle del packaging para que tu experiencia sea premium de principio a fin.' },
  ],
  cta: {
    kicker: 'Vení a vernos',
    titulo: 'Visitanos en\nel Showroom',
    subtitulo: 'Nuestro espacio está diseñado para que te sientas en casa mientras descubrís tu próximo look favorito.',
  },
};

export const DEFAULT_CONTACTO = {
  hero: {
    kicker: 'Chloe Showroom — Catamarca, Argentina',
    titulo: 'Hablemos.',
    subtitulo: 'Estamos para ayudarte con consultas de pedidos, tallas, envíos o simplemente para coordinar tu visita al showroom.',
    badge: 'Realizamos envíos a todo el país',
  },
  horarios: [
    { dia: 'Lunes a Viernes', hora: '18:00 – 22:00 hs' },
    { dia: 'Sábados (Mañana)', hora: '10:00 – 13:00 hs' },
    { dia: 'Sábados (Tarde/Noche)', hora: '18:00 – 22:00 hs' },
  ],
  showroom: {
    kicker: 'Nuestro Showroom',
    direccion: 'Alpatauca 870,\nSan Fernando del Valle\nde Catamarca',
  },
};

export const DEFAULTS_POR_PAGINA = {
  home:     DEFAULT_HOME,
  nosotros: DEFAULT_NOSOTROS,
  contacto: DEFAULT_CONTACTO,
};

// Combina el contenido guardado con los valores por defecto: objetos se
// mezclan recursivamente, arrays y valores simples se reemplazan enteros
// cuando hay algo cargado (así evitamos "Frankenstein" de mitad default,
// mitad guardado, en listas como slides o pilares).
export function mergeContenido(defaults, override) {
  if (override == null || typeof override !== 'object') return defaults;

  const resultado = Array.isArray(defaults) ? [...defaults] : { ...defaults };

  for (const key of Object.keys(defaults)) {
    const valorDefault  = defaults[key];
    const valorGuardado = override[key];

    if (valorGuardado === undefined || valorGuardado === null) continue;

    if (Array.isArray(valorDefault)) {
      resultado[key] = Array.isArray(valorGuardado) && valorGuardado.length > 0
        ? valorGuardado
        : valorDefault;
    } else if (valorDefault !== null && typeof valorDefault === 'object') {
      resultado[key] = mergeContenido(valorDefault, valorGuardado);
    } else {
      resultado[key] = valorGuardado !== '' ? valorGuardado : valorDefault;
    }
  }

  return resultado;
}
