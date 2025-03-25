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
const saleValue = ref(null);
const codeValue = ref(null);
const due = ref(null)
const startShift = inject("startShift");
const total_sales = inject("total_sales")       
const total_revenue = inject("total_revenue")

// Computed para verificar si los campos están completos (permite 0 en saleValue)
const isFormComplete = computed(() => (saleValue.value || saleValue.value === 0) && (codeValue.value || codeValue.value === 0));

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
        const response = await axios.get(`http://127.0.0.1:8000/billRepairPhone/${deliveryRef.value}`)
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
    return (payment.value || 0) + (saleValue.value || 0) - (codeValue.value || 0);
});

const sales = ref({
        ref_shift : startShift.value,
        product:`${deliveryBrand.value} ${deliveryDevice.value}`,
        sale: saleValue,
        original_price: codeValue,
        revenue_price: revenue_price
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
        const ansawer = await axios.put(`http://127.0.0.1:8000/deliveredPhone/${deliveryRef.value}/${bill_number.value}`, sales.value);
        updateDelivered();
        // Emitir evento de entrega confirmada

        // Obtener valores previos del localStorage y sumarlos
        const previousSales = JSON.parse(localStorage.getItem("total_sales")) || 0;
        const previousRevenue = JSON.parse(localStorage.getItem("total_revenue")) || 0;

        total_sales.value = previousSales + (saleValue.value || 0);
        total_revenue.value = previousRevenue + (revenue_price.value || 0);

        // Guardar los valores actualizados en localStorage
        localStorage.setItem("total_sales", JSON.stringify(total_sales.value));
        localStorage.setItem("total_revenue", JSON.stringify(total_revenue.value));

        // Resetear valores
        sales.value = {
            ref_shift: "",
            product: "",
            sale: 0,
            original_price: 0,
            revenue_price: 0
        };

        saleValue.value = 0;
        codeValue.value = 0;

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

const cancelAction = () => {
    switchSDC(); // Devuelve false si se cancela
};

onMounted(() => {
    getBillRepair()
})


onMounted(() => {
    const storedSales = localStorage.getItem("total_sales");
    const storedRevenue = localStorage.getItem("total_revenue");
    const storedDelivered = localStorage.getItem("phonesDelivered")
    if (storedSales) total_sales.value = JSON.parse(storedSales);
    if (storedRevenue) total_revenue.value = JSON.parse(storedRevenue);
    if (storedDelivered) phonesDelivered.value = JSON.parse(storedDelivered)  
});
</script>

<template>
    <section class="container">
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
                <span>Abono:     </span>
                <span>{{ payment }}</span>
            </div>
            <div class="input-container">
                <span>Deuda:</span>
                <input type="number" v-model="saleValue" :placeholder="due" required />
            </div>
            <div class="input-container">
                <span>Codigo:</span>
                <input type="number" v-model="codeValue" placeholder="0" required />
            </div>
            <div class="info-container">
                <span>Ganancia:</span>
                <span>{{ revenue_price }}</span>
            </div>

            <div style="width: 100%; display: flex; justify-content: space-around; padding: 10px 0;" class="btns">
                <button @click="cancelAction">Cancelar</button>
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
    overflow-y: scroll;
    scrollbar-width: none;
    transition: all .4s ease;
    z-index: 10;
}

h3 {
    color: white;
    text-transform: uppercase;
    font-size: 1.3rem;
    text-align: center;
    letter-spacing: 2px;
}

.btns button {
    border: 2px solid var(--baseOrange);
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
    background-color: var(--baseOrange);
}
.container form{
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

@media (min-width: 1024px) {
    .container {
        width: 25%;
    }

    button:hover {
        scale: 1.1;
    }
}
</style>