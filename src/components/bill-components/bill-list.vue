<script setup>
import { inject } from 'vue';

const switch_sbf = inject("switch_sbf")

const bills = [
    {
        bill_num: "0001-A",
        client_name: "John Doe",
        entry_date: "2022-01-01"
    },
    {
        bill_num: "0002-B",
        client_name: "Jane Smith",
        entry_date: "2022-02-15"
    },
    {
        bill_num: "0003-C",
        client_name: "Alice Johnson",
        entry_date: "2022-03-10"
    },
    {
        bill_num: "0004-D",
        client_name: "Bob Brown",
        entry_date: "2022-04-25"
    },
    {
        bill_num: "0005-E",
        client_name: "Charlie Green",
        entry_date: "2022-05-05"
    },
    {
        bill_num: "0006-F",
        client_name: "Diana White",
        entry_date: "2022-06-18"
    },
    {
        bill_num: "0007-G",
        client_name: "Edward Black",
        entry_date: "2022-07-21"
    },
    {
        bill_num: "0008-H",
        client_name: "Fiona Blue",
        entry_date: "2022-08-13"
    },
    {
        bill_num: "0009-I",
        client_name: "George Gray",
        entry_date: "2022-09-07"
    },
    {
        bill_num: "0010-J",
        client_name: "Hannah Red",
        entry_date: "2022-10-29"
    }
];

</script>

<template>
    <section class="container">
        <h2>LISTA DE FACTURAS</h2>
        <form @submit.prevent="" class="search-form">
            <select>
                <option value="1">Numero de Factura</option>
                <option value="2">Fecha</option>
                <option value="3">Cliente</option>
            </select>
            <input type="text" placeholder="Buscar" />
            <button>Buscar</button>
        </form>
        <ol class="bill-list">
            <transition-group name="fade">
                <button v-for="bill in bills" :key="bill" @click="switch_sbf">
                    <fieldset>
                        <legend>{{ bill.bill_num }}</legend>
                        <span>{{ bill.client_name }}</span>
                        <span>{{ bill.entry_date }}</span>
                    </fieldset>
                </button>
            </transition-group>
            <button class="load-btn">Cargar Mas</button>
        </ol>
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
    transition: all .4s ease;
}
.container h2{
    color: white;
    letter-spacing: 2px;
    text-align: center;
}
.search-form{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
}
.search-form *{
    background-color: white;
    color: black;
    border-radius: 10px;
    padding: 5px 10px;
}
.search-form button{
    all: unset;
    border-radius: 10px;
    padding: 5px 10px;
    background-color: var(--baseOrange);
    color: white;
    cursor: pointer;
    transition: .3s;
}
.search-form button:active{
    scale: .9;
}
.bill-list{
    list-style: none;
    padding: 0;
    margin-top: 10px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    max-height: 300px;
    overflow-y: scroll;
    scrollbar-width: none;
    padding: 5px 10px;
}
.bill-list button{
    all: unset;
    border-radius: 5px;
    transition: background-color 0.3s;
    width: 100%;
    display: flex;
    color: white;
    transition: .3s;
    
}
.bill-list button fieldset{
    width: 100%;
    display: flex;
    justify-content: space-between;
    border: 2px solid var(--secGray);
    border-radius: 10px;
}
.bill-list button:active{
    scale: .9;
}
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}
button.load-btn{
    all: unset;
    background-color: var(--baseOrange);
    color: white;
    border-radius: 10px;
    padding: 5px 10px;
    cursor: pointer;
    margin-top: 10px;
    transition: .3s;
}
@media (min-width: 768px) {
    *{
        font-size: 1.3rem;
    }
    .bill-list{
        max-height: 500px;
    }
}

@media (min-width: 1024px) {
    *{
        font-size: 1.2rem;
    }
    .container{
        max-height: 80%;
        width: 45%;
    }
}
</style>