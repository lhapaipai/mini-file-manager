<template>
  <div class="mini-file-manager-form" :class="{ 'with-css-vars': injectCssVars }">
    <Teleport to="body">
      <FileManagerModal
        v-if="showModal"
        class="file-manager-modal"
        @abort-select="showModal = false"
        @select-files="handleNewSelection"
      ></FileManagerModal>
    </Teleport>
    <div v-if="uploadedFiles.length > 0" class="files">
      <div
        v-for="(file, key) in uploadedFiles"
        :key="file.directory + file.filename"
        class="preview"
      >
        <ImageItem
          :file="file"
          :filter="form.filter"
          @remove="handleRemove(key)"
          @browse="() => handleBrowse(file)"
        />
      </div>
    </div>
    <div v-if="uploadedFiles.length === 0 || multiple" class="no-preview-area">
      <i class="famfm-pictures no-image"></i>
      <button
        :class="`${themePrefix}-button outlined`"
        @click.prevent="() => handleBrowse(null)"
      >
        {{ $t("filesManager") }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import FileManagerModal from "./FileManagerModal.vue";
import ImageItem from "./items/ImageItem.vue";

export default {
  components: {
    FileManagerModal,
    ImageItem,
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    fileManagerOptions: Object,
    initialUploadedFiles: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      uploadedFiles: [],
      showModal: false,
    };
  },
  computed: {
    ...mapState(["themePrefix", "form", "injectCssVars", "multiple"]),
  },
  watch: {
    uploadedFiles: {
      deep: true,
      immediate: true,
      handler() {
        if (!this.$el) {
          return;
        }
        let event = new CustomEvent("selectionChange", {
          detail: this.uploadedFiles,
        });
        this.$el.dispatchEvent(event);
      },
    },
  },
  mounted() {
    this.uploadedFiles = [...this.initialUploadedFiles];
  },
  methods: {
    ...mapActions(["setSelectionPaths"]),

    handleRemove(key) {
      console.log("remove", key, this.uploadedFiles);
      this.uploadedFiles.splice(key, 1);
    },
    async handleBrowse(uploadedFile) {
      let id = null;
      if (uploadedFile) {
        let dir = uploadedFile.directory ? uploadedFile.directory + "/" : "";
        id = `@${uploadedFile.origin}:${dir}${uploadedFile.filename}`;
      }
      this.setSelectionPaths(id ? [id] : null);
      this.showModal = true;
    },
    handleNewSelection(selectedFiles) {
      this.showModal = false;
      // console.log("selectedFiles", selectedFiles);
      if (this.multiple) {
        selectedFiles
          .filter(
            (f) =>
              !this.uploadedFiles.find(
                (sf) =>
                  `${sf.directory}/${sf.filename}` === `${f.directory}/${f.filename}`,
              ),
          )
          .forEach((selectedFile) => {
            this.uploadedFiles.push(selectedFile);
          });
      } else {
        this.uploadedFiles = [selectedFiles[0]];
      }
      console.log(this.uploadedFiles);
    },
    parseUploadedFile({
      mimeGroup,
      mimeType,
      imageWidth,
      imageHeight,
      filename,
      directory,
      origin,
    }) {
      return {
        mimeGroup,
        mimeType,
        imageWidth,
        imageHeight,
        filename,
        directory,
        origin,
      };
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
  min-width: 200px;
  margin-right: 1rem;
  &:last-child {
    margin-right: 0;
  }
  img {
    vertical-align: middle;
    display: inline-block;
    min-width: 200px;
    height: auto;
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
    color: var(--grey);
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
