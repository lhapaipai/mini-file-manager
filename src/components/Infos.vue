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
        <div class="penta-button-group">
          <button class="penta-button outlined" @click.prevent="handleDownload">
            <i class="fa-download"></i>
          </button>
        </div>
      </div>
    </div>
    <div v-else-if="files.length === 1">
      <form class="infos-row filename" @submit.prevent="editFilename">
        <label>{{ $t("name") }}</label>
        <div v-if="!canEdit(file)">
          <div>{{ file.filename }}</div>
        </div>
        <div v-else class="penta-input-button">
          <input
            ref="inputFilename"
            v-model="filename"
            size="1"
            class="penta-input-text"
            type="text"
            :disabled="!editing"
          />
          <a
            href="#"
            class="penta-button outlined penta-icon"
            @click.prevent="editFilename"
          >
            <i v-if="editing" class="fa-ok"></i>
            <i v-else class="fa-pencil"></i>
          </a>
        </div>
      </form>
      <div v-if="file.url" class="infos-row url">
        <label>{{ $t("url") }}</label>
        <div class="penta-input-button">
          <input
            ref="inputUrl"
            size="1"
            class="penta-input-text"
            type="text"
            readOnly
            :value="file.url"
            @focus="$event.target.select()"
          />
          <a
            href="#"
            class="penta-button outlined penta-icon"
            @click.prevent="copyToClipboard"
          >
            <i class="fa-clipboard"></i>
          </a>
        </div>
      </div>
      <div class="infos-row created-at">
        <label>{{ $t("createdAt") }}</label>
        <div>{{ formatDate(file.createdAt) }}</div>
      </div>
      <div class="infos-row extra">
        <label>{{ $t("infos") }}</label>
        <template v-if="file.mimeGroup === 'image' && file.details">
          <div>
            <i class="fa-picture"></i> {{ file.details.width }},
            {{ file.details.height }} {{ $t("px") }}
          </div>
          <div><i class="fa-ratio"></i> {{ formatRatio(file.details.ratio) }}</div>
        </template>
        <div><i class="fa-gauge"></i> {{ file.humanSize }}</div>
      </div>
      <div class="infos-row penta-button-group">
        <button
          v-if="file && !file.isDir"
          class="penta-button outlined"
          @click.prevent="handleOpen"
        >
          <i class="fa-eye"></i>
        </button>
        <button
          v-if="canEditContent(file)"
          class="penta-button outlined"
          @click.prevent="editContent"
        >
          <i class="fa-edit-image"></i>
        </button>
        <button class="penta-button outlined" @click.prevent="handleDownload">
          <i class="fa-download"></i>
        </button>
        <button
          v-if="canEdit(file)"
          class="penta-button outlined"
          @click.prevent="deleteSelectedFiles"
        >
          <i class="fa-trash"></i>
        </button>
      </div>
    </div>
    <div v-else-if="files.length > 1">{{ files.length }} {{ $t("selectedFiles") }}</div>
  </div>
</template>

<script>
import { notify } from "mini-notifier";
import { mapActions, mapMutations, mapState } from "vuex";

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
      "editing",
      "currentEntryPoint",
      "endPoints",
      "secondaryDirectories",
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
  },
  watch: {
    file() {
      this.filename = this.file?.filename;
    },
    files() {
      // if (val.length === 1) {
      //   let completeName = val[0].filename;
      //   let extPos = completeName.lastIndexOf(".");
      //   if (extPos === -1) {
      //     this.filename = completeName;
      //     this.ext = "";
      //   } else {
      //     this.filename = completeName.substring(0, extPos);
      //     this.ext = completeName.substring(extPos);
      //   }
      // }
    },
  },
  methods: {
    ...mapActions(["updateFilename", "download", "deleteSelectedFiles"]),
    ...mapMutations(["setEditing", "setEditContent"]),
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
      return !this.currentEntryPoint.readOnly && !!file.details;
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
    editFilename() {
      if (this.editing) {
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

      this.setEditing(!this.editing);
    },
    handleOpen() {
      if (this.file.url) {
        window.open(this.file.url, "_blank");
      } else {
        window.open(
          `${window.location.origin}${this.endPoints.getFileContent}/show/${this.file.origin}/${this.file.uploadRelativePath}`,
          "_blank",
        );
      }
    },

    handleDownload() {
      let files = this.files.length === 0 ? [this.directory] : this.files;
      this.download({ files });
    },
  },
};
</script>

<style lang="postcss" scoped>
.infos {
  overflow: auto;
  scrollbar-color: transparent transparent;
  &:hover {
    scrollbar-color: var(--gray-light) transparent;
  }
}
.infos-row {
  /* 3px pour afficher les ombres de box-shadow malgré un overflow: auto */
  margin: 1.5rem 3px;
  display: flex;
  flex-direction: column;

  & > label {
    display: block;
    margin: 4px 0;
    font-size: 0.9rem;
    font-weight: bold;
  }
  & > input {
    display: block;
  }
  .help-text {
    color: $gray;
    font-size: 0.9rem;
  }
}

.penta-input-button {
  display: flex;

  input {
    width: 0;
    flex: 1 1 0px;
    border-radius: var(--form-border-radius) 0 0 var(--form-border-radius);
  }

  .penta-button {
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0 var(--form-border-radius) var(--form-border-radius) 0;
    border-left-width: 0;
    box-shadow: none;
  }
}

.penta-button-group {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  button {
    font-size: 1.2rem;
    padding: 0.25rem;
  }
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
  color: var(--gray);
  &:hover {
    color: var(--gray-dark);
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
</style>
