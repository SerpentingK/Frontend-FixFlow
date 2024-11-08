<script setup>
import { ref } from 'vue';

const phones_amount = ref(1)
const selectedBrandName = ref(null)
const selectedModelName = ref(null)
</script>
<template>
    <section class="container">
        <h2>Facturación</h2>
        <form @submit.prevent="" class="bill-form">
            <label for="client-name-inp" class="input-container">
                <ion-icon name="person"></ion-icon>
                <input type="text" id="client-name-inp">
            </label>
            <label for="client-tel-inp" class="input-container">
                <ion-icon name="call"></ion-icon>
                <input type="number" id="client-tel-inp">
            </label>
            <label for="phone-amount-inp" class="input-container">
                <ion-icon name="phone-portrait"></ion-icon>
                <input v-model="phones_amount" type="number" placeholder="CANTIDAD DISPOSITIVOS" min="1" max="5"
                    id="cant-inp" />
            </label>
            <fieldset class="phone-form" v-for="v in phones_amount" :key="v">
                <legend>Celular {{ v }}</legend>
                <label :for="`brand-select-${v}`" class="phone-input">
                    <label class="select-label">
                        <span>Seleccione una marca:</span>
                        <select v-model="selectedBrandName" id="`brand-select-${v}`">
                            <option value="Otro">Otro</option>
                        </select>
                    </label>
                    <label for="`new-brand-${v}`" class="other-container"
                        :class="{ active: selectedBrandName === 'Otro' }">
                        <span>Nueva marca:</span>
                        <input type="text" placeholder="Nueva marca" class="other-input" id="`new-brand-${v}`" />
                        <button type="button"><ion-icon name="add-circle"></ion-icon></button>
                    </label>
                </label>
                <label :for="`model-select-${v}`" class="phone-input">
                    <label class="select-label">
                        <span>Seleccione un modelo:</span>
                        <select v-model="selectedModelName" id="`model-select-${v}`">
                            <option value="Otro">Otro</option>
                        </select>
                    </label>
                    <label for="`new-model-${v}`" class="other-container"
                        :class="{ active: selectedModelName === 'Otro' }">
                        <span>Nuevo modelo:</span>
                        <input type="text" placeholder="Nueva marca" class="other-input" id="`new-model-${v}`" />
                        <button type="button"><ion-icon name="add-circle"></ion-icon></button>
                    </label>
                </label>
            </fieldset>
        </form>
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
    background: #363636;
    box-shadow: -25px -25px 51px #242424,
        25px 25px 51px #484848;
    border: 4px solid var(--baseOrange);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 70%;
    overflow-y: scroll;
    scrollbar-width: none;
    transition: max-height .4s ease;
}

.container h2 {
    color: white;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.bill-form {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    gap: 15px;
}

.input-container {
    background-color: white;
    padding: 8px 10px;
    width: 80%;
    border-radius: 8px;
    display: flex;
    align-items: center;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
}

.input-container input {
    all: unset;
    width: 100%;
    padding: 0 10px;
    font-size: 1rem;
}

.input-container ion-icon {
    font-size: 1.2rem;
    color: var(--baseOrange);
}

.phone-form {
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    border: 1px solid #565656;
    padding: 10px;
    background-color: #404040;
    width: 90%;
    gap: 10px;
    align-items: center;
}

.phone-form legend {
    color: white;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
    padding: 5px 10px;
    font-size: 1rem;
}

.phone-input {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.select-label {
    display: flex;
    background-color: white;
    padding: 8px;
    border-radius: 8px;
    width: 90%;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
}

.select-label span {
    color: #333;
    font-weight: 500;
}

.select-label select {
    border: none;
    background: transparent;
    font-size: 1rem;
    color: #333;
    width: 60%;
    outline: none;
    appearance: none;
    padding-left: 10px;
}

.select-label select:focus {
    outline: none;
}

.other-container {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 8px;
    background-color: #e8e8e8;
    border-radius: 8px;
    width: 90%;
    margin-top: 5px;
    transition: .3s;
}

.other-container.active {
    display: flex;
    background-color: var(--baseOrange);
    color: white;
}
.other-container.active ion-icon{
    color: white;
    font-size: 1.2rem;
    margin-left: 5px;
}

.other-input {
    all: unset;
    width: 100%;
    padding: 0 10px;
    font-size: 1rem;
    color: #333;
    background-color: #f3f3f3;
    border-radius: 5px;
}

.other-container button {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--baseOrange);
}

.other-container button ion-icon {
    font-size: 1.2rem;
}
</style>
