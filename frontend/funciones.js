let API_URL = "http://127.0.0.1:8000";

let formulario = document.getElementById("formulario");
let lista = document.getElementById("lista");
let mensaje = document.getElementById("mensaje");
let total = document.getElementById("total");
let busqueda = document.getElementById("busqueda");
let guardar = document.getElementById("guardar");
let cancelar = document.getElementById("cancelar");
let tituloFormulario = document.getElementById("titulo-formulario");
let idEditar = 0;
let personajes = [];

function mostrarMensaje(texto, error) {
    mensaje.textContent = texto;
    mensaje.className = error ? "error" : "";
}

function obtenerDatosFormulario() {
    return {
        nombre: document.getElementById("nombre").value.trim(),
        franquicia: document.getElementById("franquicia").value.trim(),
        tipo_luchador: document.getElementById("tipo_luchador").value,
        habilidad: document.getElementById("habilidad").value.trim(),
        escenario: document.getElementById("escenario").value.trim()
    };
}

async function cargarPersonajes() {
    try {
        let respuesta = await fetch(API_URL + "/personajes");
        if (!respuesta.ok) {
            throw new Error("No se pudo consultar el roster.");
        }
        personajes = await respuesta.json();
        total.textContent = personajes.length;
        mostrarPersonajes();
    } catch (error) {
        lista.innerHTML = '<p class="vacio">No se pudo cargar tu roster. Intenta actualizar la página.</p>';
    }
}

function mostrarPersonajes() {
    let texto = busqueda.value.toLowerCase().trim();
    let filtrados = personajes.filter(function(personaje) {
        return personaje.nombre.toLowerCase().includes(texto)
            || personaje.franquicia.toLowerCase().includes(texto);
    });

    if (filtrados.length === 0) {
        lista.innerHTML = '<p class="vacio">No hay luchadores que coincidan. ¡Añade uno con el formulario!</p>';
        return;
    }

    lista.innerHTML = "";
    filtrados.forEach(function(personaje) {
        let tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta";

        let cabecera = document.createElement("div");
        cabecera.className = "tarjeta-cabecera";
        let numero = document.createElement("span");
        numero.className = "numero";
        numero.textContent = "FIGHTER #" + String(personaje.id).padStart(3, "0");
        let franquicia = document.createElement("span");
        franquicia.className = "etiqueta-franquicia";
        franquicia.textContent = personaje.franquicia;
        cabecera.append(numero, franquicia);

        let cuerpo = document.createElement("div");
        cuerpo.className = "tarjeta-cuerpo";
        let nombre = document.createElement("h3");
        nombre.textContent = personaje.nombre;
        cuerpo.appendChild(nombre);
        cuerpo.appendChild(crearDetalle("Tipo", personaje.tipo_luchador));
        cuerpo.appendChild(crearDetalle("Habilidad", personaje.habilidad));
        cuerpo.appendChild(crearDetalle("Escenario", personaje.escenario));

        let acciones = document.createElement("div");
        acciones.className = "tarjeta-acciones";
        let botonEditar = document.createElement("button");
        botonEditar.id = "editar-" + personaje.id;
        botonEditar.className = "boton boton-editar";
        botonEditar.type = "button";
        botonEditar.textContent = "Editar";
        botonEditar.addEventListener("click", function() {
            prepararEdicion(personaje.id);
        });

        let botonEliminar = document.createElement("button");
        botonEliminar.id = "eliminar-" + personaje.id;
        botonEliminar.className = "boton boton-eliminar";
        botonEliminar.type = "button";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.addEventListener("click", function() {
            borrarPersonaje(personaje.id, personaje.nombre);
        });

        acciones.append(botonEditar, botonEliminar);
        tarjeta.append(cabecera, cuerpo, acciones);
        lista.appendChild(tarjeta);
    });
}

function crearDetalle(titulo, valor) {
    let parrafo = document.createElement("p");
    parrafo.className = "detalle";
    let etiqueta = document.createElement("b");
    etiqueta.textContent = titulo + ": ";
    parrafo.append(etiqueta, document.createTextNode(valor));
    return parrafo;
}

formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault();
    let datos = obtenerDatosFormulario();
    let direccion = API_URL + "/personajes";
    let metodo = "POST";

    if (idEditar !== 0) {
        direccion += "/" + idEditar;
        metodo = "PUT";
    }

    try {
        let respuesta = await fetch(direccion, {
            method: metodo,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(datos)
        });
        let resultado = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(resultado.detail || "No se pudo guardar el personaje.");
        }

        formulario.reset();
        idEditar = 0;
        guardar.textContent = "+ Guardar luchador";
        cancelar.classList.add("oculto");
        tituloFormulario.textContent = "Añadir luchador";
        mostrarMensaje(metodo === "POST" ? "Luchador registrado." : "Cambios guardados.", false);
        await cargarPersonajes();
    } catch (error) {
        mostrarMensaje("No se pudo guardar. Comprueba tu conexión e inténtalo de nuevo.", true);
    }
});

function prepararEdicion(id) {
    let personaje = personajes.find(function(item) {
        return item.id === id;
    });
    if (!personaje) return;

    document.getElementById("nombre").value = personaje.nombre;
    document.getElementById("franquicia").value = personaje.franquicia;
    document.getElementById("tipo_luchador").value = personaje.tipo_luchador;
    document.getElementById("habilidad").value = personaje.habilidad;
    document.getElementById("escenario").value = personaje.escenario;

    idEditar = id;
    guardar.textContent = "Guardar cambios";
    cancelar.classList.remove("oculto");
    tituloFormulario.textContent = "Editar luchador";
    mostrarMensaje("Editando: " + personaje.nombre, false);
    document.getElementById("nombre").focus();
    window.scrollTo({top: 0, behavior: "smooth"});
}

cancelar.addEventListener("click", function() {
    formulario.reset();
    idEditar = 0;
    guardar.textContent = "+ Guardar luchador";
    cancelar.classList.add("oculto");
    tituloFormulario.textContent = "Añadir luchador";
    mostrarMensaje("", false);
});

async function borrarPersonaje(id, nombre) {
    if (!confirm("¿Quieres eliminar a " + nombre + " del roster?")) return;

    try {
        let respuesta = await fetch(API_URL + "/personajes/" + id, {method: "DELETE"});
        let resultado = await respuesta.json();
        if (!respuesta.ok) {
            throw new Error(resultado.detail || "No se pudo eliminar el personaje.");
        }
        mostrarMensaje(nombre + " fue eliminado.", false);
        await cargarPersonajes();
    } catch (error) {
        mostrarMensaje("No se pudo eliminar. Inténtalo de nuevo.", true);
    }
}

busqueda.addEventListener("input", mostrarPersonajes);
cargarPersonajes();


let ejemplos = {
    mario: {nombre: "Mario", franquicia: "Super Mario", tipo_luchador: "Equilibrado", habilidad: "Bola de fuego y Mario Tornado", escenario: "Reino Champiñón"},
    link: {nombre: "Link", franquicia: "The Legend of Zelda", tipo_luchador: "Espadachín", habilidad: "Arco, bumerán y bomba remota", escenario: "Gran Meseta"},
    kirby: {nombre: "Kirby", franquicia: "Kirby", tipo_luchador: "Técnico", habilidad: "Tragar y copiar habilidades", escenario: "Fuente de los Sueños"},
    pikachu: {nombre: "Pikachu", franquicia: "Pokémon", tipo_luchador: "Velocista", habilidad: "Rayo y Placaje Eléctrico", escenario: "Estadio Pokémon 2"}
};

document.querySelectorAll(".usar-ejemplo").forEach(function(boton) {
    boton.addEventListener("click", function() {
        let ejemplo = ejemplos[boton.dataset.ejemplo];
        if (!ejemplo) return;
        document.getElementById("nombre").value = ejemplo.nombre;
        document.getElementById("franquicia").value = ejemplo.franquicia;
        document.getElementById("tipo_luchador").value = ejemplo.tipo_luchador;
        document.getElementById("habilidad").value = ejemplo.habilidad;
        document.getElementById("escenario").value = ejemplo.escenario;
        idEditar = 0;
        guardar.textContent = "+ GUARDAR LUCHADOR";
        cancelar.classList.add("oculto");
        tituloFormulario.textContent = "Añadir luchador";
        mostrarMensaje("Ejemplo cargado. Puedes modificarlo antes de guardar.", false);
        document.getElementById("formulario-panel").scrollIntoView({behavior: "smooth"});
        document.getElementById("nombre").focus({preventScroll: true});
    });
});
