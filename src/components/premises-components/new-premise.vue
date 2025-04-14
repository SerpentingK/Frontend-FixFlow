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
