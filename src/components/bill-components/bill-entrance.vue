<script setup>
import { inject, onMounted, ref, watch, computed } from "vue";
import axios from "axios";
import { useRouter } from 'vue-router';

// Referencias y reactividad
const router = useRouter();
const phones = ref([
  {
    brand_name: null,
    brand_id: 0,
    device: null,
    details: "",
    payment: 0,
    payment_physical: 0,
    payment_platform: 0,
    due: 0,
    individual_price: 0,
    availableDevices: [],
  },
]);
const loggedWorker = inject("loggedWorker", ref(null));
const showAlert = inject("showAlert", () => {});
const loggedCompany = inject("loggedCompany", ref(null));
const startShift = inject("startShift", ref(null));
const billData = inject("billData");
const phones_amount = ref(1);
const newBrand = ref(null);
const newDevice = ref(null);
const brands = ref([]);
const clientName = ref(null);
const clientPhone = ref(null);
const printEnabled = inject("printEnabled");
const switchSBC = inject("switchSBC");
const selectedPremise = inject("selectedPremise", ref(null));

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
      payment_physical: 0,
      payment_platform: 0,
      due: 0,
      details: "",
      individual_price: 0,
      availableDevices: [],
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
      `${import.meta.env.VITE_API_URL}/allBrands/${loggedCompany.value}`
    );
    brands.value = response.data;
  } catch (error) {
    console.error("Error cargando marcas desde la API:", error);
  }
};

const id_brands = ref(null);

const brandNameId = async (name) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/Brands/${name}/${loggedCompany.value}`
    );
    id_brands.value = response.data[0].id;
  } catch (error) {
    console.error("Error cargando id de marca:", error);
  }
};

const fetchDevicesForPhone = async (index, brandName) => {
  try {
    await brandNameId(brandName);
    if (!id_brands.value) {
      console.error("No se pudo obtener el ID de la marca.");
      return;
    }

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/${id_brands.value}/Devices`);
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
      await axios.post(`${import.meta.env.VITE_API_URL}/newBrand/${loggedCompany.value}`, {
        name: newBrand.value,
      });
      brands.value.push({ name: newBrand.value });
      phones.value[index].brand_name = newBrand.value;
      newBrand.value = "";
    } catch (error) {
      console.error("Error agregando nueva marca:", error);
    }
  }
};

const addNewDevice = async (index) => {
  const name = phones.value[index].brand_name;
  await brandNameId(name);
  if (!brandNameId) {
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
      await axios.post(`${import.meta.env.VITE_API_URL}/newDevice`, {
        id_brands: id_brands.value,
        name: newDevice.value,
      });
      phones.value[index].availableDevices.push({ name: newDevice.value });
      phones.value[index].device = newDevice.value;
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
        await brandNameId(newBrandNames[index]);
        phones.value[index].brand_id = id_brands.value;
        await fetchDevicesForPhone(index, newBrandNames[index]);
      }
    }
  },
  { deep: true }
);

watch(
  () =>
    phones.value.map((phone) => ({
      individual_price: phone.individual_price,
      payment: phone.payment,
    })),
  (newValues, oldValues) => {
    newValues.forEach((value, index) => {
      const phone = phones.value[index];
      phone.due = (phone.individual_price || 0) - (phone.payment || 0);
    });
  },
  { deep: true }
);

const formatCurrency = (value) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value || 0);
};

const formatNumberInput = (value) => {
  // Eliminar todos los caracteres no numéricos
  const numericValue = value.toString().replace(/\D/g, '');
  // Convertir a número
  return numericValue ? parseInt(numericValue, 10) : 0;
};

const updatePayment = (index, type, value) => {
  const phone = phones.value[index];
  const numericValue = formatNumberInput(value);

  if (type === "physical") {
    phone.payment_physical = numericValue;
  } else {
    phone.payment_platform = numericValue;
  }

  phone.payment = (phone.payment_physical || 0) + (phone.payment_platform || 0);
  phone.due = (phone.individual_price || 0) - phone.payment;
};

onMounted(async () => {
  
  await fetchBrands();
});

const submitForm = () => {
  // Validar información del cliente
  if (!clientName.value || !clientPhone.value) {
    showAlert("2", "Por favor complete la información del cliente");
    return;
  }

  // Validar cada teléfono
  for (let i = 0; i < phones.value.length; i++) {
    const phone = phones.value[i];
    if (!phone.brand_name) {
      showAlert("2", `Por favor seleccione la marca del teléfono ${i + 1}`);
      return;
    }
    if (!phone.device) {
      showAlert("2", `Por favor seleccione el modelo del teléfono ${i + 1}`);
      return;
    }
    if (!phone.individual_price || phone.individual_price <= 0) {
      showAlert("2", `Por favor ingrese un precio válido para el teléfono ${i + 1}`);
      return;
    }
    if (phone.payment < 0) {
      showAlert("2", `El pago del teléfono ${i + 1} no puede ser negativo`);
      return;
    }
  }

  billData.value = {
    ...billData.value,
    total_price: totalPrice.value,
    client_name: clientName.value,
    client_phone: clientPhone.value,
    wname: loggedWorker.value,
    ref_shift: startShift.value,
    phones: phones.value.map(
      ({
        availableDevices,
        payment_physical,
        payment_platform,
        ...rest
      }) => ({
        ...rest,
        payment_physical,
        payment_platform
      })
    ),
  };

  // Verificar los datos completos antes de enviarlos
  console.log("Datos completos de la factura:", billData.value);
  
  switchSBC();
};
</script>

<template>
  <section class="c-container">
    <h3>FACTURACIÓN</h3>

    <!-- Información del cliente -->
    <div class="info-cont">
      <span>Nombre del Cliente: </span>
      <input type="text" v-model="clientName" required class="input-field" />
    </div>

    <div class="info-cont">
      <span>Teléfono del Cliente: </span>
      <input type="text" v-model="clientPhone" required class="input-field" />
    </div>

    <!-- Control de cantidad de teléfonos -->
    <div class="info-cont phone-amount-control">
      <span>Cantidad de Celulares: </span>
      <div class="amount-control">
        <span>{{ phones_amount }}</span>
        <button @click="increasePhonesAmount" type="button" class="amount-btn">
          <ion-icon name="caret-up"></ion-icon>
        </button>
        <button @click="decreasePhonesAmount" type="button" class="amount-btn">
          <ion-icon name="caret-down"></ion-icon>
        </button>
      </div>
    </div>

    <!-- Sección para cada teléfono -->
    <div v-for="(phone, index) in phones" :key="index" class="phone-section">
      <h4>Celular {{ index + 1 }}</h4>

      <!-- Marca del teléfono -->
      <div class="info-cont">
        <span>Marca: </span>
        <select v-model="phone.brand_name" required class="select-field">
          <option v-for="brand in brands" :key="brand.name" :value="brand.name">
            {{ brand.name }}
          </option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <!-- Nueva marca (si se selecciona "Otro") -->
      <div v-if="phone.brand_name === 'Otro'" class="info-cont">
        <span>Nueva Marca: </span>
        <div class="input-with-btn">
          <input type="text" v-model="newBrand" class="input-field" />
          <button @click="addNewBrand(index)" type="button" class="icon-btn">
            <ion-icon name="add-circle"></ion-icon>
          </button>
        </div>
      </div>

      <!-- Modelo del teléfono -->
      <div class="info-cont">
        <span>Modelo: </span>
        <select v-model="phone.device" required class="select-field" :disabled="!phone.brand_name">
          <option v-for="device in phone.availableDevices" :key="device.id" :value="device.name">
            {{ device.name }}
          </option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <!-- Nuevo modelo (si se selecciona "Otro") -->
      <div v-if="phone.device === 'Otro'" class="info-cont">
        <span>Nuevo Modelo: </span>
        <div class="input-with-btn">
          <input type="text" v-model="newDevice" class="input-field" />
          <button @click="addNewDevice(index)" type="button" class="icon-btn">
            <ion-icon name="add-circle"></ion-icon>
          </button>
        </div>
      </div>

      <!-- Precio y pagos -->
      <div class="info-cont">
        <span>Precio Estimado: </span>
        <input 
          type="text" 
          :value="formatCurrency(phone.individual_price)"
          @input="(e) => phone.individual_price = formatNumberInput(e.target.value)"
          required 
          class="input-field" 
        />
      </div>

      <div class="info-cont">
        <span>Abono en Físico: </span>
        <input 
          type="text" 
          :value="formatCurrency(phone.payment_physical)"
          @input="(e) => updatePayment(index, 'physical', e.target.value)"
          required 
          class="input-field" 
        />
      </div>

      <div class="info-cont">
        <span>Abono en Plataforma: </span>
        <input 
          type="text" 
          :value="formatCurrency(phone.payment_platform)"
          @input="(e) => updatePayment(index, 'platform', e.target.value)"
          required 
          class="input-field" 
        />
      </div>

      <div class="info-cont">
        <span>Abono Total: </span>
        <span class="value-display">{{ formatCurrency(phone.payment) }}</span>
      </div>

      <div class="info-cont">
        <span>Detalles: </span>
        <input type="text" v-model="phone.details" class="input-field" />
      </div>

      <div class="info-cont">
        <span>Deuda: </span>
        <span class="value-display">{{ formatCurrency(phone.due) }}</span>
      </div>
    </div>

    <!-- Totales -->
    <div class="info-cont total-section">
      <span>Total Factura: </span>
      <span class="value-display total-amount">{{ formatCurrency(totalPrice) }}</span>
    </div>

    <!-- Botones -->
    <div class="btns">
      <button @click="switchSBC()">Cancelar</button>
      <button 
        @click="submitForm()" 
        class="confirm-btn"
      >
        Generar Factura
      </button>
    </div>

    <!-- Interruptor de impresión -->

  </section>
  <div class="print-toggle">
    <span>Imprimir factura: </span>
    <label class="toggle-switch">
      <input type="checkbox" v-model="printEnabled" />
      <span class="slider"></span>
    </label>
  </div>
</template>

<style scoped>
.c-container {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  width: 80%;
  border-radius: 10px;
  background: var(--second);
  box-shadow: -25px -25px 51px #242424,
    25px 25px 51px #484848;
  border: 4px solid var(--base);
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 75vh;
  overflow-y: auto;
  scrollbar-width: none;
  transition: all .4s ease;
  z-index: 10;
  gap: 15px;
}

h3 {
  color: white;
  text-transform: uppercase;
  font-size: 1.6rem;
  text-align: center;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

h4 {
  color: var(--base);
  letter-spacing: 2px;
  text-transform: uppercase;
  font-size: 1.3rem;
  margin: 10px 0;
  width: 100%;
  text-align: center;
}

.info-cont {
  width: 95%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.input-field {
  background: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  width: 50%;
  color: #333;
}

.select-field {
  background: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  width: 50%;
  color: #333;
}

.value-display {
  font-weight: bold;
  color: var(--base);
}

.phone-amount-control {
  display: flex;
  align-items: center;
}

.amount-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.amount-btn {
  background: transparent;
  border: none;
  color: var(--base);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 5px;
}

.phone-section {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  background: var(--secondThree);
  margin-bottom: 10px;
}

.input-with-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  width: 50%;
}

.icon-btn {
  background: transparent;
  border: none;
  color: var(--base);
  font-size: 1.2rem;
  cursor: pointer;
}

.total-section {
  margin-top: 10px;
  border-top: 2px solid var(--base);
  padding-top: 10px;
}

.total-amount {
  font-size: 1.2rem;
}

.btns {
  display: flex;
  gap: 20px;
  margin: 15px 0 10px;
  width: 90%;
}

.btns button {
  flex: 1;
  border: 2px solid var(--base);
  background-color: transparent;
  padding: 10px;
  color: white;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1.5px;
  border-radius: 5px;
  transition: all 0.3s;
  cursor: pointer;
}

.btns button:hover {
  transform: translateY(-2px);
}

.btns button:active {
  transform: translateY(0);
  scale: 0.98;
}

button.confirm-btn {
  background-color: var(--base);
}

.print-toggle {
  position: absolute;
  right: 20px;
  bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  background-color: var(--second);
  padding: 10px 15px;
  border-radius: 20px;
  border: 2px solid var(--base);
  z-index: 100;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked+.slider {
  background-color: var(--base);
}

input:checked+.slider:before {
  transform: translateX(26px);
}

@media (min-width: 768px) {
  .c-container {
    width: 70%;
    max-width: 700px;
  }

  .info-cont {
    font-size: 1.1rem;
  }

  h3 {
    font-size: 1.5rem;
  }

  .input-field,
  .select-field {
    padding: 8px 12px;
  }
}

@media (min-width: 1024px) {
  .c-container {
    width: 60%;
    max-width: 800px;
    padding: 25px;
  }

  .btns button {
    padding: 12px;
  }

  .phone-section {
    padding: 15px;
  }
}

.disabled-btn {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #666 !important;
}

.disabled-btn:hover {
  transform: none !important;
}
</style>