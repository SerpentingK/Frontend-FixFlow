<script setup>
import { ref, inject } from 'vue';
import {useRoute} from 'vue-router';

const loggedCompany = inject("loggedCompany", ref(null))
const loggedWorker = inject("loggedWorker", ref(null))

const show_navBar = ref(false)
const switch_navBar = () => {
  show_navBar.value = !show_navBar.value
}

const route = useRoute()

const isActive = (path) => route.path.startsWith(path);
</script>

<template>
  <nav class="nav-bar" :class="{ show: show_navBar }">
    <img src="/src/assets/img/Logo_Nombre2.png" class="logo">
    <router-link to="/companySession" class="nav-router"
      :class="{ active: isActive('/companySession') }">Compañia</router-link>
    <router-link to="/workers" class="nav-router"
      :class="{active: isActive('/workers')}">Colaboradores</router-link>
    <router-link to="" class="nav-router">Facturacion</router-link>
    <router-link to="" class="nav-router">Repuestos</router-link>
    <div class="info-container">
      <span>{{ loggedWorker }}</span>
      <span>{{ loggedCompany }}</span>
    </div>
  </nav>
  <button class="nav-btn" @click="switch_navBar()">
    <ion-icon name="menu" v-if="!show_navBar"></ion-icon>
    <ion-icon name="close" v-if="show_navBar"></ion-icon>
  </button>
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
  border-radius: 10px;
  top: 20px;
  left: 10px;
  transition: .3s;
  transform: translateX(-120%);
  backdrop-filter: blur(5px);
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
  background-color: var(--baseOrange);
  scale: 1.1;
  color: white;
  transform: translateX(10px) translateY(-10px);
  border-color: white;
  box-shadow: var(--secShadow);
}

.logo {
  width: 60%;
  object-fit: cover;
  scale: 1.4;
  transform: translateX(20px);
}

.nav-btn {
  all: unset;
  color: white;
  background-color: var(--baseOrange);
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
}
/* Tablets: 768px y mayores */
@media (min-width: 768px) {
    .nav-btn{
      scale: 1.3;
    }
}
@media (min-width: 1280px) {
    .nav-bar{
      scale: 1.2;
      gap: 10px;
    }
    .nav-bar.show{
      transform: translateX(30px) translateY(40px);
    }
    .logo{
      margin-bottom: 20px;
    }
}
</style>