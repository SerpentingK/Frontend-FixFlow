<script setup>
import axios from 'axios';
import { inject, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const switchCCS = inject("switchCCS")

const startShift = inject("startShift", ref(null));
const total_sales = inject("total_sales")
const total_revenue = inject("total_revenue")
const total_cash = inject('total_cash', ref(0));
const total_platform = inject('total_platform');
const totalInvestment = inject("totalInvestment");
const total_outs = inject('total_outs');
const total_user = inject('total_user', ref(0));
const selectedPremiseId = inject("selectedPremiseId", ref(null))
const clearData = inject("clearData")

// Función para formatear valores como moneda
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(value || 0);
};

// Modifica totalMoney para que sea solo de lectura
const totalMoney = computed(() => {
    return Math.max(total_user.value, total_cash.value);
});

// Nueva propiedad computada para calcular el excedente
const calculatedExcess = computed(() => {
    return Math.max(0, total_user.value - total_cash.value);
});

// Nueva propiedad computada para el total ajustado
const adjustedTotalSales = computed(() => {
    return total_sales.value + calculatedExcess.value;
});

const router = useRouter()
const showAlert = inject("showAlert")

const putShift = async () => {
    try {
        const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/closeshift/${startShift.value}/${selectedPremiseId.value}`,
            {
                total_gain: total_revenue.value,
                total_received: adjustedTotalSales.value,
                total_outs: total_outs.value,
                vault: totalMoney.value,
            }
        )

        if (response.status === 200) {
            ["total_sales", "total_outs", "total_revenue", "loggedDocument", "loggedWorker",
                "workerRole", "startShift", "phonesDelivered", "phonesReceived", "phonesRepaired",
                "total_cash", "total_platform", "totalInvestment"]
                .forEach(item => localStorage.removeItem(item));
        }
    } catch (error) {
        console.error("Error al cerrar el turno:", error);
        showAlert("2", `No se ha podido cerrar sesión, intente nuevamente${error}`);
    }
};



onMounted(() => {
    total_sales.value = JSON.parse(localStorage.getItem("total_sales")) || 0;
    total_revenue.value = JSON.parse(localStorage.getItem("total_revenue")) || 0;
    total_outs.value = JSON.parse(localStorage.getItem("total_outs")) || 0;
    total_platform.value = JSON.parse(localStorage.getItem("total_platform")) || 0;
    total_cash.value = JSON.parse(localStorage.getItem("total_cash")) || 0;
    totalInvestment.value = JSON.parse(localStorage.getItem("totalInvestment")) || 0;
    putShift();
});

const overlayAlpha = ref(0);

onMounted(() => {
  setTimeout(() => {
    overlayAlpha.value = 0.5;
  }, 100); // Pequeño retraso antes de iniciar la animación
});


</script>

<template>
    <div class="overlay" :style="{ backgroundColor: `rgba(0, 0, 0, ${overlayAlpha})` }">
        <section class="c-container">
            <h3>TERMINAR TURNO</h3>
            <div class="info-cont">
                <span>Cantidad Reportada en Físico: </span>
                <span>{{ formatCurrency(total_user) }}</span>
            </div>
            <div class="info-cont">
                <span>Cantidad Real en Físico: </span>
                <span>{{ formatCurrency(total_cash) }}</span>
            </div>
            <div class="info-cont">
                <span>Cantidad a Entregar en Físico: </span>
                <span>{{ formatCurrency(totalMoney) }}</span>
            </div>
            <div class="info-cont">
                <span>Cantidad en Plataforma: </span>
                <span>{{ formatCurrency(total_platform) }}</span>
            </div>
            <div class="info-cont">
                <span>Cantidad Total: </span>
                <span>{{ formatCurrency(adjustedTotalSales) }}</span>
                <span v-if="calculatedExcess > 0" class="excess-amount">
                    (Incluye {{ formatCurrency(calculatedExcess) }} de ajuste)
                </span>
            </div>
            <div class="info-cont">
                <span>Inversión: </span>
                <span>{{ formatCurrency(totalInvestment) }}</span>
            </div>
            <div class="info-cont">
                <span>Ganancia: </span>
                <span>{{ formatCurrency(total_revenue) }}</span>
            </div>

            <div class="btns">
                <button @click="switchCCS(), clearData()" class="confirm-btn">Confirmar</button>
            </div>
        </section>
    </div>
</template>

<style scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0);
    /* Empieza completamente transparente */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1100;
    transition: background-color .5s ease-in-out;
}
.c-container {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    width: 80%;
    border-radius: 10px;
    background: var(--second);
    box-shadow: -25px -25px 51px #242424,
        25px 25px 51px #484848;
    border: 4px solid var(--base);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 80vh;
    overflow-y: auto;
    scrollbar-width: none;
    transition: all .4s ease;
    z-index: 10;
    gap: 15px;
}

h3 {
    color: white;
    text-transform: uppercase;
    font-size: 1.3rem;
    text-align: center;
    letter-spacing: 2px;
    margin-bottom: 10px;
}

.info-cont {
    width: 90%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-cont span:last-child {
    font-weight: bold;
    color: var(--base);
}

.excess-amount {
    color: orange;
    font-size: 0.9rem;
    margin-left: 5px;
}

.btns {
    display: flex;
    gap: 20px;
    margin: 15px 0 10px;
    width: 90%;
}

.btns button {
    flex: 1;
    border: 2px solid var(--base);
    background-color: transparent;
    padding: 10px;
    color: white;
    text-transform: uppercase;
    font-weight: bold;
    letter-spacing: 1.5px;
    border-radius: 5px;
    transition: all 0.3s;
    cursor: pointer;
}

.btns button:hover {
    transform: translateY(-2px);
}

.btns button:active {
    transform: translateY(0);
    scale: 0.98;
}

button.confirm-btn {
    background-color: var(--base);
}

@media (min-width: 768px) {
    .c-container {
        width: 60%;
        max-width: 500px;
    }

    .info-cont {
        font-size: 1.1rem;
    }

    h3 {
        font-size: 1.5rem;
    }
}

@media (min-width: 1024px) {
    .c-container {
        width: 40%;
        max-width: 450px;
        padding: 25px;
    }

    .btns button {
        padding: 12px;
    }
}
</style>