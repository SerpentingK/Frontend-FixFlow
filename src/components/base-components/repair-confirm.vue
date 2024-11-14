<script setup>
import { inject } from 'vue';

defineProps({
    ref_num: {
        type: String,
        required: true,
        default: "0001-A"
    },
    phone: {
        type: String,
        required: true,
        default: "Samsung A14"
    }
})

const switchSRC = inject("switchSRC")

</script>

<template>
    <section class="container">
        <h3>¿Confirmar reparacion?</h3>
        <div style="width: 100%; display: flex; justify-content: space-evenly; padding: 10px 0; color: white;">
            <span>{{ ref_num }}</span>
            <span>{{ phone }}</span>
        </div>
        <div style="width: 100%; display: flex; justify-content: space-around; padding: 10px 0;" class="btns">
            <button @click="switchSRC">Cancelar</button>
            <button @click="switchSRC" class="confirm-btn">Confirmar</button>
        </div>
    </section>
</template>
<style>
.container {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 5px 20px;
    width: 80%;
    border-radius: 10px;
    background: var(--baseGray);
    box-shadow: -25px -25px 51px #242424,
        25px 25px 51px #484848;
    border: 4px solid var(--baseOrange);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 70%;
    overflow-y: scroll;
    scrollbar-width: none;
    transition: all .4s ease;
    z-index: 2;
}

h3 {
    color: white;
    text-transform: uppercase;
    font-size: 1.3rem;
    text-align: center;
    letter-spacing: 2px;
}
.btns button{
    border: 2px solid var(--baseOrange);
    background-color: transparent;
    padding: 5px 10px;
    color: white;
    text-transform: uppercase;
    font-weight: bolder;
    letter-spacing: 1.5px;
    border-radius: 5px;
    transition: .3s;
}
.btns button:active{
    scale: .9;
}
button.confirm-btn{
    background-color: var(--baseOrange);
}
@media (min-width: 1024px) {
    .container{
        width: 25%;
    }
    
    button:hover{
        scale: 1.1;
    }
}
</style>