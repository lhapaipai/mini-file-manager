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
            ><i class="famfm-trash"></i
          ></a>
          <a
            v-if="!formPreviewOptions.multiple"
            href="#"
            class="browse"
            @click.prevent="handleBrowse"
            ><i class="famfm-folder"></i
          ></a>
        </div>
      </div>
    </div>
    <div
      v-if="selection.length === 0 || formPreviewOptions.multiple"
      class="general-actions"
    >
      <button :class="`${themePrefix}-button outlined`" @click.prevent="handleBrowse">
        <span class="famfm-doc-add"></span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import FileManagerModal from "../FileManagerModal";

export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    fileManagerOptions: Object,
    formPreviewOptions: {
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
  computed: {
    ...mapState(["themePrefix"]),
  },
  watch: {
    selection() {
      let event = new CustomEvent("selectionChange", {
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
        if (this.formPreviewOptions.type === "image") {
          return file.thumbnails[this.formPreviewOptions.filter];
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
      let multiple = this.formPreviewOptions.multiple;

      new FileManagerModal(
        {
          ...this.fileManagerOptions,
          originalSelection: multiple ? [] : this.selection.map((elt) => elt.id),
          multiple,
        },
        this.onSelected,
      );
    },
    onSelected(files) {
      console.log("onSelected", files);

      if (this.formPreviewOptions.multiple) {
        let uniqueFiles = files.filter(
          (f) => !this.selection.find((sf) => sf.id === f.id),
        );

        this.selection = [...this.selection, ...uniqueFiles];
      } else {
        this.selection = files;
      }
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
