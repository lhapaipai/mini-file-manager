<template>
  <div v-if="completeDirectory !== null">
    <div
      v-if="canUpload"
      class="drop-area"
      :class="{ highlight: dropActive, sending: sending }"
      @dragenter.prevent.stop="highlight"
      @dragover.prevent.stop="highlight"
      @dragleave.prevent.stop="unhighlight"
      @drop.prevent.stop="handleDrop"
    >
      <input
        type="file"
        multiple
        :id="inputFileId"
        class="input-file"
        :disabled="sending"
        accept="image/*,text/*,video/*,audio/*,.rtf,.pdf,.xml,font/*,.ods,.odt,.docx,.doc,.xlsx,.xls,.json,.ai,.zip"
        @change="handleChange"
      />
      <label class="label" :for="inputFileId" v-if="!sending">
        <span><i class="fa-doc-add"></i>Ajouter</span>
      </label>
      <div v-else-if="progressFilename">
        <div
          class="progress-value"
          :style="{ width: progressNumber + '%' }"
        ></div>
        <div class="filename">
          {{ progressFilename }}
        </div>
        <div class="counter ref">
          {{ uploadedFiles + 1 }} / {{ filesToUpload }}
        </div>
      </div>
    </div>
    <div v-else class="drop-area readonly">
      <label class="label"> Répertoire en lecture seule. </label>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import { notify } from "mini-notifier";

export default {
  data() {
    return {
      sending: false,
      uploadedFiles: 0,
      filesToUpload: 0,
      dropActive: false,
      progressFilename: null,
      progressNumber: 0,
      inputFileId: "file-" + Math.ceil(Math.random() * 10000),
    };
  },
  computed: {
    ...mapState(["endPoints", "currentEntryPoint", "isAdmin"]),
    ...mapGetters(["completeDirectory"]),
    canUpload() {
      return this.isAdmin || !this.currentEntryPoint.readOnly;
    },
  },
  methods: {
    ...mapMutations(["addFile", "setFiles"]),
    reset() {
      this.sending = false;
      this.uploadedFiles = 0;
      this.filesToUpload = 0;
      this.progressNumber = 0;
      this.progressFilename = null;
    },
    highlight() {
      this.dropActive = true;
    },
    unhighlight() {
      this.dropActive = false;
    },
    handleDrop(e) {
      this.unhighlight();
      let files = e.dataTransfer.files;
      this.handleFiles(files);
    },
    handleChange(e) {
      let files = e.currentTarget.files;
      console.log("amont", this);
      this.handleFiles(files);
    },
    async handleFiles(files) {
      // console.log('handlefiles', files);
      if (files.length === 0) {
        return;
      }
      this.filesToUpload = files.length;
      this.sending = true;

      for (let file of files) {
        await this.uploadFile(file);
      }
    },
    uploadFile(file) {
      let that = this;
      return new Promise((resolve) => {
        let formData = new FormData();
        formData.append("file", file);
        formData.append("directory", this.completeDirectory);
        formData.append("origin", this.currentEntryPoint.origin);

        this.progressFilename = file.name;
        this.progressNumber = 0;
        // console.log(file, file.type);
        let request = new XMLHttpRequest();
        request.upload.onprogress = function (event) {
          if (event.lengthComputable) {
            that.progressNumber = Math.round(
              (event.loaded * 100) / event.total
            );
          }
        };
        request.open("POST", this.endPoints.uploadFile);
        request.onload = function () {
          that.progressNumber = 100;

          let response;
          try {
            response = JSON.parse(this.responseText);

            if (this.status === 200 && response && response.data) {
              console.log("addFile", that);

              that.addFile(response.data);
              // that.setFiles(response.files);
            } else {
              notify(response.title || response, {
                style: "error",
              });
            }
          } catch (error) {
            notify(this.responseText, {
              style: "error",
            });
            return;
          } finally {
            that.uploadedFiles++;
            that.checkFinished();
            resolve();
          }
        };
        request.onerror = function (event) {
          notify(event.target.statusText, {
            style: "error",
          });
          that.uploadedFiles++;
          that.checkFinished();
          resolve();
        };
        request.send(formData);
      });
    },
    checkFinished() {
      if (this.uploadedFiles < this.filesToUpload) {
        return;
      }
      this.reset();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../css/variables.scss";

.drop-area {
  overflow: hidden;
  height: 100%;
  position: relative;
  border: 1px solid transparent;
  border-radius: $borderRadius;
  &.sending {
    border: 1px solid $lightGray;
  }

  .label {
    border: 2px dashed $yellow;
    border-radius: 20px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
  }
  &.highlight .label {
    border-color: $yellowDark;
    background-color: $yellowLight;
  }
  &.readonly {
    .label {
      cursor: default;
      border: 2px dashed $lightGray;
    }
  }
  .progress-value {
    background: $yellow;
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
}
.input-file {
  display: none;
}

.files {
  display: grid;
  grid-template-columns: 150px 150px 150px;
  row-gap: 15px;
  column-gap: 15px;
}
</style>
