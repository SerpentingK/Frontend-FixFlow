<script>
import { inject, onMounted, provide, ref, computed } from "vue";
import router from "@/routers/routes";
import axios from "axios";
import * as XLSX from 'xlsx';

export default {
  setup() {
    const workersCount = inject("workersCount", ref(0));
    const loggedCompany = inject("loggedCompany", ref(null));
    const loggedWorker = inject("loggedWorker", ref(null));
    const workerRole = inject("workerRole");
    const showAlert = inject("showAlert");
    const totalInCash = inject("totalInCash", ref(0));
    const defaultColor = inject("defaultColor");
    const selectedColor = inject("selectedColor");
    const getCompanyColor = inject("getCompanyColor");    
    const numberCompany = inject("numberCompany", ref(0));
    const nitCompany = ref(""); // Nuevo ref para el NIT
    const premisesCount = inject("premisesCount", ref(0));
    const showPhoneModal = ref(false);
    const showNitModal = ref(false); // Nuevo modal para NIT
    const newPhoneNumber = ref("");
    const newNitNumber = ref(""); // Nuevo ref para editar NIT

    const getWorkersCount = async () => {
      try {
        if (loggedCompany.value) {
          const answer = await axios.get(
            `${import.meta.env.VITE_API_URL}/company/${loggedCompany.value}/count`
          );
          workersCount.value = answer.data.count;
        }
      } catch (error) {
        console.error("Error al obtener el conteo de trabajadores", error);
      }
    };

    const getPremisesCount = async () => {
      try {
        if (loggedCompany.value) {
          const answer = await axios.get(
            `${import.meta.env.VITE_API_URL}/premises/${loggedCompany.value}/count`
          );
          premisesCount.value = answer.data.count;
        }
      } catch (error) {
        console.error("Error al obtener el conteo de locales", error);
      }
    };

    const getWorkerNumber = async () => {
      try {
        if (loggedCompany.value) {
          const answer = await axios.get(
            `${import.meta.env.VITE_API_URL}/company/${loggedCompany.value}/number`
          );
          numberCompany.value = answer.data.number;
        }
      } catch (error) {
        console.error("Error al obtener el numero de la empresa", error);
      }
    };

    // Nueva función para obtener el NIT de la empresa
    const getCompanyNit = async () => {
      try {
        if (loggedCompany.value) {
          const answer = await axios.get(
            `${import.meta.env.VITE_API_URL}/company/${loggedCompany.value}/nit`
          );
          nitCompany.value = answer.data.nit;
        }
      } catch (error) {
        console.error("Error al obtener el NIT de la empresa", error);
      }
    };

    const isColorTooLight = (color) => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 200;
    };

    const updateColor = async () => {
      try {
        if (isColorTooLight(selectedColor.value)) {
          showAlert("2", "Este color es demasiado claro. Por favor, elige un color más oscuro.");
          return;
        }
        const encodedColor = encodeURIComponent(selectedColor.value);
        await axios.put(
          `${import.meta.env.VITE_API_URL}/company/${loggedCompany.value}/baseColor/${encodedColor}`
        );
        resetColor(selectedColor.value);
      } catch (error) {
        console.error("Error al actualizar color", error);
      }
    };

    const resetColor = (color) => {
      document.documentElement.style.setProperty("--base", color);
      localStorage.setItem("baseOrange", color);
      window.location.reload();
    };

    provide("resetColor", resetColor);

    onMounted(() => {
      getWorkersCount();
      getCompanyColor();
      getWorkerNumber();
      getCompanyNit(); // Llamar a la nueva función al montar
      getPremisesCount();

      const storedColor = localStorage.getItem("baseOrange");
      if (storedColor) {
        document.documentElement.style.setProperty("--base", storedColor);
        selectedColor.value = storedColor;
      }
    });

    const closeCompany = () => {
      if (loggedWorker.value != null) {
        showAlert("2", "Se debe cerrar turno para cerrar sesión.");
      } else {
        localStorage.removeItem("loggedCompany");
        localStorage.removeItem("premiseCount");
        resetColor(defaultColor.value);
        loggedCompany.value = null;
        router.push("/loginCompany");
      }
    };

    const downloadExcel = async () => {
      try {
        const billsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/someDataOfBill/${loggedCompany.value}`);
        const bills = billsResponse.data;

        const shiftsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/allShiftCompany/${loggedCompany.value}`);
        const shifts = shiftsResponse.data;

        const wb = XLSX.utils.book_new();

        const billsData = bills.map(bill => ({
          'Número de Factura': bill.bill_number,
          'Cliente': bill.client_name,
          'Teléfono': bill.client_phone,
          'Fecha': bill.entry_date,
          'Total': bill.total_price,
          'Técnico': bill.wname
        }));
        const billsWS = XLSX.utils.json_to_sheet(billsData);
        XLSX.utils.book_append_sheet(wb, billsWS, "Facturas");

        const shiftsData = shifts.map(shift => ({
          'Referencia': shift.ref_shift,
          'Técnico': shift.id,
          'Fecha': shift.date_shift,
          'Hora Inicio': shift.start_time,
          'Hora Fin': shift.finish_time,
          'Total Recibido': shift.total_received,
          'Ganancia': shift.total_gain,
          'Salidas': shift.total_outs
        }));
        const shiftsWS = XLSX.utils.json_to_sheet(shiftsData);
        XLSX.utils.book_append_sheet(wb, shiftsWS, "Turnos");

        XLSX.writeFile(wb, `${loggedCompany.value}_reporte_${new Date().toISOString().split('T')[0]}.xlsx`);
        
        showAlert("1", "Reporte descargado exitosamente");
      } catch (error) {
        console.error("Error al generar el reporte:", error);
        showAlert("2", "Error al generar el reporte");
      }
    };

    const updatePhoneNumber = async () => {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/company/${loggedCompany.value}/number/${newPhoneNumber.value}`);
        numberCompany.value = newPhoneNumber.value;
        showPhoneModal.value = false;
        showAlert("1", "Número de teléfono actualizado exitosamente");
      } catch (error) {
        console.error("Error al actualizar el número de teléfono", error);
        showAlert("2", "Error al actualizar el número de teléfono");
      }
    };

    // Nueva función para actualizar el NIT
    const updateNitNumber = async () => {
      try {
        await axios.put(`${import.meta.env.VITE_API_URL}/company/${loggedCompany.value}/nit/${newNitNumber.value}`);
        nitCompany.value = newNitNumber.value;
        showNitModal.value = false;
        showAlert("1", "NIT actualizado exitosamente");
      } catch (error) {
        console.error("Error al actualizar el NIT", error);
        showAlert("2", "Error al actualizar el NIT");
      }
    };

    return {
      loggedCompany,
      workersCount,
      closeCompany,
      totalInCash,
      selectedColor,
      updateColor,
      workerRole,
      downloadExcel,
      numberCompany,
      nitCompany, // Añadir al return
      showPhoneModal,
      showNitModal, // Añadir al return
      newPhoneNumber,
      newNitNumber, // Añadir al return
      updatePhoneNumber,
      updateNitNumber // Añadir al return
    };
  },
};
</script>

<template>
  <section class="session-cont">
    <div class="info-container">
      <h3>{{ loggedCompany }}</h3>

      <div class="info-cont">
        <div>Número de trabajadores:</div>
        <div>{{ workersCount }}</div>
      </div>

      <div class="info-cont">
        <div>Teléfono:</div>
        <div>{{ numberCompany }}</div>
        <button class="edit-btn" @click="showPhoneModal = true" v-if="workerRole === 'Gerente'">Editar</button>
      </div>

      <!-- Nuevo campo para NIT -->
      <div class="info-cont">
        <div>NIT:</div>
        <div>{{ nitCompany || 'No registrado' }}</div>
        <button class="edit-btn" @click="showNitModal = true" v-if="workerRole === 'Gerente'">Editar</button>
      </div>
    </div>

    <div class="color-picker" v-if="workerRole === 'Gerente'">
      <label for="color">Selecciona un color:</label>
      <input type="color" id="color" v-model="selectedColor" />
    </div>

    <button class="apply-color-btn" @click="updateColor">Aplicar Color</button>
    <button class="download-btn" @click="downloadExcel">
      <ion-icon name="download"></ion-icon>
      Descargar Reporte
    </button>
    <button class="close-btn" @click="closeCompany">Cerrar Sesión</button>

    <!-- Modal para editar teléfono -->
    <div v-if="showPhoneModal" class="modal-overlay" @click="showPhoneModal = false">
      <div class="modal-content" @click.stop>
        <h3>Editar Número de Teléfono</h3>
        <input 
          type="tel" 
          v-model="newPhoneNumber" 
          placeholder="Ingrese el nuevo número"
          class="modal-input"
        />
        <div class="modal-buttons">
          <button class="cancel-btn" @click="showPhoneModal = false">Cancelar</button>
          <button class="save-btn" @click="updatePhoneNumber">Guardar</button>
        </div>
      </div>
    </div>

    <!-- Nuevo modal para editar NIT -->
    <div v-if="showNitModal" class="modal-overlay" @click="showNitModal = false">
      <div class="modal-content" @click.stop>
        <h3>Editar NIT</h3>
        <input 
          type="text" 
          v-model="newNitNumber" 
          placeholder="Ingrese el nuevo NIT"
          class="modal-input"
        />
        <div class="modal-buttons">
          <button class="cancel-btn" @click="showNitModal = false">Cancelar</button>
          <button class="save-btn" @click="updateNitNumber">Guardar</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.session-cont {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 500px;
  padding: 2rem;
  border-radius: 1rem;
  background: var(--second);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 4px solid var(--base);
  overflow-y: auto;
  scrollbar-width: none;
}

.info-container {
  width: 100%;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-container h3 {
  color: var(--base);
  font-size: 1.5rem;
  text-align: center;
  margin: 0;
  font-weight: bolder;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.info-cont {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 1rem;
}

.edit-btn {
  background: var(--base);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: var(--secondTwo);
  transform: translateY(-2px);
}

.edit-btn:active {
  transform: scale(0.95);
}

.color-picker {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
}

.color-picker label {
  color: white;
  font-size: 1rem;
}

.color-picker input {
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 0;
}

.apply-color-btn, .close-btn, .download-btn {
  background: var(--base);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.apply-color-btn{
  background: none;
  border: 2px solid var(--base);
}

.apply-color-btn:hover, .close-btn:hover, .download-btn:hover {
  background: var(--secondTwo);
  transform: translateY(-2px);
}

.apply-color-btn:active, .close-btn:active, .download-btn:active {
  transform: scale(0.95);
}

.download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.download-btn ion-icon {
  font-size: 1.25rem;
}

/* Estilos para los modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--second);
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 4px solid var(--base);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-content h3 {
  color: white;
  font-size: 1.5rem;
  text-align: center;
  margin: 0;
  font-weight: 500;
  letter-spacing: 1px;
}

.modal-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

.modal-input:focus {
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 2px var(--base);
}

.modal-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-btn, .save-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.save-btn {
  background: var(--base);
  color: white;
}

.cancel-btn:hover, .save-btn:hover {
  transform: translateY(-2px);
}

.cancel-btn:active, .save-btn:active {
  transform: scale(0.95);
}

@media (min-width: 768px) {
  .session-cont {
    width: 80%;
    max-width: 600px;
  }

  .info-container h3 {
    font-size: 1.75rem;
  }

  .info-cont {
    font-size: 1.1rem;
  }
}

@media (min-width: 1024px) {
  .session-cont {
    width: 70%;
    max-width: 500px;
    max-height: 70vh;
  }
}

@media (min-width: 1280px) {
  .session-cont {
    width: 40%;
    max-width: 450px;
  }

  .modal-content {
    width: 40%;
    max-width: 450px;
  }
}
</style>