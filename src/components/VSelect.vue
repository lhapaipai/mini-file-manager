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
      class="select-selected"
      tabindex="0"
      @click.stop.prevent="handleClickSelect"
    >
      <span v-if="modelValue && modelValue.icon">
        <i :class="modelValue.icon"></i>
      </span>
      {{ valueLabel }}
    </a>
    <a
      href="#"
      v-if="splitButton && options.length > 1"
      tabindex="0"
      class="split-button"
      @click.stop.prevent="handleClickSplit"
    >
      <i :class="spinnerClass"></i>
    </a>

    <div class="select-items" v-if="isOpen">
      <a
        href="#"
        v-for="option in options"
        @click.stop.prevent="handleClickOption(option)"
        :key="option.value"
        class="select-item"
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
export default {
  props: ["options", "placeholder", "modelValue", "splitButton"],
  emit: ["update:modelValue"],
  data: () => {
    return {
      isOpen: false,
      focusListener: null,
    };
  },
  computed: {
    spinnerClass() {
      return this.isOpen ? "fa-up-open" : "fa-down-open";
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
    handleClickSelect(e) {
      if (this.splitButton) {
        this.$emit("click", this.modelValue);
      } else {
        this.isOpen = !this.isOpen;
      }
    },
    handleClickContainer(e) {
      this.isOpen = false;
    },
    handleClickSplit(e) {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../css/variables.scss";

.custom-select {
  position: relative;
  display: flex;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.15),
    0 1px 5px 0px rgba(0, 0, 0, 0.1);

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
  border: 1px solid $lightGray;
  border-radius: $borderRadius;
  padding: 0.5rem 1rem;
  flex: 1;
  .is-open & {
    border-color: $yellowDark;
  }
  .with-split-button & {
    border-radius: $borderRadius 0 0 $borderRadius;
  }
}
.split-button {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 $borderRadius $borderRadius 0;
  border: 1px solid $lightGray;
  border-left-width: 0;
  width: 40px;
}
.select-selected,
.split-button,
.select-items a {
  text-decoration: none;
}

.select-selected,
.split-button {
  @include transition;
  &:hover {
    box-shadow: 0 3px 3px -2px rgba(0, 0, 0, 0.05),
      0 3px 7px 0px rgba(0, 0, 0, 0.05);
  }
  &:active {
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.05),
      0 8px 10px 1px rgba(0, 0, 0, 0.05), 0 3px 14px 2px rgba(0, 0, 0, 0.03);
  }
}

.select-items {
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  right: 0;
  z-index: 20;
  background-color: white;
  border: 1px solid $extraLightGray;
  border-radius: $borderRadius;

  .select-item {
    margin: 2px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    &:hover {
      background-color: $extraLightGray;
    }
  }
}
.select-item,
.select-selected {
  display: flex;
  align-items: center;
  svg {
    margin-right: 0.5rem;
    color: $gray;
  }
}
</style>
