import { reactive, toRefs, computed } from 'vue'
import { api } from 'boot/axios'
import { AxiosError } from 'axios'
import { Notify } from 'quasar'
interface User {
    id: string;
    email: string;
    accessToken: string;
    fullName: string;
    roles: string;
}

interface AuthState {
    isLoading: boolean;
    user?: User;
    canOpenSide: boolean;
}

interface LoginPayload {
    email: string;
    password: string;
}

const state = reactive<AuthState>({
    isLoading: false,
    user: undefined,
    canOpenSide: true,
})

const userInfo = computed<User | undefined>(() => state?.user)

const userRoles = computed<string | undefined>(() => state?.user?.roles)

const isLoggedIn = computed<boolean>(() => !!state?.user || !!localStorage.getItem('token'))

const token = localStorage.getItem('token')

if (token) {
    console.log('auth start')
    void api.get('/user/auth-by-token')
        .then((data) => {
            state.user = data.data as User;
        })
        .catch(() => {
            const { logout } = useAuth()
            void logout();
        })
        .finally(() => {
            console.log('auth stop')
        })
}
export const useAuth = () => {
    const auth = (payload: LoginPayload): Promise<User | PromiseRejectionEvent> => {
        return api.post('/user/login', payload)
            .then((data) => {
                const user = data.data as User;
                setUser(user)
                api.defaults.headers = {
                    common: {
                        Authorization: `Bearer ${user.accessToken}`
                    }
                }
                return Promise.resolve(user)
            })
            .catch((error: AxiosError) => {
                Notify.create({
                    type: 'negative',
                    message: `${error?.message || 'Неожиданная ошибка'}`,
                    position: 'bottom-right'
                })
                localStorage.removeItem('token')
                return Promise.reject()
            })
    }

    const setUser = (payload: User): void => {
        localStorage.setItem('token', payload.accessToken)
        state.user = payload
    }

    const logout = (): Promise<void> => {
        localStorage.removeItem('token')
        location.reload();
        return Promise.resolve(state.user = undefined)
    }

    const hasPermisson = (role: string[]): boolean => {
        if (state?.user?.roles) {
            return role.includes(state?.user?.roles)
        }
        return false
    }
    const typeAuth = [
        {
            label: 'Админ',
            value: 'admin',
        },
        {
            label: 'Пользователь',
            value: 'user',
        },
    ]

    return {
        setUser,
        logout,
        auth,
        userInfo,
        userRoles,
        hasPermisson,
        isLoggedIn,
        typeAuth,
        ...toRefs(state)
    }
}
