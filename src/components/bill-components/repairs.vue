<script setup>
import axios from 'axios';
import { inject, onMounted, ref, watch } from 'vue';
import debounce from "lodash/debounce";

const phonesRepair = inject('phonesRepair')
const getPhonesR = inject('getPhonesR')
const search = ref("");
const loggedCompany = inject("loggedCompany");

const isEmpty = ref(false);

const searchs = debounce(async () => {
    if(!search.value.trim()){
        getPhonesR()
        return
    }
    try {
        const ansawer = await axios.get(`/api/phoneBySearch/${loggedCompany.value}/${search.value}`)
        phonesRepair.value = ansawer.data
        isEmpty.value = phonesRepair.value.length === 0;
    } catch (error) {
        
    }
}, 500)

watch(search, searchs);

// Observar cambios en deliveredPhone para actualizar isEmpty en tiempo real
watch(phonesRepair, (newVal) => {
    isEmpty.value = newVal.length === 0;
}, { deep: true });

onMounted(async()=>{
    await getPhonesR()
    isEmpty.value = phonesRepair.value.length === 0;
})


const switchSRC = inject("switchSRC")

const handleRepair = async (phoneRef, brandName, device) => {
    try {
        await switchSRC(phoneRef, brandName, device);
        await getPhonesR(); // 🔄 Recargar datos después de la entrega
    } catch (error) {
        console.error("Error al entregar el teléfono:", error);
    }
};
</script>

<template>
    <section class="container">
        <h2>REPARACIONES</h2>
        <form @submit.prevent="searchs" class="search-form">
            <label for="search-inp" class="input-container">
                <ion-icon name="albums"></ion-icon>
                <input type="text" id="search-inp" placeholder="factura" v-model="search">
            </label>
        </form>

        <!-- ✅ Mensaje se mostrará inmediatamente si la lista está vacía -->
        <p v-if="isEmpty" class="no-phones-message">No hay teléfonos disponibles para reparar.</p>

        <fieldset v-for="phone in phonesRepair" :key="phone.phone_ref" class="phone-container">
            <legend>{{ phone.phone_ref.split('-').slice(1).join('-') }}</legend>
            <div class="info-container">
                <span>{{phone.brand_name}} {{ phone.device }}</span>
                <span>{{ phone.details }}</span>
                <span>{{ phone.entry_date }}</span>
            </div>
            <button class="repair-btn" @click="handleRepair(phone.phone_ref, phone.brand_name, phone.device)"><ion-icon name="construct"></ion-icon></button>
        </fieldset>
    </section>
</template>

<style scoped>
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
    gap: 10px;
    z-index: 1;
}

.container h2 {
    color: white;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-align: center;
}

.search-form {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.input-container {
    background-color: white;
    padding: 5px 10px;
    display: flex;
    gap: 10px;
    align-items: center;
    border-radius: 5px;
    width: 60%;
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
.phone-container{
    border-radius: 5px;
    border: 2px solid var(--secGray);
    background: var(--thirdGray);
    color: white;
    display: flex;
    align-items: center;
    width: 90%;
    justify-content: space-between;
}
.phone-container legend{
    font-size: 1.2rem;
    letter-spacing: 2px;
    padding: 0 5px;
}
.info-container{
    display: flex;
    width: 80%;
    justify-content: space-between;
    flex-wrap: wrap;
}
.repair-btn{
    all: unset;
    background-color: var(--baseOrange);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 5px;
    transition: .2s;
}
.repair-btn:active{
    scale: .9;
}

@media (min-width:768px) {
    *{
        font-size: 1.2rem;
    }
}
@media (min-width: 1024px) {
    *{
        font-size: 1.1rem;
    }
    .container{
        width: 40%;
    }
    button:hover{
        scale: 1.1;
    }
}
.no-phones-message {
    color: #f44336; /* Color rojo para el mensaje */
    font-size: 1.2rem;
    margin-top: 20px;
}
</style>