<script setup>
import { ref, inject, onMounted } from 'vue';

const props = defineProps({
  premiseName: {
    type: String,
    required: true,
    default: "Local"
  }
});

const emit = defineEmits(['access-granted']);

const switchSLP = inject("switchSLP");
const showAlert = inject("showAlert");
const selectedPremise = inject("selectedPremise")

const keyInput = ref('');
const fakeCorrectPassword = '1234';

const verifyKey = () => {
  if (keyInput.value.length < 4) {
    showAlert?.("2", "La clave debe tener al menos 4 caracteres.");
    return;
  }

  if (keyInput.value !== fakeCorrectPassword) {
    showAlert?.("2", "Clave incorrecta para el local.");
    return;
  }
  showAlert("1", "Ingreso al local exitoso.");
  switchSLP(null); // Cierra modal al acceder correctamente
  selectedPremise.value = premiseName
};

const cancelAccess = () => {
  keyInput.value = '';
  switchSLP(null);
};

const overlayAlpha = ref(0);

onMounted(() => {
  setTimeout(() => {
    overlayAlpha.value = 0.5;
  }, 100); // Pequeño retraso antes de iniciar la animación
});
</script>

<template>
  <div class="overlay" :style="{ backgroundColor: `rgba(0, 0, 0, ${overlayAlpha})` }">
    <section class="login-premise-cont">
      <h2>Acceso a {{ premiseName }}</h2>

      <form @submit.prevent="verifyKey">
        <label class="input-container">
          <span class="info-label">Ingrese clave:</span>
          <input type="password" placeholder="Clave local" required v-model="keyInput" />
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
  z-index: 1000;
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
