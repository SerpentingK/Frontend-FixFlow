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

// Función para cargar todas las facturas
const loadAllBills = async () => {
  try {
    isLoading.value = true; // Activar indicador de carga
    const answer = await axios.get(
      `/api/someDataOfBill/${loggedCompany.value}`
    );
    bills.value = answer.data;
  } catch (error) {
    console.error("Error al cargar todas las facturas:", error);
  } finally {
    isLoading.value = false; // Desactivar indicador de carga
  }
};

// Función de búsqueda
const searchBills = debounce(async () => {
  if (!search.value.trim()) {
    loadAllBills(); // Mostrar todas las facturas si el campo está vacío
    return;
  }

  try {
    isLoading.value = true; // Activar indicador de carga
    let url = "";

    // Determinar la URL según el tipo de búsqueda
    if (searchType.value === "1") {
      // Filtrar por número de factura
      url = `/api/searchBillsByNumber/${loggedCompany.value}/${search.value}`;
    } else if (searchType.value === "2") {  
      // Filtrar por fecha
      url = `/api/searchBillsByDate/${loggedCompany.value}/${search.value}`;
    } else if (searchType.value === "3") {
      // Filtrar por cliente
      url = `/api/searchBillsByName/${loggedCompany.value}/${search.value}`;
    }

    const tempBills = await axios.get(url);
    bills.value = Array.isArray(tempBills.data) ? tempBills.data : [tempBills.data];
  } catch (error) {
    console.error("Error al realizar la búsqueda:", error);
  } finally {
    isLoading.value = false; // Desactivar indicador de carga
  }
}, 500); // Retardo de 900 ms

// Observador para activar la búsqueda mientras el usuario escribe
watch(search, searchBills);

// Cargar todas las facturas al montar el componente
onMounted(loadAllBills);
</script>

<template>
    <section class="container">
        <div v-if="isLoading" class="overlay">
            <div class="spinner"></div>
        </div>
        <h2>LISTA DE FACTURAS</h2>
        <form @submit.prevent="searchBills" class="search-form">
            <select v-model="searchType">
                <option value="1">Numero de Factura</option>
                <option value="2">Fecha</option>
                <option value="3">Cliente</option>
            </select>
            <input type="text" placeholder="Buscar" v-model="search" />
        </form>
        <ol class="bill-list">
            <!-- Lista de facturas -->
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
        </ol>
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
    transition: all .4s ease;
}
.container h2{
    color: white;
    letter-spacing: 2px;
    text-align: center;
}
.search-form{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
}
.search-form *{
    background-color: white;
    color: black;
    border-radius: 10px;
    padding: 5px 10px;
}
.search-form button{
    all: unset;
    border-radius: 10px;
    padding: 5px 10px;
    background-color: var(--baseOrange);
    color: white;
    cursor: pointer;
    transition: .3s;
}
.search-form button:active{
    scale: .9;
}
.bill-list{
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
.bill-list button{
    all: unset;
    border-radius: 5px;
    transition: background-color 0.3s;
    width: 100%;
    display: flex;
    color: white;
    transition: .3s;
    
}
.bill-list button fieldset{
    width: 100%;
    display: flex;
    justify-content: space-between;
    border: 2px solid var(--secGray);
    border-radius: 10px;
}
.bill-list button:active{
    scale: .9;
}
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}
button.load-btn{
    all: unset;
    background-color: var(--baseOrange);
    color: white;
    border-radius: 10px;
    padding: 5px 10px;
    cursor: pointer;
    margin-top: 10px;
    transition: .3s;
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
    border-top: 4px solid var(--baseOrange);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
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
    *{
        font-size: 1.3rem;
    }
    .bill-list{
        max-height: 500px;
    }
}

@media (min-width: 1024px) {
    *{
        font-size: 1.2rem;
    }
    .container{
        max-height: 80%;
        width: 45%;
    }
}
</style>