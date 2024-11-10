<script setup>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';

const loggedWorker = inject("loggedWorker", ref(null));
const workerRole = inject("workerRole", ref(null));

const router = useRouter()

const logoutWorker = () => {
    loggedWorker.value = null;
    workerRole.value = null;
    router.push("/workers/login-worker")
}
</script>

<template>
    <button @click="logoutWorker">
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
