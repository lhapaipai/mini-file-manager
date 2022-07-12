<template>
  <div v-lazy-load class="image__wrapper">
    <img
      class="image__item"
      :data-type="file.type"
      :data-src="$uploadSrc(file, filter)"
      :height="$uploadHeight(file, filter)"
      :width="$uploadWidth(file, filter)"
      alt="random image"
    />
    <div class="image__actions">
      <a href="#" class="remove" @click.prevent="$emit('remove')"
        ><i class="famfm-trash"></i
      ></a>
      <a v-if="!multiple" href="#" class="browse" @click.prevent="$emit('browse')"
        ><i class="famfm-folder"></i
      ></a>
    </div>
  </div>
</template>

<script>
import ImageSpinner from "./ImageSpinner.vue";

export default {
  name: "ImageItem",
  components: {
    ImageSpinner,
  },
  props: {
    file: Object,
    filter: {
      type: String,
      required: true,
    },
  },
  emits: ["browse", "remove"],
};
</script>

<style lang="postcss" scoped>
.image {
  &__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;

    &.loaded {
      .image {
        &__item {
          visibility: visible;
          opacity: 1;
          border: 0;
        }
        &__actions {
          display: flex;
        }
      }
    }
  }
  &__actions {
    display: none;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: flex-end;
    transition: var(--transition-color);
    a {
      transition: all 0.2s;
      color: var(--gray);
      font-size: 1.3rem;
      padding: 0.5rem;
      &:hover {
        color: white;
      }
    }
  }
  &__item {
    width: 100%;
    border-radius: 4px;
    transition: all 0.4s ease-in-out;
    opacity: 0;
    visibility: hidden;
  }
}
</style>
