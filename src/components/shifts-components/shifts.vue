<script setup>
import axios from 'axios';
import { debounce } from 'lodash';
import { inject, onMounted, ref, watch } from 'vue';


const switchSI = inject("switchSI")
const loggedCompany = inject('loggedCompany')

const shifts = ref([]);

const loadAllShifts = async () => {
    try {
        const answer = await axios.get(`/api/allShiftCompany/${loggedCompany.value}`);

        // Función auxiliar para formatear la hora
        const formatTime = (dateString) => {
            if (!dateString) return "Sesion En turno";
            const dateObj = new Date(dateString);
            let hours = dateObj.getHours();
            const minutes = dateObj.getMinutes().toString().padStart(2, '0');
            const period = hours >= 12 ? "PM" : "AM";
            hours = hours % 12 || 12; // Convierte 0 (medianoche) a 12
            return `${hours}:${minutes} ${period}`;
        };

        shifts.value = answer.data.map(shift => {
            return {
                ...shift,
                start_time: formatTime(shift.start_time), // Reemplaza start_time con la fecha formateada
                finish_time: formatTime(shift.finish_time) // Reemplaza finish_time con la fecha formateada
            };
        });
    } catch (error) {
        console.error("Error al cargar los turno", error);
    }
};

const search = ref("");


const searchsShifts = debounce(async () => {
    if (!search.value.trim()) {
        loadAllShifts(); // Mostrar todas las facturas si el campo está vacío
        return;
    }
    try {
        const answer = await axios.get(`/api/searchDateShift/${loggedCompany.value}/${search.value}`);
        shifts.value = answer.data;
    } catch (error) {
        console.error("Error al cargar las búsquedas del turno", error);
    }
}, 500);


watch(search, searchsShifts)

onMounted(loadAllShifts)

</script>

<template>
    <section class="container">
        <h2>TURNOS</h2>
        <form @submit.prevent="searchsShifts" class="search-form">
            <input type="date" v-model="search">
        </form>
        <ul class="shifts-list">
            <li v-for="shift in shifts" :key="shift" class="shift">
                <fieldset @click="switchSI(shift)">
                    <legend>{{ shift.ref_shift }}</legend>
                    <span>{{ shift.id.split('_').slice(1).join('_') }}</span>
                    <span>{{ shift.date_shift }}</span>
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
    cursor: pointer;
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
    gap: 10px;
}
.shift{
    width: 90%;
    cursor: pointer;
}
.shift:hover fieldset{
    background-color: var(--secGray);
    color: white;
    box-shadow: var(--secShadow);

}
.shift fieldset{
    border-radius:5px;
    background-color: var(--thirdGray);
    border-color: var(--secGray);
    color: white;
    display: flex;
    justify-content: space-between;
    transition: all .3s ease;
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