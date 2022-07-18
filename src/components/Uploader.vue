<template>
  <div class="uploader">
    <div
      ref="dropArea"
      class="drop-area"
      :class="{
        highlight: dropActive,
        'is-uploading': isUploading,
        readonly: !canUpload,
      }"
      @dragenter="highlight"
      @dragover="highlight"
      @dragleave="unhighlight"
      @drop="unhighlight"
    >
      <span class="label"
        ><i class="famfm-doc-add"></i>{{ $t(canUpload ? "add" : "readonlyDir") }}</span
      >
    </div>
  </div>
</template>

<script>
import Resumable from "resumablejs";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { notify } from "mini-notifier";
import { nextTick } from "vue";

import { createFileInfosFromUpload } from "../utils/creation";
import { filename2dirname, humanFileSize, sanitizeFilename } from "../utils/filters";

let resumable = null;

export default {
  data() {
    return {
      isUploading: false,
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
          id: fileUploadInfos.id,
        };
      },
      uploadMethod: "POST",
      maxFileSize: this.fileUpload.maxFileSize,
      maxFileSizeErrorCallback: (file, errorCount) => {
        notify(
          this.$t("exceedMaxSize", {
            name: file.name,
            size: humanFileSize(resumable.opts.maxFileSize),
          }),
          { style: "error" },
        );
        console.log(file, errorCount, resumable);
      },
      fileType: this.fileUpload.fileType,
      fileTypeErrorCallback: (file, errorCount) => {
        notify(this.$t("fileTypeError", { name: file.name }), {
          time: 500000,

          style: "error",
        });
        console.log(file, errorCount);
      },
    });
    await nextTick();
    // console.log(r.support, this.$refs.inputFile, this.$refs.dropArea)
    resumable.assignDrop(this.$refs.dropArea);
    resumable.assignBrowse(this.$refs.dropArea);

    resumable.on("fileAdded", this.onFileAdded);
    resumable.on("fileSuccess", this.onFileSuccess);
    resumable.on("fileError", this.onFileError);
    resumable.on("fileProgress", (fileUploadInfos) => {
      // console.log("onprogress", fileUploadInfos);
      this.updateFileUploadProgress({
        id: fileUploadInfos.id,
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
        fileUploadInfos.id = `#${this.currentEntryPoint.origin}:${this.completeDirectory}/${fileUploadInfos.fileName}`;
      } else {
        fileUploadInfos.id = `#${this.currentEntryPoint.origin}:${fileUploadInfos.fileName}`;
      }

      resumable.upload();

      let fileInfos = await createFileInfosFromUpload(
        fileUploadInfos,
        this.completeDirectory,
        this.currentEntryPoint.origin,
      );

      this.addFile(fileInfos);
      // console.log("fileadded", fileUploadInfos, this.files.map((f) => f.inode).join(","));

      // this.isUploading = true;
    },
    onFileSuccess(file, message) {
      let response = JSON.parse(message);
      // console.log("fileSuccess", file, file.relativePath, response.file?.filename);

      if (!response.file || !response.oldId) {
        console.log(response);
        notify(this.$t("chunkError"), {
          style: "error",
        });
        return;
      }

      this.updateFile({
        newFile: response.file,
        oldId: response.oldId,
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

      console.log("on file error", fileUploadInfos, response);

      resumable.removeFile(fileUploadInfos);
      this.retries = 0;

      let file = this.files.find((f) => f.id === fileUploadInfos.id);
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

<style lang="postcss" scoped>
.uploader {
  display: flex;
  flex-direction: column;

  /* &.is-uploading {
    border: 1px solid var(--grey200);
  } */
}

.drop-area {
  /* overflow: hidden; */
  flex: 1;
  position: relative;
  border: 2px dashed var(--primary-color100);
  /* border-radius: var(--form-border-radius); */
  border-radius: 20px;
  transition: var(--transition-border), var(--transition-background);
  &:hover {
    border-color: var(--primary-color700);
  }
  &.readonly {
    cursor: default;
    border-color: var(--grey200);

    .label {
      cursor: default;
      color: var(--grey200);
    }
  }

  .label {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
  }
  &.highlight {
    background-color: var(--primary-color100);
  }
}

.progress-value {
  background: var(--primary-color);
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
