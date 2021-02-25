//iso kodu formatlı halde gösterir
export const formatDate = (d) =>
`${d.substring(8, 10)}.${d.substring(5, 7)}.${d.substring(
  0,
  4
)} ${d.substring(11, 13)}:${d.substring(14, 16)}`;