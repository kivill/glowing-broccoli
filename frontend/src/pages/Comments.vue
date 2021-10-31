<template>
  <q-page>
    <q-btn color="primary" label="Back" to="/" />
    <q-table
      dense
      title="Комментарии"
      :rows="comments"
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
              @click="
                updateStatus(props.row._id, 'approved', props.row.comment)
              "
              icon="add"
            />
          </q-td>
          <q-td auto-width>
            <q-btn
              size="sm"
              color="red"
              round
              dense
              @click="
                updateStatus(props.row._id, 'declined', props.row.comment)
              "
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
import { useComments } from "../modules/comments";
interface point {
  point: {
    address: string;
  };
}
interface creator {
  creator: {
    fullName: string;
  };
}
export default defineComponent({
  setup() {
    const { getAllComments, comments, updateStatus } = useComments();
    const columns = [
      {
        name: "creator",
        field: (_c: creator) => _c.creator?.fullName,
        label: "Автор",
        align: "left",
      },
      {
        name: "status",
        field: "status",
        label: "Статус",
        align: "left",
      },
      {
        name: "point",
        field: (_p: point) => _p.point?.address,
        label: "Точка",
        align: "left",
      },
      {
        name: "comment",
        field: "comment",
        label: "Текст",
        align: "left",
      },
    ];
    getAllComments();

    return {
      comments,
      columns,
      updateStatus,
    };
  },
});
</script>
