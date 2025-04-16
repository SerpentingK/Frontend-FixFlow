<script setup>
import { inject, watch, onMounted, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { printInvoice } from "@/utils/printInvoice";

const phonesReceived = inject("phonesReceived");
const loggedCompany = inject("loggedCompany");
const printEnabled = inject("printEnabled");
const router = useRouter();
const total_sales = inject("total_sales");
const total_cash = inject("total_cash");
const total_platform = inject("total_platform");
const bill_number = ref(null);
const billData = inject("billData");
const switchSBC = inject("switchSBC");

const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value || 0);
};

const postbill = async () => {
  try {
    const answer = await axios.post(
      `${import.meta.env.VITE_API_URL}/createBillwithPhones/${loggedCompany.value}`,
      billData.value
    );
    bill_number.value = answer.data.bill_number;

    const { totalCash, totalPlatform } = billData.value.phones.reduce(
      (totals, phone) => ({
        totalCash: totals.totalCash + (phone.payment_physical || 0),
        totalPlatform: totals.totalPlatform + (phone.payment_platform || 0),
      }),
      { totalCash: 0, totalPlatform: 0 }
    );

    const totalPayment = billData.value.phones.reduce(
      (total, phone) => total + (phone.payment || 0),
      0
    );

    const previousSales = JSON.parse(localStorage.getItem("total_sales")) || 0;
    const previousCash = JSON.parse(localStorage.getItem("total_cash")) || 0;
    const previousPlatform =
      JSON.parse(localStorage.getItem("total_platform")) || 0;

    total_sales.value = previousSales + totalPayment;
    total_cash.value = previousCash + totalCash;
    total_platform.value = previousPlatform + totalPlatform;

    localStorage.setItem("total_sales", JSON.stringify(total_sales.value));
    localStorage.setItem("total_cash", JSON.stringify(total_cash.value));
    localStorage.setItem("total_platform", JSON.stringify(total_platform.value));

    switchSBC();
    if (printEnabled.value) {
      printInvoice(billData.value, loggedCompany.value, bill_number.value);
    }

    router.push("/bills/bill-list");

    billData.value = {
      total_price: 0,
      client_name: "",
      client_phone: "",
      wname: "",
      ref_shift: "",
      phones: [],
    };
  } catch (error) {
    console.error("Error al enviar la factura:", error.response?.data);
  }
};

watch(total_sales, (newVal) => {
  localStorage.setItem("total_sales", JSON.stringify(newVal));
});

watch(phonesReceived, (newVal) => {
  localStorage.setItem("phonesReceived", JSON.stringify(newVal));
});

const updateReceived = () => {
  phonesReceived.value++;
  localStorage.setItem("phonesReceived", JSON.stringify(phonesReceived.value));
};

onMounted(() => {
  const storedSales = localStorage.getItem("total_sales");
  if (storedSales) total_sales.value = JSON.parse(storedSales);
});
</script>

<template>
  <section class="inf-cont">
    <div class="section">
      <div class="info-row"><span class="info-label">Cliente:</span> {{ billData.client_name }}</div>
      <div class="info-row"><span class="info-label">Teléfono:</span> {{ billData.client_phone }}</div>
      <div class="info-row"><span class="info-label">Total:</span> {{ formatCurrency(billData.total_price) }}</div>
      <div class="info-row"><span class="info-label">Técnico:</span> {{ billData.wname }}</div>
    </div>

    <hr class="divider" />

    <article class="phones-container">
      <div
        class="phone-inf-cont"
        v-for="phone in billData.phones"
        :key="phone.phone_ref"
      >
        <div class="info-row"><span class="info-label">Dispositivo:</span> {{ phone.brand_name }} {{ phone.device }}</div>
        <div class="info-row"><span class="info-label">Descripción:</span> {{ phone.details }}</div>
        <div class="info-row"><span class="info-label">Precio:</span> {{ formatCurrency(phone.individual_price) }}</div>
        <div class="info-row"><span class="info-label">Pendiente:</span> {{ formatCurrency(phone.due) }}</div>
        <div class="info-row"><span class="info-label">Abono:</span> {{ formatCurrency(phone.payment) }}</div>
        <hr class="divider" />
      </div>
    </article>

    <div class="btn-container">
      <button @click="switchSBC" class="cancel-btn">Cancelar</button>
      <button @click="postbill(); updateReceived()" class="confirm-btn">Confirmar</button>
    </div>
  </section>
</template>

<style scoped>
.inf-cont {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  width: 90%;
  border-radius: 10px;
  background: var(--second);
  box-shadow: -10px -10px 30px #242424, 10px 10px 30px #484848;
  border: 4px solid var(--base);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 80%;
  overflow-y: auto;
  scrollbar-width: none;
  gap: 20px;
  z-index: 9999;
}

.section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: var(--secondTwo);
  font-weight: bold;
}

.info-label {
  color: var(--base);
}

.phones-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.phone-inf-cont {
  background-color: #fff;
  border-radius: 10px;
  padding: 10px 15px;
  box-shadow: 0px 2px 8px rgba(0,0,0,0.15);
}

.divider {
  border: none;
  border-top: 2px dashed var(--base);
  margin: 10px 0;
  width: 100%;
}

.btn-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 10px;
}

.confirm-btn,
.cancel-btn {
  all: unset;
  padding: 10px 20px;
  color: white;
  background-color: var(--base);
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  border: 2px solid var(--base);
  transition: 0.3s ease;
  flex: 1;
}

.cancel-btn {
  background-color: #9e2a2b;
  border-color: #9e2a2b;
}

.confirm-btn:active,
.cancel-btn:active {
  scale: 0.95;
}

@media (min-width: 768px) {
  * {
    font-size: 1.1rem;
  }

  .inf-cont {
    width: 60%;
  }
}

@media (min-width: 1024px) {
  .inf-cont {
    width: 40%;
  }
}
</style>
