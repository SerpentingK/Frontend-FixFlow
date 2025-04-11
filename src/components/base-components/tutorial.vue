<script setup>
import { ref, inject, onMounted } from 'vue';

const showTutorial = inject('showTutorial');
const completeTutorial = inject('completeTutorial');
const skipTutorial = inject('skipTutorial');

// Pasos del tutorial
const tutorialSteps = [
  {
    id: 1,
    title: 'Bienvenido a FixFlow',
    message: 'FixFlow es una aplicación para gestionar reparaciones de dispositivos móviles. Este tutorial te guiará por las principales funciones.',
    target: null,
    position: 'center'
  },
  {
    id: 2,
    title: 'Navegación Principal',
    message: 'Utiliza la barra de navegación superior para acceder a las diferentes secciones de la aplicación.',
    target: '.nav-bar',
    position: 'bottom'
  },
  {
    id: 3,
    title: 'Gestión de Facturas',
    message: 'En la sección de facturas podrás crear, editar y gestionar todas las facturas de reparación.',
    target: '.bills-nav',
    position: 'bottom'
  },
  {
    id: 4,
    title: 'Marcas y Modelos',
    message: 'Puedes gestionar las marcas y modelos de dispositivos que reparas en tu negocio.',
    target: '.brands-section',
    position: 'right'
  },
  {
    id: 5,
    title: 'Gestión de Turnos',
    message: 'Controla los turnos de trabajo y realiza cierres de caja de manera sencilla.',
    target: '.shifts-section',
    position: 'left'
  },
  {
    id: 6,
    title: 'Estadísticas',
    message: 'Visualiza estadísticas importantes sobre reparaciones, ingresos y más.',
    target: '.stats-section',
    position: 'top'
  },
  {
    id: 7,
    title: '¡Listo para comenzar!',
    message: 'Has completado el tutorial. Ahora estás listo para utilizar FixFlow.',
    target: null,
    position: 'center'
  }
];

const currentStep = ref(0);
const showTooltip = ref(false);
const tooltipPosition = ref({ top: 0, left: 0 });

// Navegar al siguiente paso
const nextStep = () => {
  if (currentStep.value < tutorialSteps.length - 1) {
    currentStep.value++;
    updateTooltipPosition();
  } else {
    completeTutorial();
  }
};

// Navegar al paso anterior
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
    updateTooltipPosition();
  }
};

// Actualizar la posición del tooltip según el elemento objetivo
const updateTooltipPosition = () => {
  const step = tutorialSteps[currentStep.value];
  
  if (!step.target) {
    showTooltip.value = false;
    return;
  }
  
  const targetElement = document.querySelector(step.target);
  if (!targetElement) {
    showTooltip.value = false;
    return;
  }
  
  const rect = targetElement.getBoundingClientRect();
  const tooltip = document.querySelector('.tutorial-tooltip');
  
  if (!tooltip) return;
  
  const tooltipRect = tooltip.getBoundingClientRect();
  
  // Calcular posición según la propiedad position del paso
  switch (step.position) {
    case 'top':
      tooltipPosition.value = {
        top: rect.top - tooltipRect.height - 10,
        left: rect.left + (rect.width / 2) - (tooltipRect.width / 2)
      };
      break;
    case 'bottom':
      tooltipPosition.value = {
        top: rect.bottom + 10,
        left: rect.left + (rect.width / 2) - (tooltipRect.width / 2)
      };
      break;
    case 'left':
      tooltipPosition.value = {
        top: rect.top + (rect.height / 2) - (tooltipRect.height / 2),
        left: rect.left - tooltipRect.width - 10
      };
      break;
    case 'right':
      tooltipPosition.value = {
        top: rect.top + (rect.height / 2) - (tooltipRect.height / 2),
        left: rect.right + 10
      };
      break;
    default:
      tooltipPosition.value = {
        top: rect.top + (rect.height / 2) - (tooltipRect.height / 2),
        left: rect.left + (rect.width / 2) - (tooltipRect.width / 2)
      };
  }
  
  showTooltip.value = true;
};

// Resaltar el elemento objetivo
const highlightTarget = () => {
  const step = tutorialSteps[currentStep.value];
  if (!step.target) return;
  
  const targetElement = document.querySelector(step.target);
  if (!targetElement) return;
  
  // Añadir clase de resaltado
  targetElement.classList.add('tutorial-highlight');
  
  // Eliminar la clase después de un tiempo
  setTimeout(() => {
    targetElement.classList.remove('tutorial-highlight');
  }, 1000);
};

onMounted(() => {
  // Esperar a que los elementos estén renderizados
  setTimeout(() => {
    updateTooltipPosition();
    highlightTarget();
  }, 500);
});
</script>

<template>
  <div class="tutorial-overlay">
    <div class="tutorial-modal" v-if="!tutorialSteps[currentStep].target">
      <h2>{{ tutorialSteps[currentStep].title }}</h2>
      <p>{{ tutorialSteps[currentStep].message }}</p>
      <div class="tutorial-buttons">
        <button v-if="currentStep > 0" @click="prevStep" class="tutorial-btn prev">
          <ion-icon name="arrow-back-outline"></ion-icon> Anterior
        </button>
        <button v-if="currentStep < tutorialSteps.length - 1" @click="nextStep" class="tutorial-btn next">
          Siguiente <ion-icon name="arrow-forward-outline"></ion-icon>
        </button>
        <button v-else @click="completeTutorial" class="tutorial-btn complete">
          Completar <ion-icon name="checkmark-outline"></ion-icon>
        </button>
        <button @click="skipTutorial" class="tutorial-btn skip">
          Omitir tutorial <ion-icon name="close-outline"></ion-icon>
        </button>
      </div>
    </div>
    
    <div 
      v-if="showTooltip && tutorialSteps[currentStep].target" 
      class="tutorial-tooltip"
      :style="{ top: tooltipPosition.top + 'px', left: tooltipPosition.left + 'px' }"
    >
      <h3>{{ tutorialSteps[currentStep].title }}</h3>
      <p>{{ tutorialSteps[currentStep].message }}</p>
      <div class="tutorial-buttons">
        <button v-if="currentStep > 0" @click="prevStep" class="tutorial-btn prev">
          <ion-icon name="arrow-back-outline"></ion-icon>
        </button>
        <button v-if="currentStep < tutorialSteps.length - 1" @click="nextStep" class="tutorial-btn next">
          <ion-icon name="arrow-forward-outline"></ion-icon>
        </button>
        <button v-else @click="completeTutorial" class="tutorial-btn complete">
          <ion-icon name="checkmark-outline"></ion-icon>
        </button>
        <button @click="skipTutorial" class="tutorial-btn skip">
          <ion-icon name="close-outline"></ion-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tutorial-modal {
  background-color: var(--second);
  border-radius: 10px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  border: 3px solid var(--base);
  color: white;
  text-align: center;
}

.tutorial-modal h2 {
  margin-top: 0;
  color: var(--base);
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.tutorial-modal p {
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 30px;
}

.tutorial-tooltip {
  position: absolute;
  background-color: var(--second);
  border-radius: 8px;
  padding: 15px;
  max-width: 300px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  border: 2px solid var(--base);
  color: white;
  z-index: 10000;
}

.tutorial-tooltip h3 {
  margin-top: 0;
  color: var(--base);
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.tutorial-tooltip p {
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 15px;
}

.tutorial-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.tutorial-btn {
  background-color: var(--base);
  color: white;
  border: none;
  border-radius: 5px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.tutorial-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.tutorial-btn.prev {
  background-color: #555;
}

.tutorial-btn.next {
  background-color: var(--base);
}

.tutorial-btn.complete {
  background-color: #28a745;
}

.tutorial-btn.skip {
  background-color: #dc3545;
}

/* Estilo para resaltar elementos */
:global(.tutorial-highlight) {
  animation: pulse 1.5s infinite;
  box-shadow: 0 0 0 4px var(--base);
  border-radius: 4px;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(216, 75, 23, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(216, 75, 23, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(216, 75, 23, 0);
  }
}
</style> 