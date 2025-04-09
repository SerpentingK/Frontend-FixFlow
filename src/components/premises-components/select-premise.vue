<script>
import { inject } from 'vue';

export default {
    setup() {
        const switchSLP = inject("switchSLP");
        const premisesCount = inject("premisesCount");

        return {
            premisesCount,
            switchSLP
        };
    }
};
</script>

<template>
    <section class="container">
        <h2>Locales Registrados</h2>
        <ol class="locals-list">
            <li v-for="i in premisesCount" :key="i">
                <fieldset class="local-card" @click="switchSLP('Local 1')">
                    <legend>Local {{ i }}</legend>
                    <ion-icon name="storefront"></ion-icon>
                    <span>Dirección: Calle 12 #25-40</span>
                </fieldset>
            </li>
        </ol>
    </section>
    <router-link to="/premises/new-premise" class="new-local-btn">
        <ion-icon name="add-circle-outline"></ion-icon>
    </router-link>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 5px;
    width: 80%;
    border-radius: 10px;
    background: var(--second);
    box-shadow: -25px -25px 51px #242424, 25px 25px 51px #484848;
    border: 4px solid var(--base);
    max-height: 80%;
    overflow: scroll;
    scrollbar-width: none;
}

.container h2 {
    color: white;
    text-transform: uppercase;
    font-size: 1.3rem;
    text-align: center;
    letter-spacing: 2px;
    margin-bottom: 15px;
}

.locals-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 90%;
}

.local-card {
    border: 2px solid var(--secondTwo);
    background-color: var(--secondThree);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: center;
    align-items: center;
    padding: 15px;
    cursor: pointer;
}

.local-card legend {
    background-color: var(--secondThree);
    border-radius: 5px;
    padding: 2px 8px;
    color: white;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 1rem;
}

.local-card span {
    color: var(--secondTwo);
    font-size: 1rem;
}

.local-card ion-icon {
    font-size: 60px;
    color: var(--base);
}

.new-local-btn {
  position: absolute;
  bottom: 15px;
  right: 15px;
  background-color: var(--base);
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: var(--secShadow);
  transition: transform 0.3s;
  text-decoration: none;
}

.new-local-btn:hover {
  transform: scale(1.05);
}

.new-local-btn ion-icon {
  font-size: 1.2rem;
}


@media (min-width: 1024px) {
    .container {
        width: 50%;
    }
}
</style>
