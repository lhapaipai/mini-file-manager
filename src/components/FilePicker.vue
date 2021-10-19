<template>
  <div>
    <div v-if="selection.length > 0" class="files">
      <div
        v-for="(file, id) in selection"
        :key="id"
        class="preview"
        :class="{ image: file.thumbnails }"
      >
        <img :data-type="file.type" :src="fileImg(file)" />
        <div class="actions">
          <a href="#" class="remove" @click.prevent="handleRemove(file)"
            ><i class="fa-trash"></i
          ></a>
          <a
            v-if="!formFilePickerOptions.multiple"
            href="#"
            class="browse"
            @click.prevent="handleBrowse"
            ><i class="fa-folder"></i
          ></a>
        </div>
      </div>
    </div>
    <div
      v-if="selection.length === 0 || formFilePickerOptions.multiple"
      class="general-actions"
    >
      <button class="penta-button outlined" @click.prevent="handleBrowse">
        <span class="fa-doc-add"></span>
      </button>
    </div>
  </div>
</template>

<script>
import { openFileManager } from "../main";

export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    fileManagerOptions: Object,
    formFilePickerOptions: {
      type: Object,
      default: () => ({
        multiple: false,
      }),
    },
    originalSelection: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selection: [],
    };
  },
  watch: {
    selection() {
      let event = new CustomEvent("updateSelection", {
        detail: this.selection,
      });
      this.$el.dispatchEvent(event);
    },
  },
  mounted() {
    this.selection = [...this.originalSelection];
  },
  methods: {
    fileImg(file) {
      if (file.thumbnails) {
        if (this.formFilePickerOptions.previewType === "image") {
          return file.thumbnails[this.formFilePickerOptions.previewFilter];
        } else {
          return file.icon;
        }
      } else {
        return file.icon;
      }
    },
    handleRemove(file) {
      this.selection = this.selection.filter((f) => f.id !== file.id);
    },
    handleBrowse() {
      let multiSelection = this.formFilePickerOptions.multiple;
      openFileManager(
        {
          ...this.fileManagerOptions,
          originalSelection: multiSelection ? [] : this.selection.map((elt) => elt.id),
          multiSelection,
        },
        this.onSelected,
      );
    },
    onSelected(files) {
      let uniqueFiles = files.filter((f) => !this.selection.find((sf) => sf.id === f.id));
      this.selection = [...this.selection, ...uniqueFiles];
    },
  },
};
</script>

<style lang="postcss" scoped>
.files {
  display: flex;
}
.preview {
  position: relative;
  align-self: flex-start;
  min-width: 100px;
  margin-right: 1rem;
  &:last-child {
    margin-right: 0;
  }
  img {
    vertical-align: middle;
    display: inline-block;
  }
}
.rounded-corner {
  box-shadow: 0 0 1px #bbb;
}

.actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
  transition: var(--transition-color);
  a {
    transition: all 0.2s;
    color: var(--gray);
    font-size: 1.3rem;
    padding: 0.5rem;
    &:hover {
      color: white;
    }
  }
}

.general-actions {
  margin-top: 1rem;
}
</style>
