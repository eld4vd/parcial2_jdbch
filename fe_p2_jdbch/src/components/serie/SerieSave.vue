<script setup lang="ts">
import type { Serie } from '@/models/serie'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { DatePicker, InputNumber, Textarea } from 'primevue'
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

    // Si fechaEstreno es una cadena, convertirla a Date
    if (serie.value.fechaEstreno && typeof serie.value.fechaEstreno === 'string') {
      serie.value.fechaEstreno = new Date(serie.value.fechaEstreno) // Convierte la fecha a un objeto Date
    }

    // Si fechaEstreno ya es un objeto Date, no hace falta modificarlo
    if (serie.value.fechaEstreno && !(serie.value.fechaEstreno instanceof Date)) {
      serie.value.fechaEstreno = new Date(serie.value.fechaEstreno) // Asegúrate de que sea un Date válido
    }
  },
)

async function handleSave() {
  try {
    const body = {
      titulo: serie.value.titulo,
      sinopsis: serie.value.sinopsis,
      director: serie.value.director,
      temporadas: serie.value.temporadas,
      fechaEstreno: serie.value.fechaEstreno,
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
        <DatePicker
          type="text"
          id="fechaEstreno"
          v-model="serie.fechaEstreno"
          class="flex-auto"
          manual-input
        />
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

<style scoped></style>
