export const ADD_POST_STORAGE_KEY = '__ADD_POST__'
export const USER_TOKEN_KEY = '__USER_TOKEN_KEY__'

export function lStorageGetAndSet (key, value) {
  return value ? window.localStorage.setItem(key, value) : window.localStorage.getItem(key)
}

export function lStorageRemove (key) {
  window.localStorage.removeItem(key)
}
