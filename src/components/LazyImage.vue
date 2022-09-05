<template>
  <div
    v-if="image"
    :style="containerStyle"
    class="lazy-img-container"
    :class="{ loaded: loaded }"
  >
    <div v-if="skeleton && !loaded" class="skeleton"></div>
    <img
      ref="image"
      :alt="image.filename"
      :class="imgClass"
      :src="userRequestImage ? $uploadSrc(image, filter, backendOrigin) : null"
      :width="$uploadWidth(image, filter)"
      :height="$uploadHeight(image, filter)"
      @load="loaded = true"
      @error="handleError"
      @dragstart="handleDragStart($event, image)"
    />

    <div v-if="$slots.default" class="shadow"></div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: Object,
      default: () => {},
    },
    filter: {
      type: String,
      default: "card",
    },
    imgClass: {
      type: String,
      default: "",
    },
    containerStyle: {
      type: Object,
      default: () => {},
    },
    skeleton: {
      type: Boolean,
      default: true,
    },
    backendOrigin: {
      type: String,
      default: null,
    },
  },
  emits: ["error"],
  data() {
    return {
      userRequestImage: false,
      loaded: false,
    };
  },
  mounted() {
    if (!window["IntersectionObserver"]) {
      this.userRequestImage = true;
    } else {
      this.createObserver();
    }
  },
  methods: {
    handleIntersect(entries, observer) {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        } else {
          this.userRequestImage = true;
          observer.unobserve(this.$refs.image);
        }
      });
    },

    handleDragStart(e, file) {
      if (file.type === "file") {
        let url = this.$uploadSrc(file);
        e.dataTransfer.setData("text/html", `<img src="${url}">`);
        e.dataTransfer.setData("text/plain", url);
        e.dataTransfer.setData("application/x-editor-js", url);
      }
    },

    handleError(e) {
      if (this.userRequestImage) {
        this.$emit("error", e);
      }
      console.log("handleError", e);
    },

    createObserver() {
      const options = {
        // circumstances under which the observer's callback is invoked
        root: null, // defaults to the browser viewport if not specified or if null
        threshold: "0", // the degree of intersection between the target element and its root (0 - 1)
        // threshold of 1.0 means that when 100% of the target is visible within
        //the element specified by the root option, the callback is invoked
      };

      // Whether you're using the viewport or some other element as the root,the API works the same way,
      // executing a callback function you provide whenever the visibility of the target element changes
      // so that it crosses desired amounts of intersection with the root

      const observer = new IntersectionObserver(this.handleIntersect, options);

      observer.observe(this.$refs.image); // target element to watch
    },
  },
};
</script>

<style lang="scss" scoped>
.lazy-img-container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;

  img {
    opacity: 0;
    visibility: hidden;
    transition: var(--transition-opacity);

    box-shadow: var(--box-shadow-light);
    border: 0;
    border-radius: 4px;
    display: block;
  }
  .skeleton {
    background: #eee;
    background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
    border-radius: 5px;
    background-size: 200% 100%;
    animation: 1s shine linear infinite;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  .shadow {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    overflow: hidden;
    border-radius: 4px;
    line-height: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
    background: linear-gradient(
      180deg,
      rgba(38, 50, 56, 0) 0%,
      rgba(38, 50, 56, 0.25) 100%
    );
    transition: height 0.125s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover .shadow {
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(38, 50, 56, 0) 0%,
      rgba(38, 50, 56, 0.5) 100%
    );
  }
  &.loaded {
    img {
      visibility: visible;
      opacity: 1;
    }
    .skeleton {
      display: none;
    }
  }
}

@keyframes shine {
  to {
    background-position-x: -200%;
  }
}

.lazy-img-container {
  :deep(.actions) {
    display: flex;
    position: absolute;
    top: calc(50% - 32px);
    left: 0;
    right: 0;
    align-items: center;
    justify-content: center;
    transition: var(--transition-color), var(--transition-transform),
      var(--transition-opacity);
    transform: translateY(100%);
    opacity: 0;

    a {
      transition: all 0.2s;
      color: var(--grey);
      font-size: 1.3rem;
      padding: 0.5rem;
      margin: 0 0.5rem;
      width: 3rem;
      height: 3rem;

      &:hover {
        color: white;
      }
    }
  }

  &:hover {
    :deep(.actions) {
      transform: translateY(0);
      opacity: 1;
    }
  }
}
</style>
