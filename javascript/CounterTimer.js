
// Tomo los elementos necesarios (botones - inputs del cronometro/timer, etc)

let documento = document.getElementById("container")
let btnContador = document.getElementById("btn-contador")
let btnTiempo = document.getElementById("btn-tiempo")
let btnAumentar = document.getElementById("btn-aumentar")
let btnDisminiur = document.getElementById("btn-disminuir")
let btnStartDown = document.getElementById("btn-temporizador")
let btnStartUp = document.getElementById("btn-cronometro")
let btnReset = document.getElementById("btn-reset")
let registroVueltas = document.getElementsByClassName("registros")[0]
let botonesRegistros = document.getElementsByClassName("botones-registros")[0]
let counterTimer = document.getElementsByClassName("counter-timer")

// Creo clase "vuelta" para el array de registros de vueltas
class vueltaContador {
    constructor(numero, tiempo, diferencia, nombre) {
        this.numero = numero,
            this.tiempo = tiempo,
            this.diferencia = diferencia,
            this.nombre = nombre
    }

}
class vueltaTiempo {
    constructor(numero, segundos, minutos, miliseg, diferencia, nombre) {
        this.numero = numero,
            this.segundos = segundos,
            this.minutos = minutos,
            this.miliseg = miliseg,
            this.diferencia = diferencia,
            this.nombre = nombre
    }

}

let registrosContador = [] // Array de vueltas donde llevaré los registros modo Contador
let registrosTiempo = [] // Array de vueltas donde llevaré los registros modo Tiempo
let modo = "contador" // inicializo en modo "contador" la pantalla
mostrarContador()


// al boton de Contador / Tiempo los tomo y asigno funcion para mostrar cada pantalla
btnContador.addEventListener("click", () => { mostrarContador() })
btnTiempo.addEventListener("click", () => { mostrarTiempo() })

function mostrarContador() {
    modo = "contador"
    registroVueltas.innerHTML = "";
    botonesRegistros.innerHTML = "";
    btnTiempo.classList.remove("boton-modo-active")
    btnContador.classList.add("boton-modo-active")
    counterTimer[0].innerHTML = `
    <p class="number">00</p>`
    let inputs = Array.from(document.getElementsByClassName('number'));
    parseNumbers(inputs)
}

function mostrarTiempo() {
    modo = "tiempo"
    registroVueltas.innerHTML = "";
    botonesRegistros.innerHTML = "";
    btnContador.classList.remove("boton-modo-active")
    btnTiempo.classList.add("boton-modo-active")
    counterTimer[0].innerHTML = `
                <input class = "number" type="text" maxlength="2" value="00" onchange="setMinutos(this.value)">:
                <input class = "number" type="text" maxlength="2" value="00" onchange="setSegundos(this.value)">:
                <input class = "number" type="text" maxlength="2" value="00" onchange="setMiliseg(this.value)">    
    `
    let inputs = Array.from(document.getElementsByClassName('number'));
    parseNumbers(inputs)

}

// Parseo los numeros del cronometro/timer (si es contador tomo solo 1 elemento, si es Timer tmb los otros)
function parseNumbers(array) {

    segundos = Number(array[0].innerHTML)

    if (array.length > 1) {
        miliseg = Number(array[2].value)
        segundos = Number(array[1].value);
        minutos = Number(array[0].value)
    }
}

let cronRunning = false // var para saber si el crono esta corriendo, impide que ejecute el timer si true        
let timerRunning = false // var para saber si el timer esta corriendo, impide que ejecute el crono si true     

// Agrego los eventlisteners para el resto de elementos.

// Boton de Reset - Vuelve seg a 0, borra registros de vueltas.
btnReset.addEventListener("click", () => {
    modo === "contador" ? (mostrarContador(), registrosContador = []) : (mostrarTiempo(), registrosTiempo = [])
    segundos = 0;
    registroVueltas.innerHTML = "";
    botonesRegistros.innerHTML = "";
    btnStartDown.classList.add("boton-disabled")
})

// Boton de Aumentar. Depende del modo, funciona de una u otra manera. Establece estilos de botones de acuerdo a el tiempo indicado en pantalla
btnAumentar.addEventListener("click", () => {

    if (modo == "contador") {
        segundos = segundos + 1;
        pintarModoContador ()

        segundos < 0 ? (
            btnStartUp.classList.add("boton-disabled"),
            btnStartDown.classList.add("boton-disabled")
        ) : (
            btnStartUp.classList.remove("boton-disabled"),
            segundos > 0 && btnStartDown.classList.remove("boton-disabled")
        )
    } else {
        segundos = segundos + 1;
        segundos > 59 && (segundos = 0, minutos = minutos + 1)
        pintarModoTiempo()

        if (segundos < 0 || minutos < 0 || miliseg < 0) {
            btnStartUp.classList.add("boton-disabled")
            btnStartDown.classList.add("boton-disabled")
        } else {
            btnStartUp.classList.remove("boton-disabled")
            if (segundos > 0 || minutos > 0) {
                btnStartDown.classList.remove("boton-disabled")
            }
        }
    }
})


// Boton de Disminuir. Depende del modo, funciona de una u otra manera. Establece estilos de botones de acuerdo a el tiempo indicado en pantalla
btnDisminiur.addEventListener("click", () => {

    if (modo == "contador") {
        segundos = segundos - 1;
        pintarModoContador ()
        segundos < 1 && btnStartDown.classList.add("boton-disabled")
        segundos < 0 && btnStartUp.classList.add("boton-disabled")
    } else {
        segundos = segundos - 1;
        segundos < 0 && (segundos = 59, minutos = minutos - 1)
        pintarModoTiempo()

        if (segundos < 0 || minutos < 0) {
            btnStartUp.classList.add("boton-disabled")
            btnStartDown.classList.add("boton-disabled")
        } else {
            if (segundos === 0 && minutos === 0) {
                btnStartDown.classList.add("boton-disabled")
            }
        }
    }
})

// Boton de temporizador (hacia abajo el tiempo).
btnStartDown.addEventListener("click", () => {
    if (btnStartDown.innerText == "INICIAR TEMPORIZADOR") {
        countDown()
        botonesRegistros.innerHTML = ""
    } else {
        stopTimer()
    }
})

// Boton de cronometro (hacia arriba)
btnStartUp.addEventListener("click", () => {
    if (!timerRunning) {
        if (btnStartUp.innerText == "INICIAR CRONOMETRO") {
            timerUp()
            if (modo == "contador" && segundos >= 0) {
                mostrarBtnVueltas()
            }
            else {
                if (segundos >= 0 && minutos >= 0) {
                    mostrarBtnVueltas();
                }
            }
        } else {
            stopTimer()
        }
    }
}
)

// Declaracion de Funciones para Temporizador (tiempo hacia abajo)

function countDown() {

    if (modo == "contador") {
        if (!cronRunning && segundos > 0) {
            registroVueltas.innerHTML = "";
            btnStartDown.innerText = "DETENER TEMPORIZADOR"
            intervalo = setInterval(timer, 1000)
        }
    } else {
        if (!cronRunning) {
            if ((segundos >= 0) && (minutos >= 0) && (miliseg >= 0)) {
                if ((segundos + minutos + miliseg) > 0) {
                    registroVueltas.innerHTML = "";
                    btnStartDown.innerText = "DETENER TEMPORIZADOR"
                    intervalo = setInterval(timer, 10)
                }
            }
        }
    }
}


function timer() {

    if (modo == "contador") {
        if (segundos > 0) {
            timerRunning = true;
            btnStartUp.classList.add("boton-disabled")

            if (modo == "contador") {
                segundos = segundos - 1;
                pintarModoContador ()
            }
        } else {
            stopTimer()
            backgrounChanger()
        }
    }

    if (modo == "tiempo") {

        if (minutos >= 0 && segundos >= 0 && miliseg >= 0) {

            timerRunning = true;
            btnStartUp.classList.add("boton-disabled")

            if (miliseg > 0) {
                miliseg = miliseg - 1;
            } else {
                if (segundos > 0) {
                    miliseg = 99;
                    segundos = segundos - 1;
                } else {
                    if (minutos > 0) {
                        miliseg = 99;
                        segundos = 59;
                        minutos = minutos - 1;
                    } else {
                        stopTimer()
                        backgrounChanger()
                    }
                }
            }

            pintarModoTiempo()
        }
    }
}


// Funcion para cambiar el fondo cada 2 seg cuando llega el timer a 0.
function backgrounChanger() {
    documento.classList.add("fondo-temporizador")
    btnStartDown.innerHTML = "Temporizador OK";
    btnStartDown.addEventListener("click", () => {
        clearInterval(transicionBG)
        documento.classList.remove("fondo-temporizador")
    })
    transicionBG = setInterval(colorBG, 2000)
}

function colorBG() {
    if (documento.classList.contains("fondo-temporizador")) {
        documento.classList.remove("fondo-temporizador")
    } else {
        documento.classList.add("fondo-temporizador");
    }
}


// Funciones para CRONOMETRO (tiempo hacia arriba)
function timerUp() {
    if (!timerRunning) {
        (modo == "contador") ? intervalo = setInterval(cronometro, 1000) : intervalo = setInterval(cronometro, 10)
    }
}

function cronometro() {
    if (modo == "contador") {
        if (segundos >= 0) {
            cronRunning = true;
            btnStartDown.classList.add("boton-disabled")
            btnStartUp.innerText = "DETENER CRONOMETRO"
            segundos = segundos + 1;
            pintarModoContador ()
        }
        else { stopTimer() }

    } else {
        if (minutos >= 0 && miliseg >= 0) {
            cronRunning = true;
            btnStartDown.classList.add("boton-disabled")
            btnStartUp.innerText = "DETENER CRONOMETRO"

            miliseg = miliseg + 1;
            miliseg > 99 && (segundos = segundos + 1, miliseg = 0)
            segundos > 59 && (segundos = 0, minutos = minutos + 1)
            pintarModoTiempo()
        } else {
            stopTimer()
        }
    }
}

// Funcion cuando presionas DETENER en algun momento
function stopTimer() {
    btnStartDown.innerText = "INICIAR TEMPORIZADOR"
    btnStartUp.innerText = "INICIAR CRONOMETRO"
    clearInterval(intervalo);
    cronRunning = false;
    timerRunning = false;

    if (modo == "contador") {
        segundos >= 0 && btnStartDown.classList.remove("boton-disabled")
        segundos >= 0 && btnStartUp.classList.remove("boton-disabled")
    } else {
        if (segundos >= 0 && minutos >= 0) {
            btnStartUp.classList.remove("boton-disabled")
            btnStartDown.classList.remove("boton-disabled")
        }
    }
}

// Registro de vueltas. Botones. Listados de Marcas.

function mostrarBtnVueltas() {

    let mostrarBorrar = false

    if (modo == "contador") {
        if (registrosContador.length > 0) {
            mostrarBorrar = true
        }
    } else {
        if (registrosTiempo.length > 0) {
            mostrarBorrar = true
        }
    }

    (mostrarBorrar) ? (
        botonesRegistros.innerHTML = `
    <button class="boton-panel" id="btn-vueltas" onclick="registroVuelta()"}>MARCAR VUELTA</button>
    <button class="boton-panel" id="btn-vueltas" onclick="BorrarVueltas()"}>BORRAR VUELTAS</button>
    `) :
        (botonesRegistros.innerHTML = `
    <button class="boton-panel" id="btn-vueltas" onclick="registroVuelta()"}>MARCAR VUELTA</button>`
        )
}

function registroVuelta() {

    // Para el modo contador    
    if (modo == "contador") {

        let cantidadRegistros = registrosContador.length
        let numero = (cantidadRegistros === 0 ? 1 : (cantidadRegistros + 1))

        if (cantidadRegistros === 0) {
            botonesRegistros.innerHTML = `
        <button class="boton-panel" id="btn-vueltas" onclick="registroVuelta()"}>MARCAR VUELTA</button>
        <button class="boton-panel" id="btn-vueltas" onclick="BorrarVueltas()"}>BORRAR VUELTAS</button>`
        }

        // Calculo diferencia con la vuelta anterior

        let tiempo = segundos;
        let tiempoAnterior = cantidadRegistros === 0 ? 0 : (registrosContador[cantidadRegistros - 1].tiempo)
        let diferencia = segundos - tiempoAnterior
        let nombre = "Insert Your Name"
        let marca = new vueltaContador(numero, tiempo, diferencia, nombre)

        registrosContador.push(marca)
        mostrarVueltasPantalla(registrosContador)

    } else { // Para el MODO TIEMPO

        let minutosAnterior, segundosAnterior, milisegAnterior, minutosDiferencia, segundosDiferencia, milisegDiferencia;

        let cantidadRegistros = registrosTiempo.length
        let numero = (cantidadRegistros === 0 ? 1 : (cantidadRegistros + 1))

        if (cantidadRegistros === 0) {
            botonesRegistros.innerHTML = `
        <button class="boton-panel" id="btn-vueltas" onclick="registroVuelta()"}>MARCAR VUELTA</button>
        <button class="boton-panel" id="btn-vueltas" onclick="BorrarVueltas()"}>BORRAR VUELTAS</button>`
        }

        // Tomo los tiempos de la vuelta anterior (min, seg y milisg)
        if (cantidadRegistros === 0) {
            minutosAnterior = 0;
            segundosAnterior = 0;
            milisegAnterior = 0;

        } else {
            minutosAnterior = registrosTiempo[cantidadRegistros - 1].minutos;
            segundosAnterior = registrosTiempo[cantidadRegistros - 1].segundos;
            milisegAnterior = registrosTiempo[cantidadRegistros - 1].miliseg;
        }

        // Calculo Minutos de Diferencia

        if (minutos > minutosAnterior) {
            minutosDiferencia = minutos - minutosAnterior
            if (segundos < segundosAnterior) {
                minutosDiferencia = minutosDiferencia - 1
            }
        } else {
            minutosDiferencia = 0;
        }

        (minutosDiferencia < 9) ? (minutosDiferencia = "0" + minutosDiferencia) : (minutosDiferencia)

        // Calculo Segundos de Diferencia

        if (segundos >= segundosAnterior) {
            segundosDiferencia = segundos - segundosAnterior;
        } else {
            segundosDiferencia = 60 + segundos - segundosAnterior
        }

        if ((miliseg < milisegAnterior) && (segundos !== segundosAnterior)) {
            segundosDiferencia = segundosDiferencia - 1;
        }

        (segundosDiferencia < 9) ? (segundosDiferencia = "0" + segundosDiferencia) : (segundosDiferencia)

        // Calculo miliseg de Diferencia

        if (miliseg >= milisegAnterior) {
            milisegDiferencia = miliseg - milisegAnterior;
        } else {
            milisegDiferencia = 100 + miliseg - milisegAnterior
        }

        (milisegDiferencia < 9) ? (milisegDiferencia = "0" + milisegDiferencia) : (milisegDiferencia)

        // Uno los 3 calculos para tener la diferencia en una sola variable:

        let diferencia = `${minutosDiferencia}:${segundosDiferencia}:${milisegDiferencia}`

        // Resto de variables del Array de registros en modo TIEMPO

        let nombre = "Insert Your Name"
        let marca = new vueltaTiempo(numero, segundos, minutos, miliseg, diferencia, nombre)
        registrosTiempo.push(marca)

        mostrarVueltasPantalla(registrosTiempo)
    }


}

function BorrarVueltas() {
    (modo == "contador") ? registrosContador = [] : registrosTiempo = [];
    registroVueltas.innerHTML = ""
    botonesRegistros.innerHTML = `
    <button class="boton-panel" id="btn-vueltas" onclick="registroVuelta()"}>MARCAR VUELTA</button>
    `
}


function mostrarVueltasPantalla(vueltas) {

    registroVueltas.innerHTML = ""

    vueltas.forEach((vuelta, index) => {


        posicion = vuelta.numero;
        newRegistro = document.createElement('div')
        if (modo == "contador") {
            newRegistro.innerText = (`Vuelta N° ${vuelta.numero} - Tiempo ${vuelta.tiempo} seg. - Diferencia ${vuelta.diferencia} seg. - `)
        } else {
            newRegistro.innerText = (`Vuelta N° ${vuelta.numero}- Tiempo ${(vuelta.minutos <= 9) ? "0" + (vuelta.minutos) : (vuelta.minutos)}:${(vuelta.segundos <= 9) ? "0" + (vuelta.segundos) : (vuelta.segundos)}:${(vuelta.miliseg <= 9) ? "0" + (vuelta.miliseg) : (vuelta.miliseg)}.- Diferencia ${vuelta.diferencia} seg. - `)
        }

        nombreVuelta = document.createElement("input")
        nombreVuelta.type = "text"
        nombreVuelta.placeholder = vuelta.nombre
        nombreVuelta.classList = "inputRegistros"
        nombreVuelta.setAttribute("onchange", `mostrarMensaje(this.value,${vuelta.numero - 1})`)

        newRegistro.appendChild(nombreVuelta)

        registroVueltas.appendChild(newRegistro)

    });

}

// Funciones para tomar los valores cuando cambias "a mano" los valores de minutos/seg/miliseg en el modo TIEMPO
function setMinutos(val) {
    minutos = Number(val);
}
function setSegundos(val) {
    segundos = Number(val);
}
function setMiliseg(val) {
    miliseg = Number(val);
}

const mostrarMensaje = (value, numero) => {

    if (modo == "contador") {
        registrosContador[numero].nombre = value
    } else {
        registrosTiempo[numero].nombre = value
    }

}



function pintarModoTiempo() {
    counterTimer[0].innerHTML = `
    <input class = "number" type="text" maxlength="2" value=${((minutos <= 9 && minutos >= 0) ? ("0" + minutos) : minutos)} onchange="setMinutos(this.value)">:
    <input class = "number" type="text" maxlength="2" value=${((segundos <= 9 && segundos >= 0) ? ("0" + segundos) : segundos)} onchange="setSegundos(this.value)">:
    <input class = "number" type="text" maxlength="2" value=${((miliseg <= 9 && miliseg >= 0) ? ("0" + miliseg) : miliseg)} onchange="setMiliseg(this.value)">    
    `
}

function pintarModoContador () {
    counterTimer[0].innerHTML = `<p class="number">${((segundos <= 9 && segundos >= 0) ? ("0" + segundos) : segundos)}</p>`
}
