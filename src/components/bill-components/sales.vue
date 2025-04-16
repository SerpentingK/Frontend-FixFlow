<script setup>
import axios from 'axios';
import { ref, computed, inject, watch, onMounted } from 'vue';

// Variables
const sale = ref(0);
const cashSale = ref(0);
const platformSale = ref(0);
const original_price = ref(0);
const revenue_price = computed(() => (cashSale.value + platformSale.value) - original_price.value);
const showVerification = ref(false);

// Inyecta las variables globales
const startShift = inject("startShift");
const total_sales = inject("total_sales");
const total_revenue = inject("total_revenue");
const totalInvestment = inject("totalInvestment");
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

// Función para formatear moneda
const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
    }).format(value || 0);
};

// Función para formatear input numérico
const formatNumberInput = (value) => {
    const numericValue = value.toString().replace(/\D/g, '');
    return numericValue ? parseInt(numericValue, 10) : 0;
};

// Observadores para guardar en localStorage
watch(total_sales, (newVal) => {
    localStorage.setItem("total_sales", JSON.stringify(newVal));
});
watch(total_revenue, (newVal) => {
    localStorage.setItem("total_revenue", JSON.stringify(newVal));
});
watch(totalInvestment, (newVal) => {
    localStorage.setItem("totalInvestment", JSON.stringify(newVal));
});

// Función para registrar ventas
const postSales = async () => {
    try {
        sale.value = platformSale.value + cashSale.value

        sales.value.sale = sale.value;
        sales.value.original_price = original_price.value;
        sales.value.revenue_price = revenue_price.value;

        const response = await axios.post(`${import.meta.env.VITE_API_URL}/insertdelivery`, sales.value);
        msg.value = response.data.msg;

        // Obtener valores previos del localStorage y sumarlos
        const previousSales = JSON.parse(localStorage.getItem("total_sales")) || 0;
        const previousRevenue = JSON.parse(localStorage.getItem("total_revenue")) || 0;
        const previousCash = JSON.parse(localStorage.getItem("total_cash")) || 0;
        const previousPlatform = JSON.parse(localStorage.getItem("total_platform")) || 0;
        const previousInvestment = JSON.parse(localStorage.getItem("totalInvestment")) || 0

        total_sales.value = previousSales + (sale.value || 0);
        total_revenue.value = previousRevenue + (revenue_price.value || 0);
        total_cash.value = previousCash + (cashSale.value || 0);
        total_platform.value = previousPlatform + (platformSale.value || 0);
        totalInvestment.value = previousInvestment + (original_price.value || 0)

        // Guardar en localStorage
        localStorage.setItem("total_sales", JSON.stringify(total_sales.value));
        localStorage.setItem("total_revenue", JSON.stringify(total_revenue.value));
        localStorage.setItem("total_cash", JSON.stringify(total_cash.value));
        localStorage.setItem("total_platform", JSON.stringify(total_platform.value));
        localStorage.setItem("totalInvestment", JSON.stringify(totalInvestment.value))

        // Resetear valores
        cashSale.value = 0;
        platformSale.value = 0;
        sale.value = 0;
        original_price.value = 0;
        sales.value.product = "";
        showVerification.value = false;

    } catch (error) {
        console.error('Error en ventas: ', error);
    }
}

const verifySale = () => {
    showVerification.value = true;
}

onMounted(() => {
    const storedSales = localStorage.getItem("total_sales");
    const storedRevenue = localStorage.getItem("total_revenue");
    const storedInvestment = localStorage.getItem("totalInvestment");
    if (storedSales) total_sales.value = JSON.parse(storedSales);
    if (storedRevenue) total_revenue.value = JSON.parse(storedRevenue);
    if (storedInvestment) totalInvestment.value = JSON.parse(storedInvestment);
});

</script>

<template>
    <section class="sales-container">
        <form @submit.prevent="verifySale">
            <div class="info-cont">
                <span>Producto: </span>
                <input type="text" placeholder="Ej: Airpods Pro" required v-model="sales.product" class="input-field"/>
            </div>
            <div class="info-cont">
                <span>Venta efectivo:</span>
                <input 
                    type="text" 
                    :value="formatCurrency(cashSale)"
                    @input="(e) => cashSale = formatNumberInput(e.target.value)"
                    placeholder="100000" 
                    required 
                    class="input-field"
                />
            </div>
            <div class="info-cont">
                <span>Venta plataforma:</span>
                <input 
                    type="text" 
                    :value="formatCurrency(platformSale)"
                    @input="(e) => platformSale = formatNumberInput(e.target.value)"
                    placeholder="100000" 
                    required 
                    class="input-field"
                />
            </div>
            <div class="info-cont">
                <span>Codigo:</span>
                <input 
                    type="text" 
                    :value="formatCurrency(original_price)"
                    @input="(e) => original_price = formatNumberInput(e.target.value)"
                    placeholder="30000" 
                    required 
                    class="input-field"
                />
            </div>
            <div class="info-cont">
                <span>Ganancia:</span>
                <span class="value-display">{{formatCurrency(revenue_price)}}</span>
            </div>
            <div class="btns">
                <button type="button" @click="$emit('close')">Cancelar</button>
                <button type="submit" class="confirm-btn">Verificar Venta</button>
            </div>
        </form>

        <!-- Ventana de verificación -->
        <div v-if="showVerification" class="verification-modal">
            <div class="verification-content">
                <h4>Verificar Venta</h4>
                <div class="info-cont">
                    <span>Producto:</span>
                    <span class="value-display">{{sales.product}}</span>
                </div>
                <div class="info-cont">
                    <span>Venta Efectivo:</span>
                    <span class="value-display">{{formatCurrency(cashSale)}}</span>
                </div>
                <div class="info-cont">
                    <span>Venta Plataforma:</span>
                    <span class="value-display">{{formatCurrency(platformSale)}}</span>
                </div>
                <div class="info-cont">
                    <span>Código:</span>
                    <span class="value-display">{{formatCurrency(original_price)}}</span>
                </div>
                <div class="info-cont">
                    <span>Ganancia:</span>
                    <span class="value-display">{{formatCurrency(revenue_price)}}</span>
                </div>
                <div class="btns">
                    <button @click="showVerification = false">Cancelar</button>
                    <button @click="postSales" class="confirm-btn">Confirmar Venta</button>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.sales-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

h3 {
    color: white;
    text-transform: uppercase;
    font-size: 1.6rem;
    text-align: center;
    letter-spacing: 2px;
    margin-bottom: 10px;
}

h4 {
    color: var(--base);
    letter-spacing: 2px;
    text-transform: uppercase;
    font-size: 1.3rem;
    margin: 10px 0;
    width: 100%;
    text-align: center;
}

.info-cont {
    width: 95%;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.input-field {
    background: white;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    width: 50%;
    color: #333;
}

.value-display {
    font-weight: bold;
    color: var(--base);
}

.btns {
    display: flex;
    gap: 20px;
    margin: 15px 0 10px;
    width: 100%;
}

.btns button {
    flex: 1;
    border: 2px solid var(--base);
    background-color: transparent;
    padding: 10px;
    color: white;
    text-transform: uppercase;
    font-weight: bold;
    letter-spacing: 1.5px;
    border-radius: 5px;
    transition: all 0.3s;
    cursor: pointer;
}

.btns button:hover {
    transform: translateY(-2px);
}

.btns button:active {
    transform: translateY(0);
    scale: 0.98;
}

button.confirm-btn {
    background-color: var(--base);
}

.verification-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.verification-content {
    background: var(--second);
    padding: 20px;
    border-radius: 10px;
    border: 4px solid var(--base);
    width: 80%;
    max-width: 500px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

@media (min-width: 768px) {
    .info-cont {
        font-size: 1.1rem;
    }

    h3 {
        font-size: 1.5rem;
    }

    .input-field {
        padding: 8px 12px;
    }
}

@media (min-width: 1024px) {
    .btns button {
        padding: 12px;
    }
}
</style>