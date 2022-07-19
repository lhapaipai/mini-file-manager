<template>
  <a
    href="#"
    class="file"
    :class="{ 'is-temp': isTemp, 'is-selectable': !isTemp }"
    @click.prevent="!isTemp && $emit('click', $event)"
    @dblclick="!isTemp && $emit('dblclick', $event)"
  >
    <div class="square">
      <div
        class="img-container"
        :class="{
          'is-icon': isIcon(file),
          'is-not-icon': !isIcon(file),
        }"
      >
        <img
          :alt="file.filename"
          :src="$uploadSrc(file, 'small')"
          @dragstart="handleDragStart($event, file)"
        />
        <div v-if="file.uploadInfos" class="spinner">
          <Progression :value="file.uploadInfos.progression" />
        </div>
      </div>
    </div>
    <div class="filename">{{ file.label || file.filename }}</div>
  </a>
</template>

<script>
import Progression from "../Progression.vue";

export default {
  components: {
    Progression,
  },
  props: {
    file: Object,
  },
  emits: ["click", "dblclick"],
  computed: {
    isTemp() {
      return this.file.type === "temp-file";
    },
  },
  methods: {
    isIcon(file) {
      if (file.filters?.small) {
        return false;
      } else {
        return true;
      }
    },
    handleDragStart(e, file) {
      if (file.type === "file") {
        let url = this.$uploadSrc(file);
        e.dataTransfer.setData("text/html", `<img src="${url}">`);
        e.dataTransfer.setData("text/plain", url);
        e.dataTransfer.setData("application/x-editor-js", url);
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.file {
  text-decoration: none;
  cursor: pointer;
  margin: 0 auto;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: 0;

  color: var(--grey);
  transition: var(--transition-color);

  .square {
    position: relative;
    padding-top: 100%;
    width: 100%;

    .img-container {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      img {
        transition: var(--transition-opacity);
      }

      &.is-not-icon {
        padding: 8%;
        img {
          border-radius: 8px;
          max-height: 100%;
          max-width: 100%;
        }
      }
      &.is-icon {
        padding: 8%;
        img {
          border-radius: 20px;
          height: 100%;
          width: auto;
        }
      }

      .spinner {
        position: absolute;
        bottom: 15%;
        width: 30px;
        height: 30px;
        left: calc(50% - 15px);
        z-index: 2;
      }
    }
  }

  &.is-temp img {
    opacity: 0.5;
  }

  .filename {
    font-size: 0.8rem;
    text-align: center;
    text-overflow: ellipsis;
    overflow-wrap: anywhere;
    padding: 4px 6px;
    overflow: hidden;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &.is-selectable {
    &:hover,
    &:active {
      color: var(--grey700);
      img {
        opacity: 0.8;
      }
    }

    &:active,
    &.selected {
      color: var(--primary-color-text);

      img {
        box-shadow: 0 0 0 4px var(--primary-color), 0 3px 3px 2px rgba(74, 47, 47, 0.15),
          0 3px 7px 4px rgba(0, 0, 0, 0.15);
      }
      .filename {
        background-color: var(--primary-color);
      }
    }
  }

  .with-a11y &.is-selectable:focus {
    box-shadow: 0 0 0 2px #fff, 0 0 0 4px #eac800;
    border-radius: 0.25rem;
  }
}
</style>
