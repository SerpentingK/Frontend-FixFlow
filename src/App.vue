<script setup>
// Importación de componentes
import navBar from './components/base-components/nav-bar.vue';
import billInfo from './components/bill-components/bill-info.vue';
import billsNavBar from './components/bill-components/bills-nav-bar.vue';
import close_sesion_btn from './components/shifts-components/close-shift-btn.vue';
import billConfirm from './components/bill-components/bill-confirm.vue';
import backBtn from './components/base-components/back-btn.vue';
import repairConfirm from './components/base-components/repair-confirm.vue';
import closeShift from './components/shifts-components/close-shift.vue';
import deliveryConfirm from './components/base-components/delivery-confirm.vue';
import shiftInfo from './components/shifts-components/shift-info.vue';
import confirmCloseShift from './components/shifts-components/confirm-close-shift.vue';
import renewedSuscription from './components/companie-components/renewedSuscription.vue';
import alert from './components/base-components/alert.vue';
import withdrawVault from './components/premises-components/withdrawVault.vue';
import mailPaswRestore from './components/companie-components/mailPaswRestore.vue';
import mailTokenRestore from './components/companie-components/mailTokenRestore.vue';
import Particles from './components/Particles.vue';
import withdrawInfo from './components/premises-components/premiseInfo.vue';
import loginPremise from './components/premises-components/login-premise.vue';
import addPremiseModal from './components/premises-components/add-premise-modal.vue';

// Importación de funciones de Vue y otras dependencias
import { provide, ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

// =============================================
// ESTADO DE LA APLICACIÓN Y DATOS COMPARTIDOS
// =============================================

// Datos de la empresa y trabajador
const loggedCompany = ref(null);          // Empresa logueada
const loggedWorker = ref(null);           // Trabajador logueado
const numberCompany = ref(null);          // Número de la empresa
const selectedPremise = ref(null);        // Local seleccionado 
const selectedPremiseId = ref(0);      // ID del local seleccionado
const premisesCount = ref(0);          // Numero de locales
const loggedDocument = ref(null);
const loggedId = ref(null);       // Documento del trabajador
const workersCount = ref(0);              // Cantidad de trabajadores
const workerRole = ref(null);             // Rol del trabajador
const premiseVault = ref(0);              // Caja del local seleccionado
const withdrawals = ref([]);              // Lista de retiros
const nitCompany = ref("0000000000");            // NIT de la empresa
const selectedPremiseAddress = ref("No disponible");        // Dirección de la empresa

// Estadísticas de teléfonos
const phonesRepaired = ref(0);            // Teléfonos reparados
const phonesReceived = ref(0);            // Teléfonos recibidos
const phonesDelivered = ref(0);           // Teléfonos entregados

// Datos del turno
const startShift = ref(null);             // Hora de inicio del turno

// Estados de navegación
const inBills = ref(false);               // Si está en la sección de facturas
const inWorkerProfile = ref(false);       // Si está en el perfil del trabajador

// Estadísticas financieras
const total_sales = ref(0);               // Ventas totales
const total_revenue = ref(0);             // Ingresos totales
const total_outs = ref(0);                // Gastos totales
const totalInvestment = ref(0);            // Inversión total
const total_cash = ref(0);                // Efectivo total
const total_platform = ref(0);            // Pagos por plataforma
const total_user = ref(0);                // Usuario total
const totalInCash = ref(0);               // Efectivo en caja

// Añadir estas variables al estado de la aplicación
const subscriptionPlan = ref(null);
const subscriptionExpiry = ref(null);

// Proveer estados a componentes hijos

provide('loggedId', loggedId);
provide('numberCompany', numberCompany);
provide('totalInvestment', totalInvestment)
provide('totalInCash', totalInCash);
provide('total_user', total_user);
provide('total_platform', total_platform);
provide('total_cash', total_cash);
provide('total_outs', total_outs);
provide('total_revenue', total_revenue);
provide('total_sales', total_sales);
provide('startShift', startShift);
provide('loggedCompany', loggedCompany);
provide('loggedWorker', loggedWorker);
provide('loggedDocument', loggedDocument);
provide('workersCount', workersCount);
provide('workerRole', workerRole);
provide('phonesRepaired', phonesRepaired);
provide('phonesReceived', phonesReceived);
provide('phonesDelivered', phonesDelivered);
provide('selectedPremise', selectedPremise);
provide('selectedPremiseId', selectedPremiseId);
provide('premisesCount', premisesCount);
provide('premiseVault', premiseVault);
provide('numberCompany', numberCompany);
provide('nitCompany', nitCompany);
provide('selectedPremiseAddress', selectedPremiseAddress);
provide('subscriptionPlan', subscriptionPlan);
provide('subscriptionExpiry', subscriptionExpiry);

// Función para cargar información del local
const loadPremisesVault = async (selectedPremiseId) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/premises/${selectedPremiseId}`);
    premiseVault.value = response.data.Vault;
  } catch (error) {
    console.error("Error al cargar información del local:", error);
  }
};
provide('loadPremisesVault', loadPremisesVault);

// Función para cargar todos los retiros
const loadAllWithdrawals = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/someDataOutVault/${selectedPremiseId.value}`);
    withdrawals.value = response.data;
    return response.data;
  } catch (error) {
    console.error("Error al cargar los retiros:", error);
    withdrawals.value = [];
    return [];
  }
};
provide('loadAllWithdrawals', loadAllWithdrawals);
provide('withdrawals', withdrawals);

// Datos de la factura
const billData = ref({
  total_price: 0,       // Precio total
  client_name: '',      // Nombre del cliente
  client_phone: '',     // Teléfono del cliente
  wname: "",            // Nombre del trabajador
  ref_shift: "",        // Referencia del turno
  phones: [],           // Teléfonos asociados
});
provide('billData', billData);

// =============================================
// CONTROL DE MODALES Y VISTAS
// =============================================

// Control de visualización de información de factura
const showBillInfo = ref(false);
const bill_number = ref(null);

/**
 * Alterna la visualización de la información de la factura
 * @param {string} newBillNumber - Número de factura a mostrar
 */
const switch_sbf = (newBillNumber) => {
  bill_number.value = newBillNumber;
  showBillInfo.value = !showBillInfo.value;
  console.log("Número de factura seleccionado:", bill_number.value);
};
provide('bill_number', bill_number);
provide('switch_sbf', switch_sbf);

// Control de visualización de pago
const showPayment = ref(false);
const switchSP = () => {
  if (!loggedCompany.value) {
    showPayment.value = !showPayment.value;
  } else {
    showPayment.value = !companyPay.value;
  }
};
provide("switchSP", switchSP);

// Control de confirmación de factura
const showBillConfirm = ref(false);
const switchSBC = () => {
  showBillConfirm.value = !showBillConfirm.value;
};
provide("switchSBC", switchSBC);

// Control de cierre de turno
const showCloseShift = ref(false);
const switchCS = () => {
  showCloseShift.value = !showCloseShift.value;
};
provide("switchCS", switchCS);

// Control de confirmación de cierre de turno
const showConfirmCloseShift = ref(false);
const switchCCS = () => {
  showConfirmCloseShift.value = !showConfirmCloseShift.value;
};
provide("switchCCS", switchCCS);

//Control de vista de lista de retiros

const showVaultInfo = ref(false);
const switchSVI = () => {
  showVaultInfo.value = !showVaultInfo.value;
};
provide("switchSVI", switchSVI);

// =============================================
// GESTIÓN DE REPARACIONES
// =============================================

const showRepairConfirm = ref(false);
const repairRef = ref("");
const repairBrand = ref("");
const repairDevice = ref("");
const defaultColor = ref("#d84b17");
provide("defaultColor", defaultColor);
const selectedColor = ref(defaultColor.value);
provide("selectedColor", selectedColor);

/**
 * Obtiene la bóveda de la empresa y su color base
 */
const getCompanyColor = async () => {
  try {
    if (loggedCompany.value) {
      const answer = await axios.get(
        `${import.meta.env.VITE_API_URL}/company/${loggedCompany.value}/baseColor`
      );
      selectedColor.value = answer.data.baseColor;
      document.documentElement.style.setProperty(
        "--base",
        answer.data.baseColor
      );
    }
  } catch (error) {
    console.error("Error al obtener la boveda y el color", error);
  }
};
provide('getCompanyColor', getCompanyColor);

const phonesRepair = ref([]);

/**
 * Obtiene los teléfonos reparados
 */
const getPhonesR = async () => {
  try {
    const ansawer = await axios.get(`${import.meta.env.VITE_API_URL}/someDataPhone/${loggedCompany.value}`);
    phonesRepair.value = ansawer.data;
  } catch (error) {
    console.error("📌 Error al obtener teléfonos reparados:", error);
    if (error.response?.status === 500) {
      phonesRepair.value = [];
    }
  } finally {
    phonesRepair.value = [...phonesRepair.value];
  }
};

/**
 * Alterna la visualización de confirmación de reparación
 * @param {string} newPhoneRef - Referencia del teléfono
 * @param {string} newrepairB - Marca del teléfono
 * @param {string} newrepairD - Modelo del teléfono
 */
const switchSRC = (newPhoneRef, newrepairB, newrepairD) => {
  showRepairConfirm.value = !showRepairConfirm.value;
  repairRef.value = newPhoneRef;
  repairBrand.value = newrepairB;
  repairDevice.value = newrepairD;
};

provide("phonesRepair", phonesRepair);
provide("getPhonesR", getPhonesR);
provide("repairDevice", repairDevice);
provide("repairRef", repairRef);
provide("repairBrand", repairBrand);
provide("switchSRC", switchSRC);

// =============================================
// GESTIÓN DE ENTREGAS
// =============================================

const showDeliveryConfirm = ref(false);
const deliveryRef = ref("");
const deliveryBrand = ref("");
const deliveryDevice = ref("");
const deliveredPhone = ref([]);

/**
 * Obtiene los teléfonos entregados
 */
const getPhonesD = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/someDataPhoneDelivered/${loggedCompany.value}`);
    deliveredPhone.value = response.data;
  } catch (error) {
    console.error("📌 Error al obtener teléfonos entregados:", error);
    if (error.response?.status === 500) {
      deliveredPhone.value = [];
    }
  } finally {
    deliveredPhone.value = [...deliveredPhone.value];
  }
};

/**
 * Alterna la visualización de confirmación de entrega
 * @param {string} newPhoneRef - Referencia del teléfono
 * @param {string} newdeliveredB - Marca del teléfono
 * @param {string} newdeliveredD - Modelo del teléfono
 */
const switchSDC = (newPhoneRef, newdeliveredB, newdeliveredD) => {
  showDeliveryConfirm.value = !showDeliveryConfirm.value;
  deliveryRef.value = newPhoneRef;
  deliveryBrand.value = newdeliveredB;
  deliveryDevice.value = newdeliveredD;
};

// =============================================
// INFORMACIÓN DE FACTURA
// =============================================

const infoBill = ref({
  bill_number: "",
  client_phone: "",
  wname: "",
  total_price: 0,
  entry_date: "",
  client_name: "",
  phones: []
});

/**
 * Carga los datos de una factura específica
 */
const infoData = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/bill/details/${bill_number.value}`);
    infoBill.value = {
      bill_number: response.data.bill.bill_number,
      due: response.data.bill.due,
      client_phone: response.data.bill.client_phone,
      wname: response.data.bill.wname,
      total_price: response.data.bill.total_price,
      entry_date: response.data.bill.entry_date,
      client_name: response.data.bill.client_name,
      payment: response.data.bill.payment,
      phones: response.data.phones,
    };
    console.log("infoBill:", infoBill.value);
  } catch (error) {
    console.error("Error al cargar los datos de la factura:", error);
  }
};

provide('infoBill', infoBill);
provide('infoData', infoData);
provide("deliveredPhone", deliveredPhone);
provide("getPhonesD", getPhonesD);
provide("deliveryDevice", deliveryDevice);
provide("deliveryRef", deliveryRef);
provide("deliveryBrand", deliveryBrand);
provide("switchSDC", switchSDC);

// =============================================
// GESTIÓN DE TURNOS
// =============================================

const shift = {
  ref_shift: "",
  id: "",
  start_time: "",
  finish_time: "",
  total_received: 0,    // Valor en pesos colombianos (COP)
  total_gain: 0,        // Valor en pesos colombianos (COP)
  total_outs: 0,        // Valor en pesos colombianos (COP)
  date_shift: ""        // Fecha derivada de ref_shift
};

const showShiftInfo = ref(false);

/**
 * Alterna la visualización de información del turno
 * @param {object} newShift - Datos del turno
 */
const switchSI = (newShift) => {
  shift.ref_shift = newShift.ref_shift;
  shift.id = newShift.id;
  shift.start_time = newShift.start_time;
  shift.finish_time = newShift.finish_time;
  shift.total_received = newShift.total_received;
  shift.total_gain = newShift.total_gain;
  shift.total_outs = newShift.total_outs;
  shift.date_shift = newShift.date_shift;
  showShiftInfo.value = !showShiftInfo.value;
};
provide("switchSI", switchSI);

// =============================================
// ENRUTAMIENTO Y CONTROL DE ACCESO
// =============================================

const router = useRouter();
const route = useRoute();

/**
 * Maneja la navegación y control de acceso según la ruta
 */
const handlePath = () => {
  // Resetear todos los modales
  showBillInfo.value = false;
  showBillConfirm.value = false;
  showCloseShift.value = false;
  showRepairConfirm.value = false;
  showDeliveryConfirm.value = false;
  showShiftInfo.value = false;

  // Control de rutas según autenticación
  if (route.path !== '/loginCompany' && loggedCompany.value === null) {
    router.push('/loginCompany');
  } else if (route.path === '/loginCompany' && loggedCompany.value) {
    router.push('/companyShift');
  } else if (route.path.startsWith('/premises') && premisesCount.value < 1) {
    router.push('/premises/new-premise');
  } else if (route.path.startsWith('/workers') && workersCount.value < 1) {
    router.push('/workers/new-worker');
  } else if (route.path.startsWith('/workers') && loggedWorker.value === null && workersCount > 0) {
    router.push('/workers/login-worker');
  } else if (route.path === '/workers/login-worker' && loggedWorker.value) {
    router.push('/workers/worker-profile');
  } else if (route.path.startsWith('/bills') && selectedPremise.value === null) {
    router.push('/premises');
    showAlert("2", "Debes iniciar sesion en un local para acceder a facturacion");
  } else if (route.path.startsWith('/premises') && workersCount.value === 0) {
    router.push('/workers/new-worker');
    showAlert("2", "Debes crear un usuario para acceder al módulo de locales");
  } else if (route.path.startsWith('/shifts') && workerRole.value !== 'Gerente' && workerRole.value !== 'Administrador') {
    router.push('/workers/worker-profile');
    showAlert("2", "Debes ser administrador o gerente para acceder al módulo de turnos");
  }

  // Control de estado en sección de facturas
  if (route.path.startsWith('/bills')) {
    inBills.value = true;
  } else {
    inBills.value = false;
  }

  // Control de estado en perfil de trabajador
  if (route.path === '/workers/worker-profile') {
    inWorkerProfile.value = true;
  } else {
    inWorkerProfile.value = false;
  }
};

// =============================================
// SISTEMA DE ALERTAS
// =============================================

// Control de alertas
const alerts = ref([]);
const alertType = ref('4');
const alertMessage = ref('');

/**
 * Muestra una alerta en la interfaz
 * @param {string} type - Tipo de alerta
 * @param {string} message - Mensaje a mostrar
 */
const showAlert = (type, message) => {
  if (type && message) {
    // Añadir nueva alerta
    alerts.value.push({
      id: Date.now(),
      type,
      message
    });
  } else {
    // Remover la primera alerta
    alerts.value.shift();
  }
};
provide("showAlert", showAlert);

// =============================================
// GESTIÓN DE LOCALES
// =============================================

const showLoginPremise = ref(false)
const toSelectPremise = ref(null)
const toSelectPremiseId = ref(null)
const showAddPremiseModal = ref(false)

const switchSAPM = () => {
  showAddPremiseModal.value = !showAddPremiseModal.value;
}

provide("switchSAPM", switchSAPM)

const switchSLP = (premiseName, premiseId) => {
  if (showLoginPremise.value) {
    // Si el modal está abierto, lo cerramos
    showLoginPremise.value = false;
  } else {
    // Si el modal está cerrado y tenemos datos válidos, lo abrimos
    if (premiseName && !isNaN(premiseId)) {
      toSelectPremise.value = premiseName;
      toSelectPremiseId.value = premiseId;
      showLoginPremise.value = true;
    }
  }
}

provide("switchSLP", switchSLP)

// =============================================
// SUSCRIPCIÓN Y OTRAS FUNCIONALIDADES
// =============================================


const clearData = () => {
  total_sales.value = 0;
  total_outs.value = 0;
  total_revenue.value = 0;
  loggedDocument.value = null;
  loggedWorker.value = null;
  workerRole.value = null;
  startShift.value = null;
  phonesDelivered.value = 0;
  phonesReceived.value = 0;
  phonesRepaired.value = 0;
  total_cash.value = 0;
  total_platform.value = 0;
  totalInvestment.value = 0;
  total_user.value = 0;
  window.location.reload();
}

provide("clearData", clearData);

const printEnabled = ref(false);

provide("printEnabled", printEnabled);


const showRenewedSuscription = ref(false);
const switchSRS = () => {
  if (!suscripctionRenewed.value && loggedCompany.value) {
    showRenewedSuscription.value = true;
  } else {
    showRenewedSuscription.value = false;
  }
};
provide("switchSRS", switchSRS);

const showWithdrawVault = ref(false);
const switchWV = () => {
  showWithdrawVault.value = !showWithdrawVault.value;
};
provide("switchWV", switchWV);

const suscripctionRenewed = ref(true);
provide("SR", suscripctionRenewed);

const showMailPaswRestore = ref(false);
const switchSMPR = () => {
  showMailPaswRestore.value = !showMailPaswRestore.value;
};
provide("switchSMPR", switchSMPR);

const showMailTokenRestore = ref(false);
const switchSMTR = () => {
  showMailTokenRestore.value = !showMailTokenRestore.value;
};
provide("switchSMTR", switchSMTR);

// =============================================
// CICLO DE VIDA Y OBSERVADORES
// =============================================

onMounted(() => {
  // Recuperar loggedId del localStorage
  const storedLoggedId = localStorage.getItem("loggedId");
  if (storedLoggedId) {
    loggedId.value = JSON.parse(storedLoggedId);
  }

  const storedUser = localStorage.getItem("loggedCompany");
  if (storedUser) {
    loggedCompany.value = JSON.parse(storedUser).name;
    checkSubscription();
  }

  handlePath();
});

// Observar cambios en la ruta
watch(
  () => route.path,
  (newPath) => {
    setTimeout(() => {
      switchSRS();
      handlePath();
    }, 150);
  }
);

// Modificar la función que verifica la suscripción
const checkSubscription = async () => {
  try {
    if (loggedCompany.value) {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/company/${loggedCompany.value}/subscription`
      );
      subscriptionPlan.value = response.data.plan;
      subscriptionExpiry.value = response.data.expiry;
      suscripctionRenewed.value = new Date(response.data.expiry) > new Date();
    }
  } catch (error) {
    console.error("Error al verificar la suscripción:", error);
  }
};
</script>

<template>
  <section class="body">
    <Particles />
    <transition name="opacity-in" mode="out-in">
      <billInfo v-if="showBillInfo" />
    </transition>
    <transition name="opacity-in" mode="out-in">
      <billConfirm v-if="showBillConfirm">
      </billConfirm>
    </transition>
    <transition name="opacity-in" mode="out-in">
      <repairConfirm v-if="showRepairConfirm"></repairConfirm>
    </transition>
    <transition name="opacity-in" mode="out-in">
      <closeShift v-if="showCloseShift"></closeShift>
    </transition>
    <transition name="opacity-in" mode="out-in">
      <deliveryConfirm v-if="showDeliveryConfirm" :ref_num="deliveryRef"></deliveryConfirm>
    </transition>
    <transition name="opacity-in" mode="out-in">
      <navBar v-if="loggedCompany" :key="'navbar'"></navBar>
    </transition>
    <transition name="opacity-in" mode="ease-in">
      <router-view :key="route.path"></router-view>
    </transition>
    <transition name="opacity-in" mode="out-in">
      <billsNavBar v-if="inBills"></billsNavBar>
    </transition>
    <transition name="opacity-in" mode="out-in">
      <close_sesion_btn v-if="inWorkerProfile"></close_sesion_btn>
    </transition>
    <transition name="opacity-in" mode="out-in">
      <backBtn v-if="loggedCompany" title="Volver"></backBtn>
    </transition>
    <transition name="opacity-in" mode="out-in">
      <shiftInfo v-if="showShiftInfo" :shift="shift"></shiftInfo>
    </transition>
    <transition name="opacity-in" mode="out-in">
      <confirmCloseShift v-if="showConfirmCloseShift"></confirmCloseShift>
    </transition>
    <transition name="opacity-in" mode="out-in">
      <renewedSuscription v-if="showRenewedSuscription"></renewedSuscription>
    </transition>
    <transition-group name="alert-list" tag="div" class="alerts-container">
      <alert v-for="alert in alerts" :key="alert.id" :type="alert.type" :message="alert.message"></alert>
    </transition-group>
    <transition name="opacity-in" mode="out-in">
      <withdrawVault v-if="showWithdrawVault"></withdrawVault>
    </transition>
    <transition name="opacity-in" mode="out-in">
      <mailPaswRestore v-if="showMailPaswRestore"></mailPaswRestore>
    </transition>
    <transition name="opacity-in" mode="out-in">
      <mailTokenRestore v-if="showMailTokenRestore"></mailTokenRestore>
    </transition>
    <transition name="opacity-in" mode="out-in">
      <withdrawInfo v-if="showVaultInfo"></withdrawInfo>
    </transition>
    <transition name="opacity-in" mode="out-in">
      <loginPremise v-if="showLoginPremise" :premise-name="toSelectPremise" :premises_id="Number(toSelectPremiseId)">
      </loginPremise>
    </transition>
    <transition name="opacity-in" mode="out-in">
      <addPremiseModal v-if="showAddPremiseModal"></addPremiseModal>
    </transition>
  </section>
</template>

<style>
* {
  font-family: var(--baseFont);
  letter-spacing: .6px;
}

.body {
  height: 100%;
}

.opacity-in-enter-active,
.opacity-in-leave-active {
  transition: all .5s ease;
}

.opacity-in-enter-from {
  opacity: 0;
  transform: scale(0.1);
  transform-origin: center;
}

.opacity-in-leave-to {
  opacity: 0;
  transform: scale(0.1);
  transform-origin: center;
}

.alerts-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
}

.alert-list-enter-active,
.alert-list-leave-active {
  transition: all 0.3s ease;
}

.alert-list-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.alert-list-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
