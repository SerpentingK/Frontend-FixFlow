<script setup>
import { inject } from 'vue';

const switch_sbf = inject("switch_sbf")

defineProps({
    bills: {
        type: Array,
        required: true
    }
})
</script>
<template>
    <ol class="bill-list">
        <li v-for="bill in bills" :key="bill">
            <button @click="switch_sbf()">
                <span>{{ bill.bill_num }}</span>
                <span>{{ bill.client_name }}</span>
                <br>
                <span>{{ bill.entry_date }}</span>
            </button>
        </li>
    </ol>
</template>

<style scoped>
.bill-list{
    list-style-type: none;
    padding: 0;
    margin: 0;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 300px;
    overflow: scroll;
    scrollbar-width: none;
    background-color: white;
    width: 90%;
    align-items: center;
    margin-top: 20px;
    border-radius: 10px;
}
.bill-list li{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}
.bill-list button{
    all: unset;
    cursor: pointer;
    width: 85%;
    background-color: var(--baseOrange);
    border-radius: 10px;
    padding: 10px;
    color: white;
    text-shadow: 0 0 10px black;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: space-between;
}
.bill-list span{
    width: 40%;
}
</style>