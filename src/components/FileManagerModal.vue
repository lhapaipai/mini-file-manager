<template>
  <div class="file-manager-modal">
    <div class="box">
      <FileManager
        class="file-manager"
        v-body-scroll-lock:reserve-scroll-bar-gap="true"
        :is-modal="true"
        @confirm="handleConfirm"
      />
      <div class="actions">
        <button class="btn btn-outlined" @click="handleAbort">Annuler</button>
        <button class="btn" @click="handleConfirm">Sélectionner</button>
      </div>
    </div>
    <div class="bg" @click="handleAbort"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import FileManager from "./FileManager.vue";

export default {
  components: {
    FileManager,
  },
  computed: {
    ...mapState(["selectedFiles"]),
  },
  methods: {
    handleAbort() {
      let event = new CustomEvent("abortSelect");
      this.$el.dispatchEvent(event);
    },
    handleConfirm() {
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
    padding: 10px;
    box-shadow: 0 0 48px rgba(0, 0, 0, 0.075);
    border: 1px solid $lightGray;

    display: flex;
    flex-direction: column;

    .file-manager {
      flex: 1;
    }

    .actions {
      display: flex;
      justify-content: flex-end;

      button {
        margin-left: 15px;
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
