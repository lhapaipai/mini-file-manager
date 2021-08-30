<template>
  <div v-if="file" class="image-editor">
    <div class="header">
      <button class="btn outlined back" @click="handleReturn">
        {{ $t("return") }}
      </button>
      <div v-if="isCropping" class="toolbar loader"><Spinner /></div>
      <label
        v-if="fileValidation && fileValidation.imageOptions"
        class="btn outlined validation-string"
      >
        <input
          type="checkbox"
          class="form-checkbox"
          v-model="isValidationActive"
        />
        <ValidationString />
      </label>
      <div class="toolbar">
        <div class="btn-group">
          <button
            class="btn outlined"
            :class="{ active: dragMode === 'move' }"
            @click="changeMode('move')"
          >
            <i class="fa-move"></i>
          </button>
          <button
            class="btn outlined"
            :class="{ active: dragMode === 'crop' }"
            @click="changeMode('crop')"
          >
            <i class="fa-crop"></i>
          </button>
        </div>
        <div class="btn-group">
          <button class="btn outlined" @click="rotate(-90)">
            <i class="fa-ccw"></i>
          </button>
          <button class="btn outlined" @click="rotate(90)">
            <i class="fa-cw"></i>
          </button>
        </div>

        <button class="btn outlined" @click="handleClear">
          <i class="fa-cancel"></i>
        </button>
        <button class="btn" @click="handleSave">
          <i class="fa-ok"></i>{{ $t("apply") }}
        </button>
      </div>
    </div>
    <div class="content">
      <div class="abs-content">
        <img
          class="original"
          :class="{ 'is-image-loading': isImageLoading }"
          ref="imageElt"
          :src="file.urlTimestamped"
          @load="onImageLoad"
        />
      </div>
    </div>
    <div class="footer">
      <span>
        <i class="fa-picture"></i>
        <span>{{ naturalWidth }}, {{ naturalHeight }} px</span>
        <i class="fa-right-open"></i>
        <i class="fa-ratio"></i>
        <input
          type="text"
          class="ratio form-input"
          :class="{ 'is-invalid': !isValidRatio }"
          :value="ratio"
          :disabled="ratioLockedByValidation"
          @input="updateRatio"
          placeholder="ex: 16:9"
        />
      </span>
      <span>
        <i class="fa-right-open"></i>
        <i class="fa-crop"></i>
        <span>{{ cropWidth }}, {{ cropHeight }} px</span>
      </span>
      <span>
        <i class="fa-right-open"></i>
        <i class="fa-resize-horizontal"></i>
        <input
          type="text"
          v-model.number="finalWidth"
          class="nb form-input"
          :class="{ 'is-invalid': !isFinalWidthValid }"
          :disabled="
            finalWidthLockedByValidation ||
            finalHeightLockedByValidation ||
            finalHeightLocked
          "
          @input="userChangeFinalWidth"
        />

        <span class="lock" @click="handleLock('width')">
          <i
            :class="{
              'fa-lock': finalWidthLockedByValidation || finalWidthLocked,
              'fa-lock-open': !(
                finalWidthLockedByValidation || finalWidthLocked
              ),
            }"
          ></i>
        </span>
      </span>
      <span>
        <i class="fa-right-open"></i>
        <i class="fa-resize-vertical"></i>

        <input
          type="text"
          v-model.number="finalHeight"
          class="nb form-input"
          :class="{ 'is-invalid': !isFinalHeightValid }"
          :disabled="
            finalWidthLockedByValidation ||
            finalHeightLockedByValidation ||
            finalWidthLocked
          "
          @input="userChangeFinalHeight"
        />
        <span class="lock" @click="handleLock('height')">
          <i
            :class="{
              'fa-lock': finalHeightLockedByValidation || finalHeightLocked,
              'fa-lock-open': !(
                finalHeightLockedByValidation || finalHeightLocked
              ),
            }"
          ></i>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import ValidationString from "./ValidationString.vue";
import Cropper from "cropperjs";
import Spinner from "./Spinner.vue";

import { nextTick } from "vue";
import { mapActions, mapMutations, mapState } from "vuex";
import { notify } from "mini-notifier";

let cropperInstance = null;
let cropperConfig = {
  autoCrop: false,
  toggleDragModeOnDblclick: false,
  dragMode: "crop",
  viewMode: 1,
  checkOrientation: true,
  rotatable: true,
};
export default {
  components: {
    ValidationString,
    Spinner,
  },
  props: ["file"],
  data() {
    return {
      dragMode: cropperConfig.dragMode,
      isValidationActive: true,
      ratio: "",
      ratioLockedByValidation: false,
      isValidRatio: true,
      naturalWidth: 0,
      naturalHeight: 0,
      cropWidth: 0,
      cropHeight: 0,
      finalWidth: 0,
      finalWidthLocked: false,
      finalWidthLockedByValidation: false,
      finalHeight: 0,
      finalHeightLocked: false,
      finalHeightLockedByValidation: false,
      isImageLoading: true,
      isCropping: false,
    };
  },
  computed: {
    ...mapState(["fileValidation"]),
    imageValidation() {
      return this.fileValidation?.imageOptions;
    },
    isFinalWidthValid() {
      if (!this.isValidationActive || !this.imageValidation) {
        return true;
      }
      if (
        this.imageValidation.minWidth &&
        this.imageValidation.minWidth > this.finalWidth
      ) {
        return false;
      }
      if (
        this.imageValidation.maxWidth &&
        this.imageValidation.maxWidth < this.finalWidth
      ) {
        return false;
      }
      return true;
    },
    isFinalHeightValid() {
      if (!this.isValidationActive || !this.imageValidation) {
        return true;
      }
      if (
        this.imageValidation.minHeight &&
        this.imageValidation.minHeight > this.finalHeight
      ) {
        return false;
      }
      if (
        this.imageValidation.maxHeight &&
        this.imageValidation.maxHeight < this.finalHeight
      ) {
        return false;
      }
      return true;
    },
  },
  watch: {
    isValidationActive() {
      this.checkValidation();
    },
  },
  methods: {
    /* l'utilisateur change le ratio */
    updateRatio(e) {
      let value = e.target.value;
      this.ratio = value;

      if (!value) {
        this.isValidRatio = true;
        cropperInstance.setAspectRatio(NaN);
        return;
      }
      let a, b;
      let colonValue = value.split(":");
      let slashValue = value.split("/");
      let floatValue = parseFloat(value);

      if (colonValue.length === 2) {
        a = parseInt(colonValue[0]);
        b = parseInt(colonValue[1]);
        // console.log("ah", a, b, a / b, isNaN(a / b));
        floatValue = a / b;
      } else if (slashValue.length === 2) {
        a = parseInt(slashValue[0]);
        b = parseInt(slashValue[1]);
        floatValue = a / b;
      }
      if (isNaN(floatValue)) {
        this.isValidRatio = false;
        return;
      }
      this.isValidRatio = true;

      cropperInstance.setAspectRatio(floatValue);
    },
    handleLock(pos) {
      if (
        this.finalWidthLockedByValidation ||
        this.finalHeightLockedByValidation
      ) {
        notify(this.$t("disableRules"), {
          style: "error",
        });
        return;
      }
      if (pos === "height") {
        this.finalHeightLocked = !this.finalHeightLocked;
        if (this.finalHeightLocked) {
          this.finalWidthLocked = false;
        }
      } else {
        this.finalWidthLocked = !this.finalWidthLocked;
        if (this.finalWidthLocked) {
          this.finalHeightLocked = false;
        }
      }
    },
    userChangeFinalWidth(e) {
      this.finalWidthLocked = true;
      this.finalHeightLocked = false;
      this.finalHeight = Math.round(
        (this.finalWidth * this.cropHeight) / this.cropWidth
      );
    },
    userChangeFinalHeight(e) {
      this.finalHeightLocked = true;
      this.finalWidthLocked = false;
      this.finalWidth = Math.round(
        (this.finalHeight * this.cropWidth) / this.cropHeight
      );
    },
    ...mapMutations(["setEditContent"]),
    ...mapActions(["cropFile"]),
    handleReturn() {
      this.destroyCropper();
      this.setEditContent(null);
    },
    handleClear() {
      cropperInstance.clear();
      cropperInstance.reset();
      this.cropWidth = this.naturalWidth;
      this.cropHeight = this.naturalHeight;
      if (!this.finalWidthLocked && !this.finalHeightLocked) {
        this.finalWidth = this.naturalWidth;
        this.finalHeight = this.naturalHeight;
      } else if (this.finalWidthLocked) {
        this.finalHeight = Math.round(
          (this.finalWidth * this.cropHeight) / this.cropWidth
        );
      } else if (this.finalHeightLocked) {
        this.finalWidth = Math.round(
          (this.finalHeight * this.cropWidth) / this.cropHeight
        );
      }
      this.checkValidation();
    },
    changeMode(mode) {
      if (!cropperInstance) return;
      if (mode === "none") {
        this.handleClear();
      }
      this.dragMode = mode;
      cropperInstance.setDragMode(mode);
    },
    rotate(angle) {
      if (!cropperInstance) return;
      cropperInstance.rotate(angle);
    },
    handleCrop({ detail }) {
      let width = Math.round(detail.width);
      let height = Math.round(detail.height);

      if (width === 0 || height === 0) {
        this.cropWidth = 0;
        this.cropHeight = 0;
        if (!this.finalWidthLocked) {
          this.finalWidth = 0;
        }
        if (!this.finalHeightLocked) {
          this.finalHeight = 0;
        }
        return;
      }

      this.cropWidth = width;
      this.cropHeight = height;
      if (this.finalWidthLockedByValidation) {
        this.finalWidth = this.imageValidation.width;
        this.finalHeight = Math.round(
          (this.finalWidth * detail.height) / detail.width
        );
      } else if (this.finalHeightLockedByValidation) {
        this.finalHeight = this.imageValidation.height;
        this.finalWidth = Math.round(
          (this.finalHeight * detail.width) / detail.height
        );
      } else if (!this.finalWidthLocked && !this.finalHeightLocked) {
        this.finalWidth = width;
        this.finalHeight = height;
      } else if (this.finalWidthLocked) {
        this.finalHeight = Math.round(
          (this.finalWidth * detail.height) / detail.width
        );
      } else if (this.finalHeightLocked) {
        this.finalWidth = Math.round(
          (this.finalHeight * detail.width) / detail.height
        );
      }
    },
    isReady() {
      // console.log("isReady");
      let imageData = cropperInstance.getImageData();
      this.naturalWidth = imageData.naturalWidth;
      this.naturalHeight = imageData.naturalHeight;
      this.cropWidth = imageData.naturalWidth;
      this.cropHeight = imageData.naturalHeight;
      this.finalWidth = imageData.naturalWidth;
      this.finalHeight = imageData.naturalHeight;
      this.checkValidation();
    },
    checkValidation() {
      if (!this.imageValidation) {
        return;
      }
      if (this.isValidationActive) {
        if (this.imageValidation.ratio) {
          cropperInstance.setAspectRatio(this.imageValidation.ratio);
          this.ratio = this.imageValidation.ratio;
          this.ratioLockedByValidation = true;
        }
        if (this.imageValidation.width) {
          this.finalWidth = this.imageValidation.width;
          this.finalWidthLockedByValidation = true;
          if (this.ratio) {
            this.finalHeight = this.finalWidth / this.ratio;
          }
        }
        if (this.imageValidation.height) {
          this.finalHeight = this.imageValidation.height;
          this.finalHeightLockedByValidation = true;
          if (this.ratio) {
            this.finalWidth = this.finalHeight * this.ratio;
          }
        }
      } else {
        cropperInstance.setAspectRatio(NaN);
        this.ratioLockedByValidation = false;
        this.finalWidthLockedByValidation = false;
        this.finalHeightLockedByValidation = false;
      }
    },
    async onImageLoad() {
      // console.log("onImageLoad 1", cropperInstance, this.$refs.imageElt);
      if (!this.$refs.imageElt) {
        // fix bug onImageLoad called onDestroy
        return;
      }
      this.isImageLoading = false;
      await nextTick();
      this.initCropper();
    },
    initCropper() {
      // console.log("init cropper 1", cropperInstance, this.$refs.imageElt);
      // only for the first cropping
      if (cropperInstance) {
        cropperInstance.destroy();
      }

      if (this.$refs.imageElt) {
        this.$refs.imageElt.addEventListener("crop", this.handleCrop);
        this.$refs.imageElt.addEventListener("ready", this.isReady);
        cropperInstance = new Cropper(this.$refs.imageElt, cropperConfig);
      }
    },
    async handleSave() {
      this.isCropping = true;
      let data = cropperInstance.getData();
      try {
        // because we loose this values with destroyCropper();
        let finalWidth = this.finalWidth;
        let finalHeight = this.finalHeight;
        this.destroyCropper();
        let newFile = await this.cropFile({
          file: this.file,
          dimensions: data,
          finalWidth,
          finalHeight,
        });
        this.isImageLoading = true;

        if (newFile.urlTimestamped) {
          // fonctionne mal lorsque le nouveau fichier est le même que le précédent
          // cropperInstance.replace(newFile.urlTimestamped);

          // cropFile va aussi commiter setEditContent avec le nouveau
          // nom de fichier donc initCropper sera appelé 1 voire 2 fois
          // donc il est important d'avoir le test if (!cropperInstance ..
          // dans initCropper

          this.initCropper();
        }
      } finally {
        this.isCropping = false;
      }
    },

    destroyCropper() {
      // console.log("destroyCropper 1", cropperInstance, this.$refs.imageElt);
      if (cropperInstance) {
        cropperInstance.destroy();
      }
      this.naturalWidth = 0;
      this.naturalHeight = 0;
      this.cropWidth = 0;
      this.cropHeight = 0;
      this.finalWidth = 0;
      this.finalHeight = 0;
      cropperInstance = null;
      this.$refs.imageElt.removeEventListener("crop", this.handleCrop);
      this.$refs.imageElt.removeEventListener("ready", this.isReady);
      // console.log("destroyCropper 2", cropperInstance, this.$refs.imageElt);
    },
    // mounted() {
    //   this.localFile = this.file;
    // },

    unmounted() {
      this.destroyCropper();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../css/variables.scss";
input.form-input {
  padding: 3px 5px;
  border-color: $gray;
  &:hover,
  &:focus {
    border-color: $grayDark;
  }
}
.is-image-loading {
  opacity: 0;
}
.image-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .back {
    margin-right: auto;
    margin-left: 0;
    margin-bottom: 10px;
  }

  .validation-string {
    margin-bottom: 10px;
    margin-right: 10px;
  }
  .toolbar.loader {
    margin-right: 10px;
  }
  .toolbar {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    & > * {
      margin-left: 10px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
  @media (max-width: 900px) {
    .btn {
      padding: 0.25rem;
    }
  }
}

.content {
  flex: 1;
  position: relative;
  min-height: 200px;
  .abs-content {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
  img.original {
    height: 100%;
    width: auto;
    opacity: 0;
  }
}

.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  & > * {
    margin-top: 10px;
  }
  @media (max-width: 900px) {
    font-size: 0.9rem;
    input {
      font-size: 0.9rem;
    }
    i.fa-right-open {
      font-size: 0.8rem;
    }
  }
}

input.nb {
  width: 60px;
}
input.ratio {
  margin-left: 5px;
  width: 80px;
}

input.is-invalid {
  background-color: $redLight;
}
i.fa-right-open {
  color: $gray;
}
.lock {
  cursor: pointer;
  color: $blackLight;
  &:hover {
    color: black;
  }
}
</style>
