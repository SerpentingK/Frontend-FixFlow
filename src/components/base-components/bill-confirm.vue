<script setup>
import { inject } from 'vue';

const phonesReceived = inject('phonesReceived');

defineProps({
    client_name: {
        type: String,
        required: true,
    },
    total_price: {
        type: Number,
        required: true,
    },
    due: {
        type: Number,
        required: false,
        default: 0,
    },
    payment: {
        type: Number,
        required: false,
        default: 0,
    },
    client_phone: {
        type: String,
        required: true,
    },
    wname: {
        type: String,
        required: true,
    },
    phones_list: {
        type: Array,
        required: true,
    },
});

const switchSBC = inject("switchSBC")

const updateReceived = () =>{
    phonesReceived.value++
}
</script>

<template>
    <section class="info-container">
        <div class="info-row">
            <span class="info-label">Cliente:</span>
            <span>{{ client_name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Numero de telefono:</span>
            <span>{{ client_phone }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Precio total:</span>
            <span>{{ total_price }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Pendiente:</span>
            <span>${{ due }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Abono:</span>
            <span>${{ payment }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Tecnico que recibe:</span>
            <span>{{ wname }}</span>
        </div>
        <article class="phones-container">
            <div class="phone-info-container" v-for="phone in phones_list" :key="phone.phone_ref">
                <span class="info-span">
                    <div>Dispositivo:</div>
                    <div>{{ phone.brand_name }} {{ phone.device }}</div>
                </span>
                <span class="info-span">
                    <div>Descripcion:</div>
                    <div>{{ phone.details }}</div>
                </span>
                <span class="info-span">
                    <div>Precio:</div>
                    <div>{{ phone.price }}</div>
                </span>
            </div>
        </article>
        <div class="btn-container">
            <button @click="switchSBC" class="cancel-btn">Cancelar</button>
            <button @click="switchSBC(); updateReceived()" class="confirm-btn">Confirmar</button>
        </div>
    </section>
</template>

<style scoped>
.info-container {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 10px 5px;
    width: 80%;
    border-radius: 10px;
    background: var(--baseGray);
    box-shadow: -25px -25px 51px #242424,
        25px 25px 51px #484848;
    border: 4px solid var(--baseOrange);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 60%;
    overflow-y: scroll;
    scrollbar-width: none;
    transition: all .4s ease;
    z-index: 9999;
    gap: 10px;
}


.info-row {
    display: flex;
    align-items: center;
    width: 90%;
    justify-content: space-between;
    color: var(--secGray);
}

.phones-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px 10px;
    gap: 10px;
}

.phone-info-container {
    background-color: white;
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
    border-radius: 10px;
    width: 90%;
}

.info-span {
    display: flex;
    width: 100%;
    justify-content: space-between;
}

.confirm-btn,
.cancel-btn {
    all: unset;
    padding: 10px 20px;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color .4s ease;
    border: 2px solid var(--baseOrange);
    transition: .3s;
}

.confirm-btn {
    background-color: var(--baseOrange)
}

.confirm-btn:active,
.cancel-btn:active {
    scale: .9;
}

.btn-container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
}

@media (min-width: 768px) {
    * {
        font-size: 1.3rem;
    }
}

@media (min-width: 1024px) {
    .info-container {
        width: 50%;
        max-height: 70%;
    }
}
</style>