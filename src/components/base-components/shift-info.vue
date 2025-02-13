<script setup>
import axios from 'axios';
import workerBillList from '../workers-components/worker-bill-list.vue';
import { inject, ref, onMounted } from 'vue';

const props = defineProps({
  shift: {
    type: Object,
    required: true,
    default: () => ({
      ref_shift: "080604-1",
      document: "Juan Pérez",
      start_time: "08:00",
      finish_time: "00:00",
      total_received: 1000000,
      total_gain: 800000,
      total_out: 200000,
      date: "2008-06-04"
    })
  }
});



const listOption = ref("entrance")

const bills = ref([])

const switchSI = inject("switchSI")

const getList =  async () => {
    let url = "";
    try{
    if (listOption.value === "entrance") {
            url = `http://127.0.0.1:8000/shiftReceived/${props.shift.ref_shift}`;
        } else if (listOption.value === "repaired") {
            url = `http://127.0.0.1:8000/shiftRepaired/${props.shift.ref_shift}`;
        } else if (listOption.value === "delivery") {
            url = `http://127.0.0.1:8000/shiftDelivery/${props.shift.ref_shift}`;
        }
    const ansawer = await axios.get(url)
    bills.value = ansawer.data  
    }catch (error) {
        console.error("Error al realizar la búsqueda:", error);
    }
}

onMounted(() => {
    getList()
})
</script>


<template>
    <section class="container">
        <button @click="switchSI" class="close-btn">
            <ion-icon name="close"></ion-icon>
        </button>
        <h2>{{ shift.ref_shift }}</h2>
        <div class="info-div">
            <span>Colaborador:</span>
            <span>{{ shift.document }}</span>
        </div>
        <div class="info-div">
            <span>Horario:</span>
            <span>{{ shift.start_time }} - {{ shift.finish_time }}</span>
        </div>
        <div class="info-div">
            <span>Total recaudado:</span>
            <span>{{ shift.total_received | currency }}</span>
        </div>
        <div class="info-div">
            <span>Ganancia:</span>
            <span>{{ shift.total_gain | currency }}</span>
        </div>
        <div class="info-div">
            <span>Salida:</span>
            <span>{{ shift.total_out | currency }}</span>
        </div>
        <div class="info-div">
            <span>Fecha:</span>
            <span>{{ shift.date_shift }}</span>
        </div>
        <form @submit.prevent="getList" class="list-options">
            <input type="radio" id="entrance-input" name="list-option" value="entrance" v-model="listOption" @change="getList"
                class="check-input">
            <label for="entrance-input" class="check-label">
                <ion-icon name="enter"></ion-icon>
            </label>

            <input type="radio" id="repaired-input" name="list-option" value="repaired" v-model="listOption" @change="getList"
                class="check-input">
            <label for="repaired-input" class="check-label">
                <ion-icon name="construct"></ion-icon>
            </label>

            <input type="radio" id="delivery-input" name="list-option" value="delivery" v-model="listOption" @change="getList"
                class="check-input">
            <label for="delivery-input" class="check-label">
                <ion-icon name="exit"></ion-icon>
            </label>
        </form>
        <workerBillList :bills="bills" />

    </section>
</template>

<style scoped>
.container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px 10px;
    width: 80%;
    border-radius: 10px;
    background: var(--baseGray);
    box-shadow: -25px -25px 51px #242424,
        25px 25px 51px #484848;
    border: 4px solid var(--baseOrange);
    scrollbar-width: none;
    display: flex;
    align-items: center;
    max-height: 70%;
    flex-direction: column;
    justify-content: flex-start;
}
.container h2{
    color: white;
    letter-spacing: 3px;
    font-size: 1.8rem;
}
.info-div{
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 90%;
    color: var(--secGray);
}

::-webkit-scrollbar {
    width: 0;
    height: 0;
}

.list-options {
    width: 100%;
    padding: 10px;
    display: flex;
    justify-content: space-around;
}

.check-input {
    display: none;
    /* Oculta el input de tipo radio */
}

.check-label {
    cursor: pointer;
    border-radius: 10px;
    background-color: var(--baseGray);
    border: 2px solid var(--baseOrange);
    padding: 10px;
    transition: 0.3s;
    font-weight: bolder;
    text-transform: capitalize;
    color: var(--secGray);
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Cambia el estilo del label cuando el input radio correspondiente está marcado */
.check-input:checked+.check-label {
    background-color: var(--baseOrange);
    border: 2px solid white;
    color: white;
    scale: 1.04;
    box-shadow: var(--secShadow);
}


.close-btn {
    all: unset;
    position: absolute;
    right: 10px;
    top: 10px;
    background-color: var(--baseOrange);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 5px;
    box-shadow: var(--secShadow);
    color: white;
    transition: .3s;
}
@media (min-width: 768px) {
    *{
        font-size: 1.3rem;
    }
}

@media (min-width: 1024px) {
    *{
        font-size: 1.1rem;
    }
    .container{
        width: 38%;
        max-height: 70%;
    }
}

</style>