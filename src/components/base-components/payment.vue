<script setup>
import { inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const switchSP = inject("switchSP");

// Datos dinámicos del pago
const orderId = 'ORD-UNICO-1722528769';
const currency = 'COP';
const amount = '90000';
const apiKey = 'a1gc85ZtvF2q521ao0HAx4EbDRYuEZx-p1wRc-CacvM';//Cambair esto por consulta al api
const integritySignature = 'HASH_DE_INTEGRIDAD';
const redirectionUrl = 'https://micomercio.com/pagos/resultado';
const description = 'Pago mensual suscripcion';
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

    // Agregar el script solo si no existe
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
</script>

<template>
    <section class="info-container">
        <h3>Suscripción FIXFLOW</h3>
        <div class="payment-info">
            <p><strong>Costo:</strong> $90.000 COP / mes</p>
            <p><strong>Incluye:</strong></p>
            <ul>
                <li>Manejo de turnos</li>
                <li>Manejo de inventarios para dispositivos</li>
                <li>Manejo de ventas para el local</li>
            </ul>
            <p><strong>Descripción:</strong> Pago mensual de tu suscripción para acceder a todas las herramientas de
                FIXFLOW.</p>
        </div>

        <div id="bold-button-container"></div>

        <button @click="switchSP" class="close-btn">Cerrar</button>
    </section>
</template>

<style scoped>
.info-container {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 10px 5px;
    width: 70%;
    border-radius: 10px;
    background: var(--baseGray);
    box-shadow: -25px -25px 51px #242424,
        25px 25px 51px #484848;
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

h3 {
    font-family: var(--baseFont);
    font-size: 22px;
    color: white;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.payment-info {
    width: 50%;
    padding: 15px;
    background: var(--baseOrange);
    border-radius: 8px;
    color: white;
    text-align: left;
    box-shadow:var(--secShadow);
}

.payment-info h3 {
    margin-top: 0;
}

.payment-info ul {
    padding-left: 20px;
    margin: 5px 0;
}

.payment-info li {
    margin-bottom: 5px;
}

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
