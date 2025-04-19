<script>
import { ref, inject, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { toInteger } from 'lodash';

export default {
    setup() {
        const showAlert = inject("showAlert");
        const router = useRouter();
        const premisesCount = inject("premisesCount", ref(0));
        const loggedCompany = inject("loggedCompany", ref(null));
        const loggedWorker = inject("loggedWorker", ref(null));
        const workerRole = inject("workerRole", ref(null));

        const local = ref({
            name: "",
            address: "",
            password: "",
            company: "",
            confirmPassword: ""
        });

        const passwordStrength = computed(() => {
            const password = local.value.password;
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
            switch(strength) {
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
            switch(strength) {
                case 0: return 'Muy débil';
                case 1: return 'Débil';
                case 2: return 'Media';
                case 3: return 'Fuerte';
                case 4: return 'Muy fuerte';
                default: return 'Muy débil';
            }
        });

        const isPasswordValid = computed(() => {
            const password = local.value.password;
            return password.length >= 6;
        });

        const registerLocal = async () => {
            if (!loggedWorker.value) {
                showAlert("2", "Tienes que iniciar sesión para registrar un local.");
                return;
            }
            if (workerRole.value !== "Gerente") {
                showAlert("2", "No tienes permisos para registrar locales.");
                return;
            }
            
            if (!isPasswordValid.value) {
                showAlert("2", "La contraseña debe tener al menos 6 caracteres.");
                return;
            }

            if (local.value.password !== local.value.confirmPassword) {
                showAlert("2", "Las contraseñas no coinciden.");
                return;
            }
            const answer = await axios.post(`${import.meta.env.VITE_API_URL}/newPremises/${loggedCompany.value}/${premisesCount.value}`, {
                name: local.value.name,
                address: local.value.address,
                password: local.value.password,
                company: loggedCompany.value
            });
            premisesCount.value += 1;
            console.log(premisesCount.value);
            router.push('/premises/select-premise');
        };

        onMounted(async () => {
            if (workerRole.value !== "Gerente") {
                showAlert("2", "No tienes permisos para registrar locales.\n Comuniquese con su Gerente");
                router.push('/workers/login-worker');
            }
        });

        return {
            local,
            registerLocal,
            passwordStrength,
            getPasswordStrengthColor,
            getPasswordStrengthText,
            isPasswordValid
        };
    }
}
</script>

<template>
    <section class="form-container">
        <h2>Registrar Local</h2>
        <span>Ingrese los datos para crear un nuevo local en el sistema</span>
        <form @submit.prevent="registerLocal()">
            <label class="input-container">
                <ion-icon name="business"></ion-icon>
                <input type="text" placeholder="Nombre del Local" required v-model="local.name">
            </label>
            <label class="input-container">
                <ion-icon name="location"></ion-icon>
                <input type="text" placeholder="Dirección" required v-model="local.address">
            </label>
            <label class="input-container">
                <ion-icon name="lock-closed"></ion-icon>
                <input type="password" placeholder="Contraseña" required v-model="local.password">
            </label>
            <label class="input-container">
                <ion-icon name="lock-closed-outline"></ion-icon>
                <input type="password" placeholder="Confirmar Contraseña" required v-model="local.confirmPassword">
            </label>
            <div class="password-strength">
                <div class="strength-dots">
                    <div class="dot" :class="{ active: passwordStrength >= 1 }" :style="{ backgroundColor: passwordStrength >= 1 ? getPasswordStrengthColor : 'var(--secondTwo)' }"></div>
                    <div class="dot" :class="{ active: passwordStrength >= 2 }" :style="{ backgroundColor: passwordStrength >= 2 ? getPasswordStrengthColor : 'var(--secondTwo)' }"></div>
                    <div class="dot" :class="{ active: passwordStrength >= 3 }" :style="{ backgroundColor: passwordStrength >= 3 ? getPasswordStrengthColor : 'var(--secondTwo)' }"></div>
                    <div class="dot" :class="{ active: passwordStrength >= 4 }" :style="{ backgroundColor: passwordStrength >= 4 ? getPasswordStrengthColor : 'var(--secondTwo)' }"></div>
                </div>
                <span class="strength-text">{{ getPasswordStrengthText }}</span>
            </div>
            <button type="submit" class="go-btn">Registrar</button>
        </form>
    </section>
</template>

<style scoped>
.form-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 500px;
    padding: 2rem;
    background: var(--second);
    border-radius: 1rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 4px solid var(--base);
    overflow: scroll;
    scrollbar-width: none;
}

.form-container h2 {
    color: white;
    font-size: 1.5rem;
    text-align: center;
    margin: 0;
    font-weight: 500;
    letter-spacing: 1px;
}

.form-container span {
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    font-size: 0.875rem;
}

.form-container form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
}

.input-container {
    position: relative;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    transition: all 0.3s ease;
}

.input-container:focus-within {
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 2px var(--base);
}

.input-container ion-icon {
    color: var(--base);
    font-size: 1.25rem;
    margin-right: 0.75rem;
}

.input-container input {
    background: transparent;
    border: none;
    color: white;
    width: 100%;
    font-size: 1rem;
    outline: none;
}

.input-container input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.go-btn {
    background: var(--base);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.go-btn:hover {
    background: var(--secondTwo);
    transform: translateY(-2px);
}

.go-btn:active {
    transform: scale(0.95);
}

@media (min-width: 768px) {
    .form-container {
        width: 80%;
        max-width: 600px;
    }

    .form-container h2 {
        font-size: 1.75rem;
    }

    .input-container input {
        font-size: 1.1rem;
    }
}

@media (min-width: 1024px) {
    .form-container {
        width: 70%;
        max-width: 500px;
        max-height: 70vh;
    }
}

@media (min-width: 1280px) {
    .form-container {
        width: 40%;
        max-width: 450px;
    }
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
</style>
