<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted, onBeforeUnmount } from 'vue';

const route = useRoute();
const router = useRouter();

const isActive = (path)=> route.path.startsWith(path);

const handleKeyPress = (event) => {
  // Verificar si el elemento activo es un input o textarea
  const activeElement = document.activeElement;
  const isInput = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';
  
  if (isInput) return;
  
  switch (event.key.toLowerCase()) {
    case 'a':
      router.push('/bills/bill-entrance');
      break;
    case 's':
      router.push('/bills/bill-list');
      break;
    case 'd':
      router.push('/bills/outflows/sales');
      break;
    case 'f':
      router.push('/bills/brands');
      break;
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyPress);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyPress);
});
</script>

<template>
    <nav class="nav">
        <router-link to="/bills/bill-entrance" class="router" :class="{active: isActive('/bills/bill-entrance')}" title="Entrada de facturas">
            <ion-icon name="enter"></ion-icon>
            <span class="keyboard-shortcut">A</span>
        </router-link>
        <router-link to="/bills/bill-list" class="router" :class="{active: isActive('/bills/bill-list')}" title="Lista de facturas">
            <ion-icon name="albums"></ion-icon>
            <span class="keyboard-shortcut">S</span>
        </router-link>
        <router-link to="/bills/outflows/sales" class="router" :class="{active: isActive('/bills/outflows')}" title="Ventas y salidas">
            <ion-icon name="log-out"></ion-icon>
            <span class="keyboard-shortcut">D</span>
        </router-link>
        <router-link to="/bills/brands" class="router" :class="{active: isActive('/bills/brands')}" title="Marcas">
            <ion-icon name="pricetags"></ion-icon>
            <span class="keyboard-shortcut">F</span>
        </router-link>
    </nav>
</template>
<style scoped>
.nav {
    position: fixed;
    bottom: -1%;
    padding: 10px 20px;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--second);
    border-radius: 10px;
    border: 3px solid var(--base);
    background: #e0e0e0;
    box-shadow: inset 27px 27px 15px #a6a6a6,
        inset -27px -27px 15px #ffffff;
    backdrop-filter: blur(5px);
    display: flex;
    gap: 40px;
    z-index: 11;
}
.router{
    color: var(--second);
    scale: 1.3;
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.842));
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border: 2px solid transparent;
    transition: all .3s ease-in-out;
    position: relative;
}
.router.active{
    color: white;
    background-color: var(--second);
    border-radius: 10px;
    transform: translateY(-5px);
    border-color: var(--base); 
    box-shadow: var(--secShadow);
}

.keyboard-shortcut {
    position: absolute;
    bottom: -12px;
    right: -3px;
    font-size: 10px;
    background-color: rgba(255, 255, 255, 0.4);
    padding: 2px 4px;
    border-radius: 3px;
    display: block;
    color: var(--base);
    font-weight: bold;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.5);
    letter-spacing: 0.5px;
}
</style>