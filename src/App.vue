<script setup>
import navBar from './components/base-components/nav-bar.vue';
import { provide, ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const loggedCompany = ref(null);
const loggedWorker = ref(null)
const workersCount = ref(0)
provide('loggedCompany', loggedCompany)
provide('loggedWorker', loggedWorker)
provide('workersCount', workersCount)


// Instancias de router y route
const router = useRouter();
const route = useRoute();

const handlePath = () => {
  if (route.path !== '/loginCompany' && loggedCompany.value === null) {
    router.push('/loginCompany')//Redirigir a Inicio de Sesion si no se ha iniciado
  } else if (route.path.startsWith('/workers') && workersCount.value < 1) {
    router.push('/workers/new-worker')
  }else if (route.path.startsWith('/workers') && loggedWorker.value === null && workersCount > 0) {
    router.push('/workers/login-worker')//Redirigir a Inicio de Sesion si no se ha iniciado
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

</script>

<template>
  <section class="body">
    <transition name="opacity-in" mode="out-in">
      <navBar v-show="loggedCompany" :key="'navbar'"></navBar>
    </transition>
    <transition name="opacity-in" mode="ease-in">
      <router-view :key="route.path"></router-view>
    </transition>
  </section>
</template>

<style>
*{
  font-family: var(--baseFont);
  letter-spacing: .6px;
}
.opacity-in-enter-active,
.opacity-in-leave-active {
  transition: transform 0.8s ease, opacity .8s ease;
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
