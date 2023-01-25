<template>
  <span>
    <span v-if="fileValidation.mimeGroup === 'image'">
      <i class="famfm-picture"></i>
      <span v-if="imageOptions">
        <span v-if="imageOptions.allowSvg !== true">
          <i class="famfm-right-open"></i>
          <span class="through">svg</span>
        </span>
        <span v-if="imageOptions.ratio">
          <i class="famfm-right-open"></i>
          <i class="famfm-ratio"></i>
          {{ Math.round(1000 * imageOptions.ratio) / 1000 }}
        </span>
        <span v-if="imageOptions.width || imageOptions.maxWidth || imageOptions.minWidth">
          <i class="famfm-right-open"></i>
          <i class="famfm-resize-horizontal"></i>
          {{ imageOptions.width || imageOptions.maxWidth || imageOptions.minWidth }}px
          {{ imageOptions.maxWidth ? "max." : imageOptions.minWidth ? "min." : "" }}
        </span>
        <span
          v-if="imageOptions.height || imageOptions.maxHeight || imageOptions.minHeight"
        >
          <i class="famfm-right-open"></i>
          <i class="famfm-resize-vertical"></i>
          {{ imageOptions.height || imageOptions.maxHeight || imageOptions.minHeight }}px
          {{ imageOptions.maxHeight ? "max." : imageOptions.minHeight ? "min." : "" }}
        </span>
      </span>
    </span>
    <span v-else-if="fileValidation.mimeGroup === 'audio'">
      <i class="famfm-file-audio"></i> {{ ucfirst(fileValidation.mimeGroup) }}
    </span>
    <span v-else-if="fileValidation.mimeGroup === 'video'">
      <i class="famfm-file-video"></i> {{ ucfirst(fileValidation.mimeGroup) }}
    </span>
    <span v-else-if="fileValidation.mimeGroup">
      <i class="famfm-file-doc"></i> {{ ucfirst(fileValidation.mimeGroup) }}
    </span>
  </span>
</template>

<script>
import { mapState } from "vuex";
import { ucfirst } from "../utils/str";
export default {
  props: {
    isValid: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState(["fileValidation"]),
    imageOptions() {
      return this.fileValidation.imageOptions;
    },
  },
  methods: {
    ucfirst(str) {
      return ucfirst(str);
    },
  },
};
</script>

<style lang="scss" scoped>
i.famfm-right-open {
  color: var(--mfm-grey);
}
.through {
  text-decoration: line-through;
}
</style>
