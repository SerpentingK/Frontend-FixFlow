<script setup>
import axios from 'axios';
import { inject, ref, computed } from 'vue';

// Variables
const step = ref(1);
const email = ref('');
const code = ref(0);
const newPassword = ref('');
const confirmPassword = ref('');
const msg = ref('');
const isLoading = ref(false); // Variable para manejar el estado de carga

// Añadir nuevas propiedades para la validación de contraseña
const passwordStrength = computed(() => {
    const password = newPassword.value;
    if (!password) return 0;

    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    return strength;
});

const getPasswordStrengthColor = computed(() => {
    const strength = passwordStrength.value;
    switch (strength) {
        case 0: return 'var(--errorColor)';
        case 1: return 'var(--errorColor)';
        case 2: return 'var(--warningColor)';
        case 3: return 'var(--base)';
        case 4: return 'var(--successColor)';
        default: return 'var(--errorColor)';
    }
});

const getPasswordStrengthText = computed(() => {
    const strength = passwordStrength.value;
    switch (strength) {
        case 0: return 'Muy débil';
        case 1: return 'Débil';
        case 2: return 'Media';
        case 3: return 'Fuerte';
        case 4: return 'Muy fuerte';
        default: return 'Muy débil';
    }
});

const isPasswordValid = computed(() => {
    const password = newPassword.value;
    return password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password);
});

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
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/passwordRecovery`, {
                Email: email.value
            });

            if (response.data.status === "Se ha enviado un correo con el pin de recuperación") {
                msg.value = "Correo enviado con éxito.";
                nextStep();
            } else {
                msg.value = "Error al enviar el correo.";
            }
        } else if (step.value === 2) {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/verify-pin`, {
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
            if (!isPasswordValid.value) {
                msg.value = "La contraseña debe tener al menos 6 caracteres, una mayúscula y un número.";
                return;
            }
            if (newPassword.value !== confirmPassword.value) {
                msg.value = "Las contraseñas no coinciden.";
                return;
            }
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/confirmPassword`, {
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
            <div v-if="step === 1" class="form-step">
                <label class="input-container">
                    <span class="info-label">Correo de recuperación:</span>
                    <input type="email" placeholder="Ingrese su correo" required v-model="email" />
                </label>
            </div>

            <div v-if="step === 2" class="form-step">
                <label class="input-container">
                    <span class="info-label">Código de verificación:</span>
                    <input type="text" placeholder="0" required v-model="code" />
                </label>
            </div>

            <div v-if="step === 3" class="form-step">
                <label class="input-container">
                    <span class="info-label">Nueva contraseña:</span>
                    <input type="password" placeholder="Ingrese nueva contraseña" required v-model="newPassword" />
                </label>
                <div class="password-strength">
                    <div class="strength-dots">
                        <div class="dot" :class="{ active: passwordStrength >= 1 }"
                            :style="{ backgroundColor: passwordStrength >= 1 ? getPasswordStrengthColor : 'var(--secondTwo)' }">
                        </div>
                        <div class="dot" :class="{ active: passwordStrength >= 2 }"
                            :style="{ backgroundColor: passwordStrength >= 2 ? getPasswordStrengthColor : 'var(--secondTwo)' }">
                        </div>
                        <div class="dot" :class="{ active: passwordStrength >= 3 }"
                            :style="{ backgroundColor: passwordStrength >= 3 ? getPasswordStrengthColor : 'var(--secondTwo)' }">
                        </div>
                        <div class="dot" :class="{ active: passwordStrength >= 4 }"
                            :style="{ backgroundColor: passwordStrength >= 4 ? getPasswordStrengthColor : 'var(--secondTwo)' }">
                        </div>
                    </div>
                    <span class="strength-text">{{ getPasswordStrengthText }}</span>
                </div>
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
    max-width: 500px;
    border-radius: 1rem;
    border: 4px solid var(--base);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    padding: 2rem;
    background: var(--second);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: translate(-50%, -60%);
    }

    to {
        opacity: 1;
        transform: translate(-50%, -50%);
    }
}

.withdraw-container h2 {
    color: white;
    font-size: 1.5rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-align: center;
    margin: 0;
    font-weight: 600;
}

.withdraw-container form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
}

.form-step {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.input-container {
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem 1.25rem;
    border-radius: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    transition: all 0.3s ease;
}

.input-container:focus-within {
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 2px var(--base);
}

.info-label {
    color: white;
    font-size: 0.9rem;
    font-weight: 500;
}

.input-container input {
    all: unset;
    color: white;
    font-size: 1rem;
    width: 100%;
}

.input-container input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.state-btn {
    all: unset;
    background-color: var(--base);
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    color: white;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    text-align: center;
    font-weight: 600;
}

.state-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.state-btn:active {
    transform: scale(0.98);
}

.state-btn:disabled {
    background-color: rgba(128, 128, 128, 0.5);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.back-btn {
    background-color: var(--secondTwo);
}

.close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.close-btn:hover {
    transform: scale(1.1);
    color: var(--base);
}

.error-message {
    color: var(--errorColor);
    font-size: 0.9rem;
    text-align: center;
    margin: 0;
}

.password-strength {
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.strength-dots {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
}

.dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: var(--secondTwo);
    transition: all 0.3s ease;
}

.dot.active {
    transform: scale(1.2);
}

.strength-text {
    font-size: 0.75rem;
    color: white;
    text-align: center;
    font-weight: 500;
    letter-spacing: 0.5px;
}

@media (min-width: 768px) {
    .withdraw-container {
        width: 80%;
        max-width: 600px;
    }

    .withdraw-container h2 {
        font-size: 1.75rem;
    }

    .input-container input {
        font-size: 1.1rem;
    }
}

@media (min-width: 1024px) {
    .withdraw-container {
        width: 40%;
        max-width: 450px;
    }
}
</style>
