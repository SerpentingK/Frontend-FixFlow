<script setup>
import navBar from './components/base-components/nav-bar.vue';
import { provide, ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const loggedCompany = ref(null);
const loggedWorker = ref(null)
const workersCount = ref(0)
provide('loggedCompany', loggedCompany)
provide('loggedWorker', loggedWorker)


// Instancias de router y route
const router = useRouter();
const route = useRoute();

const handlePath = () => {
  if(route.path !== '/loginCompany' && loggedCompany.value === null){
    router.push('/loginCompany')//Redirigir a Inicio de Sesion si no se ha iniciado
  }else if(route.path.startsWith('/workers') && workersCount.value === 0){
    router.push('/workers/new-worker')
  }
  else if(route.path.startsWith('/workers')  && loggedWorker.value === null){
    router.push('/workers/login-worker')//Redirigir a Inicio de Sesion si no se ha iniciado
  }
}
onMounted(() => {
  handlePath();
});
watch(
  () => route.path,
  (newPath) => {
    handlePath();
  }
);
</script>

<template>
  <section class="body">
    <navBar v-if="loggedCompany"></navBar>
    <router-view></router-view>
  </section>
</template>

<style scoped>
</style>
