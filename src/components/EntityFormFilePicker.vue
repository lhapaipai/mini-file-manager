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
    <PreviewArea
      :uploaded-files="uploadedFiles"
      @remove="handleRemove"
      @browse="handleBrowse"
    ></PreviewArea>

    <div v-if="withForm">
      <div v-for="(file, key) in uploadedFiles" :key="file.directory + file.filename">
        <input
          v-model="file.liipId"
          :type="inputType"
          :name="generateName('liipId', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.mimeGroup"
          :type="inputType"
          :name="generateName('mimeGroup', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.mimeType"
          :type="inputType"
          :name="generateName('mimeType', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.filename"
          :type="inputType"
          :name="generateName('filename', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.directory"
          :type="inputType"
          :name="generateName('directory', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.origin"
          :type="inputType"
          :name="generateName('origin', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model.number="file.imageWidth"
          :type="inputType"
          :name="generateName('imageWidth', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model.number="file.imageHeight"
          :type="inputType"
          :name="generateName('imageHeight', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.type"
          :type="inputType"
          :name="generateName('type', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model.number="file.size"
          :type="inputType"
          :name="generateName('size', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.updatedAt"
          :type="inputType"
          :name="generateName('updatedAt', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.icon"
          :type="inputType"
          :name="generateName('icon', key)"
          class="ogoxe-input-text"
        />
        <input
          :value="file.public ? 1 : 0"
          :type="inputType"
          :name="generateName('public', key)"
          class="ogoxe-input-text"
        />
      </div>
    </div>
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
    name: {
      type: String,
      default: "",
    },
    initialUploadedFiles: {
      type: Array,
      default: () => [],
    },
    withForm: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      uploadedFiles: [],
      showModal: false,
    };
  },
  computed: {
    ...mapState(["themePrefix", "form", "multiple", "debug"]),
    inputType() {
      return this.debug ? "text" : "hidden";
    },
  },
  mounted() {
    this.uploadedFiles = [...this.initialUploadedFiles];
  },
  methods: {
    ...mapActions(["setSelectionPaths"]),
    generateName(suffix, key) {
      if (this.multiple) {
        return `${this.name}[${key}][${suffix}]`;
      }
      return `${this.name}[${suffix}]`;
    },
    handleRemove(key) {
      console.log("remove", key, this.uploadedFiles);
      this.uploadedFiles.splice(key, 1);

      if (!this.withForm) {
        let event = new CustomEvent("newFormFiles", {
          detail: this.uploadedFiles,
        });
        this.$el.dispatchEvent(event);
      }
    },
    handleNewSelection(selectedFiles) {
      this.showModal = false;
      // console.log("selectedFiles", selectedFiles);
      if (this.multiple) {
        selectedFiles.forEach((selectedFile) => {
          this.uploadedFiles.push(selectedFile);
        });
      } else {
        this.uploadedFiles = selectedFiles;
      }

      if (!this.withForm) {
        let event = new CustomEvent("newFormFiles", {
          detail: this.uploadedFiles,
        });
        this.$el.dispatchEvent(event);
      }
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
  },
};
</script>

<style lang="scss" scoped>
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
</style>
