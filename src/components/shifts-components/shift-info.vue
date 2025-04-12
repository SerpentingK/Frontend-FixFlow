<script setup>
import axios from "axios";
import workerBillList from "../workers-components/worker-bill-list.vue";
import { inject, ref, onMounted, watchEffect } from "vue";

const props = defineProps({
  shift: {
    type: Object,
    required: true,
    default: () => ({
      ref_shift: "",
      document: "",
      start_time: "",
      finish_time: "",
      total_received: 0,
      total_gain: 0,
      total_outs: 0,
      date_shift: "",
    }),
  },
});

const listOption = ref("entrance");

const bills = ref([]);

const sales = ref([]);

const outs = ref([]);

const isEmpty = ref(false);

const switchSI = inject("switchSI");

const loggedCompany = inject("loggedCompany");

const workerName = ref("");

const getWorkerName = async () => {
  try {
    const workerDocument = props.shift.id.split('_').slice(1).join('_');
    
    const response = await axios.get(`/api/worker/${workerDocument}/${loggedCompany.value}`);
    
    if (response.data && response.data.wname) {
      workerName.value = response.data.wname;
    } else {
      workerName.value = "Técnico desconocido";
    }
  } catch (error) {
    console.error("Error al obtener el nombre del técnico:", error);
    workerName.value = "Error al obtener datos";
  }
};

const getList = async () => {
    let url = "";
    try {
        if (listOption.value === "entrance") {
            url = `/api/shiftReceived/${props.shift.ref_shift}`;
        } else if (listOption.value === "repaired") {
            url = `/api/shiftRepaired/${props.shift.ref_shift}`;
        } else if (listOption.value === "delivery") {
            url = `/api/shiftDelivery/${props.shift.ref_shift}`;
        } else if (listOption.value === "sales") {
            url = `/api/shiftSales/${props.shift.ref_shift}`;
        } else if (listOption.value === "outs") {
            url = `/api/shiftOuts/${props.shift.ref_shift}`;
        }
        const response = await axios.get(url);

        // Limpiar todas las listas antes de asignar valores nuevos
        bills.value = [];
        sales.value = [];
        outs.value = [];

        if (listOption.value === "sales") {
            sales.value = response.data
            console.log(sales.value)
        } else if (listOption.value === "outs") {
            outs.value = response.data
            console.log(outs.value)
        } else {
            bills.value = response.data
        }
    } catch (error) {
        console.error("📌 Error al obtener datos:", error);
        bills.value = [];
        sales.value = [];
        outs.value = [];
    }
};


onMounted(() => {
    getList();
    getWorkerName();
    watchEffect(() => {
        isEmpty.value = bills.value.length === 0 && sales.value.length === 0 && outs.value.length === 0;
    });
});

</script>

<template>
  <section class="container">
    <button @click="switchSI" class="close-btn" title="Cerrar">
      <ion-icon name="close"></ion-icon>
    </button>
    <h2>{{ workerName }}</h2>
    <div class="info-div">
      <span>Colaborador:</span>
      <span>{{ shift.id.split('_').slice(1).join('_') }}</span>
    </div>
    <div class="info-div">
      <span>Horario:</span>
      <span>{{ shift.start_time }} - {{ shift.finish_time }}</span>
    </div>
    <div class="info-div">
      <span>Total recaudado:</span>
      <span>{{ shift.total_received | currency }}</span>
    </div>
    <div class="info-div">
      <span>Ganancia:</span>
      <span>{{ shift.total_gain | currency }}</span>
    </div>
    <div class="info-div">
      <span>Salida:</span>
      <span>{{ shift.total_outs | currency }}</span>
    </div>
    <div class="info-div">
      <span>Fecha:</span>
      <span>{{ shift.date_shift }}</span>
    </div>
    <form @submit.prevent="getList" class="list-options">
      <input
        type="radio"
        id="entrance-input"
        name="list-option"
        value="entrance"
        v-model="listOption"
        @change="getList"
        class="check-input"
      />
      <label for="entrance-input" class="check-label" title="Lista de facturas ingresadas">
        <ion-icon name="enter"></ion-icon>
      </label>

      <input
        type="radio"
        id="outs-input"
        name="list-option"
        value="outs"
        v-model="listOption"
        @change="getList"
        class="check-input"
      />
      <label for="outs-input" class="check-label" title="Lista de salidas">
        <ion-icon name="remove-circle"></ion-icon>
      </label>

      <input
        type="radio"
        id="sales-input"
        name="list-option"
        value="sales"
        v-model="listOption"
        @change="getList"
        class="check-input"
      />
      <label for="sales-input" class="check-label" title="Lista de ventas">
        <ion-icon name="add-circle"></ion-icon>
      </label>

      <input
        type="radio"
        id="repaired-input"
        name="list-option"
        value="repaired"
        v-model="listOption"
        @change="getList"
        class="check-input"
      />
      <label for="repaired-input" class="check-label" title="Lista de reparados">
        <ion-icon name="construct"></ion-icon>
      </label>

      <input
        type="radio"
        id="delivery-input"
        name="list-option"
        value="delivery"
        v-model="listOption"
        @change="getList"
        class="check-input"
      />
      <label for="delivery-input" class="check-label" title="Lista de entregados">
        <ion-icon name="exit"></ion-icon>
      </label>
    </form>
    <workerBillList
      :sales="sales"
      :listOption="listOption"
      v-if="listOption === 'sales'"
    />
    <workerBillList
      :outs="outs"
      :listOption="listOption"
      v-if="listOption === 'outs'"
    />
    <workerBillList
      :bills="bills"
      :listOption="listOption"
      v-if="
        listOption === 'entrance' ||
        listOption === 'repaired' ||
        listOption === 'delivery'
      "
    />
  </section>
</template>

<style scoped>
.container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 10px;
  width: 80%;
  border-radius: 10px;
  background: var(--second);
  box-shadow: -25px -25px 51px #242424, 25px 25px 51px #484848;
  border: 4px solid var(--base);
  scrollbar-width: none;
  display: flex;
  align-items: center;
  max-height: 70%;
  flex-direction: column;
  justify-content: flex-start;
}
.container h2 {
  color: white;
  letter-spacing: 3px;
  font-size: 1.8rem;
}
.info-div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  color: var(--secondTwo);
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.list-options {
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: space-around;
}

.check-input {
  display: none;
  /* Oculta el input de tipo radio */
}

.check-label {
  cursor: pointer;
  border-radius: 10px;
  background-color: var(--second);
  border: 2px solid var(--base);
  padding: 10px;
  transition: 0.3s;
  font-weight: bolder;
  text-transform: capitalize;
  color: var(--secondTwo);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Cambia el estilo del label cuando el input radio correspondiente está marcado */
.check-input:checked + .check-label {
  background-color: var(--base);
  border: 2px solid white;
  color: white;
  scale: 1.04;
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
  cursor: pointer;
}
.close-btn:hover{
  scale: 1.1;
}
@media (min-width: 768px) {
  * {
    font-size: 1.3rem;
  }
}

@media (min-width: 1024px) {
  * {
    font-size: 1.1rem;
  }
  .container {
    width: 38%;
    max-height: 70%;
  }
}
</style>
