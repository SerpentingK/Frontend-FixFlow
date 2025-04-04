<script setup>
import axios from 'axios';
import { inject, watch, ref, onMounted } from 'vue';

const phonesRepaired = inject('phonesRepaired');
const repairBrand = inject("repairBrand");
const repairRef = inject("repairRef");
const repairDevice = inject("repairDevice");
const startShift = inject('startShift');
const bill_number = ref("");
const infoBill = inject('infoBill');

watch(repairRef, async (newVal) => {
    console.log("repairRef actualizado:", newVal);
});

watch(repairBrand, async (newVal) => {
    console.log("repairBrand actualizado:", newVal);
});

watch(repairDevice, async (newVal) => {
    console.log("repairDevice actualizado:", newVal);
});

const switchSRC = inject("switchSRC");

watch(phonesRepaired, (newVal) => {
    localStorage.setItem("phonesRepaired", JSON.stringify(newVal));
});

const updateRepaired = () => {
    phonesRepaired.value++;
    localStorage.setItem("phonesRepaired", JSON.stringify(phonesRepaired.value));
};

const getbillnumber = async () => {
    const ansawer = await axios.get(`http://127.0.0.1:8089/getBillNumber/${repairRef.value}`);
    bill_number.value = ansawer.data[0].bill_number;
};

const repairPhone = async () => {
    const ansawer = await axios.put(`http://127.0.0.1:8089/repairphone/${repairRef.value}/${startShift.value}/${bill_number.value}`);
    // Actualizar el estado del teléfono en infoBill
    const phone = infoBill.value.phones.find(p => p.phone_ref === repairRef.value);
    if (phone) {
        phone.repaired = true;
    }
    switchSRC();
};

onMounted(getbillnumber);

onMounted(() => {
    const storedRepaired = localStorage.getItem("phonesRepaired");
    if (storedRepaired) phonesRepaired.value = JSON.parse(storedRepaired);
});

</script>

<template>
    <section class="container">
        <h3>¿Confirmar reparacion?</h3>
        <div style="width: 100%; display: flex; justify-content: space-evenly; padding: 10px 0; color: white;">
            <span>{{ repairRef.split('-').slice(1).join('-') }}</span>
            <span>{{ repairBrand }} {{ repairDevice }}</span>
        </div>
        <div style="width: 100%; display: flex; justify-content: space-around; padding: 10px 0;" class="btns">
            <button @click="switchSRC()">Cancelar</button>
            <button @click="repairPhone(); updateRepaired()" class="confirm-btn">Confirmar</button>
        </div>
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
    z-index: 10;
}

h3 {
    color: white;
    text-transform: uppercase;
    font-size: 1.3rem;
    text-align: center;
    letter-spacing: 2px;
}
.btns button{
    border: 2px solid var(--baseOrange);
    background-color: transparent;
    padding: 5px 10px;
    color: white;
    text-transform: uppercase;
    font-weight: bolder;
    letter-spacing: 1.5px;
    border-radius: 5px;
    transition: .3s;
}
.btns button:active{
    scale: .9;
}
button.confirm-btn{
    background-color: var(--baseOrange);
}
@media (min-width: 1024px) {
    .container{
        width: 25%;
    }
    
    button:hover{
        scale: 1.1;
    }
}
</style>