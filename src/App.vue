<script setup>
import navBar from './components/base-components/nav-bar.vue';
import billInfo from './components/base-components/bill-info.vue';
import billsNavBar from './components/bill-components/bills-nav-bar.vue';
import close_sesion_btn from './components/workers-components/close-shift-btn.vue';
import billConfirm from './components/base-components/bill-confirm.vue';
import backBtn from './components/base-components/back-btn.vue';
import repairConfirm from './components/base-components/repair-confirm.vue';
import closeShift from './components/base-components/close-shift.vue';
import deliveryConfirm from './components/base-components/delivery-confirm.vue';
import shiftInfo from './components/shifts-components/shift-info.vue';
import confirmCloseShift from './components/base-components/confirm-close-shift.vue';
import payment from './components/base-components/payment.vue';
import renewedSuscription from './components/base-components/renewedSuscription.vue';
import alert from './components/base-components/alert.vue';
import withdrawVault from './components/base-components/withdrawVault.vue';
import mailPaswRestore from './components/base-components/mailPaswRestore.vue';
import { provide, ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';


const loggedCompany = ref(null);
const loggedWorker = ref(null)
const loggedDocument = ref(null)
const workersCount = ref(0)
const workerRole = ref(null)
const phonesRepaired = ref(0)
const phonesReceived = ref(0)
const phonesDelivered = ref(0)
const startShift = ref(null);
const inBills = ref(false)
const inWorkerProfile = ref(false)
const total_sales = ref(0)
const total_revenue = ref(0)
const total_outs = ref(0)
const total_cash = ref(0)
const total_platform = ref(0)

provide('total_platform', total_platform)
provide('total_cash', total_cash)
provide('total_outs', total_outs)
provide('total_revenue', total_revenue)
provide('total_sales', total_sales)
provide('startShift', startShift)
provide('loggedCompany', loggedCompany)
provide('loggedWorker', loggedWorker)
provide('loggedDocument', loggedDocument)
provide('workersCount', workersCount)
provide('workerRole', workerRole)
provide('phonesRepaired', phonesRepaired);
provide('phonesReceived', phonesReceived);
provide('phonesDelivered', phonesDelivered);

const billData = ref({
  total_price: 0,
  client_name: '',
  client_phone: '',
  wname: "",
  ref_shift: "",
  phones: [],
});
provide('billData', billData);


const showBillInfo = ref(false)

const bill_number = ref(null)

const switch_sbf = (newBillNumber) => {
  bill_number.value = newBillNumber;
  showBillInfo.value = !showBillInfo.value;
  console.log("Número de factura seleccionado:", bill_number.value);
};

provide('bill_number', bill_number)

provide('switch_sbf', switch_sbf)

const showPayment = ref(false)

const switchSP = () => {
  if (!loggedCompany.value) {
    showPayment.value = !showPayment.value
  }
  else {
    if (!companyPay.value) {
      showPayment.value = true
    } else {
      showPayment.value = false
    }
  }
}

provide("switchSP", switchSP)

const showBillConfirm = ref(false)

const switchSBC = () => {
  showBillConfirm.value = !showBillConfirm.value
}

provide("switchSBC", switchSBC)

const showCloseShift = ref(false)

const switchCS = () => {
  showCloseShift.value = !showCloseShift.value
}

provide("switchCS", switchCS)

const showConfirmCloseShift = ref(false)

const switchCCS = () => {
  showConfirmCloseShift.value = !showConfirmCloseShift.value
}

provide("switchCCS", switchCCS)


const showRepairConfirm = ref(false)
const repairRef = ref("")
const repairBrand = ref("")
const repairDevice = ref("")
const defaultColor = ref(null);
provide("defaultColor", defaultColor)

const phonesRepair = ref([])

const getPhonesR = async () => {
  try {
    const ansawer = await axios.get(`http://127.0.0.1:8000/someDataPhone/${loggedCompany.value}`)
    phonesRepair.value = ansawer.data
  } catch (error) {
    console.error("📌 Error al obtener teléfonos reparados:", error);
    if (error.response && error.response.status === 500) {
      phonesRepair.value = []; // Si no hay datos, lista vacía
    }
  } finally {
    phonesRepair.value = [...phonesRepair.value];
  }
}

const switchSRC = (newPhoneRef, newrepairB, newrepairD) => {
  showRepairConfirm.value = !showRepairConfirm.value
  repairRef.value = newPhoneRef
  repairBrand.value = newrepairB
  repairDevice.value = newrepairD
}

provide("phonesRepair", phonesRepair)
provide("getPhonesR", getPhonesR)
provide("repairDevice", repairDevice)
provide("repairRef", repairRef)
provide("repairBrand", repairBrand)
provide("switchSRC", switchSRC)



const showDeliveryConfirm = ref(false)
const deliveryRef = ref("")
const deliveryBrand = ref("")
const deliveryDevice = ref("")

const deliveredPhone = ref([])

const getPhonesD = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/someDataPhoneDelivered/${loggedCompany.value}`);
    deliveredPhone.value = response.data;
  } catch (error) {
    console.error("📌 Error al obtener teléfonos entregados:", error);
    if (error.response && error.response.status === 500) {
      deliveredPhone.value = []; // Si no hay datos, lista vacía
    }
  } finally {
    deliveredPhone.value = [...deliveredPhone.value]; // Forzar actualización en Vue
  }
};



const switchSDC = (newPhoneRef, newdeliveredB, newdeliveredD) => {
  showDeliveryConfirm.value = !showDeliveryConfirm.value
  deliveryRef.value = newPhoneRef
  deliveryBrand.value = newdeliveredB
  deliveryDevice.value = newdeliveredD
}

const infoBill = ref({
  bill_number: "",
  client_phone: "",
  wname: "",
  total_price: 0,
  entry_date: "",
  client_name: "",
  phones: []
});

// Función para cargar los datos de la factura
const infoData = async () => {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/bill/details/${bill_number.value}`);
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
provide("deliveredPhone", deliveredPhone)
provide("getPhonesD", getPhonesD)
provide("deliveryDevice", deliveryDevice)
provide("deliveryRef", deliveryRef)
provide("deliveryBrand", deliveryBrand)
provide("switchSDC", switchSDC)

const shift = {
  ref_shift: "",
  id: "",
  start_time: "",
  finish_time: "",
  total_received: 0, // Valor en pesos colombianos (COP)
  total_gain: 0,      // Valor en pesos colombianos (COP)
  total_outs: 0,       // Valor en pesos colombianos (COP)
  date_shift: ""       // Fecha derivada de ref_shift
}

const showShiftInfo = ref(false)

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
}

provide("switchSI", switchSI)


// Instancias de router y route
const router = useRouter();
const route = useRoute();

const handlePath = () => {
  showBillInfo.value = false;
  showBillConfirm.value = false;
  showCloseShift.value = false;
  showRepairConfirm.value = false;
  showDeliveryConfirm.value = false;
  showShiftInfo.value = false;
  if (route.path !== '/loginCompany' && loggedCompany.value === null) {
    router.push('/loginCompany')//Redirigir a Inicio de Sesion si no se ha iniciado
  } else if (route.path === '/loginCompany' && loggedCompany.value) {
    router.push('/companyShift')//Redirigir a shift si ya se ha iniciado sesion
  } else if (route.path.startsWith('/workers') && workersCount.value < 1) {
    router.push('/workers/new-worker')
  } else if (route.path.startsWith('/workers') && loggedWorker.value === null && workersCount > 0) {
    router.push('/workers/login-worker')//Redirigir a Inicio de Sesion si no se ha iniciado
  } else if (route.path === '/workers/login-worker' && loggedWorker.value) {
    router.push('/workers/worker-profile')
  }

  if (route.path.startsWith('/bills')) {
    inBills.value = true;
  } else if (!route.path.startsWith('/bills')) {
    inBills.value = false;
  }

  if (route.path === '/workers/worker-profile') {
    inWorkerProfile.value = true;
  } else if (!(route.path === '/workers/worker-profile')) {
    inWorkerProfile.value = false;
  }
}

const alertShow = ref(false)
const alertType = ref("4")
const alertMessage = ref("Predeterminado")

const showAlert = (type, message) => {
    if(alertShow.value){
      alertShow.value = false;
      
    }else{
      alertType.value = type
      alertMessage.value = message
      alertShow.value = true
    }
}

provide("showAlert", showAlert)



const showRenewedSuscription = ref(false)

const switchSRS = () => {
  if (!suscripctionRenewed.value) {
    if(!loggedCompany.value){
      showRenewedSuscription.value = false
    }
    else{
      showRenewedSuscription.value = true
    }
  }
  else {
    showRenewedSuscription.value = false
  }
}

provide("switchSRS", switchSRS)

const showWithdrawVault = ref(false)

const switchWV = () => {
  showWithdrawVault.value = !showWithdrawVault.value
}

provide("switchWV", switchWV)


const suscripctionRenewed = ref(true)

provide("SR", suscripctionRenewed)

const showMailPaswRestore = ref(false)

const switchSMPR = () => {
  showMailPaswRestore.value = !showMailPaswRestore.value
}

provide("switchSMPR", switchSMPR)

onMounted(() => {
  handlePath();
});
watch(
  () => route.path,
  (newPath) => {
    setTimeout(() => {
      switchSRS()
      handlePath();
    }, 150); // Ajusta el retraso según sea necesario
  }
);

</script>

<template>
  <section class="body">
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
      <payment v-if="showPayment"></payment>
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
