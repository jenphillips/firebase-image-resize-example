export const pluralize = (word, quantity) => {
  return (quantity === 1 ? word : `${word}s`)
}
