<script setup>
import { ref, inject } from 'vue';

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
  selectedPremise.value = premiseName.value
};

const cancelAccess = () => {
  keyInput.value = '';
  switchSLP(null);
};
</script>

<template>
  <section class="withdraw-container">
    <h2>Acceso a {{ premiseName }}</h2>

    <form @submit.prevent="verifyKey">
      <label class="input-container">
        <span class="info-label">Ingrese clave:</span>
        <input
          type="password"
          placeholder="Clave secreta"
          required
          v-model="keyInput"
        />
      </label>

      <div class="btn-group">
        <button class="state-btn cancel" type="button" @click="cancelAccess">Cancelar</button>
        <button class="state-btn" type="submit">Acceder</button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.withdraw-container {
  z-index: 10;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--second);
  width: 90%;
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

.withdraw-container h2 {
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
  .withdraw-container {
    font-size: 1.3rem;
  }
}
@media (min-width: 1024px) {
  .withdraw-container {
    font-size: 1rem;
    width: 40%;
  }
}
</style>
