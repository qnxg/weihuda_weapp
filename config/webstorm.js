import { resolve as _resolve } from 'path'

export const resolve = {
  alias: {
    '@': _resolve(__dirname, '..', 'src'),
  },
}
