<script setup>
import { ref } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);

const sections = [
  {
    title: 'Gestión de Compañía',
    slides: [
      {
        description: 'En la sección de Compañía podrás gestionar toda la información de tu empresa.\n Personalizar tu color y tu numero de telefono.',
        image: '/src/assets/img/tuto/company/company-1.png'
      }
    ]
  },
  {
    title: 'Gestión de Locales',
    slides: [
      {
        description: 'Añade y administra todos tus locales desde un solo lugar.',
        image: '/src/assets/img/tuto/premises/premises-1.png'
      },
      {
        description: 'Podras acceder a la contabilidad de cada local por aparte.',
        image: '/src/assets/img/tuto/premises/premises-2.png'
      }
    ]
  },
  {
    title: 'Gestión de Colaboradores',
    slides: [
      {
        description: 'Desde el perfil de colaborador podras ver tu informacion personal y tus datos laborales.',
        image: '/src/assets/img/tuto/workers/workers-3.png'
      },
      {
        description: 'Si eres Gerente podras registrar nuevos colaboradores y asignarles roles.',
        image: '/src/assets/img/tuto/workers/workers-1.png'
      },
      {
        description: 'Podras ver el rendimiento y la asistencia de tu equipo, descargar informes de rendimiento y asistencia.',
        image: '/src/assets/img/tuto/workers/workers-2.png'
      }
    ]
  },
  {
    title: 'Facturación',
    slides: [
      {
        description: 'Gestiona todas tus facturas y pagos en un solo lugar.',
        image: '/src/assets/img/tuto.png'
      },
      {
        description: 'Genera informes detallados de ingresos y gastos.',
        image: '/src/assets/img/tuto2.png'
      },
      {
        description: 'Configura métodos de pago y gestiona transacciones.',
        image: '/src/assets/img/tuto.png'
      }
    ]
  }
];

const currentSlides = ref(sections.map(() => 0));

const nextSlide = (sectionIndex) => {
  if (currentSlides.value[sectionIndex] < sections[sectionIndex].slides.length - 1) {
    currentSlides.value[sectionIndex]++;
  } else {
    currentSlides.value[sectionIndex] = 0;
  }
};

const prevSlide = (sectionIndex) => {
  if (currentSlides.value[sectionIndex] > 0) {
    currentSlides.value[sectionIndex]--;
  } else {
    currentSlides.value[sectionIndex] = sections[sectionIndex].slides.length - 1;
  }
};
</script>

<template>
  <transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click="emit('close')">
      <transition name="modal-content">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>Centro de Ayuda</h2>
            <button class="close-button" @click="emit('close')">
              <ion-icon name="close"></ion-icon>
            </button>
          </div>
          
          <div class="modal-body">
            <transition-group name="section" tag="div">
              <div v-for="(section, sectionIndex) in sections" :key="sectionIndex" class="help-section">
                <h3>{{ section.title }}</h3>
                <div class="slider-container">
                  <button class="slider-button prev" @click="prevSlide(sectionIndex)">
                    <ion-icon name="chevron-back"></ion-icon>
                  </button>
                  
                  <div class="slide-content">
                    <p class="slide-description">{{ section.slides[currentSlides[sectionIndex]].description }}</p>
                    <div class="image-container">
                      <img :src="section.slides[currentSlides[sectionIndex]].image" :alt="section.title">
                    </div>
                  </div>

                  <button class="slider-button next" @click="nextSlide(sectionIndex)">
                    <ion-icon name="chevron-forward"></ion-icon>
                  </button>
                </div>
                
                <div class="slide-indicators">
                  <span 
                    v-for="(_, slideIndex) in section.slides" 
                    :key="slideIndex"
                    :class="{ active: currentSlides[sectionIndex] === slideIndex }"
                    class="indicator-dot"
                  ></span>
                </div>
              </div>
            </transition-group>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
  padding: 10px;
}

.modal-content {
  background-color: var(--second);
  padding: 15px;
  border-radius: 15px;
  width: 80%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: var(--secShadow);
  border: 2px solid var(--base);
  color: white;
}

.modal-content::-webkit-scrollbar {
  display: none;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid white;
}

.modal-header h2 {
  color: white;
  font-family: var(--baseFont);
  letter-spacing: 2px;
  font-size: 1.2rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--base);
  padding: 5px;
  transition: transform 0.2s;
}

.close-button:hover {
  transform: scale(1.1);
}

.help-section {
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
}

.help-section h3 {
  color: white;
  margin-bottom: 15px;
  text-align: center;
  font-family: var(--baseFont);
  letter-spacing: 2px;
  font-size: 1.1rem;
}

.slider-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 5px;
}

.slide-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.slide-description {
  text-align: center;
  font-size: 0.9rem;
  color: white;
  margin-bottom: 10px;
  font-family: var(--baseFont);
  line-height: 1.4;
}

.slider-button {
  background-color: var(--base);
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.slider-button:hover {
  transform: scale(1.1);
  box-shadow: var(--secShadow);
}

.slider-button ion-icon {
  font-size: 18px;
}

.image-container {
  margin-top: 10px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: var(--secShadow);
  border: 2px solid white;
}

.image-container img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.image-container img:hover {
  transform: scale(1.02);
}

.slide-indicators {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
}

.indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.indicator-dot.active {
  background-color: white;
  transform: scale(1.2);
}

/* Tablets: 768px y mayores */
@media (min-width: 768px) {
  .modal-content {
    padding: 20px;
    width: 90%;
    max-width: 700px;
  }

  .modal-header h2 {
    font-size: 1.4rem;
  }

  .help-section {
    padding: 20px;
    margin-bottom: 25px;
  }

  .help-section h3 {
    font-size: 1.2rem;
    margin-bottom: 20px;
  }

  .slide-description {
    font-size: 1rem;
  }

  .slider-button {
    width: 35px;
    height: 35px;
  }

  .slider-button ion-icon {
    font-size: 20px;
  }

  .slider-container {
    gap: 10px;
  }
}

/* Desktop: 1280px y mayores */
@media (min-width: 1280px) {
  .modal-content {
    max-width: 800px;
    padding: 25px;
  }

  .modal-header h2 {
    font-size: 1.6rem;
  }

  .help-section {
    padding: 25px;
    margin-bottom: 30px;
  }

  .help-section h3 {
    font-size: 1.3rem;
  }

  .slide-description {
    font-size: 1.1rem;
  }

  .slider-button {
    width: 40px;
    height: 40px;
  }

  .slider-button ion-icon {
    font-size: 24px;
  }

  .indicator-dot {
    width: 8px;
    height: 8px;
  }
}

/* Transiciones */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active,
.modal-content-leave-active {
  transition: all 0.3s ease;
}

.modal-content-enter-from,
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.section-enter-active,
.section-leave-active {
  transition: all 0.3s ease;
}

.section-enter-from,
.section-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.section-move {
  transition: transform 0.3s ease;
}
</style> 