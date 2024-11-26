<script setup>
import axios from 'axios';
import { ref, computed, inject } from 'vue';

const sale = ref(0);
const original_price = ref(0);
const revenue_price = computed(() => sale.value - original_price.value);
const startShift = inject("startShift");
const total_sales = inject("total_sales")
const total_revenue = inject("total_revenue")
const msg = ref("");


const sales = ref({
        ref_shift : startShift.value,
        product:"",
        sale: sale,
        original_price: original_price,
        revenue_price: revenue_price
    });


const postSales = async () => {
    try {
        const ansawer = await axios.post('http://127.0.0.1:8000/insertdelivery', sales.value)
        msg.value = ansawer.data.msg;
        total_sales.value += sale.value
        total_revenue.value += revenue_price.value
        sales.value = {
            ref_shift : "",
            product:"",
            sale: 0,
            original_price: 0,
            revenue_price: 0
        };
        sale.value = 0
        original_price.value = 0
        revenue_price.value = 0
    } catch (error) {
        console.error('Error en ventas: ', error);
    }
}
</script>


<template>
    <section class="out-container">
        <form @submit.prevent="postSales">
            <div class="input-container">
                <span>Producto: </span>
                <input type="text" placeholder="Ej: Airpods Pro" required v-model="sales.product"/>
            </div>
            <div class="input-container">
                <span>Venta:</span>
                <input type="number" placeholder="100000" required v-model="sale"/>
            </div>
            <div class="input-container">
                <span>Codigo:</span>
                <input type="number" placeholder="30000" required v-model="original_price"/>
            </div>
            <div class="info-container">
                <span>Ganancia:</span>
                <span>{{revenue_price}}</span>
            </div>
            <button class="confirm-btn">Confirmar</button>
        </form>
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
.out-container form{
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}
.input-container{
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    padding: 5px 10px;
    border-radius: 5px;
}
.input-container input{
    all: unset;
    width: 60%;
}
input::-webkit-outer-spin-button, input::-webkit-inner-spin-button{
    display: none;
}
.info-container{
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;
    color: var(--secGray);
}
.confirm-btn{
    background-color: transparent;
    border: 2px solid var(--baseOrange);
    padding: 5px 10px;
    color: white;
    text-transform: uppercase;
    border-radius: 5px;
    letter-spacing: 1px;
    cursor: pointer;
    transition: .3s;
}
.confirm-btn:active{
    scale: .9;
}
@media (min-width: 1024px) {
    .out-container{
        width: 70%;
    }
}
</style>