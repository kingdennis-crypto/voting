type Props = {
  label: string
  description: string
  children: React.ReactNode
}

export default function AdminSection({ label, description, children }: Props) {
  return (
    <div className="flex flex-row items-center">
      <div className="w-1/3 inline-flex flex-col">
        <p className="text-lg font-semibold">{label}</p>
        <p className="text-sm">{description}</p>
      </div>
      <div className="w-2/3">{children}</div>
    </div>
  )
}
