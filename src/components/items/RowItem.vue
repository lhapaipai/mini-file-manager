<template>
  <a
    href="#"
    class="file"
    @click.prevent="$emit('click', $event)"
    @dblclick="$emit('dblclick', $event)"
  >
    <div class="icon-container">
      <img :src="file.icon" :alt="file.filename" />
    </div>
    <div class="filename">{{ file.filename }}</div>
    <div class="size ref">{{ file.type === "file" ? file.humanSize : "" }}</div>
    <div class="date ref">{{ formatDate(file.createdAt) }}</div>
  </a>
</template>

<script>
export default {
  props: {
    file: Object,
  },
  emits: ["click", "dblclick"],
  methods: {
    formatDate(strDate) {
      let date = new Date(strDate);
      if (!(date instanceof Date) || isNaN(date)) {
        return "";
      }
      return new Intl.DateTimeFormat("fr-FR").format(date);
    },
  },
};
</script>

<style lang="postcss" scoped>
.file {
  text-decoration: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem 0.5rem;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--gray-extra-light);
  color: var(--gray);

  .icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    margin-right: 6px;
    img {
      height: 24px;
    }
  }

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
    color: var(--gray-dark);
  }
  &.selected,
  &:active {
    background-color: var(--primary-color);
    color: var(--gray-dark);
  }
}
</style>
