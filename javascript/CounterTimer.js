
// Tomo los elementos necesarios (botones - inputs del cronometro/timer, etc)

let documento = document.getElementById("container")
let btnAumentar = document.getElementById("btn-aumentar")
let btnDisminiur = document.getElementById("btn-disminuir")
let btnStartDown = document.getElementById("btn-temporizador")
let btnStartUp = document.getElementById("btn-cronometro")
let btnReset = document.getElementById("btn-reset")
let registroVueltas = document.getElementsByClassName("registros")[0]
let inputs = Array.from(document.getElementsByClassName('number'));
let counterTimer = document.getElementsByClassName("counter-timer")

// Creo clase "vuelta" para el array de registros de vueltas
class vuelta {
    constructor(numero, tiempo, diferencia, nombre) {
        this.numero = numero,
            this.tiempo = tiempo,
            this.diferencia = diferencia,
            this.nombre = nombre
    }

}


let vueltas = [] // Array de vueltas donde llevaré los registros

// Parseo los numeros del cronometro/timer (si es contador tomo solo 1 elemento, si es Timer tmb los otros)
function parseNumbers(array) {

    segundos = Number(array[0].innerHTML)

    if (array.length > 1) {
        miliseg = Number(array[0].innerHTML)
        segundos = Number(array[1].value);
        minutos = Number(array[2].value)
    }
}

parseNumbers(inputs)
let cronRunning = false // variable para saber si el timer/crono está corriendo         
let timerRunning = false // variable para saber si el timer/crono está corriendo         

// Agregor los eventlisteners para cada elemento.

btnReset.addEventListener("click", () => {
    segundos = 0
    counterTimer[0].innerHTML = `<p class="number">${segundos}</p>`
    vueltas = [];
    registroVueltas.innerHTML = "";
    btnStartDown.classList.add("boton-disabled")
})

btnAumentar.addEventListener("click", () => {
    segundos = segundos + 1;
    counterTimer[0].innerHTML = `<p class="number">${segundos}</p>`

    segundos < 0 ? (
        btnStartUp.classList.add("boton-disabled"),
        btnStartDown.classList.add("boton-disabled")
    ) : (
        btnStartUp.classList.remove("boton-disabled"),
        segundos > 0 && btnStartDown.classList.remove("boton-disabled")
    )
})


btnDisminiur.addEventListener("click", () => {

    segundos = segundos - 1;
    counterTimer[0].innerHTML = `<p class="number">${segundos}</p>`

    segundos < 1 && btnStartDown.classList.add("boton-disabled")
    segundos < 0 && btnStartUp.classList.add("boton-disabled")

})


btnStartDown.addEventListener("click", () => {
    registroVueltas.innerHTML = "";
    if (btnStartDown.innerText == "INICIAR TEMPORIZADOR") {
        countDown()
    } else {
        stopTimer()
    }
})

btnStartUp.addEventListener("click", () => {

    if (btnStartUp.innerText == "INICIAR CRONOMETRO") {
        timerUp()
        segundos >= 0 && mostrarBtnVueltas()
    } else {
        stopTimer()
    }
})

// Declaracion de Funciones

function countDown() {

    if ((!cronRunning) && segundos > 0) {
        (intervalo = setInterval(timer, 1000))
    }
}

function timer() {

    if (segundos > 0) {
        timerRunning = true;
        btnStartDown.innerText = "DETENER TEMPORIZADOR"
        btnStartUp.classList.add("boton-disabled")

        segundos = segundos - 1;
        counterTimer[0].innerHTML = `<p class="number">${segundos}</p>`

    } else {
        stopTimer()
        backgrounChanger()
    };
}

function backgrounChanger() {
    btnStartDown.innerHTML = "Temporizador OK";
    transicionBG = setInterval(colorBG, 2000)
}

function colorBG() {
    if (documento.classList.contains("fondo-temporizador")) {
        documento.classList.remove("fondo-temporizador")
    } else {
        documento.classList.add("fondo-temporizador");
    }
}

function timerUp() {
    !timerRunning && (intervalo = setInterval(cronometro, 1000))
}

function cronometro() {
    cronRunning = true;
    if (segundos >= 0) {
        btnStartDown.classList.add("boton-disabled")
        btnStartUp.innerText = "DETENER CRONOMETRO"
        segundos = segundos + 1;
        counterTimer[0].innerHTML = `<p class="number">${segundos}</p>`
        running = true
    } else {
        stopTimer()
    };
}

function stopTimer() {
    btnStartDown.innerText = "INICIAR TEMPORIZADOR"
    btnStartUp.innerText = "INICIAR CRONOMETRO"
    segundos > 0 && btnStartDown.classList.remove("boton-disabled")
    segundos >= 0 && btnStartUp.classList.remove("boton-disabled")
    clearInterval(intervalo);
    cronRunning = false;
    timerRunning = false;

}

// Registro de vueltas

function mostrarBtnVueltas() {
    registroVueltas.innerHTML = `
    <button class="boton-panel" id="btn-vueltas" onclick="registroVuelta()"}>MARCAR VUELTA</button>
    <button class="boton-panel" id="btn-vueltas" onclick="BorrarVueltas()"}>BORRAR VUELTAS</button>
    `

}

function registroVuelta() {

    let cantidadRegistros = vueltas.length
    let numero = (cantidadRegistros === 0 ? 1 : (cantidadRegistros + 1))

    // Calculo diferencia con la vuelta anterior
    let tiempoAnterior = cantidadRegistros === 0 ? 0 : (vueltas[cantidadRegistros - 1].tiempo)
    let tiempo = segundos;
    let diferencia = segundos - tiempoAnterior

    let nombre = "Inserte Nombre"
    let marca = new vuelta(numero, tiempo, diferencia, nombre)
    vueltas.push(marca)

    mostrarVueltasPantalla(vueltas, cantidadRegistros)
}

function BorrarVueltas() {
    vueltas = [];
    registroVueltas.innerHTML = `
    <button class="boton-panel" id="btn-vueltas" onclick="registroVuelta()"}>MARCAR VUELTA</button>
    <button class="boton-panel" id="btn-vueltas" onclick="BorrarVueltas()"}>BORRAR VUELTAS</button>
    `
}


function mostrarVueltasPantalla(vueltas, posicion) {

    registro = document.createElement("div")
    registro.classList.add("listadoRegistros")
    registro.innerText = (`Vuelta N° ${vueltas[posicion].numero} - Tiempo ${vueltas[posicion].tiempo} - Diferencia ${vueltas[posicion].diferencia} - `
    )

    nombreVuelta = document.createElement("input")
    nombreVuelta.type = "text"
    nombreVuelta.placeholder = vueltas[posicion].nombre
    nombreVuelta.classList = "inputRegistros"

    registro.appendChild(nombreVuelta)
    registroVueltas.appendChild(registro)

}