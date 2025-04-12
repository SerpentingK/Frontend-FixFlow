<script setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const showAlert = inject("showAlert");
const premisesCount = inject("premisesCount", ref(0));
const switchSAPM = inject("switchSAPM");

const local = ref({
  name: "",
  address: "",
  password: "",
  confirmPassword: ""
});

const registerLocal = async () => {
  if (local.value.password !== local.value.confirmPassword) {
    showAlert("2", "Las contraseñas no coinciden.");
    return;
  }
  
  try {
    // Aquí iría la lógica para registrar el local en el backend
    // Por ahora solo incrementamos el contador y navegamos
    premisesCount.value += 1;
    localStorage.setItem("premisesCount", premisesCount.value);
    switchSAPM(); // Cerrar el modal
    router.push('/premises/select-premise');
  } catch (error) {
    console.error("Error al registrar el local:", error);
    showAlert("2", "Error al registrar el local. Intente nuevamente.");
  }
};

const handleNewPremise = () => {
  switchSAPM(); // Cerrar el modal actual
  router.push('/premises/new-premise');
};

const cancelAdd = () => {
  switchSAPM(); // Cerrar el modal
};
</script>

<template>
  <div class="modal-overlay">
    <section class="form-container">
      <h2>Añadir Nuevo Local</h2>
      <div class="alert-container">
        <ion-icon name="alert-circle"></ion-icon>
        <p>Al añadir un nuevo local, se sumarán <span class="highlight">$30,000</span> a su facturación mensual.</p>
      </div>
      <span>¿Desea crear un nuevo local en el sistema?</span>
      <div class="btn-group">
        <button type="button" class="cancel-btn" @click="cancelAdd">Cancelar</button>
        <button type="button" class="submit-btn" @click="handleNewPremise">Crear Local</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.form-container {
  padding: 20px 10px;
  width: 75%;
  border-radius: 10px;
  background: var(--second);
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
  color: white;
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

.input-container ion-icon {
  margin-left: 10px;
  scale: 1.3;
}

.input-container input {
  all: unset;
  width: 80%;
  padding: 0 20px;
}

.btn-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.submit-btn, .cancel-btn {
  padding: 10px 20px;
  border-radius: 15px;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: bolder;
  transition: .3s;
  border: none;
  cursor: pointer;
}

.submit-btn {
  background-color: var(--successColor);
}

.cancel-btn {
  background-color: var(--errorColor);
}

.submit-btn:active, .cancel-btn:active {
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

.alert-container {
  background-color: var(--warningColor);
  color: white;
  padding: 15px;
  border-radius: 10px;
  margin: 15px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: pulse 2s infinite;
}

.alert-container ion-icon {
  font-size: 24px;
  color: white;
}

.alert-container p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.highlight {
  font-weight: bold;
  font-size: 1.1rem;
  color: var(--base);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}
</style> 