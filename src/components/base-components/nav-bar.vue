<script setup>
import { ref, inject, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import HelpModal from './help-modal.vue';

const loggedCompany = inject("loggedCompany", ref(null));
const loggedWorker = inject("loggedWorker", ref(null));
const workerRole = inject('workerRole', ref(null))
const selectedPremise = inject('selectedPremise', ref(null))

const showNavBar = ref(false);
const showHelpModal = ref(false);

const switch_navBar = () => {
  showNavBar.value = !showNavBar.value;
};

const toggleHelpModal = () => {
  showHelpModal.value = !showHelpModal.value;
};

const route = useRoute();
const isActive = (path) => route.path.startsWith(path);

const navBarRef = ref(null);
const handleClickOutside = (event) => {
  if (navBarRef.value && !navBarRef.value.contains(event.target) && showNavBar.value) {
    switch_navBar();
  }
};

const handleKeyPress = (event) => {
  // Verificar si el elemento activo es un input o textarea
  const activeElement = document.activeElement;
  const isInput = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';
  
  if (event.key.toLowerCase() === 'm' && !isInput) {
    switch_navBar();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeyPress);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeyPress);
});
</script>

<template>
  <nav ref="navBarRef" class="nav-bar" :class="{ show: showNavBar }">
    <div class="logo-container">
      <img src="/src/assets/img/Logo.png" class="logo">
      <h1>FIX-FLOW</h1>
    </div>
    <router-link to="/companySession" class="nav-router" :class="{ active: isActive('/companySession') }">Compañia</router-link>
    <router-link v-if="loggedCompany" to="/premises" class="nav-router" :class="{ active: isActive('/premises') }">Locales</router-link>
    <router-link to="/workers/login-worker" class="nav-router" :class="{ active: isActive('/workers') }">Colaboradores</router-link>
    <router-link v-if="loggedWorker" to="/bills" class="nav-router" :class="{ active: isActive('/bills') }">Facturación</router-link>
    <router-link v-if="workerRole == 'Gerente' || workerRole == 'Administrador'" to="/shifts" class="nav-router" :class="{ active: isActive('/shifts') }">Turnos</router-link>
    <div class="info-container">
      <span style="text-transform: uppercase;">{{ loggedCompany }}</span>
      <span style="text-transform: capitalize;">{{ loggedWorker }}</span>
      <span style="text-transform: capitalize;">{{ workerRole }}</span>
      <span style="text-transform: capitalize;">{{ selectedPremise }}</span>
    </div>
    <button class="help-button" @click="toggleHelpModal">
      <ion-icon name="help-circle"></ion-icon>
      Ayuda
    </button>
  </nav>
  <button class="nav-btn" @click.stop="switch_navBar" title="Menu">
    <ion-icon name="menu" v-if="!showNavBar"></ion-icon>
    <ion-icon name="close" v-if="showNavBar"></ion-icon>
  </button>
  <HelpModal :is-open="showHelpModal" @close="toggleHelpModal" />
</template>


<style scoped>
.nav-bar {
  z-index: 1000;
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 200px;
  background-color: rgba(255, 255, 255, 0.295);
  padding: 10px 20px;
  height: auto;
  max-height: 80vh;
  border-radius: 10px;
  top: 70px;
  left: 10px;
  transition: .3s;
  transform: translateX(-120%);
  backdrop-filter: blur(5px);
  overflow-y: scroll;
}
.nav-bar::-webkit-scrollbar{
  display: none;
}
.logo-container{
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 10px;
  padding: 10px 0;
  height: 60px;
}
.logo{
  height: 100%;
}

.nav-bar.show {
  transform: translateX(0);
}

.nav-router {
  text-decoration: none;
  color: black;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-size: 15px;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 10px;
  transition: .3s;
  border: 2px solid transparent;
  font-weight: bolder;
  font-family: var(--baseFont);
  letter-spacing: 2px;
}

.nav-router.active {
  background-color: var(--base);
  scale: 1.1;
  color: white;
  transform: translateX(10px) translateY(-10px);
  border-color: white;
  box-shadow: var(--secShadow);
}


.nav-btn {
  all: unset;
  color: white;
  background-color: var(--base);
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--secShadow);
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: .2s;
  height: 18px;
  width: 18px;
  z-index: 8;
}

.nav-btn * {
  position: absolute;
  scale: 1.2;
}

.nav-btn:active {
  scale: 1.2;
}

.info-container {
  padding-top: 30px;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
}
/* Tablets: 768px y mayores */
@media (min-width: 768px) {
    .nav-btn{
      scale: 1.3;
    }
}
@media (min-width: 1280px) {
    .nav-bar{
      scale: .85;
      gap: 10px;
      transform: translateX(-500px) translateY(-50px);
    }
    .nav-bar.show{
      transform: translateX(0) translateY(-50px);
    }
    .logo{
      margin-bottom: 20px;
    }
}

.help-button {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: var(--base);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  font-weight: bold;
  width: 100%;
  justify-content: center;
}

.help-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--secShadow);
}

.help-button ion-icon {
  font-size: 20px;
}

.keyboard-shortcut {
  position: absolute;
  bottom: -15px;
  font-size: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 4px;
  border-radius: 3px;
  display: none;
}
</style>