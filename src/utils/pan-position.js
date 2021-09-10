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
      right: "25%",
    }
  }

  if (pan === 'view') {
    return {
      left: "75%",
      right: 0,
    }
  }
}