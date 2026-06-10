// ==========================================
// 1. CENTRALIZADOR DE NAVEGACIÓN SPA (CORREGIDO PARA GITHUB PAGES)
// ==========================================
function cargarPagina(url) {
    let idMateria = null;
    if (url.includes('?id=')) {
        const partes = url.split('?id=');
        url = partes[0];      
        idMateria = partes[1]; 
    }

    // --- SOLUCIÓN PARA GITHUB PAGES ---
    // Detectamos si estamos en producción (GitHub) o en desarrollo (Localhost)
    let urlParaFetch = url;
    if (window.location.hostname.includes("github.io")) {
        // Capturamos el nombre de tu repositorio dinámicamente desde la URL
        const rutaPath = window.location.pathname.split('/')[1]; 
        // Si la url que entra no viene ya con el nombre del repositorio, se lo sumamos
        if (!url.startsWith(`/${rutaPath}`) && !url.startsWith(`${rutaPath}/`)) {
            urlParaFetch = `/${rutaPath}/${url.replace(/^\//, '')}`;
        }
    }

    // Hacemos el fetch con la URL corregida para el entorno
    fetch(urlParaFetch)
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar la sección: " + urlParaFetch);
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const nuevoContenido = doc.querySelector('main') || doc.querySelector('body');
            const contenedorPrincipal = document.getElementById("contenedor-principal");
            
            if (contenedorPrincipal) {
                contenedorPrincipal.innerHTML = nuevoContenido ? nuevoContenido.outerHTML : html;
            }

            window.scrollTo({ top: 0, behavior: 'instant' });

            // Sincronizar Navbar Activa (usamos la url original para no romper los comparadores)
            document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(url)) {
                    link.classList.add('active');
                }
            });

            // Disparar las consultas GraphQL según corresponda
            if (url === 'inicio-contenido.html') {
                inicializarMateriasGraphQL();
            } else if (url === 'materia.html' && idMateria) {
                inicializarDetalleMateriaGraphQL(idMateria);
            } else {
                inicializarEventosDinamicos();
                inicializarQuizRecomendador();
            }
        })
        .catch(error => {
            console.error("Error SPA:", error);
            const contenedorPrincipal = document.getElementById("contenedor-principal");
            if (contenedorPrincipal) {
                contenedorPrincipal.innerHTML = `<div class="container my-5 text-center alert alert-danger">Error al cargar la sección. Por favor usá Live Server.</div>`;
            }
        });
}

// ==========================================
// 2. INTEGRACIÓN CON EL SERVIDOR GRAPHQL
// ==========================================
const MAPA_ICONOS = {
    BDD1: "🗄️",
    REDES1: "🌐",
    ING1: "💻",
    SO1: "🐧",
    AC1: "🏗️",
    AC2: "📟",
    APD: "📚",
    PROB: "🌳",

    REDES2: "📡",
    ING2: "⚙️",
    DISCRETA: "🔢",
    ALGEBRA: "➗",
    LF: "📜",
    ALGORITMOS: "🧠",
    TA: "🔧",
    POO1: "☕",
    POO2: "🚀",
    UCYS: "🏛️",
    AM1: "📈",
    AM2: "📉",
    BDD2: "🗃️"
};
function inicializarMateriasGraphQL() {
    fetch("https://servidor-graphql-production.up.railway.app/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: `query { materias { id nombre } }` })
    })
    .then(res => res.json())
    .then(resultado => {
        const contenedor = document.querySelector(".categoria-container");
        if (!contenedor) return;

        if (!resultado.data || resultado.data.materias.length === 0) {
            contenedor.innerHTML = `<div class="alert alert-warning w-100 text-center">No hay materias cargadas en el servidor.</div>`;
            return;
        }

        contenedor.innerHTML = resultado.data.materias.map(materia => {
            const icono = MAPA_ICONOS[materia.id] || "📚";
            return `
              <a href="#" onclick="cargarPagina('materia.html?id=${materia.id}')" class="tarjeta-categoria" data-id="${materia.id}"> 
                  <div class="icono-card"><span>${icono}</span></div>
                  <h2>${materia.nombre}</h2>
              </a>
            `;
        }).join("");
    })
    .catch(err => {
        console.error(err);
        const contenedor = document.querySelector(".categoria-container");
        if(contenedor) contenedor.innerHTML = `<div class="alert alert-danger w-100 text-center">Error al conectar con Apollo Server.</div>`;
    });
}

function inicializarDetalleMateriaGraphQL(idMateria) {
    function limpiarUrlDrive(urlOriginal) {
        if (!urlOriginal || urlOriginal === "---") return null;
        const idMatch = urlOriginal.match(/\/d\/([a-zA-Z0-9-_]+)/);
        if (idMatch && idMatch[1]) {
            return `https://docs.google.com/viewer?url=https://drive.google.com/uc?id=${idMatch[1]}&embedded=true`;
        }
        return urlOriginal;
    }

    function limpiarUrlYouTube(urlOriginal) {
        if (!urlOriginal) return "";
        const urlLimpia = urlOriginal.trim();
        if (urlLimpia.includes('/embed/')) return urlLimpia;
        const idMatch = urlLimpia.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|\/embed\/|\/v\/))([^?&#]+)/);
        return idMatch && idMatch[1] ? `https://www.youtube.com/embed/${idMatch[1]}` : urlLimpia;
    }

    fetch("https://servidor-graphql-production.up.railway.app/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: `
              query {
                materiaPorId(id: "${idMateria}") {
                  nombre
                  resumenes { titulo pdfUrl }
                  videos { titulo url }
                  bibliografia { titulo autor editorial }
                }
              }
            `
        })
    })
    .then(res => res.json())
    .then(resultado => {
        const materia = resultado.data.materiaPorId;
        if (!materia) return;

        document.querySelector(".titulo-materia").textContent = materia.nombre;

        // Renderizado - Resúmenes
        const resumenesContainer = document.querySelector(".resumenes-container");
        if (materia.resumenes && materia.resumenes.length > 0) {
            resumenesContainer.innerHTML = materia.resumenes.map(r => {
                const urlBypass = limpiarUrlDrive(r.pdfUrl);
                if (!urlBypass) {
                    return `
                      <div class="item-resumen mb-4">
                        <h3>${r.titulo}</h3>
                        <div class="alert alert-secondary w-100 text-center">Material en revisión.</div>
                      </div>`;
                }
                return `
                  <div class="item-resumen mb-4">
                    <h3>${r.titulo}</h3>
                    <iframe class="resumen-iframe" src="${urlBypass}" frameborder="0"></iframe>
                  </div>`;
            }).join("");
        } else {
            resumenesContainer.innerHTML = '<p class="text-muted text-center w-100">No hay resúmenes cargados para esta materia.</p>';
        }

        // Renderizado - Videos (Carrusel interactivo)
        const videosContainer = document.querySelector(".videos-container");
        if (materia.videos && materia.videos.length > 0) {
            videosContainer.innerHTML = `
              <div id="materiaVideoCarousel" class="carousel slide shadow carrusel-contenedor" data-bs-ride="carousel">
                  <div class="carousel-indicators">
                    ${materia.videos.map((_, i) => `<button type="button" data-bs-target="#materiaVideoCarousel" data-bs-slide-to="${i}" class="${i === 0 ? 'active' : ''}"></button>`).join("")}
                  </div>
                  <div class="carousel-inner" style="border-radius: 12px;">
                    ${materia.videos.map((v, i) => `
                      <div class="carousel-item ${i === 0 ? 'active' : ''}">
                        <iframe class="d-block w-100" src="${limpiarUrlYouTube(v.url)}" height="500" title="${v.titulo}" frameborder="0" allowfullscreen></iframe>
                      </div>
                    `).join("")}
                  </div>
                  <button class="carousel-control-prev" type="button" data-bs-target="#materiaVideoCarousel" data-bs-slide="prev">
                      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  </button>
                  <button class="carousel-control-next" type="button" data-bs-target="#materiaVideoCarousel" data-bs-slide="next">
                      <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  </button>
              </div>`;
            
            // Inicialización segura del carrusel dinámico
            setTimeout(() => {
                const carouselEl = document.getElementById('materiaVideoCarousel');
                if (carouselEl && typeof bootstrap !== 'undefined') {
                    new bootstrap.Carousel(carouselEl, { interval: 5000, ride: true });
                }
            }, 100);
        } else {
            videosContainer.innerHTML = '<p class="text-muted text-center w-100">No hay videos asignados actualmente.</p>';
        }

        // Renderizado - Bibliografía
        const biblioContainer = document.querySelector(".list-group-bibliografia");
        if (materia.bibliografia && materia.bibliografia.length > 0) {
            biblioContainer.innerHTML = materia.bibliografia.map((b, i) => `
              <div class="list-group-item list-group-item-action ${i === 0 ? 'active' : ''}">
                <div class="d-flex w-100 justify-content-between align-items-center">
                  <h5 class="mb-1">${b.titulo}</h5>
                  <small>${i === 0 ? 'Texto Base' : 'Lectura Complementaria'}</small>
                </div>
                <p class="mb-1"><strong>Autor:</strong> ${b.autor}</p>
                <small>${b.editorial !== '----' ? `Editorial: ${b.editorial}` : 'Editorial no especificada'}</small>
              </div>`).join("");
        } else {
            biblioContainer.innerHTML = '<p class="text-muted p-3 text-center w-100">No se requiere bibliografía obligatoria.</p>';
        }
    })
    .catch(err => console.error("Error cargando detalle:", err));
}

function inicializarEventosDinamicos() {
    document.querySelectorAll(".category-card").forEach(card => {
        card.addEventListener("click", () => {
            const dest = card.dataset.page || card.dataset.url;
            if (dest) cargarPagina(dest);
        });
    });
}

// ==========================================
// 3. CONTROLADOR DEL REPRODUCTOR FLOTANTE
// ==========================================
function playVideo(videoId, titulo) {
    const videoContainer = document.getElementById("floatingVideoContainer");
    const videoFrame = document.getElementById("videoPlayerFrame");
    const videoTitle = document.getElementById("floatingVideoTitle");

    if (videoContainer && videoFrame) {
        if (videoTitle && titulo) {
            videoTitle.textContent = titulo;
        }
        
        // Carga la URL embebida con los parámetros recomendados para reproducción SPA
        videoFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&enablejsapi=1&rel=0`;
        
        // Quitamos la clase 'd-none' de Bootstrap para mostrarlo en pantalla
        videoContainer.classList.remove("d-none");
    } else {
        console.error("No se encontraron los elementos estructurales del video flotante.");
    }
}

function closeVideo() {
    const videoContainer = document.getElementById("floatingVideoContainer");
    const videoFrame = document.getElementById("videoPlayerFrame");

    if (videoContainer && videoFrame) {
        videoContainer.classList.add("d-none");
        videoFrame.src = ""; // Resetea el frame para detener el audio por completo
    }
}
// ==========================================
// 4. LÓGICA INTERACTIVA DEL CUESTIONARIO (QUIZ)
// ==========================================
function inicializarQuizRecomendador() {
    const opcionesQuiz = document.querySelectorAll('input[name="quizGt"]');
    const quizAlert = document.getElementById("quiz-alert");
    const quizSuggestion = document.getElementById("quiz-suggestion");

    // Salida segura si el HTML de la página no tiene el Quiz renderizado
    if (!opcionesQuiz.length || !quizAlert || !quizSuggestion) return;

    opcionesQuiz.forEach(radio => {
        radio.addEventListener("change", (e) => {
            const seleccion = e.target.value;
            let sugerenciaTexto = "";

            switch (seleccion) {
                case "Pomodoro":
                    sugerenciaTexto = "Método Pomodoro. Te sugerimos arrancar con intervalos clásicos de 25/5 para entrenar tu umbral de atención sin frustrarte.";
                    break;
                case "GTD":
                    sugerenciaTexto = "Método GTD (Getting Things Done). Tu problema es de almacenamiento mental; necesitás vaciar todos tus pendientes urgentes en Notion hoy mismo.";
                    break;
                case "Time Blocking":
                    sugerenciaTexto = "Time Blocking. Ideal para tu perfil. Abrí Google Calendar y empezá a reservar bloques fijos de color para cada materia antes de que arranque la semana.";
                    break;
                default:
                    sugerenciaTexto = "Seleccioná una opción para analizar tu caso.";
            }

            // Inyectar el texto correspondiente
            quizSuggestion.textContent = sugerenciaTexto;
            
            // Mostrar la alerta removiendo la clase oculta de Bootstrap
            quizAlert.classList.remove("d-none");

            // Limpieza y resaltado visual de la fila del formulario
            document.querySelectorAll(".quiz-row").forEach(row => {
                row.style.backgroundColor = "#ffffff";
                row.style.borderColor = "rgba(0,0,0,0.1)";
            });

            const filaActiva = radio.closest(".quiz-row");
            if (filaActiva) {
                filaActiva.style.backgroundColor = "#fbf5ed"; // Tono crema suave
                filaActiva.style.borderColor = "#6b3700";       // Borde chocolate
            }
        });
    });
}