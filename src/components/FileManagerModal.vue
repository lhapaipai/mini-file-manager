<template>
  <div
    v-scroll-lock:enabled
    class="mini-file-manager-modal"
    :class="{ 'with-css-vars': injectCssVars }"
  >
    <div class="box">
      <FileManager class="main-content" :is-modal="true" @confirm="handleSelect" />
      <div class="actions">
        <button
          v-if="!editContent"
          :class="`${themePrefix}-button outlined abort`"
          @click="handleAbort"
        >
          {{ $t("cancel") }}
        </button>
        <div
          class="validation-string-container"
          :class="{
            'is-invalid':
              invalidSelectedFiles.length !== 0 && selectedFiles[0].type !== 'dir',
          }"
        >
          <ValidationString v-if="fileValidation" />
        </div>
        <div class="sep"></div>
        <div v-if="selectedFiles.length > 0">
          <!-- la sélection n'est pas valide mais on peut éditer les fichiers pour la rendre valide -->
          <button
            v-if="
              invalidSelectedFiles.length > 0 &&
              fileValidation.mimeGroup === 'image' &&
              !editContent &&
              uneditableSelectedFiles.length === 0
            "
            :class="`${themePrefix}-button`"
            @click="goEditor"
          >
            {{ $t("editAndSelect") }}
          </button>
          <!-- on est en train d'éditer un élément la sélection n'est toujours pas valide mais on
         peut éditer les fichiers pour la rendre valide -->
          <button
            v-else-if="
              invalidSelectedFiles.length > 0 &&
              fileValidation.mimeGroup === 'image' &&
              invalidSelectedFiles[0] !== editContent &&
              uneditableSelectedFiles.length === 0
            "
            :class="`${themePrefix}-button`"
            :disabled="uneditableSelectedFiles.length > 0"
            @click="handleNext"
          >
            <span> {{ $t("continue") }}</span>
          </button>
          <button
            v-else-if="
              (editAndSelect || !editContent) && invalidSelectedFiles.length === 0
            "
            :class="`${themePrefix}-button primary-color`"
            :disabled="invalidSelectedFiles.length > 0"
            @click="handleSelect"
          >
            <span>{{ $t("select") }}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="bg" @click="handleAbort"></div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import FileManager from "./FileManager.vue";
import ValidationString from "./ValidationString.vue";

export default {
  components: {
    FileManager,
    ValidationString,
  },
  emits: ["selectFiles", "abortSelect"],
  data() {
    return {};
  },
  computed: {
    ...mapState([
      "selectedFiles",
      "fileValidation",
      "editContent",
      "themePrefix",
      "injectCssVars",
      "editAndSelect",
    ]),
    ...mapGetters(["invalidSelectedFiles", "uneditableSelectedFiles"]),
  },
  methods: {
    ...mapMutations(["setEditContent", "setEditAndSelect"]),
    handleAbort() {
      this.$emit("abortSelect");
      let event = new CustomEvent("abortSelect");
      this.$el.dispatchEvent(event);
    },
    // handleCrop() {},
    goEditor() {
      this.setEditAndSelect(true);
      this.setEditContent(this.invalidSelectedFiles[0]);
    },
    handleNext() {
      this.setEditContent(this.invalidSelectedFiles[0]);
    },
    handleSelect() {
      if (this.invalidSelectedFiles.length === 0) {
        this.setEditContent(null);
        this.$emit("selectFiles", this.selectedFiles);
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

<style lang="postcss">
.mini-file-manager-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
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
    border: 1px solid var(--grey200);

    display: flex;
    flex-direction: column;
    position: relative;

    .main-content {
      flex: 1;
    }

    .actions {
      display: flex;
      padding: 0 10px 10px 10px;
      align-items: center;
      .abort {
        margin-left: 0;
        margin-right: 10px;
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

  .validation-string-container {
    padding: 0 1rem;
    font-size: 1rem;
    border-radius: var(--form-border-radius);
    border: var(--form-border-width) solid transparent;
    display: inline-block;
    &.is-invalid {
      background-color: var(--red50);
    }
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: var(--input-height);
  }
}
</style>
