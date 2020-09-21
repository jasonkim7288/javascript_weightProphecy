export function convertDateToString(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export function getEightyDate(date, age) {
  return new Date((date.getFullYear() + 80 - age).toString())
}

export function getScaledValue(min, max, input) {
  return (input - min) * 2 / (max - min) - 1;
}

export function getActualWeight(min, max, input) {
  return (input + 1) * (max - min) / 2 + min;
}