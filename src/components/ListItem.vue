<template>
  <a
    href="#"
    class="file"
    @click.prevent="$emit('click', $event)"
    @dblclick="$emit('dblclick', $event)"
  >
    <div class="filename">{{ file.filename }}</div>
    <div class="size ref">{{ file.humanSize }}</div>
    <div class="date ref">{{ formatDate(file.createdAt) }}</div>
  </a>
</template>

<script>
export default {
  props: ["file"],
  methods: {
    formatDate(strDate) {
      let date = new Date(strDate);
      if (!(date instanceof Date) || isNaN(date)) {
        return "";
      }
      return new Intl.DateTimeFormat("fr-FR").format(date);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../variables.scss";

.file {
  text-decoration: none;
  cursor: pointer;
  display: flex;
  padding: 0.5rem 0.5rem;
  flex-wrap: wrap;
  border-bottom: 1px solid $extraLightGray;
  .filename {
    width: 100%;
  }

  .size {
    width: 70px;
    margin-right: auto;
  }
  .date {
    width: 100px;
    text-align: right;
  }
  @media (min-width: 750px) {
    .filename {
      flex: 1;
      width: auto;
    }
    .size {
      width: 70px;
      margin-right: 0;
    }
  }

  &:hover {
    background-color: #f7f7f7;
    color: $blackLight;
  }
  &.selected,
  &:active {
    background-color: $yellow;
  }
}
</style>
