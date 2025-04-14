<script setup>
import { ref, inject, onMounted } from 'vue';
import axios from 'axios';

const loggedCompany = inject("loggedCompany", ref(null));
const showAlert = inject("showAlert");

const brands = ref([]);
const editingType = ref('brand');
const editName = ref('');
const currentEdit = ref(null);
const id_brands = ref(null);
const isEditing = ref(false);

// Obtener todas las marcas
const fetchBrands = async () => {
    try {
        const response = await axios.get(`/api/allBrands/${loggedCompany.value}`);
        brands.value = response.data;
    } catch (error) {
        console.error("Error cargando marcas desde la API:", error);
        showAlert("2", "Error al cargar las marcas");
    }
};

// Obtener el ID de una marca por nombre
const brandNameId = async (name) => {
    try {
        const response = await axios.get(`/api/Brands/${name}/${loggedCompany.value}`);
        id_brands.value = response.data[0].id;
        return id_brands.value;
    } catch (error) {
        console.error("Error cargando id de marca:", error);
        return null;
    }
};

// Obtener los dispositivos de una marca
const fetchDevicesForBrand = async (brandId) => {
    try {
        const response = await axios.get(`/api/${brandId}/Devices`);
        return response.data;
    } catch (error) {
        console.error("Error cargando dispositivos para la marca:", error);
        return [];
    }
};

// Editar una marca
const editBrand = async (brand) => {
    try {
        // Obtener el ID de la marca antes de permitir la edición
        const brandId = await brandNameId(brand.name);
        if (!brandId) {
            showAlert("2", "No se pudo obtener el ID de la marca");
            return;
        }
        
        editingType.value = 'brand';
        editName.value = brand.name;
        currentEdit.value = brand;
        brand.id = brandId; // Asignar el ID directamente al objeto brand
        isEditing.value = true;
    } catch (error) {
        console.error("Error al preparar la edición de la marca:", error);
        showAlert("2", "Error al preparar la edición");
    }
};

// Editar un modelo
const editModel = (brand, model) => {
    editingType.value = 'model';
    editName.value = model.name;
    currentEdit.value = { brand, model };
    isEditing.value = true;
};

// Guardar cambios
const saveEdit = async () => {
    try {
        if (editingType.value === 'brand') {
            // Actualizar nombre de marca
            await axios.put(`/api/Brands/Edit/${currentEdit.value.id}`, {
                name: editName.value
            });
            currentEdit.value.name = editName.value;
            showAlert("1", "Marca actualizada correctamente");
        } else {
            // Actualizar nombre de modelo
            await axios.put(`/api/Devices/Edit/${currentEdit.value.model.id}`, {
                name: editName.value
            });
            currentEdit.value.model.name = editName.value;
            showAlert("1", "Modelo actualizado correctamente");
        }
        cancelEdit();
    } catch (error) {
        console.error("Error al guardar cambios:", error);
        showAlert("2", "Error al guardar los cambios");
    }
};

// Cancelar edición
const cancelEdit = () => {
    isEditing.value = false;
    editName.value = '';
    currentEdit.value = null;
};

// Cargar datos al montar el componente
onMounted(async () => {
    await fetchBrands();

    // Cargar los dispositivos para cada marca
    for (const brand of brands.value) {
        const brandId = await brandNameId(brand.name);
        if (brandId) {
            const devices = await fetchDevicesForBrand(brandId);
            brand.models = devices;
        }
    }
});
</script>

<template>
    <div class="brands-container">
        <h2>Marcas y Modelos</h2>

        <div class="brands-list">
            <div v-for="brand in brands" :key="brand.id" class="brand-item">
                <div class="brand-header">
                    <div class="name-container">
                        <input 
                            v-if="isEditing && currentEdit === brand" 
                            type="text" 
                            v-model="editName" 
                            class="edit-input"
                            @keyup.enter="saveEdit"
                            @keyup.esc="cancelEdit"
                        >
                        <h3 v-else>{{ brand.name }}</h3>
                    </div>
                    <div class="btn-group">
                        <button v-if="isEditing && currentEdit === brand" class="state-btn" @click="saveEdit">
                            <ion-icon name="checkmark-outline"></ion-icon>
                        </button>
                        <button v-if="isEditing && currentEdit === brand" class="state-btn cancel" @click="cancelEdit">
                            <ion-icon name="close-outline"></ion-icon>
                        </button>
                        <button v-else class="edit-btn" @click="editBrand(brand)">
                            <ion-icon name="pencil-outline"></ion-icon>
                        </button>
                    </div>
                </div>

                <div class="models-list">
                    <div v-for="model in brand.models" :key="model.id" class="model-item">
                        <div class="name-container">
                            <input 
                                v-if="isEditing && currentEdit?.model === model" 
                                type="text" 
                                v-model="editName" 
                                class="edit-input"
                                @keyup.enter="saveEdit"
                                @keyup.esc="cancelEdit"
                            >
                            <span v-else>{{ model.name }}</span>
                        </div>
                        <div class="btn-group">
                            <button v-if="isEditing && currentEdit?.model === model" class="state-btn" @click="saveEdit">
                                <ion-icon name="checkmark-outline"></ion-icon>
                            </button>
                            <button v-if="isEditing && currentEdit?.model === model" class="state-btn cancel" @click="cancelEdit">
                                <ion-icon name="close-outline"></ion-icon>
                            </button>
                            <button v-else class="edit-btn" @click="editModel(brand, model)">
                                <ion-icon name="pencil-outline"></ion-icon>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.brands-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    width: 80%;
    max-height: 80vh;
    border-radius: 10px;
    background: var(--second);
    box-shadow: -25px -25px 51px #242424, 25px 25px 51px #484848;
    border: 4px solid var(--base);
    overflow-y: auto;
    scrollbar-width: none;
}

.brands-container h2 {
    color: white;
    letter-spacing: 3px;
    text-shadow: 0 0 10px black;
    text-align: center;
    margin-bottom: 20px;
}

.brands-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.brand-item {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 15px;
}

.brand-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.brand-header h3 {
    color: white;
    margin: 0;
}

.name-container {
    flex: 1;
    margin-right: 10px;
}

.edit-input {
    all: unset;
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
    width: 90%;
    font-size: 1rem;
}

.models-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.model-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    padding: 8px 12px;
    border-radius: 5px;
    color: var(--secondTwo);
}

.edit-btn {
    all: unset;
    background-color: var(--base);
    color: white;
    padding: 5px;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
}

.edit-btn:hover {
    scale: 1.1;
}

.edit-btn:active {
    scale: 0.9;
}

.btn-group {
    display: flex;
    gap: 5px;
}

.state-btn {
    all: unset;
    background-color: var(--second);
    padding: 5px;
    border: 2px solid var(--base);
    border-radius: 5px;
    color: white;
    cursor: pointer;
    transition: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.state-btn.cancel {
    background-color: #aa3333;
    border-color: #882222;
}

.state-btn:hover {
    scale: 1.1;
}

@media (min-width: 768px) {
    .brands-container {
        width: 60%;
    }
}

@media (min-width: 1024px) {
    .brands-container {
        width: 40%;
    }
}
</style>
