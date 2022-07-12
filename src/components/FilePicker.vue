<template>
  <div>
    <Teleport to="body">
      <FileManagerModal
        v-if="showModal"
        class="file-manager-modal"
        @abort-select="showModal = false"
        @select-files="handleNewSelection"
      ></FileManagerModal>
    </Teleport>
    <div>
      <div v-if="selection.length > 0" class="files">
        <div
          v-for="(file, key) in selection"
          :key="key"
          class="preview"
          :class="{ image: file.thumbnails }"
        >
          <img :data-type="file.type" :src="$uploadSrc(file, filter)" />
          <div class="actions">
            <a href="#" class="remove" @click.prevent="handleRemove(key)"
              ><i class="famfm-trash"></i
            ></a>
            <a v-if="!multiple" href="#" class="browse" @click.prevent="handleBrowse"
              ><i class="famfm-folder"></i
            ></a>
          </div>
        </div>
      </div>
      <div v-if="selection.length === 0 || multiple" class="no-preview-area">
        <i class="famfm-pictures no-image"></i>
        <button :class="`${themePrefix}-button outlined`" @click.prevent="handleBrowse">
          {{ $t("filesManager") }}
        </button>
      </div>
    </div>

    <div>
      <div v-for="(file, key) in selection" :key="key">
        <input
          v-model="file.mimeType"
          type="hidden"
          :name="generateName('mimeType', key)"
          maxlength="64"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.filename"
          type="hidden"
          :name="generateName('filename', key)"
          maxlength="255"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.directory"
          type="hidden"
          :name="generateName('directory', key)"
          maxlength="255"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.origin"
          type="hidden"
          :name="generateName('origin', key)"
          maxlength="64"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.width"
          type="hidden"
          :name="generateName('width', key)"
          maxlength="64"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.height"
          type="hidden"
          :name="generateName('height', key)"
          maxlength="64"
          class="ogoxe-input-text"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FileManagerModal from "./FileManagerModal.vue";

export default {
  components: {
    FileManagerModal,
  },
  props: {
    multiple: Boolean,
    name: String,
    files: {
      type: Array,
      default: () => [],
    },
    filter: {
      type: String,
      default: "small",
    },
    type: {
      type: String,
      default: "image",
    },
    themePrefix: String,
  },
  data() {
    return {
      selection: [],
      showModal: false,
    };
  },
  mounted() {
    console.log("selection", this.selection);
    this.selection = this.files.slice();
  },
  methods: {
    generateName(suffix, key) {
      if (this.multiple) {
        return `${this.name}[${key}][${suffix}]`;
      }
      return `${this.name}[${suffix}]`;
    },
    handleRemove(key) {
      console.log("remove", key, this.selection);
      this.selection.splice(key, 1);
    },
    handleBrowse() {
      this.showModal = true;
    },
    handleNewSelection(selectedFiles) {
      this.showModal = false;
      // console.log("selectedFiles", selectedFiles);
      if (this.multiple) {
        this.selection = selectedFiles.map(this.parseUploadedFile);
      } else {
        this.selection = [this.parseUploadedFile(selectedFiles[0])];
      }
      console.log(this.selection);
    },
    parseUploadedFile({ mimeType, details, filename, directory, origin }) {
      return {
        mimeType,
        width: details ? details.width : null,
        height: details ? details.height : null,
        filename,
        directory,
        origin,
      };
    },
  },
};
</script>

<style lang="postcss" scoped>
.file-manager-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

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
