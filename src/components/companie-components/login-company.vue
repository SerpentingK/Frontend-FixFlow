<script setup>
import { inject, ref } from 'vue';
import router from '@/routers/routes';

const loggedCompany = inject("loggedCompany", ref(null))
const isLogin = ref(true) // Propiedad para alternar entre login y registro

const loginCompany = () => {
    loggedCompany.value = "JUNGLE TECHNOLOGY"
    router.push("/companySession")
}

// Función para alternar la vista
const toggleForm = () => {
    isLogin.value = !isLogin.value;
}
</script>

<template>
    <transition name="slide-fade">
        <section v-if="isLogin" key="login" class="login-container">
            <form class="form" @submit.prevent="loginCompany()">
                <h2>Inicio de Sesion</h2>
                <label for="company-input" class="input-container">
                    <ion-icon name="cube"></ion-icon>
                    <input type="text" id="company-input" class="text-input" placeholder="Compañia">
                </label>
                <label for="pasw-input" class="input-container">
                    <ion-icon name="lock-closed"></ion-icon>
                    <input type="password" id="pasw-input" class="text-input" placeholder="Contraseña">
                </label>
                <button class="go-btn">Iniciar Sesion</button>
                <button type="button" @click="toggleForm" class="opt-btn">Registrarse</button>
                <button type="button" class="opt-btn">¿Olvidaste tu contraseña?</button>
            </form>
        </section>

        <section v-else key="signup" class="signup-container">
            <form class="form" @submit.prevent="">
                <h2>Registro</h2>
                <label for="email-input" class="input-container">
                    <ion-icon name="mail"></ion-icon>
                    <input type="mail" id="email-input" class="text-input" placeholder="Correo">
                </label>
                <label for="company-input" class="input-container">
                    <ion-icon name="cube"></ion-icon>
                    <input type="text" id="company-input" class="text-input" placeholder="Nombre Compañia">
                </label>
                <label for="pasw-input" class="input-container">
                    <ion-icon name="lock-closed"></ion-icon>
                    <input type="password" id="pasw-input" class="text-input" placeholder="Contraseña">
                </label>
                <label for="confirm-pasw-input" class="input-container">
                    <ion-icon name="lock-closed"></ion-icon>
                    <input type="password" id="confirm-pasw-input" class="text-input"
                        placeholder="Confirmar Contraseña">
                </label>
                <button class="go-btn">Registrarse</button>
                <button type="button" @click="toggleForm" class="opt-btn">Iniciar Sesion</button>
            </form>
        </section>
    </transition>
</template>

<style scoped>
.login-container,
.signup-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px 10px;
    width: 75%;
    height: 70%;
    border-radius: 10px;
    background: #363636;
    box-shadow: -25px -25px 51px #242424,
        25px 25px 51px #484848;
    border: 2px solid var(--baseOrange);
}

/* Transición personalizada */
.slide-fade-enter-active {
    transition: transform 1s ease, opacity 2s ease;
}

.slide-fade-leave-active {
    transition: transform .8s ease, opacity 2s ease;
}

.slide-fade-enter-from {
    transform: scale(0.1);
    opacity: 0;
}

.slide-fade-leave-to {
    transform: scale(0.1);
    opacity: 0;
}

.form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 100%;
    height: 100%;
}

.form h2 {
    font-family: var(--baseFont);
    font-size: 22px;
    color: white;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.input-container {
    padding: 10px;
    border-radius: 10px;
    background: #ffffff;
    box-shadow: inset -25px -25px 51px #a8a8a8,
        inset 25px 25px 51px #ffffff;
    display: flex;
    align-items: center;
    width: 80%;
}

.text-input {
    all: unset;
    padding: 0 10px;
    width: 80%;
}

.go-btn {
    all: unset;
    padding: 10px 20px;
    background: var(--baseOrange);
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-family: var(--baseFont);
    transition: all 0.05s ease;
    border: 2px solid transparent;
}


.opt-btn {
    all: unset;
    color: rgba(255, 255, 255, 0.418);
    font-size: 12px;
}
.go-btn:active{
    scale: 0.9;
    background-color: var(--baseGray);
    border-color: var(--baseOrange);
}

/* Tablets: 768px y mayores */
@media (min-width: 768px) {
    .form {
        gap: 30px;
    }

    .form h2 {
        font-size: 35px;
        letter-spacing: 3px;
    }

    .input-container {
        font-size: 25px;
    }

    .go-btn {
        font-size: 20px;
    }

    .opt-btn {
        font-size: 16px;
    }
}

/* Portátiles: 1024px y mayores */
@media (min-width: 1024px) {

    .login-container,
    .signup-container {
        width: 30%;
        height: 70%;
    }

    .form {
        gap: 20px;
    }

    .form h2 {
        font-size: 25px;
    }

    .input-container {
        font-size: 20px;
        padding-left: 20px;
    }

    .go-btn {
        font-size: 15px;
    }

    .opt-btn {
        font-size: 12px;
    }
}

/* Computadoras de escritorio: 1280px y mayores */
@media (min-width: 1280px) {
    .login-container,
    .signup-container {
        width: 28%;
        height: 65%;
    }

    .input-container {
        font-size: 18px;
        width: 60%;
    }

    .go-btn {
        font-size: 13px;
        scale: 1.2;
    }
    
    .go-btn:hover{
        scale: 1.3;
    }
    .go-btn:hover:active{
        scale: 1.2;
    }

    .opt-btn {
        font-size: 11px;
    }
}
</style>
