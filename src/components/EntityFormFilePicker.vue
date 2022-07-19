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
      <div v-if="uploadedFiles.length > 0" class="files">
        <div
          v-for="(file, key) in uploadedFiles"
          :key="file.directory + file.filename"
          class="preview"
        >
          <ImageItem
            :file="file"
            :filter="form.filter"
            @remove="() => handleRemove(key)"
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

    <div>
      <div v-for="(file, key) in uploadedFiles" :key="file.directory + file.filename">
        <input
          v-model="file.liipId"
          type="hidden"
          :name="generateName('liipId', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.mimeGroup"
          type="hidden"
          :name="generateName('mimeGroup', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.mimeType"
          type="hidden"
          :name="generateName('mimeType', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.filename"
          type="hidden"
          :name="generateName('filename', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.directory"
          type="hidden"
          :name="generateName('directory', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.origin"
          type="hidden"
          :name="generateName('origin', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model.number="file.imageWidth"
          type="hidden"
          :name="generateName('imageWidth', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model.number="file.imageHeight"
          type="hidden"
          :name="generateName('imageHeight', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.type"
          type="hidden"
          :name="generateName('type', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model.number="file.size"
          type="hidden"
          :name="generateName('size', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.createdAt"
          type="hidden"
          :name="generateName('createdAt', key)"
          class="ogoxe-input-text"
        />
        <input
          v-model="file.icon"
          type="hidden"
          :name="generateName('icon', key)"
          class="ogoxe-input-text"
        />
        <input
          :value="file.public ? 1 : 0"
          type="hidden"
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
import ImageItem from "./items/ImageItem.vue";

export default {
  components: {
    FileManagerModal,
    ImageItem,
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
  },
  data() {
    return {
      uploadedFiles: [],
      showModal: false,
    };
  },
  computed: {
    ...mapState(["themePrefix", "form", "multiple"]),
  },
  mounted() {
    console.log("initialUploadedFiles", this.initialUploadedFiles);
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
        selectedFiles.forEach((selectedFile) => {
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
    display: block;
    /* height: 200px;
    max-width: auto;
    width: auto; */
  }
}
.rounded-corner {
  box-shadow: 0 0 1px #bbb;
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
