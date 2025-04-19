<script>
import { inject, ref, onMounted } from 'vue';
import axios from 'axios';  
import * as XLSX from 'xlsx';

export default {
    setup() {
        const switchSLP = inject("switchSLP");
        const premisesCount = inject("premisesCount");
        const workerRole = inject("workerRole")
        const selectedPremise = inject("selectedPremise");
        const selectedPremiseId = inject("selectedPremiseId");
        const switchSVI = inject("switchSVI");
        const switchSAPM = inject("switchSAPM");
        const loggedCompany = inject("loggedCompany");
        const showAlert = inject("showAlert");
        const premises = ref([]);
        const loggedWorker = inject("loggedWorker");
        const startShift = inject("startShift");
        const shiftPremise = ref(null);
        const selectedPremiseForReport = ref(null);

        // Estados para los modales
        const showLogoutModal = ref(false);
        const showEditModal = ref(false);
        const showDeactivateModal = ref(false);
        const showActivateModal = ref(false);
        const showDownloadModal = ref(false);
        const currentPremiseId = ref(null);
        const editForm = ref({
            name: '',
            address: ''
        });

        const switchSLM = () => {
            showLogoutModal.value = !showLogoutModal.value;
        }

        const loadPremises = async () => {
            const answer = await axios.get(`${import.meta.env.VITE_API_URL}/someDataOfPremises/${loggedCompany.value}`);
            premises.value = answer.data;
        }
    
        const editPremise = (id, name, address) => {
            if(name === selectedPremise.value){
                showAlert("2", "No puedes editar el local activo");
                return;
            }
            currentPremiseId.value = id;
            editForm.value = {
                name: name,
                address: address
            };
            showEditModal.value = true;
        };

        const saveEditPremise = async () => {
            try {
                const answer = await axios.put(`${import.meta.env.VITE_API_URL}/editPremises`, {
                    ref_premises: currentPremiseId.value,
                    name: editForm.value.name,
                    address: editForm.value.address
                });
                
                if (answer.data.status === "Local editado correctamente") {
                    showAlert("1", "Local actualizado correctamente");
                    showEditModal.value = false;
                    // Recargar la lista de locales
                    await loadPremises();
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    // Si el error viene del backend con un mensaje específico
                    showAlert("2", `Error al actualizar el local: ${error.response.data.detail || error.response.data.message || 'Error desconocido'}`);
                } else {
                    // Si es un error de red u otro tipo
                    showAlert("2", "Error al conectar con el servidor. Por favor, inténtalo de nuevo.");
                }
                console.error("Error al editar local:", error);
            }
        };

        const deactivatePremise = (id) => {
            // Verificar si el local está seleccionado (técnico con sesión activa)
            if (selectedPremise.value && selectedPremiseId.value === id) {
                showAlert("1", "Primero debes cerrar la sesión del técnico antes de desactivar el local");
                showLogoutModal.value = true;
                return;
            }
            
            currentPremiseId.value = id;
            showDeactivateModal.value = true;
        };

        const activatePremise = (id) => {
            currentPremiseId.value = id;
            showActivateModal.value = true;
        };

        const confirmDeactivate = async () => {
            try {
                const answer = await axios.put(`${import.meta.env.VITE_API_URL}/incativePremises/${currentPremiseId.value}`);
                if (answer.data.status === "Local desactivado correctamente") {
                    showAlert("1", "Local desactivado correctamente");
                    showDeactivateModal.value = false;
                    await loadPremises();
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    showAlert("2", `Error al desactivar el local: ${error.response.data.detail || error.response.data.message || 'Error desconocido'}`);
                } else {
                    showAlert("2", "Error al conectar con el servidor. Por favor, inténtalo de nuevo.");
                }
                console.error("Error al desactivar local:", error);
            }
        };

        const confirmActivate = async () => {
            try {
                const answer = await axios.put(`${import.meta.env.VITE_API_URL}/activePremises/${currentPremiseId.value}`);
                if (answer.data.status === "Local activado correctamente") {
                    showAlert("1", "Local activado correctamente");
                    showActivateModal.value = false;
                    await loadPremises();
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    showAlert("2", `Error al activar el local: ${error.response.data.detail || error.response.data.message || 'Error desconocido'}`);
                } else {
                    showAlert("2", "Error al conectar con el servidor. Por favor, inténtalo de nuevo.");
                }
                console.error("Error al activar local:", error);
            }
        };

        const confirmLogout = () => {
            if(!loggedWorker.value){ 
                localStorage.removeItem("activePremise");
                // Actualizar las variables reactivas
                selectedPremise.value = null;
                selectedPremiseId.value = 0;
                switchSLM();
            } else {
                showAlert("2", "Primero debes cerrar el turno iniciado en el local");
                showLogoutModal.value = false;
            }
        };

        const checkShiftPremise = async () => { 
            const answer = await axios.get(`${import.meta.env.VITE_API_URL}/shift/premises/${startShift.value}`);
            shiftPremise.value = answer.data.Local;
        }

        const addPremiseToShift = async () => {
            try {
                await axios.put(`${import.meta.env.VITE_API_URL}/shift/addpremise`, {
                    ref_shift: startShift.value,
                    ref_premises: selectedPremiseId.value
                });
                console.log("Premisa asignada al turno correctamente");
            } catch (error) {
                console.error("Error al asignar premisa al turno:", error);
            }
        }

        const downloadPremiseExcel = async (premise) => {
            try {
                if (!premise || !premise.ref_premises) {
                    showAlert("2", "No se pudo identificar el local para generar el reporte");
                    return;
                }

                console.log(`Iniciando descarga de reporte para el local: ${premise.name} (ID: ${premise.ref_premises})`);
                
                const wb = XLSX.utils.book_new();
                let hasData = false;
                const premiseName = premise.name || `Local_${premise.ref_premises}`;

                // Get bills for the premise
                let bills = [];
                try {
                    const billsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/someDataOfBill/${premise.ref_premises}/excel`);
                    bills = billsResponse.data || [];
                    console.log(`Facturas obtenidas para ${premise.name}: ${bills.length}`);
                } catch (billError) {
                    console.log(`No se encontraron facturas para el local ${premise.name}`);
                }

                // Get shifts for the premise
                let shifts = [];
                try {
                    const shiftsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/allShiftCompanyPremises/excel/${premise.ref_premises}`);
                    shifts = shiftsResponse.data || [];
                    console.log(`Turnos obtenidos para ${premise.name}: ${shifts.length}`);
                } catch (shiftError) {
                    console.log(`No se encontraron turnos para el local ${premise.name}`);
                }

                // Get vault records for the premise
                let vaultRecords = [];
                try {
                    const vaultResponse = await axios.get(`${import.meta.env.VITE_API_URL}/someDataOutVault/${premise.ref_premises}`);
                    vaultRecords = vaultResponse.data || [];
                    console.log(`Registros de caja obtenidos para ${premise.name}: ${vaultRecords.length}`);
                } catch (vaultError) {
                    console.log(`No se encontraron registros de caja para el local ${premise.name}`);
                }

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

                // Get sales for the premise
                let sales = [];
                try {
                    const salesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/allSalesPremises/${premise.ref_premises}`);
                    sales = salesResponse.data || [];
                    console.log(`Ventas obtenidas para ${premise.name}: ${sales.length}`);
                } catch (salesError) {
                    console.log(`No se encontraron ventas para el local ${premise.name}`);
                }

                // Sales data
                if (sales && sales.length > 0) {
                    const salesData = sales.map(sale => ({
                        'Referencia': sale.ref_sale || '',
                        'Fecha': sale.date_sale || '',
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

                // Get outflows for the premise
                let outflows = [];
                try {
                    const outflowsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/allOutflowsPremises/${premise.ref_premises}`);
                    outflows = outflowsResponse.data || [];
                    console.log(`Gastos obtenidos para ${premise.name}: ${outflows.length}`);
                } catch (outflowsError) {
                    console.log(`No se encontraron gastos para el local ${premise.name}`);
                }

                // Outflows data
                if (outflows && outflows.length > 0) {
                    const outflowsData = outflows.map(outflow => ({
                        'Referencia': outflow.ref_outflow || '',
                        'Fecha': outflow.date_outflow || '',
                        'Precio': outflow.price || 0,
                        'Detalles': outflow.details || '',
                        'Técnico': outflow.wname || ''
                    }));
                    const outflowsWS = XLSX.utils.json_to_sheet(outflowsData);
                    XLSX.utils.book_append_sheet(wb, outflowsWS, `${premiseName}_Gastos`);
                    hasData = true;
                }

                if (!hasData) {
                    showAlert("2", "No se encontraron datos para generar el reporte de este local");
                    return;
                }

                XLSX.writeFile(wb, `${premiseName}_reporte_${new Date().toISOString().split('T')[0]}.xlsx`);
                showAlert("1", "Reporte descargado exitosamente");
                showDownloadModal.value = false;
            } catch (error) {
                console.error("Error al generar el reporte:", error);
                showAlert("2", "Error al generar el reporte. Por favor, intente nuevamente");
            }
        };

        const openDownloadModal = (premise) => {
            selectedPremiseForReport.value = premise;
            showDownloadModal.value = true;
        };

        onMounted(async () => {
            await loadPremises();
            await checkShiftPremise();
            // Cargar el estado del local activo
            const storedPremise = localStorage.getItem("activePremise");
            if (storedPremise) {
                const premise = JSON.parse(storedPremise);
                selectedPremise.value = premise.name;
                selectedPremiseId.value = premise.id;
                
                // Si hay un ID de premisa seleccionado, enviar petición PUT para añadir el campo ref_premise
                if (shiftPremise.value === null) {
                    await addPremiseToShift();
                }
            }
        });

        return {
            premisesCount,
            switchSLP,
            editPremise,
            deactivatePremise,
            workerRole,
            selectedPremise,
            selectedPremiseId,
            switchSVI,
            showLogoutModal,
            showEditModal,
            showDeactivateModal,
            showActivateModal,
            showDownloadModal,
            editForm,
            saveEditPremise,
            confirmDeactivate,
            confirmActivate,
            confirmLogout,
            switchSAPM,
            premises,
            switchSLM,
            activatePremise,
            openDownloadModal,
            downloadPremiseExcel,
            selectedPremiseForReport
        };
    }
};
</script>

<template>
    <section class="container">
        <h2>Selecciona un local</h2>
        <ol v-if="premises.length > 0" class="premises-list">
            <li v-for="premise in premises" :key="premise.ref_premises">
                <fieldset class="premise-card" :class="{ selected: selectedPremise === premise.name, inactive: !premise.active }">
                    <legend>{{ premise.name }}</legend>
                    <ion-icon name="storefront"></ion-icon>
                    <span>Dirección: {{ premise.address }}</span>
                    <div class="premise-btns">
                        <button v-if="premise.name === selectedPremise" class="action-btn logout" @click="confirmLogout" title="Cerrar Sesion"
                                :class="{ selected: selectedPremise === premise.name }">
                            <ion-icon name="close"></ion-icon>
                        </button>
                        <button v-if="!selectedPremise" class="action-btn login" @click="switchSLP(premise.name, premise.ref_premises)" title="Iniciar sesión"
                            :class="{ selected: selectedPremise === premise.name }">
                            <ion-icon name="log-in-outline"></ion-icon>
                        </button>
                        <button class="action-btn edit" @click="editPremise(premise.ref_premises, premise.name, premise.address)" title="Editar local"
                            v-if="workerRole === 'Gerente'">
                            <ion-icon name="create-outline"></ion-icon>
                        </button>
                        <button class="action-btn deactivate" @click="deactivatePremise(premise.ref_premises)" title="Desactivar local"
                            v-if="workerRole === 'Gerente' && premise.active"
                            :class="{ selected: selectedPremise === premise.name }">
                            <ion-icon name="lock-closed-outline"></ion-icon>
                        </button>
                        <button class="action-btn activate" @click="activatePremise(premise.ref_premises)" title="Activar local"
                            v-if="workerRole === 'Gerente' && !premise.active">
                            <ion-icon name="lock-open-outline"></ion-icon>
                        </button>
                        <button class="action-btn info" @click="switchSVI" title="Info"
                            v-if="workerRole === 'Gerente' || workerRole === 'Administrador'">
                            <ion-icon name="alert-circle"></ion-icon>
                        </button>
                        <button class="action-btn info" @click="openDownloadModal(premise)" title="Descargar Reporte"
                            v-if="workerRole === 'Gerente' || workerRole === 'Administrador'">
                            <ion-icon name="download-outline"></ion-icon>
                        </button>
                    </div>
                </fieldset>
            </li>
        </ol>
        <p v-else class="no-premises-message">No hay locales registrados en el sistema.</p>
    </section>
    <button @click="switchSAPM" class="new-premise-btn">
        <ion-icon name="add-circle-outline"></ion-icon>
    </button>

    <!-- Modal de Cierre de Sesión -->
    <div class="modal" v-if="showLogoutModal">
        <div class="modal-content">
            <h3>Confirmar Cierre de Sesión</h3>
            <p>¿Estás seguro que deseas cerrar sesión en este local?</p>
            <div class="modal-buttons">
                <button @click="confirmLogout" class="confirm-btn">Confirmar</button>
                <button @click="showLogoutModal = false" class="cancel-btn">Cancelar</button>
            </div>
        </div>
    </div>

    <!-- Modal de Edición -->
    <div class="modal" v-if="showEditModal">
        <div class="modal-content">
            <h3>Editar Local</h3>
            <form @submit.prevent="saveEditPremise">
                <div class="form-group">
                    <label for="premiseName">Nombre del Local:</label>
                    <input type="text" id="premiseName" v-model="editForm.name" required>
                </div>
                <div class="form-group">
                    <label for="premiseAddress">Dirección:</label>
                    <input type="text" id="premiseAddress" v-model="editForm.address" required>
                </div>
                <div class="modal-buttons">
                    <button type="submit" class="confirm-btn">Guardar</button>
                    <button type="button" @click="showEditModal = false" class="cancel-btn">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal de Desactivación -->
    <div class="modal" v-if="showDeactivateModal">
        <div class="modal-content">
            <h3>Confirmar Desactivación</h3>
            <p>¿Estás seguro que deseas desactivar este local? Esta acción no se puede deshacer.</p>
            <div class="modal-buttons">
                <button @click="confirmDeactivate" class="confirm-btn">Confirmar</button>
                <button @click="showDeactivateModal = false" class="cancel-btn">Cancelar</button>
            </div>
        </div>
    </div>

    <!-- Modal de Activación -->
    <div class="modal" v-if="showActivateModal">
        <div class="modal-content">
            <h3>Confirmar Activación</h3>
            <p>¿Estás seguro que deseas activar este local?</p>
            <div class="modal-buttons">
                <button @click="confirmActivate" class="confirm-btn">Confirmar</button>
                <button @click="showActivateModal = false" class="cancel-btn">Cancelar</button>
            </div>
        </div>
    </div>

    <!-- Modal de Descarga de Reporte -->
    <div class="modal" v-if="showDownloadModal">
        <div class="modal-content">
            <h3>Descargar Reporte</h3>
            <p>¿Deseas descargar el reporte para el local <strong>{{ selectedPremiseForReport?.name }}</strong>?</p>
            <div class="modal-buttons">
                <button @click="downloadPremiseExcel(selectedPremiseForReport)" class="confirm-btn">Descargar</button>
                <button @click="showDownloadModal = false" class="cancel-btn">Cancelar</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
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

.container h2 {
    color: white;
    text-transform: uppercase;
    font-size: 1.3rem;
    text-align: center;
    letter-spacing: 2px;
    margin-bottom: 15px;
}

.premises-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 90%;
}

.premise-card {
    border: 2px solid var(--secondTwo);
    background-color: var(--secondThree);
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
}

.premise-card.selected {
    background-color: var(--successColor);
}

.premise-card.inactive {
    background-color: var(--secondThree);
    border-color: var(--errorColor);
    opacity: 0.8;
}

.premise-card.inactive span {
    color: var(--errorColor);
}

.premise-card.selected span,
.premise-card.selected ion-icon {
    color: white;
}

.premise-card legend {
    background-color: var(--secondThree);
    border-radius: 5px;
    padding: 2px 8px;
    color: white;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 1rem;
}

.premise-card span {
    color: var(--secondTwo);
    font-size: 1rem;
}

.premise-card ion-icon {
    font-size: 60px;
    color: var(--base);
}

.new-premise-btn {
    all: unset;
    position: absolute;
    bottom: 15px;
    right: 15px;
    background-color: var(--base);
    color: white;
    padding: 10px 15px;
    border-radius: 10px;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.9rem;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: var(--secShadow);
    transition: transform 0.3s;
    text-decoration: none;
    cursor: pointer;
}

.new-premise-btn:hover {
    transform: scale(1.05);
}

.new-premise-btn ion-icon {
    font-size: 1.2rem;
}

.premise-btns {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
}

.action-btn {
    padding: 3px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
}

.action-btn ion-icon {
    color: white;
    font-size: 1.5rem;
}

.action-btn.login {
    background-color: var(--successColor);
}
.login.selected{
    display: none;
}

.action-btn.edit {
    background-color: var(--warningColor);
}
.action-btn.logout {
    background-color: var(--errorColor);
}

.action-btn.deactivate {
    background-color: var(--errorColor);
}

.action-btn.activate {
    background-color: var(--successColor);
}

.action-btn.info {
    background-color: var(--base);
}

.action-btn:hover {
    filter: brightness(1.1);
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: var(--second);
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    border: 2px solid var(--base);
}

.modal-content h3 {
    color: white;
    margin-bottom: 15px;
    text-align: center;
}

.modal-content p {
    color: var(--secondTwo);
    margin-bottom: 20px;
    text-align: center;
}

.modal-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
    flex-direction: row-reverse;
}

.confirm-btn, .cancel-btn {
    padding: 8px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: transform 0.2s;
}

.confirm-btn {
    background-color: var(--base);
    color: white;
}

.cancel-btn {
    background-color: transparent;
    color: white;
}

.confirm-btn:hover, .cancel-btn:hover {
    transform: scale(1.05);
}

.form-group {
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.form-group label {
    display: block;
    color: white;
    margin-bottom: 5px;
}

.form-group input {
    width: 90%;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid var(--base);
    background-color: var(--secondThree);
    color: white;
}

.form-group input:focus {
    outline: none;
    border-color: var(--successColor);
}

@media (min-width: 1024px) {
    .container {
        width: 50%;
    }
}

.no-premises-message {
    color: var(--base);
    font-size: 1.2rem;
    margin-top: 20px;
    text-align: center;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    width: 90%;
}

.action-btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
