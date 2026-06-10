// js/feedback.js - Mutaciones y lógica de estrellas corregida
const ENDPOINT_SERVER = "https://servidor-graphql-production.up.railway.app/";

// MUTATION 1: Sumar una visualización de forma silenciosa
async function mutacionRegistrarVista(id) {
  try {
    const response = await fetch(ENDPOINT_SERVER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation {
            registrarVisualizacion(materiaId: "${id}") {
              visualizaciones
            }
          }
        `
      })
    });
    const resultado = await response.json();
    return resultado.data.registrarVisualizacion.visualizaciones;
  } catch (e) {
    console.error("Error al registrar visualización:", e);
  }
}

// MUTATION 2: Enviar puntuación de estrellas
async function mutacionCalificarMateria(id, puntos) {
  try {
    const response = await fetch(ENDPOINT_SERVER, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation {
            calificarMateria(materiaId: "${id}", puntuacion: ${puntos}) {
              promedioCalificacion
            }
          }
        `
      })
    });
    const resultado = await response.json();
    return resultado.data.calificarMateria.promedioCalificacion;
  } catch (e) {
    console.error("Error al calificar materia:", e);
  }
}

// Función encargada de activar los eventos visuales y clicks
function inicializarSistemaEstrellas(materiaIdSeleccionada) {
  const contenedorEstrellas = document.getElementById("contenedor-estrellas");
  if (!contenedorEstrellas) {
    console.warn("No se encontró el contenedor de estrellas todavía.");
    return;
  }
  
  const estrellas = contenedorEstrellas.querySelectorAll("i");

  estrellas.forEach(estrella => {
    
    // 1. Efecto Hover (Al pasar el mouse por encima)
    estrella.addEventListener("mouseover", () => {
      const valorHover = parseInt(estrella.getAttribute("data-valor"));
      estrellas.forEach(e => {
        const v = parseInt(e.getAttribute("data-valor"));
        if (v <= valorHover) {
          e.classList.remove("bi-star");
          e.classList.add("bi-star-fill", "active");
        } else {
          // Si no está seleccionada por un click previo, la apagamos temporalmente
          if (!e.hasAttribute("data-fijado")) {
            e.classList.remove("bi-star-fill", "active");
            e.classList.add("bi-star");
          }
        }
      });
    });

    // 2. Al sacar el mouse del contenedor (Restaurar al estado real votado)
    contenedorEstrellas.addEventListener("mouseleave", () => {
      estrellas.forEach(e => {
        if (e.hasAttribute("data-fijado")) {
          e.classList.remove("bi-star");
          e.classList.add("bi-star-fill", "active");
        } else {
          e.classList.remove("bi-star-fill", "active");
          e.classList.add("bi-star");
        }
      });
    });

    // 3. Evento Click (Guardar voto definitivo y enviar Mutation)
    estrella.addEventListener("click", () => {
      const puntuacionSeleccionada = parseInt(estrella.getAttribute("data-valor"));
      
      // Marcamos cuáles quedan fijadas usando un atributo de control
      estrellas.forEach(e => {
        const v = parseInt(e.getAttribute("data-valor"));
        if (v <= puntuacionSeleccionada) {
          e.setAttribute("data-fijado", "true");
          e.classList.remove("bi-star");
          e.classList.add("bi-star-fill", "active");
        } else {
          e.removeAttribute("data-fijado");
          e.classList.remove("bi-star-fill", "active");
          e.classList.add("bi-star");
        }
      });

      // Enviamos el dato al servidor GraphQL de Railway
      mutacionCalificarMateria(materiaIdSeleccionada, puntuacionSeleccionada).then(nuevoPromedio => {
        if (nuevoPromedio !== undefined && nuevoPromedio !== null) {
          document.getElementById("promedio-calificacion").textContent = nuevoPromedio.toFixed(1);
          
          // Mostrar cartelito de éxito
          const msg = document.getElementById("mensaje-voto");
          if(msg) {
            msg.classList.remove("d-none");
            setTimeout(() => msg.classList.add("d-none"), 3000);
          }
        }
      });
    });
    
  });
}