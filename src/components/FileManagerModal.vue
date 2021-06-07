<template>
  <div class="file-manager-modal">
    <div class="box">
      <FileManager
        class="main-content"
        v-body-scroll-lock:reserve-scroll-bar-gap="true"
        :is-modal="true"
        @confirm="handleConfirm"
      />
      <div class="actions">
        <button
          v-if="!editContent"
          class="btn outlined abort"
          @click="handleAbort"
        >
          Annuler
        </button>
        <div class="sep"></div>
        <button
          v-if="!editContent && invalidSelectedFiles.length > 0"
          class="btn"
          @click="goImageEditor"
        >
          <i class="fa-picture"></i> Éditer
          <!-- <i class="fa-wrench"></i>
          <i class="fa-picture"></i> -->
        </button>
        <button
          :disabled="
            invalidSelectedFiles.length > 0 || selectedFiles.length === 0
          "
          class="btn"
          @click="handleConfirm"
        >
          Sélectionner
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

import { validateFile } from "../utils.js";

export default {
  components: {
    FileManager,
    ImageEditor,
  },
  computed: {
    ...mapState(["selectedFiles", "fileValidation", "editContent"]),
    ...mapGetters(["invalidSelectedFiles"]),
  },
  methods: {
    ...mapMutations(["setEditContent"]),
    goImageEditor() {
      this.setEditContent(this.invalidSelectedFiles[0]);
    },
    handleAbort() {
      let event = new CustomEvent("abortSelect");
      this.$el.dispatchEvent(event);
    },
    // handleCrop() {},
    handleConfirm() {
      if (this.invalidSelectedFiles.length > 0) {
        console.error("il y a des règles de validation non satisfaites");
        return;
      }
      let event = new CustomEvent("selectFiles", {
        detail: this.selectedFiles,
      });
      this.$el.dispatchEvent(event);
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

    @media (max-width: 700px) {
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
