import { ChangeEvent, Dispatch, SetStateAction } from "react"

export default class FormHandler {
  public static updateForm<T>(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    key: string,
    form: T,
    setForm: Dispatch<SetStateAction<T>>
  ) {
    setForm({ ...form, [key]: e.target.value })
  }

  public static updateFormCheckbox<T>(
    e: ChangeEvent<HTMLInputElement>,
    key: string,
    form: T,
    setForm: Dispatch<SetStateAction<T>>
  ) {
    setForm({ ...form, [key]: e.target.checked })
  }

  public static updateFormArray<T>(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: string,
    form: T,
    setForm: Dispatch<SetStateAction<T>>
  ) {
    setForm({ ...form, [key]: e.target.value.split(",") })
  }

  public static updateFormPrice<T>(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: string,
    form: T,
    setForm: Dispatch<SetStateAction<T>>
  ) {
    const { value } = e.target
    if (value.includes(".") && value.indexOf(".") !== value.lastIndexOf(".")) {
      return
    }
    if (/^\d*(?:\.\d?\d?)?$/.test(value)) {
      this.updateForm(e, key, form, setForm)
    }
  }

  public static updateFormOnlyNumbers<T>(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: string,
    form: T,
    setForm: Dispatch<SetStateAction<T>>
  ) {
    const { value } = e.target
    if (/^\d*$/.test(value)) {
      this.updateForm(e, key, form, setForm)
    }
  }

  public static updateFormNoSpaces<T>(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: string,
    form: T,
    setForm: Dispatch<SetStateAction<T>>
  ) {
    const { value } = e.target
    if (value.includes(" ")) return
    this.updateForm(e, key, form, setForm)
  }

  public static updateFormExpirationDate<T>(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: string,
    form: T,
    setForm: Dispatch<SetStateAction<T>>
  ) {
    const { value } = e.target
    switch (value.length) {
      case 0:
        break
      case 1:
        if (/[^0-1]/.test(value[0])) return
        break
      case 2:
        if (
          (!value[0].startsWith("0") || /[^1-9]/.test(value[1])) &&
          (!value.startsWith("1") || /[^0-2]/.test(value[1]))
        ) {
          return
        }
        break
      case 3:
        if (value[2] !== "/") return
        break
      case 4:
        if (/\D/.test(value[3])) return
        break
      case 5:
        if (/\D/.test(value[4])) return
        break
      case 6:
        if (/\D/.test(value[5])) return
        break
      case 7:
        if (/\D/.test(value[6])) return
        break
      default:
        return
    }

    this.updateForm(e, key, form, setForm)
  }
}
