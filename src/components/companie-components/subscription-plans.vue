<script setup>
import { ref, defineEmits } from 'vue';
import { allFeatures, plans, hasFeature, getFeatureValue } from '@/data/plans';
import ConfirmAlert from '../base-components/confirm-alert.vue';

const emit = defineEmits(['planSelected', 'close']);

const selectedPlan = ref(null);
const showConfirmAlert = ref(false);
const tempSelectedPlan = ref(null);

const selectPlan = (plan) => {
  if (plan.id === 3) {
    emit('planSelected', plan);
    return;
  }
  tempSelectedPlan.value = plan;
  showConfirmAlert.value = true;
};

const handleConfirm = () => {
  selectedPlan.value = tempSelectedPlan.value;
  emit('planSelected', tempSelectedPlan.value);
  showConfirmAlert.value = false;
};

const handleCancel = () => {
  showConfirmAlert.value = false;
  tempSelectedPlan.value = null;
};

const closeModal = () => {
  emit('close');
};
</script>

<template>
  <div class="plans-modal" @click="closeModal">
    <div class="plans-container" @click.stop>
      <div class="modal-header">
        <h2>Selecciona tu Plan</h2>
        <button class="close-modal-btn" @click="closeModal">
          <ion-icon name="close"></ion-icon>
        </button>
      </div>
      
      <!-- Vista Desktop -->
      <div class="plans-table-container">
        <table class="plans-table">
          <thead>
            <tr>
              <th class="feature-header">Características</th>
              <th v-for="plan in plans" :key="plan.id">
                <div class="plan-header">
                  <h3>{{ plan.name }}</h3>
                  <div class="price">
                    <span class="amount">${{ plan.price }}</span>
                    <span class="period">/{{ plan.period }}</span>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="feature in allFeatures" :key="feature">
              <td class="feature-name">{{ feature }}</td>
              <td v-for="plan in plans" :key="`${plan.id}-${feature}`" class="feature-check">
                <template v-if="feature === 'Número de Locales'">
                  <span class="locations-number">{{ plan.locations }}</span>
                </template>
                <template v-else>
                  <ion-icon 
                    :name="hasFeature(plan, feature) ? 'checkmark-circle' : 'close-circle'" 
                    class="check-icon"
                    :class="{ 'disabled': !hasFeature(plan, feature) }"
                  ></ion-icon>
                </template>
              </td>
            </tr>
            <tr class="action-row">
              <td></td>
              <td v-for="plan in plans" :key="plan.id">
                <button 
                  class="select-btn" 
                  :class="{ 
                    'selected': selectedPlan?.id === plan.id,
                    'disabled': plan.id === 3
                  }"
                  @click="selectPlan(plan)"
                  :disabled="plan.id === 3"
                >
                  <template v-if="plan.id === 3">
                    Próximamente
                  </template>
                  <template v-else>
                    {{ selectedPlan?.id === plan.id ? 'Seleccionado' : 'Seleccionar' }}
                  </template>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Vista Móvil -->
      <div class="mobile-plans">
        <div v-for="plan in plans" 
             :key="plan.id" 
             class="mobile-plan-card"
             :class="{ 'selected': selectedPlan?.id === plan.id }">
          <div class="plan-header">
            <h3>{{ plan.name }}</h3>
            <div class="price">
              <span class="amount">${{ plan.price }}</span>
              <span class="period">/{{ plan.period }}</span>
            </div>
          </div>
          <ul class="features">
            <li v-for="feature in allFeatures" :key="feature">
              <template v-if="feature === 'Número de Locales'">
                <span class="locations-number">{{ plan.locations }}</span>
                {{ feature }}
              </template>
              <template v-else>
                <ion-icon 
                  :name="hasFeature(plan, feature) ? 'checkmark-circle' : 'close-circle'" 
                  class="check-icon"
                  :class="{ 'disabled': !hasFeature(plan, feature) }"
                ></ion-icon>
                {{ feature }}
              </template>
            </li>
          </ul>
          <button 
            class="select-btn" 
            :class="{ 
              'selected': selectedPlan?.id === plan.id,
              'disabled': plan.id === 3
            }"
            @click="selectPlan(plan)"
            :disabled="plan.id === 3"
          >
            <template v-if="plan.id === 3">
              Próximamente
            </template>
            <template v-else>
              {{ selectedPlan?.id === plan.id ? 'Seleccionado' : 'Seleccionar' }}
            </template>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Alerta de confirmación -->
  <ConfirmAlert
    :is-visible="showConfirmAlert"
    :message="`¿Estás seguro que deseas cambiar al ${tempSelectedPlan?.name}? Este cambio afectará las funcionalidades disponibles en tu cuenta.`"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<style scoped>
/* Estilos base */
.plans-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1100;
  padding: 1rem;
  overflow: auto;
  width: 100%;
  height: 100%;
}

.plans-container {
  position: relative;
  background: var(--second);
  border-radius: 1rem;
  padding: 2.5rem;
  width: 95%;
  max-width: 1200px;
  max-height: 80vh;
  overflow-y: auto;
  border: 3px solid var(--base);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  color: white;
  margin: 2rem auto;
  scrollbar-width: none;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 600;
  color: white;
}

/* Tabla Desktop */
.plans-table-container {
  display: none;
  overflow-x: auto;
  margin: 0 -1rem;
  scrollbar-width: none;
}

.plans-table {
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
  color: white;
}

.plans-table th,
.plans-table td {
  padding: 1.25rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-header {
  position: sticky;
  left: 0;
  background: var(--second);
  text-align: left;
  font-size: 1.1rem;
  color: var(--base);
  width: 25%;
  backdrop-filter: blur(5px);
  z-index: 1;
}

.feature-name {
  text-align: left;
  font-size: 0.95rem;
  padding-left: 1rem;
  color: white;
}

.feature-check {
  color: var(--base);
  font-size: 1.5rem;
  background: rgba(255,255,255,0.05);
}

.check-icon {
  color: var(--base);
  font-size: 1.75rem;
  transition: transform 0.2s ease;
}

.check-icon.disabled {
  color: rgba(255, 255, 255, 0.15);
}

.plan-header {
  padding: 1.5rem;
  background: rgba(255,255,255,0.05);
  border-radius: 0.5rem;
}

.plan-header h3 {
  font-size: clamp(1.25rem, 2vw, 1.5rem);
  margin-bottom: 0.75rem;
  color: white;
}

.price {
  margin: 1rem 0;
  color: white;
}

.amount {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--base);
}

.period {
  font-size: 0.9rem;
  opacity: 0.8;
  color: white;
}

/* Versión Móvil */
.mobile-plans {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.mobile-plan-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  color: white;
}

.mobile-plan-card.selected {
  border-color: var(--base);
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-5px);
}

.features {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  color: white;
}

.features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  color: white;
}

.select-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 0.5rem;
  background: var(--base);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.select-btn:hover {
  background: var(--secondTwo);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.select-btn.selected {
  background: var(--secondTwo);
  pointer-events: none;
}

.locations-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--base);
}

.action-row td {
  padding-top: 1.5rem !important;
  background: var(--second);
}

/* Media Queries */
@media (max-width: 767px) {
  .plans-modal {
    padding: 0;
  }
  
  .plans-container {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    border-radius: 0;
    margin: 0;
  }
  
  .mobile-plan-card {
    padding: 1.25rem;
  }
  
  .features li {
    font-size: 0.85rem;
  }
  
  h2 {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .plans-container {
    padding: 2rem;
    max-width: 95%;
  }
  
  .mobile-plans {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .mobile-plan-card {
    min-width: 0;
  }
}

@media (min-width: 1024px) {
  .mobile-plans {
    display: none;
  }
  
  .plans-table-container {
    display: block;
  }
  
  .plans-table th,
  .plans-table td {
    padding: 1.5rem;
  }
  
  .plans-table tr:hover td {
    background: rgba(255,255,255,0.03);
  }
}


/* Animaciones */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.mobile-plan-card {
  animation: fadeIn 0.4s ease forwards;
  opacity: 0;
}

.mobile-plan-card:nth-child(1) { animation-delay: 0.1s; }
.mobile-plan-card:nth-child(2) { animation-delay: 0.2s; }
.mobile-plan-card:nth-child(3) { animation-delay: 0.3s; }

/* Corrección específica para iconos */
ion-icon {
  color: inherit;
}

.select-btn.disabled {
  background: rgba(255, 255, 255, 0.1);
  cursor: not-allowed;
  opacity: 0.7;
}

.select-btn.disabled:hover {
  transform: none;
  box-shadow: none;
}

.mobile-plan-card:nth-child(3) {
  opacity: 0.7;
  position: relative;
}

.mobile-plan-card:nth-child(3)::after {
  content: 'Próximamente';
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--base);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  opacity: 0.8;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-header h2 {
  margin: 0;
}

.close-modal-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-modal-btn:hover {
  color: var(--base);
  transform: scale(1.1);
}
</style>