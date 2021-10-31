import { reactive, toRefs, computed } from 'vue'
import ru from '../locale/ru.json'
import en from '../locale/en.json'
interface LangState {
    selectLocale: string;
}

interface Lang {
    [index: string]: any
}

const locales: Lang = {
    'ru': ru,
    'en': en
}

const state = reactive<LangState>({
    selectLocale: 'ru'
})
const computedLocale = (key: string) => {
    return computed(() => locales[state.selectLocale][key]).value
}
export const useLang = () => {

    return {
        computedLocale,
        ...toRefs(state),
    }
}
