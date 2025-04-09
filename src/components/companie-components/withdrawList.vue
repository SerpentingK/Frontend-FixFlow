<script setup>
import axios from "axios";
import { inject, onMounted, ref, watch } from "vue";
import debounce from "lodash/debounce";

const switch_sbf = inject("switch_sbf");

// Propiedades reactivas
const withdrawals = ref([]);
const isLoading = ref(false);
const search = ref("");
const loggedCompany = inject("loggedCompany");
const switchSWL = inject("switchSWL");

// Función para cargar todos los retiros
const loadAllWithdrawals = async () => {
    try {
        isLoading.value = true;
        const response = await axios.get(
            `/api/withdrawals/${loggedCompany.value}`
        );
        withdrawals.value = response.data;
    } catch (error) {
        console.error("Error al cargar los retiros:", error);
    } finally {
        isLoading.value = false;
    }
};

// Función de búsqueda solo por nombre de trabajador
const searchWithdrawals = debounce(async () => {
    if (!search.value.trim()) {
        loadAllWithdrawals();
        return;
    }

    try {
        isLoading.value = true;
        const url = `/api/searchWithdrawalsByWorker/${loggedCompany.value}/${search.value}`;
        const response = await axios.get(url);
        withdrawals.value = Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
        console.error("Error al realizar la búsqueda:", error);
    } finally {
        isLoading.value = false;
    }
}, 500);

// Observador para activar la búsqueda
watch(search, searchWithdrawals);

// Cargar todos los retiros al montar el componente
onMounted(loadAllWithdrawals);
const overlayAlpha = ref(0);

onMounted(() => {
    setTimeout(() => {
        overlayAlpha.value = 0.5;
    }, 100); // Pequeño retraso antes de iniciar la animación
});
</script>

<template>
    <div class="fullscreen-overlay" @click.self="switchSWL"
        :style="{ backgroundColor: `rgba(0, 0, 0, ${overlayAlpha})` }">
        <section class="container">
            <div v-if="isLoading" class="overlay">
                <div class="spinner"></div>
            </div>
            <h2>LISTA DE RETIROS</h2>
            <ion-icon name="close-circle-outline" class="close-btn" @click="switchSWL"></ion-icon>
            <form @submit.prevent="searchWithdrawals" class="search-form">
                <span>Buscar Por Fecha</span>
                <input type="date" v-model="search" />
            </form>
            <ol class="withdraw-list">
                <transition-group name="fade">
                    <button v-for="withdraw in withdrawals" :key="withdraw.id" @click="switch_sbf(withdraw.id)">
                        <fieldset>
                            <legend>{{ withdraw.worker_name }}</legend>
                            <span>{{ withdraw.date }}</span>
                            <span>${{ withdraw.amount.toLocaleString() }}</span>
                        </fieldset>
                    </button>
                </transition-group>
            </ol>
        </section>
    </div>
</template>

<style scoped>
.fullscreen-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0);
    /* Empieza completamente transparente */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    transition: background-color .5s ease-in-out;
}

.container {
    position: relative;
    padding: 5px 20px;
    width: 80%;
    border-radius: 10px;
    background: var(--second);
    border: 4px solid var(--base);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 70%;
    transition: all .4s ease;
    z-index: 10000;
    /* Por encima del overlay */
}

.container h2 {
    color: white;
    letter-spacing: 2px;
    text-align: center;
}

.search-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    color: white;
    gap: 10px;
    width: 100%;
}

.search-form input {
    background-color: white;
    color: black;
    border-radius: 10px;
    padding: 5px 10px;
    width: 80%;
    max-width: 400px;
}

.withdraw-list {
    list-style: none;
    padding: 0;
    margin-top: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    max-height: 300px;
    overflow-y: scroll;
    scrollbar-width: none;
    padding: 5px 10px;
}

.withdraw-list button {
    all: unset;
    border-radius: 5px;
    transition: background-color 0.3s;
    width: 100%;
    display: flex;
    color: white;
    transition: .3s;
}

.withdraw-list button fieldset {
    width: 100%;
    display: flex;
    justify-content: space-between;
    border: 2px solid var(--secondTwo);
    border-radius: 10px;
}

.withdraw-list button:active {
    scale: .9;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.spinner {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid var(--base);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: var(--base);
    padding: 5px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    box-shadow: var(--secShadow);
    font-size: 1.4rem;
    transition: all .3s ease;
    cursor: pointer;
}

.close-btn:hover {
    scale: 1.1;
}

.close-btn * {
    position: absolute;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@media (min-width: 768px) {
    * {
        font-size: 1.3rem;
    }

    .withdraw-list {
        max-height: 500px;
    }
}

@media (min-width: 1024px) {
    * {
        font-size: 1.2rem;
    }

    .container {
        max-height: 80%;
        width: 45%;
    }
}
</style>