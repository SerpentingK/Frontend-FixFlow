<script setup>
import axios from 'axios';
import { ref, inject, watch, onMounted } from 'vue';


const startShift = inject("startShift");
const msg = ref("");
const total_outs = inject("total_outs");

const outFlows = ref({
        ref_shift : startShift.value,
        details:"",
        price: 0
    });

watch(total_outs, (newVal) => {
    localStorage.setItem("total_outs", JSON.stringify(newVal))
})

const postOutFlows = async () => {
    try {
        const ansawer = await axios.post('http://127.0.0.1:8000/insertOutflow', outFlows.value)
        msg.value = ansawer.data.msg;

        const previousOuts = JSON.parse(localStorage.getItem("total_outs")) || 0;

        total_outs.value = previousOuts + (outFlows.value.price || 0);

        localStorage.setItem("total_outs", JSON.stringify(total_outs.value))

        outFlows.value = {
            ref_shift : "",
            details:"",
            price: 0
        };
    } catch (error) {
        console.error('Error en ventas: ', error);
    }
}

onMounted(() => {
    const storedOuts = localStorage.getItem("total_outs")
    if (storedOuts) total_outs.value = JSON.parse(storedOuts)
});
</script>

<template>
    <section class="out-container">
        <form @submit.prevent="postOutFlows">
            <div class="input-container">
                <span>Razon: </span>
                <input type="text" placeholder="Ej: Almuerzo" v-model="outFlows.details" required/>
            </div>
            <div class="input-container">
                <span>Salida:</span>
                <input type="number" v-model="outFlows.price" required/>
            </div>
            <button class="confirm-btn">Confirmar</button>
        </form>
    </section>
</template>

<style scoped>
.out-container{
    margin-top: 30px;
    width: 100%;
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: column;
    max-height: 400px;
    overflow-y: scroll;
    scrollbar-width: none;
}
.out-container form{
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}
.input-container{
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    padding: 5px 10px;
    border-radius: 5px;
}
.input-container input{
    all: unset;
    width: 60%;
}
input::-webkit-outer-spin-button, input::-webkit-inner-spin-button{
    display: none;
}
.info-container{
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
    color: var(--secGray);
}
.confirm-btn{
    background-color: transparent;
    border: 2px solid var(--baseOrange);
    padding: 5px 10px;
    color: white;
    text-transform: uppercase;
    border-radius: 5px;
    letter-spacing: 1px;
    cursor: pointer;
    transition: .3s;
}
.confirm-btn:active{
    scale: .9;
}
@media (min-width: 1024px) {
    .out-container{
        width: 70%;
    }
}
</style>