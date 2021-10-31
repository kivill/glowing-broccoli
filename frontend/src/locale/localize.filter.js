import ru from '../locale/ru.json'
import en from '../locale/en.json'
const locales = {
    'ru': ru,
    'en': en
}

export default function localizeFilter(key) {
    const locale = 'ru'
    return locales[locale][key] || `[Localize error]: key ${key} not found`
}