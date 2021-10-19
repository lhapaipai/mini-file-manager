<template>
  <div v-scroll-lock:enabled class="file-manager-modal">
    <div class="box">
      <FileManager class="main-content" :is-modal="true" @confirm="handleSelect" />
      <div class="actions">
        <button
          v-if="!editContent"
          class="penta-button outlined abort"
          @click="handleAbort"
        >
          {{ $t("cancel") }}
        </button>
        <div class="sep"></div>
        <!-- <ValidationString v-if="fileValidation" /> -->
        <!-- la sélection n'est pas valide mais on peut éditer les fichiers pour la rendre valide -->
        <button
          v-if="
            invalidSelectedFiles.length > 0 &&
            !editContent &&
            uneditableSelectedFiles.length === 0
          "
          class="penta-button"
          @click="goEditor"
        >
          {{ $t("editAndSelect") }}
        </button>
        <!-- on est en train d'éditer un élément la sélection n'est toujours pas valide mais on
         peut éditer les fichiers pour la rendre valide -->
        <button
          v-else-if="
            invalidSelectedFiles.length > 0 &&
            invalidSelectedFiles[0] !== editContent &&
            uneditableSelectedFiles.length === 0
          "
          class="penta-button"
          :disabled="uneditableSelectedFiles.length > 0"
          @click="handleNext"
        >
          <span> {{ $t("continue") }}</span>
        </button>
        <button
          v-else-if="!editContent && invalidSelectedFiles.length === 0"
          class="penta-button"
          :disabled="invalidSelectedFiles.length > 0"
          @click="handleSelect"
        >
          <span>{{ $t("select") }}</span>
        </button>
      </div>
    </div>
    <div class="bg" @click="handleAbort"></div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import FileManager from "./FileManager.vue";

export default {
  components: {
    FileManager,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["selectedFiles", "fileValidation", "editContent"]),
    ...mapGetters(["invalidSelectedFiles", "uneditableSelectedFiles"]),
  },
  methods: {
    ...mapMutations(["setEditContent"]),
    handleAbort() {
      let event = new CustomEvent("abortSelect");
      this.$el.dispatchEvent(event);
    },
    // handleCrop() {},
    goEditor() {
      this.setEditContent(this.invalidSelectedFiles[0]);
    },
    handleNext() {
      this.setEditContent(this.invalidSelectedFiles[0]);
    },
    handleSelect() {
      if (this.invalidSelectedFiles.length === 0) {
        let event = new CustomEvent("selectFiles", {
          detail: this.selectedFiles,
        });
        this.$el.dispatchEvent(event);
      } else if (this.uneditableSelectedFiles.length === 0) {
        this.goEditor();
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.file-manager-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;

  .box {
    width: 90%;
    height: 90%;
    background-color: white;
    overflow: auto;
    box-shadow: var(--box-shadow);
    border: 1px solid var(--gray-light);

    display: flex;
    flex-direction: column;

    .main-content {
      flex: 1;
    }

    .actions {
      display: flex;
      padding: 0 10px 10px 10px;
      align-items: center;
      .abort {
        margin-left: 0;
      }
      .sep {
        margin-right: auto;
      }
      button {
        margin-left: 15px;
      }
    }

    .steps {
      display: flex;

      button {
        margin-right: 15px;
      }
    }

    @media (max-width: 800px) {
      width: 100%;
      height: 100%;
    }
  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--background-color);
    z-index: -1;
  }
}
</style>
