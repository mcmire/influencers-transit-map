const BASE_FONT_SIZE = 16;

export default function emsToPixels(ems, { relativeTo = BASE_FONT_SIZE } = {}) {
  return relativeTo * ems;
}
