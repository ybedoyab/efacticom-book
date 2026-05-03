/**
 * EFACTICOM — Datos y contenido (única fuente de verdad para textos y mocks).
 * Reemplazar textos aquí sin tocar el HTML salvo estructura mínima.
 */
(function () {
  "use strict";

  /** @type {EFACTICOMData} */
  window.EFACTICOM_DATA = {
    meta: {
      title: "EFACTICOM — Cartilla digital",
      year: "2026",
    },

    assets: {
      /** Diagrama de clústeres (imagen fuente del modelo). Debe coincidir con un archivo en /assets/img/. */
      clusterDiagramJpg: "assets/img/clusteres-diagram.jpg",
      /** Tabla detallada de variables (documento fuente). */
      variablesTablePdf: "assets/variables en tabla.pdf",
      logoEfacticomWordmark: "assets/logos/efacticom-white.png",
      logoIn3: "assets/logos/in3-iso.png",
      /* IN3 variante texto (solo pie de documento en index.html) */
      logoIn3Texto: "assets/logos/in3-texto.png",
      // TODO(asset): Logos extraídos del PPT; revisar cuál corresponde a marca EFACTICOM y renombrar.
      logosFromPpt: [
        "assets/logos/image1.png",
        "assets/logos/image2.png",
        "assets/logos/image3.png",
        "assets/logos/image4.png",
        "assets/logos/image5.png",
        "assets/logos/image6.png",
        "assets/logos/image7.png",
        "assets/logos/image8.png",
        "assets/logos/image9.png",
        "assets/logos/image10.png",
        "assets/logos/image11.png",
        "assets/logos/image12.png",
      ],
      // TODO(asset): Logo oficial Ministerio de Ciencia, Tecnología e Innovación (Minciencias).
      logoMinciencias: null,
      clusterTableScreenshot: "assets/img/clusteres-table.jpg",
    },

    hero: {
      headline:
        "<em>EFACTICOM</em>: analítica transdisciplinar de la<br />productividad empresarial",
      headlineAlt: [
        "EFACTICOM: de la evidencia estructural al pronóstico con machine learning",
        "EFACTICOM: medir la productividad con rigor científico y visión organizacional",
      ],
      subline:
        "Medición integral de la productividad articulando Academia, Empresa y Estado.",
      badge: "Innovación · Productividad · Analítica",
      ctaExplore: { label: "Explorar cartilla", href: "#acerca-intro" },
      ctaPdf: { label: "Descargar PDF", action: "print" },
      /**
       * Una sola imagen de fondo para el hero (pantalla completa dentro de la hoja A4).
       * TODO(asset): Sustituir por fotografía oficial o banco propio (licencia).
       */
      coverImage: {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1920&q=85",
        alt: "Analítica y visualización de datos en contexto empresarial",
      },
    },

    /**
     * Navegación: anclas en index.html (documento único con scroll).
     * En /pages/*.html, ui.js enlaza a ../index.html#…
     */
    nav: [
      { slug: "portada", label: "Portada", hash: "#hero" },
      { slug: "contenido", label: "Contenido", hash: "#contenido" },
      { slug: "acerca", label: "Acerca del software", hash: "#acerca-intro" },
      { slug: "contexto", label: "Contexto", hash: "#contexto" },
      { slug: "resultados", label: "Resultados", hash: "#resultados" },
      { slug: "cierre", label: "Cierre", hash: "#cierre" },
    ],

    /** Tabla de contenidos (pestaña editorial). Números de página orientativos. */
    toc: {
      watermark: "CONTENIDO",
      docTitle: "EFACTICOM · CARTILLA DIGITAL",
      intro:
        "Índice general de la publicación: propósito del software, contexto de desarrollo, resultados analíticos y cierre institucional.",
      lead: [
        { page: "1", label: "Portada", hash: "#hero" },
        { page: "2", label: "Tabla de contenidos", hash: "#contenido" },
      ],
      columns: {
        left: [
          {
            sectionNum: "01",
            title: "Acerca del software",
            accent: "lime",
            startPage: "3",
            anchor: "#acerca-intro",
            items: [
              { page: "1", label: "1. Introducción", hash: "#acerca-intro" },
              {
                page: "2",
                label: "2. Conglomerado de variables",
                hash: "#acerca-conglomerado-title",
              },
              {
                page: "3",
                label: "3. Clústeres para un modelo de medición de la productividad",
                hash: "#acerca-clusters-section",
              },
            ],
          },
          {
            sectionNum: "02",
            title: "Contexto del software",
            accent: "amber",
            startPage: "6",
            anchor: "#contexto",
            items: [
              { page: "4", label: "4. El camino hacia EFACTICOM", hash: "#contexto-camino" },
              { page: "5", label: "5. Etapas del proyecto", hash: "#contexto-etapas-title" },
            ],
          },
        ],
        right: [
          {
            sectionNum: "03",
            title: "Resultados",
            accent: "orange",
            startPage: "8",
            anchor: "#resultados",
            items: [
              { page: "6", label: "6. Reportes y analítica", hash: "#resultados-title" },
              { page: "6.1", label: "6.1 Indicadores por categoría", hash: "#dash-a-title" },
              { page: "6.2", label: "6.2 Desempeño operativo", hash: "#dash-b" },
            ],
          },
          {
            sectionNum: "04",
            title: "Cierre y proyección",
            accent: "navy",
            startPage: "10",
            anchor: "#cierre",
            items: [
              { page: "7", label: "7. Bondades", hash: "#cierre-bondades" },
              { page: "8", label: "8. Convocatoria", hash: "#cierre-convocatoria" },
              {
                page: "9",
                label: "9. Proyección",
                hash: "#cierre-prospectiva",
              },
            ],
          },
        ],
      },
    },

    /** Portadas de sección: divisorios editoriales (sin tarjetas ni listas tipo UI). */
    sectionCovers: {
      acerca: {
        num: "01",
        title: "Acerca del software",
        accent: "lime",
        layout: "a",
        deck:
          "Transformación del modelo teórico de productividad en una arquitectura analítica aplicada al entorno empresarial.",
        coverImage: {
          src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1400&q=82",
          alt: "Entorno tecnológico con paleta azul grisácea para analítica empresarial",
        },
      },
      contexto: {
        num: "02",
        title: "Contexto del software",
        accent: "amber",
        layout: "b",
        deck:
          "Del planteamiento investigativo y la evidencia académica al despliegue digital del modelo en contextos productivos reales.",
        coverImage: {
          src: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1400&q=82",
          alt: "Investigación colaborativa y transferencia al sector productivo",
        },
      },
      resultados: {
        num: "03",
        title: "Resultados",
        accent: "orange",
        layout: "c",
        deck:
          "Lectura consolidada del índice de productividad: magnitudes, tendencia temporal y desempeño por turno y por centro de trabajo.",
        coverImage: {
          src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=82",
          alt: "Equipo revisando indicadores y resultados consolidados",
        },
      },
      cierre: {
        num: "04",
        title: "Cierre y proyección",
        accent: "navy",
        layout: "a",
        deck:
          "Síntesis de impacto institucional y convocatoria a la participación en la etapa de validación en campo.",
        coverImage: {
          src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=82",
          alt: "Planificación estratégica y visión de futuro organizacional",
        },
      },
    },

    about: {
      chapterTitle: "1. Introducción",
      narrativeParas: [
        "<em>Efacticom</em> es una herramienta innovadora para medir la productividad de manera transdisciplinar, integra factores de las ciencias exactas, sociales y humanas; este software consolida el compromiso por el mejoramiento organizacional entre Academia, Empresa y Estado. Su aplicación busca aumentar la productividad empresarial, mejorar la competitividad nacional contribuyendo a la construcción de un país social y económicamente sostenible.",
        "Transformar esta ambiciosa idea en un aplicativo que posibilita el mejoramiento empresarial, ha requerido la colaboración entre modelos de naturaleza teórica, explicativa y predictiva. Técnicamente el modelo explicativo de ecuaciones estructurales se lleva a un modelo predictivo basado en algoritmos de Machine Learning; hasta alcanzar los coeficientes fiables de las interrelaciones multifactoriales y la estimación integral de la productividad, incluidas cuatro categorías de indicadores de salida (eficiencia, eficacia, flexibilidad y crecimiento). Los factores latentes de entrada están conformados en siete clústeres (individual, grupal, organizacional, procesos, mano de obra, financiera, maquinaria, equipo y herramientas) que a la vez contienen otras variables, que son los elementos organizaciones objeto de análisis en un Dashboard de resultados que arroja el software.",
      ],
      intro: [
        "<em>Efacticom</em> es una herramienta innovadora para medir la productividad de manera transdisciplinar, integra factores de las ciencias exactas, sociales y humanas; este software consolida el compromiso por el mejoramiento organizacional entre Academia, Empresa y Estado. Su aplicación busca aumentar la productividad empresarial, mejorar la competitividad nacional contribuyendo a la construcción de un país social y económicamente sostenible.",
        "Transformar esta ambiciosa idea en un aplicativo que posibilita el mejoramiento empresarial, ha requerido la colaboración entre modelos de naturaleza teórica, explicativa y predictiva. Técnicamente el modelo explicativo de ecuaciones estructurales se lleva a un modelo predictivo basado en algoritmos de Machine Learning; hasta alcanzar los coeficientes fiables de las interrelaciones multifactoriales y la estimación integral de la productividad, incluidas cuatro categorías de indicadores de salida (eficiencia, eficacia, flexibilidad y crecimiento). Los factores latentes de entrada están conformados en siete clústeres (individual, grupal, organizacional, procesos, mano de obra, financiera, maquinaria, equipo y herramientas) que a la vez contienen otras variables, que son los elementos organizaciones objeto de análisis en un Dashboard de resultados que arroja el software.",
      ],
      /** Encabezado del recuadro SEM → machine learning (resume el párrafo siguiente). */
      transitionKicker: "De ecuaciones estructurales (SEM) a machine learning",
      transitionParas: [],
      /** Cifras alineadas con métricas y textos ya presentes en la cartilla. */
      kpis: [
        {
          value: "83",
          label: "Variables incidentes",
          micro: "Conglomerado de entrada hacia 30 observables",
        },
        { value: "7", label: "Clústeres", micro: "Factores de entrada agrupados" },
        {
          value: "4",
          label: "Indicadores de salida",
          micro: "Eficiencia, eficacia, flexibilidad y crecimiento",
        },
      ],
      outputsIntro: "Cuatro categorías de indicadores de salida:",
      outputs: [
        { key: "eficiencia", label: "Eficiencia" },
        { key: "eficacia", label: "Eficacia" },
        { key: "flexibilidad", label: "Flexibilidad" },
        { key: "crecimiento", label: "Crecimiento" },
      ],
      clustersIntro:
        "Los factores de entrada se organizan en siete clústeres que agrupan variables incidentes para el análisis en el dashboard de resultados:",
      clusters: [
        { id: "organizacional", label: "Organizacional", tone: "a" },
        { id: "procesos", label: "Procesos", tone: "b" },
        { id: "individual", label: "Individual", tone: "c" },
        { id: "productividad", label: "Productividad", tone: "d" },
        { id: "mano_obra", label: "Mano de obra", tone: "e" },
        { id: "finanzas", label: "Finanzas corporativas", tone: "f" },
        { id: "grupal", label: "Grupal", tone: "g" },
        { id: "maquinaria", label: "Maquinaria, equipos y herramientas", tone: "h" },
      ],
      selectedClusterId: "maquinaria",
      selectedIncidentVariables: [
        "Disponibilidad y eficiencia de la maquinaria",
        "Importación de máquinas, equipos y otros",
        "Tiempo de inactividad de las máquinas",
      ],
      incidentVariables: [
        "Disponibilidad y eficiencia de la maquinaria",
        "Importación de máquinas, equipos y otros",
        "Tiempo de inactividad de las máquinas",
        "Acceso a crédito",
        "Accidentalidad mensual",
        "Afectación del medio ambiente",
        "Amenazas empresariales",
        "Aumento en el número de aliados comerciales",
        "Ausentismo laboral",
        "Capacitaciones y formación",
        "Capital invertido en activos fijos",
        "Características empresariales personales",
        "Clasificación de la empresa en el sector financiero",
        "Conocimiento y experiencia",
        "Costo de la mano de obra",
        "Costo de los materiales",
        "Costo por unidad de material",
        "Cumplimiento de las órdenes de producción",
        "Deshumanización",
        "Discapacidad física",
        "Disminución en tiempo de producción",
        "Disponibilidad de datos e información",
        "Disponibilidad de mano de obra",
        "Distribución y diseño de planta",
        "Educación descontextualizada",
        "Enfermedades mentales",
        "Entorno sociocultural de los trabajadores",
        "Equidad de género",
        "Especialización del trabajo",
        "Estado civil",
        "Estado de ánimo",
        "Ética y comportamiento moral",
        "Explosión demográfica",
        "Familia",
        "Formación académica",
        "Gobierno corporativo",
        "Good will (buen nombre)",
        "Habilidades interpersonales de la dirección",
        "Horarios de jornada laboral",
        "Impuestos",
        "Incentivos gubernamentales",
        "Inconformidad laboral",
        "Inconvenientes del Estado",
        "Informalidad empresarial",
        "Liberalización e intensificación del comercio",
        "Mejoramiento en la satisfacción interna",
        "Menor tiempo para resolver",
        "Métodos didácticos de enseñanza",
        "Modalidad de trabajo",
        "Motivación",
        "Nivel de estrés",
        "Número de pruebas y controles de calidad",
        "Participación y representación ciudadana",
        "Pertenecer a un gremio o clúster empresarial",
        "Planeación estratégica organizacional",
        "Políticas de protección al trabajador",
        "Porcentaje de estandarización de procesos",
        "Porcentaje de producto no conforme",
        "Porcentaje de satisfacción del cliente",
        "Preocupaciones de los ciudadanos",
        "Producción por empleado",
        "Producción total",
        "Recreación, bienestar y deporte",
        "Relaciones interpersonales y transpersonales",
        "Rentabilidad de la inversión",
        "Retención del talento humano",
        "Sistema de educación nacional",
        "Sistema financiero nacional",
        "Sistematización y/o automatización",
        "Tamaño de la empresa",
        "Tener un departamento de investigación",
        "Tiempo en minutos",
        "Trastorno psicológico",
        "Utilización de la tierra como factor de producción",
        "Ventas por empleado",
      ],
      functionsTitle: "Funciones principales",
      functions: ["Gestionar", "Calcular", "Analizar", "Almacenar"],
      functionsDetail:
        "— datos e información de variables transdisciplinares mediante interfaces de usuario y herramientas de administración.",
      access:
        "Incluye perfiles de usuario con distintos niveles de acceso y permisos para la gestión de la medición y los reportes.",
      /** Texto sobre la figura del diagrama de clústeres (hoja Acerca 1). */
      synthFigureLead:
        "El modelo integra siete clústeres de factores de entrada hacia cuatro categorías de indicadores de salida que alimentan el índice de productividad.",
      /** Pie de figura bajo el diagrama de clústeres. */
      conglomeradoFigureCaption:
        "Representación esquemática: conglomerado de entrada (clústeres) hacia los indicadores de productividad consolidada.",
      variablesClusterUiAlt:
        "Tabla resumida de variables por clúster según el modelo de medición EFACTICOM.",
      /** Segunda hoja Acerca: continuidad y título de bloque. */
      conglomeradoContinuedLead: "",
      conglomeradoTitle: "2. Conglomerado de variables",
      conglomeradoTableLead: "Tabla de variables por clúster.",
      conglomeradoTableCaption: "",
      /** Título de la sección de clústeres (antes de la tabla y las funciones). */
      clustersSectionTitle: "3. Clústeres para un modelo de medición de la productividad",
      /** Párrafo único funciones + acceso (bloque inferior Acerca). */
      functionsMerged:
        "Las funciones principales de este programa son: gestionar, calcular, analizar y almacenar datos e información de las variables transdisciplinares, por medio de interfaces de usuario y herramientas de administración. Contiene perfiles de usuario con diferentes niveles de acceso y permisos para la gestión de la medición y los reportes.",
      editorialNote: "",
    },

    /**
     * Tabla resumida de variables por clúster.
     * TODO(content): Ajustar nombres exactos y conteos con [variables en tabla.pdf] cuando se valide el documento fuente.
     */
    variablesByCluster: [
      {
        clusterId: "organizacional",
        summary: "Factores estructurales y de dirección organizacional.",
        sampleVars: [
          "Habilidad",
          "Flexibilidad",
          "Estabilidad",
          "Énfasis",
          "Planificación",
          "Gestión",
          "Internacionalización",
        ],
      },
      {
        clusterId: "procesos",
        summary: "Variables observadas en operación y resultados de proceso.",
        sampleVars: [
          "Cumplimiento",
          "Planta y tecnología",
          "Satisfacción del cliente",
          "Tiempo",
          "Calidad",
          "Producción",
        ],
      },
      {
        clusterId: "individual",
        summary: "Condiciones y percepciones del nivel individual.",
        sampleVars: ["Satisfacción", "Educación", "Salud", "Participación", "Motivación"],
      },
      {
        clusterId: "productividad",
        summary: "Dimensiones de salida para la medición integral.",
        sampleVars: ["Eficiencia", "Eficacia", "Flexibilidad", "Crecimiento", "Productividad"],
      },
      {
        clusterId: "mano_obra",
        summary: "Variables laborales y disponibilidad de personal.",
        sampleVars: [
          "Formación",
          "Accidentalidad",
          "Ausentismo",
          "Disponibilidad de mano de obra",
        ],
      },
      {
        clusterId: "finanzas",
        summary: "Variables económicas y de desempeño financiero.",
        sampleVars: ["Endeudamiento", "Ventas", "Costos"],
      },
      {
        clusterId: "grupal",
        summary: "Factores de interacción y dinámica grupal.",
        sampleVars: ["Conflicto", "Cohesión", "Gestión pública"],
      },
      {
        clusterId: "maquinaria",
        summary: "Disponibilidad y rendimiento de recursos técnicos.",
        sampleVars: ["Disponibilidad MQ", "Rendimiento"],
      },
    ],

    metricsNote: {
      title: "Conglomerado de variables",
      body:
        "La medición total se articula a partir de 83 variables incidentes que alimentan 30 variables observables en el funcionamiento organizacional. Los resultados se visualizan en dashboards segmentables.",
    },

    context: {
      pageEyebrow: "Contexto del software",
      lead: "4. El camino hacia EFACTICOM",
      paragraphs: [
        "Efacticom fue pensado años atrás, cuando la Dra. Gisela Monsalve Fonnegra coordinaba proyectos de mejoramiento empresarial; en ellos, identificó que la medición de la productividad se realiza de manera exacta, incorporando principalmente variables cuantitativas, dejando de lado factores cualitativos que podrían afectar la medición del indicador. No obstante, recopiló información al respecto y en el año 2020 comienza la transformación de la idea; a partir de la ejecución de actividades que algún día le permitieran obtener un innovador modelo de medición.",
        "La convergencia entre rigor estadístico, diseño de software y acompañamiento organizacional define el camino hacia una herramienta usable en el día a día empresarial.",
      ],
      insightKicker: "Responsable conceptual",
      attributionName: "Dra. Gisela Monsalve Fonnegra",
      attributionDetail: "Origen conceptual y liderazgo del enfoque transdisciplinar de medición.",
      /** Línea de tiempo breve bajo el texto (página Contexto). */
      miniTimeline: [
        { year: "2020", label: "Inicio del modelo y evidencia empírica" },
        { year: "2022", label: "Sustento académico y tesis doctoral" },
        { year: "2025", label: "SEM, machine learning y desarrollo del aplicativo" },
        { year: "2026", label: "Pruebas en contexto real y socialización" },
      ],
      /** Franja Academia — Empresa — Estado. */
      ecosystem: {
        title: "Articulación para la medición integral",
        pillars: [
          {
            id: "academia",
            label: "Academia",
            subtitle: "Investigación, validación de modelos y formación.",
          },
          {
            id: "empresa",
            label: "Empresa",
            subtitle: "Aplicación en procesos productivos y toma de decisiones.",
          },
          {
            id: "estado",
            label: "Estado",
            subtitle: "Políticas públicas y acompañamiento al ecosistema CTi.",
          },
        ],
      },
    },

    timeline: [
      {
        phase: "Etapa 1",
        title: "Modelo teórico",
        range: "2020–2022",
        items: [
          "Análisis del mundo real",
          "Revisión sistemática de literatura",
          "Triangulación de factores latentes",
          "Tesis doctoral — modelo transdisciplinar para medir la productividad",
        ],
      },
      {
        phase: "Etapa 2",
        title: "Modelo explicativo",
        range: "2025",
        items: [
          "Estadística exploratoria",
          "Modelo de ecuaciones estructurales (SEM)",
          "Gráficos de sendero y ecuaciones explícitas",
          "Validación y ajuste del modelo matemático",
        ],
      },
      {
        phase: "Etapa 3",
        title: "Modelo predictivo",
        range: "2025",
        items: [
          "Enfoque machine learning",
          "Entrenamiento y comparación de modelos predictivos",
          "Código en R",
          "Código en Python",
        ],
      },
      {
        phase: "Etapa 4",
        title: "Desarrollo del software",
        range: "2025",
        items: [
          "Interfaz moderna, rápida y amigable",
          "Implementación segura en la nube",
          "Ejecución global y segura del modelo transdisciplinar",
        ],
      },
      {
        phase: "Etapa 5",
        title: "Seguimiento y cierre de pruebas",
        range: "2026",
        items: [
          "Vincular empresas del sector real",
          "Medir variables en las organizaciones",
          "Calcular la productividad empresarial",
          "Contrastar medición actual vs propuesta",
          "Socializar resultados",
        ],
      },
    ],

    resultsIntro: {
      pageEyebrow: "",
      scopeTitle: "Consolidado organizacional",
      deck:
        "Lectura consolidada del índice de productividad: magnitudes por tendencia temporal, desempeño por mano de obra, turno y por centro de trabajo.",
      interpretation:
        "La productividad transdisciplinar es la medida total de la productividad de la empresa, subdividida en cuatro categorías de indicadores Eficiencia, Eficacia, Flexibilidad y Crecimiento; en las cuales están asignadas treinta (30) variables observables en el funcionamiento organizacional; las cuales son producto del conglomerado de 83 variables incidentes. Los resultados se muestran en un Dashboard que permite analizar de manera integral la información sobre la medición de la productividad de la organización; contiene segmentadores para filtrar la información por rangos de tiempo, trabajadores/empleados, turnos laborales y centros de trabajo. De esta manera, es posible observar cómo impactan las variables en la productividad total de la empresa o segmentada.",
      trendLabels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      /** Serie global (Prod. transdisciplinar) — misma fuente que indicadores integrados mensuales */
      trendSeriesTotal: [
        82.72, 81.28, 85.15, 81.10, 85.02, 79.35, 85.52, 86.33, 84.96, 83.96, 86.23, 83.05,
      ],
    },

    dashboards: {
      pageTitles: {
        a: "6.1 Productividad Transdisciplinar Total",
        b: "6.2 Desempeño Transdisciplinar de la productividad",
      },
      halfTitles: {
        comparativo: "Comparativo de categorías",
        indicadores: "Indicadores integrados de productividad",
      },
      overviewChips: [
        { label: "Periodo", value: "12 meses" },
        { label: "Cobertura", value: "Todos los turnos y centros" },
      ],
      categories: [
        { key: "eficiencia", label: "Eficiencia", color: "#2563eb" },
        { key: "eficacia", label: "Eficacia", color: "#0284c7" },
        { key: "flexibilidad", label: "Flexibilidad", color: "#475569" },
        { key: "crecimiento", label: "Crecimiento", color: "#1e3a8a" },
      ],
      monthlyTotalColor: "#0f3d6b",
      monthlyLabels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      /** Mensual alineado con serie «Productividad transdisciplinar» del modelo */
      monthlySeries: {
        total: [82.72, 81.28, 85.15, 81.10, 85.02, 79.36, 85.52, 86.33, 84.96, 83.96, 86.23, 83.05],
        eficiencia: [28.99, 28.49, 29.85, 28.43, 29.80, 27.82, 29.98, 30.26, 29.78, 29.43, 30.23, 29.1],
        eficacia: [26.25, 25.79, 27.02, 25.73, 26.97, 25.18, 27.13, 27.39, 26.96, 26.64, 27.36, 26.35],
        flexibilidad: [19.07, 18.73, 19.62, 18.69, 19.60, 18.29, 19.71, 19.90, 19.58, 19.35, 19.87, 19.14],
        crecimiento: [8.42, 8.27, 8.66, 8.25, 8.65, 8.07, 8.70, 8.78, 8.64, 8.54, 8.77, 8.45],
      },
      /** Cierre de periodo (dic): coherente con suma de dimensiones */
      kpiTotal: 84.04,
      kpiPillars: [
        { key: "eficiencia", value: 29.46 },
        { key: "eficacia", value: 26.66 },
        { key: "flexibilidad", value: 19.37 },
        { key: "crecimiento", value: 8.55 },
      ],
      notes: {
        a: "Productividad transdisciplinar y cuatro dimensiones por mes (escala 0–100). Eje vertical: valor; eje horizontal: tiempo. El valle en junio y los picos en agosto y noviembre articulan la lectura con la tendencia de la síntesis.",
        b: "Comparación por turno (1–3). En eficiencia y crecimiento, la torta muestra la participación relativa de cada turno en el total consolidado de la dimensión.",
        bCentro:
          "Comparación por centro de trabajo (códigos INY). Las tortas de eficiencia y crecimiento representan la proporción de cada centro respecto al agregado de la dimensión.",
        c: "La franja clara indica la magnitud de referencia de productividad total; la franja de color, el aporte de cada categoría en escala 0–100. La columna Δ sintetiza la desviación frente al equilibrio entre dimensiones.",
      },
      interpretationA:
        "La serie mensual refleja el mínimo en junio y la recuperación hacia agosto y noviembre, en línea con la tendencia del índice global.",
      analysisMain:
        "Este gráfico muestra en pantalla los valores calculados de la productividad transdisciplinar y el resultado relativo de cada una de las cuatro categorías de indicadores Eficiencia, Eficacia, Flexibilidad y Crecimiento; con los segmentadores de tiempo, turno laboral y centro de trabajo.",
      analysisB: [
        "Las gráficas muestran en pantalla los valores calculados de la productividad transdisciplinar para las cuatro categorías de indicadores Eficiencia, Eficacia, Flexibilidad y Crecimiento en los segmentadores: rangos de fecha, fecha día, turno laboral y centro de trabajo.",
        "Adicionalmente el Dashboard muestra en pantalla los valores calculados de la productividad transdisciplinar por empleado en las cuatro categorías de indicadores Eficiencia, Eficacia, Flexibilidad y Crecimiento en los segmentadores: rangos de fecha, fecha día, empleado, turno laboral y centro de trabajo.",
        "Y el Dashboard estadística que muestra en pantalla los valores calculados de las medidas estadísticas descriptivas Media o promedio aritmético, Valor máximo, Valor mínimo, Rango o Amplitud, Desviación típica o estándar, Varianza y Coeficiente de Variación; segmentadas para cada una de las treinta (30) variables observables.",
      ],
      categoryComparison: [
        { key: "eficiencia", delta: "+8.4" },
        { key: "eficacia", delta: "+5.6" },
        { key: "flexibilidad", delta: "-16" },
        { key: "crecimiento", delta: "-12.5" },
      ],
      comparativoInsight:
        "Se evidencia una brecha significativa en crecimiento y flexibilidad frente a las demás dimensiones.",
      dashboardTotalTurno: [
        {
          kind: "columns",
          title: "Productividad por turno",
          yAxisLabel: "Productividad",
          labels: ["Turno 1", "Turno 2", "Turno 3"],
          values: [83.52, 84.24, 84.64],
          color: "#0f3d6b",
          yMin: 82,
          yMax: 86,
        },
        {
          kind: "donut",
          title: "Eficiencia por turno",
          subtitle: "Participación relativa por turno ",
          labels: ["Turno 1", "Turno 2", "Turno 3"],
          values: [29.28, 29.53, 29.67],
          color: "#2563eb",
          segmentColors: ["#1e3a8a", "#2563eb", "#60a5fa"],
        },
        {
          kind: "line",
          title: "Eficacia por turno",
          yAxisLabel: "Eficacia",
          labels: ["Turno 1", "Turno 2", "Turno 3"],
          values: [26.50, 26.73, 26.85],
          color: "#0284c7",
          yMin: 26.2,
          yMax: 27.1,
          smooth: true,
        },
        {
          kind: "hbars",
          title: "Flexibilidad por turno",
          xAxisLabel: "Flexibilidad",
          labels: ["Turno 1", "Turno 2", "Turno 3"],
          values: [19.25, 19.41, 19.51],
          color: "#475569",
          xMin: 19.1,
          xMax: 19.55,
          highlight: true,
        },
        {
          kind: "donut",
          title: "Crecimiento por turno",
          subtitle: "Participación relativa por turno ",
          labels: ["Turno 1", "Turno 2", "Turno 3"],
          values: [8.50, 8.57, 8.61],
          color: "#1e3a8a",
          segmentColors: ["#0f172a", "#1e3a8a", "#3b82f6"],
        },
      ],
      dashboardTotalCentroLabels: [
        "INY 01",
        "INY 02",
        "INY 03",
        "INY 04",
        "INY 05",
        "INY 06",
        "INY 19",
        "INY 20",
        "INY 24",
        "INY 25",
      ],
      dashboardTotalCentro: [
        {
          kind: "columnsMany",
          title: "Productividad por centro de trabajo",
          yAxisLabel: "Productividad",
          labelsRef: "dashboardTotalCentroLabels",
          values: [84.24, 81.37, 83.55, 85.21, 82.79, 85.19, 85.25, 81.33, 85.92, 84.52],
          color: "#0f3d6b",
          yMin: 78,
          yMax: 88,
        },
        {
          kind: "donut",
          title: "Eficiencia por centro de trabajo",
          labelsRef: "dashboardTotalCentroLabels",
          values: [29.53, 28.52, 29.28, 29.87, 29.02, 29.86, 29.88, 28.51, 30.12, 29.63],
          color: "#2563eb",
          segmentColors: [
            "#1e3a8a",
            "#1d4ed8",
            "#2563eb",
            "#3b82f6",
            "#60a5fa",
            "#93c5fd",
            "#bfdbfe",
            "#1d4ed8",
            "#60a5fa",
            "#2563eb",
          ],
        },
        {
          kind: "lineMany",
          title: "Eficacia por centro de trabajo",
          yAxisLabel: "Eficacia",
          labelsRef: "dashboardTotalCentroLabels",
          values: [26.73, 25.82, 26.51, 27.04, 26.27, 27.03, 27.04, 25.80, 27.26, 26.81],
          color: "#0284c7",
          yMin: 25,
          yMax: 27.6,
          smooth: true,
        },
        {
          kind: "hbarsMany",
          title: "Flexibilidad por centro de trabajo",
          xAxisLabel: "Flexibilidad",
          labelsRef: "dashboardTotalCentroLabels",
          values: [8.57, 8.28, 8.5, 8.67, 8.42, 8.67, 8.67, 8.27, 8.74, 8.6],
          color: "#475569",
          xMin: 8,
          xMax: 8.85,
          highlight: true,
        },
        {
          kind: "donut",
          title: "Crecimiento por centro de trabajo",
          labelsRef: "dashboardTotalCentroLabels",
          values: [8.57, 8.28, 8.50, 8.67, 8.42, 8.67, 8.67, 8.27, 8.74, 8.60],
          color: "#1e3a8a",
          segmentColors: [
            "#020617",
            "#0f172a",
            "#1e293b",
            "#334155",
            "#475569",
            "#64748b",
            "#94a3b8",
            "#1e293b",
            "#94a3b8",
            "#475569",
          ],
        },
      ],
    },

    closing: {
      title: "Cierre y proyección",
      blocks: [
        {
          id: "cierre-bondades",
          title: "7. Bondades",
          bodyHtml:
            "La productividad transdisciplinar es la medida total de la productividad de la empresa, subdividida en cuatro categorías de indicadores <em>Eficiencia</em>, <em>Eficacia</em>, <em>Flexibilidad</em> y <em>Crecimiento</em>; en las cuales están asignadas treinta (30) variables observables en el funcionamiento organizacional; las cuales son producto del conglomerado de otras variables incidentes.<br><br>Los resultados se muestran en un Dashboard que permite analizar de manera integral la información sobre la medición de la productividad de la organización; contiene segmentadores para filtrar la información por rangos de tiempo, trabajadores/empleados, turnos laborales y centros de trabajo. De esta manera, es posible observar cómo impactan las variables en la productividad total de la empresa o segmentada.<br><br>Síntesis del índice de productividad transdisciplinar y sus cuatro dimensiones en escala 0–100, con evolución mensual del indicador global.",
        },
        {
          id: "cierre-convocatoria",
          title: "8. Convocatoria",
          ctaBlock: true,
          bodyHtml:
            "Invitamos a la comunidad empresarial y académica a vincularse a la etapa 5 Seguimiento y cierre de pruebas en: <a href=\"https://productivity-team.com/convocatoria\" target=\"_blank\">https://productivity-team.com/convocatoria</a>",
        },
        {
          id: "cierre-prospectiva",
          title: "9. Proyección",
          bodyHtml:
            "<strong>A mediano plazo</strong>, <em>Efacticom</em> llegará a las empresas colombianas con la colaboración de actores gubernamentales, académicos y privados; la Ingeniería de requisitos será técnicamente la encargada de gestionar la transmisión de conocimiento en cada organización. Se espera el uso generalizado del producto en cinco años, para lo cual es necesario el impulso a través de pilotos empresariales y redes sociales.",
        },
      ],
      ctaText:
        "Invitamos a la comunidad empresarial y académica a vincularse a la etapa 5 Seguimiento y cierre de pruebas.",
      ctaButton: {
        label: "Convocatoria — Productivity Team",
        href: "https://productivity-team.com/convocatoria",
      },
      backCover: {
        taglineHtml:
          "Herramienta para la medición integral de la productividad, con enfoque en analítica, innovación y articulación entre academia, empresa y Estado.<br><br><strong>Con el apoyo de:</strong>",
        copyright: "© 2026 Gisela Patricia Monsalve Fonnegra. Todos los derechos reservados.",
        emails: ["info@productivity-team.com", "giselam73@gmail.com"],
        linkedin: "www.linkedin.com/in/gisela-patricia-monsalve-fonnegra-2b325a25",
      },
    },
  };
})();
