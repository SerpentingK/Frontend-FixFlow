<script setup>
import { inject } from 'vue';


const switchSI = inject("switchSI")

const shifts = [
    {
        ref_shift: "080604-1",
        wname: "Juan Pérez",
        start_time: "08:00",
        finish_time: "16:00",
        total_received: 1000000, // Valor en pesos colombianos (COP)
        total_gain: 800000,     // Valor en pesos colombianos (COP)
        total_out: 200000,      // Valor en pesos colombianos (COP)
        date: "2008-06-04"      // Fecha derivada de ref_shift
    },
    {
        ref_shift: "090604-1",
        wname: "Ana López",
        start_time: "09:00",
        finish_time: "17:00",
        total_received: 1200000, // Valor en pesos colombianos (COP)
        total_gain: 900000,      // Valor en pesos colombianos (COP)
        total_out: 300000,       // Valor en pesos colombianos (COP)
        date: "2009-06-04"       // Fecha derivada de ref_shift
    },
    {
        ref_shift: "090604-2",
        wname: "Carlos García",
        start_time: "10:00",
        finish_time: "18:00",
        total_received: 1100000, // Valor en pesos colombianos (COP)
        total_gain: 850000,      // Valor en pesos colombianos (COP)
        total_out: 250000,       // Valor en pesos colombianos (COP)
        date: "2009-06-04"       // Fecha derivada de ref_shift
    },
    {
        ref_shift: "080604-1",
        wname: "Juan Pérez",
        start_time: "08:00",
        finish_time: "16:00",
        total_received: 1000000, // Valor en pesos colombianos (COP)
        total_gain: 800000,     // Valor en pesos colombianos (COP)
        total_out: 200000,      // Valor en pesos colombianos (COP)
        date: "2008-06-04"      // Fecha derivada de ref_shift
    },
    {
        ref_shift: "090604-1",
        wname: "Ana López",
        start_time: "09:00",
        finish_time: "17:00",
        total_received: 1200000, // Valor en pesos colombianos (COP)
        total_gain: 900000,      // Valor en pesos colombianos (COP)
        total_out: 300000,       // Valor en pesos colombianos (COP)
        date: "2009-06-04"       // Fecha derivada de ref_shift
    },
    {
        ref_shift: "090604-2",
        wname: "Carlos García",
        start_time: "10:00",
        finish_time: "18:00",
        total_received: 1100000, // Valor en pesos colombianos (COP)
        total_gain: 850000,      // Valor en pesos colombianos (COP)
        total_out: 250000,       // Valor en pesos colombianos (COP)
        date: "2009-06-04"       // Fecha derivada de ref_shift
    },
];

</script>

<template>
    <section class="container">
        <h2>TURNOS</h2>
        <form @submit.prevent="" class="search-form">
            <input type="date">
            <button><ion-icon name="search"></ion-icon></button>
        </form>
        <ul class="shifts-list">
            <li v-for="shift in shifts" :key="shift" class="shift">
                <fieldset @click="switchSI(shift)">
                    <legend>{{ shift.ref_shift }}</legend>
                    <span>{{ shift.wname }}</span>
                    <span>{{ shift.date }}</span>
                </fieldset>
            </li>
        </ul>
    </section>
</template>

<style scoped>
.container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px 10px;
    width: 75%;
    border-radius: 10px;
    background: var(--baseGray);
    box-shadow: -25px -25px 51px #242424,
        25px 25px 51px #484848;
    border: 4px solid var(--baseOrange);
    overflow-y: scroll;
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
.search-form{
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    justify-content: center;
}
.search-form input{
    padding: 5px 10px;
    border-radius: 10px;
    border: 1px solid var(--baseGray);
}
.search-form button{
    background: var(--baseOrange);
    color: white;
    border: none;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px
}
.search-form button *{
    scale: 1.3;
}
.shifts-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
}
.shift{
    width: 90%;
}
.shift fieldset{
    border-radius:5px;
    background-color: var(--thirdGray);
    border-color: var(--secGray);
    color: white;
    display: flex;
    justify-content: space-between;
}
@media (min-width:768px) {
    *{
        font-size: 1.3rem;
    }
}

@media (min-width:1024px) {
    *{
        font-size: 1.1rem;
    }
    .container{
        width: 40%;
    }
}
</style>