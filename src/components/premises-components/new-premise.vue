<script>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { toInteger } from 'lodash';

export default {
    setup() {
        const showAlert = inject("showAlert");
        const router = useRouter();
        const premisesCount = inject("premisesCount", ref(0));
        const loggedCompany = inject("loggedCompany", ref(null));

        const local = ref({
            name: "",
            address: "",
            password: "",
            company: ""
        });

        const registerLocal = async () => {
            if (local.value.password !== local.value.confirmPassword) {
                showAlert("2", "Las contraseñas no coinciden.");
                return;
            }
            const answer = await axios.post(`/api/newPremises/${loggedCompany.value}/${premisesCount.value}`, {
                name: local.value.name,
                address: local.value.address,
                password: local.value.password,
                company: loggedCompany.value
            });
            premisesCount.value += 1;
            console.log(premisesCount.value);
            router.push('/premises/select-premise');
        };

        return {
            local,
            registerLocal
        };
    }
}
</script>

<template>
    <section class="form-container">
        <h2>Registrar Local</h2>
        <span>Ingrese los datos para crear un nuevo local en el sistema</span>
        <form @submit.prevent="registerLocal()">
            <label class="input-container">
                <ion-icon name="business"></ion-icon>
                <input type="text" placeholder="Nombre del Local" required v-model="local.name">
            </label>
            <label class="input-container">
                <ion-icon name="location"></ion-icon>
                <input type="text" placeholder="Dirección" required v-model="local.address">
            </label>
            <label class="input-container">
                <ion-icon name="lock-closed"></ion-icon>
                <input type="password" placeholder="Contraseña" required v-model="local.password">
            </label>
            <label class="input-container">
                <ion-icon name="lock-closed-outline"></ion-icon>
                <input type="password" placeholder="Confirmar Contraseña" required v-model="local.confirmPassword">
            </label>
            <button type="submit" class="go-btn">Registrar</button>
        </form>
    </section>
</template>

<style scoped>
/* Usa exactamente el mismo estilo del componente anterior */
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
    border: 2px solid var(--base);
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
    background: var(--base);
    background: linear-gradient(117deg, var(--base) 0%, var(--base) 32%, var(--base) 72%, rgba(255, 255, 255, 1) 100%, var(--base) 100%);
    -webkit-background-clip: text;
}

.form-container span {
    color: var(--secondTwo);
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

.go-btn {
    background-color: var(--base);
    border: 2px solid var(--base);
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
