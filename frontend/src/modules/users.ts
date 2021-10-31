import { reactive, toRefs } from 'vue'
import { api } from 'boot/axios'
import { AxiosError } from 'axios'
import { Notify } from 'quasar'

interface User {
    _id?: string,
    fullName: string,
    email: string,
    password?: string,
}

interface UserState {
    isLoading: boolean;
    isCurrentLoading: boolean;
    users?: User[];
    currentUser?: User;
}

const state = reactive<UserState>({
    isLoading: false,
    isCurrentLoading: false,
    users: undefined,
    currentUser: undefined,
})

export const useUsers = () => {
    const getUsers = (): void => {
        state.isLoading = true;
        api.get<Array<User>>('/user')
            .then((data) => {
                state.users = data.data
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                state.isLoading = false;
            })
    }

    const setCurrentUser = (user: User): void => {
        state.isCurrentLoading = true;
        api.get(`/user/${user._id || ''}`)
            .then((data) => {
                state.currentUser = data.data as User
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                state.isCurrentLoading = false;
            })
    }

    const setCurrentUserEmpty = (): void => {
        state.currentUser = {
            fullName: '',
            email: '',
            password: '',
        }
    }

    const saveCurrentUser = (): void => {
        if (!state.currentUser?._id) {
            state.isLoading = true;
            api.post('/user', state.currentUser)
                .then(() => {
                    getUsers();
                })
                .catch((error: AxiosError) => {
                    Notify.create({
                        type: 'negative',
                        message: `${error?.message || 'Неожиданная ошибка'}`,
                        position: 'bottom-right'
                    })
                    console.log(error)
                })
                .finally(() => {
                    state.isLoading = false;
                })
        } else {
            state.isLoading = true;
            api.post(`/user/${state.currentUser._id}`, state.currentUser)
                .then(() => {
                    getUsers();
                })
                .catch((error: AxiosError) => {
                    Notify.create({
                        type: 'negative',
                        message: `${error.message || 'Неожиданная ошибка'}`,
                        position: 'bottom-right'
                    })
                    console.log(error)
                })
                .finally(() => {
                    state.isLoading = false;
                })
        }
    }

    return {
        getUsers,
        setCurrentUser,
        setCurrentUserEmpty,
        saveCurrentUser,
        ...toRefs(state),
    }
}
