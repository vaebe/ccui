import { defineComponent, ref, computed, watch, Ref } from 'vue';
import { calendarProps, CalendarProps, dateItem } from './calendar-types';
import './calendar.scss';
import { useNamespace } from '../../shared/hooks/use-namespace';
import moment from 'moment';

export default defineComponent({
  name: 'CCalendar',
  props: calendarProps,
  emits: ['change', 'update:modelValue'],
  setup(props: CalendarProps, { emit, slots }) {
    const ns = useNamespace('calendar');

    // 当前天 选中天
    const currentDate = ref(
      props.modelValue
        ? moment(props.modelValue).format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD')
    );

    // 当前月
    const currentMonth = ref(moment().format('YYYY-MM'));

    // 当前展示的日期列表
    const curDateList: Ref<dateItem[]> = ref([]);
    const weekList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    // 根据月份计算当前展示日期的数组
    const generatedDate = (month?: string) => {
      // 获取当月第一天是周几
      const whichDay = moment(month).startOf('month').weekday();
      // 计算开始开始日期 7 减去当月第一天是周几（获取到的周几是 0123456， 其中0代表周日）
      const startDate = moment(
        moment(month).subtract(7 - whichDay, 'days')
      ).format('YYYY-MM-DD');

      // 整理数据
      // 生成长度42的数组，为什么是42呢？ 因为有的月份是28 或者30 31， 35 会导致某些月份展示不全。
      curDateList.value = [...Array(42)]
        .map((item, index) => index)
        .reduce((acc: Array<dateItem>, index: number) => {
          // 获取展示的日期
          const date = moment(startDate)
            .add(index + 1, 'days')
            .format('YYYY-MM-DD');
          // 分割日期 用于获取是 几号 如 123456
          const dateList = date.split('-');
          // 获取周几
          const week = moment(date).weekday();

          // 将需要的数据 放进数组
          acc.push({
            index: index + 1,
            date: date,
            day: dateList[dateList.length - 1],
            week: weekList[week]
          });
          // 返回数组
          return acc;
        }, []);
    };

    // 初始化
    generatedDate(currentMonth.value);

    // 设置当前天、选中天， 生成对应月份
    const setCurrentDate = (date: string) => {
      currentDate.value = moment(date).format('YYYY-MM-DD');
      // 月份不同 重新生成日历
      if (date.indexOf(currentMonth.value) === -1) {
        currentMonth.value = moment(date).format('YYYY-MM');
        generatedDate(currentMonth.value);
      }

      emit('update:modelValue', new Date(currentDate.value));
      emit('change', currentDate.value);
    };

    // 上一月 下一月 当前月
    const changeMonth = (type: string) => {
      let month = '';
      // 下个月
      if (type === 'nextMonth') {
        month = moment(currentMonth.value).add(1, 'month').format('YYYY-MM');
      }

      // 上个月
      if (type === 'lastMonth') {
        month = moment(currentMonth.value)
          .subtract(1, 'month')
          .format('YYYY-MM');
      }

      // 传入YYYY-MM 格式的月份 格式化后会获取到当月的第一天
      setCurrentDate(month);
    };

    // props.modelValue 改变刷新数据
    watch(
      () => props.modelValue,
      () => {
        currentDate.value = moment(props.modelValue).format('YYYY-MM-DD');
        // 月份不同 重新生成日历
        if (currentDate.value.indexOf(currentMonth.value) === -1) {
          currentMonth.value = moment(props.modelValue).format('YYYY-MM');
          generatedDate(currentMonth.value);
        }
      }
    );

    // 获取每天 设置样式及操作
    const dateItemList = computed(() => {
      return curDateList.value.map((item) => {
        // item.date 的类型可以是字符串或数组 详见obj的定义
        const isCurrentMonth = item.date.includes(currentMonth.value);

        const isSelected = currentDate.value === item.date;
        // 计算 绑定的class
        const className = {
          'current-month': isCurrentMonth,
          'current-date': isSelected,
          [ns.em('day-box', 'day')]: true
        };

        const dateCellOpts = {
          isSelected: isSelected,
          date: item.date,
          day: parseInt(item.day)
        };

        return (
          <div
            onClick={() => {
              setCurrentDate(dateCellOpts.date);
            }}
            class={className}
          >
            {slots.dateCell ? slots.dateCell(dateCellOpts) : dateCellOpts.day}
          </div>
        );
      });
    });

    // header 周 列表
    const weekItemList = weekList.map((item) => {
      return <div class={ns.em('week', 'item')}>{item}</div>;
    });

    const defaultHeader = () => {
      return (
        <div class={ns.e('header')}>
          <div>{currentMonth.value}</div>
          <div>
            <c-button
              type='primary'
              plain={true}
              onClick={() => {
                changeMonth('lastMonth');
              }}
            >
              上个月
            </c-button>
            <c-button
              type='primary'
              plain={true}
              onClick={() => {
                setCurrentDate(moment().format('YYYY-MM-DD'));
              }}
            >
              今天
            </c-button>
            <c-button
              type='primary'
              plain={true}
              onClick={() => {
                changeMonth('nextMonth');
              }}
            >
              下个月
            </c-button>
          </div>
        </div>
      );
    };

    return () => (
      <div class={ns.b()}>
        {slots.header ? slots.header(currentDate.value) : defaultHeader()}
        <div class={ns.e('week')}>{weekItemList}</div>
        <div class={ns.e('day-box')}>{dateItemList.value}</div>
      </div>
    );
  }
});
