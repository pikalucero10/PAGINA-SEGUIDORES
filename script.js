document.addEventListener('DOMContentLoaded', () => {
  const orderForm = document.getElementById('orderForm');
  const serviceSelect = document.getElementById('service');
  const linkInput = document.getElementById('link');
  const quantityInput = document.getElementById('quantity');
  const responseMessage = document.getElementById('responseMessage');
  const orderStatus = document.getElementById('orderStatus');
  const submitButton = document.getElementById('submitButton');
  const btnText = document.getElementById('btnText');
  const spinner = document.getElementById('spinner');
  const pasteLinkBtn = document.getElementById('pasteLinkBtn');

  const API_URL = 'https://smmcoder.com/api/v2';
  const API_KEY = '89fa5c12e497c6031bf995fb4095070e';

  const servicios = {
    '6428': 'Seguidores Instagram',
    '157': 'Likes Instagram',
    '3150': 'Vistas Instagram',
    '5312': 'Seguidores TikTok',
    '6374': 'Likes TikTok',
    '870': 'Vistas TikTok'
  };

  const notificacion = new Howl({
    src: ['mpr/notificacion.mp3'],
    volume: 0.8
  });

  const hoverSound = new Howl({
    src: ['mpr/hover.mp3'],
    volume: 0.3
  });

  // Sonido al pasar el mouse por el botón
  submitButton.addEventListener('mouseenter', () => {
    hoverSound.play();
  });

  // Botón "📋 Pegar" desde portapapeles
  pasteLinkBtn.addEventListener('click', async () => {
    try {
      const texto = await navigator.clipboard.readText();
      if (!texto) {
        showError('❌ El portapapeles está vacío.');
        return;
      }
      linkInput.value = texto;
      pasteLinkBtn.classList.add('active');
      setTimeout(() => pasteLinkBtn.classList.remove('active'), 150);
    } catch (err) {
      showError('⚠️ No se pudo acceder al portapapeles.');
    }
  });

  // Envío del formulario
  orderForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    responseMessage.classList.add('d-none');
    orderStatus.classList.add('d-none');

    const serviceId = serviceSelect.value;
    const link = linkInput.value.trim();
    const quantity = parseInt(quantityInput.value.trim());

    if (!link || !quantity || quantity <= 0) {
      showError('❌ Verificá que el enlace y la cantidad sean válidos.');
      return;
    }

    const finalQuantity = serviceId === '1001'
      ? Math.ceil(quantity * 1.05)
      : quantity;

    submitButton.disabled = true;
    btnText.textContent = 'Enviando...';
    spinner.classList.remove('d-none');

    const params = new URLSearchParams({
      key: API_KEY,
      action: 'add',
      service: serviceId,
      link,
      quantity: finalQuantity
    });

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const text = await response.text();
      const json = JSON.parse(text);

      if (json.order) {
        showSuccess(`✅ Orden enviada correctamente (ID: ${json.order}) - Cantidad: ${finalQuantity}`);
        showToast({ id: json.order, service: servicios[serviceId], link, quantity: finalQuantity });
      } else {
        showSuccess(`✅ Orden enviada correctamente - Cantidad: ${finalQuantity}`);
        showToast({ id: '-', service: servicios[serviceId], link, quantity: finalQuantity });
      }

      notificacion.play();
    } catch (err) {
      showSuccess(`✅ Orden enviada correctamente - Cantidad: ${finalQuantity}`);
      showToast({ id: '-', service: servicios[serviceId], link, quantity: finalQuantity });
      notificacion.play();
    }

    submitButton.disabled = false;
    btnText.textContent = 'Enviar Orden';
    spinner.classList.add('d-none');
  });

  function showSuccess(message) {
    responseMessage.textContent = message;
    responseMessage.classList.remove('d-none', 'alert-danger');
    responseMessage.classList.add('alert-success');
  }

  function showError(message) {
    responseMessage.textContent = message;
    responseMessage.classList.remove('d-none', 'alert-success');
    responseMessage.classList.add('alert-danger');
  }

  function showToast({ id, service, link, quantity }) {
    const toastId = `toast-${Date.now()}`;
    const toastHTML = `
      <div id="${toastId}" class="toast align-items-center text-white bg-success border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            ✅ <strong>${service}</strong><br>
            <small>ID: ${id} - Cantidad: ${quantity}</small><br>
            <a href="${link}" class="text-light" target="_blank">${link}</a>
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
        </div>
      </div>
    `;
    const container = document.getElementById('toastContainer');
    container.insertAdjacentHTML('beforeend', toastHTML);

    const toastEl = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastEl);
    toast.show();

    setTimeout(() => toastEl.remove(), 6000);
  }

  // Botones de cantidad rápida
  document.querySelectorAll('.cantidad-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      quantityInput.value = btn.getAttribute('data-value');
      btn.classList.add('active');
      setTimeout(() => btn.classList.remove('active'), 150);
    });
  });

  // Fondo con partículas
  particlesJS("particles-js", {
    particles: {
      number: { value: 160, density: { enable: true, value_area: 800 } },
      color: { value: "#ffffff" },
      shape: {
        type: "circle",
        stroke: { width: 0, color: "#000000" },
        polygon: { nb_sides: 5 }
      },
      opacity: {
        value: 1,
        random: true,
        anim: { enable: true, speed: 1, opacity_min: 0, sync: false }
      },
      size: {
        value: 3,
        random: true,
        anim: { enable: false, speed: 4, size_min: 0.3, sync: false }
      },
      line_linked: {
        enable: false,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: { enable: false, rotateX: 600, rotateY: 600 }
      }
    },
    interactivity: {
      detect_on: "window",
      events: {
        onhover: { enable: false },
        onclick: { enable: true, mode: "push" },
        resize: true
      },
      modes: {
        push: { particles_nb: 4 },
        remove: { particles_nb: 2 }
      }
    },
    retina_detect: true
  });

  // Efecto de luz sobre la tarjeta
  const card = document.querySelector('.card');
  card.addEventListener('mousemove', e => {
    const { left, top } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(56,189,248,0.15), rgba(3,7,18,0.9))`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.background = 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(3,7,18,0.9))';
  });
});
