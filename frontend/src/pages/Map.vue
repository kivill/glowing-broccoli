<template>
  <q-page>
    <div style="position: absolute; z-index: 1000; right: 20px; top: 10px">
      <div v-if="!isLoggedIn">
        <q-btn
          push
          size="sm"
          color="white"
          text-color="primary"
          :label="computedLocale('LoginButton')"
          to="/login"
        />
      </div>
      <div v-if="!isLoggedIn">
        <q-btn
          push
          size="sm"
          color="white"
          text-color="primary"
          :label="computedLocale('Register')"
          @click="add"
        />
      </div>
      <span v-if="isLoggedIn" class="q-gutter-x-xs">
        <span v-if="hasPermisson('admin')" class="q-gutter-x-xs">
          <q-btn
            push
            size="sm"
            color="white"
            text-color="primary"
            :label="computedLocale('MarkersButton')"
            to="/points"
          />
          <q-btn
            push
            size="sm"
            color="white"
            text-color="primary"
            :label="computedLocale('CommentsButton')"
            to="/comments"
          />
          <q-btn
            push
            size="sm"
            color="white"
            text-color="primary"
            :label="computedLocale('UsersButton')"
            to="/users"
          />
        </span>

        <span v-if="hasPermisson('user')"></span>
        <q-btn
          push
          size="sm"
          :color="canEdit ? 'primary' : 'white'"
          :text-color="canEdit ? 'white' : 'primary'"
          :label="computedLocale('MarkerButton')"
          @click="setEdit(!canEdit)"
        />
        <q-btn
          push
          size="sm"
          color="white"
          text-color="primary"
          :label="computedLocale('ExitButton')"
          @click="logout"
          to="/map"
        />
      </span>
    </div>
    <div style="height: 100vh; width: 100%">
      <l-map ref="map" :zoom="zoom" :center="coords">
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
        ></l-tile-layer>
        <l-polygon
          v-if="hasPermisson('municipality')"
          :lat-lngs="[
            [56.116017, 47.212425],
            [56.110561, 47.208327],
            [56.106753, 47.221103],
            [56.10961, 47.224681],
          ]"
          color="#41b782"
          :fill="true"
          :fillOpacity="0.5"
          fillColor="#41b782"
        >
          <l-popup>Описание</l-popup>
        </l-polygon>
        di
        <l-marker
          v-for="point in points"
          :key="point.id"
          :lat-lng="point.coordinates"
          @click="
            setMarker(point);
            setView(point);
            currentComment.point = point._id;
            getComments(point._id);
          "
        >
          <l-icon
            :icon-url="computedIconUrl(point.type)"
            :icon-size="[25, 25]"
            :popup-anchor="[0, -10]"
          ></l-icon>
          <l-popup>{{ point.comment }}</l-popup>
        </l-marker>
        <l-marker
          v-if="canEdit"
          :lat-lng="newPoint.coordinates"
          draggable
          @moveend="log"
          @click="setMarker(newPoint)"
        >
          <l-popup>
            <q-btn dense color="primary" size="sm" @click="savePoint"
              >Сохранить</q-btn
            >
          </l-popup>
        </l-marker>
      </l-map>
    </div>
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

<script>
import {
  defineComponent,
  PropType,
  computed,
  ref,
  reactive,
  toRef,
  Ref,
  Component,
} from "vue";

import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LIcon,
  LPolygon,
  LRectangle,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
import { useAuth } from "../modules/auth";
import { usePoints } from "../modules/points";
import { useComments } from "../modules/comments";
import { useLang } from "../modules/lang";
import { useUsers } from "../modules/users";
export default defineComponent({
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LIcon,
    LPolygon,
    LRectangle,
  },
  setup() {
    const { isLoggedIn, logout, hasPermisson } = useAuth();
    const { selectLocale, computedLocale } = useLang();
    const {
      points,
      setMarker,
      marker,
      addNewPoint,
      canEdit,
      setEdit,
      getAddress,
      getPoints,
      types,
      setSide,
    } = usePoints();
    const {
      comments,
      currentComment,
      canEditComment,
      sendComment,
      getComments,
    } = useComments();
    const {
      isCurrentLoading,
      setCurrentUserEmpty,
      setCurrentUser,
      saveCurrentUser,
      currentUser,
    } = useUsers();
    let modal = ref(false);
    const add = () => {
      setCurrentUserEmpty();
      modal.value = true;
    };
    const edit = (user) => {
      setCurrentUser(user);
      modal.value = true;
    };
    let zoom = ref(13);
    let coords = [56.1168, 47.2628];
    let currentGeo = [];
    (() => {
      navigator.geolocation.getCurrentPosition((_) => {
        if (_.coords) {
          console.log(_);
          currentGeo = [_.coords.latitude, _.coords.longitude];
        }
      });
    })();
    const computedIconUrl = (type) => {
      if (type) {
        return computed(() => {
          const asn = types.value.find((x) => x.value == type);
          if (asn) {
            return asn.url;
          } else {
            return "";
          }
        }).value;
      } else {
        return "";
      }
    };
    const map = ref(null);
    const onMapReady = () => {
      console.log("MAPA", map.value);
    };
    const setView = (newCoords) => {
      coords = newCoords;
    };
    let newPoint = ref({
      coordinates: [56.136834, 47.254986],
      text: "new",
    });
    let iconWidth = ref(45);
    let iconHeight = ref(90);
    const addMarker = (event) => {
      if (
        Object.prototype.hasOwnProperty.call(event, "latlng") &&
        canEdit.value
      ) {
        try {
          newPoint.value.coordinates = [event.latlng?.lat, event.latlng?.lng];
          setMarker(newPoint.value);
          getAddress(
            newPoint.value.coordinates[0],
            newPoint.value.coordinates[1]
          );
        } catch (error) {}
      }
    };
    const log = (event) => {
      try {
        newPoint.value.coordinates[0] = event.target.getLatLng().lat;
        newPoint.value.coordinates[1] = event.target.getLatLng().lng;
        setMarker(newPoint.value);
        getAddress(
          newPoint.value.coordinates[0],
          newPoint.value.coordinates[1]
        );
      } catch (err) {}
    };
    getPoints();
    const savePoint = () => {
      addNewPoint(newPoint.value);
      setEdit(false);
    };
    return {
      coords,
      setView,
      isLoggedIn,
      logout,
      hasPermisson,
      zoom,
      points,
      setMarker,
      marker,
      newPoint,
      canEdit,
      setEdit,
      iconWidth,
      iconHeight,
      addMarker,
      savePoint,
      log,
      currentComment,
      getComments,
      computedIconUrl,
      types,
      setSide,
      currentGeo,
      map,
      onMapReady,
      selectLocale,
      computedLocale,
      modal,
      add,
      edit,
      isCurrentLoading,
      currentUser,
      saveCurrentUser,
      setCurrentUserEmpty,
    };
  },
});
</script>
