/* =========================================
   🎄 POZITO NAVIDEÑO 2026
   SISTEMA PRINCIPAL
========================================= */


/* =========================================
   LOCALSTORAGE
   DATOS INDEPENDIENTES DEL
   POZITO PRIMAVERAL
========================================= */

const KEY_JUGADORES =
    "POZITO_NAVIDENO_2026_JUGADORES_V1";

const KEY_RESUMEN =
    "POZITO_NAVIDENO_2026_RESUMEN_V1";

const KEY_RULETA =
    "POZITO_NAVIDENO_2026_RULETA_V1";


/* =========================================
   CARGAR JUGADORES
========================================= */

let jugadores =
    JSON.parse(
        localStorage.getItem(
            KEY_JUGADORES
        )
    ) || [];


/* =========================================
   FECHAS DEL CONCURSO
   04 OCTUBRE - 22 DICIEMBRE 2026
========================================= */

const inicio =
    new Date(
        2026,
        9,
        4
    );


const fin =
    new Date(
        2026,
        11,
        22
    );


let fechas = [];


/* =========================================
   GENERAR FECHAS
========================================= */

function generarFechas() {

    fechas = [];

    let fecha =
        new Date(inicio);


    while(fecha <= fin) {

        fechas.push(
            fecha.toLocaleDateString(
                "es-ES"
            )
        );


        fecha.setDate(
            fecha.getDate() + 1
        );

    }

}


/* =========================================
   GUARDAR
========================================= */

function guardar() {

    localStorage.setItem(

        KEY_JUGADORES,

        JSON.stringify(
            jugadores
        )

    );

}


/* =========================================
   CALCULAR TOTAL
========================================= */

function calcularTotal(jugador) {

    let total = 0;


    for(
        let fecha in jugador.puntos
    ) {

        total +=
            Number(
                jugador.puntos[fecha]
            ) || 0;

    }


    return total;

}


/* =========================================
   RELOJ
========================================= */

function actualizarReloj() {

    let ahora =
        new Date();


    let fecha =
        document.getElementById(
            "fechaActual"
        );


    let hora =
        document.getElementById(
            "horaActual"
        );


    if(fecha) {

        fecha.innerHTML =
            "📅 " +
            ahora.toLocaleDateString(
                "es-ES"
            );

    }


    if(hora) {

        hora.innerHTML =
            "🕒 " +
            ahora.toLocaleTimeString(
                "es-ES"
            );

    }

}


setInterval(
    actualizarReloj,
    1000
);


/* =========================================
   ESTADISTICAS
========================================= */

function actualizarEstadisticas() {

    let cantidad =
        document.getElementById(
            "cantidadJugadores"
        );


    let lider =
        document.getElementById(
            "liderActual"
        );


    let puntos =
        document.getElementById(
            "puntosTotales"
        );


    let promedio =
        document.getElementById(
            "promedioPuntos"
        );


    if(!cantidad)
        return;


    cantidad.textContent =
        jugadores.length;


    let totalGeneral = 0;

    let mayor = -1;

    let mejor = "-";


    jugadores.forEach(
        jugador => {

            let total =
                calcularTotal(
                    jugador
                );


            totalGeneral +=
                total;


            if(total > mayor) {

                mayor = total;

                mejor =
                    jugador.nombre;

            }

        }
    );


    lider.textContent =
        mejor;


    puntos.textContent =
        totalGeneral;


    let prom = 0;


    if(jugadores.length > 0) {

        prom =
            Math.round(
                totalGeneral /
                jugadores.length
            );

    }


    promedio.textContent =
        prom;

}


/* =========================================
   NORMALIZAR NOMBRE
========================================= */

function normalizarNombre(nombre) {

    return nombre
        .trim()
        .replace(/\s+/g, " ")
        .toUpperCase();

}


/* =========================================
   AGREGAR JUGADOR
   SE PERMITEN NOMBRES REPETIDOS
========================================= */

function agregarJugador() {

    let nombre =
        prompt(
            "🎄 Nombre del participante:"
        );


    if(nombre === null)
        return;


    nombre =
        normalizarNombre(
            nombre
        );


    if(nombre.length < 2) {

        alert(
            "❌ El nombre debe tener al menos 2 caracteres"
        );

        return;

    }


    jugadores.push({

        nombre: nombre,

        puntos: {}

    });


    guardar();

    renderTabla();

    actualizarEstadisticas();


    alert(
        "🎅 Participante agregado:\n\n" +
        nombre
    );

}


/* =========================================
   ENCABEZADO TABLA
========================================= */

function renderEncabezado() {

    const encabezado =
        document.getElementById(
            "encabezado"
        );


    if(!encabezado)
        return;


    encabezado.innerHTML = `

        <th>
            🎅 JUGADOR
        </th>

    `;


    fechas.forEach(
        fecha => {

            let th =
                document.createElement(
                    "th"
                );


            th.textContent =
                fecha;


            encabezado.appendChild(
                th
            );

        }
    );


    let total =
        document.createElement(
            "th"
        );


    total.textContent =
        "🏆 TOTAL";


    encabezado.appendChild(
        total
    );


    let acciones =
        document.createElement(
            "th"
        );


    acciones.textContent =
        "⚙️ ACCIONES";


    encabezado.appendChild(
        acciones
    );

}


/* =========================================
   CREAR TABLA
========================================= */

function renderTabla() {

    const tbody =
        document.getElementById(
            "tbody"
        );


    if(!tbody)
        return;


    let lista =
        [...jugadores];


    /* =====================================
       BUSCADOR
    ===================================== */

    let buscador =
        document.getElementById(
            "buscador"
        );


    let texto = "";


    if(buscador) {

        texto =
            buscador.value
                .toLowerCase()
                .trim();

    }


    lista =
        lista.filter(
            jugador =>
                jugador.nombre
                    .toLowerCase()
                    .includes(texto)
        );


    /* =====================================
       ORDEN
    ===================================== */

    let orden =
        document.getElementById(
            "orden"
        );


    let tipo =
        orden
            ? orden.value
            : "puntaje";


    if(tipo === "puntaje") {

        lista.sort(
            (a,b) =>
                calcularTotal(b) -
                calcularTotal(a)
        );

    }


    if(tipo === "az") {

        lista.sort(
            (a,b) =>
                a.nombre.localeCompare(
                    b.nombre
                )
        );

    }


    if(tipo === "za") {

        lista.sort(
            (a,b) =>
                b.nombre.localeCompare(
                    a.nombre
                )
        );

    }


    tbody.innerHTML = "";


    /* =====================================
       FILAS
    ===================================== */

    lista.forEach(
        (jugador,index) => {

            let fila =
                document.createElement(
                    "tr"
                );


            /* =============================
               NOMBRE
            ============================= */

            let nombre =
                document.createElement(
                    "td"
                );


            nombre.className =
                "nombre";


            let icono = "";


            if(index === 0)
                icono = "🥇 ";


            if(index === 1)
                icono = "🥈 ";


            if(index === 2)
                icono = "🥉 ";


            nombre.textContent =
                icono +
                jugador.nombre;


            fila.appendChild(
                nombre
            );


            /* =============================
               PUNTOS POR FECHA
            ============================= */

            fechas.forEach(
                fecha => {

                    let td =
                        document.createElement(
                            "td"
                        );


                    let input =
                        document.createElement(
                            "input"
                        );


                    input.type =
                        "number";


                    input.min =
                        0;


                    input.value =
                        jugador.puntos[fecha]
                        ?? "";


                    input.oninput =
                        function() {

                            if(
                                this.value === ""
                            ) {

                                delete
                                    jugador.puntos[
                                        fecha
                                    ];

                            }
                            else {

                                let valor =
                                    Number(
                                        this.value
                                    );


                                if(valor < 0) {

                                    this.value =
                                        0;

                                    valor = 0;

                                }


                                jugador.puntos[
                                    fecha
                                ] =
                                    valor;

                            }


                            guardar();


                            total.textContent =
                                calcularTotal(
                                    jugador
                                );


                            actualizarEstadisticas();

                            mostrarPodio();

                        };


                    td.appendChild(
                        input
                    );


                    fila.appendChild(
                        td
                    );

                }
            );


            /* =============================
               TOTAL
            ============================= */

            let total =
                document.createElement(
                    "td"
                );


            total.className =
                "total";


            total.textContent =
                calcularTotal(
                    jugador
                );


            fila.appendChild(
                total
            );


            /* =============================
               ACCIONES
            ============================= */

            let tdAcciones =
                document.createElement(
                    "td"
                );


            /* EDITAR */

            let editar =
                document.createElement(
                    "button"
                );


            editar.className =
                "btn azul";


            editar.innerHTML =
                "✏️";


            editar.title =
                "Editar participante";


            editar.onclick =
                function() {

                    editarJugador(
                        jugador
                    );

                };


            /* ELIMINAR */

            let eliminar =
                document.createElement(
                    "button"
                );


            eliminar.className =
                "btn rojo";


            eliminar.innerHTML =
                "🗑";


            eliminar.title =
                "Eliminar participante";


            eliminar.onclick =
                function() {

                    if(
                        confirm(
                            "🎄 ¿Eliminar a " +
                            jugador.nombre +
                            "?"
                        )
                    ) {

                        jugadores =
                            jugadores.filter(
                                x =>
                                    x !== jugador
                            );


                        guardar();

                        renderTabla();

                        actualizarEstadisticas();

                        mostrarPodio();

                    }

                };


            tdAcciones.appendChild(
                editar
            );


            tdAcciones.appendChild(
                eliminar
            );


            fila.appendChild(
                tdAcciones
            );


            tbody.appendChild(
                fila
            );

        }
    );


    mostrarPodio();

    actualizarEstadisticas();

}


/* =========================================
   EDITAR JUGADOR
========================================= */

function editarJugador(jugador) {

    let opcion =
        prompt(

            "🎄 ¿Qué deseas editar?\n\n" +

            "1 = Cambiar nombre\n\n" +

            "2 = Cambiar puntaje"

        );


    /* =====================================
       CAMBIAR NOMBRE
    ===================================== */

    if(opcion === "1") {

        let nuevoNombre =
            prompt(
                "Nuevo nombre:",
                jugador.nombre
            );


        if(nuevoNombre === null)
            return;


        nuevoNombre =
            normalizarNombre(
                nuevoNombre
            );


        if(nuevoNombre.length < 2) {

            alert(
                "❌ El nombre debe tener al menos 2 caracteres"
            );

            return;

        }


        jugador.nombre =
            nuevoNombre;


        guardar();

        renderTabla();

        actualizarEstadisticas();


        alert(
            "✅ Nombre cambiado correctamente"
        );


        return;

    }


    /* =====================================
       CAMBIAR PUNTAJE
    ===================================== */

    if(opcion === "2") {

        let fecha =
            prompt(

                "🎅 Escribe la fecha:\n\n" +

                fechas.join("\n")

            );


        if(!fecha)
            return;


        if(
            !fechas.includes(fecha)
        ) {

            alert(
                "❌ Esa fecha no existe"
            );

            return;

        }


        let puntos =
            prompt(

                "⭐ Nuevo puntaje para " +
                fecha

            );


        if(puntos === null)
            return;


        puntos =
            Number(puntos);


        if(
            isNaN(puntos) ||
            puntos < 0
        ) {

            alert(
                "❌ El puntaje debe ser un número válido"
            );

            return;

        }


        jugador.puntos[fecha] =
            puntos;


        guardar();

        renderTabla();

        actualizarEstadisticas();


        alert(
            "✅ Puntaje actualizado correctamente"
        );

    }

}


/* =========================================
   PODIO
========================================= */

function mostrarPodio() {

    let caja =
        document.getElementById(
            "podio"
        );


    if(!caja)
        return;


    caja.innerHTML = "";


    let ranking =
        [...jugadores];


    ranking.sort(
        (a,b) =>
            calcularTotal(b) -
            calcularTotal(a)
    );


    ranking
        .slice(0,3)
        .forEach(
            (jugador,i) => {

                let div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "medalla";


                if(i === 0) {

                    div.classList.add(
                        "oro"
                    );

                }


                if(i === 1) {

                    div.classList.add(
                        "plata"
                    );

                }


                if(i === 2) {

                    div.classList.add(
                        "bronce"
                    );

                }


                let puesto = "";


                if(i === 0)
                    puesto = "👑🥇";


                if(i === 1)
                    puesto = "🥈";


                if(i === 2)
                    puesto = "🥉";


                div.innerHTML = `

                    <h3>
                        ${puesto}
                        ${jugador.nombre}
                    </h3>

                    <p>
                        ⭐
                        ${calcularTotal(jugador)}
                        puntos
                    </p>

                `;


                caja.appendChild(
                    div
                );

            }
        );

}


/* =========================================
   VACIAR TODO
========================================= */

function vaciarTodo() {

    let confirmar =
        confirm(

            "⚠️🎄 ¿Seguro que deseas borrar " +
            "todos los jugadores y puntajes " +
            "del Pozito Navideño?"

        );


    if(!confirmar)
        return;


    jugadores = [];


    localStorage.removeItem(
        KEY_JUGADORES
    );


    guardar();


    renderTabla();

    actualizarEstadisticas();

    mostrarPodio();


    alert(

        "🎄✅ La tabla del Pozito Navideño " +
        "fue limpiada correctamente."

    );

}


/* =========================================
   MODO OSCURO
========================================= */

function modoOscuro() {

    document.body.classList.toggle(
        "oscuro"
    );

}


/* =========================================
   GUARDAR RESPALDO
========================================= */

function guardarRespaldo() {

    let datos =
        JSON.stringify(
            jugadores,
            null,
            2
        );


    let archivo =
        new Blob(
            [datos],
            {
                type:
                    "application/json"
            }
        );


    let enlace =
        document.createElement(
            "a"
        );


    enlace.href =
        URL.createObjectURL(
            archivo
        );


    enlace.download =
        "Pozito_Navideno_2026_Respaldo.json";


    enlace.click();


    URL.revokeObjectURL(
        enlace.href
    );

}


/* =========================================
   RESTAURAR RESPALDO
========================================= */

function restaurarRespaldo() {

    let input =
        document.createElement(
            "input"
        );


    input.type =
        "file";


    input.accept =
        ".json";


    input.onchange =
        function(e) {

            let archivo =
                e.target.files[0];


            if(!archivo)
                return;


            let lector =
                new FileReader();


            lector.onload =
                function() {

                    try {

                        let datos =
                            JSON.parse(
                                lector.result
                            );


                        if(
                            !Array.isArray(
                                datos
                            )
                        ) {

                            throw new Error(
                                "Formato incorrecto"
                            );

                        }


                        jugadores =
                            datos;


                        guardar();

                        renderTabla();

                        actualizarEstadisticas();


                        alert(

                            "🎄✅ Respaldo del " +
                            "Pozito Navideño " +
                            "cargado correctamente."

                        );

                    }
                    catch(error) {

                        alert(
                            "❌ Archivo incorrecto"
                        );

                    }

                };


            lector.readAsText(
                archivo
            );

        };


    input.click();

}


/* =========================================
   RESUMEN
========================================= */

function mostrarResumen() {

    jugadores.forEach(
        jugador => {

            jugador.total =
                calcularTotal(
                    jugador
                );

        }
    );


    jugadores.sort(
        (a,b) =>
            b.total -
            a.total
    );


    localStorage.setItem(

        KEY_RESUMEN,

        JSON.stringify(
            jugadores
        )

    );


    window.location.href =
        "resultado.html";

}


/* =========================================
   RULETA
   SOLO PARTICIPANTES CON 20+ PUNTOS
========================================= */

function irRuleta() {

    let participantes =
        jugadores.filter(
            jugador =>
                calcularTotal(
                    jugador
                ) >= 20
        );


    if(
        participantes.length === 0
    ) {

        alert(

            "❌🎄 No hay jugadores con " +
            "20 puntos o más."

        );

        return;

    }


    localStorage.setItem(

        KEY_RULETA,

        JSON.stringify(
            participantes
        )

    );


    window.location.href =
        "ruleta.html";

}


/* =========================================
   JULY - RECONOCIMIENTO DE VOZ
========================================= */

function activarJuly() {

    if(
        !(
            "webkitSpeechRecognition"
            in window
        )
    ) {

        alert(

            "❌ Tu navegador no soporta " +
            "reconocimiento de voz."

        );

        return;

    }


    let reconocimiento =
        new webkitSpeechRecognition();


    reconocimiento.lang =
        "es-ES";


    reconocimiento.continuous =
        false;


    reconocimiento.interimResults =
        false;


    alert(
        "🎤🎄 JULY está escuchando..."
    );


    reconocimiento.start();


    reconocimiento.onresult =
        function(event) {

            let texto =
                event
                    .results[0][0]
                    .transcript;


            texto =
                texto.toLowerCase();


            console.log(
                "JULY escuchó:",
                texto
            );


            procesarJuly(
                texto
            );

        };


    reconocimiento.onerror =
        function() {

            alert(

                "❌ JULY no pudo escuchar correctamente."

            );

        };

}


/* =========================================
   PROCESAR ORDEN JULY
========================================= */

function procesarJuly(texto) {

    /* =====================================
       AGREGAR PUNTOS
    ===================================== */

    if(
        agregarPuntosJuly(texto)
    ) {

        return;

    }


    /* =====================================
       AGREGAR PERSONA
    ===================================== */

    if(
        texto.includes("agrega")
    ) {

        let nombre =
            texto
                .replace(
                    "july",
                    ""
                )
                .replace(
                    "agrega",
                    ""
                )
                .replace(
                    "a",
                    ""
                )
                .trim();


        if(nombre) {

            crearJugadorJuly(
                nombre
            );


            return;

        }

    }


    /* =====================================
       MODO OSCURO
    ===================================== */

    if(
        texto.includes(
            "modo oscuro"
        )
    ) {

        modoOscuro();

        return;

    }


    /* =====================================
       VACIAR
    ===================================== */

    if(
        texto.includes("vacia") ||
        texto.includes("vacía")
    ) {

        vaciarTodo();

        return;

    }


    alert(
        "❌ JULY no entendió la orden."
    );

}


/* =========================================
   CREAR JUGADOR CON JULY
========================================= */

function crearJugadorJuly(nombre) {

    nombre =
        normalizarNombre(
            nombre
        );


    if(nombre.length < 2) {

        alert(
            "❌ Nombre inválido"
        );

        return;

    }


    jugadores.push({

        nombre: nombre,

        puntos: {}

    });


    guardar();

    renderTabla();

    actualizarEstadisticas();


    alert(

        "🎅✅ JULY agregó a " +
        nombre

    );

}


/* =========================================
   JULY AGREGA PUNTOS
========================================= */

function agregarPuntosJuly(texto) {

    let meses = {

        "enero": 1,

        "febrero": 2,

        "marzo": 3,

        "abril": 4,

        "mayo": 5,

        "junio": 6,

        "julio": 7,

        "agosto": 8,

        "septiembre": 9,

        "setiembre": 9,

        "octubre": 10,

        "noviembre": 11,

        "diciembre": 12

    };


    let numeros =
        texto.match(
            /\d+/g
        );


    if(!numeros) {

        return false;

    }


    let puntos =
        Number(
            numeros[
                numeros.length - 1
            ]
        );


    let fechaVoz =
        texto.match(

            /(\d{1,2}) de ([a-záéíóúñ]+)/

        );


    if(!fechaVoz) {

        return false;

    }


    let dia =
        fechaVoz[1];


    let mes =
        meses[
            fechaVoz[2]
        ];


    if(!mes) {

        return false;

    }


    let fecha =
        dia +
        "/" +
        mes +
        "/2026";


    /* =====================================
       VALIDAR FECHA
    ===================================== */

    if(
        !fechas.includes(
            fecha
        )
    ) {

        alert(

            "❌ Esa fecha está fuera " +
            "del Pozito Navideño 2026.\n\n" +

            "🎄 El concurso es del " +
            "04 de octubre al " +
            "22 de diciembre de 2026."

        );


        return true;

    }


    /* =====================================
       BUSCAR JUGADOR
    ===================================== */

    let jugadorEncontrado =
        null;


    jugadores.forEach(
        jugador => {

            if(
                texto.includes(
                    jugador.nombre
                        .toLowerCase()
                )
            ) {

                jugadorEncontrado =
                    jugador;

            }

        }
    );


    /* =====================================
       SI NO EXISTE, INTENTA CREAR
    ===================================== */

    if(!jugadorEncontrado) {

        let nombres =
            texto.split(" ");


        let posible =
            nombres.find(
                nombre =>

                    nombre.length > 3 &&

                    nombre !== "july" &&

                    nombre !== "agrega" &&

                    nombre !== "puntos"

            );


        if(posible) {

            posible =
                normalizarNombre(
                    posible
                );


            jugadorEncontrado = {

                nombre:
                    posible,

                puntos: {}

            };


            jugadores.push(
                jugadorEncontrado
            );

        }
        else {

            alert(
                "❌ JULY no encontró jugador."
            );

            return true;

        }

    }


    /* =====================================
       ASIGNAR PUNTOS
    ===================================== */

    jugadorEncontrado.puntos[
        fecha
    ] =
        puntos;


    guardar();

    renderTabla();

    actualizarEstadisticas();


    alert(

        "🎄✅ JULY agregó " +
        puntos +
        " puntos a " +
        jugadorEncontrado.nombre +
        " el " +
        fecha

    );


    return true;

}


/* =========================================
   INICIO DEL SISTEMA
========================================= */

generarFechas();

actualizarReloj();

actualizarEstadisticas();

renderEncabezado();

renderTabla();
