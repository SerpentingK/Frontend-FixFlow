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
      id: "",
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
    console.log('Datos del turno recibidos:', props.shift);
    
    // Intentar obtener el documento del trabajador de diferentes maneras
    let workerDocument;
    if (props.shift.document) {
      workerDocument = props.shift.document;
      console.log('Usando document:', workerDocument);
    } else if (props.shift.id) {
      // Si el id es un número directo, usarlo como documento
      if (!isNaN(props.shift.id)) {
        workerDocument = props.shift.id;
      } else {
        workerDocument = props.shift.id.split('_')[1];
      }
      console.log('Usando id:', workerDocument);
    } else if (props.shift.ref_shift) {
      workerDocument = props.shift.ref_shift.split('_')[1];
      console.log('Usando ref_shift:', workerDocument);
    } else {
      console.error('No se encontró ningún identificador válido en el turno');
      throw new Error('No se pudo encontrar el documento del trabajador');
    }
    
    console.log('Consultando worker con documento:', workerDocument);
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/worker/${workerDocument}/${loggedCompany.value}`);
    console.log('Respuesta del servidor:', response.data);
    
    if (response.data && response.data.wname) {
      workerName.value = response.data.wname;
      console.log('Nombre del trabajador asignado:', workerName.value);
    } else {
      console.warn('Respuesta del servidor no contiene wname:', response.data);
      workerName.value = "Técnico desconocido";
    }
  } catch (error) {
    console.error("Error detallado al obtener el nombre del técnico:", error);
    console.error("Datos del turno que causaron el error:", props.shift);
    workerName.value = "Error al obtener datos";
  }
};

const getList = async () => {
    let url = "";
    try {
        if (listOption.value === "entrance") {
            url = `${import.meta.env.VITE_API_URL}/shiftReceived/${props.shift.ref_shift}`;
        } else if (listOption.value === "repaired") {
            url = `${import.meta.env.VITE_API_URL}/shiftRepaired/${props.shift.ref_shift}`;
        } else if (listOption.value === "delivery") {
            url = `${import.meta.env.VITE_API_URL}/shiftDelivery/${props.shift.ref_shift}`;
        } else if (listOption.value === "sales") {
            url = `${import.meta.env.VITE_API_URL}/shiftSales/${props.shift.ref_shift}`;
        } else if (listOption.value === "outs") {
            url = `${import.meta.env.VITE_API_URL}/shiftOuts/${props.shift.ref_shift}`;
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
      <span>{{ workerName }}</span>
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
  z-index: 10;
}
.info-div > :first-child {
  color: var(--base);
  text-transform: uppercase;
}

.container h2 {
  color: var(--base);
  letter-spacing: 3px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  font-weight: bold;
}

.info-div {
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: var(--secondTwo);
  font-weight: bold;
}

.info-div span:first-child {
  color: var(--base);
  text-transform: uppercase;
}

.list-options {
  width: 100%;
  padding: 10px;
  display: flex;
  justify-content: space-around;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 2px 8px rgba(0,0,0,0.15);
}

.check-input {
  display: none;
}

.check-label {
  cursor: pointer;
  border-radius: 8px;
  background-color: var(--second);
  border: 2px solid var(--base);
  padding: 10px 20px;
  transition: 0.3s ease;
  font-weight: bold;
  text-transform: capitalize;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.check-input:checked + .check-label {
  background-color: var(--base);
  border: 2px solid white;
  color: white;
  transform: scale(1.1);
  box-shadow: 0px 2px 8px rgba(0,0,0,0.15);
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
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0,0,0,0.15);
  color: white;
  transition: 0.3s ease;
  font-weight: bold;
  cursor: pointer;
}

.close-btn:hover {
  transform: scale(1.1);
}

@media (min-width: 768px) {
  * {
    font-size: 1.1rem;
  }

  .container {
    width: 60%;
  }
}

@media (min-width: 1024px) {
  .container {
    width: 40%;
  }
}
</style>
