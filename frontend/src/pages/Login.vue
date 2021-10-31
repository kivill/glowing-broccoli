<template>
  <q-page class="flex flex-center">
    <q-card square style="width: 400px; padding: 50px">
      <q-card-section>
        <div class="text-h6">Логин</div>
      </q-card-section>
      <q-card-section>
        <q-input
          type="email"
          label="email"
          required
          autofocus
          v-model="email"
        />
        <q-input
          v-model="password"
          type="password"
          label="Пароль"
          required
          @keyup.enter="submit"
        /><br />
      </q-card-section>
      <q-card-actions>
        <q-btn color="primary" @click="submit"> Логин </q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../modules/auth";
interface LoginPayload {
  email: string;
  password: string;
}
interface User {
  id: string;
  email: string;
  accessToken: string;
  fullName: string;
  roles: string;
}
export default defineComponent({
  setup() {
    const payload = reactive<LoginPayload>({
      email: "",
      password: "",
    });
    const { logout, auth } = useAuth();
    const router = useRouter();
    const submit = async () => {
      let user = (await auth(payload)) as User;
      console.log(user);
      if (user.roles == "municipality") {
        await router.push({ name: "map_municipal" });
      } else {
        await router.push({ name: "home" });
      }
    };
    return {
      logout,
      auth,
      submit,
      ...toRefs(payload),
    };
  },
});
</script>
