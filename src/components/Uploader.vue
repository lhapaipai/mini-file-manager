<template>
  <div class="uploader">
    <div
      ref="dropArea"
      class="drop-area"
      :class="{
        highlight: dropActive,
        readonly: !canUpload,
      }"
      @dragenter="highlight"
      @dragover="highlight"
      @dragleave="unhighlight"
      @drop="unhighlight"
    >
      <span class="label-container">
        <span class="label">
          <span>
            <i class="famfm-doc-add"></i>{{ $t(canUpload ? "add" : "readonlyDir") }}
          </span>
          <span class="detail mime">{{ mimeGroups }}</span>
          <span class="detail">{{ $t("maxFileSize") }} : {{ humanMaxFileSize }}</span>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import Resumable from "resumablejs";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { notify } from "mini-notifier";
import { nextTick } from "vue";

import { createUploadedFileFromUpload, createThumbnail } from "../utils/creation";
import { filename2dirname, humanFileSize, sanitizeFilename } from "../utils/filters";

let resumable = null;

export default {
  data() {
    return {
      dropActive: false,
      progressFilename: null,
      retries: 0,
    };
  },
  computed: {
    ...mapState(["endPoints", "currentEntryPoint", "files", "fileUpload"]),
    ...mapGetters(["completeDirectory"]),
    canUpload() {
      if (!this.currentEntryPoint) {
        return false;
      }
      return !this.currentEntryPoint.readOnly;
    },
    humanMaxFileSize() {
      return humanFileSize(this.fileUpload.maxFileSize);
    },
    mimeGroups() {
      let mimeGroups = this.fileUpload.fileType.map((mime) => mime.split("/")[0]);
      let uniqueMimeGroups = Array.from(new Set(mimeGroups));

      if (uniqueMimeGroups.length === 1 && mimeGroups.length > 1) {
        let mimeChilds = this.fileUpload.fileType.map((mime) => mime.split("/")[1]);

        let mimeGroup = this.$t(`mimeGroup.${uniqueMimeGroups[0]}`);
        return `${mimeGroup} (${mimeChilds.join(", ")})`;
      }

      return uniqueMimeGroups
        .map((mimeGroup) => this.$t(`mimeGroup.${mimeGroup}`))
        .join(", ");
    },
  },
  watch: {
    currentEntryPoint() {},
  },
  async mounted() {
    resumable = new Resumable({
      target: this.endPoints.chunkFile,
      chunkSize: 1 * 1024 * 1024,
      simultaneousUploads: 4,
      testChunks: true,
      throttleProgressCallbacks: 1,
      query: (fileUploadInfos) => {
        return {
          directory: this.completeDirectory,
          origin: this.currentEntryPoint.origin,
          liipId: fileUploadInfos.liipId,
        };
      },
      uploadMethod: "POST",
      maxFileSize: this.fileUpload.maxFileSize,
      maxFileSizeErrorCallback: (file) => {
        notify(
          this.$t("exceedMaxSize", {
            name: file.name,
            size: humanFileSize(resumable.opts.maxFileSize),
          }),
          { style: "error" },
        );
      },
      fileType: this.fileUpload.fileType,
      fileTypeErrorCallback: (file) => {
        notify(
          this.$t("fileTypeError", { name: file.name, allowedFiles: this.mimeGroups }),
          {
            time: 10000,

            style: "error",
          },
        );
      },
    });
    await nextTick();
    resumable.assignDrop(this.$refs.dropArea);
    resumable.assignBrowse(this.$refs.dropArea);

    resumable.on("fileAdded", this.onFileAdded);
    resumable.on("fileSuccess", this.onFileSuccess);
    resumable.on("fileError", this.onFileError);
    resumable.on("fileProgress", (fileUploadInfos) => {
      this.updateFileUploadProgress({
        liipId: fileUploadInfos.liipId,
        progression: fileUploadInfos.progress(),
      });
    });
  },
  methods: {
    ...mapMutations(["addFile", "updateFileUploadProgress", "removeFile"]),
    ...mapActions(["updateFile"]),
    highlight() {
      this.dropActive = true;
    },
    unhighlight() {
      this.dropActive = false;
    },

    async onFileAdded(fileUploadInfos) {
      if (!this.canUpload) {
        resumable.removeFile(fileUploadInfos);
        notify(this.$t("readonlyDir"), {
          style: "error",
        });
        return;
      }

      // on renomme le fichier afin qu'il n'entre pas en conflit avec les fichiers déjà présents
      // dans le répertoire.
      fileUploadInfos.fileName = sanitizeFilename(fileUploadInfos.fileName, this.files);
      fileUploadInfos.relativePath = fileUploadInfos.fileName;
      fileUploadInfos.uniqueIdentifier = `${fileUploadInfos.size}-${filename2dirname(
        fileUploadInfos.fileName,
      )}`;
      if (this.completeDirectory) {
        fileUploadInfos.liipId = `#${this.currentEntryPoint.origin}:${this.completeDirectory}/${fileUploadInfos.fileName}`;
      } else {
        fileUploadInfos.liipId = `#${this.currentEntryPoint.origin}:${fileUploadInfos.fileName}`;
      }

      let fileInfos = createUploadedFileFromUpload(
        fileUploadInfos,
        this.completeDirectory,
        this.currentEntryPoint.origin,
      );

      this.addFile(fileInfos);
      await createThumbnail(fileUploadInfos, fileInfos);

      resumable.upload();
    },
    onFileSuccess(file, message) {
      let response = JSON.parse(message);

      if (!response.file || !response.oldLiipId) {
        notify(this.$t("chunkError"), {
          style: "error",
        });
        return;
      }
      this.updateFile({
        newFile: response.file,
        oldLiipId: response.oldLiipId,
      });
    },
    onFileError(fileUploadInfos, message) {
      let response;
      try {
        response = JSON.parse(message);
      } catch {
        response.message = message;
        response.status = 500;
      }

      if (response.status !== 415 && this.retries < 2) {
        fileUploadInfos.retry();
        this.retries = this.retries + 1;
        return;
      }

      console.log("file error", fileUploadInfos, response);

      resumable.removeFile(fileUploadInfos);
      this.retries = 0;

      let file = this.files.find((f) => f.liipId === fileUploadInfos.liipId);
      if (file) {
        this.removeFile(file);
      }

      notify(response.title || response, {
        style: "error",
      });
    },
  },
};
</script>

<style>
.dragover {
  padding: 30px;
  color: #555;
  background-color: #ddd;
  border: 1px solid #999;
}
</style>

<style lang="scss" scoped>
.uploader {
  display: flex;
  flex-direction: column;
}

.drop-area {
  flex: 1;
  position: relative;
  border: 2px dashed var(--mfm-primary-color100);
  border-radius: 20px;
  transition: var(--mfm-transition-border), var(--mfm-transition-background);
  &:hover {
    border-color: var(--mfm-primary-color500);
  }
  &.readonly {
    cursor: default;
    border-color: var(--mfm-grey200);

    .label-container {
      cursor: default;
      color: var(--mfm-grey200);
    }
  }

  .label-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
  }
  &.highlight {
    background-color: var(--mfm-primary-color100);
  }

  .label {
    display: flex;
    flex-direction: column;
  }
  .detail {
    font-size: 0.8rem;
    color: var(--mfm-grey);
    @media (max-width: 799.99px) {
      display: none;
    }
  }
}

.progress-value {
  background: var(--mfm-primary-color);
  transition: width 0.1s ease;
  height: 4px;
  display: flex;
  width: 0px;
  border-radius: 20px;
}
.filename {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}
.counter {
  position: absolute;
  font-size: 0.8rem;
  right: 2px;
  bottom: 2px;
}
</style>
