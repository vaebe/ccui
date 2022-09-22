function nameFormatting(name: string) {
  // 以中文开头显示最后两个字符
  if (/^[\u4e00-\u9fa5]/.test(name)) {
    return name.substring(name.length - 2);
  }

  // 英文开头
  if (/^[A-Za-z]/.test(name)) {
    // 含有两个及以上，包含空格，下划线，中划线分隔符的英文名取前两个字母的首字母
    if (/[_ -]/.test(name)) {
      const str_before = name.split(/_|-|\s+/)[0];
      const str_after = name.split(/_|-|\s+/)[1];
      return (
        str_before.substring(0, 1).toUpperCase() +
        str_after.substring(0, 1).toUpperCase()
      );
    } else {
      // 一个英文名的情况显示前两个字母
      return name.substring(0, 2).toUpperCase();
    }
  }

  // 非中英文开头默认取前两个字符
  return name.substring(0, 2);
}

export default function useGetDisplayName(
  name: string,
  customText: string,
  width: number
): string {
  let nameDisplay = '';
  if (customText) {
    return customText.substring(0, 1);
  }
  // name 存在才执行逻辑
  if (name) {
    nameDisplay = name.length < 2 ? name : nameFormatting(name);
  }

  if (width < 30) {
    nameDisplay = name.substring(0, 1).toUpperCase();
  }
  return nameDisplay;
}
