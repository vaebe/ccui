import { VNode } from 'vue';
import { Button3d } from './ui/button-3d';

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass {
      $props: any;
    }
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
}

export const CCButton3d: typeof Button3d;
