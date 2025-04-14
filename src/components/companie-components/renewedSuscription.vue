<script setup>
import { inject, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import CryptoJS from "crypto-js";
import axios from "axios";

const router = useRouter();
const paymentStatus = ref(null); // 'pending', 'completed', 'failed'
const isLoading = ref(false);
const isProcessing = ref(false);

// Datos dinámicos del pago
const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
const currency = "COP";
const amount = "90000";
const apiKey = ref("a1gc85ZtvF2q521ao0HAx4EbDRYuEZx-p1wRc-CacvM");

const integritySignature = CryptoJS.SHA256(`${orderId}${amount}${currency}${apiKey.value}`)
  .toString(CryptoJS.enc.Hex);

const redirectionUrl = `${window.location.origin}/payment-result`;
const description = "Renovación de suscripción";
const tax = "vat-19";
const customerData = {
  email: "cliente@correo.com",
  fullName: "Juan Pérez",
  phone: "3001234567",
  dialCode: "+57",
  documentNumber: "123456789",
  documentType: "CC",
};
const billingAddress = {
  address: "Calle 123 # 4-5",
  zipCode: "110111",
  city: "Bogotá",
  state: "Cundinamarca",
  country: "CO",
};

// Función para iniciar el pago
function initiatePayment() {
  try {
    isProcessing.value = true;
    
    // Construir la URL de producción
    const checkoutUrl = new URL('https://checkout.bold.co/checkout');
    
    // Parámetros básicos
    const params = {
      api_key: apiKey.value,
      order_id: orderId,
      amount: amount,
      currency: currency,
      integrity_signature: integritySignature,
      redirect_url: redirectionUrl,
      description: description
    };

    // Agregar los parámetros a la URL
    Object.keys(params).forEach(key => {
      checkoutUrl.searchParams.append(key, params[key]);
    });

    // Redirigir al usuario
    window.location.href = checkoutUrl.toString();
  } catch (error) {
    console.error('Error al iniciar el pago:', error);
    paymentStatus.value = 'failed';
    isProcessing.value = false;
  }
}

// Verificar el pago con tu backend
async function verifyPaymentWithBackend(paymentData) {
  try {
    const response = await axios.post('/api/verify-payment', {
      orderId,
      amount,
      currency,
      boldPaymentData: paymentData
    });
    
    if (response.data.verified) {
      console.log("Pago verificado correctamente");
    } else {
      console.warn("El pago no pudo ser verificado");
    }
  } catch (error) {
    console.error("Error verificando pago:", error);
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

// Verificar si venimos de un pago completado
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentStatus = urlParams.get('payment_status');
  
  if (paymentStatus === 'completed') {
    const paymentData = {
      orderId: urlParams.get('order_id'),
      transactionId: urlParams.get('transaction_id'),
      status: paymentStatus
    };
    verifyPaymentWithBackend(paymentData);
  }
});
</script>

<template>
  <div class="modal-overlay">
    <section class="info-container" @click.stop>
      <h3>Pago No Renovado</h3>
      
      <p class="warning-text" v-if="paymentStatus === 'failed'">
        El pago no pudo ser procesado. Por favor, intenta nuevamente.
      </p>
      <p class="warning-text" v-else-if="paymentStatus === 'completed'">
        ¡Pago completado exitosamente! Estamos procesando tu renovación.
      </p>
      <p class="warning-text" v-else>
        Tu suscripción ha expirado. Por favor, renueva tu pago para continuar
        disfrutando del servicio.
      </p>
      
      <div v-if="isLoading" class="loading-spinner">
        Cargando pasarela de pago...
      </div>
      <div v-else>
        <button 
          class="bold-payment-button" 
          @click="initiatePayment"
          :disabled="isProcessing"
        >
          {{ isProcessing ? 'Procesando...' : 'Pagar con Bold' }}
        </button>
        
        <button v-if="paymentStatus === 'completed'" class="success-btn" @click="closeCompany">
          Continuar
        </button>
      </div>
      
      <button class="close-btn" @click="closeCompany">Cerrar Sesión</button>
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
.loading-spinner {
  color: white;
  margin: 20px 0;
}

.success-btn {
  all: unset;
  padding: 15px 30px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: var(--baseFont);
  transition: all 0.2s ease;
  margin: 20px 0;
  font-weight: bold;
  font-size: 1.1rem;
}

.success-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Estilos para el botón de Bold */
.bold-payment-button {
  all: unset;
  padding: 15px 30px;
  background: var(--base);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: var(--baseFont);
  transition: all 0.2s ease;
  margin: 20px 0;
  font-weight: bold;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  width: 100%;
  max-width: 300px;
}

.bold-payment-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.bold-payment-button:active:not(:disabled) {
  transform: translateY(0);
  scale: 0.98;
}

.bold-payment-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

form {
  width: 100%;
  display: flex;
  justify-content: center;
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