
const rutas_caneca_1 = {
    1: "media/images/organicos.png",
    2: "media/images/reciclables.png",
    3: "media/images/no_reciclables.png"
}

const rutas_caneca_2 = {
    j: "media/images/organicos.png",
    k: "media/images/reciclables.png",
    l: "media/images/no_reciclables.png"
}
const categories = ['organicos', 'reciclables', 'no_reciclables'];
const keyToCategory_2 = {
  j: "organicos",
  k: "reciclables",
  l: "no_reciclables",
  J: "organicos",
  K: "reciclables",
  L: "no_reciclables"
};
// -----------------------------
const maximoResiduosAGenerar = 10;

let progress_increase = parseFloat((100 / (maximoResiduosAGenerar * 3)).toFixed(2))
let barr_width_1 = 0
let barr_width_2 = 0

function playSound(type) {
    const audio = new Audio(type === "correct" ? "media/sounds/success.mp3" : "media/sounds/wrong.mp3");
    audio.volume = 0.7
    audio.play().catch(err => console.warn("Error al reproducir audio", err))
}

// Generar lista única de 21 residuos
function generateWasteList() {
    const list = [];

    categories.forEach(cat => {
        for (let i = 1; i <= maximoResiduosAGenerar; i++) { // Numero de residuos a generar por categoría
            list.push({ category: cat, pngNum: i });
        }
    });
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
}




function inicia_juego_1() {
    console.log("Se inició el juego 1")
    document.addEventListener("DOMContentLoaded", () => {
        const player_1 = document.querySelector('.contenedor_caneca_1');
        const columna_jugador_1 = document.querySelector(".columna_jugador_1");
        const imgCanecaActiva_1 = document.querySelector('.caneca_activa_1')
        const bar_progress_1 = document.querySelector('.barra_1');

        let playerX_1 = columna_jugador_1.clientWidth - columna_jugador_1.clientWidth / 2;
        let wasteList_1 = generateWasteList();
        let activeWastes_1 = [];
        const maxWastes = 5;

        const step = 10;
        const keys = {};

        document.addEventListener("keydown", (e) => {
            keys[e.key] = true;
        })
        document.addEventListener("keyup", (e) => {
            keys[e.key] = false;
        })

        document.addEventListener("keydown", (e) => {
            // Jugador 1 (teclas 1, 2, 3)
            if (["1", "2", "3"].includes(e.key)) {
                imgCanecaActiva_1.src = rutas_caneca_1[e.key];
                imgCanecaActiva_1.dataset.category = categories[parseInt(e.key, 10) - 1]

            }
        })


        // --- Generación de residuos ---
        function spawnWaste(lista_residuos, gameView) {
            const wasteItem = lista_residuos.shift();
            const imgPath = `media/images/${wasteItem.category}/${wasteItem.pngNum}.png`;

            const waste = document.createElement('img');
            waste.src = imgPath;
            waste.classList.add('residuo_1');
            waste.dataset.category = wasteItem.category;

            // posición horizontal aleatoria
            waste.style.left = `${Math.random() * (gameView.clientWidth - 80)}px`;

            // detectar cuando termina la animación
            waste.addEventListener('animationend', () => {
                waste.remove(); // cayó sin ser atrapado
            });

            gameView.appendChild(waste);
        };

        function movePlayer(player, columna, posX) {
            const maxX = columna.clientWidth - player.clientWidth + 80;

            if (posX < 60) posX = 60;
            if (posX > maxX) posX = maxX;
            player.style.left = `${posX}px`

        };
        function showFeedback(x, y, type) {
            const feedback = document.createElement("div");
            feedback.classList.add("feedback");
            feedback.textContent = type === "correct" ? "✅" : "❌";

            feedback.style.left = `${x}px`;
            feedback.style.top = `${y}px`;

            columna_jugador_1.appendChild(feedback);

            setTimeout(() => feedback.remove(), 1000);
        };

        function showEndGame_1(columna, progreso) {
            console.log("se inició fin del juego 1");


            const overlay = document.createElement("div");


            overlay.innerHTML = `
                            <div class="text-center">
                            <h2> Lograste clasificar el </h2>
                            <h2>🎉 ${Math.floor(progreso).toFixed(2)} % 🎉</h2>
                            <h2> de residuos.</h2>
                            <button class="btn btn-success mt-3" onclick="location.reload()">Reiniciar</button>
                            </div>
                        `;


            overlay.classList.add("end-game-overlay");


            columna.appendChild(overlay);
        }


        function loop() {
            //Jugador 1
            if (keys["a"] || keys["A"]) playerX_1 -= step;
            if (keys["d"] || keys["D"]) playerX_1 += step;
            movePlayer(player_1, columna_jugador_1, playerX_1)



            function checkCollisions() {
                const residuos = document.querySelectorAll('.residuo_1');
                const canecaRect = imgCanecaActiva_1.getBoundingClientRect();
                bar_progress_1.style.width = `${barr_width_1}%`
                residuos.forEach((r) => {
                    const residuoRect = r.getBoundingClientRect();
                    const overlap =
                        residuoRect.bottom >= canecaRect.top + 100 &&
                        residuoRect.left < canecaRect.right &&
                        residuoRect.right > canecaRect.left;

                    if (overlap) {
                        if (r.dataset.category === imgCanecaActiva_1.dataset.category) {
                            showFeedback(player_1.offsetLeft, player_1.offsetTop + 220, "correct");
                            playSound('correct')
                            barr_width_1 += progress_increase;

                        } else {
                            showFeedback(player_1.offsetLeft, player_1.offsetTop + 220, "wrong");
                            playSound("wrong")
                        }
                        r.remove();
                    }

                });
            }
            setInterval(checkCollisions, 50);


            // Iniciar actualización constante
            requestAnimationFrame(loop);
        };

        spawnInterval_1 = setInterval(() => {
            console.log(`inicio_juego_1: ${wasteList_1.length}`)
            if (activeWastes_1.length < maxWastes && wasteList_1.length > 0) {
                spawnWaste(wasteList_1, columna_jugador_1)

            } if (wasteList_1.length === 0) {
                setTimeout(() => {
                    showEndGame_1(columna_jugador_1, barr_width_1)
                }, 3000);
                clearInterval(spawnInterval_1);

            }


        }, 2500)






        loop()
    });
}

function inicia_juego_2() {
    console.log('Se inició el juego 2')
    document.addEventListener('DOMContentLoaded', () => {
        const player_2 = document.querySelector('.contenedor_caneca_2');
        const columna_jugador_2 = document.querySelector(".columna_jugador_2")
        const imgCanecaActiva_2 = document.querySelector('.caneca_activa_2')
        const bar_progress_2 = document.querySelector('.barra_2')

        let playerX_2 = columna_jugador_2.clientWidth - columna_jugador_2.clientWidth / 2;
        let wasteList_2 = generateWasteList();
        let activeWastes_2 = [];
        const maxWastes = 5;
        
        const step = 10;
        const keys = {};


        document.addEventListener("keydown", (e) => {
            keys[e.key] = true;
        })
        document.addEventListener("keyup", (e) => {
            keys[e.key] = false;
        })

        document.addEventListener("keydown", (e) => {
            // Jugador 2 (teclas j, k, l)
            if (["j", "k", "l", "J", "K", "L"].includes(e.key)) {
                
                 const keyLower = e.key.toLowerCase();
                imgCanecaActiva_2.src = rutas_caneca_2[keyLower];
                imgCanecaActiva_2.dataset.category = keyToCategory_2[keyLower];

            }
        });

        // --- Generación de residuos ---
        function spawnWaste(lista_residuos, gameView) {
            const wasteItem = lista_residuos.shift();
            const imgPath = `media/images/${wasteItem.category}/${wasteItem.pngNum}.png`;

            const waste = document.createElement('img');
            waste.src = imgPath;
            waste.classList.add('residuo_2');
            waste.dataset.category = wasteItem.category;

            // posición horizontal aleatoria
            waste.style.left = `${Math.random() * (gameView.clientWidth - 80)}px`;

            // detectar cuando termina la animación
            waste.addEventListener('animationend', () => {
                waste.remove(); // cayó sin ser atrapado
            });

            gameView.appendChild(waste);
        };

          function movePlayer(player, columna, posX) {
            const maxX = columna.clientWidth - player.clientWidth + 80;

            if (posX < 60) posX = 60;
            if (posX > maxX) posX = maxX;
            player.style.left = `${posX}px`

        };
          function showFeedback(x, y, type) {
            const feedback = document.createElement("div");
            feedback.classList.add("feedback");
            feedback.textContent = type === "correct" ? "✅" : "❌";

            feedback.style.left = `${x}px`;
            feedback.style.top = `${y}px`;

            columna_jugador_2.appendChild(feedback);

            setTimeout(() => feedback.remove(), 1000);
        };
        function showEndGame_2(columna, progreso) {
            console.log("se inició fin del juego 2");


            const overlay = document.createElement("div");


            overlay.innerHTML = `
                            <div class="text-center">
                            <h2> Lograste clasificar el </h2>
                            <h2>🎉 ${Math.floor(progreso).toFixed(2)} % 🎉</h2>
                            <h2> de residuos.</h2>
                            <button class="btn btn-success mt-3" onclick="location.reload()">Reiniciar</button>
                            </div>
                        `;


            overlay.classList.add("end-game-overlay");


            columna.appendChild(overlay);
        };


        function loop() {
            //Jugador 2
            if (keys["ArrowLeft"]) playerX_2 -= step;
            if (keys["ArrowRight"]) playerX_2 += step;
            movePlayer(player_2, columna_jugador_2, playerX_2);

            function checkCollisions() {
                const residuos = document.querySelectorAll('.residuo_2');
                const canecaRect = imgCanecaActiva_2.getBoundingClientRect();
                bar_progress_2.style.width = `${barr_width_2}%`
                residuos.forEach((r) => {
                    const residuoRect = r.getBoundingClientRect();
                    const overlap =
                        residuoRect.bottom >= canecaRect.top + 100 &&
                        residuoRect.left < canecaRect.right &&
                        residuoRect.right > canecaRect.left;

                    if (overlap) {
                        if (r.dataset.category === imgCanecaActiva_2.dataset.category) {
                            showFeedback(player_2.offsetLeft, player_2.offsetTop + 220, "correct");
                            playSound('correct')
                            barr_width_2 += progress_increase;

                        } else {
                            showFeedback(player_2.offsetLeft, player_2.offsetTop + 220, "wrong");
                            playSound("wrong")
                        }
                        r.remove();
                    }

                });
            }
            setInterval(checkCollisions, 50);

            // Iniciar actualización constante
            requestAnimationFrame(loop);
        }

      spawnInterval_2 = setInterval(() => {
        console.log(`inicio_juego_2: ${wasteList_2.length}`)
            if (activeWastes_2.length < maxWastes && wasteList_2.length > 0) {
                spawnWaste(wasteList_2, columna_jugador_2)

            } if (wasteList_2.length === 0) {
                setTimeout(() => {
                    showEndGame_2(columna_jugador_2, barr_width_2)
                }, 3000);
                clearInterval(spawnInterval_2);

            }


        }, 2500)




        loop()


    });
};

inicia_juego_1();
inicia_juego_2();
