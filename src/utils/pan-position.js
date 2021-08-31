export default (pans, pan) => {
  if (pan === 'page') {
    return {
      left: 0,
      // right: "70%"
      right: "80%"
    }
  }

  if (pan === 'tree') {
    return {
      left: "20%",
      right: "20%",
    }
  }

  if (pan === 'view') {
    return {
      left: "80%",
      right: 0,
    }
  }
}