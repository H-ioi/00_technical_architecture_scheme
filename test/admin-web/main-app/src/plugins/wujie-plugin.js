import { bus } from 'wujie'

export const createSharedDepsPlugin = () => {
  return {
    jsBeforeLoaders: [
      {
        callback: (childWindow) => {
          childWindow.__SHARED_DEPS_FROM_MAIN = childWindow.parent?.__SHARED_DEPS

          childWindow.$shared = {
            getLib: (name) => childWindow.__SHARED_DEPS_FROM_MAIN?.libs?.[name],
            getComponent: (name) => childWindow.__SHARED_DEPS_FROM_MAIN?.components?.[name],
            callMain: (method, ...args) => {
              return bus.$emit('call-main', { method, args })
            }
          }
        }
      }
    ]
  }
}
