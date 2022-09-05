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
    <PreviewArea
      :uploaded-files="uploadedFiles"
      @remove="handleRemove"
      @browse="handleBrowse"
    ></PreviewArea>

    <!-- <div v-if="uploadedFiles.length > 0" class="files">
      <div
        v-for="(file, key) in uploadedFiles"
        :key="file.directory + file.filename + file.updatedAt"
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
    </div> -->
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import FileManagerModal from "./FileManagerModal.vue";
import PreviewArea from "./PreviewArea.vue";

export default {
  components: {
    FileManagerModal,
    PreviewArea,
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
        this.uploadedFiles = selectedFiles;
      }
      console.log(this.uploadedFiles);
    },
  },
};
</script>

<style lang="scss" scoped>
.files {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 15px;
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
