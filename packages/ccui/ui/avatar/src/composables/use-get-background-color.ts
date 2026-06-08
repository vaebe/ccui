export default function useGetBackgroundColor(gender: string, char: string): number {
  let code = 1
  // 性别存在  直接使用性别
  if (gender) {
    if (gender.toLowerCase() === 'male') {
      code = 1
    } else if (gender.toLowerCase() === 'female') {
      code = 0
    } else {
      throw new Error('gender must be "Male" or "Female"')
    }
  } else {
    const unicode = char.charCodeAt(0)
    code = unicode % 2
  }
  return code
}
