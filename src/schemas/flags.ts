import {boolean, object, string} from 'yup'

export const flagSchema = object({
  name: string(),
  active: boolean(),
})
export const newFlagSchema = object({
  name: string()
    .required('A new flag requires a name'),
  active: boolean()
    .required(
      'A new flag needs an active state. It can be either true or false.',
    ),
})
