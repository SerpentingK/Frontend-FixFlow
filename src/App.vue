<script setup>
// Importación de componentes
import navBar from './components/base-components/nav-bar.vue';
import billInfo from './components/base-components/bill-info.vue';
import billsNavBar from './components/bill-components/bills-nav-bar.vue';
import close_sesion_btn from './components/workers-components/close-shift-btn.vue';
import billConfirm from './components/base-components/bill-confirm.vue';
import backBtn from './components/base-components/back-btn.vue';
import repairConfirm from './components/base-components/repair-confirm.vue';
import closeShift from './components/shifts-components/close-shift.vue';
import deliveryConfirm from './components/base-components/delivery-confirm.vue';
import shiftInfo from './components/shifts-components/shift-info.vue';
import confirmCloseShift from './components/base-components/confirm-close-shift.vue';
import renewedSuscription from './components/companie-components/renewedSuscription.vue';
import alert from './components/base-components/alert.vue';
import withdrawVault from './components/companie-components/withdrawVault.vue';
import mailPaswRestore from './components/companie-components/mailPaswRestore.vue';
import mailTokenRestore from './components/companie-components/mailTokenRestore.vue';
import Particles from './components/Particles.vue';
import withdrawList from './components/companie-components/withdrawList.vue';

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
const loggedDocument = ref(null);         // Documento del trabajador
const workersCount = ref(0);              // Cantidad de trabajadores
const workerRole = ref(null);             // Rol del trabajador

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

// Proveer estados a componentes hijos

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

const showWithdrawList = ref(false);
const switchSWL = () => {
  showWithdrawList.value =!showWithdrawList.value;
};
provide("switchSWL", switchSWL);

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
const getCompanyVault = async () => {
  try {
    if (loggedCompany.value) {
      const answer = await axios.get(
        `/api/company/${loggedCompany.value}/vault/baseColor`
      );
      totalInCash.value = answer.data.vault;
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
provide('getCompanyVault', getCompanyVault);

const phonesRepair = ref([]);

/**
 * Obtiene los teléfonos reparados
 */
const getPhonesR = async () => {
  try {
    const ansawer = await axios.get(`/api/someDataPhone/${loggedCompany.value}`);
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
    const response = await axios.get(`/api/someDataPhoneDelivered/${loggedCompany.value}`);
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
    const response = await axios.get(`/api/bill/details/${bill_number.value}`);
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
  } else if (route.path.startsWith('/workers') && workersCount.value < 1) {
    router.push('/workers/new-worker');
  } else if (route.path.startsWith('/workers') && loggedWorker.value === null && workersCount > 0) {
    router.push('/workers/login-worker');
  } else if (route.path === '/workers/login-worker' && loggedWorker.value) {
    router.push('/workers/worker-profile');
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

const alertShow = ref(false);
const alertType = ref("4");
const alertMessage = ref("Predeterminado");

/**
 * Muestra una alerta en la interfaz
 * @param {string} type - Tipo de alerta
 * @param {string} message - Mensaje a mostrar
 */
const showAlert = (type, message) => {
  if (alertShow.value) {
    alertShow.value = false;
  } else {
    alertType.value = type;
    alertMessage.value = message;
    alertShow.value = true;
  }
};
provide("showAlert", showAlert);

// =============================================
// SUSCRIPCIÓN Y OTRAS FUNCIONALIDADES
// =============================================

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
    <transition name="opacity-in" mode="out-in">
      <alert v-if="alertShow" :type="alertType" :message="alertMessage"></alert>
    </transition>
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
      <withdrawList v-if="showWithdrawList"></withdrawList>
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

.opacity-in-leave-to {
  opacity: 0;
  transform: scale(0.1);
  transform-origin: center;
}
</style>
