import { ref } from 'vue';
export default function getBackgroundColor(
  gender: string,
  char: string
): number {
  const code = ref<number>(1);
  // 性别存在  直接使用性别
  if (gender) {
    if (gender.toLowerCase() === 'male') {
      code.value = 1;
    } else if (gender.toLowerCase() === 'female') {
      code.value = 0;
    } else {
      throw new Error('gender must be "Male" or "Female"');
    }
  } else {
    const unicode = char.charCodeAt(0);
    code.value = unicode % 2;
  }
  return code.value;
}
