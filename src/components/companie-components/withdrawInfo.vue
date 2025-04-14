<script setup>
import axios from "axios";
import { inject, onMounted, ref, watch } from "vue";
import debounce from "lodash/debounce";

const switchSVI = inject("switchSVI");
const loggedCompany = inject("loggedCompany");
const switchWV = inject("switchWV");

// Propiedades reactivas
const withdrawals = ref([]);
const premiseInfo = ref({
  name: "",
  vault: 0
});
const workers = ref([]); // Lista de colaboradores
const isLoading = ref(false);
const search = ref("");
const searchType = ref("worker"); // 'worker' o 'date'
const overlayAlpha = ref(0);

// Función para cargar información del local
const loadPremiseInfo = async () => {
  try {
    const response = await axios.get(`/api/premises/${loggedCompany.value}`);
    premiseInfo.value = response.data;
  } catch (error) {
    console.error("Error al cargar información del local:", error);
  }
};

// Función para cargar todos los colaboradores
const loadWorkers = async () => {
  try {
    const response = await axios.get(`/api/workers/${loggedCompany.value}`);
    workers.value = response.data;
  } catch (error) {
    console.error("Error al cargar los colaboradores:", error);
  }
};

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

// Función de búsqueda con tipo dinámico
const searchWithdrawals = debounce(async () => {
  if (!search.value.trim()) {
    loadAllWithdrawals();
    return;
  }

  try {
    isLoading.value = true;
    let url = '';
    
    if (searchType.value === 'worker') {
      url = `/api/searchWithdrawalsByWorker/${loggedCompany.value}/${search.value}`;
    } else if (searchType.value === 'date') {
      url = `/api/searchWithdrawalsByDate/${loggedCompany.value}/${search.value}`;
    }
    
    const response = await axios.get(url);
    withdrawals.value = Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error al realizar la búsqueda:", error);
  } finally {
    isLoading.value = false;
  }
}, 500);

// Cambiar tipo de búsqueda
const changeSearchType = (type) => {
  searchType.value = type;
  search.value = "";
  loadAllWithdrawals();
};

// Observador para activar la búsqueda
watch(search, searchWithdrawals);

// Cargar datos al montar el componente
onMounted(() => {
  loadPremiseInfo();
  loadWorkers();
  loadAllWithdrawals();
  
  setTimeout(() => {
    overlayAlpha.value = 0.5;
  }, 100);
});
</script>

<template>
    <div class="fullscreen-overlay" @click.self="switchSVI"
        :style="{ backgroundColor: `rgba(0, 0, 0, ${overlayAlpha})` }">
        <section class="container">
            <div v-if="isLoading" class="overlay">
                <div class="spinner"></div>
            </div>
            <h2>INFORMACIÓN DEL LOCAL</h2>
            <ion-icon name="close-circle-outline" class="close-btn" @click="switchSVI"></ion-icon>
            
            <!-- Información del local -->
            <div class="premise-info">
                <div class="info-item">
                    <span class="label">Nombre:</span>
                    <span class="value">Portal</span>
                </div>
                <div class="info-item">
                    <span class="label">Caja fuerte:</span>
                    <span class="value">${{ premiseInfo.vault.toLocaleString() }}</span>
                </div>
                <button class="new-withdrawal-btn" @click="switchWV">
                    Nuevo Retiro
                    <ion-icon name="add-circle-outline"></ion-icon>
                </button>
            </div>
            
            <h3>LISTA DE RETIROS</h3>
            
            <!-- Selector de tipo de búsqueda -->
            <div class="search-options">
                <button 
                    @click="changeSearchType('worker')" 
                    :class="{ active: searchType === 'worker' }"
                >
                    Buscar por Colaborador
                </button>
                <button 
                    @click="changeSearchType('date')" 
                    :class="{ active: searchType === 'date' }"
                >
                    Buscar por Fecha
                </button>
            </div>
            
            <!-- Formulario de búsqueda dinámico -->
            <form @submit.prevent="searchWithdrawals" class="search-form">
                <select 
                    v-if="searchType === 'worker'" 
                    v-model="search"
                    class="worker-select"
                >
                    <option value="">Seleccione un colaborador</option>
                    <option 
                        v-for="worker in workers" 
                        :key="worker.id" 
                        :value="worker.id"
                    >
                        {{ worker.name }} ({{ worker.document }})
                    </option>
                </select>
                
                <input 
                    v-else-if="searchType === 'date'" 
                    type="date" 
                    v-model="search"
                    placeholder="Seleccione una fecha"
                />
                
                <button type="submit" class="search-button">
                    Buscar
                </button>
            </form>
            
            <!-- Lista de retiros -->
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
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    transition: background-color .5s ease-in-out;
}

.container {
    position: relative;
    padding: 15px 20px;
    width: 80%;
    border-radius: 10px;
    background: var(--second);
    border: 4px solid var(--base);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 85%;
    transition: all .4s ease;
    z-index: 10000;
}

.container h2, .container h3 {
    color: white;
    letter-spacing: 2px;
    text-align: center;
    margin: 10px 0;
}

.premise-info {
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}

.info-item {
    display: flex;
    flex-direction: column;
    min-width: 120px;
}

.label {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.7);
}

.value {
    font-size: 1.1rem;
    color: white;
    font-weight: bold;
}

.new-withdrawal-btn {
    background: var(--base);
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    gap: 5px;
    cursor: pointer;
    transition: all 0.3s;
}

.new-withdrawal-btn:hover {
    background: var(--base-dark);
    transform: scale(1.05);
}

/* Estilos para el selector de tipo de búsqueda */
.search-options {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    width: 100%;
    justify-content: center;
}

.search-options button {
    padding: 8px 15px;
    border-radius: 5px;
    border: none;
    background-color: var(--secondThree);
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.search-options button.active {
    background-color: var(--base);
    font-weight: bold;
}

.search-options button:hover {
    background-color: var(--secondTwo);
}

/* Estilos para el formulario de búsqueda */
.search-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    color: white;
    gap: 10px;
    width: 100%;
    margin: 10px 0;
}

.search-form select,
.search-form input {
    background-color: white;
    color: black;
    border-radius: 10px;
    padding: 8px 12px;
    width: 80%;
    max-width: 400px;
    border: 1px solid var(--secondTwo);
}

.search-button {
    background: var(--base);
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
}

.search-button:hover {
    background: var(--base-dark);
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
    overflow-y: auto;
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
    padding: 8px 12px;
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
        max-height: 400px;
    }
    
    .info-item {
        min-width: 150px;
    }
    
    .label {
        font-size: 0.9rem;
    }
    
    .value {
        font-size: 1.3rem;
    }
    
    .search-options button {
        font-size: 1rem;
        padding: 10px 20px;
    }
}

@media (min-width: 1024px) {
    * {
        font-size: 1.2rem;
    }

    .container {
        max-height: 85%;
        width: 50%;
    }
    
    .withdraw-list {
        max-height: 500px;
    }
    
    .search-form {
        flex-wrap: nowrap;
    }
    
    .search-form select,
    .search-form input {
        width: 60%;
    }
}
</style>