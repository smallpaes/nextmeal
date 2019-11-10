<template>
  <div class="form-group">
    <label
      v-if="$slots.label"
      for="category"
    >
      <slot name="label" />
    </label>
    <div class="form-select-control">
      <select
        :value="value[name]"
        class="form-control"
        required
        @input="$emit('input', {...value, [name]: $event.target.value})"
      >
        <option
          value=""
          selected
        >
          <slot name="option" />
        </option>
        <option
          v-for="category in options"
          :key="category.id"
          :value="category.name"
          :selected="category.name === value[name]"
        >
          {{ category.name }}
        </option>
      </select>
      <div class="invalid-feedback">
        <slot name="invalid" />
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
    options: {
      type: Array,
      required: true
    },
    name: {
      type: String,
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
    &:invalid {
      margin-bottom: 0rem;
    }
  }

  &-select-control {
    position: relative;

    .form {
      &-control {
        border: none;
      }
    }

    .invalid-feedback {
      position: absolute;
    }
  }
}

.form-control {
  border: none
}
</style>
