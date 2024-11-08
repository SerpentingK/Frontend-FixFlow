<template>
    <nav class="nav">
        <ion-icon name="grid"></ion-icon>
        <router-link to="/bills/bill-entrance" class="router" id="entrance-router">
            <ion-icon name="enter"></ion-icon>
        </router-link>
        <router-link to="/bills/bill-list" class="router" id="list-router">
            <ion-icon name="albums"></ion-icon>
        </router-link>
    </nav>
</template>
<style scoped>
/*
.nav {
    position: fixed;
    bottom: -1%;
    padding: 10px 20px;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--baseGray);
    border-radius: 10px;
    border: 3px solid var(--baseGray);
    background: #e0e0e0;
    box-shadow: inset 27px 27px 15px #a6a6a6,
        inset -27px -27px 15px #ffffff;
    backdrop-filter: blur(5px);
    display: flex;
    gap: 40px;
}
.router{
    color: white;
    filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.842));
}
*/
.nav{
    position: fixed;
    bottom: 0;
    right: 0;
    padding: 10px;
    transform: translate(-50%, -50%);
    background-color: var(--baseOrange);
    display: flex;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;
    color: white;
    transition: .3s;
    font-size: 25px;
    border: 4px solid transparent;
}
.router{
    position: absolute;
    transition: opacity .8s ease, transform .4s ease-in;
    color: var(--baseGray);
    background-color: white;
    border: 4px solid var(--baseGray);
    display: flex;
    padding: 10px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1);
    border-radius: 50%;
    opacity: 0;
}
.nav:hover #entrance-router{
    opacity: 1;
    transform: translateX(-100px) translateY(-50%);
}
.nav:hover #list-router{
    opacity: 1;
    transform: translateY(-100px) translateX(-50%);
}

</style>