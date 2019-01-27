const orderByTime = (data) => {
  return data.sort(sortFunction)
}
const sortFunction = (a, b) => {
  return a.time < b.time
}
const toFix = (data)=>{
  data.map(item=>{
    item.duration =  (item.duration/1000).toFixed(1)
  })
  return data
}
module.exports = {
  orderByTime: orderByTime,
  toFix,
}