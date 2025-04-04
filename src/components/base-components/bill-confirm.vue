<script setup>
import { inject, watch, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { printInvoice } from '@/utils/printInvoice';


const phonesReceived = inject('phonesReceived');
const loggedCompany = inject("loggedCompany");
const router = useRouter();
const total_sales = inject('total_sales');

const billData = inject('billData');

const switchSBC = inject("switchSBC")


const postbill = async () => {
    try {
        const answer = await axios.post(
            `/api/createBillwithPhones/${loggedCompany.value}`,
            billData.value
        );

        // Sumar los pagos de todos los teléfonos
        const totalPayment = billData.value.phones.reduce((total, phone) => total + (phone.payment || 0), 0);

        // Obtener valores previos del localStorage y sumarlos
        const previousSales = JSON.parse(localStorage.getItem("total_sales")) || 0;
        total_sales.value = previousSales + totalPayment;

        // Guardar en localStorage
        localStorage.setItem("total_sales", JSON.stringify(total_sales.value));

        const billDataCopy = JSON.parse(JSON.stringify(billData.value));

        printInvoice(billDataCopy, loggedCompany.value);
        switchSBC()
        router.push("/bills/bill-list")

        // Resetear el formulario
        billData.value = {
            total_price: 0,
            client_name: "",
            client_phone: "",
            wname: "",
            ref_shift: "",
            phones: []
        };
        
    } catch (error) {
        console.error("Error al enviar la factura:", error.response.data);
    }
};

watch(total_sales, (newVal) => {
    localStorage.setItem("total_sales", JSON.stringify(newVal));
});

watch(phonesReceived, (newVal) => {
    localStorage.setItem("phonesReceived", JSON.stringify(newVal))
})

const updateReceived = () => {
    phonesReceived.value++
    localStorage.setItem("phonesReceived", JSON.stringify(phonesReceived.value))
}

onMounted(() => {
    const storedSales = localStorage.getItem("total_sales");
    if (storedSales) total_sales.value = JSON.parse(storedSales);
});
</script>

<template>
    <section class="info-container">
        <div class="info-row">
            <span class="info-label">Cliente:</span>
            <span>{{ billData.client_name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Numero de telefono:</span>
            <span>{{ billData.client_phone }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Precio total:</span>
            <span>{{ billData.total_price }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Tecnico que recibe:</span>
            <span>{{ billData.wname }}</span>
        </div>
        <article class="phones-container">
            <div class="phone-info-container" v-for="phone in billData.phones" :key="phone.phone_ref">
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
                    <div>{{ phone.individual_price }}</div>
                </span>
                <span class="info-span">
                    <div>Pendiente:</div>
                    <div>{{ phone.due }}</div>
                </span>
                <span class="info-span">
                    <div>Abono:</div>
                    <div>{{ phone.payment }}</div>
                </span>
            </div>
        </article>
        <div class="btn-container">
            <button @click="switchSBC" class="cancel-btn">Cancelar</button>
            <button @click="postbill(); updateReceived()" class="confirm-btn">Confirmar</button>
        </div>
    </section>
</template>

<style scoped>
.info-container {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 10px 5px;
    width: 80%;
    border-radius: 10px;
    background: var(--baseGray);
    box-shadow: -25px -25px 51px #242424,
        25px 25px 51px #484848;
    border: 4px solid var(--baseOrange);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 60%;
    overflow-y: scroll;
    scrollbar-width: none;
    transition: all .4s ease;
    z-index: 9999;
    gap: 10px;
}


.info-row {
    display: flex;
    align-items: center;
    width: 90%;
    justify-content: space-between;
    color: var(--secGray);
}

.phones-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px 10px;
    gap: 10px;
}

.phone-info-container {
    background-color: white;
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
    border-radius: 10px;
    width: 90%;
}

.info-span {
    display: flex;
    width: 100%;
    justify-content: space-between;
}

.confirm-btn,
.cancel-btn {
    all: unset;
    padding: 10px 20px;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color .4s ease;
    border: 2px solid var(--baseOrange);
    transition: .3s;
}

.confirm-btn {
    background-color: var(--baseOrange)
}

.confirm-btn:active,
.cancel-btn:active {
    scale: .9;
}

.btn-container {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    width: 100%;
}

@media (min-width: 768px) {
    * {
        font-size: 1.3rem;
    }
}

@media (min-width: 1024px) {
    .info-container {
        width: 50%;
        max-height: 70%;
    }
}

.print-container {
    display: none;
}

/* ✅ Solo mostrar el área de impresión al imprimir */
@media print {
    body * {
        visibility: hidden;
    }

    #print-area,
    #print-area * {
        visibility: visible;
    }

    #print-area {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
    }
}
</style>