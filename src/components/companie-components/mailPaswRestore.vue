<script setup>
import axios from 'axios';
import { inject, ref } from 'vue';

// Variables
const step = ref(1);
const email = ref('');
const code = ref(0);
const newPassword = ref('');
const confirmPassword = ref('');
const msg = ref('');
const isLoading = ref(false); // Variable para manejar el estado de carga

const switchSMPR = inject('switchSMPR');

// Función para avanzar al siguiente paso
const nextStep = () => {
    if (step.value < 3) step.value++;
};

// Función para retroceder al paso anterior
const prevStep = () => {
    if (step.value > 1) step.value--;
};

// Función para manejar cada etapa de la recuperación
const handleRecovery = async () => {
    if (isLoading.value) return; // Evitar múltiples envíos
    isLoading.value = true;
    msg.value = "";
    try {
        if (step.value === 1) {
            const response = await axios.post(`/api/passwordRecovery`, {
                Email: email.value
            });
            
            if (response.data.status === "Se ha enviado un correo con el pin de recuperación") {
                msg.value = "Correo enviado con éxito.";
                nextStep();
            } else {
                msg.value = "Error al enviar el correo.";
            }
        } else if (step.value === 2) {
            const response = await axios.post(`/api/verify-pin`, {
                Email: email.value,
                code: code.value
            });
            if (response.data.status === "el pin de recuperacion es correcto") {
                msg.value = "Código verificado correctamente.";
                nextStep();
            } else {
                msg.value = "Código incorrecto o inválido.";
            }
        } else if (step.value === 3) {
            if (newPassword.value !== confirmPassword.value) {
                msg.value = "Las contraseñas no coinciden.";
                return;
            }
            const response = await axios.put(`/api/confirmPassword`, {
                Email: email.value,
                password: newPassword.value
            });
            if (response.data.status === "La compañia a cambiado de contraseña correctamente") {
                msg.value = "Contraseña actualizada con éxito.";
                switchSMPR();
            } else {
                msg.value = "Error al actualizar la contraseña.";
            }
        }
    } catch (error) {
        console.error('Error detallado:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        msg.value = error.response?.data?.detail || "Ocurrió un error. Intente nuevamente.";
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <section class="withdraw-container">
        <ion-icon name="close-circle-outline" class="close-btn" @click="switchSMPR"></ion-icon>
        <h2>Recuperar contraseña</h2>
        
        <form @submit.prevent="handleRecovery">
            <div v-if="step === 1">
                <label class="input-container">
                    <span class="info-label">Correo de recuperación:</span>
                    <input type="email" placeholder="Ingrese su correo" required v-model="email" />
                </label>
            </div>

            <div v-if="step === 2">
                <label class="input-container">
                    <span class="info-label">Código de verificación:</span>
                    <input type="text" placeholder="Ingrese el código" required v-model="code" />
                </label>
            </div>

            <div v-if="step === 3">
                <label class="input-container">
                    <span class="info-label">Nueva contraseña:</span>
                    <input type="password" placeholder="Ingrese nueva contraseña" required v-model="newPassword" />
                </label>
                <label class="input-container">
                    <span class="info-label">Confirmar contraseña:</span>
                    <input type="password" placeholder="Confirme su contraseña" required v-model="confirmPassword" />
                </label>
            </div>

            <p v-if="msg" class="error-message">{{ msg }}</p>
            
            <button class="state-btn" type="submit" :disabled="isLoading">
                {{ isLoading ? 'Enviando...' : (step === 3 ? 'Actualizar' : 'Confirmar') }}
            </button>
            <button v-if="step > 1" class="state-btn back-btn" @click="prevStep" :disabled="isLoading">Atrás</button>
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
