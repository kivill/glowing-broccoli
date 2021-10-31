import { boot } from 'quasar/wrappers'

import { Notify } from 'quasar'
Notify.setDefaults({
  type: 'positive',
  position: 'top-right',
  timeout: 2500,
  textColor: 'white',
  actions: [{ icon: 'close', color: 'white' }]
})

export default boot(async (/* { app, router, ... } */) => {
  // something to do
})
