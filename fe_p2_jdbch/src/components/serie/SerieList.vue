<script setup lang="ts">
import type { Serie } from '@/models/serie'
import http from '@/plugins/axios'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { onMounted, ref } from 'vue'
import dayjs from 'dayjs'

const ENDPOINT = 'series'
let series = ref<Serie[]>([])
const emit = defineEmits(['edit'])
const serieDelete = ref<Serie | null>(null)
const mostrarConfirmDialog = ref<boolean>(false)

// Esta función asincrona se encarga de obtener la lista de álbumes y ordenarlos por ID
async function obtenerLista() {
  series.value = await http.get(ENDPOINT).then((response) => response.data)
  series.value.sort((a, b) => a.id - b.id) // Ordenar por ID
}

function emitirEdicion(serie: Serie) {
  emit('edit', serie)
}

function mostrarEliminarConfirm(serie: Serie) {
  serieDelete.value = serie
  mostrarConfirmDialog.value = true
}

async function eliminar() {
  await http.delete(`${ENDPOINT}/${serieDelete.value?.id}`)
  obtenerLista()
  mostrarConfirmDialog.value = false
}

onMounted(() => {
  obtenerLista()
})
defineExpose({ obtenerLista })
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Nro.</th>
          <th>Titulo</th>
          <th>Sinopsis</th>
          <th>Director</th>
          <th>Temporadas</th>
          <th>Fecha de Estreno</th>
          <th>Tipo Genero</th>
          <th>Operaciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(serie, index) in series" :key="serie.id">
          <td>{{ index + 1 }}</td>
          <td>{{ serie.titulo }}</td>
          <td>{{ serie.sinopsis }}</td>
          <td>{{ serie.director }}</td>
          <td>{{ serie.temporadas }}</td>
          <td>{{ dayjs(serie.fechaEstreno).format('DD-MM-YYYY') }}</td>
          <td>{{ serie.tipoGenero }}</td>
          <td>
            <Button icon="pi pi-pencil" aria-label="Editar" text @click="emitirEdicion(serie)" />
            <Button
              icon="pi pi-trash"
              aria-label="Eliminar"
              text
              @click="mostrarEliminarConfirm(serie)"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <Dialog
      v-model:visible="mostrarConfirmDialog"
      header="Confirmar Eliminación"
      :style="{ width: '25rem' }"
    >
      <p>¿Estás seguro de que deseas eliminar este registro?</p>
      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Cancelar"
          severity="secondary"
          @click="mostrarConfirmDialog = false"
        />
        <Button type="button" label="Eliminar" @click="eliminar" />
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
/*CSS TABLA */
/* main.css */
table {
  width: 100%;
  border-collapse: collapse; /*Esto es para que no haya espacio entre las celdas o sea elimina los bordes*/
  table-layout: fixed; /* Hace que las columnas mantengan su tamaño fijo */
}
th,
td {
  padding: 5px;
  text-align: left;
  word-wrap: break-word; /* Asegura que el texto se ajuste dentro de la celda */
  border-bottom: black 1px solid;
}

th {
  background-color: #333;
  color: white;
}

td {
  background-color: #444;
  color: white;
}
</style>
