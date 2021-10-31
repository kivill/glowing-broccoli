<template>
  <q-page class="q-pa-md">
    <q-btn color="primary" label="Back" to="/" />
    <q-table
      :loading="isLoading"
      title="Пользователи"
      :rows="users"
      :columns="columns"
      row-key="_id"
      :pagination="initialPagination"
    >
      <template v-slot:top-right>
        <q-btn color="primary" label="Добавить" dense @click="add" />
      </template>
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th auto-width />
        </q-tr>
      </template>
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
              @click="edit(props.row)"
              icon="create"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="modal" persistent>
      <q-card>
        <q-card-section v-if="!isCurrentLoading" class="items-center">
          <div class="row">
            <div class="col">
              <q-input
                v-model="currentUser.fullName"
                label="ФИО"
                :disable="currentUser._id ? true : false"
              />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input v-model="currentUser.email" label="Email" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-input v-model="currentUser.password" label="Пароль" />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-select
                dense
                v-model="currentUser.roles"
                :options="typeAuth"
                option-value="value"
                option-label="label"
                emit-value
                map-options
              ></q-select>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Отменить"
            color="red"
            @click="setCurrentUserEmpty"
            v-close-popup
          />
          <q-btn
            flat
            label="Сохранить"
            color="green"
            @click="saveCurrentUser"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useUsers } from "../modules/users";
import { useAuth } from "../modules/auth";
interface User {
  _id?: string;
  fullName: string;
  email: string;
  password?: string;
}
export default defineComponent({
  setup() {
    const {
      getUsers,
      users,
      isLoading,
      isCurrentLoading,
      setCurrentUserEmpty,
      setCurrentUser,
      saveCurrentUser,
      currentUser,
    } = useUsers();
    const { typeAuth } = useAuth();
    const columns = [
      {
        name: "_id",
        field: "_id",
        label: "id",
        align: "left",
      },
      {
        name: "fullName",
        field: "fullName",
        label: "ФИО",
        align: "left",
      },
      {
        name: "email",
        field: "email",
        label: "email",
        align: "left",
      },
    ];
    getUsers();
    let modal = ref(false);
    const add = () => {
      setCurrentUserEmpty();
      modal.value = true;
    };
    const edit = (user: User) => {
      setCurrentUser(user);
      modal.value = true;
    };
    return {
      columns,
      users,
      isLoading,
      modal,
      add,
      edit,
      isCurrentLoading,
      currentUser,
      saveCurrentUser,
      setCurrentUserEmpty,
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 1,
        rowsPerPage: 0,
      },
      typeAuth,
    };
  },
});
</script>

<style></style>
