<template>
  <ImageEditor v-if="editContent" class="image-editor" :file="editContent" />
  <div v-else class="file-manager">
    <div class="action">
      <button class="penta-button outlined" @click.prevent="toggleOrder()">
        <i v-if="presentation === 'list'" class="fa-order-list"></i>
        <i v-if="presentation === 'icons'" class="fa-order-icons"></i>
      </button>
      <button
        class="penta-button outlined"
        :disabled="!canEdit"
        @click="handleAddDirectory"
      >
        <i class="fa-folder-add"></i>
      </button>
    </div>
    <Uploader class="dropzone" />
    <div class="hierarchy">
      <VSelect
        v-model="currentEntryPoint"
        class="directory-selector"
        :split-button="true"
        :options="entryPoints"
        placeholder="Répertoire"
        @click="handleChangeSecondaryDirectory(0)"
      />
      <div class="sub-directories">
        <button
          v-for="(secondaryDirectory, key) in secondaryDirectories"
          :key="key"
          class="penta-button outlined"
          @click="handleChangeSecondaryDirectory(key + 1)"
        >
          {{ secondaryDirectory }}
        </button>
      </div>
    </div>

    <div
      class="files-container"
      :class="{ [presentationClass]: true }"
      @click="clearSelection"
    >
      <div class="files">
        <component
          :is="fileComponent"
          v-for="file in sortedFiles"
          :key="file.id"
          class="file"
          :file="file"
          :class="{ selected: isSelected(file) }"
          @click.stop="handleClick(file, $event)"
          @dblclick.stop="handleDblClick(file)"
        ></component>
      </div>
    </div>
    <Infos class="infos" :files="selectedFiles" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

import Uploader from "./Uploader.vue";
import Infos from "./Infos.vue";
import VSelect from "./VSelect.vue";

import RowItem from "./items/RowItem.vue";
import IconItem from "./items/IconItem.vue";

import ImageEditor from "./ImageEditor.vue";

import { notify, prompt } from "mini-notifier";

export default {
  components: {
    Uploader,
    Infos,
    VSelect,
    IconItem,
    RowItem,
    ImageEditor,
  },
  props: {
    isModal: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["confirm"],
  data() {
    return {
      presentation: "icons",
      options: {},
      // on empêche de supprimer avec la touche de clavier delete lorsqu'on est en train d'éditer
      // le nom d'un fichier.
    };
  },
  computed: {
    ...mapState([
      "editing",
      "files",
      "entryPoints",
      "secondaryDirectories",
      "currentEntryPoint",
      "selectedFiles",
      "editContent",
      "multiple",
    ]),
    ...mapGetters(["sortedFiles"]),
    canEdit() {
      return this.currentEntryPoint && !this.currentEntryPoint.readOnly;
    },
    currentEntryPoint: {
      get() {
        return this.$store.state.currentEntryPoint;
      },
      set(entryPoint) {
        this.$store.dispatch("setCurrentEntryPoint", entryPoint);
      },
    },
    fileComponent() {
      return this.presentation === "list" ? RowItem : IconItem;
    },
    presentationClass() {
      return `${this.presentation}-presentation`;
    },
  },
  mounted() {
    this.init();
    window.addEventListener("keydown", this.handleKeyPressed);
  },
  unmounted() {
    window.removeEventListener("keydown", this.handleKeyPressed);
  },
  methods: {
    ...mapMutations(["clearSelection", "addFileToSelection", "removeFileToSelection"]),
    ...mapActions([
      "init",
      "setCurrentEntryPoint",
      "download",
      "deleteSelectedFiles",
      "setSecondaryDirectoryFromFullDirectory",
      "addDirectory",
    ]),
    toggleOrder() {
      this.presentation = this.presentation === "list" ? "icons" : "list";
    },
    noDragging(e) {
      e.dataTransfer.dropEffect = "none";
    },
    isSelected(file) {
      return this.selectedFiles.includes(file);
    },
    handleKeyPressed(e) {
      if (this.editing) {
        return;
      }

      if (e.key === "Delete" && this.selectedFiles.length > 0) {
        this.deleteSelectedFiles();
      }
      if (this.selectedFiles.length > 0) {
        let filePos = this.sortedFiles.findIndex(
          (f) => f.id === this.selectedFiles[0].id,
        );

        if (e.key === "ArrowLeft" && filePos > 0) {
          let prevFile = this.sortedFiles[filePos - 1];

          this.clearSelection();
          this.addFileToSelection(prevFile);
        }
        if (e.key === "ArrowRight" && filePos < this.sortedFiles.length - 1) {
          let nextFile = this.sortedFiles[filePos + 1];

          this.clearSelection();
          this.addFileToSelection(nextFile);
        }
      }
    },
    handleAddDirectory() {
      let that = this;
      prompt("Nom du dossier", {
        okHandler: function (newDirectoryName) {
          if (newDirectoryName.length > 128) {
            notify("Le nom du dossier est trop long.", {
              style: "error",
            });
          } else {
            that.addDirectory(newDirectoryName);
          }
        },
      });
    },
    handleClick(file, event) {
      // console.log(event, file, "selectfile");
      // si on a un dbl click ne pas déselectionner l'image.
      if (event && event.detail === 2) {
        return;
      }

      let index = this.selectedFiles.indexOf(file);

      if (!this.multiple) {
        // s'il n'est pas déja présent, l'ajouter
        if (index === -1) {
          this.clearSelection();
          this.addFileToSelection(file);
        }
      } else {
        if (!event.ctrlKey && !event.shiftKey) {
          // il n'est pas encore sélectionné on remplace la sélection
          // par ce fichier

          // il est déjà sélectionné peut-être que la sélection est multiple
          // dans ce cas il faut retirer les autres fichiers de la sélection

          // c'est donc la même chose
          this.clearSelection();
          this.addFileToSelection(file);
        } else {
          if (index === -1) {
            // il n'est pas encore sélectionné on l'ajoute à la sélection
            this.addFileToSelection(file);
          } else {
            // il est déjà sélectionné on le retire de la sélection
            this.removeFileToSelection(file);
          }
        }
      }
    },
    handleDblClick(file) {
      switch (file.type) {
        case "file":
          if (this.isModal) {
            this.$emit("confirm");
          } else {
            this.download({ files: [file] });
          }
          break;
        case "dir":
          this.setSecondaryDirectoryFromFullDirectory(file.uploadRelativePath);
          break;
      }
    },
    handleChangeSecondaryDirectory(key) {
      let arrSuffix = [];
      for (let i = 0; i < key; i++) {
        arrSuffix.push(this.secondaryDirectories[i]);
      }
      let suffix = arrSuffix.join("/");
      if (suffix !== "") {
        suffix = "/" + suffix;
      }
      this.setSecondaryDirectoryFromFullDirectory(
        this.currentEntryPoint.directory + suffix,
      );
    },
  },
};
</script>

<style lang="postcss" scoped>
* {
  box-sizing: border-box;
}
.image-editor {
  padding: 10px;
}
.file-manager {
  overflow: hidden;
  padding: 10px;
  display: grid;
  gap: 10px;

  grid-template-columns: 92px 1fr;
  grid-template-rows: 40px 40px 1fr 158px;
  grid-template-areas:
    "action    dropzone"
    "hierarchy hierarchy"
    "files     files"
    "infos     infos";
}
@media (min-width: 800px) {
  .file-manager {
    grid-template-columns: 92px 1fr 200px;
    grid-template-rows: 42px 100px 1fr;
    grid-template-areas:
      "action hierarchy dropzone"
      "files  files     dropzone"
      "files  files     infos";
    gap: 10px;
  }
}

.hierarchy {
  grid-area: hierarchy;
  display: flex;

  .directory-selector {
    width: 250px;
    height: 38px;
    margin-right: 10px;
  }
  .sub-directories {
    overflow-x: auto;
    width: 0;
    flex: 1;
    display: flex;
    & > * {
      margin-right: 10px;
      height: 38px;
      flex-shrink: 0;
      &:last-child {
        margin-right: 0px;
      }
    }
  }
}
.dropzone {
  grid-area: dropzone;
}
.action {
  grid-area: action;
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 799.99px) {
    .hierarchy {
      margin-top: 10px;
      width: 100%;
      order: 2;
      margin-right: 0;
      > * {
        margin-bottom: 10px;
      }
    }
  }

  > * {
    margin-right: 10px;
    height: 38px;
    flex-shrink: 0;
    &:last-child {
      margin-right: 0;
    }
  }

  .penta-button {
    padding: 0.5rem;
  }
}

.files-container {
  grid-area: files;
  overflow-x: hidden;
  overflow-y: visible;

  @media (max-width: 799.9px) {
    border-bottom: 1px solid var(--gray-light);
    border-top: 1px solid var(--gray-light);
  }
  user-select: none;

  scrollbar-color: transparent transparent;
  &:hover {
    scrollbar-color: var(--gray-light) transparent;
  }
}

.infos {
  grid-area: infos;

  button {
    margin-left: 15px;
  }
}

.icons-presentation {
  .files {
    margin: 0.5rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
    gap: 15px;
  }

  @media (min-width: 600px) {
    .files {
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    }
  }
}

.list-presentation {
  .files {
    margin: 0rem;
  }
}
</style>
