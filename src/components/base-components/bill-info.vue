<script setup>
import axios from "axios";
import { inject, watch, onMounted } from "vue";

const switch_sbf = inject("switch_sbf");
const bill_number = inject("bill_number");

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
  <section class="info-container">
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
        class="phone-info-container"
        v-for="phone in infoBill.phones"
        :key="phone.phone_ref"
      >
        <span class="info-span">
          <div>Referencia dispositivo:</div>
          <div>{{ phone.phone_ref.split("-").slice(1).join("-") }}</div>
        </span>
        <span class="info-span">
          <div>Dispositivo:</div>
          <div>{{ phone.brand_name }} {{ phone.device }}</div>
        </span>
        <span class="info-span">
          <div>Descripcion:</div>
          <div>{{ phone.details }}</div>
        </span>
        <span class="info-span">
          <div>Precio Estimado:</div>
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
        <span v-if="phone.date_delivered" class="info-span">
          <div>Fecha de entrega:</div>
          <div>{{ phone.date_delivered }}</div>
        </span>
        <span v-if="phone.final_price" class="info-span">
          <div>Precio Final:</div>
          <div>{{ phone.final_price }}</div>
        </span>
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
.info-container {
  z-index: 10;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--second);
  width: 90%;
  border-radius: 10px;
  border: 4px solid var(--base);
  box-shadow: var(--baseShadow);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}

.info-container h2 {
  color: white;
  letter-spacing: 3px;
  text-shadow: 0 0 10px black;
}

.info-row {
  display: flex;
  gap: 10px;
  width: 90%;
  justify-content: space-between;
  color: var(--secondTwo);
}
.info-label {
  text-transform: uppercase;
}

.phones-container {
  max-height: 200px;
  overflow: scroll;
  background-color: white;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scrollbar-width: none;
}

.phone-info-container {
  background-color: var(--second);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.info-span {
  background-color: white;
  display: flex;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  box-shadow: var(--secShadow);
}

.state-info {
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: space-around;
}

.state-btn {
  all: unset;
  cursor: pointer;
  background-color: var(--second);
  padding: 10px;
  border: 2px solid var(--base);
  border-radius: 10px;
  color: white;
  display: flex;
  gap: 5px;
  align-items: center;
}

.state-btn.active {
  background-color: var(--base);
  color: white;
  box-shadow: var(--secShadow);
}

.close-btn {
  all: unset;
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: var(--base);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 5px;
  box-shadow: var(--secShadow);
  color: white;
  transition: 0.3s;
}

@media (min-width: 768px) {
  .info-container {
    font-size: 1.3rem;
  }
}
@media (min-width: 1024px) {
  .info-container {
    font-size: 1rem;
    width: 40%;
  }
  .close-btn:hover {
    scale: 1.1;
  }
}
</style>
