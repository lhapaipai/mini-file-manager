<template>
  <div
    class="custom-select"
    :class="{
      'is-open': isOpen,
      'with-split-button': splitButton && options.length > 1,
    }"
    @click="handleClickContainer"
  >
    <a
      href="#"
      :class="`select-selected ${themePrefix}-button outlined`"
      tabindex="0"
      @click.stop.prevent="handleClickSelect"
    >
      <span v-if="modelValue && modelValue.icon" class="icon">
        <i :class="modelValue.icon"></i>
      </span>
      {{ valueLabel }}
    </a>
    <a
      v-if="splitButton && options.length > 1"
      href="#"
      tabindex="0"
      :class="`split-button ${themePrefix}-button outlined`"
      @click.stop.prevent="handleClickSplit"
    >
      <i :class="spinnerClass"></i>
    </a>

    <div v-if="isOpen" class="select-items">
      <a
        v-for="option in options"
        :key="option.value"
        href="#"
        class="select-item"
        @click.stop.prevent="handleClickOption(option)"
      >
        <span v-if="option.icon">
          <i :class="option.icon"></i>
        </span>
        {{ option.label }}
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: "Directory",
    },
    modelValue: {
      type: Object,
      default: () => ({
        icon: "famfm-eye",
        label: "Default",
      }),
    },
    splitButton: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "click"],
  data: () => {
    return {
      isOpen: false,
      focusListener: null,
    };
  },
  computed: {
    ...mapState(["themePrefix"]),
    spinnerClass() {
      return this.isOpen ? "famfm-up-open" : "famfm-down-open";
    },
    valueLabel() {
      return this.modelValue ? this.modelValue.label : this.placeholder;
    },
  },
  methods: {
    handleClickOption(option) {
      this.isOpen = false;
      this.$emit("update:modelValue", option);
    },
    handleClickSelect() {
      if (this.splitButton) {
        this.$emit("click", this.modelValue);
      } else {
        this.isOpen = !this.isOpen;
      }
    },
    handleClickContainer() {
      this.isOpen = false;
    },
    handleClickSplit() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-select {
  position: relative;
  display: flex;

  &.is-open {
    &::before {
      content: "";
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.1);
      position: fixed;
      z-index: 1;
    }
  }
}
.select-selected {
  align-items: center;
  border-radius: var(--mfm-form-border-radius);
  padding: 0.5rem 0.5rem;
  flex: 1;
  .is-open & {
    /* border-color: var(--mfm-primary-color500); */
  }
  .with-split-button & {
    border-radius: var(--mfm-form-border-radius) 0 0 var(--mfm-form-border-radius);
  }
  .icon {
    margin-right: 0.25rem;
    i {
      display: inline;
    }
  }
}
.split-button.outlined {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 var(--mfm-form-border-radius) var(--mfm-form-border-radius) 0;
  border-left-width: 0px;
  width: 40px;
}
.select-selected,
.split-button,
.select-items a {
  text-decoration: none;
}

.select-items {
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  z-index: 20;
  background-color: white;
  border: 1px solid var(--mfm-grey50);
  border-radius: var(--mfm-form-border-radius);

  .select-item {
    margin: 2px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    color: var(--mfm-grey);
    &:hover {
      background-color: var(--mfm-grey50);
      color: var(--mfm-grey700);
    }
  }
}
.select-item,
.select-selected {
  display: flex;
  align-items: center;
  svg {
    margin-right: 0.5rem;
    color: var(--mfm-grey);
  }
}
</style>
