<template>
  <div v-if="directory" class="infos">
    <div v-if="files.length === 0">
      <div class="infos-row">
        <label>{{ $t("directoryName") }}</label>
        <div>{{ directory.filename }}</div>
      </div>
      <div class="infos-row">
        <label>{{ $t("access") }}</label>
        <div v-if="currentEntryPoint.readOnly">
          <div>{{ $t("readonly") }}</div>
        </div>
        <div v-else>
          <div>{{ $t("editable") }}</div>
        </div>
      </div>
      <div class="infos-row">
        <label>{{ $t("downloadAll") }}</label>
        <div :class="`${themePrefix}-button-group mfm-button-group`">
          <button
            :class="`${themePrefix}-button mfm-button outlined`"
            @click.prevent="handleDownload"
          >
            <i class="famfm-download"></i>
          </button>
        </div>
      </div>
    </div>
    <div v-else-if="files.length === 1">
      <form class="infos-row filename" @submit.prevent="onSubmitEditFilename">
        <label>{{ $t("name") }}</label>
        <div v-if="!canEdit(file)">
          <div>{{ file.filename }}</div>
        </div>
        <div v-else :class="`${themePrefix}-input-button mfm-input-button`">
          <input
            ref="inputFilename"
            v-model="filename"
            size="1"
            :class="`${themePrefix}-input-text mfm-input-text`"
            type="text"
            :disabled="!editFilename"
          />
          <button
            :class="`${themePrefix}-button outlined ${themePrefix}-icon`"
            @click.prevent="onSubmitEditFilename"
          >
            <i v-if="editFilename" class="famfm-ok"></i>
            <i v-else class="famfm-pencil"></i>
          </button>
        </div>
      </form>
      <div v-if="file.type === 'file'" class="infos-row url">
        <label>{{ $t("url") }}</label>
        <div :class="`${themePrefix}-input-button mfm-input-button`">
          <input
            ref="inputUrl"
            size="1"
            :class="`${themePrefix}-input-text mfm-input-text`"
            type="text"
            readOnly
            :value="$uploadSrc(file)"
            @focus="$event.target.select()"
          />
          <button
            :class="`${themePrefix}-button outlined ${themePrefix}-icon`"
            @click.prevent="copyToClipboard"
          >
            <i class="famfm-clipboard"></i>
          </button>
        </div>
      </div>
      <div class="infos-row created-at">
        <label>{{ $t("createdAt") }}</label>
        <div>{{ formatDate(file.createdAt) }}</div>
      </div>
      <div class="infos-row extra">
        <label>{{ $t("infos") }}</label>
        <template v-if="file.mimeGroup === 'image' && file.imageWidth">
          <div>
            <i class="famfm-picture"></i> {{ file.imageWidth }}, {{ file.imageHeight }}
            {{ $t("px") }}
          </div>
          <div>
            <i class="famfm-ratio"></i>
            {{ formatRatio(file.imageWidth / file.imageHeight) }}
          </div>
        </template>
        <div><i class="famfm-gauge"></i> {{ humanFileSize(file.size) }}</div>
      </div>
      <div :class="`infos-row ${themePrefix}-button-group mfm-button-group`">
        <button
          v-if="file && file.type !== 'dir'"
          :class="`${themePrefix}-button mfm-button outlined`"
          @click.prevent="handleOpen"
        >
          <i class="famfm-eye"></i>
        </button>
        <button
          v-if="canEditContent(file)"
          class="mfm-button"
          :class="{ outlined: true, [`${themePrefix}-button`]: true, border: !isValid }"
          @click.prevent="editContent"
        >
          <i class="famfm-edit-image"></i>
        </button>
        <button
          :class="`${themePrefix}-button mfm-button outlined`"
          @click.prevent="handleDownload"
        >
          <i class="famfm-download"></i>
        </button>
        <button
          v-if="canEdit(file)"
          :class="`${themePrefix}-button mfm-button outlined`"
          @click.prevent="deleteSelectedFiles"
        >
          <i class="famfm-trash"></i>
        </button>
      </div>

      <div v-if="isValid === false && isEditable === true" class="info alert">
        {{ $t("needEdition") }}
      </div>
      <div
        v-else-if="isValid === false && isEditable === false && file.type === 'file'"
        class="info alert"
      >
        {{ $t("notSelectable") }}
      </div>
    </div>
    <div v-else-if="files.length > 1">{{ files.length }} {{ $t("selectedFiles") }}</div>
  </div>
</template>

<script>
import { notify } from "mini-notifier";
import { mapActions, mapMutations, mapState } from "vuex";
import { humanFileSize } from "../utils/filters";
import { isValidFile, isEditableFile } from "../utils/validation";

export default {
  props: {
    files: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    filename: "",
    ext: "",
  }),
  computed: {
    ...mapState([
      "directory",
      "editFilename",
      "currentEntryPoint",
      "endPoints",
      "secondaryDirectories",
      "themePrefix",
      "fileValidation",
    ]),
    currentDirectoryName() {
      if (this.secondaryDirectories.length > 0) {
        return this.secondaryDirectories[this.secondaryDirectories.length - 1];
      } else {
        return this.currentEntryPoint.label;
      }
    },
    file() {
      if (this.files.length === 1) {
        return this.files[0];
      }
      return null;
    },
    isValid() {
      if (this.files.length !== 1) {
        return null;
      }
      return isValidFile(this.files[0], this.fileValidation);
    },
    isEditable() {
      if (this.files.length !== 1) {
        return null;
      }
      return isEditableFile(this.files[0], this.fileValidation);
    },
  },
  watch: {
    file() {
      this.filename = this.file?.filename;
    },
  },
  methods: {
    ...mapActions(["updateFilename", "download", "deleteSelectedFiles"]),
    ...mapMutations(["setEditFilename", "setEditContent"]),
    formatDate(strDate) {
      let date = new Date(strDate);
      if (!(date instanceof Date) || isNaN(date)) {
        return "";
      }
      return new Intl.DateTimeFormat("fr-FR").format(date);
    },
    formatRatio(floatRatio) {
      return Math.round(floatRatio * 100) / 100;
    },
    canEdit(file) {
      if (this.currentEntryPoint.readOnly) {
        return false;
      }
      return !file.readOnly;
    },
    canEditContent(file) {
      return !this.currentEntryPoint.readOnly && !!file.imageWidth;
    },
    copyToClipboard() {
      let input = this.$refs.inputUrl;
      input.select();
      document.execCommand("copy");
      notify("URL copiée");
    },
    editContent() {
      this.setEditContent(this.file);
    },
    onSubmitEditFilename() {
      if (this.editFilename) {
        if (this.filename !== this.file.filename) {
          let oldLastDot, lastDot, oldExt, ext;

          oldLastDot = this.file.filename.lastIndexOf(".");
          // seulement si l'original a une extension
          if (oldLastDot !== -1) {
            oldExt = this.file.filename.substring(oldLastDot).toLowerCase();

            lastDot = this.filename.lastIndexOf(".");
            if (lastDot !== -1) {
              ext = this.filename.substring(lastDot).toLowerCase();
            } else {
              ext = "";
            }
            if (ext !== oldExt) {
              this.filename += oldExt;
            }
          }
          this.updateFilename({
            file: this.file,
            newFilename: this.filename,
          }).catch(() => {
            this.filename = this.file.filename;
          });
        }
      } else {
        setTimeout(() => {
          this.$refs.inputFilename.select();
        }, 30);
      }

      this.setEditFilename(!this.editFilename);
    },
    handleOpen() {
      window.open(this.$uploadSrc(this.file), "_blank");
    },

    handleDownload() {
      let files = this.files.length === 0 ? [this.directory] : this.files;
      this.download({ files });
    },
    humanFileSize(size) {
      return humanFileSize(size);
    },
  },
};
</script>

<style lang="scss" scoped>
.infos {
  overflow: auto;
  scrollbar-color: transparent transparent;
  &:hover {
    scrollbar-color: var(--grey200) transparent;
  }
}
.infos-row {
  /* 3px pour afficher les ombres de box-shadow malgré un overflow: auto */
  margin: 0.5rem 3px;
  display: flex;
  flex-direction: column;

  & > label {
    display: block;
    margin: 4px 0;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--grey);
  }
  & > input {
    display: block;
  }
  .help-text {
    color: var(--grey);
    font-size: 0.9rem;
  }
}

.mfm-input-button {
  display: flex;

  .mfm-input-text {
    width: 0;
    flex: 1 1 0px;
    border-radius: var(--form-border-radius) 0 0 var(--form-border-radius);
  }

  button {
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0 var(--form-border-radius) var(--form-border-radius) 0;
    box-shadow: none;
    height: auto;
  }
}

.mfm-button-group {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  button {
    font-size: 1.2rem;
    padding: 0.25rem;
    justify-content: center;
  }
}
.mfm-button,
.mfm-input-text,
.mfm-input-button button {
  height: 2rem;
  display: inline-flex;
  align-items: center;
}
.infos-row.filename {
  overflow: hidden;
}

.edit-filename {
  button {
    padding: 0;
    margin-left: 0.25rem;
  }
  /* 19px habituel plus bordure */
  height: 21px;
}
.div-filename {
  border: 1px solid transparent;
  cursor: pointer;
  text-overflow: ellipsis;
  word-wrap: break-word;
}
.rename {
  font-size: 0.8rem;
  color: var(--grey);
  &:hover {
    color: var(--grey700);
  }
}
@media (max-width: 799.99px) {
  .infos > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px;
  }

  .infos .infos-row {
    margin: 0;

    &.extra {
      grid-row: span 2;
    }
  }
  .div-filename {
    height: 21px;
    overflow: hidden;
  }
}
.mfm-button.border {
  border: 2px solid var(--primary-color);
  background-color: var(--primary-color100);
}
.info {
  border-radius: var(--form-border-radius);
  padding: 0.5rem;
  color: var(--red-text);
  font-size: 0.8rem;
  &.alert {
    background-color: var(--red50);
  }
}
</style>
