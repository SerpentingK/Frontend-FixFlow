<script>
import { inject, onMounted, provide, ref } from "vue";
import router from "@/routers/routes";
import axios from "axios";
import * as XLSX from 'xlsx';
import { plans } from '@/data/plans';
import SubscriptionPlans from './subscription-plans.vue';

export default {
  components: {
    SubscriptionPlans
  },
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
    const nitCompany = inject("nitCompany", ref("")); // Nuevo ref para el NIT
    const premisesCount = inject("premisesCount", ref(0));
    const showPhoneModal = ref(false);
    const showNitModal = ref(false); // Nuevo modal para NIT
    const newPhoneNumber = ref("");
    const newNitNumber = ref(""); // Nuevo ref para editar NIT
    const showPlansModal = ref(false);
    const currentPlan = ref(null);

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
      getCurrentPlan();

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
        localStorage.clear();
        router.push("/loginCompany");
      }
    };

    const downloadExcel = async () => {
      try {
        // Get all premises for the company
        const premisesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/getPremisesCompany/${loggedCompany.value}`);
        const premises = premisesResponse.data;

        console.log("Locales obtenidos:", premises);

        if (!premises || premises.length === 0) {
          showAlert("2", "No se encontraron locales para esta empresa");
          return;
        }

        // Validar la estructura de los datos de los locales
        const validPremises = premises.filter(premise => {
          const isValid = premise && premise.ref_premises && premise.name;
          if (!isValid) {
            console.error("Local con estructura inválida:", premise);
          }
          return isValid;
        });

        console.log("Locales válidos a procesar:", validPremises);

        if (validPremises.length === 0) {
          showAlert("2", "No se encontraron locales válidos para procesar");
          return;
        }

        const wb = XLSX.utils.book_new();
        let hasData = false;

        // Process each premise
        for (const premise of validPremises) {
          try {
            console.log(`Iniciando procesamiento del local: ${premise.name} (ID: ${premise.ref_premises})`);

            let bills = [];
            try {
              // Get bills for the premise
              const billsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/someDataOfBill/${premise.ref_premises}/excel`);
              bills = billsResponse.data || [];
              console.log(`Facturas obtenidas para ${premise.name}: ${bills.length}`);
            } catch (billError) {
              console.log(`No se encontraron facturas para el local ${premise.name}`);
            }

            let shifts = [];
            try {
              // Get shifts for the premise
              const shiftsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/allShiftCompanyPremises/excel/${premise.ref_premises}`);
              shifts = shiftsResponse.data || [];
              console.log(`Turnos obtenidos para ${premise.name}: ${shifts.length}`);
            } catch (shiftError) {
              console.log(`No se encontraron turnos para el local ${premise.name}`);
            }

            let vaultRecords = [];
            try {
              // Get vault records for the premise
              const vaultResponse = await axios.get(`${import.meta.env.VITE_API_URL}/someDataOutVault/${premise.ref_premises}`);
              vaultRecords = vaultResponse.data || [];
              console.log(`Registros de caja obtenidos para ${premise.name}: ${vaultRecords.length}`);
            } catch (vaultError) {
              console.log(`No se encontraron registros de caja para el local ${premise.name}`);
            }

            // Get sales for the premise
            let sales = [];
            try {
              const salesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/allSalesPremises/${premise.ref_premises}`);
              sales = salesResponse.data || [];
              console.log(`Ventas obtenidas para ${premise.name}: ${sales.length}`);
            } catch (salesError) {
              console.log(`No se encontraron ventas para el local ${premise.name}`);
            }

            // Get outflows for the premise
            let outflows = [];
            try {
              const outflowsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/allOutflowsPremises/${premise.ref_premises}`);
              outflows = outflowsResponse.data || [];
              console.log(`Gastos obtenidos para ${premise.name}: ${outflows.length}`);
            } catch (outflowsError) {
              console.log(`No se encontraron gastos para el local ${premise.name}`);
            }

            // Create sheets for each premise
            const premiseName = premise.name || `Local_${premise.ref_premises}`;

            // Data of bills
            if (bills && bills.length > 0) {
              const billsData = bills.map(bill => ({
                'Número de Factura': bill.bill_number || '',
                'Cliente': bill.client_name || '',
                'Teléfono': bill.client_phone || '',
                'Fecha': bill.entry_date || '',
                'Total': bill.total_price || 0,
                'Técnico': bill.wname || ''
              }));
              const billsWS = XLSX.utils.json_to_sheet(billsData);
              XLSX.utils.book_append_sheet(wb, billsWS, `${premiseName}_Facturas`);
              hasData = true;
            }

            // Shifts data
            if (shifts && shifts.length > 0) {
              // Obtener los nombres de los técnicos para cada turno
              const shiftsWithNames = await Promise.all(
                shifts.map(async (shift) => {
                  try {
                    // Extraer el documento del ID del turno
                    let workerDocument;
                    if (shift.document) {
                      workerDocument = shift.document;
                    } else if (shift.id) {
                      if (!isNaN(shift.id)) {
                        workerDocument = shift.id;
                      } else {
                        workerDocument = shift.id.split('_')[1];
                      }
                    } else if (shift.ref_shift) {
                      workerDocument = shift.ref_shift.split('_')[1];
                    } else {
                      return {
                        ...shift,
                        worker_name: "Técnico desconocido"
                      };
                    }

                    // Consultar el nombre del técnico
                    const workerResponse = await axios.get(`${import.meta.env.VITE_API_URL}/worker/${workerDocument}/${loggedCompany.value}`);

                    if (workerResponse.data && workerResponse.data.wname) {
                      return {
                        ...shift,
                        worker_name: workerResponse.data.wname
                      };
                    } else {
                      return {
                        ...shift,
                        worker_name: "Técnico desconocido"
                      };
                    }
                  } catch (error) {
                    console.error(`Error al obtener el nombre del técnico para el turno:`, error);
                    return {
                      ...shift,
                      worker_name: "Técnico desconocido"
                    };
                  }
                })
              );

              // Crear hoja de turnos
              const shiftsData = shiftsWithNames.map(shift => ({
                'Referencia': shift.ref_shift ? shift.ref_shift.split('_')[1] || shift.ref_shift : '',
                'Técnico': shift.worker_name || 'Técnico desconocido',
                'Fecha': shift.date_shift || '',
                'Hora Inicio': shift.start_time || '',
                'Hora Fin': shift.finish_time || '',
                'Total Recibido': shift.total_received || 0,
                'Ganancia': shift.total_gain || 0,
                'Salidas': shift.total_outs || 0
              }));
              const shiftsWS = XLSX.utils.json_to_sheet(shiftsData);
              XLSX.utils.book_append_sheet(wb, shiftsWS, `${premiseName}_Turnos`);
              hasData = true;
            }

            // Vault records data
            if (vaultRecords && vaultRecords.length > 0) {
              const vaultData = vaultRecords.map(record => ({
                'Fecha': record.date || '',
                'Usuario': record.wname || '',
                'Cantidad Retirada': record.quantity || 0,
              }));
              const vaultWS = XLSX.utils.json_to_sheet(vaultData);
              XLSX.utils.book_append_sheet(wb, vaultWS, `${premiseName}_Caja`);
              hasData = true;
            }

            // Sales data for this premise
            if (sales && sales.length > 0) {
              const salesData = sales.map(sale => ({
                'Referencia': sale.ref_delivery || '',
                'Fecha': sale.date_shift || '',
                'Producto': sale.product || '',
                'Venta': sale.sale || 0,
                'Precio Original': sale.original_price || 0,
                'Precio de Ingreso': sale.revenue_price || 0,
                'Técnico': sale.wname || ''
              }));
              const salesWS = XLSX.utils.json_to_sheet(salesData);
              XLSX.utils.book_append_sheet(wb, salesWS, `${premiseName}_Ventas`);
              hasData = true;
            }

            // Outflows data for this premise
            if (outflows && outflows.length > 0) {
              const outflowsData = outflows.map(outflow => ({
                'Referencia': outflow.ref_outflow || '',
                'Fecha': outflow.date_shift || '',
                'Precio': outflow.price || 0,
                'Detalles': outflow.details || '',
                'Técnico': outflow.wname || ''
              }));
              const outflowsWS = XLSX.utils.json_to_sheet(outflowsData);
              XLSX.utils.book_append_sheet(wb, outflowsWS, `${premiseName}_Gastos`);
              hasData = true;
            }
          } catch (premiseError) {
            console.error(`Error al procesar el local ${premise.name || premise.ref_premises}:`, premiseError);
            console.error("Detalles del error:", {
              premiseId: premise.ref_premises,
              premiseName: premise.name,
              errorMessage: premiseError.message,
              errorResponse: premiseError.response?.data
            });
            showAlert("2", `Error al procesar datos del local ${premise.name || premise.ref_premises}`);
          }
        }

        if (!hasData) {
          showAlert("2", "No se encontraron datos para generar el reporte");
          return;
        }

        XLSX.writeFile(wb, `${loggedCompany.value}_reporte_${new Date().toISOString().split('T')[0]}.xlsx`);
        showAlert("1", "Reporte descargado exitosamente");
      } catch (error) {
        console.error("Error al generar el reporte:", error);
        showAlert("2", "Error al generar el reporte. Por favor, intente nuevamente");
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
        await axios.put(`${import.meta.env.VITE_API_URL}/changeNit/${loggedCompany.value}/${newNitNumber.value}`);
        nitCompany.value = newNitNumber.value;
        showNitModal.value = false;
        showAlert("1", "NIT actualizado exitosamente");
      } catch (error) {
        console.error("Error al actualizar el NIT", error);
        showAlert("2", "Error al actualizar el NIT");
      }
    };

    // Añadir función para obtener el plan actual
    const getCurrentPlan = async () => {
      try {
        if (loggedCompany.value) {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/company/${loggedCompany.value}/plan`
          );
          currentPlan.value = plans.find(p => p.id === response.data.planId);
        }
      } catch (error) {
        console.error("Error al obtener el plan actual", error);
      }
    };

    const handlePlanSelection = async (plan) => {
      if (plan.id === 3) {
        showAlert("2", "El Plan Premium no está disponible en este momento");
        return;
      }
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/company/${loggedCompany.value}/plan/${plan.id}`
        );
        currentPlan.value = plan;
        showPlansModal.value = false;
        showAlert("1", "Plan actualizado exitosamente");
      } catch (error) {
        console.error("Error al actualizar el plan", error);
        showAlert("2", "Error al actualizar el plan");
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
      updateNitNumber, // Añadir al return
      showPlansModal,
      currentPlan,
      handlePlanSelection
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

      <!-- Añadir información del plan actual -->
      <div class="info-cont plan-info">
        <div>Plan Actual:</div>
        <div class="current-plan">
          <span>{{ currentPlan?.name || 'No definido' }}</span>
          <button class="change-plan-btn" @click="showPlansModal = true" v-if="workerRole === 'Gerente'">
            Cambiar Plan
          </button>
        </div>
      </div>
    </div>

    <div class="color-picker" v-if="workerRole === 'Gerente'">
      <label for="color">Selecciona un color:</label>
      <input type="color" id="color" v-model="selectedColor" />
    </div>

    <button class="apply-color-btn" @click="updateColor" v-if="workerRole === 'Gerente'">Aplicar Color</button>
    <button class="download-btn" @click="downloadExcel" v-if="workerRole === 'Gerente'">
      <ion-icon name="download"></ion-icon>
      Descargar Reporte
    </button>
    <button class="close-btn" @click="closeCompany">Cerrar Sesión</button>

  </section>

  <!-- Modal para editar teléfono -->
  <div v-if="showPhoneModal" class="modal-overlay" @click="showPhoneModal = false">
    <div class="modal-content" @click.stop>
      <h3>Editar Número de Teléfono</h3>
      <input type="tel" v-model="newPhoneNumber" placeholder="Ingrese el nuevo número" class="modal-input" />
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
      <input type="text" v-model="newNitNumber" placeholder="Ingrese el nuevo NIT" class="modal-input" />
      <div class="modal-buttons">
        <button class="cancel-btn" @click="showNitModal = false">Cancelar</button>
        <button class="save-btn" @click="updateNitNumber">Guardar</button>
      </div>
    </div>
  </div>
  <!-- Modal de Planes -->
  <Teleport to="body">
    <SubscriptionPlans v-if="showPlansModal" @planSelected="handlePlanSelection" @close="showPlansModal = false" />
  </Teleport>
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
  z-index: 1;
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

.apply-color-btn,
.close-btn,
.download-btn {
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

.apply-color-btn {
  background: none;
  border: 2px solid var(--base);
}

.apply-color-btn:hover,
.close-btn:hover,
.download-btn:hover {
  background: var(--secondTwo);
  transform: translateY(-2px);
}

.apply-color-btn:active,
.close-btn:active,
.download-btn:active {
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
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: var(--second);
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 4px solid var(--base);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content h3 {
  color: white;
  font-size: 1.5rem;
  text-align: center;
  margin: 0;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.modal-input {
  width: 90%;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1.1rem;
  outline: none;
  transition: all 0.3s ease;
}

.modal-input:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: var(--base);
  box-shadow: 0 0 0 3px rgba(var(--base-rgb), 0.2);
}

.modal-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
  font-size: 1rem;
}

.modal-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.cancel-btn,
.save-btn {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.save-btn {
  background: var(--base);
  color: white;
}

.cancel-btn:hover,
.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.cancel-btn:active,
.save-btn:active {
  transform: scale(0.98);
}

@media (max-width: 480px) {
  .modal-content {
    padding: 1.5rem;
    width: 95%;
  }

  .modal-content h3 {
    font-size: 1.25rem;
  }

  .modal-input {
    padding: 0.875rem 1rem;
    font-size: 1rem;
  }

  .modal-buttons {
    flex-direction: column;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
    padding: 0.75rem 1.25rem;
  }
}

@media (min-width: 768px) {
  .modal-content {
    padding: 2.5rem;
  }

  .modal-content h3 {
    font-size: 1.75rem;
  }

  .modal-input {
    padding: 1.25rem 1.5rem;
    font-size: 1.2rem;
  }
}

@media (min-width: 1024px) {
  .modal-content {
    max-width: 450px;
  }
}

.plan-info {
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.current-plan {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.change-plan-btn {
  background: var(--base);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.change-plan-btn:hover {
  background: var(--secondTwo);
  transform: translateY(-2px);
}

.change-plan-btn:active {
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

:deep(.plans-modal) {
  z-index: 1100;
}
</style>