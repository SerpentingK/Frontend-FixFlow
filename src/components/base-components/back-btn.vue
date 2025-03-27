<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()

const goBack = () => {
    router.go(-1)
}

</script>

<template>
    <button @click="goBack">
        <ion-icon name="arrow-back-circle"></ion-icon>
    </button>
</template>

<style scoped>
button{
    all: unset;
    position: fixed;
    left: 20px;
    top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    background-color: var(--baseOrange);
    padding: 5px;
    border-radius: 10px;
    color: white;
    box-shadow: var(--baseShadow);
    transition: .2s;
    cursor: pointer;
}
button:active{
    scale: .8;
}
@media (min-width: 1014px){
    button{
        top: 30px;
        left: 30px;
        scale: 1.2;
    }
    button:hover{
        scale: 1.3;
    }
}
</style>