<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import CryptoJS from "crypto-js";

const router = useRouter();
const paymentStatus = ref(null); // 'pending', 'completed', 'failed'
const isProcessing = ref(false);
const boldCheckoutLoaded = ref(false);

// Configuración de prueba (usa tus credenciales directamente)
const paymentConfig = {
  orderId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  currency: "COP",
  amount: "90000",
  apiKey: "jliJGmSDQMhYqht2I1TfYW5aTUHC-Xq56hZIpDiz6-w",
  secretKey: "bpj4Sn9D009hYJ6cPrbaFg",
  environment: "sandbox"
};

// Generar firma de integridad
const integritySignature = CryptoJS.SHA256(
  `${paymentConfig.orderId}${paymentConfig.amount}${paymentConfig.currency}${paymentConfig.secretKey}`
).toString(CryptoJS.enc.Base64);

// Cargar el script de Bold cuando el componente se monta
onMounted(async () => {
  try {
    await loadBoldScript();
    setupBoldListeners();
    boldCheckoutLoaded.value = true;
  } catch (error) {
    console.error("Error cargando Bold Checkout:", error);
    paymentStatus.value = "failed";
  }
});

// Función para cargar el script de Bold
function loadBoldScript() {
  return new Promise((resolve, reject) => {
    if (window.BoldCheckout) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.bold.co/library/boldCheckout.js";
    script.async = true;
    
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Error cargando script de Bold"));
    
    document.head.appendChild(script);
  });
}

// Configurar listeners para eventos de Bold
function setupBoldListeners() {
  window.addEventListener("BoldCheckoutCompleted", (event) => {
    paymentStatus.value = "completed";
    isProcessing.value = false;
    console.log("Pago completado:", event.detail);
  });

  window.addEventListener("BoldCheckoutFailed", (event) => {
    paymentStatus.value = "failed";
    isProcessing.value = false;
    console.error("Pago fallido:", event.detail);
  });

  window.addEventListener("BoldCheckoutPending", () => {
    paymentStatus.value = "pending";
    isProcessing.value = false;
  });
}

// Iniciar el proceso de pago con Bold
async function initiateBoldPayment() {
  if (isProcessing.value || !boldCheckoutLoaded.value) return;
  
  isProcessing.value = true;
  
  try {
    const boldConfig = {
      api_key: paymentConfig.apiKey,
      order_id: paymentConfig.orderId,
      amount: paymentConfig.amount,
      currency: paymentConfig.currency,
      integrity_signature: integritySignature,
      environment: paymentConfig.environment,
      redirect_url: window.location.href,
      description: "Renovación de suscripción - Prueba",
      customer: JSON.stringify({
        email: "test@example.com",
        fullName: "Cliente de Prueba",
        phone: "3001234567",
        dialCode: "+57",
        documentNumber: "123456789",
        documentType: "CC",
      }),
      billing_address: JSON.stringify({
        address: "Calle 123 # 4-5",
        zipCode: "110111",
        city: "Bogotá",
        state: "Cundinamarca",
        country: "CO",
      }),
      test_mode: true,
      debug: true
    };

    window.BoldCheckout.init(boldConfig);
    window.BoldCheckout.open();
    
  } catch (error) {
    console.error("Error al iniciar el pago:", error);
    paymentStatus.value = "failed";
    isProcessing.value = false;
  }
}
</script>

<template>
  <div class="modal-overlay">
    <section class="info-container">
      <h3>Pago No Renovado</h3>
      
      <p class="status-message" :class="{
        'error': paymentStatus === 'failed',
        'success': paymentStatus === 'completed',
        'info': !paymentStatus
      }">
        <span v-if="paymentStatus === 'failed'">
          El pago no pudo ser procesado. Por favor, intenta nuevamente.
        </span>
        <span v-else-if="paymentStatus === 'completed'">
          ¡Pago completado exitosamente! Estamos procesando tu renovación.
        </span>
        <span v-else>
          Tu suscripción ha expirado. Por favor, renueva tu pago para continuar
          disfrutando del servicio.
        </span>
      </p>
      
      <button
        class="pay-btn"
        @click="initiateBoldPayment"
        :disabled="isProcessing || !boldCheckoutLoaded"
      >
        <span v-if="isProcessing">Procesando pago...</span>
        <span v-else-if="!boldCheckoutLoaded">Cargando pasarela de pago...</span>
        <span v-else>Pagar ${{ paymentConfig.amount }} COP</span>
      </button>
      
      <button
        v-if="paymentStatus === 'completed'"
        class="continue-btn"
        @click="$router.push('/')"
      >
        Continuar
      </button>
    </section>
  </div>
</template>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    transition: background-color .5s ease-in-out;
}

.modal-content {
    background-color: var(--second);
    padding: 25px;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    border: 2px solid var(--base);
    text-align: center;
}

.modal-content h3 {
    color: white;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.warning-icon {
    font-size: 3rem;
    color: var(--warningColor);
    margin-bottom: 15px;
}

.warning-text {
    color: var(--secondTwo);
    margin-bottom: 15px;
    font-size: 1.1rem;
    line-height: 1.4;
}

.additional-info {
    color: var(--base);
    font-size: 0.9rem;
    margin-bottom: 25px;
    font-style: italic;
}

.modal-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 20px;
}

.confirm-btn, .cancel-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.confirm-btn {
    background-color: var(--successColor);
    color: white;
}

.cancel-btn {
    background-color: var(--errorColor);
    color: white;
}

.confirm-btn:hover, .cancel-btn:hover {
    transform: scale(1.05);
    filter: brightness(1.1);
}

.confirm-btn ion-icon, .cancel-btn ion-icon {
    font-size: 1.2rem;

}
</style> 