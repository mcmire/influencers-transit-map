import { clamp } from "lodash";
import colorSpace from "color-space";
import colorStringify from "color-stringify";

export default class Color {
  constructor({ l, c, h, a = 1 }) {
    this.l = l;
    this.c = c;
    this.h = h;
    this.a = a;
  }

  clone() {
    return new this.constructor({ l: this.l, c: this.c, h: this.h, a: this.a });
  }

  lighten(percentage) {
    const color = this.clone();
    color.l = clamp(color.l * (1 + percentage), 0, 100);
    return color;
  }

  toHex() {
    const unclampedRgb = colorSpace.lchuv.rgb([this.l, this.c, this.h]);
    const clampedRgb = unclampedRgb.map((v) => clamp(Math.round(v), 0, 255));
    return colorStringify(clampedRgb, "hex");
  }
}
