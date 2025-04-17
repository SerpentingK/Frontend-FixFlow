<script setup>
import { inject, ref, onMounted } from 'vue';
import axios from 'axios';

const loggedWorker = inject("loggedWorker", null);
const workerRole = inject("workerRole", null);
const loggedDocument = inject("loggedDocument");
const loggedId = inject("loggedId", ref(null));
const selectedPremiseId = inject("selectedPremiseId", ref(null));
const selectedPremise = ref(null);
const dataString = ref(null);

const totalShifts = ref(0);


const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const getWorkerTotalShifts = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/workerTotalShift/${loggedId.value}`);
        totalShifts.value = response.data.count;
    } catch (error) {
        console.error("Error al obtener estadísticas del trabajador:", error);
    }
};

const getWorkerDateEntry = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/workerDateEntry/${loggedId.value}`);
        dataString.value = response.data.Date;
        console.log(response.data.Date);
        console.log(dateString.value);
    } catch (error) {
        console.error("Error al obtener estadísticas del trabajador:", error);
    }
};
onMounted(() => {
    // Cargar el estado del local activo
    const storedPremise = localStorage.getItem("activePremise");
    if (storedPremise) {
        const premise = JSON.parse(storedPremise);
        selectedPremise.value = premise.name;
        selectedPremiseId.value = premise.id;
    }
    getWorkerTotalShifts();
    getWorkerDateEntry();
});
</script>

<template>
    <section class="info-container">
        <div class="profile-header">
            <h2>{{ loggedWorker }}</h2>
            <router-link to="/workers/workers-list" class="worker-list-btn"
                v-if="workerRole === 'Administrador' || workerRole === 'Gerente'" title="Lista de colaboradores">
                <ion-icon name="list"></ion-icon>
            </router-link>
        </div>

        <div class="profile-info">
            <div class="info-card">
                <ion-icon name="card-outline"></ion-icon>
                <div class="info-content">
                    <h3>Documento</h3>
                    <p>{{ loggedDocument }}</p>
                </div>
            </div>

            <div class="info-card">
                <ion-icon name="briefcase-outline"></ion-icon>
                <div class="info-content">
                    <h3>Rol</h3>
                    <p>{{ workerRole }}</p>
                </div>
            </div>

            <div class="info-card">
                <ion-icon name="time-outline"></ion-icon>
                <div class="info-content">
                    <h3>Turnos Realizados</h3>
                    <p>{{ totalShifts }}</p>
                </div>
            </div>

            <div class="info-card">
                <ion-icon name="calendar-outline"></ion-icon>
                <div class="info-content">
                    <h3>Fecha de Ingreso</h3>
                    <p>{{ formatDate(dataString) }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.info-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 500px;
    padding: 2rem;
    border-radius: 1rem;
    background: var(--second);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 4px solid var(--base);
    overflow-y: auto;
    scrollbar-width: none;
}

.profile-header {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.profile-header h2 {
    color: var(--base);
    font-size: 1.5rem;
    text-align: center;
    margin: 0;
    font-weight: bolder;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.profile-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.info-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    transition: transform 0.3s ease;
}

.info-card:hover {
    transform: translateX(5px);
}

.info-card ion-icon {
    font-size: 1.5rem;
    color: var(--base);
}

.info-content {
    flex: 1;
}

.info-content h3 {
    color: var(--secondTwo);
    font-size: 0.9rem;
    margin: 0;
    font-weight: 500;
}

.info-content p {
    color: white;
    font-size: 1.1rem;
    margin: 0.2rem 0 0 0;
    font-weight: 500;
}

.worker-list-btn {
    all: unset;
    position: absolute;
    right: 0;
    background-color: var(--base);
    padding: 0.75rem 1.5rem;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.worker-list-btn:hover {
    background: var(--secondTwo);
    transform: translateY(-2px);
}

.worker-list-btn:active {
    transform: scale(0.95);
}

@media (min-width: 768px) {
    .info-container {
        width: 80%;
        max-width: 600px;
        max-height: 80vh;
    }

    .profile-header h2 {
        font-size: 1.75rem;
    }

    .info-card {
        padding: 1.5rem;
    }

    .info-card ion-icon {
        font-size: 2rem;
    }

    .info-content h3 {
        font-size: 1rem;
    }

    .info-content p {
        font-size: 1.2rem;
    }
}

@media (min-width: 1024px) {
    .info-container {
        width: 70%;
        max-width: 500px;
        max-height: 85vh;
    }

    .profile-info {
        flex-direction: row;
        flex-wrap: wrap;
    }

    .info-card {
        flex: 1;
        min-width: 200px;
    }
}

@media (min-width: 1280px) {
    .info-container {
        width: 40%;
        max-width: 450px;
        max-height: 90vh;
    }
}
</style>