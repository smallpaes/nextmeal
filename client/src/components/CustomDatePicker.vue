<template>
  <div
    class="form-group form-calendar-group"
    :class="{invalid: v && v.$error}"
  >
    <label
      v-if="hasLabel"
      for="hidden-date-input"
    >出生年月日</label>
    <input
      id="hidden-date-input"
      type="date"
      class="hidden-date-input form-control"
      name="hiddenDate"
    >
    <date-picker
      v-model="data"
      value-type="format"
      :placeholder="placeholder"
      input-class="form-control form-calendar"
      width="100%"
      :input-attr="inputAttribute"
      :not-after="lastDate"
      :not-before="new Date('1900', '12', '12')"
      :editable="editable"
      :disabled="disabled"
      @input="v ? v.$touch() : $emit('handle-date', $event)"
    />
    <small
      v-if="v && v.$error"
      class="form-text"
    >
      請選擇日期
    </small>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import moment from 'moment'
export default {
  components: {
    DatePicker
  },
  props: {
    value: {
      type: String,
      required: true
    },
    hasLabel: {
      type: Boolean,
      default: true
    },
    lastDate: {
      type: Object,
      default: () => moment()
    },
    v: {
      type: Object,
      default: () => {}
    },
    placeholder: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      inputAttribute: {
        required: true,
        id: 'dob',
        disabled: false
      },
      editable: false
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
/deep/ .form {
    @include formControl;

    &-control {
        &[readonly] {
          background-color: transparent;
        }
    }
}

.form {
  @include inputValidation;

  &-group {
    &.invalid {
      /deep/ input {
        border: 1px solid color(primary);
        background-color: lighten(color(primary), 36%);
      }
    }
  }

  &-calendar-group {
    position: relative;

    .hidden-date-input {
      position: absolute;
      width: 0;
      height: 0;
      opacity: 0;
    }
  }
}

/deep/ .mx-calendar-content {
  .cell {
    &.actived {
      background-color: color(primary);
      color: color(quaternary);
    }

    &:hover {
      background-color: lighten(color(primary), 35%);
      color: color(primary);
    }
  }
}

/deep/ .mx-panel-date {
  td {
    &.today {
      color: color(primary);
    }
  }
}
</style>
