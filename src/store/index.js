import { createStore, createLogger } from 'vuex'
import wssdata from './modules/wssdata'

const debug = process.env.NODE_ENV !== 'production'

export const store =  createStore({
  modules: {
    wssdata
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})