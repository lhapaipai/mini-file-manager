<template>
  <LazyImage
    :image="file"
    :filter="filter"
    :backend-origin="backendOrigin"
    @error="handleError"
  >
    <div class="actions">
      <a href="#" class="bric-icon white-bg-color" @click.prevent="$emit('remove')"
        ><i class="famfm-trash"></i
      ></a>
      <a
        v-if="!multiple"
        href="#"
        class="bric-icon white-bg-color"
        @click.prevent="$emit('browse')"
        ><i class="famfm-folder"></i
      ></a>
    </div>
  </LazyImage>
</template>

<script>
import { confirm } from "mini-notifier";
import { mapState } from "vuex";
import LazyImage from "../LazyImage.vue";

export default {
  name: "ImageItem",
  components: {
    LazyImage,
  },
  props: {
    file: {
      type: Object,
      default: () => ({}),
    },
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
    handleError(e) {
      console.log("erreur chargement image", e);
      confirm(this.$t("errorFilePath"), {
        okHandler: () => {
          this.$emit("remove");
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.actions-container {
  position: relative;
  min-width: 100px;
}
</style>
