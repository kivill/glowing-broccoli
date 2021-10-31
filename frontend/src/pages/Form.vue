<template>
  <q-page class="row items-center justify-evenly">
    <q-card>
      <q-card-section>
        <div class="q-pa-md" style="min-width: 350px">
          <q-list bordered class="rounded-borders">
            <q-expansion-item
              expand-separator
              icon="perm_identity"
              label="нет бесплатного wifi в заведениях в округе"
            >
              <q-card>
                <q-card-section>
                  <q-option-group
                    v-model="group1"
                    :options="options"
                    color="primary"
                    type="checkbox"
                  />
                  <q-input v-model="text1" label="Описание" />
                  <q-input v-model="summ1" label="Сумма" />
                </q-card-section>
              </q-card>
            </q-expansion-item>
            <q-expansion-item
              expand-separator
              icon="perm_identity"
              label="плохой ремонт в точках общепита, негде справлять день рождения в нашем районе"
            >
              <q-card>
                <q-card-section>
                  <q-card-section>
                    <q-option-group
                      v-model="group2"
                      :options="options"
                      color="primary"
                      type="checkbox"
                    />
                    <q-input v-model="text2" label="Описание" />
                    <q-input v-model="summ2" label="Сумма" />
                  </q-card-section>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="green">Отправить заявление</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "PageIndex",
  setup() {
    return {
      group1: ref(["op1"]),
      text1: ref(""),
      summ1: ref(""),
      group2: ref(["op1"]),
      text2: ref(""),
      summ2: ref(""),
      options: [
        {
          label: "Самостоятельно",
          value: "op1",
        },
        {
          label: "Субсидия",
          value: "op2",
        },
        {
          label: "Льготный кредит",
          value: "op3",
        },
      ],
    };
  },
});
</script>
