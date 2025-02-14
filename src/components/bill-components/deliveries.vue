<script setup>
import axios from 'axios';
import debounce from "lodash/debounce";
import { inject, ref, onMounted, watch } from 'vue';

const deliveredPhone = inject('deliveredPhone');
const getPhonesD = inject('getPhonesD');
const search = ref("");

const loggedCompany = inject("loggedCompany");

const isEmpty = ref(false);

const searchs = debounce(async () => {
    if (!search.value.trim()) {
        await getPhonesD();
        isEmpty.value = deliveredPhone.value.length === 0;
        return;
    }
    
    try {
        const ansawer = await axios.get(`http://127.0.0.1:8000/phoneBySearchDelivered/${loggedCompany.value}/${search.value}`);
        deliveredPhone.value = ansawer.data;
        isEmpty.value = deliveredPhone.value.length === 0;
    } catch (error) {
        console.error(error);
    }
}, 500);

// Observar cambios en deliveredPhone para actualizar isEmpty en tiempo real
watch(deliveredPhone, (newVal) => {
    isEmpty.value = newVal.length === 0;
}, { deep: true });

onMounted(async () => {
    await getPhonesD();
    isEmpty.value = deliveredPhone.value.length === 0;
});

const switchSDC = inject("switchSDC");

const handleDelivery = async (phoneRef, brandName, device) => {
    try {
        await switchSDC(phoneRef, brandName, device);
        await getPhonesD(); // 🔄 Recargar datos después de la entrega
    } catch (error) {
        console.error("Error al entregar el teléfono:", error);
    }
};
</script>

<template>
    <section class="out-container">
        <form @submit.prevent="searchs" class="search-form">
            <label for="search-inp" class="input-container">
                <ion-icon name="albums"></ion-icon>
                <input type="text" id="search-inp" placeholder="Numero de factura" v-model="search">
            </label>
        </form>

        <!-- ✅ Mensaje se mostrará inmediatamente si la lista está vacía -->
        <p v-if="isEmpty" class="no-phones-message">No hay teléfonos disponibles para entregar.</p>

        <!-- Muestra la lista de celulares entregados -->
        <fieldset v-for="phone in deliveredPhone" :key="phone.phone_ref" class="phone-container">
            <legend>{{ phone.phone_ref.split('-').slice(1).join('-') }}</legend>
            <div class="info-container">
                <span>{{ phone.brand_name }} {{ phone.device }}</span>
                <span>{{ phone.details }}</span>
                <span>{{ phone.entry_date }}</span>
            </div>
            <button class="delivery-btn" @click="handleDelivery(phone.phone_ref, phone.brand_name, phone.device)">
                <ion-icon name="log-out"></ion-icon>
            </button>
        </fieldset>
    </section>
</template>


<style scoped>
.out-container {
    margin-top: 30px;
    width: 100%;
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: column;
    max-height: 400px;
    overflow-y: scroll;
    scrollbar-width: none;
}

.search-form {
    width: 90%;
    display: flex;
    justify-content: center;
    gap: 30px;
    align-items: center;
}

.input-container {
    background-color: white;
    padding: 5px 10px;
    display: flex;
    gap: 10px;
    align-items: center;
    border-radius: 5px;
}

.input-container input {
    all: unset;
    text-transform: uppercase;
}

.search-form button {
    background-color: var(--baseOrange);
    color: white;
    border: 2px solid var(--baseOrange);
    border-radius: 5px;
    padding: 5px 10px;
    transition: .3s;
}

.search-form button:active {
    scale: .9;
}

.phone-container {
    border-radius: 5px;
    border: 2px solid var(--secGray);
    background: var(--thirdGray);
    color: white;
    display: flex;
    align-items: center;
    width: 90%;
    justify-content: space-between;
}

.phone-container legend {
    font-size: 1.2rem;
    letter-spacing: 2px;
    padding: 0 5px;
}

.info-container {
    display: flex;
    width: 80%;
    justify-content: space-between;
    flex-wrap: wrap;
}

.delivery-btn {
    all: unset;
    background-color: var(--baseOrange);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 5px;
    transition: .2s;
}

.delivery-btn:active {
    scale: .9;
}

.no-phones-message {
    color: #f44336; /* Color rojo para el mensaje */
    font-size: 1.2rem;
    margin-top: 20px;
}
</style>
