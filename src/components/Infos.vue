<template>
  <div class="infos" v-if="directory">
    <div v-if="files.length === 0">
      <div class="form-group">
        <label>{{ $t("directoryName") }}</label>
        <div>{{ directory.filename }}</div>
      </div>
      <div class="form-group">
        <label>{{ $t("access") }}</label>
        <div v-if="currentEntryPoint.readOnly">
          <div>{{ $t("readonly") }}</div>
        </div>
        <div v-else>
          <div>{{ $t("editable") }}</div>
        </div>
      </div>
      <div class="form-group">
        <label>{{ $t("downloadAll") }}</label>
        <div class="btns">
          <button class="btn" @click.prevent="handleDownload">
            <i class="fa-download"></i>
          </button>
        </div>
      </div>
    </div>
    <div v-else-if="files.length === 1">
      <form @submit.prevent="editFilename" class="form-group filename">
        <label>{{ $t("name") }}</label>
        <div v-if="!canEdit(file)">
          <div>{{ file.filename }}</div>
        </div>
        <div v-else class="input-with-button">
          <input
            size="1"
            class="form-input"
            ref="inputFilename"
            type="text"
            :disabled="!editing"
            v-model="filename"
          />
          <a
            href="#"
            @click.prevent="editFilename"
            class="btn outlined btn-factice"
          >
            <i v-if="editing" class="fa-ok"></i>
            <i v-else class="fa-pencil"></i>
          </a>
        </div>
      </form>
      <div class="form-group" v-if="file.url">
        <label>{{ $t("url") }}</label>
        <div class="input-with-button">
          <input
            size="1"
            class="form-input"
            ref="inputUrl"
            @focus="$event.target.select()"
            type="text"
            readOnly
            :value="file.url"
          />
          <a
            href="#"
            @click.prevent="copyToClipboard"
            class="btn outlined btn-factice"
          >
            <i class="fa-clipboard"></i>
          </a>
        </div>
      </div>
      <div class="form-group">
        <label>{{ $t("createdAt") }}</label>
        <div>{{ formatDate(file.createdAt) }}</div>
      </div>
      <div class="form-group">
        <label>{{ $t("infos") }}</label>
        <template v-if="file.mimeGroup === 'image' && file.details">
          <div>
            <i class="fa-picture"></i> {{ file.details.width }},
            {{ file.details.height }} {{ $t("px") }}
          </div>
          <div>
            <i class="fa-ratio"></i> {{ formatRatio(file.details.ratio) }}
          </div>
        </template>
        <div><i class="fa-gauge"></i> {{ file.humanSize }}</div>
      </div>
      <div class="form-group btns">
        <button
          v-if="file && !file.isDir"
          class="btn btn-outlined"
          @click.prevent="handleOpen"
        >
          <i class="fa-eye"></i>
        </button>
        <button
          v-if="canEditContent(file)"
          class="btn"
          @click.prevent="editContent"
        >
          <i class="fa-edit-image"></i>
        </button>
        <button class="btn" @click.prevent="handleDownload">
          <i class="fa-download"></i>
        </button>
        <button
          v-if="canEdit(file)"
          class="btn btn-outlined"
          @click.prevent="deleteSelectedFiles"
        >
          <i class="fa-trash"></i>
        </button>
      </div>
    </div>
    <div v-else-if="files.length > 1">
      {{ files.length }} {{ $t("selectedFiles") }}
    </div>
  </div>
</template>

<script>
import { notify } from "mini-notifier";
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  props: ["files"],
  data: () => ({
    filename: "",
    ext: "",
  }),
  computed: {
    ...mapState([
      "directory",
      "editing",
      "isAdmin",
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
      console.log("file change");
    },
    files(val) {
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
      if (this.isAdmin) {
        return true;
      }
      if (this.currentEntryPoint.readOnly) {
        return false;
      }
      return !file.readOnly;
    },
    canEditContent(file) {
      return !!file.details;
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
          "_blank"
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

<style lang="scss" scoped>
@import "../css/variables.scss";

.infos {
  overflow: auto;
  .form-group {
    margin: 0 0 0.5rem;
  }
}

.btns {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr 1fr 1fr;

  button {
    font-size: 1.2rem;
    padding: 0.25rem;
  }
}
.form-group.filename {
  overflow: hidden;
}

.edit-filename {
  button {
    padding: 0;
    margin-left: 0.25rem;
  }
  // 19px habituel plus bordure
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
  color: $gray;
  &:hover {
    color: $grayDark;
  }
}
@media (max-width: 799.99px) {
  .infos > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px;
  }

  .infos .form-group {
    margin: 0;
  }
  .div-filename {
    height: 21px;
    overflow: hidden;
  }
}
</style>
