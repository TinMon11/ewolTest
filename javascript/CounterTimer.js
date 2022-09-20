
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
// let inputs = Array.from(document.getElementsByClassName('number'));
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
let modo = "contador"
mostrarContador()


btnContador.addEventListener("click", () => { mostrarContador() })
btnTiempo.addEventListener("click", () => { mostrarTiempo() })

function mostrarContador() {
    modo = "contador"
    btnTiempo.classList.remove("boton-modo-active")
    btnContador.classList.add("boton-modo-active")
    counterTimer[0].innerHTML = `
    <p class="number">0</p>`
    let inputs = Array.from(document.getElementsByClassName('number'));
    parseNumbers(inputs)
}

function mostrarTiempo() {
    modo = "tiempo"
    btnContador.classList.remove("boton-modo-active")
    btnTiempo.classList.add("boton-modo-active")
    counterTimer[0].innerHTML = `
                <input class = "number" type="text" maxlength="2" value="00">
                <input class = "number" type="text" maxlength="2" value="00">
                <input class = "number" type="text" maxlength="2" value="00">    
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

// parseNumbers(inputs)
let cronRunning = false // variable para saber si el timer/crono está corriendo         
let timerRunning = false // variable para saber si el timer/crono está corriendo         

// Agregor los eventlisteners para cada elemento.

btnReset.addEventListener("click", () => {
    modo === "contador" ? mostrarContador() : mostrarTiempo()
    segundos = 0;
    vueltas = [];
    registroVueltas.innerHTML = "";
    btnStartDown.classList.add("boton-disabled")
})

btnAumentar.addEventListener("click", () => {

    if (modo == "contador") {
        segundos = segundos + 1;
        counterTimer[0].innerHTML = `<p class="number">${((segundos <= 9 && segundos >= 0) ? ("0" + segundos) : segundos)}</p>`

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
        counterTimer[0].innerHTML = `
        <input class = "number" type="text" maxlength="2" value=${((minutos <= 9 && minutos >= 0) ? ("0" + minutos) : minutos)}>
        <input class = "number" type="text" maxlength="2" value=${((segundos <= 9 && segundos >= 0) ? ("0" + segundos) : segundos)}>
        <input class = "number" type="text" maxlength="2" value=${((miliseg <= 9 && miliseg >= 0) ? ("0" + miliseg) : miliseg)}>    
        `

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


btnDisminiur.addEventListener("click", () => {

    if (modo == "contador") {
        segundos = segundos - 1;
        counterTimer[0].innerHTML = `<p class="number">${((segundos <= 9 && segundos >= 0) ? ("0" + segundos) : segundos)}</p>`
        segundos < 1 && btnStartDown.classList.add("boton-disabled")
        segundos < 0 && btnStartUp.classList.add("boton-disabled")
    } else {
        segundos = segundos - 1;
        segundos < 0 && (segundos = 59, minutos = minutos - 1)
        counterTimer[0].innerHTML = `
        <input class = "number" type="text" maxlength="2" value=${((minutos <= 9 && minutos >= 0) ? ("0" + minutos) : minutos)}>
        <input class = "number" type="text" maxlength="2" value=${((segundos <= 9 && segundos >= 0) ? ("0" + segundos) : segundos)}>
        <input class = "number" type="text" maxlength="2" value=${((miliseg <= 9 && miliseg >= 0) ? ("0" + miliseg) : miliseg)}>    
        `

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


btnStartDown.addEventListener("click", () => {
    if (btnStartDown.innerText == "INICIAR TEMPORIZADOR") {
        countDown()
    } else {
        stopTimer()
    }
})

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

// Declaracion de Funciones

function countDown() {

    if (modo == "contador") {
        if (!cronRunning && segundos > 0) {
            registroVueltas.innerHTML = "";
            intervalo = setInterval(timer, 1000)
        }
    } else {
        if (!cronRunning && minutos >= 0 && segundos > 0 & miliseg >= 0) {
            registroVueltas.innerHTML = "";
            intervalo = setInterval(timer, 10)
        }
    }
}

function timer() {

    if (modo == "contador") {
        if (segundos > 0) {
            timerRunning = true;
            btnStartDown.innerText = "DETENER TEMPORIZADOR"
            btnStartUp.classList.add("boton-disabled")

            if (modo == "contador") {
                segundos = segundos - 1;
                counterTimer[0].innerHTML = `<p class="number">${((segundos <= 9 && segundos >= 0) ? ("0" + segundos) : segundos)}</p>`
            }
        } else {
            stopTimer()
            backgrounChanger()
        }
    }

    if (modo == "tiempo") {
        if (minutos >= 0 && segundos >= 0 && miliseg >= 0) {

            timerRunning = true;
            btnStartDown.innerText = "DETENER TEMPORIZADOR"
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

            counterTimer[0].innerHTML = `
             <input class = "number" type="text" maxlength="2" value=${((minutos <= 9 && minutos >= 0) ? ("0" + minutos) : minutos)}>
            <input class = "number" type="text" maxlength="2" value=${((segundos <= 9 && segundos >= 0) ? ("0" + segundos) : segundos)}>
            <input class = "number" type="text" maxlength="2" value=${((miliseg <= 9 && miliseg >= 0) ? ("0" + miliseg) : miliseg)}>`
        }
    }
}



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
            counterTimer[0].innerHTML = `<p class="number">${((segundos <= 9 && segundos >= 0) ? ("0" + segundos) : segundos)}</p>`
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
            counterTimer[0].innerHTML = `
                <input class = "number" type="text" maxlength="2" value=${((minutos <= 9 && minutos >= 0) ? ("0" + minutos) : minutos)}>
                <input class = "number" type="text" maxlength="2" value=${((segundos <= 9 && segundos >= 0) ? ("0" + segundos) : segundos)}>
                <input class = "number" type="text" maxlength="2" value=${((miliseg <= 9 && miliseg >= 0) ? ("0" + miliseg) : miliseg)}>`
        } else {
            stopTimer()
        }
    }
}


function stopTimer() {
    btnStartDown.innerText = "INICIAR TEMPORIZADOR"
    btnStartUp.innerText = "INICIAR CRONOMETRO"
    clearInterval(intervalo);
    cronRunning = false;
    timerRunning = false;

    if (modo == "contador") {
        segundos > 0 && btnStartDown.classList.remove("boton-disabled")
        segundos >= 0 && btnStartUp.classList.remove("boton-disabled")
    } else {
        if (segundos >= 0 && minutos >= 0) {
            btnStartUp.classList.remove("boton-disabled")
            btnStartDown.classList.remove("boton-disabled")
        }
    }
}

// Registro de vueltas

function mostrarBtnVueltas() {
    registroVueltas.innerHTML = `
    <button class="boton-panel" id="btn-vueltas" onclick="registroVuelta()"}>MARCAR VUELTA</button>
    `
}

function registroVuelta() {



    let cantidadRegistros = vueltas.length
    let numero = (cantidadRegistros === 0 ? 1 : (cantidadRegistros + 1))

    if (cantidadRegistros === 0) {
        registroVueltas.innerHTML = `
        <button class="boton-panel" id="btn-vueltas" onclick="registroVuelta()"}>MARCAR VUELTA</button>
        <button class="boton-panel" id="btn-vueltas" onclick="BorrarVueltas()"}>BORRAR VUELTAS</button>`
    }

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