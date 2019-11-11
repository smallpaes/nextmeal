<template>
  <div
    class="form-group"
    :class="{invalid: v.$error}"
  >
    <label
      v-if="$slots.label"
      for="category"
    >
      <slot name="label" />
    </label>
    <div class="form-select-control">
      <select
        v-model="data"
        class="form-control"
        required
        :disabled="isProcessing"
        @change="v.$touch()"
      >
        <option
          value=""
          selected
        >
          <slot name="option" />
        </option>
        <option
          v-for="option in options"
          :key="option.id"
          :value="option[target]"
          :selected="option[target] === value"
        >
          {{ option.name }}
        </option>
      </select>
      <div class="invalid-feedback" />
    </div>
    <small
      v-if="v.$error"
      class="form-text"
    ><slot name="invalid" /></small>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    v: {
      type: Object,
      required: true
    },
    target: {
      type: String,
      required: true
    },
    isProcessing: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    data: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  @include formControl;
  @include formSelectControl;
  @include inputValidation;

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

  &-group {
    &.invalid {
      .form-select-control {
        border: 1px solid color(primary);
        background-color: lighten(color(primary), 36%);
      }

      .form-control {
        border: none;
      }
    }
  }
}

.form-control {
  border: none
}
</style>
