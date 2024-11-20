<script>
import { inject, ref, onMounted } from 'vue';
import axios from 'axios';

export default{
    setup(){
    const workerRole = inject("workerRole", ref(null))
    const loggedCompany = inject("loggedCompany", ref(null));

    const showDeleteWindow = ref(false)

    const switchSDW = () => {
        showDeleteWindow.value = !showDeleteWindow.value
    }

    const workers = ref([]);

    onMounted(async () => {
    await fetchWorkers();
    });

    const fetchWorkers = async () => {
    try {
        const answer = await axios.get(`http://127.0.0.1:8000/collaborators/${loggedCompany.value}/workers`);
        workers.value = answer.data;
        console.log(workers.value)
    } catch (error) {
        console.error(error);
    }
    };


    return{
        workers,
        workerRole,
        switchSDW
    }
    }
}


</script>

<template>
    <section class="container">
        <h2>Lista de  <br>colaboradores</h2>
        <ol class="workers-list">
            <li v-for="worker in workers" :key="worker.document">
                <fieldset class="worker-li">
                    <legend>{{ worker.wname }}</legend>
                    <span>Rol: {{ worker.wrole }}</span>
                    <span>Documento: {{ worker.document }}</span>
                    <button class="delete-btn" @click="switchSDW()"><ion-icon name="close-circle"></ion-icon></button>
                </fieldset>
            </li>
        </ol>
        <transition name="fade">
            <div class="delete-window" v-if="showDeleteWindow" style="padding: 15px;">
                <h3>¿Eliminar técnico?</h3>
                <span>
                    <button @click="switchSDW()" class="cancel-btn">No</button>
                    <button @click="switchSDW()" class="confirm-btn">Sí</button>
                </span>
            </div>
        </transition>
        <router-link to="/workers/new-worker" class="add-btn">
            <ion-icon name="add-circle"></ion-icon>
        </router-link>
    </section>
</template>

<style scoped>
.container,
.delete-window {
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
    background: var(--baseGray);
    box-shadow: -25px -25px 51px #242424,
        25px 25px 51px #484848;
    border: 4px solid var(--baseOrange);
    max-height: 80%;
    overflow: scroll;
    scrollbar-width: none;
}

.delete-window span {
    width: 100%;
    display: flex;
    justify-content: space-evenly;
}

.delete-window button {
    all: unset;
    padding: 10px 20px;
    border-radius: 5px;
    border: 2px solid var(--baseOrange);
    color: white;
    cursor: pointer;
}

button.cancel-btn {
    background-color: var(--baseOrange);
}
.container h2,
.delete-window h3 {
    color: white;
    text-transform: uppercase;
    font-size: 1.3rem;
    text-align: center;
    letter-spacing: 2px;
}

.workers-list {
    list-style: none;
    padding: 0;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 90%;
}

.worker-li {
    border: 2px solid var(--secGray);
    background-color: var(--thirdGray);
    border-radius: 5px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: space-between;
}

.worker-li legend {
    background-color: var(--thirdGray);
    border-radius: 5px;
    padding: 2px 8px;
    color: white;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.worker-li span {
    color: var(--secGray);
    font-size: 1rem;
}

.delete-btn {
    all: unset;
    color: var(--baseOrange);
    scale: 1.5;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
.add-btn{
    position: absolute;
    left: 10px;
    top: 10px;
    color: white;
    font-size: 2rem;
}
@media (min-width: 1024px){
    .container{
        width: 50%;
    }
}
</style>