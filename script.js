let yaAbrio = false;
let explosionActivada = false;
const circulosCompletados = [false, false, false];

function activarInvitacion() {
    if (yaAbrio) return;
    yaAbrio = true;

    const imgSobre = document.getElementById('imgSobreEstetica');
    const videoSobre = document.getElementById('videoSobre');
    const intro = document.getElementById('contenedor-principal');
    const btnTexto = document.getElementById('btn-toca-abrir');
    const musica = document.getElementById('musicaInvitacion');
    const musicIcon = document.getElementById('music-toggle');

    if (btnTexto) {
        btnTexto.innerHTML = "ABRIENDO INVITACIÓN... 💌";
        btnTexto.style.opacity = "0.7";
    }

    if (musica) {
        musica.currentTime = 0;
        musica.play().catch(e => console.log("Audio play err:", e));
    }
    if (musicIcon) musicIcon.style.display = 'flex';
    if (imgSobre) imgSobre.style.opacity = '0';

    if (videoSobre) {
        videoSobre.style.display = 'block';
        videoSobre.currentTime = 0;
        let playPromise = videoSobre.play();

        const procederAInvitacion = () => {
            transicionAFinal(intro);
        };

        if (playPromise !== undefined) {
            playPromise.then(() => {
                videoSobre.onended = procederAInvitacion;
            }).catch(() => {
                procederAInvitacion();
            });
        } else {
            videoSobre.onended = procederAInvitacion;
        }

        setTimeout(procederAInvitacion, 3500);
    } else {
        transicionAFinal(intro);
    }
}

function transicionAFinal(intro) {
    if (intro) {
        intro.style.transition = "opacity 0.8s ease";
        intro.style.opacity = '0';
    }
    setTimeout(() => {
        if (intro) intro.style.display = 'none';
        const seccionFinal = document.getElementById('seccion-final');

        if (seccionFinal) seccionFinal.classList.remove('oculto');

        window.scrollTo(0, 0);
        iniciarAnimacionesScroll();
        iniciarContador();
    }, 800);
}

function revelarCirculo(card, idx) {
    if (circulosCompletados[idx]) return;
    circulosCompletados[idx] = true;

    const overlay = document.getElementById(`tap-${idx}`);
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => { overlay.style.display = 'none'; }, 500);
    }

    const container = card.querySelector('.circle-reveal-content');
    if (container) container.classList.add('revealed-glow');

    if (circulosCompletados.every(Boolean) && !explosionActivada) {
        explosionActivada = true;
        lanzarPetalosDesdeCirculos();

        const countdown = document.getElementById('countdownCard');
        if (countdown) {
            setTimeout(() => {
                countdown.classList.add('revealed-done');
            }, 300);
        }
    }
}

function lanzarPetalosDesdeCirculos() {
    const c = document.getElementById('petalsCanvas');
    const circlesWrap = document.getElementById('circlesWrapper');
    if (!c) return;
    const ctx = c.getContext('2d');
    
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    let originX = c.width / 2;
    let originY = c.height / 2;

    if (circlesWrap) {
        const rect = circlesWrap.getBoundingClientRect();
        originX = rect.left + rect.width / 2;
        originY = rect.top + rect.height / 2;
    }

    const petalos = [];
    const numPetalos = 65;

    for (let i = 0; i < numPetalos; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 4;

        petalos.push({
            x: originX,
            y: originY,
            size: Math.random() * 12 + 8,
            speedX: Math.cos(angle) * speed,
            speedY: Math.sin(angle) * speed - 2,
            gravity: 0.1,
            rotation: Math.random() * 360,
            rotSpeed: Math.random() * 4 - 2,
            opacity: 1
        });
    }

    let duracion = 0;
    function animar() {
        ctx.clearRect(0, 0, c.width, c.height);
        
        petalos.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = p.opacity;

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size / 1.8, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();

            p.x += p.speedX;
            p.y += p.speedY;
            p.speedY += p.gravity;
            p.speedX *= 0.98;
            p.rotation += p.rotSpeed;

            if (duracion > 60) {
                p.opacity -= 0.015;
            }
        });

        duracion++;
        if (duracion < 180) {
            requestAnimationFrame(animar);
        } else {
            ctx.clearRect(0, 0, c.width, c.height);
        }
    }
    animar();
}

function iniciarContador() {
    const targetDate = new Date('2026-10-31T19:30:00').getTime();

    function actualizar() {
        const now = new Date().getTime();
        const diff = targetDate - now;

        if (diff <= 0) {
            document.getElementById('cd-days').innerText = '00';
            document.getElementById('cd-hours').innerText = '00';
            document.getElementById('cd-mins').innerText = '00';
            document.getElementById('cd-secs').innerText = '00';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('cd-days').innerText = String(days).padStart(2, '0');
        document.getElementById('cd-hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('cd-mins').innerText = String(mins).padStart(2, '0');
        document.getElementById('cd-secs').innerText = String(secs).padStart(2, '0');
    }

    actualizar();
    setInterval(actualizar, 1000);
}

function toggleMusic() {
    const musica = document.getElementById('musicaInvitacion');
    const icon = document.getElementById('music-toggle');
    if (!musica || !icon) return;
    
    if (musica.paused) {
        musica.play();
        icon.innerHTML = '<i class="fa-solid fa-music"></i>';
    } else {
        musica.pause();
        icon.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    }
}

function iniciarAnimacionesScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function mostrarToast(txt) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.innerText = txt;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
    const seccionFinal = document.getElementById('seccion-final');
    if (seccionFinal && !seccionFinal.classList.contains('oculto')) {
        iniciarContador();
    }
});