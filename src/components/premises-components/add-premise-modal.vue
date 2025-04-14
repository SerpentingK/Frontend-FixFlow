<script setup>
import { ref, onMounted, inject } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const overlayAlpha = ref(0);
const switchSAPM = inject('switchSAPM');

onMounted(() => {
    setTimeout(() => {
        overlayAlpha.value = 0.5;
    }, 100);
});

const handleAccept = () => {
    router.push('/premises/new-premise');
    switchSAPM();
};
</script>

<template>
    <div class="overlay" :style="{ backgroundColor: `rgba(0, 0, 0, ${overlayAlpha})` }">
        <div class="alert-container">
            <ion-icon name="alert-circle" class="alert-icon" style="color: #FFC107"></ion-icon>
            <p class="alert-message">
                Al añadir un nuevo local, se incrementará tu suscripción mensual en $30,000 COP.
                ¿Deseas continuar?
            </p>
            <div class="alert-buttons">
                <button class="alert-button accept" @click="handleAccept">Aceptar</button>
                <button class="alert-button cancel" @click="switchSAPM();">Cancelar</button>
            </div>
        </div>
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
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    transition: background-color .5s ease-in-out;
}

.alert-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 20px;
    border-radius: 8px;
    color: white;
    font-family: Arial, sans-serif;
    max-width: 80%;
    text-align: center;
    background: var(--second);
    border: 4px solid var(--base);
}

.alert-icon {
    font-size: 40px;
}

.alert-message {
    font-size: 1rem;
    word-wrap: break-word;
}

.alert-buttons {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.alert-button {
    background-color: var(--base);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease;
}

.alert-button.accept {
    background-color: var(--successColor);
}

.alert-button.cancel {
    background-color: var(--errorColor);
}

.alert-button:hover {
    transform: scale(1.05);
}

.alert-button:active {
    transform: scale(0.95);
}

@media (min-width: 1024px) {
    .alert-container {
        max-width: 40%;
    }
}
</style> 