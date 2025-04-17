<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  isVisible: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['confirm', 'cancel']);

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <Teleport to="body">
    <div v-if="isVisible" class="confirm-modal" @click="handleCancel">
      <div class="confirm-content" @click.stop>
        <p class="confirm-message">{{ message }}</p>
        <div class="confirm-buttons">
          <button class="cancel-btn" @click="handleCancel">
            <ion-icon name="close-circle"></ion-icon>
            Cancelar
          </button>
          <button class="confirm-btn" @click="handleConfirm">
            <ion-icon name="checkmark-circle"></ion-icon>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.confirm-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease;
}

.confirm-content {
  background: var(--second);
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  border: 3px solid var(--base);
  animation: slideIn 0.3s ease;
}

.confirm-message {
  color: white;
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.confirm-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.confirm-btn,
.cancel-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.confirm-btn {
  background: var(--base);
  color: white;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.confirm-btn:hover,
.cancel-btn:hover {
  transform: translateY(-2px);
}

.confirm-btn:active,
.cancel-btn:active {
  transform: scale(0.95);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

ion-icon {
  font-size: 1.25rem;
}
</style> 