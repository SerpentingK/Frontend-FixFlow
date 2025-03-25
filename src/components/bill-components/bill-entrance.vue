<script>
import { inject, onMounted, ref, watch, computed } from "vue";
import axios from "axios";

export default {
  setup() {
    // Referencias y reactividad
    const phones = ref([
      {
        brand_name: null,
        brand_id: 0,
        device: null,
        details: "",
        payment: 0,
        due: 0,
        individual_price: 0,
        availableDevices: [], // Lista de dispositivos por teléfono
      },
    ]);
    const loggedWorker = inject("loggedWorker", ref(null));
    const loggedCompany = inject("loggedCompany", ref(null));
    const startShift = inject("startShift", ref(null));
    const billData = inject("billData");
    const phones_amount = ref(1);
    const newBrand = ref(null);
    const newDevice = ref(null);
    const brands = ref([]);
    const devices = ref([]);
    const individual_price = ref(0);
    const payment = ref(0);
    const details = ref(null);
    const clientName = ref(null);
    const clientPhone = ref(null);

    const switchSBC = inject("switchSBC");

    // Cálculos computados
    const totalPrice = computed(() =>
      phones.value.reduce(
        (total, phone) => total + (phone.individual_price || 0),
        0
      )
    );
    // Métodos
    const increasePhonesAmount = () => {
      if (phones_amount.value < 5) {
        phones_amount.value++;
        phones.value.push({
          brand_name: null,
          brand_id: 0,
          device: null,
          payment: 0,
          due: 0,
          details: "",
          individual_price: 0,
          availableDevices: [], // Añadido para mantener dispositivos por teléfono
        });
      }
    };

    const decreasePhonesAmount = () => {
      if (phones_amount.value > 1) {
        phones_amount.value--;
        phones.value.pop();
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/allBrands/${loggedCompany.value}`
        );
        brands.value = response.data;
      } catch (error) {
        console.error("Error cargando marcas desde la API:", error);
      }
    };

    // Cargar dispositivos para una marca seleccionada en un teléfono específico
    const fetchDevicesForPhone = async (index, brandName) => {
      try {
        await brandNameId(brandName); // Obtener el ID de la marca antes de buscar dispositivos
        if (!id_brands.value) {
          console.error("No se pudo obtener el ID de la marca.");
          return;
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/${id_brands.value}/Devices`
        );
        phones.value[index].availableDevices = response.data;
      } catch (error) {
        console.error("Error cargando dispositivos para la marca:", error);
        phones.value[index].availableDevices = [];
      }
    };

    const addNewBrand = async (index) => {
      if (
        newBrand.value &&
        !brands.value.some((b) => b.name === newBrand.value)
      ) {
        try {
          // Agregar nueva marca a la API
          await axios.post(
            `http://127.0.0.1:8000/newBrand/${loggedCompany.value}`,
            { name: newBrand.value }
          );
          // Añadir la marca a la lista local
          brands.value.push({ name: newBrand.value });
          // Asignar la nueva marca como seleccionada
          phones.value[index].brand_name = newBrand.value;
          // Limpiar el campo de entrada de nueva marca
          newBrand.value = "";
        } catch (error) {
          console.error("Error agregando nueva marca:", error);
        }
      }
    };

    const id_brands = ref(null);

    const brandNameId = async (name) => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/Brands/${name}/${loggedCompany.value}`
        );
        id_brands.value = response.data[0].id;
      } catch (error) {
        console.error("Error cargando id de marca:", error);
      }
    };

    const addNewDevice = async (index) => {
      const name = phones.value[index].brand_name;
      await brandNameId(name);
      if (!brandNameId) {
        console.log(phones.value[index].brand_name);
        console.error("No se ha seleccionado una marca.");
        return;
      }

      if (
        newDevice.value &&
        !phones.value[index].availableDevices.some(
          (d) => d.name === newDevice.value
        )
      ) {
        try {
          // Agregar nuevo dispositivo a la API
          await axios.post("http://127.0.0.1:8000/newDevice", {
            id_brands: id_brands.value,
            name: newDevice.value,
          });
          // Añadir dispositivo a la lista local de dispositivos disponibles
          phones.value[index].availableDevices.push({ name: newDevice.value });
          // Asignar el dispositivo nuevo como seleccionado
          phones.value[index].device = newDevice.value;
          // Limpiar el campo de entrada del nuevo dispositivo
          newDevice.value = "";
        } catch (error) {
          console.error("Error agregando nuevo dispositivo:", error);
        }
      }
    };

    watch(
      () => phones.value.map((phone) => phone.brand_name),
      async (newBrandNames, oldBrandNames) => {
        for (let index = 0; index < newBrandNames.length; index++) {
          if (newBrandNames[index] !== oldBrandNames[index]) {
            await brandNameId(newBrandNames[index]); // Obtener brand_id
            phones.value[index].brand_id = id_brands.value; // Asignarlo al teléfono correspondiente
            await fetchDevicesForPhone(index, newBrandNames[index]); // Cargar dispositivos
          }
        }
      },
      { deep: true }
    );

    watch(
      () => phones.value.map(phone => ({
        individual_price: phone.individual_price,
        payment: phone.payment
      })),
      (newValues, oldValues) => {
        newValues.forEach((value, index) => {
          const phone = phones.value[index];
          phone.due = (phone.individual_price || 0) - (phone.payment || 0); // Calcula la deuda individual
        });
      },
      { deep: true }
    );

    // Ciclo de vida
    onMounted(fetchBrands);

    const submitForm = () => {
      billData.value.total_price = totalPrice.value;
      billData.value.client_name = clientName.value;
      billData.value.client_phone = clientPhone.value;
      billData.value.wname = loggedWorker.value;
      billData.value.ref_shift = startShift.value;
      // Crear una copia de phones_list excluyendo 'availableDevices'
      billData.value.phones = phones.value.map(
        ({ availableDevices, ...rest }) => rest
      );

      switchSBC(); // Cambia a la vista de confirmación
    };

    return {
      phones_amount,
      totalPrice,
      increasePhonesAmount,
      decreasePhonesAmount,
      phones,
      switchSBC,
      brands,
      addNewBrand,
      newBrand,
      devices,
      newDevice,
      addNewDevice,
      individual_price,
      payment,
      details,
      clientName,
      clientPhone,
      submitForm,
      loggedWorker,
      startShift,
    };
  },
};
</script>

<template>
  <section class="container">
    <h2>Facturación</h2>
    <form @submit.prevent="submitForm" class="bill-form">
      <!-- Input de Nombre del Cliente -->
      <label for="client-name-inp" class="input-container">
        <ion-icon name="person"></ion-icon>
        <input type="text" id="client-name-inp" v-model="clientName" required />
      </label>

      <!-- Input de Teléfono del Cliente -->
      <label for="client-tel-inp" class="input-container">
        <ion-icon name="call"></ion-icon>
        <input type="text" id="client-tel-inp" v-model="clientPhone" required />
      </label>

      <!-- Control de Cantidad de Celulares -->
      <label for="phone-amount-inp" class="input-container">
        <ion-icon name="phone-portrait"></ion-icon>
        <span style="font-weight: bolder; scale: 1.2">{{ phones_amount }}</span>
        <span class="btn-container">
          <button
            @click="increasePhonesAmount"
            class="action-btn"
            type="button"
          >
            <ion-icon name="caret-up"></ion-icon>
          </button>
          <button
            @click="decreasePhonesAmount"
            class="action-btn"
            type="button"
          >
            <ion-icon name="caret-down"></ion-icon>
          </button>
        </span>
      </label>

      <!-- Información de Celulares -->
      <fieldset
        class="phone-form"
        v-for="(phone, index) in phones"
        :key="index"
      >
        <legend>Celular {{ index + 1 }}</legend>

        <!-- Selección de Marca -->
        <label :for="`brand-select-${index}`" class="phone-input">
          <label class="select-label">
            <span>Marca:</span>
            <select v-model="phone.brand_name" required>
              <option
                v-for="brand in brands"
                :key="brand.name"
                :value="brand.name"
              >
                {{ brand.name }}
              </option>
              <option value="Otro">Otro</option>
            </select>
          </label>
          <label
            :for="`new-brand-${index}`"
            class="other-container"
            :class="{ active: phone.brand_name === 'Otro' }"
          >
            <span>Nueva marca:</span>
            <input
              type="text"
              class="other-input"
              :id="`new-brand-${index}`"
              v-model="newBrand"
              :disabled="phone.brand_name !== 'Otro'"
            />
            <button type="button" @click="addNewBrand(index)">
              <ion-icon name="add-circle"></ion-icon>
            </button>
          </label>
        </label>

        <!-- Selección de Modelo -->
        <label :for="`model-select-${index}`" class="phone-input">
          <label class="select-label">
            <span>Modelo:</span>
            <select
              v-model="phone.device"
              :id="`model-select-${index}`"
              required
            >
              <option
                v-for="device in phone.availableDevices"
                :key="device.id"
                :value="device.name"
              >
                {{ device.name }}
              </option>
              <option value="Otro">Otro</option>
            </select>
          </label>
          <label
            :for="`new-model-${index}`"
            class="other-container"
            :class="{ active: phone.device === 'Otro' }"
          >
            <span>Nuevo modelo:</span>
            <input
              type="text"
              class="other-input"
              :id="`new-model-${index}`"
              v-model="newDevice"
              :disabled="phone.device !== 'Otro'"
            />
            <button type="button" @click="addNewDevice(index)">
              <ion-icon name="add-circle"></ion-icon>
            </button>
          </label>
        </label>

        <!-- Input de Precio -->
        <label :for="`price-inp-${index}`" class="fact-inp">
          <span>Precio Estimado:</span>
          <input
            type="number"
            :id="`price-inp-${index}`"
            v-model="phone.individual_price"
            required
          />
        </label>
        <span class="fact-inp">
          <span>Abono:</span>
          <input type="number" v-model="phone.payment" required />
        </span>

        <!-- Detalles -->
        <label :for="`details-inp-${index}`" class="fact-inp">
          <span>Detalles:</span>
          <input
            type="text"
            :id="`details-inp-${index}`"
            v-model="phone.details"
          />
        </label>

        <span class="info-span">
          <span>Deuda:</span>
          <span>{{ phone.due }}</span>
        </span>
      </fieldset>

      <!-- Información General -->
      <span class="info-span">
        <span>Total:</span>
        <span>{{ totalPrice }}</span>
      </span>

      <!-- Botón de Enviar -->
      <div class="buttons-container">
        <button type="submit" class="submit-btn">Generar factura</button>
      </div>
    </form>
  </section>
</template>

<style scoped>
.container {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 5px 20px;
  width: 80%;
  border-radius: 10px;
  background: var(--baseGray);
  box-shadow: -25px -25px 51px #242424, 25px 25px 51px #484848;
  border: 4px solid var(--baseOrange);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 70%;
  overflow-y: scroll;
  scrollbar-width: none;
  transition: all 0.4s ease;
}

.container h2 {
  color: white;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.bill-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  gap: 15px;
}

.input-container {
  background-color: white;
  padding: 8px 10px;
  width: 80%;
  border-radius: 8px;
  display: flex;
  align-items: center;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
  justify-content: space-between;
}

.input-container input {
  all: unset;
  width: 100%;
  padding: 0 10px;
  font-size: 1rem;
}

.input-container ion-icon {
  font-size: 1.2rem;
  color: var(--baseOrange);
  scale: 1.2;
}

.phone-form {
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  border: 1px solid var(--secGray);
  padding: 10px;
  background-color: var(--thirdGray);
  width: 90%;
  gap: 10px;
  align-items: center;
}

.phone-form legend {
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  padding: 5px 10px;
  font-size: 1rem;
}

.phone-input {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 90%;
  flex-wrap: wrap;
}

.select-label {
  display: flex;
  background-color: white;
  padding: 5px 15px;
  border-radius: 8px;
  width: 90%;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
}

.select-label span {
  color: #333;
  font-weight: 500;
}

.select-label select {
  border-radius: 10px;
  font-size: 1rem;
  color: #333;
  width: 60%;
  outline: none;
  appearance: none;
  padding-left: 10px;
}

.select-label select:focus {
  outline: none;
}

.other-container ion-icon {
  color: var(--baseGray);
  scale: 1.3;
  transition: 0.4s;
}

.other-container {
  display: flex;
  align-items: center;
  gap: 5px 15px;
  padding: 5px 15px;
  background-color: var(--secGray);
  color: white;
  border-radius: 8px;
  width: 90%;
  margin-top: 5px;
  transition: 0.3s;
}

.other-container.active {
  display: flex;
  background-color: var(--baseOrange);
  color: white;
}

.other-container.active ion-icon {
  color: white;
  font-size: 1.2rem;
  margin-left: 5px;
}

.other-input {
  all: unset;
  width: 100%;
  padding: 0 10px;
  font-size: 1rem;
  color: #333;
  background-color: #f3f3f3;
  border-radius: 5px;
}

.other-container button {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--baseOrange);
}

.other-container button ion-icon {
  font-size: 1.2rem;
}

.fact-inp {
  display: flex;
  gap: 10px;
  width: 90%;
  justify-content: space-between;
  color: var(--secGray);
}

.fact-inp input {
  width: 50%;
  border-radius: 5px;
  padding: 5px 10px;
}

.info-span {
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--secGray);
}

.go-btn {
  all: unset;
  background-color: var(--baseOrange);
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  border: 2px solid var(--baseOrange);
  transition: 0.3s;
  margin-bottom: 10px;
}

.btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 70px;
  gap: 5px;
}

.action-btn {
  all: unset;
  display: flex;
  justify-content: center;
  align-items: center;
  scale: 1.3;
}

input[type="number"]::-webkit-inner-spin-button {
  display: none;
}

.action-btn:active ion-icon {
  color: var(--baseGray);
  scale: 0.7;
}
.submit-btn {
  background: var(--baseOrange);
  border: none;
  cursor: pointer;
  color: white;
  padding: 5px 20px;
  border-radius: 5px;
  border: 2px solid var(--baseOrange);
  transition: 0.3s;
  margin-bottom: 10px;
}

@media (min-width: 768px) {
  * {
    font-size: 1.3rem;
  }

  .container {
    width: 70%;
    max-height: 80%;
  }

  .select-label,
  .other-container {
    font-size: 1.2rem;
  }

  .phone-form legend {
    font-size: 1.4rem;
  }
}

@media (min-width: 1024px) {
  * {
    font-size: 1rem;
  }

  .select-label,
  .other-container {
    width: 40%;
  }

  .select-label *,
  .other-container * {
    font-size: 0.8rem;
  }

  .container {
    width: 50%;
    max-height: 70%;
  }

  .phone-form legend {
    font-size: 1rem;
  }

  .input-container {
    width: 50%;
  }

  .phone-input {
    width: 100%;
  }

  .go-btn:hover {
    scale: 1.1;
    background-color: var(--baseGray);
    box-shadow: var(--secShadow);
  }
  .submit-btn:hover {
    transform: scale(1.1);
    background-color: var(--baseGray);
    box-shadow: var(--secShadow);
  }
}
</style>
