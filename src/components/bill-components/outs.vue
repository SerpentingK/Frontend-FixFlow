<script setup>
import axios from 'axios';
import { ref, inject, watch, onMounted } from 'vue';

const startShift = inject("startShift");
const msg = ref("");
const total_outs = inject("total_outs");
const showVerification = ref(false);

const outFlows = ref({
    ref_shift: startShift.value,
    details: "",
    price: 0
});

watch(total_outs, (newVal) => {
    localStorage.setItem("total_outs", JSON.stringify(newVal))
})

const postOutFlows = async () => {
    try {
        const ansawer = await axios.post('/api/insertOutflow', outFlows.value)
        msg.value = ansawer.data.msg;

        const previousOuts = JSON.parse(localStorage.getItem("total_outs")) || 0;

        total_outs.value = previousOuts + (outFlows.value.price || 0);

        localStorage.setItem("total_outs", JSON.stringify(total_outs.value))

        outFlows.value = {
            ref_shift: "",
            details: "",
            price: 0
        };
        showVerification.value = false;
    } catch (error) {
        console.error('Error en ventas: ', error);
    }
}

const verifyOutflow = () => {
    showVerification.value = true;
}

onMounted(() => {
    const storedOuts = localStorage.getItem("total_outs")
    if (storedOuts) total_outs.value = JSON.parse(storedOuts)
});
</script>

<template>
    <section class="sales-container">
        <form @submit.prevent="verifyOutflow">
            <div class="info-cont">
                <span>Razon: </span>
                <input type="text" placeholder="Ej: Almuerzo" v-model="outFlows.details" required class="input-field"/>
            </div>
            <div class="info-cont">
                <span>Salida:</span>
                <input type="number" v-model="outFlows.price" required class="input-field"/>
            </div>
            <div class="btns">
                <button type="button" @click="$emit('close')">Cancelar</button>
                <button type="submit" class="confirm-btn">Verificar Salida</button>
            </div>
        </form>

        <!-- Ventana de verificación -->
        <div v-if="showVerification" class="verification-modal">
            <div class="verification-content">
                <h4>Verificar Salida</h4>
                <div class="info-cont">
                    <span>Razón:</span>
                    <span class="value-display">{{outFlows.details}}</span>
                </div>
                <div class="info-cont">
                    <span>Monto:</span>
                    <span class="value-display">{{outFlows.price}}</span>
                </div>
                <div class="btns">
                    <button @click="showVerification = false">Cancelar</button>
                    <button @click="postOutFlows" class="confirm-btn">Confirmar Salida</button>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.sales-container {
    width: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
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
    .sales-container {
        width: 90%;
        max-width: 700px;
    }

    .info-cont {
        font-size: 1.1rem;
    }

    .input-field {
        padding: 8px 12px;
    }
}

@media (min-width: 1024px) {
    .sales-container {
        width: 80%;
        max-width: 800px;
        padding: 25px;
    }

    .btns button {
        padding: 12px;
    }
}
</style>