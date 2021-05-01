<template>
  <a
    href="#"
    class="file"
    @click.prevent="$emit('click', $event)"
    @dblclick="$emit('dblclick', $event)"
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
          @dragstart="handleDragStart($event, file)"
          :alt="file.filename"
          :src="iconPath(file)"
        />
      </div>
    </div>
    <div class="filename">{{ file.label || file.filename }}</div>
  </a>
</template>

<script>
export default {
  props: ["file"],
  computed: {},
  methods: {
    iconPath(file) {
      if (file.thumbnails?.small) {
        return file.thumbnails.small;
      } else {
        return file.icon;
      }
    },
    isIcon(file) {
      if (file.thumbnails?.small) {
        return false;
      } else {
        return true;
      }
    },
    handleDragStart(e, file) {
      if (file.url) {
        e.dataTransfer.setData("text/html", `<img src="${file.url}">`);
        e.dataTransfer.setData("text/plain", file.url);
        e.dataTransfer.setData("application/x-editor-js", file.url);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../css/variables.scss";

.file {
  text-decoration: none;
  cursor: pointer;
  margin: 0 auto;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

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

      &.is-not-icon {
        padding: 8%;
        img {
          border-radius: 8px;
          max-height: 100%;
          max-width: 100%;
        }
      }
      &.is-icon {
        img {
          border-radius: 20px;
          height: 100%;
          width: auto;
        }
      }
    }
  }

  &:hover {
    img {
      opacity: 0.8;
    }
  }

  img {
    transition: opacity 0.3s ease;
  }

  .filename {
    font-size: 0.8rem;
    text-align: center;
    text-overflow: ellipsis;
    word-wrap: break-word;
    padding: 4px 6px;
    overflow: hidden;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &.selected,
  &:active {
    img {
      box-shadow: 0 0 0 4px $yellow, 0 3px 3px 2px rgba(74, 47, 47, 0.15),
        0 3px 7px 4px rgba(0, 0, 0, 0.15);
    }
    .filename {
      background-color: $yellow;
    }
  }
}
</style>
