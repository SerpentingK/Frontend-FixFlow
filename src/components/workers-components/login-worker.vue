<script>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default{
    setup(){
    const loggedWorker = inject("loggedWorker", ref(null))
    const loggedDocument = inject("loggedDocument", ref(null))
    const workerRole = inject("workerRole", ref(null))
    const loggedCompany = inject("loggedCompany", ref(null));
    const startShift = inject("startShift", ref(null));
    const sessionworker = ref({
        document: "",
        password: "",
    });
    const msg = ref("");

    const router = useRouter()

    const loginWorker = async () => {
        try {
            console.log("loggedCompany:", loggedCompany.value);
            const answer = await axios.post(`http://127.0.0.1:8000/loginWorker/${loggedCompany.value}`, {
            document: sessionworker.value.document,
            password: sessionworker.value.password,
            });
            loggedDocument.value = sessionworker.value.document
            msg.value = answer.data.status;
            loggedWorker.value = answer.data.wname;
            workerRole.value = answer.data.role;
            startShift.value = answer.data.shift
            router.push('/bills')
        } catch (error) {
            if (error.response && error.response.data) {
            alert(`Error al iniciar sesión: ${error.response.data.detail}`);
            console.error("Error al iniciar sesión", error.response.data);
            } else {
            alert("Ha ocurrido un error inesperado. Inténtalo de nuevo.");
            console.error(error);
            }
        }
    }
    return{
        loginWorker,
        sessionworker
    }
    }
}

</script>
<template>
    <section class="login-container">
        <h2>INICIO DE TURNO</h2>
        <span>Ingrese con su documento y contraseña</span>
        <span>Si no se encuentra registrado comuniquese con un Administrador</span>
        <form @submit.prevent="loginWorker()" class="login-form">
            <label for="doc-inp" class="input-container">
                <ion-icon name="finger-print"></ion-icon>
                <input v-model="sessionworker.document" type="text" placeholder="Documento" required />
            </label>
            <label for="pasw-inp" class="input-container">
                <ion-icon name="lock-closed"></ion-icon>
                <input v-model="sessionworker.password" type="password" placeholder="Contraseña" required />
            </label>
            <button type="submit" class="go-btn">Iniciar Turno</button>
        </form>
    </section>
</template>
<style scoped>
.login-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 40px 10px;
    width: 75%;
    border-radius: 10px;
    background: #363636;
    box-shadow: -25px -25px 51px #242424,
        25px 25px 51px #484848;
    border: 2px solid var(--baseOrange);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(1px, 5px, 10px);
}

.login-container h2 {
    color: white;
    letter-spacing: 2px;
}

.login-container span {
    color: var(--secGray);
    text-align: center;
}

.login-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 15px;
    width: 100%;
}

.input-container {
    padding: 10px;
    border-radius: 10px;
    background: #ffffff;
    box-shadow: inset -25px -25px 51px #a8a8a8,
        inset 25px 25px 51px #ffffff;
    display: flex;
    align-items: center;
    width: 80%;
    margin-top: 10px;
}

.input-container ion-icon {
    margin-left: 10px;
    scale: 1.3;
}

.input-container input {
    all: unset;
    width: 80%;
    padding: 0 20px;
}

.go-btn {
    background-color: var(--baseOrange);
    border: 2px solid var(--baseOrange);
    padding: 10px 20px;
    border-radius: 15px;
    color: white;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: bolder;
}

.go-btn:active {
    scale: 0.9;
}

@media (min-width: 768px) {
    .login-container {
        gap: 15px;
    }

    .login-container h2 {
        font-size: 2rem;
    }

    .login-container span {
        font-size: 1.1rem;
    }

    .login-form {
        width: 90%;
    }

    .input-container {
        font-size: 1.2rem;
    }

    .input-container input {
        padding: 0 25px;
    }

    .go-btn {
        margin-top: 10px;
        scale: 1.1;
    }
}

@media (min-width: 1020px) {
    .login-container {
        width: 40%;
    }

    .login-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 15px;
        width: 60%;
    }
    .go-btn:hover{
        background-color: var(--baseGray);
        color: white;
    }
}
@media (min-width: 1280px) {
    .login-container {
        width: 30%;
    }
}
</style>