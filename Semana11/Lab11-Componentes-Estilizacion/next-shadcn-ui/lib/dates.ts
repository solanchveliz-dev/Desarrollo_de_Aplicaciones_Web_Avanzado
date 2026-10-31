export function dateFromOffset(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return toDateValue(date)
}

export function toDateValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function fromDateValue(value: string): Date | undefined {
  if (!value) return undefined
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

export function formatDate(value: string): string {
  const date = fromDateValue(value)
  return date
    ? new Intl.DateTimeFormat("es-PE", { day: "2-digit", month: "short", year: "numeric" }).format(date)
    : "Sin fecha"
}
