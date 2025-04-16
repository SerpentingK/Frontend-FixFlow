<script setup>
import axios from 'axios';
import { debounce } from 'lodash';
import { inject, onMounted, ref, watch } from 'vue';

const switchSI = inject("switchSI")
const loggedCompany = inject('loggedCompany')
const selectedPremiseId = inject("selectedPremiseId", ref(null));

const shifts = ref([]);
const premises = ref([]); // Para almacenar la lista de locales
const searchType = ref('date'); // 'date' o 'local' - tipo de búsqueda
const search = ref(""); // Puede ser fecha o ID de local según searchType

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

// Cargar todos los locales disponibles
const loadPremises = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/someDataOfPremises/${loggedCompany.value}`);
        premises.value = response.data;
    } catch (error) {
        console.error("Error al cargar los locales:", error);
    }
};

const loadAllShifts = async () => {
    try {
        const answer = await axios.get(`${import.meta.env.VITE_API_URL}/allShiftCompanyPremises/${loggedCompany.value}/${selectedPremiseId.value}`);

        // Obtener los nombres de los técnicos para cada turno
        const shiftsWithNames = await Promise.all(
            answer.data.map(async (shift) => {
                try {
                    // Extraer el documento del ID del turno
                    const workerDocument = shift.id.split('_').slice(1).join('_');
                    
                    // Consultar el nombre del técnico
                    const workerResponse = await axios.get(`${import.meta.env.VITE_API_URL}/worker/${workerDocument}/${loggedCompany.value}`);
                    
                    // Verificar si la respuesta tiene el formato esperado
                    if (workerResponse.data && workerResponse.data.wname) {
                        return {
                            ...shift,
                            start_time: formatTime(shift.start_time),
                            finish_time: formatTime(shift.finish_time),
                            worker_name: workerResponse.data.wname
                        };
                    } else {
                        console.warn(`Respuesta inesperada para el trabajador ${workerDocument}:`, workerResponse.data);
                        return {
                            ...shift,
                            start_time: formatTime(shift.start_time),
                            finish_time: formatTime(shift.finish_time),
                            worker_name: "Técnico desconocido"
                        };
                    }
                } catch (error) {
                    console.error(`Error al obtener el nombre del técnico para el turno ${shift.id}:`, error);
                    return {
                        ...shift,
                        start_time: formatTime(shift.start_time),
                        finish_time: formatTime(shift.finish_time),
                        worker_name: "Técnico desconocido"
                    };
                }
            })
        );

        shifts.value = shiftsWithNames;
    } catch (error) {
        console.error("Error al cargar los turnos", error);
    }
};

const searchsShifts = debounce(async () => {
    if (!search.value || !search.value.toString().trim()) {
        loadAllShifts(); // Mostrar todos los turnos si el campo está vacío
        return;
    }
    
    try {
        let response;
        if (searchType.value === 'date') {
            // Búsqueda por fecha
            response = await axios.get(`${import.meta.env.VITE_API_URL}/searchDateShift/${loggedCompany.value}/${selectedPremiseId.value}`);
        } else if (searchType.value === 'local') {
            response = await axios.get(`${import.meta.env.VITE_API_URL}/searchpremiseshift/${loggedCompany.value}/${selectedPremiseId.value}`);
        }

        // Procesar los resultados para incluir los nombres de los trabajadores
        const shiftsWithNames = await Promise.all(
            response.data.map(async (shift) => {
                try {
                    // Extraer el documento del ID del turno
                    const workerDocument = shift.id.split('_').slice(1).join('_');
                    
                    // Consultar el nombre del técnico
                    const workerResponse = await axios.get(`${import.meta.env.VITE_API_URL}/worker/${workerDocument}/${loggedCompany.value}`);
                    
                    // Verificar si la respuesta tiene el formato esperado
                    if (workerResponse.data && workerResponse.data.wname) {
                        return {
                            ...shift,
                            start_time: formatTime(shift.start_time),
                            finish_time: formatTime(shift.finish_time),
                            worker_name: workerResponse.data.wname
                        };
                    } else {
                        console.warn(`Respuesta inesperada para el trabajador ${workerDocument}:`, workerResponse.data);
                        return {
                            ...shift,
                            start_time: formatTime(shift.start_time),
                            finish_time: formatTime(shift.finish_time),
                            worker_name: "Técnico desconocido"
                        };
                    }
                } catch (error) {
                    console.error(`Error al obtener el nombre del técnico para el turno ${shift.id}:`, error);
                    return {
                        ...shift,
                        start_time: formatTime(shift.start_time),
                        finish_time: formatTime(shift.finish_time),
                        worker_name: "Técnico desconocido"
                    };
                }
            })
        );

        shifts.value = shiftsWithNames;
    } catch (error) {
        console.error("Error al cargar las búsquedas del turno", error);
    }
}, 500);

// Cambiar el tipo de búsqueda
const changeSearchType = (type) => {
    searchType.value = type;
    search.value = ""; // Limpiar el campo de búsqueda al cambiar el tipo
    loadAllShifts(); // Mostrar todos los turnos nuevamente
};

watch(search, searchsShifts);

onMounted(() => {
    loadAllShifts();
    loadPremises(); // Cargar los locales al montar el componente
});
</script>

<template>
    <section class="container">
        <h2>TURNOS</h2>
        
        <div class="search-options">
            <button 
                @click="changeSearchType('date')" 
                :class="{ active: searchType === 'date' }"
            >
                Buscar por Fecha
            </button>
            <button 
                @click="changeSearchType('local')" 
                :class="{ active: searchType === 'local' }"
            >
                Buscar por Local
            </button>
        </div>
        
        <form @submit.prevent="searchsShifts" class="search-form">
            <input 
                v-if="searchType === 'date'" 
                type="date" 
                v-model="search"
                placeholder="Seleccione una fecha"
            >
            
            <select 
                v-else-if="searchType === 'local'" 
                v-model="search"
                class="local-select"
                @change="searchsShifts"
            >
                <option value="">Seleccione un local</option>
                <option 
                    v-for="local in premises" 
                    :key="local.ref_premises" 
                    :value="local.ref_premises"
                >
                    {{ local.name }} ({{ local.address }})
                </option>
            </select>
            
            <button type="submit" class="search-button">
                Buscar
            </button>
        </form>
        
        <ul class="shifts-list">
            <li v-for="shift in shifts" :key="shift" class="shift">
                <fieldset @click="switchSI(shift)">
                    <legend>{{ shift.worker_name }}</legend>
                    <span>{{ shift.id.split('_').slice(1).join('_') }}</span>
                    <span>{{ shift.date_shift }}</span>
                    <span v-if="shift.local_name">Local: {{ shift.local_name }}</span>
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
    background: var(--second);
    box-shadow: -25px -25px 51px #242424,
        25px 25px 51px #484848;
    border: 4px solid var(--base);
    overflow-y: scroll;
    scrollbar-width: none;
    display: flex;
    align-items: center;
    max-height: 70%;
    flex-direction: column;
    justify-content: flex-start;
}

.container h2 {
    color: white;
    letter-spacing: 3px;
    font-size: 1.8rem;
    margin-bottom: 15px;
}

.search-options {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
}

.search-options button {
    padding: 8px 15px;
    border-radius: 5px;
    border: none;
    background-color: var(--secondThree);
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
}

.search-options button.active {
    background-color: var(--base);
    font-weight: bold;
}

.search-options button:hover {
    background-color: var(--secondTwo);
}

.search-form {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    justify-content: center;
    margin-bottom: 15px;
}

.search-form input,
.search-form select {
    padding: 8px 12px;
    border-radius: 10px;
    border: 1px solid var(--secondTwo);
    background-color: var(--secondThree);
    color: white;
    cursor: pointer;
    min-width: 200px;
}

.search-form select option {
    background-color: var(--second);
    color: white;
}

.search-button {
    background: var(--base);
    color: white;
    border: none;
    border-radius: 10px;
    padding: 8px 15px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.search-button:hover {
    background-color: var(--secondTwo);
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
    gap: 10px;
}

.shift {
    width: 100%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}

.shift:hover fieldset {
    background-color: var(--secondTwo);
    color: white;
    box-shadow: var(--secShadow);
}

.shift fieldset {
    border-radius: 5px;
    background-color: var(--secondThree);
    border-color: var(--secondTwo);
    color: white;
    display: flex;
    justify-content: space-between;
    transition: all .3s ease;
    width: 90%;
    padding: 10px;
}

.shift fieldset span {
    margin: 0 5px;
}

@media (min-width:768px) {
    * {
        font-size: 1.3rem;
    }
}

@media (min-width:1024px) {
    * {
        font-size: 1.1rem;
    }
    
    .container {
        width: 40%;
    }
    
    .shift fieldset {
        flex-direction: row;
        flex-wrap: wrap;
    }
    
    .shift fieldset span {
        flex: 1;
        min-width: 120px;
    }
}
</style>