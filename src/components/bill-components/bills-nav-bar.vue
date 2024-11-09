<script setup>
import { useRoute } from 'vue-router';

const route = useRoute()

const isActive = (path)=> route.path === path
</script>

<template>
    <nav class="nav">
        <router-link to="/bills/bill-entrance" class="router" :class="{active: isActive('/bills/bill-entrance')}">
            <ion-icon name="enter"></ion-icon>
        </router-link>
        <router-link to="/bills/bill-list" class="router" :class="{active: isActive('/bills/bill-list')}">
            <ion-icon name="albums"></ion-icon>
        </router-link>
        <router-link to="/bills/repairs" class="router" :class="{active: isActive('/bills/repairs')}">
            <ion-icon name="construct"></ion-icon>
        </router-link>
        <router-link to="/bills/deliveries" class="router" :class="{active: isActive('/bills/deliveries')}">
            <ion-icon name="log-out"></ion-icon>
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
    background-color: var(--baseGray);
    border-radius: 10px;
    border: 3px solid var(--baseOrange);
    background: #e0e0e0;
    box-shadow: inset 27px 27px 15px #a6a6a6,
        inset -27px -27px 15px #ffffff;
    backdrop-filter: blur(5px);
    display: flex;
    gap: 40px;
    z-index: 999;
}
.router{
    color: var(--baseGray);
    scale: 1.3;
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.842));
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border: 2px solid transparent;
    transition: all .3s ease-in-out;
}
.router.active{
    color: white;
    background-color: var(--baseGray);
    border-radius: 10px;
    transform: translateY(-5px);
    border-color: var(--baseOrange); 
    box-shadow: var(--secShadow);
}

</style>