<script setup>
import axios from 'axios';
import { inject, ref, onMounted } from 'vue';

const phonesRepaired = inject('phonesRepaired');
const phonesReceived = inject('phonesReceived');
const phonesDelivered = inject('phonesDelivered');
const switchCS = inject("switchCS");
const loggedWorker = inject("loggedWorker", ref(null));
const startShift = inject("startShift", ref(null));
const switchCCS = inject("switchCCS");
const start_time = ref("");
const total_user = inject('total_user');

// Función para formatear valores como moneda
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value || 0);
};

onMounted(async () => {
    try {
        const response = await axios.get(`/api/shift/${startShift.value}`);
        const fullDateTime = response.data.start_time; 
        const dateObj = new Date(fullDateTime); // Convierte a objeto Date
        
        let hours = dateObj.getHours(); // Obtiene la hora en formato 24h
        const minutes = dateObj.getMinutes().toString().padStart(2, '0'); // Asegura dos dígitos para minutos
        const period = hours >= 12 ? "PM" : "AM"; // Determina si es AM o PM

        // Convierte a formato de 12 horas
        hours = hours % 12 || 12; // Convierte 0 (medianoche) a 12

        const formattedTime = `${hours}:${minutes} ${period}`; 
        start_time.value = formattedTime;
    } catch (error) {
        console.error("Error fetching company data:", error);
    }
});

// Cargar valores guardados al iniciar
onMounted(() => {
    const storedDelivered = localStorage.getItem("phonesDelivered")
    const storedReceived = localStorage.getItem("phonesReceived")
    const storedRepaired = localStorage.getItem("phonesRepaired")
    if (storedDelivered) phonesDelivered.value = JSON.parse(storedDelivered)
    if (storedReceived) phonesReceived.value = JSON.parse(storedReceived)
    if (storedRepaired) phonesRepaired.value = JSON.parse(storedRepaired)
});
</script>

<template>
    <section class="container">
        <h2>TERMINAR TURNO</h2>
        <div class="info-div">
            <span>Colaborador:</span>
            <span>{{ loggedWorker }}</span>
        </div>
        <div class="info-div">
            <span>Turno:</span>
            <span>{{ startShift }}</span>
        </div>
        <div class="info-div">
            <span>Hora de inicio:</span>
            <span>{{ start_time }}</span>   
        </div>
        <div class="info-div inp-div">
            <span>Total Recibido Efectivo: </span>
            <input type="number" v-model="total_user" class="amount-inp" placeholder="">
            <span v-if="total_user" class="currency-preview">{{ formatCurrency(total_user) }}</span>
        </div>
        <div class="info-div">
            <span>Celulares recibidos:</span>
            <span>{{ phonesReceived }}</span>
        </div>
        <div class="info-div">
            <span>Celulares reparados:</span>
            <span>{{ phonesRepaired }}</span>
        </div>
        <div class="info-div">
            <span>Celulares entregados:</span>
            <span>{{ phonesDelivered }}</span>
        </div>
        <div class="btns">
            <button @click="switchCS">Cancelar</button>
            <button class="confirm-btn" @click="switchCCS()">Confirmar</button>
        </div>
    </section>
</template>

<style scoped>
.container {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 15px 20px;
    width: 80%;
    border-radius: 10px;
    background: var(--second);
    box-shadow: -25px -25px 51px #242424,
        25px 25px 51px #484848;
    border: 4px solid var(--base);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 70%;
    overflow-y: scroll;
    scrollbar-width: none;
    transition: all .4s ease;
    z-index: 2;
    gap: 10px;
}
.container h2 {
    color: white;
    letter-spacing: 2px;
    font-size: 1.3rem;
    text-align: center;
    margin-bottom: 10px;
}
.info-div {
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--secondTwo);
    flex-wrap: wrap;
    gap: 15px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.inp-div {
    flex-direction: column;
    align-items: flex-start;
}
.btns {
    margin: 15px 0 10px;
    width: 90%;
    display: flex;
    justify-content: space-around;
    gap: 15px;
}
.btns button {
    flex: 1;
    background-color: transparent;
    border: 2px solid var(--base);
    border-radius: 5px;
    padding: 8px 10px;
    color: white;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
    transition: all 0.3s;
}
.btns button:hover {
    transform: translateY(-2px);
}
.btns button:active {
    transform: translateY(0);
    scale: .98;
}
button.confirm-btn {
    background-color: var(--base);
}
.amount-inp {
    width: 100%;
    background-color: white;
    padding: 8px 12px;
    border-radius: 5px;
    color: black;
    margin-top: 5px;
}
.currency-preview {
    color: white;
    font-weight: bold;
    margin-top: 5px;
    font-size: 1.1rem;
}

@media (min-width: 768px) {
    .container {
        width: 60%;
        max-width: 500px;
    }
    .info-div {
        font-size: 1.1rem;
    }
    .container h2 {
        font-size: 1.5rem;
    }
}

@media (min-width: 1024px) {
    .container {
        width: 40%;
        max-width: 450px;
        padding: 20px;
    }
    .btns button {
        padding: 10px;
    }
}
</style>