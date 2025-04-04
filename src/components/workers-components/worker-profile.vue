    <script setup>
    import { inject, ref, onMounted, watch } from 'vue';
    import workerBillList from './worker-bill-list.vue';
    import axios from 'axios';

    const loggedWorker = inject("loggedWorker", null);
    const workerRole = inject("workerRole", null);
    const loggedDocument = inject("loggedDocument", null)


    const listOption = ref("entrance")


    const bills = ref([])
    const isEmpty = ref(false);

    const getList = async () => {
        let url = "";
        try {
            if (listOption.value === "entrance") {
                url = `http://127.0.0.1:8089/billCreatesWorker/${loggedDocument.value}`;
            } else if (listOption.value === "repaired") {
                url = `http://127.0.0.1:8089/billRepairWorker/${loggedDocument.value}`;
            } else if (listOption.value === "delivery") {
                url = `http://127.0.0.1:8089/billDeliveredWorker/${loggedDocument.value}`;
            }
            const ansawer = await axios.get(url)
            bills.value = ansawer.data
        } catch (error) {
            console.error("📌 Error al obtener teléfonos entregados:", error);
            if (error.response && error.response.status === 500) {
                bills.value = []; // Si no hay datos, lista vacía
            }
        } finally {
            bills.value = [...bills.value]; // Forzar actualización en Vue
        }
    }
    // Observar cambios en deliveredPhone para actualizar isEmpty en tiempo real
    watch(bills, (newVal) => {
        isEmpty.value = newVal.length === 0;
    }, { deep: true });

    onMounted(() => {
        getList()
        isEmpty.value = bills.value.length === 0;
    })
</script>

    <template>
        <section class="info-container">
            <h2>{{ loggedWorker }}</h2>
            <span class="info-span">{{ workerRole }}</span>
            <h3>Facturación:</h3>
            <form @submit.prevent="getList" class="list-options">
                <input type="radio" id="entrance-input" name="list-option" value="entrance" v-model="listOption"
                    @change="getList" class="check-input">
                <label for="entrance-input" class="check-label" title="Lista de facturas ingresados">
                    <ion-icon name="enter"></ion-icon>
                </label>

                <input type="radio" id="repaired-input" name="list-option" value="repaired" v-model="listOption"
                    @change="getList" class="check-input">
                <label for="repaired-input" class="check-label" title="Lista de telefonos reparados">
                    <ion-icon name="construct"></ion-icon>
                </label>

                <input type="radio" id="delivery-input" name="list-option" value="delivery" v-model="listOption"
                    @change="getList" class="check-input">
                <label for="delivery-input" class="check-label" title="Lista de telefonos entregados">
                    <ion-icon name="exit"></ion-icon>
                </label>
            </form>
            <workerBillList :bills="bills" :listOption="listOption" />
            <router-link to="/workers/workers-list" class="worker-list-btn"
                v-if="workerRole === 'Administrador' || workerRole === 'Gerente'" title="Lista de colaboradores">
                <ion-icon name="list"></ion-icon>
            </router-link>
        </section>
    </template>


<style scoped>
.info-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 5px;
    width: 80%;
    border-radius: 10px;
    background: var(--baseGray);
    box-shadow: -25px -25px 51px #242424,
        25px 25px 51px #484848;
    border: 4px solid var(--baseOrange);
}

.info-container h2 {
    color: white;
    font-size: 22px;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.info-span {
    color: var(--secGray);
}

.info-container h3 {
    color: white;
    font-size: 18px;
}

.list-options {
    width: 100%;
    padding: 10px;
    display: flex;
    justify-content: space-around;
}

.check-input {
    display: none;
    /* Oculta el input de tipo radio */
}

.check-label {
    cursor: pointer;
    border-radius: 10px;
    background-color: var(--baseGray);
    border: 2px solid var(--baseOrange);
    padding: 10px;
    transition: 0.3s;
    font-weight: bolder;
    text-transform: capitalize;
    color: var(--secGray);
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Cambia el estilo del label cuando el input radio correspondiente está marcado */
.check-input:checked+.check-label {
    background-color: var(--baseOrange);
    border: 2px solid white;
    color: white;
    scale: 1.04;
    box-shadow: var(--secShadow);
}

.close-sesion-btn {
    all: unset;
    position: absolute;
    bottom: 20px;
    left: 10px;
    background-color: var(--baseOrange);
    padding: 5px 10px;
    color: white;
    display: flex;
    align-items: center;
    border-radius: 5px;
    box-shadow: var(--secShadow);
    gap: 10px;
}

.worker-list-btn {
    all: unset;
    position: absolute;
    top: 20px;
    right: 10px;
    background-color: var(--baseOrange);
    padding: 5px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    box-shadow: var(--secShadow);
    font-size: 1.4rem;
}

@media (min-width: 768px) {
    .info-container {
        gap: 10px;
    }

    .info-container h2 {
        font-size: 1.7rem
    }

    .info-span {
        color: var(--secGray);
        font-size: 1.1rem;
    }

    .info-container h3 {
        font-size: 1.5rem;
    }

    .list-options {
        width: 90%;
    }

    .check-label {
        scale: 1.1;
    }

    /* Cambia el estilo del label cuando el input radio correspondiente está marcado */
    .check-input:checked+.check-label {
        scale: 1.2;
    }

    .close-sesion-btn {
        font-size: 1.3rem;
        padding: 10px 20px;
    }
}

@media (min-width: 1024px) {
    .info-container {
        gap: 0;
        width: 35%;
    }

    .info-container h2 {
        font-size: 1.4rem
    }

    .info-span {
        font-size: .9rem;
    }

    .info-container h3 {
        font-size: 1.1rem;
    }

    .list-options {
        width: 80%;
    }

    .check-label {
        scale: 1;
    }

    /* Cambia el estilo del label cuando el input radio correspondiente está marcado */
    .check-input:checked+.check-label {
        scale: 1.1;
    }

    .check-label:hover {
        background-color: var(--baseOrange);
        box-shadow: var(--secShadow);
        color: white;
        cursor: pointer;
    }

    .close-sesion-btn {
        font-size: 1rem;
        padding: 10px 13px;
        transition: .3s;
        border: 4px solid var(--baseOrange);
    }

    .close-sesion-btn:hover {
        background-color: var(--baseGray);
        cursor: pointer;
    }
}
</style>