<template>
  <div class="square">
    <div v-lazy-load class="image-wrapper">
      <div class="actions-container">
        <img
          :data-type="file.type"
          :data-src="$uploadSrc(file, filter, backendOrigin)"
          :height="$uploadHeight(file, filter)"
          :width="$uploadWidth(file, filter)"
          alt="random image"
          @error="handleError"
        />
        <div class="actions">
          <a href="#" class="remove" @click.prevent="$emit('remove')"
            ><i class="famfm-trash"></i
          ></a>
          <a v-if="!multiple" href="#" class="browse" @click.prevent="$emit('browse')"
            ><i class="famfm-folder"></i
          ></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { confirm } from "mini-notifier";
import { mapState } from "vuex";

export default {
  name: "ImageItem",
  props: {
    file: Object,
    filter: {
      type: String,
      required: true,
    },
  },
  emits: ["browse", "remove"],
  computed: {
    ...mapState(["backendOrigin", "multiple"]),
  },
  methods: {
    handleError() {
      console.log("erreur chargement image");
      confirm(this.$t("errorFilePath"), {
        okHandler: () => {
          this.$emit("remove");
        },
      });
    },
  },
};
</script>

<style lang="postcss" scoped>
.square {
  position: relative;
  padding-top: 100%;
  width: 100%;
}
.actions-container {
  position: relative;
}

.image-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  height: 100%;
  width: 100%;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  &.loaded {
    img {
      visibility: visible;
      opacity: 1;
      border: 0;

      display: block;
      max-width: 100%;
      height: auto;
      max-height: 100%;
      width: auto;
    }
    .actions {
      display: flex;
    }
  }
}

.actions {
  display: none;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: flex-end;
  transition: var(--transition-color);
  border-radius: 0 0 4px 4px;

  a {
    transition: all 0.2s;
    color: var(--grey);
    font-size: 1.3rem;
    padding: 0.5rem;
    &:hover {
      color: white;
    }
  }
}
img {
  width: 100%;
  border-radius: 4px;
  transition: all 0.4s ease-in-out;
  opacity: 0;
  visibility: hidden;
}
</style>
