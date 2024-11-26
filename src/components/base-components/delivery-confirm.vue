<script setup>
import axios from 'axios';
import { inject, ref, computed, watch } from 'vue';
const phonesDelivered = inject('phonesDelivered');

const deliveryBrand = inject("deliveryBrand")
const deliveryRef = inject("deliveryRef");
const deliveryDevice = inject("deliveryDevice")
const getPhonesD = inject('getPhonesD')

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
const saleValue = ref(0);
const codeValue = ref(0);

const revenue_price = computed(() => saleValue.value - codeValue.value);
const startShift = inject("startShift");
const total_sales = inject("total_sales")
const total_revenue = inject("total_revenue")

// Computed para verificar si los campos están completos
const isFormComplete = computed(() => saleValue.value && codeValue.value);

const updateDelivered = () => {
    if (isFormComplete.value) { // Ejecutar solo si el formulario está completo
        phonesDelivered.value++;
    }
};

const sales = ref({
        ref_shift : startShift.value,
        product:`${deliveryBrand.value} ${deliveryDevice.value}`,
        sale: saleValue,
        original_price: codeValue,
        revenue_price: revenue_price
    });

    const deliveryPhone = async () => {
    try {
        const ansawer = await axios.put(`http://127.0.0.1:8000/deliveredPhone/${deliveryRef.value}`, sales.value);

        total_revenue.value += revenue_price.value
        total_sales.value += saleValue.value

        sales.value = {
            ref_shift: "",
            product: "",
            sale: 0,
            original_price: 0,
            revenue_price: 0
        };

        saleValue.value = 0;
        codeValue.value = 0;


        updateDelivered();


        await getPhonesD();

        switchSDC();
    } catch (error) {
        console.error("Error al entregar el teléfono:", error);
    }
}
</script>

<template>
    <section class="container">
        <h3>¿Confirmar entrega?</h3>
        
        <form @submit.prevent="deliveryPhone">
            <div class="info-container">
                <span>Referencia: </span>
                <span>{{ deliveryRef }}</span>
            </div>
            <div class="info-container">
                <span>Producto: </span>
                <span>{{ deliveryBrand }} {{ deliveryDevice }}</span>
            </div>
            <div class="input-container">
                <span>Venta:</span>
                <input type="number" v-model="saleValue" placeholder="100000" required />
            </div>
            <div class="input-container">
                <span>Codigo:</span>
                <input type="number" v-model="codeValue" placeholder="30000" required />
            </div>
            <div class="info-container">
                <span>Ganancia:</span>
                <span>{{ revenue_price }}</span>
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
    z-index: 2;
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