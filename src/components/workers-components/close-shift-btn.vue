<script setup>
import { inject } from 'vue';

const switchCS = inject("switchCS")
</script>

<template>
    <button @click="switchCS">
        <span>Cerrar Sesion</span>
        <ion-icon name="exit"></ion-icon>
    </button>
</template>

<style scoped>
button{
    all: unset;
    z-index: 99999;
    position: fixed;
    left: 10px;
    bottom: 10px;
    background-color: var(--baseOrange);
    padding:10px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
    box-shadow: var(--baseShadow);
}
</style>
