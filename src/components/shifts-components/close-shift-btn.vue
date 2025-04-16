<script setup>
import { inject } from 'vue';

const switchCS = inject("switchCS")
</script>

<template>
    <button @click="switchCS">
        <span>Terminar turno</span>
        <ion-icon name="exit"></ion-icon>
    </button>
</template>

<style scoped>
button{
    all: unset;
    z-index: 9;
    position: fixed;
    left: 10px;
    bottom: 10px;
    background-color: var(--base);
    padding:10px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
    box-shadow: var(--baseShadow);
    cursor: pointer;
}
</style>
