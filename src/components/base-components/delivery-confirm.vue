<script setup>
import { inject, ref, computed } from 'vue';
const phonesDelivered = inject('phonesDelivered');

defineProps({
    ref_num: {
        type: String,
        required: true,
        default: "0001-A"
    },
    phone: {
        type: String,
        required: true,
        default: "Samsung A14"
    }
});

const switchSDC = inject("switchSDC");

// Referencias para los valores de los inputs
const saleValue = ref('');
const codeValue = ref('');

// Computed para verificar si los campos están completos
const isFormComplete = computed(() => saleValue.value && codeValue.value);

const updateDelivered = () => {
    if (isFormComplete.value) { // Ejecutar solo si el formulario está completo
        phonesDelivered.value++;
        switchSDC();
    }
};
</script>

<template>
    <section class="container">
        <h3>¿Confirmar entrega?</h3>
        
        <form @submit.prevent="">
            <div class="info-container">
                <span>Referencia: </span>
                <span>{{ ref_num }}</span>
            </div>
            <div class="info-container">
                <span>Producto: </span>
                <span>{{ phone }}</span>
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
                <span>70000</span>
            </div>

            <div style="width: 100%; display: flex; justify-content: space-around; padding: 10px 0;" class="btns">
                <button @click="switchSDC">Cancelar</button>
                <button 
                    type="submit" 
                    :disabled="!isFormComplete"
                    @click="updateDelivered"
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