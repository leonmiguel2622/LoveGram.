const FECHA_ANIVERSARIO = new Date('2025-06-18T17:00:00'); 

window.onload = () => {
    actualizarContador();
    mostrarMomentos();
    cargarCupones();
    setInterval(actualizarContador, 1000);
};

// CONTADOR
function actualizarContador() {
    const ahora = new Date();
    const dif = ahora - FECHA_ANIVERSARIO;
    const dias = Math.floor(dif / (1000 * 60 * 60 * 24));
    const horas = Math.floor((dif % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((dif % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((dif % (1000 * 60)) / 1000);
    document.getElementById('timer').innerText = `${dias} días, ${horas}h ${minutos}m ${segundos}s`;
}

// PREVISUALIZACIÓN
const actualBtn = document.getElementById('imageInput');
const fileChosen = document.getElementById('file-chosen');
const previewContainer = document.getElementById('image-preview-container');
const previewImage = document.getElementById('image-preview');

actualBtn.addEventListener('change', function() {
    if (this.files && this.files[0]) {
        fileChosen.textContent = this.files[0].name;
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewContainer.classList.add('preview-visible');
        }
        reader.readAsDataURL(this.files[0]);
    }
});

// GUARDAR POSTS
document.getElementById('btn-upload').addEventListener('click', () => {
    const caption = document.getElementById('caption').value;
    const dateInput = document.getElementById('post-date').value;
    const file = actualBtn.files[0];

    if (!caption || !dateInput || !file) return alert("¡Completa todo! ❤️");

    const reader = new FileReader();
    reader.onload = (e) => {
        const fechaLocal = dateInput.replace(/-/g, '\/'); 
        const nuevo = { id: Date.now(), texto: caption, fecha: fechaLocal, imagen: e.target.result };
        const actuales = JSON.parse(localStorage.getItem('nuestrosMomentos')) || [];
        actuales.unshift(nuevo);
        localStorage.setItem('nuestrosMomentos', JSON.stringify(actuales));
        location.reload(); 
    };
    reader.readAsDataURL(file);
});

function mostrarMomentos() {
    const feed = document.getElementById('feed');
    const guardados = JSON.parse(localStorage.getItem('nuestrosMomentos')) || [];
    guardados.forEach(m => {
        const article = document.createElement('article');
        article.className = 'post';
        article.innerHTML = `
            <button class="btn-eliminar" onclick="eliminarMomento(${m.id})">×</button>
            <img src="${m.imagen}">
            <div class="post-info">
                <span class="date">${new Date(m.fecha).toLocaleDateString()}</span>
                <p>${m.texto}</p>
            </div>`;
        feed.appendChild(article);
    });
}

window.eliminarMomento = function(id) {
    if (confirm("¿Borrar recuerdo? 😢")) {
        let actuales = JSON.parse(localStorage.getItem('nuestrosMomentos')) || [];
        localStorage.setItem('nuestrosMomentos', JSON.stringify(actuales.filter(m => m.id != id)));
        location.reload();
    }
}

// LÓGICA DE CUPONES
function canjearCupon(id, premio) {
    if (confirm(`¿Canjear cupón por: ${premio}? ❤️`)) {
        let canjeados = JSON.parse(localStorage.getItem('cuponesCanjeados')) || [];
        canjeados.push(id);
        localStorage.setItem('cuponesCanjeados', JSON.stringify(canjeados));
        document.getElementById(id).disabled = true;
        lanzarCorazones();
        alert("¡Cupón canjeado! ✨");
    }
}

function cargarCupones() {
    const canjeados = JSON.parse(localStorage.getItem('cuponesCanjeados')) || [];
    canjeados.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.disabled = true;
    });
}

function resetearCupones() {
    if(confirm("¿Quieres volver a activar todos los cupones?")) {
        localStorage.removeItem('cuponesCanjeados');
        location.reload();
    }
}

function lanzarCorazones() {
    for(let i=0; i<15; i++) {
        const c = document.createElement('div');
        c.className = 'corazon-pixel';
        c.innerText = '❤️';
        c.style.left = Math.random() * 100 + 'vw';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 3000);
    }
}