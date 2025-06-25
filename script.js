const mensagens = [
    "Oi meu amor 💖",
    "Essa cartinha é só para te fazer lembrar",
    "O quanto você é especial para mim",
    "Cada dia com você é um presente",
    "Desde o momento em que te conheci",
    "Minha vida mudou de um jeito que eu nem sabia que era possível",
    "Quero que você saiba o quanto você é especial",
    "Eu admiro tudo em você, cada detalhe, cada gesto",
    "E a pessoa incrível que você é",
    "Eu sonho com o futuro que vamos construir",
    "E mesmo que a vida traga desafios",
    "Sei que com você ao meu lado, tudo é mais leve e mais bonito",
    "Obrigado por ser meu porto seguro, minha melhor amiga, meu amor",
    "Eu te amo hoje, amanhã e todos os dias que vierem 💖",
    "NEOQEAV"
];

let index = 0;
let cartaAberta = false;
let escrevendo = false;
const typingSound = document.getElementById("som-tecla");
const musica = document.getElementById("musica");
const botaoFinal = document.getElementById("botaoFinal");
const envelopeSection = document.getElementById("envelope-section");

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalCaption = document.getElementById("modal-caption");
const fecharModalBtn = document.getElementById("fecharModal");

let musicaTocando = false;

// Iniciar música na primeira interação do usuário
window.addEventListener("click", () => {
    if (!musicaTocando) {
        musica.loop = true;
        musica.volume = 0.2;
        musica.play().catch(() => {
            // Autoplay pode ser bloqueado, ignora erro
        });
        musicaTocando = true;
    }
}, { once: true });

// Abrir carta
function abrirCarta() {
    if (cartaAberta || escrevendo) return;

    cartaAberta = true;
    envelopeSection.setAttribute("aria-pressed", "true");
    document.getElementById("envelope").classList.add("aberto");

    setTimeout(() => {
        document.getElementById("carta").style.opacity = "1";
        mostrarMensagem();
    }, 1000);
}

// Mostrar mensagem com fade out/in entre frases
function mostrarMensagem() {
    if (index < mensagens.length) {
        const elemento = document.getElementById("maquina");
        escrevendo = true;

        fadeOut(elemento, 400, () => {
            elemento.innerText = "";
            maquinaEscrever(mensagens[index], elemento, 50, () => {
                escrevendo = false;
                index++;
                setTimeout(() => {
                    mostrarMensagem();
                }, 1500);
            });
        });
    } else {
        const containerBotaoFinal = document.getElementById("containerBotaoFinal");
        containerBotaoFinal.style.display = "flex";
        botaoFinal.focus();
    }
}

// Máquina de escrever com callback e som de tecla
function maquinaEscrever(texto, elemento, velocidade = 50, callback) {
    let i = 0;
    elemento.innerText = "";
    typingSound.loop = true;
    typingSound.currentTime = 0;
    typingSound.play();

    const intervalo = setInterval(() => {
        if (i < texto.length) {
            elemento.innerText += texto.charAt(i);
            i++;

            // Pausa maior após vírgulas e pontos
            if (texto.charAt(i - 1) === "," || texto.charAt(i - 1) === "." || texto.charAt(i - 1) === "!" || texto.charAt(i - 1) === "?") {
                clearInterval(intervalo);
                setTimeout(() => {
                    maquinaEscrever(texto.substring(i), elemento, velocidade, callback);
                }, 400);
                typingSound.pause();
            }
        } else {
            clearInterval(intervalo);
            typingSound.pause();
            if (callback) callback();
        }
    }, velocidade);
}

// Fade out/in helpers
function fadeOut(element, duration, callback) {
    element.style.transition = `opacity ${duration}ms ease`;
    element.style.opacity = 0;
    setTimeout(() => {
        if (callback) callback();
        fadeIn(element, duration);
    }, duration);
}

function fadeIn(element, duration) {
    element.style.transition = `opacity ${duration}ms ease`;
    element.style.opacity = 1;
}

// Mostrar surpresa final
function mostrarFinal() {
    botaoFinal.disabled = true;
    botaoFinal.style.transition = "opacity 1s ease";
    botaoFinal.style.opacity = "0";

    setTimeout(() => {
        botaoFinal.style.display = "none";
    }, 1000);

    // música já está tocando em background, não precisa tocar novamente

    // Confetti
    confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
    });

    // Fogos de artifício simples
    fogosArtificio();

    // Mostrar galeria
    document.getElementById("galeria").style.display = "flex";
}

// Simples fogos de artifício com confetti em sequência
function fogosArtificio() {
    let count = 0;
    const interval = setInterval(() => {
        confetti({
            particleCount: 50,
            spread: 70,
            origin: { x: Math.random(), y: Math.random() * 0.5 }
        });
        count++;
        if (count > 8) clearInterval(interval);
    }, 300);
}

// Corações animados
function criarCoracoes() {
    const container = document.getElementById("hearts-container");
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = 4 + Math.random() * 2 + "s";
    container.appendChild(heart);

    setTimeout(() => {
        container.removeChild(heart);
    }, 6000);
}

// Modal galeria
function abrirModal(imgSrc, altText, caption) {
    modalImg.src = imgSrc;
    modalImg.alt = altText;
    modalCaption.textContent = caption;
    modal.hidden = false;
    modal.focus();
}

function fecharModal() {
    modal.hidden = true;
    modalImg.src = "";
    modalCaption.textContent = "";
    envelopeSection.focus();
}

// Eventos modal
fecharModalBtn.addEventListener("click", fecharModal);
modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModal();
});
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) fecharModal();
});

// Abrir modal ao clicar em imagens da galeria
document.querySelectorAll(".fotos img").forEach((img) => {
    img.addEventListener("click", () => {
        abrirModal(img.src, img.alt, img.nextElementSibling.textContent);
    });
    img.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            abrirModal(img.src, img.alt, img.nextElementSibling.textContent);
        }
    });
});

// Efeito revelar foto ao clicar (toggle para abrir/revelar)
document.querySelectorAll(".fotos figure").forEach((figure) => {
    figure.addEventListener("click", () => {
        // Se já está animando ou revelada, não faz nada
        if (figure.classList.contains("animando") || figure.classList.contains("revelada")) return;

        // Marca que está animando
        figure.classList.add("animando");

        const overlay = figure.querySelector(".overlay");
        if (overlay) {
            // Quando a animação terminar:
            overlay.addEventListener("animationend", () => {
                // Remove overlay da tela
                overlay.style.display = "none";

                // Remove classe de animação e adiciona 'revelada'
                figure.classList.remove("animando");
                figure.classList.add("revelada");
            }, { once: true });

            // Inicia animação no overlay
            overlay.style.pointerEvents = "none";
            overlay.classList.add("animando"); // se quiser usar no CSS, opcional
            figure.classList.add("animando");  // marca figura
        }
    });

    figure.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            figure.click();
        }
    });
});

// Bloqueia clique múltiplo no envelope e ativa via teclado
envelopeSection.addEventListener("click", abrirCarta);
envelopeSection.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        abrirCarta();
    }
});

// Liga o botão final para chamar mostrarFinal()
botaoFinal.addEventListener("click", mostrarFinal);

// Inicia corações animados
setInterval(criarCoracoes, 300);
