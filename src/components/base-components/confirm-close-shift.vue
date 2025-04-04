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
const total_cash = inject('total_cash', ref(0));
const total_platform = inject('total_platform');
const totalInvestment = inject("totalInvestment");
const total_outs = inject('total_outs');
const loggedCompany = inject("loggedCompany");
const total_user = inject('total_user', ref(0));
const loggedDocument = ref(null)

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
            `http://127.0.0.1:8089/closeshift/${startShift.value}/${loggedCompany.value}`, 
            {
                total_gain: total_revenue.value,
                total_received: adjustedTotalSales.value, // Usa el valor ya ajustado
                total_outs: total_outs.value,
                vault: total_cash.value,
            }
        )

        if (response.status === 200) {
            ["total_sales", "total_outs", "total_revenue", "loggedDocument", "loggedWorker",
             "workerRole", "startShift", "phonesDelivered", "phonesReceived", "phonesRepaired",
             "total_cash", "total_platform", "totalInvestment"]
            .forEach(item => localStorage.removeItem(item));

            // Reiniciar valores reactivos
            total_sales.value = 0;
            total_outs.value = 0;
            total_revenue.value = 0;
            loggedDocument.value = null;
            loggedWorker.value = null;
            workerRole.value = null;
            startShift.value = null;
            phonesDelivered.value = 0;
            phonesReceived.value = 0;
            phonesRepaired.value = 0;
            total_cash.value = 0;
            total_platform.value = 0;
            totalInvestment.value = 0;
            total_user.value = 0;

            router.push("/workers/login-worker");
            switchCCS();
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
});

</script>

<template>
    <section class="c-container">
        <h3>CERRAR TURNPO</h3>
        <div class="info-cont">
            <span>Cantidad Reportada en Fisico: </span>
            <span>{{ total_user }}</span>
        </div>
        <div class="info-cont">
            <span>Cantidad Real en Fisico: </span>
            <span>{{ total_cash }}</span>
        </div>
        <div class="info-cont">
            <span>Cantidad a Entregar en Fisico: </span>
            <span>{{ totalMoney }}</span>
        </div>
        <div class="info-cont">
            <span>Cantidad En Plataforma: </span>
            <span>{{ total_platform }}</span>
        </div>
        <div class="info-cont">
            <span>Cantidad Total: </span>
            <span>{{ adjustedTotalSales }}</span>
            <span v-if="calculatedExcess > 0" style="color: orange;">
            (Incluye {{ calculatedExcess }} de ajuste)
    </span>
        </div>
        <div class="info-cont">
            <span>Inversion: </span>
            <span>{{ totalInvestment }}</span>
        </div>
        <div class="info-cont">
            <span>Ganancia: </span>
            <span>{{ total_revenue }}</span>
        </div>
        
        <div class="btns">
            <button @click="switchCCS()">Cancelar</button>
            <button @click="putShift() " class="confirm-btn">Confirmar</button>
        </div>
    </section>
</template>
<style scoped>
.c-container {
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
.info-cont{
    width: 90%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    color: white;
}
.btns{
    display:flex;
    gap: 20px;
    margin: 0 0 20px 0;
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
    .c-container{
        width: 35%;
    }
    
    button:hover{
        scale: 1.1;
    }
}
</style>