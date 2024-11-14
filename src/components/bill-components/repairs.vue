<script setup>
import { inject } from 'vue';

const switchSRC = inject("switchSRC")
</script>

<template>
    <section class="container">
        <h2>REPARACIONES</h2>
        <form @submit.prevent="" class="search-form">
            <label for="search-inp" class="input-container">
                <ion-icon name="albums"></ion-icon>
                <input type="text" id="search-inp" placeholder="Numero de factura" required>
            </label>
            <button>Buscar</button>
        </form>

        <fieldset v-for="i in 6" key="i" class="phone-container">
            <legend>0001-A-{{ i }}</legend>
            <div class="info-container">
                <span>Samsung A14</span>
                <span>Cambio Pantalla</span>
                <span>08/06/2024</span>
            </div>
            <button class="repair-btn" @click="switchSRC('0003-A')"><ion-icon name="construct"></ion-icon></button>
        </fieldset>
    </section>
</template>

<style scoped>
.container {
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
    overflow-y: scroll;
    scrollbar-width: none;
    transition: all .4s ease;
    gap: 10px;
    z-index: 1;
}

.container h2 {
    color: white;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-align: center;
}

.search-form {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 30px;
    align-items: center;
}

.input-container {
    background-color: white;
    padding: 5px 10px;
    display: flex;
    gap: 10px;
    align-items: center;
    border-radius: 5px;
}

.input-container input {
    all: unset;
    text-transform: uppercase;
}

.search-form button {
    background-color: var(--baseOrange);
    color: white;
    border: 2px solid var(--baseOrange);
    border-radius: 5px;
    padding: 5px 10px;
    transition: .3s;
}

.search-form button:active {
    scale: .9;
}
.phone-container{
    border-radius: 5px;
    border: 2px solid var(--secGray);
    background: var(--thirdGray);
    color: white;
    display: flex;
    align-items: center;
    width: 90%;
    justify-content: space-between;
}
.phone-container legend{
    font-size: 1.2rem;
    letter-spacing: 2px;
    padding: 0 5px;
}
.info-container{
    display: flex;
    width: 80%;
    justify-content: space-between;
    flex-wrap: wrap;
}
.repair-btn{
    all: unset;
    background-color: var(--baseOrange);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 5px;
    transition: .2s;
}
.repair-btn:active{
    scale: .9;
}

@media (min-width:768px) {
    *{
        font-size: 1.2rem;
    }
}
@media (min-width: 1024px) {
    *{
        font-size: 1.1rem;
    }
    .container{
        width: 40%;
    }
    button:hover{
        scale: 1.1;
    }
}
</style>