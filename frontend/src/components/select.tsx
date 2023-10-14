type SelectObj<T> = {
  label: string
  options: {
    label: string
    value: T
  }[]
}

export default function SelectComponent<T extends string | Array<T>>({
  label,
  options,
}: SelectObj<T>) {
  const id = `select-${label.toLowerCase().replaceAll(' ', '')}`

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select id={id}>
        {options.map((item, index: number) => (
          <option key={index} value={JSON.stringify(item)}>
            {item.label}
          </option>
        ))}
        {/* {options.map((item, index: number) => (
          <option key={index} value={JSON.stringify(item)}>
            {item.label}
          </option>
        ))} */}
      </select>
    </div>
  )
}
