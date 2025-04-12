<script>
import { inject, ref } from 'vue';

export default {
    setup() {
        const switchSLP = inject("switchSLP");
        const premisesCount = inject("premisesCount");
        const workerRole = inject("workerRole")
        const selectedPremise = inject("selectedPremise");
        const switchSVI = inject("switchSVI");
        const switchSAPM = inject("switchSAPM");

        // Estados para los modales
        const showLogoutModal = ref(false);
        const showEditModal = ref(false);
        const showDeactivateModal = ref(false);
        const currentPremiseId = ref(null);
        const editForm = ref({
            name: '',
            address: ''
        });

        const editPremise = (id) => {
            currentPremiseId.value = id;
            editForm.value = {
                name: `Local ${id}`,
                address: 'Calle 12 #25-40' // Aquí deberías obtener la dirección real
            };
            showEditModal.value = true;
        };

        const saveEditPremise = () => {
            // Aquí iría la lógica para guardar los cambios
            console.log("Guardando cambios para local", currentPremiseId.value, editForm.value);
            showEditModal.value = false;
        };

        const deactivatePremise = (id) => {
            currentPremiseId.value = id;
            showDeactivateModal.value = true;
        };

        const confirmDeactivate = () => {
            // Aquí iría la lógica para desactivar el local
            console.log("Desactivando local", currentPremiseId.value);
            showDeactivateModal.value = false;
        };

        const confirmLogout = () => {
            selectedPremise.value = null;
            showLogoutModal.value = false;
        };

        return {
            premisesCount,
            switchSLP,
            editPremise,
            deactivatePremise,
            workerRole,
            selectedPremise,
            switchSVI,
            showLogoutModal,
            showEditModal,
            showDeactivateModal,
            editForm,
            saveEditPremise,
            confirmDeactivate,
            confirmLogout,
            switchSAPM
        };
    }
};
</script>

<template>
    <section class="container">
        <h2>Selecciona un local</h2>
        <ol class="premises-list">
            <li v-for="i in premisesCount" :key="i">
                <fieldset class="premise-card" :class="{ selected: selectedPremise === `Local ${i}` }">
                    <legend>Local {{ i }}</legend>
                    <ion-icon name="storefront"></ion-icon>
                    <span>Dirección: Calle 12 #25-40</span>
                    <div class="premise-btns">
                        <button class="action-btn logout" @click="showLogoutModal = true" title="Cerrar Sesion"
                            :class="{ selected: selectedPremise === `Local ${i}` }">
                            <ion-icon name="close"></ion-icon>
                        </button>
                        <button class="action-btn login" @click="switchSLP(`Local ${i}`)" title="Iniciar sesión"
                            :class="{ selected: selectedPremise === `Local ${i}` }">
                            <ion-icon name="log-in-outline"></ion-icon>
                        </button>
                        <button class="action-btn edit" @click="editPremise(i)" title="Editar local"
                            v-if="workerRole === 'Gerente'">
                            <ion-icon name="create-outline"></ion-icon>
                        </button>
                        <button class="action-btn deactivate" @click="deactivatePremise(i)" title="Desactivar local"
                            v-if="workerRole === 'Gerente'">
                            <ion-icon name="lock-closed-outline"></ion-icon>
                        </button>
                        <button class="action-btn vault" @click="switchSVI" title="Vaul"
                            v-if="workerRole === 'Gerente'">
                            <ion-icon name="cash-outline"></ion-icon>
                        </button>
                    </div>
                </fieldset>
            </li>
        </ol>
    </section>
    <button @click="switchSAPM" class="new-premise-btn">
        <ion-icon name="add-circle-outline"></ion-icon>
    </button>

    <!-- Modal de Cierre de Sesión -->
    <div class="modal" v-if="showLogoutModal">
        <div class="modal-content">
            <h3>Confirmar Cierre de Sesión</h3>
            <p>¿Estás seguro que deseas cerrar sesión en este local?</p>
            <div class="modal-buttons">
                <button @click="confirmLogout" class="confirm-btn">Confirmar</button>
                <button @click="showLogoutModal = false" class="cancel-btn">Cancelar</button>
            </div>
        </div>
    </div>

    <!-- Modal de Edición -->
    <div class="modal" v-if="showEditModal">
        <div class="modal-content">
            <h3>Editar Local</h3>
            <form @submit.prevent="saveEditPremise">
                <div class="form-group">
                    <label for="premiseName">Nombre del Local:</label>
                    <input type="text" id="premiseName" v-model="editForm.name" required>
                </div>
                <div class="form-group">
                    <label for="premiseAddress">Dirección:</label>
                    <input type="text" id="premiseAddress" v-model="editForm.address" required>
                </div>
                <div class="modal-buttons">
                    <button type="submit" class="confirm-btn">Guardar</button>
                    <button type="button" @click="showEditModal = false" class="cancel-btn">Cancelar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal de Desactivación -->
    <div class="modal" v-if="showDeactivateModal">
        <div class="modal-content">
            <h3>Confirmar Desactivación</h3>
            <p>¿Estás seguro que deseas desactivar este local? Esta acción no se puede deshacer.</p>
            <div class="modal-buttons">
                <button @click="confirmDeactivate" class="confirm-btn">Confirmar</button>
                <button @click="showDeactivateModal = false" class="cancel-btn">Cancelar</button>
            </div>
        </div>
    </div>
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

.premises-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 90%;
}

.premise-card {
    border: 2px solid var(--secondTwo);
    background-color: var(--secondThree);
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
}

.premise-card.selected {
    background-color: var(--successColor);
}

.premise-card.selected span,
.premise-card.selected ion-icon {
    color: white;
}

.premise-card.selected legend {
    background-color: var(--successColor);
}

.premise-card legend {
    background-color: var(--secondThree);
    border-radius: 5px;
    padding: 2px 8px;
    color: white;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 1rem;
}

.premise-card span {
    color: var(--secondTwo);
    font-size: 1rem;
}

.premise-card ion-icon {
    font-size: 60px;
    color: var(--base);
}

.new-premise-btn {
    all: unset;
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

.new-premise-btn:hover {
    transform: scale(1.05);
}

.new-premise-btn ion-icon {
    font-size: 1.2rem;
}

.premise-btns {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    justify-content: center;
}

.action-btn {
    padding: 3px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
}

.action-btn ion-icon {
    color: white;
    font-size: 1.5rem;
}

.action-btn.login {
    background-color: var(--successColor);
}
.login.selected{
    display: none;
}

.action-btn.edit {
    background-color: var(--warningColor);
}
.action-btn.logout {
    background-color: var(--errorColor);
}

.action-btn.deactivate {
    background-color: var(--errorColor);
}

.action-btn.vault {
    background-color: var(--base);
}

.action-btn:hover {
    filter: brightness(1.1);
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: var(--second);
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    max-width: 500px;
    border: 2px solid var(--base);
}

.modal-content h3 {
    color: white;
    margin-bottom: 15px;
    text-align: center;
}

.modal-content p {
    color: var(--secondTwo);
    margin-bottom: 20px;
    text-align: center;
}

.modal-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
}

.confirm-btn, .cancel-btn {
    padding: 8px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: transform 0.2s;
}

.confirm-btn {
    background-color: var(--successColor);
    color: white;
}

.cancel-btn {
    background-color: var(--errorColor);
    color: white;
}

.confirm-btn:hover, .cancel-btn:hover {
    transform: scale(1.05);
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    color: white;
    margin-bottom: 5px;
}

.form-group input {
    width: 100%;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid var(--base);
    background-color: var(--secondThree);
    color: white;
}

.form-group input:focus {
    outline: none;
    border-color: var(--successColor);
}

@media (min-width: 1024px) {
    .container {
        width: 50%;
    }
}
</style>
