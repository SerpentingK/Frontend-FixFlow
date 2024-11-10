<script setup>
import { inject, ref } from 'vue';


const phones_amount = ref(1)
const selectedBrandName = ref(null)
const selectedModelName = ref(null)
const totalPrice = ref(300000)
const due = ref(150000)

const increasePhonesAmount = () => {
    if ((phones_amount.value + 1) > 5) {
        return;
    }
    phones_amount.value++
}
const decreasePhonesAmount = () => {
    if ((phones_amount.value - 1) < 1) {
        return;
    }
    phones_amount.value--
}

const phones_list = [
    {
        phone_ref: "0001-A-1",
        brand_name: "Samsung",
        device: "Galaxy A21s",
        details: "Pantalla rota",
        price: 500000,           // Precio en pesos colombianos
        delivery_date: "2023-10-20",
        repaired: true,
        delivered: false,
    },
    {
        phone_ref: "0001-A-2",
        brand_name: "Apple",
        device: "iPhone 12",
        details: "Batería dañada",
        price: 450000,           // Precio en pesos colombianos
        delivery_date: "2023-10-18",
        repaired: true,
        delivered: true,
    },
    {
        phone_ref: "0001-A-3",
        brand_name: "Xiaomi",
        device: "Redmi Note 10",
        details: "Problemas de carga",
        price: 300000,           // Precio en pesos colombianos
        delivery_date: "2023-10-25",
        repaired: false,
        delivered: false,
    }
]


const switchSBC = inject("switchSBC")
</script>
<template>
    <section class="container">
        <h2>Facturación</h2>
        <form @submit.prevent="switchSBC" class="bill-form">
            <label for="client-name-inp" class="input-container">
                <ion-icon name="person"></ion-icon>
                <input type="text" id="client-name-inp" required>
            </label>
            <label for="client-tel-inp" class="input-container">
                <ion-icon name="call"></ion-icon>
                <input type="number" id="client-tel-inp" required>
            </label>
            <label for="phone-amount-inp" class="input-container">
                <ion-icon name="phone-portrait"></ion-icon>
                <span style="font-weight: bolder; scale: 1.2;">{{ phones_amount }}</span>
                <span class="btn-container">
                    <button @click="increasePhonesAmount()" class="action-btn" type="button">
                        <ion-icon name="caret-up"></ion-icon>
                    </button>
                    <button @click="decreasePhonesAmount()" class="action-btn" type="button">
                        <ion-icon name="caret-down"></ion-icon>
                    </button>
                </span>
            </label>
            <fieldset class="phone-form" v-for="v in phones_amount" :key="v">
                <legend>Celular {{ v }}</legend>
                <label :for="`brand-select-${v}`" class="phone-input">
                    <label class="select-label">
                        <span>Marca:</span>
                        <select v-model="selectedBrandName" :id="`brand-select-${v}`" required>
                            <option value="Samsung">Samsung</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </label>
                    <label :for="`new-brand-${v}`" class="other-container"
                        :class="{ active: selectedBrandName === 'Otro' }">
                        <span>Nueva marca:</span>
                        <input type="text" placeholder="" class="other-input" :id="`new-brand-${v}`"
                            :disabled="selectedBrandName !== 'Otro'" />
                        <button type="button"><ion-icon name="add-circle"></ion-icon></button>
                    </label>
                </label>
                <label :for="`model-select-${v}`" class="phone-input">
                    <label class="select-label">
                        <span>Modelo:</span>
                        <select v-model="selectedModelName" :id="`model-select-${v}`" required>
                            <option value="A14">A14</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </label>
                    <label :for="`new-model-${v}`" class="other-container"
                        :class="{ active: selectedModelName === 'Otro' }">
                        <span>Nuevo modelo:</span>
                        <input type="text" placeholder="" class="other-input" :id="`new-model-${v}`"
                            :disabled="selectedModelName !== 'Otro'" />
                        <button type="button"><ion-icon name="add-circle"></ion-icon></button>
                    </label>
                    <label :for="`price-inp-${v}`" class="fact-inp">
                        <span>Precio:</span>
                        <input type="number" :id="`price-inp-${v}`" placeholder="100000" required />
                    </label>
                    <label :for="`desc-inp-${v}`" class="fact-inp">
                        <span>Descripción:</span>
                        <input type="text" placeholder="Ej: Pantalla" :id="`desc-inp-${v}`" required />
                    </label>
                </label>
            </fieldset>
            <span class="info-span">
                <span>Total:</span>
                <span>{{ totalPrice }}</span>
            </span>
            <span class="fact-inp">
                <span>Abono:</span>
                <input type="number" required>
            </span>
            <span class="info-span">
                <span>Deuda:</span>
                <span>{{ due }}</span>
            </span>
            <button type="submit" class="go-btn">Generar Factura</button>
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
    justify-content: space-between;
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
    scale: 1.2;
}

.phone-form {
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    border: 1px solid var(--secGray);
    padding: 10px;
    background-color: var(--thirdGray);
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
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 90%;
    flex-wrap: wrap;
}

.select-label {
    display: flex;
    background-color: white;
    padding: 5px 15px;
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
    border-radius: 10px;
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

.other-container ion-icon {
    color: var(--baseGray);
    scale: 1.3;
    transition: .4s;
}

.other-container {
    display: flex;
    align-items: center;
    gap: 5px 15px;
    padding: 5px 15px;
    background-color: var(--secGray);
    color: white;
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

.other-container.active ion-icon {
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

.fact-inp {
    display: flex;
    gap: 10px;
    width: 90%;
    justify-content: space-between;
    color: var(--secGray);
}

.fact-inp input {
    width: 50%;
    border-radius: 5px;
    padding: 5px 10px;
}

.info-span {
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--secGray);
}

.go-btn {
    all: unset;
    background-color: var(--baseOrange);
    color: white;
    padding: 5px 15px;
    border-radius: 5px;
    border: 2px solid var(--baseOrange);
    transition: .3s;
    margin-bottom: 10px;
}

.btn-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 70px;
    gap: 5px;
}

.action-btn {
    all: unset;
    display: flex;
    justify-content: center;
    align-items: center;
    scale: 1.3;
}

input[type=number]::-webkit-inner-spin-button {
    display: none;
}

.action-btn:active ion-icon {
    color: var(--baseGray);
    scale: .7;
}


@media (min-width: 768px) {
    * {
        font-size: 1.3rem;
    }

    .container {
        width: 70%;
        max-height: 80%;
    }

    .select-label,
    .other-container {
        font-size: 1.2rem;
    }

    .phone-form legend {
        font-size: 1.4rem;
    }
}

@media (min-width: 1024px) {
    * {
        font-size: 1rem;
    }

    .select-label,
    .other-container {
        width: 40%;
    }

    .select-label *,
    .other-container * {
        font-size: .8rem;
    }

    .container {
        width: 50%;
        max-height: 70%;
    }

    .phone-form legend {
        font-size: 1rem;
    }


    .input-container {
        width: 50%;
    }

    .phone-input {
        width: 100%;
    }

    .go-btn:hover {
        scale: 1.1;
        background-color: var(--baseGray);
        box-shadow: var(--secShadow);
    }

}
</style>
