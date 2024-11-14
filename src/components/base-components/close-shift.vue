<script setup>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';

const phonesRepaired = inject('phonesRepaired');
const phonesReceived = inject('phonesReceived');
const phonesDelivered = inject('phonesDelivered');

const switchCS = inject("switchCS")


const loggedWorker = inject("loggedWorker", ref(null));
const workerRole = inject("workerRole", ref(null));

const router = useRouter()

const logoutWorker = () => {
    loggedWorker.value = null;
    workerRole.value = null;
    router.push("/workers/login-worker")
    switchCS()
}

</script>


<template>
    <section class="container">
        <h2>CERRAR SESION</h2>
        <div class="info-div">
            <span>Colaborador:</span>
            <span>Felipe Sierra</span>
        </div>
        <div class="info-div">
            <span>Turno:</span>
            <span>080624-1</span>
        </div>
        <div class="info-div">
            <span>Hora de inicio:</span>
            <span>10:00 am</span>
        </div>
        <div class="info-div">
            <span>Total recibido:</span>
            <span>1.500.0000</span>
        </div>
        <div class="info-div">
            <span>Total ganancia:</span>
            <span>900.0000</span>
        </div>
        <div class="info-div">
            <span>Total salidas:</span>
            <span>300.0000</span>
        </div>
        <div class="info-div">
            <span>Final:</span>
            <span>1.200.000</span>
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
            <button class="confirm-btn" @click="logoutWorker">Confirmar</button>
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