<template>
  <q-layout view="hhh lpR fFf">
    <template v-if="canOpenSide">
      <q-page-sticky
        style="z-index: 1001"
        position="top-left"
        :offset="[-1, 100]"
        @click="setSide"
      >
        <div
          :class="{ 'bg-primary': sideOpen, 'bg-black': !sideOpen }"
          style="height: 50px; width: 30px; border-radius: 0 5px 5px 0px"
        >
          <q-icon
            style="font-size: 1.4em"
            class="absolute-center text-white"
            :name="sideOpen ? 'chevron_left' : 'chevron_right'"
          ></q-icon>
        </div>
      </q-page-sticky>
      <q-drawer show-if-above v-model="sideOpen" side="left" bordered>
        <sidebar />
      </q-drawer>
    </template>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { useAuth } from "../modules/auth";
import { usePoints } from "../modules/points";
import Sidebar from "../pages/Sidebar.vue";

import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  components: {
    Sidebar,
  },

  setup() {
    const { isLoggedIn, logout, hasPermisson, canOpenSide } = useAuth();
    const { setSide, sideOpen } = usePoints();

    return {
      sideOpen,
      isLoggedIn,
      logout,
      hasPermisson,
      setSide,
      canOpenSide,
    };
  },
});
</script>
