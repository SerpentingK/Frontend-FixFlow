<script setup>
import { computed, inject } from 'vue';

const switch_sbf = inject("switch_sbf");

const props = defineProps({
    bills: {
        type: Array,
        required: true
    },
    listOption: {
        type: String,
        required: true
    }
});

// Computed para generar mensajes personalizados
const emptyMessage = computed(() => {
    if (props.listOption === "entrance") {
        return "No hay teléfonos ingresados.";
    } else if (props.listOption === "repaired") {
        return "No hay teléfonos reparados.";
    } else if (props.listOption === "delivery") {
        return "No hay teléfonos entregados.";
    }
    return "No hay información disponible.";
});
</script>

<template>
    <ol v-if="bills.length > 0" class="bill-list">
        <li v-for="bill in bills" :key="bill">
            <button @click="switch_sbf(bill.bill_number)">
                <span>{{ bill.bill_number?.split('-').slice(1).join('-') }}</span>
                <span>{{ bill.client_name }}</span>
                <span>{{ bill.phone_ref?.split('-').slice(1).join('-') }}</span>
                <br>
                <span>{{ bill.entry_date }}</span>
            </button>
        </li>
    </ol>
    <p v-else class="no-phones-message">{{ emptyMessage }}</p>
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
    scrollbar-width: 0;
    background-color: white;
    width: 90%;
    align-items: center;
    margin-top: 20px;
    border-radius: 10px;
}

.bill-list::-webkit-scrollbar{
    display: none;
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
.no-phones-message {
    color: #f44336; /* Color rojo para el mensaje */
    font-size: 1.2rem;
    margin-top: 20px;
}
@media (min-width: 1024px) {
    .bill-list span{
        width: 22%;
    }
}
</style>