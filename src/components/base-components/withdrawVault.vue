<script setup>
import axios from 'axios';
import { computed, inject, ref } from 'vue';

// Variables
const quantity = ref(0);
const loggedCompany = inject("loggedCompany")
const startShift = inject("startShift");
const vault = computed(() => ({
    ref_shift: startShift.value,
    quantity: quantity.value
}));

const switchWV = inject("switchWV")
const getcompanyvault = inject("getcompanyvault")

// Función para registrar el retiro
const postWithdrawal = async () => {
    try {
        const response = await axios.put(`http://127.0.0.1:8000/OutFlowVault/${loggedCompany.value}`, vault.value);
        getcompanyvault();
        switchWV();
    } catch (error) {
        console.error('Error en el retiro: ', error);
    }
};
</script>

<template>
    <section class="withdraw-container">
        <ion-icon name="close-circle-outline" class="close-btn" @click="switchWV"></ion-icon>
        <h2>Registrar Retiro</h2>
        <form @submit.prevent="postWithdrawal">
            <label class="input-container" to="amount">
                <span class="info-label">Cantidad a retirar:</span>
                <input type="number" placeholder="Ingrese monto" required v-model="quantity" id="amount"/>
            </label>
            <button class="state-btn">Confirmar</button>
        </form>
    </section>
</template>

<style scoped>
.withdraw-container {
    z-index: 10;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--baseGray);
    width: 90%;
    border-radius: 10px;
    border: 4px solid var(--baseOrange);
    box-shadow: var(--baseShadow);
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.withdraw-container h2 {
    color: white;
    letter-spacing: 3px;
    text-shadow: 0 0 10px black;
}
 .withdraw-container form{
    gap: 10px;
    display: flex;
    width: 100%;
 }

.input-container {
    width: 100%;
    background-color: white;
    padding: 5px 10px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.input-container input {
    all: unset;
    width: 60%;
}

.state-btn {
    all: unset;
    background-color: var(--baseGray);
    padding: 10px;
    border: 2px solid var(--baseOrange);
    border-radius: 10px;
    color: white;
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: .3s;
}

.state-btn.active {
    background-color: var(--baseOrange);
    color: white;
    box-shadow: var(--secShadow);
}
.state-btn:hover{
    scale: 1.05;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: var(--baseOrange);
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

.close-btn *{
    position: absolute;
}

@media (min-width: 768px) {
    .withdraw-container {
        font-size: 1.3rem;
    }
}
@media (min-width: 1024px) {
    .withdraw-container {
        font-size: 1rem;
        width: 40%;
    }
}
</style>
