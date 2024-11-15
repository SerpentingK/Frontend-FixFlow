<script setup>
import { useRoute } from 'vue-router';

const route = useRoute()

const isActive = (path) => route.path === path
</script>

<template>
    <section class="container">
        <h2>Entregas y Ventas</h2>
        <nav class="outs-nav">
            <router-link to="/bills/outflows/deliveries" class="router" :class="{active: isActive('/bills/outflows/deliveries')}">
                <ion-icon name="phone-portrait"></ion-icon>
                <span>Entregas</span>
            </router-link>
            <router-link to="/bills/outflows/sales" class="router" :class="{active: isActive('/bills/outflows/sales')}">
                <ion-icon name="cash"></ion-icon>
                <span>Ventas</span>
            </router-link>
        </nav>
        <router-view></router-view>
    </section>
</template>

<style scoped>
.container{
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 5px 20px;
    width: 80%;
    border-radius: 10px;
    background: var(--baseGray);
    box-shadow: -25px -25px 51px #242424,
        25px 25px 51px #484848;
    border: 4px solid var(--baseOrange);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 70%;
    transition: all .4s ease;
    gap: 10px;
    z-index: 1;
}
.container h2{
    color: white;
    text-align: center;
    letter-spacing: 2px;
    font-size: 1.3rem;
    text-transform: uppercase;
}
.outs-nav{
    display: flex;
    width: 90%;
    justify-content: space-around;
}
.router{
    all: unset;
    color: white;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: .3s;
    border: 2px solid var(--baseOrange);
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
}
.router:active{
    scale: .9;
}
.router.active{
    background: var(--baseOrange);
    scale: 1.1;
    box-shadow: var(--secShadow);
}

@media (min-width: 1024px){
    .container{
        width: 40%;
    }
    .outs-nav{
        width: 60%;
    }
}
</style>