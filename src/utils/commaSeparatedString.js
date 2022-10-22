export default function commaSeparatedString (arr, useOxfordComma) {
  const listStart = arr.slice(0, -1).join(', ')
  const listEnd = arr.slice(-1)
  const conjunction = arr.length <= 1
    ? ''
    : useOxfordComma && arr.length > 2
      ? ', & '
      : ' & '

  return [listStart, listEnd].join(conjunction)
}
