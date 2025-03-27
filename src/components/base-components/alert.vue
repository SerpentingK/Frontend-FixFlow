<script setup>
import { ref, onMounted, computed, inject } from 'vue';

const props = defineProps({
    type: {
        type: String,
        default: '4',
        validator: (value) => ['1', '2', '3', '4'].includes(value)
    },
    message: {
        type: String,
        default: "Predeterminado",
        required: true
    }
});

const showAlert = inject("showAlert");
const overlayAlpha = ref(0);

onMounted(() => {
    setTimeout(() => {
        overlayAlpha.value = 0.5;
    }, 100); // Pequeño retraso antes de iniciar la animación
});

const alertStyles = computed(() => {
    switch (props.type) {
        case '1': return { icon: 'checkmark-circle', color: '#4CAF50' }; // Éxito (Verde)
        case '2': return { icon: 'close-circle', color: '#F44336' }; // Error (Rojo)
        case '3': return { icon: 'alert-circle', color: '#FFC107' }; // Advertencia (Amarillo)
        case '4':
        default: return { icon: 'information-circle', color: '#2196F3' }; // Información (Azul)
    }
});
</script>

<template>
    <div class="overlay" :style="{ backgroundColor: `rgba(0, 0, 0, ${overlayAlpha})` }">
        <div class="alert-container">
            <ion-icon :name="alertStyles.icon" class="alert-icon" :style="{ color: alertStyles.color }"></ion-icon>
            <p class="alert-message">{{ message }}</p>
            <button class="alert-button" @click="showAlert">Aceptar</button>
        </div>
    </div>
</template>

<style scoped>
/* Fondo oscuro que bloquea interacciones */
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
    z-index: 1000;
    transition: background-color .5s ease-in-out;
    /* Transición suave del fondo */
}

/* Contenedor de la alerta */
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
    background: var(--baseGray);
    border: 4px solid var(--baseOrange);
}

/* Icono de la alerta */
.alert-icon {
    font-size: 40px;
}

/* Mensaje */
.alert-message {
    font-size: 1rem;
    word-wrap: break-word;
}

/* Botón */
.alert-button {
    background-color: var(--baseOrange);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.2s ease;
}

.alert-button:hover {
    background-color: var(--secGray);
    transform: scale(1.05);
}

.alert-button:active {
    transform: scale(0.95);
}
</style>
