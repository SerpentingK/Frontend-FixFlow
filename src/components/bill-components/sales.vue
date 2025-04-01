<script setup>
import axios from 'axios';
import { ref, computed, inject, watch, onMounted } from 'vue';

// Variables
const sale = ref(0);
const cashSale = ref(0);
const platformSale = ref(0);
const original_price = ref(0);
const revenue_price = computed(() => (cashSale.value + platformSale.value) - original_price.value);

// Inyecta las variables globales
const startShift = inject("startShift");
const total_sales = inject("total_sales");
const total_revenue = inject("total_revenue");
const total_cash = inject("total_cash");
const total_platform = inject("total_platform");
const msg = ref("");

// Estructura de ventas
const sales = ref({
    ref_shift: startShift.value,
    product: "",
    sale: 0,
    original_price: 0,
    revenue_price: 0
});

// Observadores para guardar en localStorage
watch(total_sales, (newVal) => {
    localStorage.setItem("total_sales", JSON.stringify(newVal));
});
watch(total_revenue, (newVal) => {
    localStorage.setItem("total_revenue", JSON.stringify(newVal));
});

// Función para registrar ventas
const postSales = async () => {
    try {
        sale.value = platformSale.value + cashSale.value

        sales.value.sale = sale.value;
        sales.value.original_price = original_price.value;
        sales.value.revenue_price = revenue_price.value;
        total_cash.value = cashSale.value;
        total_platform.value = platformSale.value;

        const response = await axios.post('http://127.0.0.1:8000/insertdelivery', sales.value);
        msg.value = response.data.msg;

        // Obtener valores previos del localStorage y sumarlos
        const previousSales = JSON.parse(localStorage.getItem("total_sales")) || 0;
        const previousRevenue = JSON.parse(localStorage.getItem("total_revenue")) || 0;
        const previousCash = JSON.parse(localStorage.getItem("total_cash")) || 0;
        const previousPlatform = JSON.parse(localStorage.getItem("total_platform")) || 0;

        total_sales.value = previousSales + (sale.value || 0);
        total_revenue.value = previousRevenue + (revenue_price.value || 0);
        total_cash.value = previousCash + (cashSale.value || 0);
        total_platform.value = previousPlatform + (platformSale.value || 0);

        // Guardar en localStorage
        localStorage.setItem("total_sales", JSON.stringify(total_sales.value));
        localStorage.setItem("total_revenue", JSON.stringify(total_revenue.value));
        localStorage.setItem("total_cash", JSON.stringify(total_cash.value));
        localStorage.setItem("total_platform", JSON.stringify(total_platform.value));

        // Resetear valores
        cashSale.value = 0;
        platformSale.value = 0;
        sale.value = 0;
        original_price.value = 0;
        sales.value.product = "";

    } catch (error) {
        console.error('Error en ventas: ', error);
    }
}

onMounted(() => {
    const storedSales = localStorage.getItem("total_sales");
    const storedRevenue = localStorage.getItem("total_revenue");
    if (storedSales) total_sales.value = JSON.parse(storedSales);
    if (storedRevenue) total_revenue.value = JSON.parse(storedRevenue);
});

</script>



<template>
    <section class="out-container">
        <form @submit.prevent="postSales">
            <div class="input-container">
                <span>Producto: </span>
                <input type="text" placeholder="Ej: Airpods Pro" required v-model="sales.product"/>
            </div>
            <div class="input-container">
                <span>Venta efectivo:</span>
                <input type="number" placeholder="100000" required v-model="cashSale"/>
            </div>
            <div class="input-container">
                <span>Venta plataforma:</span>
                <input type="number" placeholder="100000" required v-model="platformSale"/>
            </div>
            <div class="input-container">
                <span>Codigo:</span>
                <input type="number" placeholder="30000" required v-model="original_price"/>
            </div>
            <div class="info-container">
                <span>Ganancia:</span>
                <span>{{revenue_price}}</span>
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
    width: 100%;
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