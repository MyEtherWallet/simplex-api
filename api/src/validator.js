import Schema from 'validate'
export default (_schema) => {
  let validator = new Schema(_schema)
  return validator
}
