<script>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
    setup(){
    const workersCount = inject("workersCount", ref(0));
    const loggedCompany = inject("loggedCompany", ref(null))
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
            if(workersCount.value >= 1){
                router.push("/workers/login-worker");
            }
            const answer = await axios.post(
            "http://127.0.0.1:8000/insertWorker",
            worker.value
            );
            msg.value = answer.data.msg;
            workersCount.value++
        } catch (error) {
            if (error.response && error.response.data) {
            alert(`Error al registrar empresa: ${error.response.data.detail}`);
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
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px 10px;
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

.form-container h2 {
    font-size: 25px;
    font-family: var(--baseFont);
    text-transform: uppercase;
    text-align: center;
    letter-spacing: 1px;
    color: transparent;
    background: rgb(216, 75, 23);
    background: linear-gradient(117deg, rgba(216, 75, 23, 1) 0%, rgba(216, 75, 23, 1) 32%, rgba(230, 140, 107, 1) 72%, rgba(255, 255, 255, 1) 100%, rgba(216, 75, 23, 1) 100%);
    -webkit-background-clip: text;
}

.form-container span {
    color: var(--secGray);
    text-align: center;
}

.form-container form {
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
.input-container ion-icon{
    margin-left: 10px;
    scale: 1.3;
}

.input-container input {
    all: unset;
    width: 80%;
    padding: 0 20px;
}

.radio-inputs {
    margin-top: 20px;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    border-radius: 10px;
    background-color: var(--baseOrange);
    box-sizing: border-box;
    box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
    padding: 0.25rem;
    width: 90%;
    font-size: 14px;
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
    color: rgba(51, 65, 85, 1);
    transition: all .3s ease;
    border: 3px solid transparent;
}

.radio-inputs .radio input:checked+.name {
    background-color: #fff;
    font-weight: 600;
    color: black;
    border-color: var(--baseGray);
    scale: 1.1;
    transform: translateY(-5px);
    box-shadow: var(--secShadow);
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
    transition: .3s;
}

.go-btn:active {
    scale: 0.9;
}

/* Tablets: 768px y mayores */
@media (min-width: 768px) {
    .form-container {
        gap: clamp(5px, 10px, 15px);
    }

    .form-container h2 {
        font-size: 30px;
    }

    .form-container span {
        font-size: 20px;
    }

    .form-container form {
        gap: 20px;
    }

    .input-container {
        padding: 15px;
    }

    .radio .name {
        border: 4px solid transparent;
    }

}

/* Portátiles: 1024px y mayores */
@media (min-width: 1024px) {
    .form-container {
        width: 40%;
        padding: 10px 30px;
        gap: clamp(5px, 10px, 15px);
    }
}

</style>