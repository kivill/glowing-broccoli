<template>
  <q-page>
    <q-btn color="primary" label="Back" to="/" />
    <q-table
      dense
      title="Метки"
      :rows="points"
      :columns="columns"
      row-key="_id"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <q-td auto-width>
            <q-btn
              size="sm"
              color="primary"
              round
              dense
              @click="updateStatus(props.row._id, 'approved', props.row.name)"
              icon="add"
            />
          </q-td>
          <q-td auto-width>
            <q-btn
              size="sm"
              color="red"
              round
              dense
              @click="updateStatus(props.row._id, 'declined', props.row.name)"
              icon="remove"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { usePoints } from "../modules/points";
export default defineComponent({
  setup() {
    const { getAllPoints, points, updateStatus } = usePoints();
    const columns = [
      {
        name: "name",
        field: "name",
        label: "Место",
        align: "left",
      },
      {
        name: "status",
        field: "status",
        label: "Статус",
        align: "left",
      },
      {
        name: "type",
        field: "type",
        label: "Тип",
        align: "left",
      },
      {
        name: "vid",
        field: "vid",
        label: "Вид",
        align: "left",
      },
      {
        name: "address",
        field: "address",
        label: "Адрес",
        align: "left",
      },
      {
        name: "workHours",
        field: "workHours",
        label: "Часы работы",
        align: "left",
      },
      {
        name: "comment",
        field: "comment",
        label: "Комментарий",
        align: "left",
      },
    ];
    getAllPoints();

    return {
      points,
      columns,
      updateStatus,
    };
  },
});
</script>
