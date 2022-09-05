<template>
  <div>
    <div
      v-if="uploadedFiles.length > 0"
      class="files preview-area"
      :class="{ multiple: multiple, single: !multiple }"
    >
      <div
        v-for="(file, key) in uploadedFiles"
        :key="file.directory + file.filename"
        class="preview"
      >
        <ImageItem
          :file="file"
          :filter="form.filter"
          @remove="$emit('remove', key)"
          @browse="$emit('browse', file)"
        />
      </div>
    </div>
    <div v-if="uploadedFiles.length === 0 || multiple" class="no-preview-area">
      <i class="famfm-pictures no-image"></i>
      <button
        :class="`${themePrefix}-button outlined`"
        @click.prevent="$emit('browse', null)"
      >
        {{ $t("filesManager") }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ImageItem from "./items/ImageItem.vue";

export default {
  components: {
    ImageItem,
  },
  props: {
    uploadedFiles: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["remove", "browse"],
  computed: {
    ...mapState(["themePrefix", "form", "multiple"]),
  },
  methods: {
    ...mapActions(["setSelectionPaths"]),
  },
};
</script>

<style lang="scss" scoped>
.files {
  &.multiple {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 15px;
  }
  &.single {
    display: block;
    align-items: center;
    justify-content: center;
  }
  .preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

.no-preview-area {
  margin-top: 1rem;
  min-height: 14rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .no-image {
    color: var(--primary-color100);
    font-size: 5rem;
  }
}
</style>
