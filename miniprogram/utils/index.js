const orderByTime = (data) => {
  return data.sort(sortFunction)
}
const sortFunction = (a, b) => {
  return a.time < b.time
}
module.exports = {
  orderByTime: orderByTime
}