<template>
  <ImageEditor class="image-editor" v-if="editContent" :file="editContent" />
  <div v-else class="file-manager" @dragover="noDragging">
    <div class="action">
      <button class="btn btn-outlined" @click.prevent="toggleOrder()">
        <i class="fa-order-list" v-if="presentation === 'list'"></i>
        <i class="fa-order-icons" v-if="presentation === 'icons'"></i>
      </button>
      <button
        class="btn btn-outlined"
        :disabled="!canEdit"
        @click="handleAddDirectory"
      >
        <i class="fa-folder-add"></i>
      </button>
    </div>
    <Uploader class="dropzone" />
    <div class="hierarchy">
      <VSelect
        class="directory-selector"
        :split-button="true"
        :options="entryPoints"
        v-model="currentEntryPoint"
        @click="handleChangeSecondaryDirectory(0)"
        placeholder="Répertoire"
      />
      <button
        class="btn btn-outlined"
        @click="handleChangeSecondaryDirectory(key + 1)"
        v-for="(secondaryDirectory, key) in secondaryDirectories"
        :key="key"
      >
        {{ secondaryDirectory }}
      </button>
    </div>

    <div
      class="files-container"
      :class="{ [presentationClass]: true }"
      @click="unselectFiles"
    >
      <div class="files">
        <component
          v-for="file in sortedFiles"
          :key="file.id"
          :is="fileComponent"
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
import ListItem from "./ListItem.vue";
import Icon from "./Icon.vue";
import ImageEditor from "./ImageEditor.vue";

import { notify, prompt } from "mini-notifier";

export default {
  components: {
    Uploader,
    Infos,
    VSelect,
    Icon,
    ListItem,
    ImageEditor,
  },
  props: {
    isModal: {
      type: Boolean,
      default: false,
    },
  },
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
      "isAdmin",
      "selectedFiles",
      "editContent",
    ]),
    ...mapGetters(["sortedFiles"]),
    canEdit() {
      if (this.isAdmin) {
        return true;
      }
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
      return this.presentation === "list" ? ListItem : Icon;
    },
    presentationClass() {
      return `${this.presentation}-presentation`;
    },
  },

  methods: {
    ...mapMutations([
      "selectFile",
      "unselectFiles",
      "addFileToSelection",
      "removeFileToSelection",
    ]),
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
      if (e.keyCode === 46 && this.selectedFiles.length > 0 && !this.editing) {
        this.deleteSelectedFiles();
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
      // console.log(event, file, 'selectfile');
      // si on a un dbl click ne pas déselectionner l'image.
      if (event && event.detail === 2) {
        return;
      }

      let index = this.selectedFiles.indexOf(file);
      if (index === -1) {
        this.addFileToSelection(file);
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
        this.currentEntryPoint.directory + suffix
      );
    },
  },
  mounted() {
    this.init();
    window.addEventListener("keydown", this.handleKeyPressed);
  },
  unmounted() {
    window.removeEventListener("keydown", this.handleKeyPressed);
  },
};
</script>

<style lang="scss" scoped>
@import "../css/variables.scss";
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
  gap: 5px;

  grid-template-columns: 1fr 200px;
  grid-template-rows: 39px 39px 1fr 160px;
  grid-template-areas:
    "action    dropzone"
    "hierarchy hierarchy"
    "files     files"
    "infos     infos";
}
@media (min-width: 700px) {
  .file-manager {
    grid-template-columns: 105px 1fr 200px;
    grid-template-rows: 39px 100px 1fr;
    grid-template-areas:
      "action hierarchy dropzone"
      "files  files     dropzone"
      "files  files     infos";
    gap: 15px;
  }
}

.hierarchy {
  grid-area: hierarchy;
  display: flex;

  > * {
    margin-right: 10px;
    height: 38px;
    flex-shrink: 0;
    &:last-child {
      margin-right: 0;
    }
  }
  .directory-selector {
    width: 250px;
  }
}
.dropzone {
  grid-area: dropzone;
}
.action {
  grid-area: action;
  display: flex;
  flex-wrap: wrap;
  // overflow: hidden;

  @media (max-width: 699.99px) {
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

  .btn {
    padding: 0.5rem;
  }
}

.files-container {
  grid-area: files;
  overflow-x: hidden;
  overflow-y: visible;
  // border: 1px solid $extraLightGray;
  // border-radius: $borderRadius;
  user-select: none;
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
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  @media (min-width: 360px) {
    .files {
      grid-template-columns: repeat(auto-fill, minmax(154px, 1fr));
    }
  }

  @media (min-width: 750px) {
    .files {
      grid-template-columns: repeat(auto-fill, minmax(154px, 1fr));
    }
  }
}

.list-presentation {
  .files {
    margin: 0rem;
  }
}
</style>
