<script>
import { computed, inject, ref, onMounted } from "vue";
import router from "@/routers/routes";
import axios from "axios";
import HelpModal from '../base-components/help-modal.vue';

export default {
  components: {
    HelpModal
  },
  setup() {
    const switchSP = inject("switchSP");
    const showAlert = inject("showAlert");
    const loggedCompany = inject("loggedCompany", ref(null));
    const switchSMPR = inject("switchSMPR");
    const switchSMTR = inject("switchSMTR");
    const isLogin = ref(true); // Propiedad para alternar entre login y registro
    const isLoading = ref(false); // Nuevo estado para controlar la pantalla de carga
    const showHelpModal = ref(false);
    const getCompanyColor = inject("getCompanyColor")
    const confirmPassword = ref("");
    const msg = ref("");
    const company = ref({
      company_user: "",
      mail: "",
      number: "",
      password: "",
    });
    const sesion = ref({
      identifier: "",
      password: "",
    });

    const openHelpModal = () => {
      switchSP();
    };

    const loginCompany = async () => {
      try {
        const response = await axios.post(
          "/api/loginCompany",
          {
            identifier: sesion.value.identifier,
            password: sesion.value.password,
          }
        );

        msg.value = response.data;
        loggedCompany.value = response.data.name;
        getCompanyColor()

        // Guardar en localStorage
        localStorage.setItem("loggedCompany", JSON.stringify(response.data));

        router.push("/companySession");
      } catch (error) {
        if (error.response && error.response.data) {
          showAlert("2",`Error en el inicio de sesión: ${error.response.data.detail}`);
          console.error("Error en el inicio de sesión", error.response.data);
        } else {
          showAlert("2","Ha ocurrido un error inesperado. Inténtalo de nuevo.");
          console.error(error);
        }
      }
    };

    const signupCompany = async () => {
      try {
        if (!passwordMatch.value) {
          showAlert("2", "Las contraseñas no coinciden.");
          return;
        }
        isLoading.value = true; // Activar pantalla de carga
        const answer = await axios.post(
          "/api/insertCompany",
          company.value
        );
        showAlert("1", 'Registro exitoso. Por favor revisa tu correo para verificar tu cuenta.\nPodria estar en "Spam" o en "No deseados".\nTienes 15 minutos de otra manera tendras que hacer la verificacion nuevamente en el apartado "Verifica tu correo".');
        msg.value = answer.data.msg;
        company.value = {
          company_user: "",
          mail: "",
          number: "",
          password: "",
        };
        confirmPassword.value = "";
        isLogin.value = true;
      } catch (error) {
        if (error.response && error.response.data) {
          showAlert("2",`Error al registrar empresa: ${error.response.data.detail}`);
          console.error("Error al registrar empresa", error.response.data);
        } else {
          showAlert("2","Ha ocurrido un error inesperado. Inténtalo de nuevo.");
          console.error(error);
        }
      } finally {
        isLoading.value = false; // Desactivar pantalla de carga
      }
    };

    const passwordMatch = computed(() => {
      return company.value.password === confirmPassword.value;
    });

    // Función para alternar la vista
    const toggleForm = () => {
      isLogin.value = !isLogin.value;
    };

    const toggleHelpModal = () => {
      showHelpModal.value = !showHelpModal.value;
    };

    onMounted(() => {
      const storedUser = localStorage.getItem("loggedCompany");
      if (storedUser) {
        loggedCompany.value = JSON.parse(storedUser).name;
        router.push("/companySession");
      }
    });

    return {
      toggleForm,
      loginCompany,
      signupCompany,
      company,
      isLogin,
      confirmPassword,
      passwordMatch,
      sesion,
      msg,
      switchSMPR,
      switchSMTR,
      isLoading,
      showHelpModal,
      toggleHelpModal
    };
  },
};
</script>

<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-spinner"></div>
    <p>Procesando registro...</p>
  </div>
  <transition name="slide-fade">
    <section v-if="isLogin" key="login" class="login-cont">
      <form class="form" @submit.prevent="loginCompany()">
        <h1 style="display: flex; gap: 5px; font-size: 30px; margin: 0">
          <span style="color: var(--secondTwo)">FIX</span><span style="color: white">-</span><span
            style="color: var(--base)">FLOW</span>
        </h1>
        <h2>Inicio de Sesión</h2>
        <label for="company-input" class="input-cont">
          <ion-icon name="cube"></ion-icon>
          <input type="text" id="company-input" class="text-input" placeholder="Correo" v-model="sesion.identifier" />
        </label>
        <label for="pasw-input" class="input-cont">
          <ion-icon name="lock-closed"></ion-icon>
          <input type="password" id="pasw-input" class="text-input" placeholder="Contraseña"
            v-model="sesion.password" />
        </label>
        <button class="go-btn">Iniciar Sesión</button>
        <button type="button" @click="toggleForm" class="opt-btn">
          Registrarse
        </button>
        <button type="button" @click="switchSMPR" class="opt-btn">
          ¿Olvidaste tu contraseña?
        </button>
        <button type="button" @click="switchSMTR" class="opt-btn">
          Verifica Tu Correo
        </button>
      </form>
    </section>

    <section v-else key="signup" class="signup-cont">
      <form class="form" @submit.prevent="signupCompany">
        <h1 style="display: flex; gap: 5px; font-size: 30px; margin: 0">
          <span style="color: var(--secondTwo)">FIX</span><span style="color: white">-</span><span
            style="color: var(--base)">FLOW</span>
        </h1>
        <h2>Registro</h2>
        <label for="email-input" class="input-cont">
          <ion-icon name="mail"></ion-icon>
          <input type="mail" id="email-input" class="text-input" placeholder="Correo" v-model="company.mail" />
        </label>
        <label for="company-input" class="input-cont">
          <ion-icon name="cube"></ion-icon>
          <input type="text" id="company-input" class="text-input" placeholder="Nombre Compañía"
            v-model="company.company_user" />
        </label>
        <label for="company-input" class="input-cont">
          <ion-icon name="cube"></ion-icon>
          <input type="text" id="tel-input" class="text-input" placeholder="Numero de Telefono"
          v-model="company.number"/>
        </label>
        <label for="pasw-input" class="input-cont">
          <ion-icon name="lock-closed"></ion-icon>
          <input type="password" id="pasw-input" class="text-input" placeholder="Contraseña"
            v-model="company.password" />
        </label>
        <label for="confirm-pasw-input" class="input-cont">
          <ion-icon name="lock-closed"></ion-icon>
          <input type="password" id="confirm-pasw-input" class="text-input" v-model="confirmPassword"
            placeholder="Confirmar Contraseña" />
        </label>
        <p v-if="!passwordMatch" style="color: white">
          Las contraseñas no coinciden.
        </p>
        <button class="go-btn" type="submit" :disabled="!passwordMatch">
          Registrarse
        </button>
        <button type="button" @click="toggleForm" class="opt-btn">
          Iniciar Sesión
        </button>
      </form>
    </section>
  </transition>
  <button class="help-button" @click="toggleHelpModal">
    <ion-icon name="help-circle"></ion-icon>
  </button>
  <HelpModal :is-open="showHelpModal" @close="toggleHelpModal" />
</template>

<style scoped>
.login-cont,
.signup-cont {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px 10px;
  width: 80%;
  border-radius: 10px;
  background: var(--second);
  box-shadow: -25px -25px 51px #242424, 25px 25px 51px #484848;
  border: 2px solid var(--base);
  overflow-y: auto;
  scrollbar-width: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

/* Transición personalizada */
.slide-fade-enter-active {
  transition: transform 1s ease, opacity 2s ease;
} 

.slide-fade-leave-active {
  transition: transform 0.8s ease, opacity 2s ease;
}

.slide-fade-enter-from {
  transform: scale(0.1);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: scale(0.1);
  opacity: 0;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  width: 100%;
  flex-wrap: wrap;
}

.form h2 {
  font-family: var(--baseFont);
  font-size: 22px;
  color: white;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.input-cont {
  padding: 10px;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: inset -25px -25px 51px #a8a8a8, inset 25px 25px 51px #ffffff;
  display: flex;
  align-items: center;
  width: 80%;
}

.text-input {
  all: unset;
  padding: 0 10px;
  width: 80%;
}

.go-btn {
  all: unset;
  padding: 10px 20px;
  background: var(--base);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: var(--baseFont);
  transition: all 0.05s ease;
  border: 2px solid transparent;
}

.opt-btn {
  all: unset;
  color: rgba(255, 255, 255, 0.418);
  font-size: 12px;
  cursor: pointer;
}

.opt-btn:hover {
  opacity: 0.8;
}

.go-btn:active {
  scale: 0.9;
  background-color: var(--second);
  border-color: var(--base);
}

/* Tablets: 768px y mayores */
@media (min-width: 768px) {
  .form {
    gap: 30px;
  }

  .form h2 {
    font-size: 35px;
    letter-spacing: 3px;
  }

  .input-cont {
    font-size: 25px;
  }

  .go-btn {
    font-size: 20px;
  }

  .opt-btn {
    font-size: 16px;
  }
}

/* Portátiles: 1024px y mayores */
@media (min-width: 1024px) {

  .login-cont,
  .signup-cont {
    width: 80%;
  }

  .form {
    gap: 20px;
  }

  .form h2 {
    font-size: 25px;
  }

  .input-cont {
    font-size: 20px;
    padding-left: 20px;
  }

  .go-btn {
    font-size: 15px;
  }

  .opt-btn {
    font-size: 12px;
  }
}

/* Computadoras de escritorio: 1280px y mayores */
@media (min-width: 1280px) {

  .login-cont,
  .signup-cont {
    width: 28%;
    height: 65%;
  }

  .input-cont {
    font-size: 18px;
    width: 60%;
  }

  .go-btn {
    font-size: 13px;
    scale: 1.2;
  }

  .go-btn:hover {
    scale: 1.3;
  }

  .go-btn:hover:active {
    scale: 1.2;
  }

  .opt-btn {
    font-size: 11px;
  }
}

.main-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid var(--base);
  border-top: 5px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-overlay p {
  color: white;
  font-size: 18px;
  font-family: var(--baseFont);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.help-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--base);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 100;
}

.help-button ion-icon {
  font-size: 24px;
  color: white;
}

.help-button:hover {
  transform: scale(1.1);
  background: var(--secondTwo);
}

.help-button:active {
  transform: scale(0.95);
}
</style>
