<script>
import { inject, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
    setup() {
        const showAlert = inject("showAlert");
        const workersCount = inject("workersCount", ref(0));
        const loggedWorker = inject("loggedWorker", ref(null))
        const loggedDocument = inject("loggedDocument", ref(null))
        const loggedId = inject("loggedId", ref(null))
        const workerRole = inject("workerRole", ref(null))
        const loggedCompany = inject("loggedCompany", ref(null));
        const startShift = inject("startShift", ref(null));
        const selectedPremiseId = inject("selectedPremiseId", ref(null))
        const premiseCount = inject("premiseCount", ref(0))
        const sessionworker = ref({
            document: "",
            password: "",
            premise_id: selectedPremiseId.value
        });
        const msg = ref("");

        const router = useRouter()

        const loginWorker = async () => {
            try {
                // Crear un objeto con los datos básicos
                const loginData = {
                    document: sessionworker.value.document,
                    password: sessionworker.value.password
                };    
                // Añadir ref_premise solo si existe
                if (sessionworker.value.premise_id) {
                    loginData.premise_id = sessionworker.value.premise_id;
                }
                if (workersCount.value !== 0) {
                    const answer = await axios.post(`${import.meta.env.VITE_API_URL}/loginWorker/${loggedCompany.value}`, loginData);
                    
                    // Guardar datos del trabajador
                    loggedDocument.value = answer.data.document;
                    localStorage.setItem("loggedDocument", JSON.stringify(answer.data.document));
                    msg.value = answer.data.status;
                    loggedId.value = answer.data.id;
                    localStorage.setItem("loggedId", JSON.stringify(answer.data.id));
                    loggedWorker.value = answer.data.wname;
                    localStorage.setItem("loggedWorker", JSON.stringify(answer.data.wname));
                    workerRole.value = answer.data.role;
                    localStorage.setItem("workerRole", JSON.stringify(answer.data.role));
                    startShift.value = answer.data.shift;
                    localStorage.setItem("startShift", JSON.stringify(answer.data.shift));
                
                    // Si no hay locales, redirigir a crear local
                    if (premiseCount.value === 0) {
                        if(workerRole.value === "Gerente"){
                            router.push('/premises/new-premise');
                        }else{
                            showAlert("2", "No tienes permisos para registrar locales.\n Comuniquese con su Gerente");
                            router.push('/workers/worker-profile');
                            return;
                        }
                    }
                    if(premiseCount.value != 0){
                        router.push('/premises/select-premise');
                    }
                    
                    // Si hay local seleccionado, permitir acceso a facturas
                    router.push('/workers/worker-profile');
                } else {
                    showAlert("2", "Necesitas iniciar en un local para empezar un turno")
                }

            } catch (error) {
                if (error.response && error.response.data) {
                    showAlert("2", `Error al iniciar sesión: ${error.response.data.detail}`);
                    console.error("Error al iniciar sesión", error.response.data);
                } else {
                    showAlert("2", "Ha ocurrido un error inesperado. Inténtalo de nuevo.");
                    console.error(error);
                }
            }
        }
        onMounted(() => {
            const storedDocument = localStorage.getItem("loggedDocument");
            const storedWorker = localStorage.getItem("loggedWorker");
            const storedRole = localStorage.getItem("workerRole");
            const storedShift = localStorage.getItem("startShift");

            if (storedDocument && storedWorker && storedRole && storedShift) {
                loggedDocument.value = JSON.parse(storedDocument);
                loggedWorker.value = JSON.parse(storedWorker);
                workerRole.value = JSON.parse(storedRole);
                startShift.value = JSON.parse(storedShift);

                // 🔄 Forzar actualización de Vue
                setTimeout(() => {
                    router.push("/workers/worker-profile");
                }, 100);
            }
        });

        return {
            loginWorker,
            sessionworker
        }
    }
}

</script>
<template>
    <section class="auth-container">
        <div class="auth-content">
            <h2 class="auth-title">INICIO DE TURNO</h2>
            <div class="auth-messages">
                <span class="auth-message">Ingrese con su documento y contraseña</span>
                <span class="auth-message">Si no se encuentra registrado comuniquese con un Administrador</span>
            </div>
            <form @submit.prevent="loginWorker()" class="auth-form">
                <div class="form-group">
                    <label for="doc-inp" class="input-wrapper">
                        <ion-icon name="finger-print"></ion-icon>
                        <input v-model="sessionworker.document" type="text" placeholder="Documento" required />
                    </label>
                    <label for="pasw-inp" class="input-wrapper">
                        <ion-icon name="lock-closed"></ion-icon>
                        <input v-model="sessionworker.password" type="password" placeholder="Contraseña" required />
                    </label>
                </div>
                <div class="button-group">
                    <button type="submit" class="btn-primary">Iniciar Turno</button>
                </div>
            </form>
        </div>
    </section>
</template>
<style scoped>
.auth-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 500px;
    padding: 2rem;
    background: var(--second);
    border-radius: 1rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 4px solid var(--base);
}

.auth-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
}

.auth-title {
    color: white;
    font-size: 1.75rem;
    text-align: center;
    margin: 0;
    font-weight: 600;
    letter-spacing: 2px;
}

.auth-messages {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.auth-message {
    color: var(--secondTwo);
    text-align: center;
    font-size: 0.9rem;
    opacity: 0.9;
}

.auth-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    transition: all 0.3s ease;
}

.input-wrapper:focus-within {
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 2px var(--base);
}

.input-wrapper ion-icon {
    color: var(--base);
    font-size: 1.25rem;
    margin-right: 0.75rem;
}

.input-wrapper input {
    background: transparent;
    border: none;
    color: white;
    width: 100%;
    font-size: 1rem;
    outline: none;
}

.input-wrapper input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.button-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
}

.btn-primary {
    background: var(--base);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.btn-primary:hover {
    background: var(--secondTwo);
    transform: translateY(-2px);
}

.btn-primary:active {
    transform: scale(0.98);
}

@media (min-width: 768px) {
    .auth-container {
        width: 80%;
        max-width: 600px;
    }

    .auth-title {
        font-size: 2rem;
    }

    .auth-message {
        font-size: 1rem;
    }

    .input-wrapper input {
        font-size: 1.1rem;
    }
}

@media (min-width: 1024px) {
    .auth-container {
        width: 70%;
        max-width: 500px;
    }
}

@media (min-width: 1280px) {
    .auth-container {
        width: 40%;
        max-width: 450px;
    }
}
</style>