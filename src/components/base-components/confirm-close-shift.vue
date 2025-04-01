<script setup>
import axios from 'axios';
import { inject, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const switchCCS = inject("switchCCS")

const phonesRepaired = inject('phonesRepaired');
const phonesReceived = inject('phonesReceived');
const phonesDelivered = inject('phonesDelivered');
const loggedWorker = inject("loggedWorker", ref(null));
const workerRole = inject("workerRole", ref(null));
const startShift = inject("startShift", ref(null));
const total_sales = inject("total_sales")
const total_revenue = inject("total_revenue")
const total_cash = inject('total_cash');
const total_platform = inject('total_platform');
const total_outs = inject('total_outs');
const loggedCompany = inject("loggedCompany");
const total_user = inject('total_user');
const loggedDocument = ref(null)
const shiftclose = ref({
        total_gain: total_revenue.value,
        total_received: total_sales.value,
        total_outs: total_outs.value,
        vault: total_cash.value,
      })

const router = useRouter()

const putShift = async () => {
    try {
        const response = await axios.put(`http://127.0.0.1:8000/closeshift/${startShift.value}/${loggedCompany.value}`, shiftclose.value);

        if (response.status === 200) { // Asegurar que la petición fue exitosa
            localStorage.removeItem("total_sales");
            total_sales.value = 0;
            localStorage.removeItem("total_outs");
            total_outs.value = 0;
            localStorage.removeItem("total_revenue");
            total_revenue.value = 0;
            localStorage.removeItem("loggedDocument");
            loggedDocument.value = null;
            localStorage.removeItem("loggedWorker");
            loggedWorker.value = null;
            localStorage.removeItem("workerRole");
            workerRole.value = null;
            localStorage.removeItem("startShift");
            startShift.value = null;
            localStorage.removeItem("phonesDelivered");
            phonesDelivered.value = 0;
            localStorage.removeItem("phonesReceived");
            phonesReceived.value = 0;
            localStorage.removeItem("phonesRepaired");
            phonesRepaired.value = 0;
            localStorage.removeItem("total_cash");
            total_cash.value = 0;   
            localStorage.removeItem("total_platform");
            total_platform.value = 0;
            total_user.value = 0;
            
            router.push("/workers/login-worker");
            switchCCS();
        }
    } catch (error) {
        console.error("Error al cerrar el turno:", error);
        alert("No se pudo cerrar el turno. Inténtalo nuevamente.");
    }
};


onMounted(() => {
    const storedPlataform = localStorage.getItem("total_platform")
    const storedCash = localStorage.getItem("total_cash")
    const storedSales = localStorage.getItem("total_sales");
    const storedRevenue = localStorage.getItem("total_revenue");
    const storedOuts = localStorage.getItem("total_outs")
    if (storedSales) total_sales.value = JSON.parse(storedSales);
    if (storedRevenue) total_revenue.value = JSON.parse(storedRevenue);  
    if (storedOuts) total_outs.value = JSON.parse(storedOuts)
    if (storedPlataform) total_platform.value = JSON.parse(storedPlataform)
    if (storedCash) total_cash.value = JSON.parse(storedCash)   
})
</script>

<template>
    <section class="container">
        <h3>CERRAR TURNPO</h3>
        <div style="width: 100%; display: flex; justify-content: space-evenly; padding: 10px 0; color: white;">
            <span>Cantidad Reportada: </span>
            <span>{{ total_user }}</span>
        </div>
        <div style="width: 100%; display: flex; justify-content: space-evenly; padding: 10px 0; color: white;">
            <span>Cantidad En Plataforma: </span>
            <span>{{ total_platform }}</span>
        </div>
        <div style="width: 100%; display: flex; justify-content: space-evenly; padding: 10px 0; color: white;">
            <span>Cantidad En Fisico: </span>
            <span>{{ total_cash }}</span>
        </div>
        <div style="width: 100%; display: flex; justify-content: space-evenly; padding: 10px 0; color: white;">
            <span>Cantidad Real: </span>
            <span>{{ total_sales }}</span>
        </div>
        <div style="width: 100%; display: flex; justify-content: space-around; padding: 10px 0;" class="btns">
            <button @click="switchCCS()">Cancelar</button>
            <button @click="putShift() " class="confirm-btn">Confirmar</button>
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
    z-index: 10;
}

h3 {
    color: white;
    text-transform: uppercase;
    font-size: 1.3rem;
    text-align: center;
    letter-spacing: 2px;
}
.btns button{
    border: 2px solid var(--baseOrange);
    background-color: transparent;
    padding: 5px 10px;
    color: white;
    text-transform: uppercase;
    font-weight: bolder;
    letter-spacing: 1.5px;
    border-radius: 5px;
    transition: .3s;
}
.btns button:active{
    scale: .9;
}
button.confirm-btn{
    background-color: var(--baseOrange);
}
@media (min-width: 1024px) {
    .container{
        width: 25%;
    }
    
    button:hover{
        scale: 1.1;
    }
}
</style>