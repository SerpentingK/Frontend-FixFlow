<script setup>
import axios from 'axios';
import { inject, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const phonesRepaired = inject('phonesRepaired');
const phonesReceived = inject('phonesReceived');
const phonesDelivered = inject('phonesDelivered');

const switchCS = inject("switchCS")


const loggedWorker = inject("loggedWorker", ref(null));
const workerRole = inject("workerRole", ref(null));
const startShift = inject("startShift", ref(null));
const total_sales = inject("total_sales")
const total_revenue = inject("total_revenue")
const total_outs = inject("total_outs")
const finish = computed(() => total_sales.value - total_outs.value);
const loggedDocument = ref(null)
const start_time = ref("")
const shiftclose = ref({
        total_gain: total_revenue,
        total_received: total_sales
      })

const router = useRouter()

const putShift = async () => {
    try {
        const response = await axios.put(`http://127.0.0.1:8000/closeshift/${startShift.value}`, shiftclose.value)
        localStorage.removeItem("total_sales");
        total_sales.value = 0;
        localStorage.removeItem("total_outs");
        total_outs.value = 0;
        localStorage.removeItem("total_revenue");
        total_revenue.value = 0;
        localStorage.removeItem("loggedDocument");
        loggedDocument.value = null
        localStorage.removeItem("loggedWorker");
        loggedWorker.value = null
        localStorage.removeItem("workerRole");
        workerRole.value = null
        localStorage.removeItem("startShift");
        startShift.value = null
        localStorage.removeItem("phonesDelivered");
        phonesDelivered.value = 0;
        localStorage.removeItem("phonesReceived");
        phonesReceived.value = 0;
        localStorage.removeItem("phonesRepaired");
        phonesRepaired.value = 0;

        router.push("/workers/login-worker")
        switchCS()
    } catch (error) {
        console.error("Error al cerrar el turno:", error);
        alert("No se pudo cerrar el turno. Inténtalo nuevamente.");
    }
}


onMounted(async () => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/shift/${startShift.value}`);
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
    const storedSales = localStorage.getItem("total_sales");
    const storedRevenue = localStorage.getItem("total_revenue");
    const storedOuts = localStorage.getItem("total_outs")
    const storedDelivered = localStorage.getItem("phonesDelivered")
    const storedReceived = localStorage.getItem("phonesReceived")
    const storedRepaired = localStorage.getItem("phonesRepaired")

    if (storedSales) total_sales.value = JSON.parse(storedSales);
    if (storedRevenue) total_revenue.value = JSON.parse(storedRevenue);  
    if (storedOuts) total_outs.value = JSON.parse(storedOuts)
    if (storedDelivered) phonesDelivered.value = JSON.parse(storedDelivered)
    if (storedReceived) phonesReceived.value = JSON.parse(storedReceived)
    if (storedRepaired) phonesRepaired.value = JSON.parse(storedRepaired)
});

</script>


<template>
    <section class="container">
        <h2>CERRAR SESION</h2>
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
        <div class="info-div">
            <span>Total recibido:</span>
            <span>{{ total_sales }}</span>
        </div>
        <div class="info-div">
            <span>Total ganancia:</span>
            <span>{{ total_revenue }}</span>
        </div>
        <div class="info-div">
            <span>Total salidas:</span>
            <span>{{ total_outs }}</span>
        </div>
        <div class="info-div">
            <span>Final:</span>
            <span>{{ finish }}</span>
        </div>
        <div class="info-div">
            <span>Celulares recibidos:</span>
            <span>{{ phonesReceived }}</span>
        </div>
        <div class="info-div">
            <span>Celulares reparados:</span>
            <span>{{phonesRepaired}}</span>
        </div>
        <div class="info-div">
            <span>Celulares entregados:</span>
            <span>{{phonesDelivered}}</span>
        </div>
        <div class="btns">
            <button @click="switchCS">Cancelar</button>
            <button class="confirm-btn" @click="putShift">Confirmar</button>
        </div>
    </section>
</template>

<style scoped>
.container {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 5px 20px;
    width: 80%;
    border-radius: 10px;
    background: var(--baseGray);
    box-shadow: -25px -25px 51px #242424,
        25px 25px 51px #484848;
    border: 4px solid var(--baseOrange);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 70%;
    overflow-y: scroll;
    scrollbar-width: none;
    transition: all .4s ease;
    z-index: 2;
    gap: 5px;
}
.container h2{
    color: white;
    letter-spacing: 2px;
    font-size: 1.3rem;
    text-align: center;
}
.info-div{
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--secGray);
}
.btns{
    margin: 10px 0;
    width: 90%;
    display: flex;
    justify-content: space-around;
}
.btns button{
    background-color: transparent;
    border: 2px solid var(--baseOrange);
    border-radius: 5px;
    padding: 5px 10px;
    color: white;
    text-transform: uppercase;
    letter-spacing: 1px;
}
.btns button:active{
    scale: .9;
}
button.confirm-btn{
    background-color: var(--baseOrange);
}

@media (min-width: 1024px) {
    .container{
        width: 30%;
    }
}
</style>