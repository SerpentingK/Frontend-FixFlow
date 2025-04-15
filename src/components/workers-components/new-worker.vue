<script>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
    setup(){
    const workersCount = inject("workersCount", ref(0));
    const loggedCompany = inject("loggedCompany", ref(null))
    const showAlert = inject("showAlert")
    const worker = ref({
        wname: "",
        password: "",
        document: "",
        company: loggedCompany.value,
        wrole: "Gerente",
    });
    const msg = ref("");

    const router = useRouter();

    const registerWorker = async () => {
        try {
            if(workersCount.value == 0){
                const answer = await axios.post(
                `${import.meta.env.VITE_API_URL}/insertWorker/${loggedCompany.value}`,
                worker.value
                );
                msg.value = answer.data.msg;
                workersCount.value++
                router.push("/workers/login-worker");
            }else{
                const answer = await axios.post(
                `${import.meta.env.VITE_API_URL}/insertWorker/${loggedCompany.value}`,
                worker.value
                );
                msg.value = answer.data.msg;
                workersCount.value++;
            }
        } catch (error) {
            if (error.response && error.response.data) {
                showAlert("2", `No se ha podido registrar el colaborador: ${error.response.data.detail}`)
            console.error("Error al registrar empresa", error.response.data);
            } else {
            alert("Ha ocurrido un error inesperado. Inténtalo de nuevo.");
            console.error(error);
            }
        }
    }

    return {
        worker,
        registerWorker
    };

    }
}
</script>

<template>
    <section class="form-container">
        <h2>Crear Colaborador</h2>
        <span>Recuerde que si es el primer colaborador tendra que tener el puesto de Gerente</span>
        <form action="" @submit.prevent="registerWorker()">
            <label class="input-container">
                <ion-icon name="person-circle"></ion-icon>
                <input type="text" name="" placeholder="Nombre" required v-model="worker.wname">
            </label>
            <label class="input-container">
                <ion-icon name="finger-print"></ion-icon>
                <input type="text" name="" placeholder="Documento" required v-model="worker.document">
            </label>
            <label class="input-container">
                <ion-icon name="lock-closed"></ion-icon>
                <input type="password" name="" placeholder="Clave" required v-model="worker.password">
            </label>
            <div class="radio-inputs">
                <label for="ger-inp" class="radio">
                    <input type="radio" name="radio" id="ger-inp" v-model="worker.wrole" value="Gerente">
                    <span class="name">Gerente</span>
                </label>
                <label for="adm-inp" class="radio">
                    <input type="radio" name="radio" id="adm-inp" v-model="worker.wrole" value="Administrador">
                    <span class="name">Administrador</span>
                </label>
                <label for="tec-inp" class="radio">
                    <input type="radio" name="radio" id="tec-inp" v-model="worker.wrole" value="Tecnico">
                    <span class="name">Tecnico</span>
                </label>
            </div>
            <button type="submit" class="go-btn">Registrar</button>
        </form>
    </section>
</template>

<style scoped>
.form-container {
    position: absolute;
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
    overflow: scroll;
    scrollbar-width: none;
}

.form-container h2 {
    color: white;
    font-size: 1.5rem;
    text-align: center;
    margin: 0;
    font-weight: 500;
    letter-spacing: 1px;
}

.form-container span {
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    font-size: 0.875rem;
}

.form-container form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
}

.input-container {
    position: relative;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    transition: all 0.3s ease;
}

.input-container:focus-within {
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 2px var(--base);
}

.input-container ion-icon {
    color: var(--base);
    font-size: 1.25rem;
    margin-right: 0.75rem;
}

.input-container input {
    background: transparent;
    border: none;
    color: white;
    width: 100%;
    font-size: 1rem;
    outline: none;
}

.input-container input::placeholder {
    color: rgba(255, 255, 255, 0.5);
}

.radio-inputs {
    margin-top: 1rem;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    border-radius: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    padding: 0.25rem;
    width: 100%;
    font-size: 0.875rem;
}

.radio {
    flex: 1 1 auto;
    text-align: center;
}

.radio input {
    display: none;
}

.radio .name {
    display: flex;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    border: none;
    padding: .5rem 0;
    color: rgba(255, 255, 255, 0.7);
    transition: all .3s ease;
}

.radio-inputs .radio input:checked + .name {
    background: var(--base);
    color: white;
    font-weight: 500;
}

.go-btn {
    background: var(--base);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.go-btn:hover {
    background: var(--secondTwo);
    transform: translateY(-2px);
}

.go-btn:active {
    transform: scale(0.95);
}

@media (min-width: 768px) {
    .form-container {
        width: 80%;
        max-width: 600px;
    }

    .form-container h2 {
        font-size: 1.75rem;
    }

    .input-container input {
        font-size: 1.1rem;
    }
}

@media (min-width: 1024px) {
    .form-container {
        width: 70%;
        max-width: 500px;
        max-height: 70vh;
    }
}

@media (min-width: 1280px) {
    .form-container {
        width: 40%;
        max-width: 450px;
    }
}
</style>