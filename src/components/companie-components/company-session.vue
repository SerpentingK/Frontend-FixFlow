<script>
import { inject, onMounted, provide, ref, computed } from "vue";
import router from "@/routers/routes";
import axios from "axios";

export default {
  setup() {
    const workersCount = inject("workersCount", ref(0));
    const loggedCompany = inject("loggedCompany", ref(null));
    const loggedWorker = inject("loggedWorker", ref(null));
    const workerRole = inject("workerRole");
    const showAlert = inject("showAlert");
    const totalInCash = inject("totalInCash", ref(0));
    const defaultColor = inject("defaultColor");
    const selectedColor = inject("selectedColor");
    const getCompanyVault = inject("getCompanyVault");
    const premiseCount = inject("premiseCount", ref(0));

    const getWorkersCount = async () => {
      try {
        if (loggedCompany.value) {
          const answer = await axios.get(
            `/api/company/${loggedCompany.value}/count`
          );
          workersCount.value = answer.data.count;
        }
      } catch (error) {
        console.error("Error al obtener el conteo de trabajadores", error);
      }
    };

    const updateColor = async () => {
      try {
        const encodedColor = encodeURIComponent(selectedColor.value);
        await axios.put(
          `/api/company/${loggedCompany.value}/baseColor/${encodedColor}`
        );
        resetColor(selectedColor.value);
      } catch (error) {
        console.error("Error al actualizar color", error);
      }
    };

    const resetColor = (color) => {
      document.documentElement.style.setProperty("--base", color);
      localStorage.setItem("baseOrange", color);
      window.location.reload();
    };

    provide("resetColor", resetColor);

    onMounted(() => {
      getWorkersCount();
      getCompanyVault();

      const storedColor = localStorage.getItem("baseOrange");
      if (storedColor) {
        document.documentElement.style.setProperty("--base", storedColor);
        selectedColor.value = storedColor;
      }
    });

    const closeCompany = () => {
      if (loggedWorker.value != null) {
        showAlert("2", "Se debe cerrar turno para cerrar sesión.");
      } else {
        localStorage.removeItem("loggedCompany");
        resetColor(defaultColor.value);
        loggedCompany.value = null;
        router.push("/loginCompany");
      }
    };

    const companyPhone = computed(() => {
      return loggedCompany.value?.phone || "No disponible";
    });

    return {
      loggedCompany,
      workersCount,
      closeCompany,
      totalInCash,
      selectedColor,
      updateColor,
      workerRole,
      companyPhone
    };
  },
};
</script>

<template>
  <section class="session-cont">
    <div class="info-container">
      <h3 style="color: black">{{ loggedCompany }}</h3>

      <div class="info-cont">
        <div>Total en boveda:</div>
        <div>{{ totalInCash }}</div>
      </div>

      <div class="info-cont">
        <div>Número de trabajadores:</div>
        <div>{{ workersCount }}</div>
      </div>

      <div class="info-cont">
        <div>Teléfono:</div>
        <div>{{ companyPhone }}</div>
        <button class="edit-phone-btn" @click="">Editar</button>
      </div>
    </div>

    <div class="color-picker">
      <label for="color">Selecciona un color:</label>
      <input type="color" id="color" v-model="selectedColor" />
    </div>

    <button class="apply-color-btn" @click="updateColor">Aplicar Color</button>
    <button class="close-btn" @click="closeCompany">Cerrar Sesión</button>

    
  </section>
</template>

<style scoped>

</style>


<style scoped>
.session-cont {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
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
  box-shadow: -25px -25px 51px #242424, 25px 25px 51px #484848;
  border: 2px solid var(--base);
  overflow-y: scroll;
}
.session-cont::-webkit-scrollbar{
  display: none;
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
  box-shadow: inset -25px -25px 51px #a8a8a8, inset 25px 25px 51px #ffffff;
  display: flex;
  padding: 10px 0;
}

.info-container h3 {
  font-family: var(--baseFont);
  text-transform: uppercase;
  font-size: clamp(15px, 20px, 25px);
}

.info-cont {
  display: flex;
  width: 90%;
  padding: 10px;
  justify-content: space-between;
}

.close-btn {
  all: unset;
  background-color: var(--base);
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-family: var(--baseFont);
  font-size: 18px;
  transition: all 0.3s ease;
}

.close-btn:active {
  background-color: var(--second);
  box-shadow: var(--secShadow);
  scale: 0.9;
}

.color-picker {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
}

.color-picker label {
  font-size: 1.2rem;
  margin-bottom: 5px;
  color: white;
}

.color-picker input {
  cursor: pointer;
}

.apply-color-btn {
  all: unset;
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.apply-color-btn:hover {
  opacity: 0.8;
}
.withdraw-btns{
  position: absolute;
  display: flex;
  gap: 10px;
  flex-direction: row;
  top: -50px;
  right: 0;
}

.withdraw-btn, .withdraw-list-btn {
  background-color: var(--base);
  padding: 5px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  box-shadow: var(--secShadow);
  font-size: 1.4rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.withdraw-btn:hover {
  scale: 1.2;
}
.edit-phone-btn {
  all: unset;
  margin-left: 10px;
  padding: 4px 8px;
  background-color: var(--base);
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}
.edit-phone-btn:hover {
  background-color: var(--second);
}

/* Tablets: 768px y mayores */
@media (min-width: 768px) {
  .session-cont {
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
  .session-cont {
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
    scale: 0.9;
  }
  .withdraw-btns{
    top: 0;
    right: -50px;
    flex-direction: column;
  }
}
</style>
