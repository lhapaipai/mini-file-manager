<template>
  <div class="file-picker-app">
    <div v-if="selection.length > 0" class="files">
      <div v-for="file, id in selection" :key="id" class="preview" :class="{ image: file.thumbnails }">
          <img :data-type="file.type" :src="file.thumbnails ? file.thumbnails.small : file.icon">
          <div class="actions">
              <a href="#" @click="handleRemove" class="remove"><i class="fa-trash"></i></a>
              <a href="#" @click="handleBrowse" class="browse"><i class="fa-folder"></i></a>    
          </div>
      </div>
    </div>
    <div v-else>
      <button @click.prevent="handleBrowse" class="penta-button">Parcourir</button>
    </div>
  </div>
</template>

<script>
import { openFileManager } from "../main";

export default {
  props: ["fileManagerOptions", "originalSelection", "input"],
  data() {
    return {
      selection: []
    };
  },
  watch: {
    selection() {
      console.log("selection change !");
      this.input.value = this.selection.map(file => file.uploadRelativePath).join(",")
    }
  },
  methods: {
    handleRemove() {
      this.selection = [];
    },
    handleBrowse() {
      // TODO uploadRelativePath -> id @public_uploads:profile/identite.jpg
      openFileManager({
        ...this.fileManagerOptions,
        originalSelection: this.selection.map(elt => elt.uploadRelativePath)
      }, this.onSelected)
    },
    onSelected(files) {
      console.log(files);
      this.selection = files;
    }
  },
  mounted() {
    this.selection = [...this.originalSelection];
  }
}
</script>

<style lang="postcss" scoped>
.file-picker-app {
  .files {
    display: flex;
  }
  .preview {
    position: relative;
    align-self: flex-start;
    min-width: 100px;

    img {
      vertical-align: middle;
      display: inline-block;
    }
  }
  .rounded-corner {
    box-shadow: 0 0 1px #bbb;
  }

  .actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: flex-end;
    transition: all 0.2s;
    a {
      font-size: 1.3rem;
      padding: 0.5rem;
      &:hover {
        color: white;
      }
    }
  }
}

</style>