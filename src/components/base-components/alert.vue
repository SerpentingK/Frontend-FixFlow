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
    },
    duration: {
        type: Number,
        default: 3000
    }
});

const showAlert = inject("showAlert");
const isVisible = ref(false);
const isExiting = ref(false);

onMounted(() => {
    setTimeout(() => {
        isVisible.value = true;
    }, 100);

    setTimeout(() => {
        isExiting.value = true;
        setTimeout(() => {
            showAlert();
        }, 300);
    }, props.duration);
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
    <div class="alert-wrapper" :class="{ 'visible': isVisible, 'exiting': isExiting }">
        <div class="alert-container">
            <ion-icon :name="alertStyles.icon" class="alert-icon" :style="{ color: alertStyles.color }"></ion-icon>
            <p class="alert-message">{{ message }}</p>
        </div>
    </div>
</template>

<style scoped>
.alert-wrapper {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    transform: translateX(100%);
    opacity: 0;
    transition: all 0.3s ease-out;
    display: grid;
    grid-template-rows: auto;
    gap: 10px;
    pointer-events: none;
}

.alert-wrapper.visible {
    transform: translateX(0);
    opacity: 1;
}

.alert-wrapper.exiting {
    transform: translateX(100%);
    opacity: 0;
}

.alert-container {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-family: Arial, sans-serif;
    background: var(--second);
    border: 2px solid var(--base);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    min-width: 200px;
    max-width: 400px;
    pointer-events: auto;
}

.alert-icon {
    font-size: 24px;
    flex-shrink: 0;
}

.alert-message {
    font-size: 0.9rem;
    margin: 0;
    word-wrap: break-word;
}

@media (min-width: 1024px) {
    .alert-container {
        min-width: 300px;
    }
}
</style>
