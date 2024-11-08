<script setup>
import { ref, inject, provide } from "vue";
defineProps({
    bill_number: {
        type: String,
        required: true,
    },
    client_name: {
        type: String,
        required: true,
    },
    entry_date: {
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

const switch_sbf = inject("switch_sbf");
</script>

<template>
    
    <section class="info-container">
        <button @click="switch_sbf()" class="close-btn">
            <ion-icon name="close"></ion-icon>
        </button>
        <h2>{{ bill_number }}</h2>
        <div class="info-row">
            <span class="info-label">Client Name:</span>
            <span>{{ client_name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Entry Date:</span>
            <span>{{ entry_date }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Total Price:</span>
            <span>{{ total_price }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Due:</span>
            <span>{{ due }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Payment:</span>
            <span>{{ payment }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Client Phone:</span>
            <span>{{ client_phone }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Worker Name:</span>
            <span>{{ wname }}</span>
        </div>
        <article class="phones-container">
            <div class="phone-info-container" v-for="phone in phones_list" :key="phone.phone_ref">
                <span class="info-span">
                    <div>Referencia dispositivo:</div>
                    <div>{{ phone.phone_ref }}</div>
                </span>
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
                <span v-if="phone.delivery_date" class="info-span">
                    <div>Fecha de entrega:</div>
                    <div>{{ phone.delivery_date }}</div>
                </span>
                <span class="state-info">
                    <button class="state-btn" :class="{ active: phone.repaired }">
                        <span>REPARADO</span>
                        <ion-icon name="settings"></ion-icon>
                    </button>
                    <button class="state-btn" :class="{ active: phone.delivered }">
                        <span>ENTREGADO</span>
                        <ion-icon name="log-out"></ion-icon>
                    </button>
                </span>
            </div>
        </article>

    </section>
</template>

<style scoped>
.info-container {
    z-index: 10;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--baseGray);
    width: 90%;
    border-radius: 10px;
    border: 4px solid var(--baseOrange);
    box-shadow: var(--baseShadow);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    overflow: hidden;
}
.info-container h2{
    color: white;
    letter-spacing: 3px;
    text-shadow: 0 0 10px black;
}
.info-row{
    display: flex;
    gap: 10px;
    width: 90%;
    justify-content: space-between;
    color: var(--secGray);
}

.phones-container {
    max-height: 200px;
    overflow: scroll;
    background-color: white;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.phone-info-container{
    background-color: var(--baseGray);
    border-radius: 10px;
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
.info-span{
    background-color: white;
    display: flex;
    gap: 10px;
    padding: 10px;
    border-radius: 10px;
    box-shadow: var(--secShadow);
}

.state-info {
    display: flex;
    gap: 10px;
    width: 100%;
    justify-content: space-around;
}
.state-btn{
    all: unset;
    background-color: var(--baseGray);
    padding: 10px;
    border: 2px solid var(--baseOrange);
    border-radius: 10px;
    color: white;
    display: flex;
    gap: 5px;
    align-items: center;
}
.state-btn.active{
    background-color: var(--baseOrange);
    color: white;
    box-shadow: var(--secShadow);
}
.close-btn{
    all: unset;
    position: absolute;
    right: 10px;
    top: 10px;
    background-color: var(--baseOrange);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 5px;
    box-shadow: var(--secShadow);
    color: white;
}

</style>