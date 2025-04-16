<script setup>
import axios from 'axios';
import { inject, ref } from 'vue';

const email = ref('');
const isLoading = ref(false); // Variable para manejar el estado de carga
const showAlert = inject('showAlert'); // Función para mostrar alertas

const switchSMTR = inject('switchSMTR');

// Función para manejar cada etapa de la recuperación
const handleToken = async () => {
    if (isLoading.value) return; // Evitar múltiples envíos
    isLoading.value = true;
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/resend-confirmation-code`, {
            Email: email.value,
        });
        
        if (response.data.status === "Se ha reenviado el código de confirmación a su correo") {
            showAlert("1","Correo enviado con éxito.");
            switchSMTR(); // Cerrar el modal después de enviar el correo
        } else {
            showAlert("2","Error al enviar el correo.");
        }
    } catch (error) {
        console.error("Error al enviar el correo:", error);
    } finally {
        isLoading.value = false; // Restablecer el estado de carga
    }
};
</script>

<template>
    <section class="withdraw-container">
        <ion-icon name="close-circle-outline" class="close-btn" @click="switchSMTR"></ion-icon>
        <h2>Confirmacion del correo</h2>
        
        <form @submit.prevent="handleToken">
            <div>
                <label class="input-container">
                    <span class="info-label">Correo para autenticar:</span>
                    <input type="email" placeholder="Ingrese su correo" required v-model="email" />
                </label>
            </div>
            <button class="state-btn" type="submit" :disabled="isLoading">
                <span v-if="isLoading">Enviando...</span>
                <span v-else>Enviar correo</span>
            </button>
        </form>
    </section>
</template>

    <style scoped>
    .state-btn:disabled {
    background-color: gray;
    cursor: not-allowed;
    }
    .withdraw-container {
        z-index: 10;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--second);
        width: 90%;
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
        flex-direction: column;
        align-items: center;
        width: 90%;
    }
    .withdraw-container form div{
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .withdraw-container button{
        width: 50%;
    }

    .input-container {
        width: 100%;
        background-color: white;
        padding: 5px 10px;
        border-radius: 5px;
        display: flex;
        flex-direction: row;
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
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
        transition: 0.3s;
        width: 100%;
        text-align: center;
    }

    .state-btn:hover {
        scale: 1.05;
    }

    .back-btn {
        background-color: var(--base);
        margin-top: 10px;
    }

    .close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: var(--base);
        padding: 5px;
        color: white;
        border-radius: 5px;
        font-size: 1.4rem;
        cursor: pointer;
    }

    .error-message {
        color: red;
        font-size: 0.9rem;
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
