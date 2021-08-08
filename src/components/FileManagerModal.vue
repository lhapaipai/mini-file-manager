<template>
  <div class="file-manager-modal" v-scroll-lock:enabled>
    <div class="box">
      <FileManager
        class="main-content"
        :is-modal="true"
        @confirm="handleSelect"
      />
      <div class="actions">
        <button
          v-if="!editContent"
          class="btn outlined abort"
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
          class="btn"
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
          class="btn"
          @click="handleNext"
          :disabled="uneditableSelectedFiles.length > 0"
        >
          <span> {{ $t("continue") }}</span>
        </button>
        <button
          v-else-if="invalidSelectedFiles.length === 0"
          class="btn"
          @click="handleSelect"
          :disabled="invalidSelectedFiles.length > 0"
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
import ImageEditor from "./ImageEditor.vue";
import ValidationString from "./ValidationString.vue";

export default {
  components: {
    FileManager,
    ImageEditor,
    ValidationString,
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
      console.log("goEditor");
      this.setEditContent(this.invalidSelectedFiles[0]);
    },
    handleNext() {
      console.log("handleNext");
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

<style lang="scss" scoped>
@import "../css/variables.scss";

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
    box-shadow: 0 0 48px rgba(0, 0, 0, 0.075);
    border: 1px solid $lightGray;

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
    background-color: rgba(0, 0, 0, 0.2);
    z-index: -1;
  }
}
</style>
