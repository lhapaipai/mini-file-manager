<template>
  <span>
    <span v-if="fileValidation.mimeGroup === 'image'">
      <i class="fa-picture"></i>
      <span v-if="imageOptions">
        <span v-if="imageOptions.ratio">
          <i class="fa-right-open"></i>
          <i class="fa-ratio"></i>
          {{ Math.round(1000 * imageOptions.ratio) / 1000 }}
        </span>
        <span v-if="imageOptions.width || imageOptions.maxWidth || imageOptions.minWidth">
          <i class="fa-right-open"></i>
          <i class="fa-resize-horizontal"></i>
          {{ imageOptions.width || imageOptions.maxWidth || imageOptions.minWidth }}px
          {{ imageOptions.maxWidth ? "max." : imageOptions.minWidth ? "min." : "" }}
        </span>
        <span
          v-if="imageOptions.height || imageOptions.maxHeight || imageOptions.minHeight"
        >
          <i class="fa-right-open"></i>
          <i class="fa-resize-vertical"></i>
          {{ imageOptions.height || imageOptions.maxHeight || imageOptions.minHeight }}px
          {{ imageOptions.maxHeight ? "max." : imageOptions.minHeight ? "min." : "" }}
        </span>
      </span>
    </span>
  </span>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["fileValidation"]),
    imageOptions() {
      return this.fileValidation.imageOptions;
    },
  },
};
</script>

<style lang="postcss" scoped>
i.fa-right-open {
  color: var(--gray);
}
</style>
