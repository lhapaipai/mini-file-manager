<template>
  <div
    :style="progressStyles"
    class="radial-progress"
    role="progressbar"
    aria-valuenow="25"
    aria-valuemin="0"
    aria-valuemax="100"
  ></div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    percentageValue() {
      return Math.round(this.value * 100).toString() + "%";
    },
    progressStyles() {
      return {
        "--progress": this.percentageValue,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.radial-progress {
  --hue: 220;
  --holesize: 50%;
  --track-bg: rgba(255, 255, 255, 0.5);

  block-size: 100%;
  inline-size: 100%;
  min-inline-size: 5px;
  min-block-size: 5px;
  display: grid;
  place-items: center;
  position: relative;
  font-weight: 700;
  font-size: max(10vmin, 1.4rem);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 50%;
    z-index: -1;
    background: conic-gradient(
      var(--primary-color),
      var(--primary-color) var(--progress, 0%),
      var(--track-bg) var(--progress, 0%) 100%
    );

    mask-image: radial-gradient(
      transparent var(--holesize),
      black calc(var(--holesize) + 0.5px)
    );
  }
}
</style>
