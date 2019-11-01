<template>
  <div class="form-group form-calendar-group">
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
      v-model="value.dob"
      value-type="format"
      placeholder="選擇出生年月日"
      input-class="form-control form-calendar"
      width="100%"
      :input-attr="inputAttribute"
      :not-after="lastDate"
      :not-before="new Date('1900', '12', '12')"
      :editable="editable"
      @input="$emit('handle-date', value)"
    />
    <div class="invalid-feedback">
      請選擇日期
    </div>
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
      type: Object,
      required: true
    },
    hasLabel: {
      type: Boolean,
      default: true
    },
    lastDate: {
      type: Object,
      default: () => moment()
    }
  },
  data () {
    return {
      inputAttribute: {
        required: true,
        id: 'dob'
      },
      editable: false
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .form {
    @include formControl;

    &-control {
        @include formValidation;

        &[readonly] {
          background-color: transparent;
        }
    }
}

.form {
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

.was-validated {
  .hidden-date-input {
    &:invalid {
      &/deep/ + div input {
        border-color: color(primary);
      }
    }

    &:valid {
      &/deep/ + div input {
        border-color: #28a745;
      }
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
