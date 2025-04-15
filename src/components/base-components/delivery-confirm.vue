<script setup>
import axios from 'axios';
import { inject, ref, computed, watch, onMounted } from 'vue';
const phonesDelivered = inject('phonesDelivered');

const deliveryBrand = inject("deliveryBrand")
const deliveryRef = inject("deliveryRef");
const deliveryDevice = inject("deliveryDevice")
const infoBill = inject("infoBill")
const infoData = inject("infoData");

watch(phonesDelivered, (newVal) => {
    localStorage.setItem("phonesDelivered", JSON.stringify(newVal))
})

watch(deliveryRef, async (newVal) => {
  console.log("deliveryRef actualizado:", newVal);
});

watch(deliveryBrand, async (newVal) => {
  console.log("deliveryBrand actualizado:", newVal);
});

watch(deliveryDevice, async (newVal) => {
  console.log("repairBrand actualizado:", newVal);
});

const switchSDC = inject("switchSDC");

// Referencias para los valores de los inputs
const codeValue = ref(0);
const due = ref(0)
const startShift = inject("startShift");
const total_sales = inject("total_sales");
const total_cash = inject("total_cash", ref(0))       
const total_platform = inject("total_platform", ref(0))
const cashSale = ref(0);
const platformSale = ref(0);
const total_revenue = inject("total_revenue")
const totalInvestment = inject("totalInvestment");

// Computed para verificar si los campos están completos (permite 0 en saleValue)
const isFormComplete = computed(() => (platformSale.value || platformSale.value === 0) 
&& (codeValue.value || codeValue.value === 0) && (cashSale.value || cashSale.value === 0) );

// Actualiza el contador de entregados
const updateDelivered = () => {
    if (isFormComplete.value) { // Ejecutar solo si el formulario está completo
        phonesDelivered.value++;
        localStorage.setItem("phonesDelivered", JSON.stringify(phonesDelivered.value))
    }
};

const bill_number = ref(null)
const client_name  = ref(null)
const payment = ref(null)

const getBillRepair = async () =>{
    try{
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/billRepairPhone/${deliveryRef.value}`)
        due.value = response.data[0].due
        client_name.value = response.data[0].client_name
        payment.value = response.data[0].payment
        bill_number.value = response.data[0].bill_number
    }catch(error){
        console.error(error)
    }
}


// Computed para el precio de ganancia
const revenue_price = computed(() => {
    return (payment.value || 0) + (cashSale.value || 0) + (platformSale.value || 0) - (codeValue.value || 0);
});

const sale_total = computed(() => {
    return (cashSale.value || 0) + (platformSale.value || 0);
});

const sales = ref({
        ref_shift : String(startShift.value),
        product:`${deliveryBrand.value} ${deliveryDevice.value}`,
        sale: sale_total,
        original_price: codeValue,
        revenue_price: revenue_price,
    });

// Watchers para actualizar los valores de ventas y ganancias
watch(total_sales, (newVal) => {
    localStorage.setItem("total_sales", JSON.stringify(newVal))
})
watch(total_revenue, (newVal) => {
    localStorage.setItem("total_revenue", JSON.stringify(newVal));
});

const deliveryPhone = async () => {
    try {
        const ansawer = await axios.put(`${import.meta.env.VITE_API_URL}/deliveredPhone/${deliveryRef.value}/${bill_number.value}`, sales.value);
        updateDelivered();  

        // Obtener valores previos del localStorage y sumarlos
        const previousSales = JSON.parse(localStorage.getItem("total_sales")) || 0;
        const previousRevenue = JSON.parse(localStorage.getItem("total_revenue")) || 0;
        const previousCash = JSON.parse(localStorage.getItem("total_cash")) || 0;
        const previousPlatform = JSON.parse(localStorage.getItem("total_platform")) || 0;
        const previousInvestment = JSON.parse(localStorage.getItem("totalInvestment")) || 0

        total_sales.value = previousSales + (sale_total.value || 0);
        total_revenue.value = previousRevenue + (revenue_price.value || 0);
        total_cash.value = previousCash + (cashSale.value || 0);
        total_platform.value = previousPlatform + (platformSale.value || 0);
        totalInvestment.value = previousInvestment + (codeValue.value || 0)

        // Guardar los valores actualizados en localStorage
        localStorage.setItem("total_sales", JSON.stringify(total_sales.value));
        localStorage.setItem("total_revenue", JSON.stringify(total_revenue.value));
        localStorage.setItem("total_cash", JSON.stringify(total_cash.value));
        localStorage.setItem("total_platform", JSON.stringify(total_platform.value));
        localStorage.setItem("totalInvestment", JSON.stringify(totalInvestment.value))
        // Resetear valores
        cashSale.value = 0;
        platformSale.value = 0;
        sale_total.value = 0;
        codeValue.value = 0;
        sales.value = {
            ref_shift: "",
            product: "",
            sale: 0,
            original_price: 0,
            revenue_price: 0
        };

        // Actualizar el estado del teléfono en infoBill
        const phone = infoBill.value.phones.find(p => p.phone_ref === deliveryRef.value);
        if (phone) {
            phone.delivered = true;
        }

        await infoData();

        switchSDC();
    } catch (error) {
        console.error("Error al entregar el teléfono:", error);
    }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value || 0);
};

const formatNumberInput = (value) => {
  // Eliminar todos los caracteres no numéricos
  const numericValue = value.toString().replace(/\D/g, '');
  // Convertir a número
  return numericValue ? parseInt(numericValue, 10) : 0;
};

onMounted(() => {
    getBillRepair()
    console.log("Estructura de deliveryRef:", deliveryRef.value);
})


onMounted(() => {
    const storedSales = localStorage.getItem("total_sales");
    const storedRevenue = localStorage.getItem("total_revenue");
    const storedDelivered = localStorage.getItem("phonesDelivered")
    const storedInvestment = localStorage.getItem("totalInvestment");
    if (storedInvestment) totalInvestment.value = JSON.parse(storedInvestment);
    if (storedSales) total_sales.value = JSON.parse(storedSales);
    if (storedRevenue) total_revenue.value = JSON.parse(storedRevenue);
    if (storedDelivered) phonesDelivered.value = JSON.parse(storedDelivered)  
});
</script>

<template>
    <section class="conf-container">
        <h3>¿Confirmar entrega?</h3>
        
        <form @submit.prevent="deliveryPhone">
            <div class="info-container">    
                <span>Referencia: </span>
                <span>{{ deliveryRef.split('-').slice(1).join('-') }}</span>
            </div>
            <div class="info-container">
                <span>Producto: </span>
                <span>{{ deliveryBrand }} {{ deliveryDevice }}</span>
            </div>
            <div class="info-container">
                <span>Nombre Cliente: </span>
                <span>{{ client_name }}</span>
            </div>
            <div class="info-container">
                <span>Abono: </span>
                <span>{{ formatCurrency(payment) }}</span>
            </div>
            <div class="info-container">
                <span>Deuda:</span>
                <span>{{ formatCurrency(due) }}</span>
            </div>
            <div class="input-container">
                <span>Pago efectivo:</span>
                <input 
                    type="text" 
                    :value="formatCurrency(cashSale)"
                    @input="(e) => cashSale = formatNumberInput(e.target.value)"
                    placeholder="0"
                />
            </div>
            <div class="input-container">
                <span>Pago plataforma:</span>
                <input 
                    type="text" 
                    :value="formatCurrency(platformSale)"
                    @input="(e) => platformSale = formatNumberInput(e.target.value)"
                    placeholder="0"
                />
            </div>
            <div class="input-container">
                <span>Codigo:</span>
                <input 
                    type="text" 
                    :value="formatCurrency(codeValue)"
                    @input="(e) => codeValue = formatNumberInput(e.target.value)"
                    placeholder="0" 
                    required 
                />
            </div>
            <div class="info-container">
                <span>Ganancia:</span>
                <span>{{ formatCurrency(revenue_price) }}</span>
            </div>

            <div style="width: 100%; display: flex; justify-content: space-around; padding: 10px 0;" class="btns">
                <button @click="switchSDC">Cancelar</button>
                <button 
                    type="submit" 
                    :disabled="!isFormComplete"
                    class="confirm-btn"
                >
                    Confirmar
                </button>
            </div>
        </form>
    </section>
</template>

<style scoped>
.conf-container {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 5px 20px;
    width: 80%;
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
    transition: all .4s ease;
    z-index: 11;
}

h3 {
    color: white;
    text-transform: uppercase;
    font-size: 1.3rem;
    text-align: center;
    letter-spacing: 2px;
}

.btns button {
    border: 2px solid var(--base);
    background-color: transparent;
    padding: 5px 10px;
    color: white;
    text-transform: uppercase;
    font-weight: bolder;
    letter-spacing: 1.5px;
    border-radius: 5px;
    transition: .3s;
}

.btns button:active {
    scale: .9;
}

button.confirm-btn {
    background-color: var(--base);
}
.conf-container form{
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
    text-align: right;
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
    color: var(--secondTwo);
}

@media (min-width: 1024px) {
    .conf-container {
        width: 40%;
    }

    button:hover {
        scale: 1.1;
    }
}
</style>