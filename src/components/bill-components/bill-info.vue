<script setup>
import axios from "axios";
import { inject, watch, onMounted } from "vue";

import { printInvoice } from "@/utils/printInvoice"; 

const switch_sbf = inject("switch_sbf");
const bill_number = inject("bill_number");
const loggedCompany = inject("loggedCompany", null);

const infoBill = inject("infoBill", null);

const infoData = inject("infoData");

// Observar cambios en bill_number
watch(bill_number, async (newVal) => {
  console.log("bill_number actualizado:", newVal);
  if (newVal) {
    await infoData();
  }
});

onMounted(() => {
  if (bill_number.value) {
    infoData();
  }
});

const switchSRC = inject("switchSRC");
const switchSDC = inject("switchSDC");

const handleRepair = async (phoneRef, brandName, device) => {
  try {
    await switchSRC(phoneRef, brandName, device);
    await infoData(); // Actualiza la información después de reparar
  } catch (error) {
    console.error("Error al reparar el teléfono:", error);
  }
};

const handleDelivery = async (phoneRef, brandName, device) => {
  try {
    await switchSDC(phoneRef, brandName, device);
    await infoData();
  } catch (error) {
    console.error("Error en handleDelivery:", error.response?.data);
  }
};
</script>

<template>
  <section class="inf-cont">
    <button @click="printInvoice(infoBill, loggedCompany, bill_number)" class="print-btn">
      <ion-icon name="print"></ion-icon>
    </button>
    <button @click="switch_sbf()" class="close-btn">
      <ion-icon name="close"></ion-icon>
    </button>
    <h2>{{ infoBill.bill_number.split("-").slice(1).join("-") }}</h2>
    <div class="info-row">
      <span class="info-label">Cliente:</span>
      <span>{{ infoBill.client_name }}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Numero de telefono:</span>
      <span>{{ infoBill.client_phone }}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Fecha de facturacion:</span>
      <span>{{ infoBill.entry_date }}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Precio total:</span>
      <span>{{ infoBill.total_price }}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Tecnico que recibio:</span>
      <span>{{ infoBill.wname }}</span>
    </div>
    <article class="phones-container">
      <div
        class="phone-inf-cont"
        v-for="phone in infoBill.phones"
        :key="phone.phone_ref"
      >
        <div class="info-row">
          <span class="info-label">Referencia dispositivo:</span>
          <span>{{ phone.phone_ref.split("-").slice(1).join("-") }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Dispositivo:</span>
          <span>{{ phone.brand_name }} {{ phone.device }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Descripción:</span>
          <span>{{ phone.details }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Precio Estimado:</span>
          <span>{{ phone.individual_price }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Pendiente:</span>
          <span>{{ phone.due }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Abono:</span>
          <span>{{ phone.payment }}</span>
        </div>
        <div v-if="phone.date_delivered" class="info-row">
          <span class="info-label">Fecha de entrega:</span>
          <span>{{ phone.date_delivered }}</span>
        </div>
        <div v-if="phone.final_price" class="info-row">
          <span class="info-label">Precio Final:</span>
          <span>{{ phone.final_price }}</span>
        </div>
        <hr class="divider" />
        <span class="state-info">
          <button
            class="state-btn"
            :class="{ active: phone.repaired }"
            type="button"
            @click.prevent="handleRepair(phone.phone_ref, phone.brand_name, phone.device)"
            :disabled="phone.repaired || phone.delivered"
          >
            <span>REPARADO</span>
            <ion-icon name="settings"></ion-icon>
          </button>
          <button
            class="state-btn"
            :class="{ active: phone.delivered }"
            type="button"
            @click.prevent="handleDelivery(phone.phone_ref, phone.brand_name, phone.device)"
            :disabled="phone.delivered"
          >
            <span>ENTREGADO</span>
            <ion-icon name="log-out"></ion-icon>
          </button>
        </span>
      </div>
    </article>
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
  z-index: 12;
}

.inf-cont h2 {
  color: var(--base);
  letter-spacing: 3px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  font-weight: bold;
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
  text-transform: uppercase;
}

.phones-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
}

.phone-inf-cont {
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-shadow: 0px 2px 8px rgba(0,0,0,0.15);
}

.divider {
  border: none;
  border-top: 2px dashed var(--base);
  margin: 10px 0;
  width: 100%;
}

.state-info {
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: space-around;
  margin-top: 10px;
}

.state-btn {
  all: unset;
  cursor: pointer;
  background-color: var(--second);
  padding: 10px 20px;
  border: 2px solid var(--base);
  border-radius: 8px;
  color: white;
  display: flex;
  gap: 5px;
  align-items: center;
  font-weight: bold;
  transition: 0.3s ease;
}

.state-btn.active {
  background-color: var(--base);
  color: white;
  box-shadow: 0px 2px 8px rgba(0,0,0,0.15);
}

.state-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.close-btn, .print-btn {
  all: unset;
  position: absolute;
  background-color: var(--base);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0,0,0,0.15);
  color: white;
  transition: 0.3s ease;
  font-weight: bold;
  cursor: pointer;
}

.close-btn {
  right: 10px;
  top: 10px;
}

.print-btn {
  left: 10px;
  top: 10px;
}

.close-btn:hover, .print-btn:hover {
  transform: scale(1.1);
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
