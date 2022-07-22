const isJson = jsonString => {
  try {
    JSON.parse(jsonString)
  } catch (e) {
    return false
  }
  return true
}

export default isJson
