import { clamp } from "lodash";
import colorSpace from "color-space";
import colorStringify from "color-stringify";

export default class Color {
  constructor({ h, c, l }) {
    this.h = h;
    this.c = c;
    this.l = l;
  }

  clone() {
    return new this.constructor({ h: this.h, c: this.c, l: this.l });
  }

  lighten(percentage) {
    const color = this.clone();
    color.l = clamp(color.l * (1 + percentage), 0, 100);
    return color;
  }

  toHex() {
    console.log("color", this);
    const unclampedRgb = colorSpace.lchuv.rgb([this.l, this.c, this.h]);
    console.debug("unclampedRgb", unclampedRgb);
    const clampedRgb = unclampedRgb.map((v) => clamp(Math.round(v), 0, 255));
    console.debug("clampedRgb", clampedRgb);
    return colorStringify(clampedRgb, "hex");
  }
}
