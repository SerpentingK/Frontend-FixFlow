<script setup>
import axios from 'axios';
import { computed, inject, ref, onMounted } from 'vue';

// Variables
const quantity = ref(0);
const startShift = inject("startShift");
const showAlert = inject("showAlert")
const selectedPremiseId = inject("selectedPremiseId")
const loggedWorker = inject("loggedWorker")
const loadPremisesVault = inject("loadPremisesVault");
const loadAllWithdrawals = inject("loadAllWithdrawals")
const vault = computed(() => ({
    ref_shift: startShift.value,
    quantity: quantity.value,
    ref_premises: selectedPremiseId.value,
    wname: loggedWorker.value
}));

const switchWV = inject("switchWV")

// Función para registrar el retiro
const postWithdrawal = async () => {
    try {
        // Validar que la cantidad sea mayor que 0
        if (quantity.value <= 0) {
            showAlert("2", "La cantidad a retirar debe ser mayor que 0");
            return; // Detener la ejecución si la validación falla
        }
        
        const response = await axios.put(`${import.meta.env.VITE_API_URL}/OutFlowVault`, vault.value);
        
        // Actualizar la información de la caja antes de cerrar
        await loadPremisesVault(selectedPremiseId.value);
        
        // Actualizar la lista de retiros
        await loadAllWithdrawals();
        
        // Mostrar mensaje de éxito
        showAlert("1", "Retiro registrado correctamente");
        
        // Cerrar el modal
        switchWV();
    } catch (error) {
        if (error.response && error.response.data) {
            showAlert("2", `Error al registrar el retiro ${error.response.data.detail}`);
        } else {
            showAlert("2", "Error al registrar el retiro");
        }
    }
};

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

const overlayAlpha = ref(0);

onMounted(() => {
  setTimeout(() => {
    overlayAlpha.value = 0.5;
  }, 100); // Pequeño retraso antes de iniciar la animación
});
</script>

<template>
    <div class="overlay" :style="{ backgroundColor: `rgba(0, 0, 0, ${overlayAlpha})` }">
        <section class="withdraw-container">
            <ion-icon name="close-circle-outline" class="close-btn" @click="switchWV"></ion-icon>
            <h2>Registrar Retiro</h2>
            <form @submit.prevent="postWithdrawal">
                <label class="input-container" to="amount">
                    <span class="info-label">Cantidad a retirar:</span>
                    <input 
                    type="text" 
                    placeholder="Ingrese monto" 
                    required 
                    id="amount" 
                    :value="formatCurrency(quantity)"
                    @input="(e) => quantity = formatNumberInput(e.target.value)" />
                </label>
                <button class="state-btn" :disabled="quantity <= 0">Confirmar</button>
            </form>
        </section>
    </div>

</template>

<style scoped>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0);
    /* Empieza completamente transparente */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 11;
    transition: background-color .5s ease-in-out;
}

.withdraw-container {
    z-index: 10;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--second);
    width: 80%;
    border-radius: 10px;
    border: 4px solid var(--base);
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

.withdraw-container form {
    gap: 10px;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
}

.input-container {
    width: 90%;
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
    background-color: var(--second);
    padding: 10px;
    border: 2px solid var(--base);
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
    background-color: var(--base);
    color: white;
    box-shadow: var(--secShadow);
}

.state-btn:hover {
    scale: 1.05;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: var(--base);
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

.close-btn * {
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
