<template>
  <div class="form-group">
    <label for="category">喜好餐廳</label>
    <div class="form-select-control">
      <select
        :value="value.prefer"
        class="form-control"
        required
        @input="$emit('input', {...value, prefer: $event.target.value})"
      >
        <option
          value=""
          selected
        >
          餐廳類別
        </option>
        <option
          v-for="category in categories"
          :key="category.id"
          :value="category.name"
        >
          {{ category.name }}
        </option>
      </select>
      <div class="invalid-feedback">
        請選擇類別
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    },
    categories: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  @include formControl;
  @include formSelectControl;

  &-control {
      @include formValidation;

      &:invalid {
          margin-bottom: 0rem;
      }
  }

  &-select-control {
      position: relative;

      .invalid-feedback {
          position: absolute;
      }
  }
}
</style>
