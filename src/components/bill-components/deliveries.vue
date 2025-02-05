<script setup>
import axios from 'axios';
import { inject, ref, onMounted } from 'vue';

const deliveredPhone = inject('deliveredPhone')
const getPhonesD = inject('getPhonesD')
const search = ref("");

const searchs = async () => {
    if(!search.value.trim()){
        getPhonesD()
        return
    }
    try {
        const ansawer = await axios.get(`http://127.0.0.1:8000/phoneBySearchDelivered/${search.value}`)
        deliveredPhone.value = ansawer.data
    } catch (error) {
        
    }
}

onMounted(async()=>{
     await getPhonesD()
})

const switchSDC = inject("switchSDC")
</script>

<template>
    <section class="out-container">
        <form @submit.prevent="searchs" class="search-form">
            <label for="search-inp" class="input-container">
                <ion-icon name="albums"></ion-icon>
                <input type="text" id="search-inp" placeholder="Numero de factura" v-model="search">
            </label>
            <button>Buscar</button>
        </form>
        <fieldset v-for="phone in deliveredPhone" :key="phone.phone_ref" class="phone-container">
            <legend>{{ phone.phone_ref.split('-').slice(1).join('-') }}</legend>
            <div class="info-container">
                <span>{{phone.brand_name}} {{ phone.device }}</span>
                <span>{{ phone.details }}</span>
                <span>{{ phone.entry_date }}</span>
            </div>
            <button class="delivery-btn" @click="switchSDC(phone.phone_ref, phone.brand_name, phone.device)"><ion-icon name="log-out"></ion-icon></button>
        </fieldset>
    </section>
</template>

<style scoped>

.out-container{
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
.delivery-btn{
    all: unset;
    background-color: var(--baseOrange);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 5px;
    transition: .2s;
}
.delivery-btn:active{
    scale: .9;
}
</style>