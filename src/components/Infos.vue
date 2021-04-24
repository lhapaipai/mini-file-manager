<template>
  <div class="infos" v-if="directory">
    <div v-if="files.length === 0">
      <div class="form-group">
        <label>Nom du dossier</label>
        <div>{{ directory.filename }}</div>
      </div>
      <div class="form-group">
        <label>Accès</label>
        <div v-if="currentEntryPoint.url">
          <div>Public</div>
        </div>
        <div v-else>
          <div>Protégé</div>
        </div>
      </div>
      <div class="form-group">
        <label>Télécharger tout le dossier</label>
        <button class="btn" @click.prevent="handleDownload">
          <i class="fa-download"></i>
        </button>
      </div>
    </div>
    <div v-else-if="files.length === 1">
      <form @submit.prevent="editFilename" class="form-group filename">
        <label for="name">
          Nom
          <button
            v-if="canEdit(file)"
            href="#"
            class="with-icon btn-factice"
            @click.prevent="editFilename"
          >
            <i v-if="editing" class="fa-ok"></i>
            <i v-else class="fa-pencil"></i>
          </button>
        </label>
        <div v-if="!canEdit(file)">
          <div>{{ file.filename }}</div>
        </div>
        <div v-else>
          <div v-if="editing" class="input-with-button edit-filename">
            <input
              type="text"
              size="1"
              class="input-filename"
              ref="inputFilename"
              v-model="filename"
            />
            <span>{{ ext }}</span>
          </div>
          <div v-else class="div-filename" @click.prevent="editFilename">
            {{ file.filename }}
          </div>
        </div>
      </form>
      <div class="form-group compact">
        <label>Accès</label>
        <div v-if="canEdit(file)">Lecture et modification</div>
        <div v-else>Lecture seule</div>
      </div>
      <div class="form-group compact">
        <label>Ajouté le</label>
        <div>{{ formatDate(file.createdAt) }}</div>
      </div>
      <div class="form-group compact">
        <label>Taille</label>
        <div>{{ file.humanSize }}</div>
      </div>
      <div class="form-group compact" v-if="file.url">
        <label>URL</label>
        <div class="file-url input-with-button">
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
      <div class="form-group btns">
        <button
          v-if="canEdit(file)"
          class="btn btn-outlined"
          @click.prevent="deleteSelectedFiles"
        >
          <i class="fa-trash"></i>
        </button>
        <button
          v-if="file && !file.isDir"
          class="btn btn-outlined"
          @click.prevent="handleOpen"
        >
          <i class="fa-eye"></i>
        </button>
        <button class="btn" @click.prevent="handleDownload">
          <i class="fa-download"></i>
        </button>
      </div>
    </div>
    <div v-else-if="files.length > 1">
      {{ files.length }} éléments sélectionnés
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
    ext: ""
  }),
  computed: {
    ...mapState([
      "urlUploadFile",
      "directory",
      "editing",
      "isAdmin",
      "currentEntryPoint",
      "endPoints",
      "secondaryDirectories"
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
    }
  },
  watch: {
    files(val) {
      if (val.length === 1) {
        let completeName = val[0].filename;
        let extPos = completeName.lastIndexOf(".");
        if (extPos === -1) {
          this.filename = completeName;
          this.ext = "";
        } else {
          this.filename = completeName.substring(0, extPos);
          this.ext = completeName.substring(extPos);
        }
      }
    }
  },
  methods: {
    ...mapActions(["updateFilename", "download", "deleteSelectedFiles"]),
    ...mapMutations(["setEditing"]),
    formatDate(strDate) {
      let date = new Date(strDate);
      if (!(date instanceof Date) || isNaN(date)) {
        return "";
      }
      return new Intl.DateTimeFormat("fr-FR").format(date);
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
    copyToClipboard() {
      let input = this.$refs.inputUrl;
      input.select();
      document.execCommand("copy");
      notify("URL copiée");
    },
    editFilename() {
      let completeName = this.filename + this.ext;
      if (this.editing) {
        if (!this.filename || this.filename[0] === ".") {
          notify("Nom de fichier non valide.", {
            style: "error"
          });
        } else if (completeName !== this.file.filename) {
          this.updateFilename({
            file: this.file,
            filename: completeName
          });
        }
      } else {
        setTimeout(() => {
          this.$refs.inputFilename.select();
        }, 100);
      }

      this.setEditing(!this.editing);
    },
    handleOpen() {
      if (this.file.url) {
        window.open(this.file.url, "_blank");
      } else {
        window.open(
          `${window.location.origin}${this.endPoints.showFile}/show/${this.file.origin}/${this.file.uploadRelativePath}`,
          "_blank"
        );
      }
    },

    handleDownload() {
      let files = this.files.length === 0 ? [this.directory] : this.files;
      this.download({ files });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../variables.scss";

.infos {
  overflow: auto;
  .form-group {
    margin: 0 0 1rem;
  }
}

.btns {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr 1fr;

  button {
    padding: 0;
  }
}
.form-group.filename {
  overflow: hidden;
}

.file-url {
  input {
    padding: 0 0.5rem;
  }
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
@media (max-width: 699.99px) {
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

// .form-group.compact {
//   flex-direction: row;
// }
</style>
