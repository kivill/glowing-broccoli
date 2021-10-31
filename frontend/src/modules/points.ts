import { reactive, toRefs, } from 'vue'
import { api, apier } from 'boot/axios'
import { Notify } from 'quasar'
interface OpenStreetServerAns {
    address: {
        road: string;
        house_number: string;
    }
}

interface Point {
    address: string;
    status?: string;
    name?: string;
    nameEn?: string;
    coordinates?: number[];
    type?: string;
    subType?: string[];
    vid?: string;
    phone?: string;
    stat?: string;
    link?: string;
    workHours?: string;
    comment?: string;
    commentEn?: string;
    urlImg?: string;
    urlAudio?: string;
    urlAudioEn?: string;
}

interface PointType {
    label: string;
    value: string;
    url: string;
}


interface PointsState {
    isLoading: boolean;
    isCurrentLoading: boolean;
    points: Point[],
    marker: Point;
    canEdit: boolean;
    sideOpen: boolean;
    types: PointType[];
    subTypes: string[];
}

const state = reactive<PointsState>({
    isLoading: true,
    isCurrentLoading: false,
    points: [],
    marker: {
        address: '',
    },
    canEdit: false,
    sideOpen: true,
    types: [
        {
            label: 'спортивная площадка',
            value: 'sport square',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'игровая площадка', value: 'playground',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'лавочка', value: 'bench',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'освещение', value: 'lights',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'детский городок', value: 'children playground',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'парк', value: 'park',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'сквер', value: 'square',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'место тихого отдыха', value: 'resting place',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'аллея', value: 'alley',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'беседка', value: 'gazebo',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'велосипедная дорожка/велодорожка', value: 'bike path',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'беговая дорожка', value: 'treadmill',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'зелёные насаждения', value: 'green spaces',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'асфальтовая дорожка', value: 'asphalt path',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'плитка', value: 'tile',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'брусчатка', value: 'paving stone',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'архитектурная подсветка', value: 'architectural lighting',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'навигация', value: 'navigation',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'общественный туалет', value: 'public toilet',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'пандус', value: 'ramp',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'танцплощадка', value: 'dance floor',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'летний открытый кинотеатр', value: 'summer outdoor cinema',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
        {
            label: 'Новый муниципальный объект',
            value: 'municipality',
            url: 'https://image.flaticon.com/icons/png/512/2555/2555572.png'
        },
    ],
    subTypes: [
        'кафе',
        'лавочки',
        'бесплатный WIFI',
        'спортивная площадка',
        'архитектурная подсветка',
        'беговая дорожка',
        'общественный туалет',
        'аттракционы',
        'фонтан',
    ]
});

export const usePoints = () => {
    const getPoints = (): void => {
        state.isLoading = true;
        api.get<Array<Point>>('/points')
            .then((data) => {
                state.points = data.data.filter(e => e.status == 'approved')
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                state.isLoading = false;
            })
    }
    // const getDirection = (lat: number, long: number): void => {
    //     let currentGeo = [1, 2];
    //     (() => {
    //         navigator.geolocation.getCurrentPosition((_) => {
    //             if (_.coords) {
    //                 console.log(_);
    //                 currentGeo = [_.coords.latitude, _.coords.longitude];
    //             }
    //         });
    //     })();
    //     window.open(`https://www.google.com/maps/dir/${currentGeo[0]},${currentGeo[1]}/${lat},${long}`, '_blank');
    // }
    const getAllPoints = (): void => {
        api.get<Array<Point>>('/points')
            .then((data) => {
                state.points = data.data.filter(e => e.status == 'created')
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                state.isLoading = false;
            })
    }
    const getAllMunicipalityPoints = (): void => {
        api.get<Array<Point>>('/points')
            .then((data) => {
                state.points = data.data.filter(e => e.type == 'municipality')
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                state.isLoading = false;
            })
    }
    const updateStatus = (id: string, status: string, text: string): void => {
        void api.put(`/points/${id}`, { status }).then(_ => {
            if (_.status == 201) {
                getAllPoints();
                Notify.create({
                    type: status == 'declined' ? 'negative' : 'positive',
                    message: 'Метка ' + text + (status == 'declined' ? ' отклонена' : 'одобрена'),
                    position: 'bottom-right'
                })
            }
        })
    }
    const deletePoint = (id: string): void => {
        void api.delete(`/points/${id}`).then(_ => {
            if (_.status == 201) {
                Notify.create({
                    type: 'positive',
                    message: 'Метка удалена',
                    position: 'bottom-right',
                })
                location.reload();
            }
        })
    }
    const setMarker = (payload: Point) => {
        state.marker = payload;
    }
    const addNewPoint = (payload: never) => {
        void api.post('/points', payload)
            .then(_ => {
                if (_.status == 201)
                    Notify.create({
                        type: status == 'declined' ? 'negative' : 'positive',
                        message: 'Метка добавлена на карту! Ожидайте модерации',
                        position: 'bottom-right'
                    })
                else
                    throw ''
            })
            .catch(() => {
                Notify.create({
                    type: 'negative',
                    message: 'Проверьте введенные данные!',
                    position: 'bottom-right'
                })
            })
    }
    const setEdit = (payload: boolean) => {
        state.canEdit = payload
    }
    const setSide = () => {
        state.sideOpen = !state.sideOpen
    }
    const getAddress = (lat: number, lng: number) => {
        void apier.get<OpenStreetServerAns>(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
            .then(({ data }) => {
                state.marker.address = data.address.road + ', ' + data.address.house_number;
            })
    }

    return {
        getPoints,
        getAllPoints,
        setMarker,
        addNewPoint,
        setEdit,
        getAllMunicipalityPoints,
        // getDirection,
        setSide,
        getAddress,
        updateStatus,
        deletePoint,
        ...toRefs(state)
    }
};


