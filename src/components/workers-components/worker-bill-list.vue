<script setup>
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
            <button @click="">
                <span>{{ bill.bill_num }}</span>
                <span>{{ bill.client_name }}</span>
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
}
</style>