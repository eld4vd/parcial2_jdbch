<script setup lang="ts">
import type { Serie } from '@/models/serie'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { InputNumber, Textarea } from 'primevue'
import { computed, ref, watch } from 'vue'

const ENDPOINT = 'series'
const props = defineProps({
  mostrar: Boolean,
  serie: {
    type: Object as () => Serie,
    default: () => ({}) as Serie,
  },
  modoEdicion: Boolean,
})
const emit = defineEmits(['guardar', 'close'])

const dialogVisible = computed({
  get: () => props.mostrar,
  set: (value) => {
    if (!value) emit('close')
  },
})

const serie = ref<Serie>({ ...props.serie })

watch(
  () => props.serie,
  (newVal) => {
    serie.value = { ...newVal }
  },
)

async function handleSave() {
  try {
    const body = {
      titulo: serie.value.titulo.trim(),
      sinopsis: serie.value.sinopsis.trim(),
      director: serie.value.director.trim(),
      temporadas: serie.value.temporadas,
      fechaEstreno: serie.value.fechaEstreno,
      tipoGenero: serie.value.tipoGenero.trim(),
    }
    if (props.modoEdicion) {
      await http.patch(`${ENDPOINT}/${serie.value.id}`, body)
    } else {
      await http.post(ENDPOINT, body)
    }
    emit('guardar')
    serie.value = {} as Serie
    dialogVisible.value = false
  } catch (error: any) {
    alert(error?.response?.data?.message)
  }
}
</script>

<template>
  <div class="card flex justify-center">
    <Dialog
      v-model:visible="dialogVisible"
      :header="props.modoEdicion ? 'Editar Serie' : 'Añadir Serie'"
      style="width: 25rem"
    >
      <div class="flex items-center gap-4 mb-4">
        <label for="titulo" class="font-semibold w-4">Titulo</label>
        <InputText
          id="titulo"
          v-model="serie.titulo"
          class="flex-auto"
          autocomplete="off"
          autofocus
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="sinopsis" class="font-semibold w-4">Sinopsis</label>
        <Textarea id="sinopsis" v-model="serie.sinopsis" class="flex-auto" rows="5" autoResize />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="director" class="font-semibold w-4">Director/Directores</label>
        <InputText
          id="director"
          v-model="serie.director"
          class="flex-auto"
          autocomplete="off"
          autofocus
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="temporadas" class="font-semibold w-4">Temporadas</label>
        <InputNumber
          id="temporadas"
          v-model.number="serie.temporadas"
          type="number"
          class="flex-auto"
          autocomplete="off"
          autofocus
        />
      </div>

      <div class="flex items-center gap-4 mb-4">
        <label for="fechaEstreno" class="font-semibold w-4">Fecha de Estreno</label>
        <input
          type="date"
          id="fechaEstreno"
          v-model="serie.fechaEstreno"
          class="flex-auto custom-date"
        />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="tipoGenero" class="font-semibold w-4">Tipo de Género</label>
        <select id="tipoGenero" v-model="serie.tipoGenero" class="flex-auto">
          <option value="">Selecciona el tipo de género</option>
          <option value="accion">Acción</option>
          <option value="comedia">Comedia</option>
          <option value="terror">Terror</option>
          <option value="drama">Drama</option>
        </select>
      </div>

      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          severity="secondary"
          @click="dialogVisible = false"
        ></Button>
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave"></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.custom-date {
  width: 60%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #4a4a4a; /* Un gris oscuro para el borde */
  border-radius: 0.25rem;
  background-color: #09090b; /* Fondo oscuro */
  color: #ffffff; /* Letras claras */
}

.custom-date:focus {
  border-color: #6b6b6b; /* Un gris ligeramente más claro al enfocar */
  outline: 0;
}
</style>
