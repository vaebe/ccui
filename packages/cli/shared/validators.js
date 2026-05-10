// inquirer 验证器工厂：value 不能为空。
export const notEmpty = (label) => (value) => {
  if (typeof value === 'string' && value.trim() === '') return `${label}是必填项！`
  if (Array.isArray(value) && value.length === 0) return `${label}必须包含至少一项`
  return true
}
