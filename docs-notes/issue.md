# bug - 下边的问题都是从 文档中看出来的你需要仔细分析,真正的问题是什么然后解决

- tag 标签, 多彩标签示例,标签与标签之间没有间距
- Space 间距,基本使用 tag 标签的高度被撑高了 比 button 还要高
- Affix 固钉,基本使用 相对窗口顶部 0px 固定,无效果
- Anchor 锚点,基本使用 滚动到第三节对应的是第二节高亮,第二节是第一节高亮, 没有正确对应
- Steps 步骤条, 两个步骤之间有一个线 这个线 只有左边有间距、右边没有,上下排列时 只有下边有 上边没有
- ColorPicker 颜色选择器, 基本用法, 组件和文字没有上下对齐
- 组件文档 基本使用、基本用法 统一为 基本使用
- InputSearch 搜索框,带搜索按钮,第一个组件示例的图标颜色是黑色应该是白色, icon 偏小
- Select 选择器, 展开面板的箭头、清除的 icon 应该使用 icon 组件的icon,现在很丑且不统一,其他组件如果有类似的问题一起修复
- TimePicker 时间选择框, 这个 time 的icon 显示在组件外边了,没有显示在边框里 ,icon 有点偏小
- TimeRangePicker 时间范围选择,基本用法 time icon 显示了3个, 自定义格式 显示 2个 加1个清除icon,禁用的样式也很奇怪
- Transfer 穿梭框, icon 使用 iocn 组件的提供的,要统一,不然显得很草台班子
- TreeSelect 树选择, 清除图标在圆形背景中没有居中,icon 使用 iocn 组件的提供的,现在好小
- Upload 上传,照片墙 listType="picture-card", 三个图片没有上下对齐 第一张图片靠上了一点
- UploadDragger 拖拽上传,这个组件移除,Upload 上传 已经有拖拽上传的能力了
- AvatarGroup 头像组, 移除这个组件
- Badge 徽标数, 没有显示在元素的右上角 而是有一些间距,层级也不正确,会被其他 元素压盖住徽标. 缎带（BadgeRibbon） 这个应该在对应的组件中展示,这里移除
- Carousel 走马灯,自动播放, 指示器的三个元素没有书上下对齐,第一个靠上一点
- ImagePreviewGroup 图片预览组, 组件名称改为 ImagePreview 图片预览
- Watermark 水印,取消设置 background-image 就可以隐藏这个逻辑不对,仔细思考下
- Popover 弹出框,popover 离触发的元素有点远 ,popover__arrow 有明显的边框
- Spin 加载中,延迟显示 两个button 没有上下对齐
- Tooltip 文字提示, 基本使用 tip 离触发元素有点远, arrow 设置的位置不正确下方没有空间了放到上方显示 arrow 也还在上方显示,这个时候应该切换到下方了

## 第二轮
- Watermark 水印,图片水印 把 蚂蚁的图片抄过来了,这不对