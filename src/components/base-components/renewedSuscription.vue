<script setup>
import { inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const switchSP = inject("switchSP");

// Datos dinámicos del pago
const orderId = 'ORD-UNICO-1722528769';
const currency = 'COP';
const amount = '90000';
const apiKey = 'a1gc85ZtvF2q521ao0HAx4EbDRYuEZx-p1wRc-CacvM'; // Cambiar esto por consulta al API
const integritySignature = 'HASH_DE_INTEGRIDAD';
const redirectionUrl = 'https://micomercio.com/pagos/resultado';
const description = 'Renovación de suscripción';
const tax = 'vat-19';
const customerData = JSON.stringify({
    email: 'cliente@correo.com',
    fullName: 'Juan Pérez',
    phone: '3001234567',
    dialCode: '+57',
    documentNumber: '123456789',
    documentType: 'CC'
});
const billingAddress = JSON.stringify({
    address: 'Calle 123 # 4-5',
    zipCode: '110111',
    city: 'Bogotá',
    state: 'Cundinamarca',
    country: 'CO'
});

// Cargar el script de Bold y generar el botón
onMounted(() => {
    const scriptUrl = 'https://checkout.bold.co/library/boldPaymentButton.js';

    if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => createBoldButton();
    } else {
        createBoldButton();
    }
});

// Crear dinámicamente el botón Bold
function createBoldButton() {
    const buttonContainer = document.getElementById('bold-button-container');

    if (buttonContainer) {
        const boldScript = document.createElement('script');
        boldScript.setAttribute('data-bold-button', 'dark-L');
        boldScript.setAttribute('data-order-id', orderId);
        boldScript.setAttribute('data-currency', currency);
        boldScript.setAttribute('data-amount', amount);
        boldScript.setAttribute('data-api-key', apiKey);
        boldScript.setAttribute('data-integrity-signature', integritySignature);
        boldScript.setAttribute('data-redirection-url', redirectionUrl);
        boldScript.setAttribute('data-description', description);
        boldScript.setAttribute('data-tax', tax);
        boldScript.setAttribute('data-customer-data', customerData);
        boldScript.setAttribute('data-billing-address', billingAddress);

        buttonContainer.appendChild(boldScript);
    }
}

const loggedCompany = inject("loggedCompany")
const switchSRS = inject("switchsRS")

const closeCompany = () => {
    localStorage.removeItem("loggedCompany");
    loggedCompany.value = null
    router.push("/loginCompany")
    switchSRS()
}
</script>
<template>
    <div class="modal-overlay">
        <section class="info-container" @click.stop>
            <h3>Pago No Renovado</h3>
            <p class="warning-text">
                Tu suscripción ha expirado. Por favor, renueva tu pago para continuar disfrutando del servicio.
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
    width: 70%;
    border-radius: 10px;
    background: var(--baseGray);
    box-shadow: -25px -25px 51px #242424, 25px 25px 51px #484848;
    border: 4px solid var(--baseOrange);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 60%;
    overflow-y: scroll;
    scrollbar-width: none;
    transition: all .4s ease;
    z-index: 9999;
    gap: 10px;
}

/* Texto de advertencia */
.warning-text {
    color: red;
    font-size: 18px;
    text-align: center;
    margin: 10px 0;
}

/* Botón de cerrar sesión */
.close-btn {
    all: unset;
    padding: 10px 20px;
    background: var(--secGray);
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
    background-color: var(--baseGray);
    border-color: var(--secGray);
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
