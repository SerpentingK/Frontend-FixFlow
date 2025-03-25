<script>
import { inject, onMounted, ref } from "vue";
import router from '@/routers/routes';
import axios from "axios";


export default {
    setup() {
        const workersCount = inject("workersCount", ref(0));
        const companyImageExisting = ref(false);
        const fileName = ref(null);
        const urlImgCompany = ref(null);
        const loggedCompany = inject("loggedCompany", ref(null));
        const loggedWorker = inject("loggedWorker", ref(null));
        const isUploading = ref(false);

        const showAlert = inject("showAlert")
        

        const handleFileInput = (event) => {
            if (event.target.files.length > 0) {
                fileName.value = event.target.files[0].name;
            }
        };

        const fetchCompanyData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/allcompany/${loggedCompany.value}`);
                const relativePath = response.data.status;
                urlImgCompany.value = `http://127.0.0.1:8000/${relativePath}`;
                console.log(urlImgCompany.value);
                companyImageExisting.value = true;
            } catch (error) {
                console.error("Error fetching company data:", error);
            }
        };


        const putImage = async () => {
            try {
                const formData = new FormData();
                const inputFile = document.querySelector(".img-input");

                if (inputFile.files.length === 0) {
                    throw new Error("No file selected");
                }

                formData.append("file", inputFile.files[0]);

                await axios.put(
                    `http://127.0.0.1:8000/putCompanyImage/${loggedCompany.value}`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );

                // Hacer el GET después del PUT para actualizar la imagen en la interfaz
                await fetchCompanyData();

                console.log("Image updated successfully");
            } catch (error) {
                console.error("Error updating image:", error);
            }
        };

        const getWorkersCount = async () => {
            try {
                if (loggedCompany.value) {
                    const answer = await axios.get(
                        `http://127.0.0.1:8000/company/${loggedCompany.value}/workers/count`
                    );
                    workersCount.value = answer.data.count;
                    console.log(workersCount.value)
                }
            } catch (error) {
                console.error("Error al obtener el conteo de trabajadores", error);
            }
        };



        onMounted(() => {
            fetchCompanyData();
            getWorkersCount();
        })

        const closeCompany = () => {
            if(loggedWorker.value != null){
                showAlert("3", "Se debe cerrar turno para cerrar sesion.")
            }else{
                localStorage.removeItem("loggedCompany");
            loggedCompany.value = null
            router.push("/loginCompany")
            }
            
        }
        return {
            companyImageExisting,
            fileName,
            putImage,
            handleFileInput,
            isUploading,
            urlImgCompany,
            loggedCompany,
            workersCount,
            closeCompany
        };
    },
};
</script>

<template>
    <section class="session-container">
        <div class="info-container">
            <ion-icon name="person-circle" v-if="!companyImageExisting"></ion-icon>
            <img v-if="companyImageExisting" :src="urlImgCompany" alt="Company Image" class="company-img">
            <h3 style="color: black;">{{ loggedCompany }}</h3>
        </div>
        <form @submit.prevent="putImage" class="img-form">
            <input type="file" id="fileInput" class="img-input" @change="handleFileInput" style="display: none;">
            <label for="fileInput" class="file-label">
                <span>Seleccionar Imagen</span>
                <ion-icon name="camera-outline"></ion-icon>
            </label>

            <button type="submit" class="upload-btn" :disabled="isUploading">
                <ion-icon name="cloud-upload"></ion-icon>
            </button>
        </form>
        <button class="close-btn" @click="closeCompany">Cerrar Sesion</button>
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
    padding: 10px 5px;
    width: 75%;
    border-radius: 10px;
    background: #363636;
    box-shadow: -25px -25px 51px #242424,
        25px 25px 51px #484848;
    border: 2px solid var(--baseOrange);
}

.info-container {
    width: 90%;
    height: auto;
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
    padding: 10px 0;
}

.info-container ion-icon {
    font-size: 250px;
    color: var(--baseOrange);
    margin-top: 10px;
}

.company-img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    /* Recorta la imagen para llenar el contenedor sin deformarse */
    border-radius: 10px;
    /* Opcional, para esquinas redondeadas */
    display: block;
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