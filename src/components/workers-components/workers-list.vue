<script>
import { inject, ref, onMounted } from "vue";
import axios from "axios";

export default {
  setup() {
    const workerRole = inject("workerRole", ref(null));
    const loggedCompany = inject("loggedCompany", ref(null));
    const workerToInactive = ref(null);
    const workerToReactive = ref(null);
    const showDeleteWindow = ref(false);
    const showReactive = ref(false);
    const showDownloadWindow = ref(false);
    const workerToDownload = ref(null);
    const showAlert = inject("showAlert");


    const switchSDW = (document) => {
      showDeleteWindow.value = !showDeleteWindow.value;
      workerToInactive.value = document;
    };

    const switchSRW = (document) => {
      showReactive.value = !showReactive.value;
      workerToReactive.value = document;
    };

    const switchSDownload = (document) => {
      showDownloadWindow.value = !showDownloadWindow.value;
      workerToDownload.value = document;
    };

    const workers = ref([]);

    onMounted(async () => {
      await fetchWorkers();
    });

    const fetchWorkers = async () => {
      try {
        const answer = await axios.get(
          `${import.meta.env.VITE_API_URL}/collaborators/${loggedCompany.value}/workers`
        );
        workers.value = answer.data;
        console.log(workers.value);
      } catch (error) {
        console.error(error);
      }
    };

    const inactiveWorker = async (document) => {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/inactiveCollaborators/${loggedCompany.value}/${document}`
        );
        await fetchWorkers();
        showDeleteWindow.value = false;
        workerToInactive.value = null;
      } catch (error) {
        console.error(error.response && error.response.data);
        showAlert("2", `Error al Desactivar el colaborador: ${error.response.data.detail}`);
      }
    };

    const reactiveWorker = async (document) => {
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/reactiveCollaborators/${loggedCompany.value}/${document}`
        );
        await fetchWorkers();
        showReactive.value = false;
        workerToReactive.value = null;
      } catch (error) {
        console.error("Error reactivando al trabajador:", error.data);
        alert("Error al reactivar al trabajador.");
      }
    };

    const downloadWorkerData = async (document) => {
      try {
        // Obtener turnos del trabajador
        const shiftsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/worker/${document}/${loggedCompany.value}/shifts`);
        const shifts = shiftsResponse.data;
        
        // Obtener facturas del trabajador
        const billsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/worker/${document}/${loggedCompany.value}/bills`);
        const bills = billsResponse.data;
        
        // Crear un objeto con toda la información
        const workerData = {
          shifts,
          bills
        };
        
        // Convertir a JSON y crear un archivo para descargar
        const dataStr = JSON.stringify(workerData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = window.URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `worker_${document}_data.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        showDownloadWindow.value = false;
        workerToDownload.value = null;
      } catch (error) {
        console.error("Error descargando datos del trabajador:", error);
        alert("Error al descargar los datos del trabajador.");
      }
    };

    return {
      workers,
      workerRole,
      showDeleteWindow,
      workerToInactive,
      switchSDW,
      inactiveWorker,
      switchSRW,
      reactiveWorker,
      workerToReactive,
      showReactive,
      showDownloadWindow,
      workerToDownload,
      switchSDownload,
      downloadWorkerData
    };
  },
};
</script>

<template>
  <section class="container">
    <h2>Lista de <br />colaboradores</h2>
    <ol class="workers-list">
      <li v-for="worker in workers" :key="worker.document">
        <fieldset class="worker-li" :class="{ active: worker.active, inactive: !worker.active }">
          <legend>{{ worker.wname }}</legend>
          <span>Rol: {{ worker.wrole }}</span>
          <span>Documento: {{ worker.document }}</span>
          <div class="buttons-container">
            <!-- Si el trabajador está activo -->
            <button v-if="worker.active" class="action-btn one" @click="switchSDW(worker.document)">
              <ion-icon name="close-circle" title="Desactivar colaborador"></ion-icon>
            </button>

            <!-- Si el trabajador está inactivo -->
            <button v-if="!worker.active" class="action-btn two" @click="switchSRW(worker.document)">
              <ion-icon name="lock-open" title="Reactivar colaborador"></ion-icon>
            </button>
            
            <!-- Botón para descargar datos del trabajador -->
            <button class="action-btn three" @click="switchSDownload(worker.document)">
              <ion-icon name="download" title="Descargar datos del colaborador"></ion-icon>
            </button>
          </div>
        </fieldset>
      </li>
    </ol>
    <transition name="fade">
      <div class="window" v-if="showDeleteWindow" style="padding: 15px">
        <h3>Desactivar colaborador?</h3>
        <span>
          <button @click="switchSDW()" class="cancel-btn">No</button>
          <button @click="inactiveWorker(workerToInactive)" class="confirm-btn">
            Sí
          </button>
        </span>
      </div>
    </transition>
    <transition name="fade">
      <div class="window" v-if="showReactive" style="padding: 15px">
        <h3>Reactivar colaborador?</h3>
        <span>
          <button @click="switchSRW()" class="cancel-btn">No</button>
          <button @click="reactiveWorker(workerToReactive)" class="confirm-btn">
            Sí
          </button>
        </span>
      </div>
    </transition>
    <transition name="fade">
      <div class="window" v-if="showDownloadWindow" style="padding: 15px">
        <h3>Descargar datos del colaborador?</h3>
        <span>
          <button @click="switchSDownload()" class="cancel-btn">No</button>
          <button @click="downloadWorkerData(workerToDownload)" class="confirm-btn">
            Sí
          </button>
        </span>
      </div>
    </transition>
    <router-link to="/workers/new-worker" class="add-btn" title="Añadir colaboradores" v-if="workerRole === 'Administrador' || workerRole === 'Gerente'">
      <ion-icon name="add-circle"></ion-icon>
    </router-link>
  </section>
</template>

<style scoped>
.container,
.window {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 5px;
  width: 80%;
  border-radius: 10px;
  background: var(--second);
  box-shadow: -25px -25px 51px #242424, 25px 25px 51px #484848;
  border: 4px solid var(--base);
  max-height: 80%;
  overflow: scroll;
  scrollbar-width: none;
}


.window span {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
}

.window button {
  all: unset;
  padding: 10px 20px;
  border-radius: 5px;
  border: 2px solid var(--base);
  color: white;
  cursor: pointer;
  transition: all .3s ease;
}

button:hover {
  scale: 1.1;
}

button.cancel-btn {
  background-color: var(--base);
}

.container h2,
.window h3 {
  color: white;
  text-transform: uppercase;
  font-size: 1.3rem;
  text-align: center;
  letter-spacing: 2px;
}

.workers-list {
  list-style: none;
  padding: 0;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 90%;
}

.worker-li {
  border: 2px solid var(--secondTwo);
  background-color: var(--secondThree);
  border-radius: 5px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}
.worker-li.active {
  border-color: var(--successColor);
}

.worker-li.inactive {
  border-color: var(--errorColor);
}

.worker-li legend {
  background-color: var(--secondThree);
  border-radius: 5px;
  padding: 2px 8px;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.worker-li span {
  color: var(--secondTwo);
  font-size: 1rem;
}

.buttons-container {
  display: flex;
  gap: 5px;
  margin-left: auto;
}

.action-btn {
  padding: 2px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}
.action-btn.one{
  background-color: var(--errorColor);
}
.action-btn.two{
  background-color: var(--successColor);
}
.action-btn.three{
  background-color: var(--base);
}

.action-btn ion-icon {
  color: white;
  font-size: 1.5rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.add-btn {
  position: absolute;
  left: 10px;
  top: 10px;
  color: white;
  font-size: 2rem;
}

@media (min-width: 1024px) {
  .container {
    width: 50%;
  }
}
</style>
