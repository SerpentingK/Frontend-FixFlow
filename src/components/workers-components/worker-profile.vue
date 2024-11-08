<script setup>
import { inject } from 'vue';
import workerBillList from './worker-bill-list.vue';

const loggedWorker = inject("loggedWorker", null);
const workerRole = inject("workerRole", null);

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
    <section class="info-container">
        <h2>{{ loggedWorker }}</h2>
        <span class="info-span">{{ workerRole }}</span>
        <span>Facturacion:</span>
        <workerBillList :bills="bills" />
    </section>
</template>

<style scoped>
.info-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 5px;
    width: 75%;
    border-radius: 10px;
    background: #363636;
    box-shadow: -25px -25px 51px #242424,
        25px 25px 51px #484848;
    border: 4px solid var(--baseOrange);
}
</style>