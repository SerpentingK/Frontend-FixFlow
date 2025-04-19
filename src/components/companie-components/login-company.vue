<script>
import { computed, inject, ref, onMounted } from "vue";
import router from "@/routers/routes";
import axios from "axios";
import HelpModal from '../base-components/help-modal.vue';
import SubscriptionPlans from './subscription-plans.vue';

export default {
  components: {
    HelpModal,
    SubscriptionPlans
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
    const showPlans = ref(false);
    const selectedPlan = ref(null);

    const openHelpModal = () => {
      switchSP();
    };

    const loginCompany = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/loginCompany`,
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
        if (!isPasswordValid.value) {
          showAlert("2", "La contraseña debe tener al menos 6 caracteres, una mayúscula y un número.");
          return;
        }
        
        if (!passwordMatch.value) {
          showAlert("2", "Las contraseñas no coinciden.");
          return;
        }
        
        if (!selectedPlan.value) {
          showPlans.value = true;
          return;
        }

        isLoading.value = true;
        
        // Añadir el plan seleccionado a los datos de la compañía
        const companyData = {
          ...company.value,
          subscription_plan: selectedPlan.value.id,
          subscription_price: selectedPlan.value.price
        };

        const answer = await axios.post(
          `${import.meta.env.VITE_API_URL}/insertCompany`,
          companyData
        );
        showAlert("1", 'Registro exitoso. Por favor revisa tu correo para verificar tu cuenta.\nPodria estar en "Spam" o en "No deseados".\nTienes 24 horas de otra manera tendras que hacer la verificacion nuevamente en el apartado "Verifica tu correo".');
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

    const passwordStrength = computed(() => {
      const password = company.value.password;
      if (!password) return 0;
      
      let strength = 0;
      if (password.length >= 6) strength += 1;
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[0-9]/.test(password)) strength += 1;
      if (/[^A-Za-z0-9]/.test(password)) strength += 1;
      
      return strength;
    });

    const getPasswordStrengthColor = computed(() => {
      const strength = passwordStrength.value;
      switch(strength) {
        case 0: return 'var(--errorColor)';
        case 1: return 'var(--errorColor)';
        case 2: return 'var(--warningColor)';
        case 3: return 'var(--base)';
        case 4: return 'var(--successColor)';
        default: return 'var(--errorColor)';
      }
    });

    const getPasswordStrengthText = computed(() => {
      const strength = passwordStrength.value;
      switch(strength) {
        case 0: return 'Muy débil';
        case 1: return 'Débil';
        case 2: return 'Media';
        case 3: return 'Fuerte';
        case 4: return 'Muy fuerte';
        default: return 'Muy débil';
      }
    });

    const isPasswordValid = computed(() => {
      const password = company.value.password;
      return password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password);
    });

    // Función para alternar la vista
    const toggleForm = () => {
      isLogin.value = !isLogin.value;
    };

    const toggleHelpModal = () => {
      showHelpModal.value = !showHelpModal.value;
    };

    const handlePlanSelected = (plan) => {
      selectedPlan.value = plan;
      showPlans.value = false;
      signupCompany(); // Intentar registrar nuevamente con el plan seleccionado
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
      toggleHelpModal,
      showPlans,
      handlePlanSelected,
      passwordStrength,
      getPasswordStrengthColor,
      getPasswordStrengthText,
      isPasswordValid
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
    <section v-if="isLogin" key="login" class="auth-container">
      <form class="auth-form" @submit.prevent="loginCompany()">
        <div class="logo-container">
          <h1>
            <span class="logo-text logo-fix">FIX</span>
            <span class="logo-text logo-separator">-</span>
            <span class="logo-text logo-flow">FLOW</span>
          </h1>
        </div>
        <h2 class="auth-title">Inicio de Sesión</h2>
        <div class="form-group">
          <label for="company-input" class="input-wrapper">
            <ion-icon name="cube"></ion-icon>
            <input type="text" id="company-input" class="form-input" placeholder="Correo" v-model="sesion.identifier" />
          </label>
          <label for="pasw-input" class="input-wrapper">
            <ion-icon name="lock-closed"></ion-icon>
            <input type="password" id="pasw-input" class="form-input" placeholder="Contraseña"
              v-model="sesion.password" />
          </label>
        </div>
        <div class="button-group">
          <button class="btn-primary">Iniciar Sesión</button>
          <button type="button" @click="toggleForm" class="btn-secondary">
            Registrarse
          </button>
          <button type="button" @click="switchSMPR" class="btn-link">
            ¿Olvidaste tu contraseña?
          </button>
          <button type="button" @click="switchSMTR" class="btn-link">
            Verifica Tu Correo
          </button>
        </div>
      </form>
    </section>

    <section v-else key="signup" class="auth-container">
      <form class="auth-form" @submit.prevent="signupCompany">
        <div class="logo-container">
          <h1>
            <span class="logo-text logo-fix">FIX</span>
            <span class="logo-text logo-separator">-</span>
            <span class="logo-text logo-flow">FLOW</span>
          </h1>
        </div>
        <h2 class="auth-title">Registro</h2>
        <div class="form-group">
          <label for="email-input" class="input-wrapper">
            <ion-icon name="mail"></ion-icon>
            <input type="mail" id="email-input" class="form-input" placeholder="Correo" v-model="company.mail" />
          </label>
          <label for="company-input" class="input-wrapper">
            <ion-icon name="cube"></ion-icon>
            <input type="text" id="company-input" class="form-input" placeholder="Nombre Compañía"
              v-model="company.company_user" />
          </label>
          <label for="tel-input" class="input-wrapper">
            <ion-icon name="call"></ion-icon>
            <input type="text" id="tel-input" class="form-input" placeholder="Número de Teléfono"
              v-model="company.number"/>
          </label>
          <label for="pasw-input" class="input-wrapper">
            <ion-icon name="lock-closed"></ion-icon>
            <input type="password" id="pasw-input" class="form-input" placeholder="Contraseña"
              v-model="company.password" />
          </label>
          <div class="password-strength">
            <div class="strength-indicator">
              <div class="strength-bar" :style="{ backgroundColor: getPasswordStrengthColor }"></div>
              <div class="strength-dots">
                <div class="dot" :class="{ active: passwordStrength >= 1 }"></div>
                <div class="dot" :class="{ active: passwordStrength >= 2 }"></div>
                <div class="dot" :class="{ active: passwordStrength >= 3 }"></div>
                <div class="dot" :class="{ active: passwordStrength >= 4 }"></div>
              </div>
            </div>
            <span class="strength-text">{{ getPasswordStrengthText }}</span>
          </div>
          <label for="confirm-pasw-input" class="input-wrapper">
            <ion-icon name="lock-closed"></ion-icon>
            <input type="password" id="confirm-pasw-input" class="form-input" v-model="confirmPassword"
              placeholder="Confirmar Contraseña" />
          </label>
        </div>
        <div class="button-group">
          <button class="btn-primary" type="submit">
            Registrarse
          </button>
          <button type="button" @click="toggleForm" class="btn-secondary">
            Iniciar Sesión
          </button>
        </div>
      </form>
    </section>
  </transition>
  <button class="help-button" @click="toggleHelpModal">
    <ion-icon name="help-circle"></ion-icon>
  </button>
  <HelpModal :is-open="showHelpModal" @close="toggleHelpModal" />
  <SubscriptionPlans 
    v-if="showPlans" 
    @planSelected="handlePlanSelected"
  />
</template>

<style scoped>
.auth-container {
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

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.logo-container {
  text-align: center;
  margin-bottom: 1rem;
}

.logo-container h1 {
  font-size: 2.5rem;
  margin: 0;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.logo-text {
  font-weight: bold;
}

.logo-fix {
  color: var(--secondTwo);
}

.logo-separator {
  color: white;
}

.logo-flow {
  color: var(--base);
}

.auth-title {
  color: white;
  font-size: 1.5rem;
  text-align: center;
  margin: 0;
  font-weight: 500;
  letter-spacing: 1px;
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

.form-input {
  background: transparent;
  border: none;
  color: white;
  width: 100%;
  font-size: 1rem;
  outline: none;
}

.form-input::placeholder {
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
}

.btn-primary:hover {
  background: var(--secondTwo);
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 1px solid var(--base);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-link {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-link:hover {
  color: white;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--base);
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-overlay p {
  color: white;
  font-size: 1rem;
}

.help-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--base);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 100;
}

.help-button ion-icon {
  font-size: 1.5rem;
  color: white;
}

.help-button:hover {
  transform: scale(1.1);
  background: var(--secondTwo);
}

.help-button:active {
  transform: scale(0.95);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@media (min-width: 768px) {
  .auth-container {
    width: 80%;
    max-width: 600px;
  }

  .auth-title {
    font-size: 1.75rem;
  }

  .form-input {
    font-size: 1.1rem;
  }
}

@media (min-width: 1024px) {
  .auth-container {
    width: 70%;
    max-width: 500px;
    max-height: 70vh;
  }
}

@media (min-width: 1280px) {
  .auth-container {
    width: 40%;
    max-width: 450px;
  }
}

.password-strength {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.strength-indicator {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.strength-bar {
  height: 4px;
  width: 100%;
  border-radius: 2px;
  transition: all 0.3s ease;
  background-color: var(--secondTwo);
}

.strength-dots {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--secondTwo);
  transition: all 0.3s ease;
}

.dot.active {
  background-color: var(--base);
  transform: scale(1.2);
}

.strength-text {
  font-size: 0.75rem;
  color: white;
  text-align: center;
  font-weight: 500;
  letter-spacing: 0.5px;
}
</style>
