<script setup>
import navBar from './components/base-components/nav-bar.vue';
import billInfo from './components/base-components/bill-info.vue';
import billsNavBar from './components/bill-components/bills-nav-bar.vue';
import close_sesion_btn from './components/workers-components/close-sesion-btn.vue';
import billConfirm from './components/base-components/bill-confirm.vue';
import backBtn from './components/base-components/back-btn.vue';
import { provide, ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const loggedCompany = ref(null);
const loggedWorker = ref(null)
const workersCount = ref(0)
const workerRole = ref(null)

const inBills = ref(false)
const inWorkerProfile = ref(false)

provide('loggedCompany', loggedCompany)
provide('loggedWorker', loggedWorker)
provide('workersCount', workersCount)
provide('workerRole', workerRole)


const showBillInfo = ref(false)

const switch_sbf = () => {
  showBillInfo.value = !showBillInfo.value;
}

provide('switch_sbf', switch_sbf)

const showBillConfirm = ref(false)

const switchSBC = () => {
  showBillConfirm.value = !showBillConfirm.value
}

provide("switchSBC", switchSBC)


// Instancias de router y route
const router = useRouter();
const route = useRoute();

const handlePath = () => {
  showBillInfo.value = false;
  showBillConfirm.value = false;
  if (route.path !== '/loginCompany' && loggedCompany.value === null) {
    router.push('/loginCompany')//Redirigir a Inicio de Sesion si no se ha iniciado
  } else if (route.path === '/loginCompany' && loggedCompany.value) {
    router.push('/companySession')//Redirigir a session si ya se ha iniciado sesion
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
onMounted(() => {
  handlePath();
});
watch(
  () => route.path,
  (newPath) => {
    setTimeout(() => {
      handlePath();
    }, 150); // Ajusta el retraso según sea necesario
  }
);



const billData = {
  bill_number: "0001-A",
  client_name: "Juan Pérez",
  entry_date: "2023-10-12",
  total_price: 1250000, // Total en pesos colombianos
  due: 250000,          // Cantidad pendiente en pesos colombianos
  payment: 1000000,     // Cantidad pagada en pesos colombianos
  client_phone: "315-555-1234",
  wname: "Carlos Rodríguez",
  phones_list: [
    {
      phone_ref: "0001-A-1",
      brand_name: "Samsung",
      device: "Galaxy A21s",
      details: "Pantalla rota",
      price: 500000,           // Precio en pesos colombianos
      delivery_date: "2023-10-20",
      repaired: true,
      delivered: false,
    },
    {
      phone_ref: "0001-A-2",
      brand_name: "Apple",
      device: "iPhone 12",
      details: "Batería dañada",
      price: 450000,           // Precio en pesos colombianos
      delivery_date: "2023-10-18",
      repaired: true,
      delivered: true,
    },
    {
      phone_ref: "0001-A-3",
      brand_name: "Xiaomi",
      device: "Redmi Note 10",
      details: "Problemas de carga",
      price: 300000,           // Precio en pesos colombianos
      delivery_date: "2023-10-25",
      repaired: false,
      delivered: false,
    }
  ]
};


</script>

<template>
  <section class="body">
    <transition name="opacity-in" mode="out-in">
      <billInfo v-if="showBillInfo" :key="'billInfo'" :bill_number="billData.bill_number"
        :client_name="billData.client_name" :entry_date="billData.entry_date" :total_price="billData.total_price"
        :due="billData.due" :payment="billData.payment" :client_phone="billData.client_phone" :wname="billData.wname"
        :phones_list="billData.phones_list" />
    </transition>
    <transition name="opacity-in" mode="out-in">
      <billConfirm v-if="showBillConfirm" client_name="Felipe Sierra" :total_price="300000" due="150000"
        payment="150000" client_phone="3202169321" wname="David Carrillo" :phones_list="billData.phones_list"></billConfirm>
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
      <backBtn v-if="loggedCompany"></backBtn>
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
  transition:all .5s ease;
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
</style>
