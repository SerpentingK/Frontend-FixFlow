<script setup>
import { ref, inject, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  premiseName: {
    type: String,
    required: true,
    default: "Local"
  },
  premises_id: {
    type: Number,
    required: true
  }   
});

const emit = defineEmits(['access-granted']);

const switchSLP = inject("switchSLP");
const showAlert = inject("showAlert");
const selectedPremise = inject("selectedPremise")
const sessionPremise = ref({
    premise_id: props.premises_id,
    password: "",
});


const postLogin = async () => {
  try {
    if (sessionPremise.value.password.length < 4) {
      showAlert?.("2", "La clave debe tener al menos 4 caracteres.");
      return;
    }

    const answer = await axios.post(`/api/loginPremises`, {
      premise_id: sessionPremise.value.premise_id,
      password: sessionPremise.value.password
    });

    console.log(answer.data);
    if (answer.data.status === "Login exitoso") {
      localStorage.setItem("activePremise", JSON.stringify({
        name: props.premiseName,
        id: props.premises_id
      }));
      
      switchSLP(props.premiseName, props.premises_id);
      selectedPremise.value = props.premiseName;
      sessionPremise.value.password = '';
    }
  } catch (error) {
    if (error.response && error.response.data) {
      showAlert("2", `Error al iniciar sesión: ${error.response.data.detail}`);
      console.error("Error al iniciar sesión", error.response.data);
    } else {
      showAlert("2", "Ha ocurrido un error inesperado. Inténtalo de nuevo.");
      console.error(error);
    }
  }
};

const cancelAccess = () => {
  sessionPremise.value.password = '';
  switchSLP(null);
};

const overlayAlpha = ref(0);

onMounted(() => {
  const storedPremise = localStorage.getItem("activePremise");
  if (storedPremise) {
    const premise = JSON.parse(storedPremise);
    selectedPremise.value = premise.name;
    switchSLP(premise.name, premise.id);
  }

  setTimeout(() => {
    overlayAlpha.value = 0.5;
  }, 100); // Pequeño retraso antes de iniciar la animación
});

</script>

<template>
  <div class="overlay" :style="{ backgroundColor: `rgba(0, 0, 0, ${overlayAlpha})` }">
    <section class="login-premise-cont">
      <h2>Acceso a {{ premiseName }}</h2>

      <form @submit.prevent="postLogin">
        <label class="input-container">
          <span class="info-label">Ingrese clave:</span>
          <input type="password" placeholder="Clave local" required v-model="sessionPremise.password" />
        </label>

        <div class="btn-group">
          <button class="state-btn cancel" type="button" @click="cancelAccess">Cancelar</button>
          <button class="state-btn" type="submit">Acceder</button>
        </div>
      </form>
    </section>
  </div>

</template>

<style scoped>
.overlay {

  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0);
  /* Empieza completamente transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  transition: background-color .5s ease-in-out;
}

.login-premise-cont {
  z-index: 10;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--second);
  width: 60%;
  border-radius: 10px;
  border: 4px solid var(--base);
  box-shadow: var(--baseShadow);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.login-premise-cont h2 {
  color: white;
  letter-spacing: 3px;
  text-shadow: 0 0 10px black;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.input-container {
  width: 80%;
  background-color: white;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.input-container input {
  all: unset;
  width: 60%;
}

.btn-group {
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: center;
  flex-direction: column-reverse;
  align-items: center;

}

.state-btn {
  all: unset;
  background-color: var(--second);
  padding: 10px;
  border: 2px solid var(--base);
  border-radius: 10px;
  color: white;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: 0.3s;
  width: 40%;
}

.state-btn.cancel {
  background-color: #aa3333;
  border-color: #882222;
}

.state-btn:hover {
  scale: 1.05;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--base);
  padding: 5px;
  color: white;
  border-radius: 5px;
  box-shadow: var(--secShadow);
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  scale: 1.1;
}

@media (min-width: 768px) {
  .login-premise-cont {
    font-size: 1.3rem;
  }
}

@media (min-width: 1024px) {
  .login-premise-cont {
    font-size: 1rem;
    width: 30%;
  }

  .btn-group {
    flex-direction: row;
  }
}
</style>
