<script setup>
import axios from "axios";
import { inject, onMounted, ref, watch } from "vue";
import debounce from "lodash/debounce";

const switch_sbf = inject("switch_sbf");

// Propiedades reactivas
const bills = ref([]);
const isLoading = ref(false); // Indicador de carga
const search = ref(""); // Texto de búsqueda
const searchType = ref("1"); // Tipo de búsqueda
const loggedCompany = inject("loggedCompany");
const selectedPremiseId = inject("selectedPremiseId");
const premises = ref([]); // Para almacenar la lista de locales

// Función para cargar todos los locales
const loadPremises = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/someDataOfPremises/${loggedCompany.value}`);
        premises.value = response.data;
    } catch (error) {
        console.error("Error al cargar los locales:", error);
    }
};

// Función para cargar todas las facturas
const loadAllBills = async () => {
  try {
    isLoading.value = true;
    const answer = await axios.get(
      `${import.meta.env.VITE_API_URL}/someDataOfBill/${selectedPremiseId.value}`
    );
    bills.value = answer.data;
  } catch (error) {
    console.error("Error al cargar todas las facturas:", error);
  } finally {
    isLoading.value = false;
  }
};

// Función de búsqueda
const searchBills = debounce(async () => {
  if (!search.value.trim()) {
    loadAllBills();
    return;
  }

  try {
    isLoading.value = true;
    let url = "";

    if (searchType.value === "1") {
      url = `${import.meta.env.VITE_API_URL}/searchBillsByNumber/${loggedCompany.value}/${search.value}`;
    } else if (searchType.value === "2") {  
      url = `${import.meta.env.VITE_API_URL}/searchBillsByDate/${loggedCompany.value}/${search.value}`;
    } else if (searchType.value === "3") {
      url = `${import.meta.env.VITE_API_URL}/searchBillsByName/${loggedCompany.value}/${search.value}`;
    } else if (searchType.value === "4") {
      url = `${import.meta.env.VITE_API_URL}/searchBillsByPremise/${loggedCompany.value}/${search.value}`;
    }

    const tempBills = await axios.get(url);
    bills.value = Array.isArray(tempBills.data) ? tempBills.data : [tempBills.data];
  } catch (error) {
    console.error("Error al realizar la búsqueda:", error);
    bills.value = [];
  } finally {
    isLoading.value = false;
  }
}, 500);

// Cambiar el tipo de búsqueda
const changeSearchType = (type) => {
    searchType.value = type;
    search.value = "";
    loadAllBills();
};

watch(search, searchBills);

onMounted(() => {
    loadAllBills();
    loadPremises();
});
</script>

<template>
    <section class="container">
        <div v-if="isLoading" class="overlay">
            <div class="spinner"></div>
        </div>
        <h2>LISTA DE FACTURAS</h2>
        
        <div class="search-options">
            <button 
                @click="changeSearchType('1')" 
                :class="{ active: searchType === '1' }"
            >
                Número de Factura
            </button>
            <button 
                @click="changeSearchType('2')" 
                :class="{ active: searchType === '2' }"
            >
                Fecha
            </button>
            <button 
                @click="changeSearchType('3')" 
                :class="{ active: searchType === '3' }"
            >
                Cliente
            </button>
            <button 
                @click="changeSearchType('4')" 
                :class="{ active: searchType === '4' }"
            >
                Local
            </button>
        </div>

        <form @submit.prevent="searchBills" class="search-form">
            <input 
                v-if="searchType === '2'" 
                type="date" 
                v-model="search"
                placeholder="Seleccione una fecha"
            >
            <select 
                v-else-if="searchType === '4'" 
                v-model="search"
                class="local-select"
                @change="searchBills"
            >
                <option value="">Seleccione un local</option>
                <option 
                    v-for="local in premises" 
                    :key="local.ref_premises" 
                    :value="local.ref_premises"
                >
                    {{ local.name }} 
                </option>
            </select>
            <input 
                v-else
                type="text" 
                placeholder="Buscar" 
                v-model="search" 
            />
        </form>

        <ol class="bill-list">
            <transition-group name="fade">
                <button 
                    v-for="bill in bills" 
                    :key="bill.bill_number" 
                    @click="switch_sbf(bill.bill_number)"
                >
                    <fieldset>
                        <legend>{{ bill.bill_number.split('-').slice(1).join('-') }}</legend>
                        <span>{{ bill.client_name }}</span>
                        <span>{{ bill.entry_date }}</span>
                    </fieldset>
                </button>
            </transition-group>
            <div v-if="bills.length === 0" class="no-bills-message">
                No se han encontrado facturas
            </div>
        </ol>
    </section>
</template>

<style scoped>
.container {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 20px 10px;
    width: 75%;
    border-radius: 10px;
    background: var(--second);
    box-shadow: -25px -25px 51px #242424,
        25px 25px 51px #484848;
    border: 4px solid var(--base);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 70%;
    overflow-y: scroll;
    scrollbar-width: none;
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
    flex-wrap: wrap;
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

.bill-list {
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

.bill-list button {
    all: unset;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.bill-list button fieldset {
    width: 90%;
    display: flex;
    justify-content: space-between;
    border: 2px solid var(--secondTwo);
    border-radius: 10px;
    background-color: var(--secondThree);
    color: white;
    padding: 10px;
    transition: all .3s ease;
}

.bill-list button:hover fieldset {
    background-color: var(--secondTwo);
    box-shadow: var(--secShadow);
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter, .fade-leave-to {
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

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.no-bills-message {
    color: var(--base);
    text-align: center;
    padding: 20px;
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    margin-top: 10px;
}

@media (min-width: 768px) {
    * {
        font-size: 1.3rem;
    }
    .bill-list {
        max-height: 500px;
    }
}

@media (min-width: 1024px) {
    * {
        font-size: 1.1rem;
    }
    .container {
        width: 40%;
        max-height: 80%;
    }
    
    .bill-list button fieldset {
        flex-direction: row;
        flex-wrap: wrap;
    }
    
    .bill-list button fieldset span {
        flex: 1;
        min-width: 120px;
    }
}
</style>