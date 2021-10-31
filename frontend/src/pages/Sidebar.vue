<template>
  <div>
    <div :class="{ 'bg-primary': marker.text != 'new' }">
      <div>
        <q-btn
          :color="marker.text != 'new' ? 'blue-light-7' : 'green'"
          class="full-width text-white"
          label="Чебоксары"
          size="xl"
          glossy
          icon=""
        />
      </div>

      <div v-if="marker.text != 'new'" class="q-mt-lg text-center text-white">
        <p class="text q-mb-sm">{{ computedPointType(marker.type) }}</p>
        <p v-if="selectLocale == 'ru'" class="text-h6 text-bold q-mb-sm">
          {{ marker.comment }}
        </p>
        <b style="font-size: 16px">{{ marker.address }}<br /></b>
        <p v-if="marker.stat">
          <q-icon name="visibility"></q-icon>{{ marker.stat }}
        </p>
        <p />

        <p v-if="!marker.comment">{{ computedLocale("ChooseMarker") }}</p>

        <div v-if="marker.subType">
          <q-option-group
            v-model="group"
            :options="
              marker.subType.map((x) => {
                return {
                  label: x,
                  value: x,
                };
              })
            "
            color="green"
            type="checkbox"
          />
        </div>
        <q-btn
          size="sm"
          color="green"
          v-if="hasPermisson('user') && marker.comment"
          @click="deletePoint(marker._id)"
          >Проголосовать</q-btn
        >
        <q-btn
          size="sm"
          color="red"
          v-if="hasPermisson('admin') && marker.name"
          @click="deletePoint(marker._id)"
          >Удалить (Администратор)</q-btn
        >
      </div>
      <div v-else class="q-mx-lg q-mb-lg text-center">
        <div class="q-gutter-y-md column" v-if="hasPermisson('municipality')">
          <p>Новый объект для строительства</p>
          <q-input dense v-model="marker.address" label="Адрес" />
          <q-select
            dense
            borderless
            v-model="marker.subType"
            :options="subTypes"
            label="Тип"
            multiple
          />
          <q-input dense v-model="marker.comment" label="Комментарий" />
        </div>
        <div class="q-gutter-y-md column" v-if="hasPermisson('user')">
          <p>Новое обращение</p>
          <q-select
            dense
            borderless
            v-model="marker.type"
            :options="types"
            label="Тип"
            option-value="value"
            option-label="label"
            emit-value
            map-options
          />

          <q-input dense v-model="marker.address" label="Адрес" />

          <q-input dense v-model="marker.comment" label="Комментарий" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { baseUploadURL, baseURL } from "../boot/axios";
import { usePoints } from "../modules/points";
import { useAuth } from "../modules/auth";
import { useComments } from "../modules/comments";
import { ref, defineComponent, computed } from "vue";
import { useUsers } from "../modules/users";
import { useLang } from "../modules/lang";
import moment from "moment";
moment.locale("ru");
export default defineComponent({
  setup() {
    let newMarker = ref({});
    const dateFormatter = (_date: string) => {
      return moment(_date).fromNow();
    };
    const {
      points,
      setMarker,
      marker,
      canEdit,
      types,
      subTypes,
      sideOpen,
      deletePoint,
    } = usePoints();
    const { isLoggedIn, logout, hasPermisson, user } = useAuth();
    const { currentUser } = useUsers();
    const {
      comments,
      currentComment,
      canEditComment,
      sendComment,
      isCommentsLoading,
    } = useComments();
    const { selectLocale, computedLocale } = useLang();

    const getDirection = (lat: number, long: number) => {
      let currentGeo = [58.522857, 31.269816];
      window.open(
        `https://www.google.com/maps/dir/${currentGeo[0]},${currentGeo[1]}/${lat},${long}`,
        "_blank"
      );
    };
    const computedWorkHours = (data: string) => {
      if (!data) return "";
      let [h1, h2] = data.split("-");
      let _now = moment();
      let _h1 = moment().hours(parseInt(h1));
      let _h2 = moment().hours(parseInt(h2));
      let diffText = "";
      if (_h2.isAfter(_now) && _h1.isBefore(_now)) {
        diffText += `Закроется ${_h2.fromNow()}`;
      } else {
        diffText += "Откроется ";
        if (_h1.isAfter(_now)) diffText += _h1.fromNow();
        else diffText += _h1.add(1, "days").fromNow();
      }

      return diffText;
    };
    const computedPointType = (type: string) => {
      if (type) {
        return computed(() => {
          const asn = types.value.find((x) => x.value == type);
          if (asn) {
            return asn.label;
          } else {
            return "";
          }
        }).value;
      } else {
        return "";
      }
    };
    const uploadedImg = (info: any) => {
      console.log(info);
      marker.value.urlImg = info.xhr.response;
    };
    const uploadedAudio = (info: any) => {
      console.log(info);
      marker.value.urlAudio = info.xhr.response;
    };
    const uploadedAudioEn = (info: any) => {
      console.log(info);
      marker.value.urlAudioEn = info.xhr.response;
    };
    return {
      group: ref([]),
      newMarker,
      points,
      setMarker,
      marker,
      hasPermisson,
      computedPointType,
      canEdit,
      currentComment,
      comments,
      canEditComment,
      currentUser,
      sendComment,
      dateFormatter,
      getDirection,
      types,
      subTypes,
      user,
      sideOpen,
      computedWorkHours,
      isCommentsLoading,
      deletePoint,
      uploadedImg,
      uploadedAudio,
      uploadedAudioEn,
      baseUploadURL,
      baseURL,
      selectLocale,
      computedLocale,
    };
  },
});
</script>

<style>
</style>
