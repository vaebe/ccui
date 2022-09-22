import { mount } from '@vue/test-utils';
import { Rate } from '../index';
import { ref, nextTick } from 'vue';

describe('rate test', () => {
  describe('rate basic', () => {
    const TestComponent = {
      components: {
        'k-rate': Rate
      },
      template: `
        <div>
        <k-rate v-model="value" />
        </div>
      `,
      setup() {
        const value = ref(0);

        return {
          value
        };
      }
    };
    const wrapper = mount(TestComponent);
    it('Rate demo has created successfully', async () => {
      expect(wrapper).toBeTruthy();
    });

    it('Rate should have content', () => {
      const container = wrapper.find('.okUi-rate');
      expect(container.exists()).toBeTruthy();
    });
  });

  describe('rate change', () => {
    it('Rate can be changed', async () => {
      const wrapper = mount({
        components: {
          'k-rate': Rate
        },
        template: `
          <div>
          <k-rate v-model="value" />
          <div class="count">当前有{{ value }}颗星</div>
          </div>
        `,
        setup() {
          const value = ref(0);

          return {
            value
          };
        }
      });
      await nextTick();

      // 创建了多少个元素
      const starIcon = wrapper.findAll('.okUi-rate-icon');
      expect(starIcon.length).toBe(5);

      const container = wrapper.find('.okUi-rate');
      const firstStarEle = starIcon[0];
      const thirdStarEle = starIcon[2];
      const fourthStarEle = starIcon[3];

      // 鼠标移入后 对应元素宽度是否改变
      await fourthStarEle.trigger('mousemove');
      expect(fourthStarEle.find('.okUi-rate-active').attributes('style')).toBe(
        'width: 100%;'
      );

      // 鼠标离开后 对应元素宽度是否改变为0
      await container.trigger('mouseleave');
      expect(fourthStarEle.find('.okUi-rate-active').attributes('style')).toBe(
        'width: 0px;'
      );
      // 判断绑定的 v-model 是否准确
      expect(wrapper.find('.count').html()).toContain('0');

      await firstStarEle.trigger('click');

      expect(wrapper.find('.count').html()).toContain('1');

      await thirdStarEle.trigger('click');
      expect(wrapper.find('.count').html()).toContain('3');

      await container.trigger('mouseleave');
      expect(fourthStarEle.find('.okUi-rate-active').attributes('style')).toBe(
        'width: 0px;'
      );
      expect(wrapper.find('.count').html()).toContain('3');
    });
  });

  describe('read only', () => {
    const TestComponent = {
      components: {
        'k-rate': Rate
      },
      template: `
        <div>
        <k-rate v-model="value" :read-only="true" />
        <div class="count">当前有{{ value }}颗星</div>
        </div>
      `,
      setup() {
        const value = ref(3);

        return {
          value
        };
      }
    };
    const wrapper = mount(TestComponent);

    it('Rate should have content', async () => {
      expect(wrapper.find('.okUi-rate').exists()).toBeTruthy();
    });

    it('Rate should not be changed', async () => {
      const starEles = wrapper.findAll('.okUi-rate-icon');

      const firstStarEle = starEles[0];
      const thirdStarEle = starEles[2];
      const fourthStarEle = starEles[3];

      await firstStarEle.trigger('click');
      expect(wrapper.find('.count').html()).toContain('3');

      await thirdStarEle.trigger('click');
      expect(wrapper.find('.count').html()).toContain('3');

      await fourthStarEle.trigger('click');
      expect(wrapper.find('.count').html()).toContain('3');
    });
  });
});
