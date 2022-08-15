<template>
  <div
    v-scroll-lock:enabled
    class="mini-file-manager-modal"
    :class="{ 'with-css-vars': injectCssVars }"
  >
    <div class="box">
      <FileManager class="main-content" :is-modal="true" @confirm="handleSelect" />
      <div v-if="!editContent" class="actions">
        <button :class="`${themePrefix}-button outlined abort`" @click="handleAbort">
          {{ $t("cancel") }}
        </button>
        <div class="sep"></div>
        <div v-if="selectedFiles.length > 0">
          <button
            v-if="selectedFiles.length > 0"
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

export default {
  components: {
    FileManager,
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
    ]),
    ...mapGetters(["invalidSelectedFiles"]),
  },
  methods: {
    ...mapMutations(["setEditContent"]),
    handleAbort() {
      this.$emit("abortSelect");
      let event = new CustomEvent("abortSelect");
      this.$el.dispatchEvent(event);
    },
    handleSelect() {
      if (this.invalidSelectedFiles.length > 0) {
        return;
      }

      this.setEditContent(null);
      this.$emit("selectFiles", this.selectedFiles);
      let event = new CustomEvent("selectFiles", {
        detail: this.selectedFiles,
      });
      this.$el.dispatchEvent(event);
    },
  },
};
</script>

<style lang="scss">
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
}
</style>
