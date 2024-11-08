<script setup>
import { inject, ref } from 'vue';

const companyImageExisting = ref(false)
const fileName = ref(null)

const putImage = () => {
    companyImageExisting.value = !companyImageExisting.value
}


const loggedCompany = inject("loggedCompany", ref(null))
</script>
<template>
    <section class="session-container">
        <div class="info-container">
            <ion-icon name="person-circle" v-if="!companyImageExisting"></ion-icon>
            <img v-if="companyImageExisting" src="/src/assets/img/Logo_Nombre.png" alt="Company Image"
                class="company-img">
            <h3>{{ loggedCompany }}</h3>
        </div>
        <form @submit.prevent="putImage()" class="img-form">
            <input type="file" id="fileInput" class="img-input" style="display: none;">
            <label for="fileInput" class="file-label">
                <span>Seleccionar Imagen</span>
                <ion-icon name="camera-outline"></ion-icon>
            </label>
            <span class="file-name" v-if="fileName">{{ fileName }}</span>

            <button type="submit" class="upload-btn">
                <ion-icon name="cloud-upload"></ion-icon>
            </button>
        </form>

        <button class="close-btn">Cerrar Sesion</button>
    </section>
</template>
<style scoped>
.session-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 20px;
    align-items: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 5px;
    width: 75%;
    border-radius: 10px;
    background: #363636;
    box-shadow: -25px -25px 51px #242424,
        25px 25px 51px #484848;
    border: 2px solid var(--baseOrange);
}

.info-container {
    width: 90%;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: #ffffff;
    box-shadow: inset -25px -25px 51px #a8a8a8,
        inset 25px 25px 51px #ffffff;
    display: flex;
}

.info-container ion-icon {
    font-size: 250px;
    color: var(--baseOrange);
    margin-top: 10px;
}

.company-img {
    height: 250px;
    filter: drop-shadow(0 0 15px rgba(39, 39, 39, 0.877));
}

.info-container h3 {
    font-family: var(--baseFont);
    text-transform: uppercase;
    font-size: clamp(15px, 20px, 25px);
}

.close-btn {
    all: unset;
    background-color: var(--baseOrange);
    color: #ffffff;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-family: var(--baseFont);
    font-size: 18px;
    transition: all 0.3s ease;
}

.close-btn:active {
    background-color: var(--baseGray);
    box-shadow: var(--secShadow);
    scale: 0.9;
}

.img-form {
    display: flex;
    justify-content: center;
    gap: 10px;
    align-items: center;
}

.file-label {
    display: flex;
    align-items: center;
    padding: 10px;
    background-color: var(--baseGray);
    border: 2px solid var(--baseOrange);
    border-radius: 10px;
    color: #fff;
    font-weight: bolder;
    font-family: var(--baseFont);
    cursor: pointer;
    font-size: 15px;
    text-align: center;
    gap: 10px;
    transition: background-color 0.3s;
}

.file-label ion-icon {
    scale: 1.5;
}

.file-label:hover {
    background-color: #0056b3;
}

.file-name {
    font-size: 14px;
    color: #333;
}

.upload-btn {
    all: unset;
    color: white;
    background-color: var(--baseOrange);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-radius: 50%;
    overflow: hidden;
}

.upload-btn ion-icon {
    scale: 1.4;
}

/* Tablets: 768px y mayores */
@media (min-width: 768px) {
    .session-container {
        gap: 30px;
        height: auto;
        max-height: 90%;
    }

    .info-container {
        width: 80%;
    }

    .info-container ion-icon {
        font-size: 300px;
    }

    .info-container h3 {
        font-size: 35px;
    }

    .close-btn {
        scale: 1.3;
    }

    .upload-btn:hover ion-icon {
        animation: uploadAnimation 1.5s ease 1 forwards;
    }

    @keyframes uploadAnimation {
        0% {
            transform: translateY(0%);
        }

        25% {
            transform: translateY(-150%);
        }

        26% {
            transform: translateY(150%);
        }

        60% {
            transform: translateY(-150%);
        }

        61% {
            transform: translateY(150%);
        }

        100% {
            transform: translateY(0%);
        }
    }
}


/* Computadoras de escritorio: 1280px y mayores */
@media (min-width: 1280px) {
    .session-container {
        width: 30%;
        height: 75%;
        gap: 40px;
    }

    .info-container ion-icon {
        font-size: 200px;
    }

    .info-container h3 {
        font-size: 25px;
    }

    .close-btn {
        scale: .9;
    }
}
</style>