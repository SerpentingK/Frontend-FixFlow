<script setup>
import { inject, onMounted } from "vue";
import { useRouter } from "vue-router";
import CryptoJS from "crypto-js"; // Asegúrate de tener esta librería instalada

const router = useRouter();

// Datos dinámicos del pago

// Sugerencia para generar orderId único
const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const currency = "COP";
const amount = "90000";
const apiKey = "X5n7An82U_1zF2ml_BmW_ggSwzeVvtBQlhiin1aALWs"; // Cambiar esto por consulta al API
const integritySignature = CryptoJS.SHA256(`${orderId}${amount}${currency}iOsIajFyXeJp0MfUtALMOQ`)
  .toString(CryptoJS.enc.Base64);


const redirectionUrl = "https://micomercio.com/pagos/resultado";
const description = "Renovación de suscripción";
const tax = "vat-19";
const customerData = JSON.stringify({
  email: "cliente@correo.com",
  fullName: "Juan Pérez",
  phone: "3001234567",
  dialCode: "+57",
  documentNumber: "123456789",
  documentType: "CC",
});
const billingAddress = JSON.stringify({
  address: "Calle 123 # 4-5",
  zipCode: "110111",
  city: "Bogotá",
  state: "Cundinamarca",
  country: "CO",
});

// Cargar el script de Bold y generar el botón
onMounted(() => {
  const scriptUrl = "https://checkout.bold.co/library/boldPaymentButton.js";

  if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // Debes esperar a que Bold esté completamente inicializado
      setTimeout(() => createBoldButton(), 1000);
    };
  } else {
    createBoldButton();
  }
});

// Crear dinámicamente el botón Bold
function createBoldButton() {
  const buttonContainer = document.getElementById("bold-button-container");

  if (buttonContainer) {
    buttonContainer.innerHTML = "";
    const boldDiv = document.createElement("div");

    // Atributos requeridos (EN ESTE ORDEN)
    boldDiv.setAttribute("id", "bold-payment-button");
    boldDiv.setAttribute("data-api-key", apiKey);
    boldDiv.setAttribute("data-order-id", orderId);
    boldDiv.setAttribute("data-amount", amount);
    boldDiv.setAttribute("data-currency", currency);
    boldDiv.setAttribute("data-integrity-signature", integritySignature);
    boldDiv.setAttribute("data-environment", "sandbox"); // <- Clave para pruebas
    boldDiv.setAttribute("data-button-style", "dark-L");
    boldDiv.setAttribute("data-redirect-url", redirectionUrl);
    boldDiv.setAttribute("data-description", description);
    boldDiv.setAttribute("data-customer", customerData);
    boldDiv.setAttribute("data-billing-address", billingAddress);

    buttonContainer.appendChild(boldDiv);
  }
}

const loggedCompany = inject("loggedCompany");
const switchSRS = inject("switchsRS");

const closeCompany = () => {
  localStorage.removeItem("loggedCompany");
  loggedCompany.value = null;
  router.push("/loginCompany");
  switchSRS();
};
</script>
<template>
  <div class="modal-overlay">
    <section class="info-container" @click.stop>
      <h3>Pago No Renovado</h3>
      <p class="warning-text">
        Tu suscripción ha expirado. Por favor, renueva tu pago para continuar
        disfrutando del servicio.
      </p>
      <div id="bold-button-container"></div>
      <button class="close-btn" @click="closeCompany">Cerrar Sesion</button>
    </section>
  </div>
</template>

<style scoped>
/* Fondo que bloquea interacciones fuera del modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  backdrop-filter: blur(2px);
}

/* Contenedor principal */
.info-container {
  position: relative;
  padding: 10px 5px;
  width: 40%;
  border-radius: 10px;
  background: var(--second);
  box-shadow: -25px -25px 51px #242424, 25px 25px 51px #484848;
  border: 4px solid var(--base);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 60%;
  overflow-y: scroll;
  scrollbar-width: none;
  transition: all 0.4s ease;
  z-index: 9999;
  gap: 10px;
}
h3 {
  color: white;
  text-transform: uppercase;
  font-size: 1.3rem;
}

/* Texto de advertencia */
.warning-text {
  color: red;
  font-size: 18px;
  text-align: center;
  margin: 10px 0;
  width: 80%;
}

/* Botón de cerrar sesión */
.close-btn {
  all: unset;
  padding: 10px 20px;
  background: var(--base);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: var(--baseFont);
  transition: all 0.05s ease;
  border: 2px solid transparent;
}

.close-btn:active {
  scale: 0.9;
  background-color: var(--second);
  border-color: var(--secondTwo);
}

#bold-button-container {
  min-width: 300px;
  min-height: 60px;
  margin: 20px 0;
}

#bold-payment-button iframe {
  width: 100% !important;
  height: 60px !important;
  border: none !important;
}

@media (min-width: 768px) {
  * {
    font-size: 1.3rem;
  }
}

@media (min-width: 1024px) {
  .info-container {
    width: 50%;
    max-height: 70%;
  }

  .close-btn:hover {
    scale: 1.2;
  }

  .close-btn:hover:active {
    scale: 1.1;
  }
}
</style>
