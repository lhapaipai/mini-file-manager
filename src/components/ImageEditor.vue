<template>
  <div v-if="file" ref="container" class="image-editor">
    <div class="mfm-header">
      <div>
        <h2><i class="famfm-picture"></i>{{ $t("imageEditor") }}</h2>
      </div>
      <div v-if="isCropping" class="section loader"><Spinner /></div>
      <div
        v-if="showValidationString && fileValidation && fileValidation.imageOptions"
        class="section"
      >
        <div class="section-label">{{ $t("constraint") }}</div>
        <div class="section-content">
          <label :class="`${themePrefix}-button  mfm-button outlined validation-string`">
            <input
              v-model="isValidationActive"
              type="checkbox"
              :class="`${themePrefix}-input-checkbox`"
            />
            <ValidationString />
          </label>
        </div>
      </div>
      <div class="section">
        <div class="section-label">{{ $t("tools") }}</div>
        <div class="section-content">
          <div :class="`${themePrefix}-button-group mfm-button-group`">
            <button
              v-tooltip
              data-tooltip-position="top"
              :aria-label="$t('moveImage')"
              class="outlined mfm-button"
              :class="{ active: dragMode === 'move', [`${themePrefix}-button`]: true }"
              @click="changeMode('move')"
            >
              <i class="famfm-move"></i>
            </button>
            <button
              v-tooltip
              data-tooltip-position="top"
              :aria-label="$t('cropImage')"
              class="outlined mfm-button"
              :class="{ active: dragMode === 'crop', [`${themePrefix}-button`]: true }"
              @click="changeMode('crop')"
            >
              <i class="famfm-crop"></i>
            </button>
          </div>
          <div :class="`${themePrefix}-button-group mfm-button-group`">
            <button
              v-tooltip
              data-tooltip-position="top"
              :aria-label="$t('rotateImage')"
              :class="`${themePrefix}-button  mfm-button outlined`"
              @click="rotate(-90)"
            >
              <i class="famfm-ccw"></i>
            </button>
            <button
              v-tooltip
              data-tooltip-position="top"
              :aria-label="$t('rotateImage')"
              :class="`${themePrefix}-button  mfm-button outlined`"
              @click="rotate(90)"
            >
              <i class="famfm-cw"></i>
            </button>
          </div>

          <button
            v-tooltip
            data-tooltip-position="top"
            :aria-label="$t('cancel')"
            :class="`${themePrefix}-button  mfm-button outlined`"
            @click="handleClear"
          >
            <i class="famfm-cancel"></i>
          </button>
        </div>
      </div>
      <div class="section">
        <div class="section-label">{{ $t("finalize") }}</div>
        <div class="section-content">
          <button
            :class="`${themePrefix}-button mfm-button outlined`"
            @click="handleReturn"
          >
            {{ $t("return") }}
          </button>

          <button
            class="mfm-button primary-color"
            :class="`${themePrefix}-button`"
            @click="handleSave"
          >
            <i class="famfm-ok"></i>{{ $t("apply") }}
          </button>
          <button
            :class="`${themePrefix}-button mfm-button outlined`"
            :disabled="invalidSelectedFiles.length > 0"
            @click="handleReturn"
          >
            {{ $t("next") }}
          </button>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="abs-content">
        <img
          ref="imageElt"
          class="original"
          :class="{ 'is-image-loading': isImageLoading }"
          :src="$uploadSrc(file, null) + `?${counter}`"
          @load="onImageLoad"
        />
      </div>
    </div>
    <div class="footer">
      <span>
        <i class="famfm-picture"></i>
        <span>{{ naturalWidth }}, {{ naturalHeight }} px</span>
      </span>
      <span v-if="canEditImageSize">
        <span>
          <i class="famfm-right-open"></i>
          <i class="famfm-ratio"></i>
          <input
            type="text"
            :class="[
              'ratio',
              `${themePrefix}-input-text mfm-input-text`,
              !isValidRatio ? 'is-invalid' : '',
            ]"
            :value="ratio"
            :disabled="ratioLockedByValidation"
            placeholder="ex: 16:9"
            @input="updateRatio"
          />
        </span>
        <span>
          <i class="famfm-right-open"></i>
          <i class="famfm-crop"></i>
          <span>{{ cropWidth }}, {{ cropHeight }} px</span>
        </span>
        <span>
          <i class="famfm-right-open"></i>
          <i class="famfm-resize-horizontal"></i>
          <input
            v-model.number="finalWidth"
            type="text"
            :class="[
              'nb',
              `${themePrefix}-input-text`,
              'mfm-input-text',
              !isFinalWidthValid ? 'is-invalid' : '',
            ]"
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
                'famfm-lock': finalWidthLockedByValidation || finalWidthLocked,
                'famfm-lock-open': !(finalWidthLockedByValidation || finalWidthLocked),
              }"
            ></i>
          </span>
        </span>
        <span>
          <i class="famfm-right-open"></i>
          <i class="famfm-resize-vertical"></i>
          <input
            v-model.number="finalHeight"
            type="text"
            :class="[
              'nb',
              `${themePrefix}-input-text`,
              'mfm-input-text',
              !isFinalHeightValid ? 'is-invalid' : '',
            ]"
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
                'famfm-lock': finalHeightLockedByValidation || finalHeightLocked,
                'famfm-lock-open': !(finalHeightLockedByValidation || finalHeightLocked),
              }"
            ></i>
          </span>
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
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
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
  props: {
    // eslint-disable-next-line vue/require-default-prop
    file: Object,
  },
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
      counter: 0,
    };
  },
  computed: {
    ...mapState([
      "fileValidation",
      "themePrefix",
      "showValidationString",
      "canEditImageSize",
    ]),
    ...mapGetters(["invalidSelectedFiles"]),
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
      if (this.finalWidthLockedByValidation || this.finalHeightLockedByValidation) {
        notify(this.$t("disableRules"), {
          style: "error",
          container: this.$refs.container,
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
    userChangeFinalWidth() {
      this.finalWidthLocked = true;
      this.finalHeightLocked = false;
      this.finalHeight = Math.round((this.finalWidth * this.cropHeight) / this.cropWidth);
    },
    userChangeFinalHeight() {
      this.finalHeightLocked = true;
      this.finalWidthLocked = false;
      this.finalWidth = Math.round((this.finalHeight * this.cropWidth) / this.cropHeight);
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
          (this.finalWidth * this.cropHeight) / this.cropWidth,
        );
      } else if (this.finalHeightLocked) {
        this.finalWidth = Math.round(
          (this.finalHeight * this.cropWidth) / this.cropHeight,
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
        this.finalHeight = Math.round((this.finalWidth * detail.height) / detail.width);
      } else if (this.finalHeightLockedByValidation) {
        this.finalHeight = this.imageValidation.height;
        this.finalWidth = Math.round((this.finalHeight * detail.width) / detail.height);
      } else if (!this.finalWidthLocked && !this.finalHeightLocked) {
        this.finalWidth = width;
        this.finalHeight = height;
      } else if (this.finalWidthLocked) {
        this.finalHeight = Math.round((this.finalWidth * detail.height) / detail.width);
      } else if (this.finalHeightLocked) {
        this.finalWidth = Math.round((this.finalHeight * detail.width) / detail.height);
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
        await this.cropFile({
          file: this.file,
          dimensions: data,
          finalWidth,
          finalHeight,
        });
        this.isImageLoading = true;

        this.counter++;
        // fonctionne mal lorsque le nouveau fichier est le même que le précédent
        // cropperInstance.replace(newFile.urlTimestamped);
        // cropFile va aussi commiter setEditContent avec le nouveau
        // nom de fichier donc initCropper sera appelé 1 voire 2 fois
        // donc il est important d'avoir le test if (!cropperInstance ..
        // dans initCropper
        this.initCropper();
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

    unmounted() {
      this.destroyCropper();
    },
  },
};
</script>
<style lang="scss" scoped>
input.mfm-input-text {
  padding: 3px 5px;
  border-color: var(--mfm-grey);
  height: 2rem;
  &:hover,
  &:focus {
    border-color: var(--mfm-grey700);
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

.mfm-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--mfm-grey200);

  & > * {
    &:first-child {
      margin-right: auto;
    }
  }

  @media (max-width: 1000px) {
    border-bottom-width: 0;
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
  border-top: 1px solid var(--mfm-grey200);
  padding: 10px;

  font-size: 0.8rem;
  input {
    font-size: 0.8rem;
  }
}

h2 {
  margin: 0 10px;
}

.section {
  border-left: 1px solid var(--mfm-grey200);
  padding: 5px 10px 10px 10px;
  &.loader {
    border-left: 0;
  }
  @media (max-width: 1000px) {
    border-left-width: 0;
  }
}

.section-label {
  color: var(--mfm-grey);
  font-size: 0.8rem;
}

.section-content {
  display: flex;
  flex-direction: row;

  & > .mfm-button,
  & > .mfm-button-group {
    margin-right: 0.5rem;

    &:last-child {
      margin-right: 0;
    }
  }
}

.mfm-button {
  padding: 0.25rem;
  height: auto;

  &.active {
    background-color: var(--mfm-primary-color);
  }
}
.penta-button.primary-color {
  background-color: var(--mfm-primary-color);
  color: var(--mfm-primary-color-text);
}

input.nb {
  width: 60px;
}
input.ratio {
  margin-left: 5px;
  width: 80px;
}

input.is-invalid {
  background-color: var(--mfm-red50);
}
i.famfm-right-open {
  color: var(--mfm-grey);
}
.lock {
  cursor: pointer;
  color: var(--mfm-grey700);
  &:hover {
    color: black;
  }
}
</style>
