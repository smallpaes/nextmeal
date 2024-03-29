<template>
  <form
    class="form p-3 rounded-sm shadow-sm mb-3"
    @submit.stop.prevent="$emit('after-search', searchInput)"
  >
    <div class="form-row align-items-center">
      <!--Option filter-->
      <div
        v-if="hasOption"
        class="form-group form-select-control col-sm-6 col-md my-1"
      >
        <select
          v-model="selectedOption"
          class="form-control"
          :disabled="isLoading"
          @change="e => $emit('after-filter', e.target.value)"
        >
          <option
            value=""
          >
            <slot name="filterOption" />
          </option>
          <option
            v-for="option in options"
            :key="option"
            :value="option"
            :selected="option === selectedOption"
          >
            {{ option | transformName }}
          </option>
        </select>
      </div>
      <!--Date Picker-->
      <CustomDatePicker
        v-if="hasDate"
        v-model="selectedDate"
        :last-date="getTomorrowDate"
        :has-label="false"
        :placeholder="'訂單日期'"
        :disabled="isLoading"
        :clearable="false"
        class="col-sm-6 my-1 col-md pl-md-2 pr-md-0"
        @handle-date="$emit('after-date-pick', $event)"
      />
      <!--Input search-->
      <div
        v-if="hasSearch"
        class="input-group col pl-1 my-1  input-search-group"
        :class="{'pl-sm-2': !hasDate, 'pl-sm-0': hasDate, 'pl-md-2': hasDate}"
      >
        <input
          id="searchInput"
          v-model.trim="searchInput"
          type="text"
          class="form-control"
          :disabled="isLoading"
          :placeholder="inputPlaceholder"
        >
        <div class="input-group-append">
          <button
            id="button-addon2"
            class="btn"
            type="submit"
          >
            <i class="fas fa-search" />
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import CustomDatePicker from '../components/CustomDatePicker'
import moment from 'moment-timezone'

export default {
  components: {
    CustomDatePicker
  },
  filters: {
    transformName (name) {
      if (name === 'active') return '已訂閱'
      if (name === 'inactive') return '未訂閱'
      return name
    }
  },
  props: {
    hasOption: {
      type: Boolean,
      default: true
    },
    hasSearch: {
      type: Boolean,
      default: true
    },
    hasDate: {
      type: Boolean,
      default: false
    },
    totalFileds: {
      type: Number,
      default: 2
    },
    options: {
      type: Array,
      required: true
    },
    inputPlaceholder: {
      type: String,
      default: '搜尋名稱'
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      searchInput: '',
      selectedOption: '',
      selectedDate: moment().format('YYYY-MM-DD')
    }
  },
  computed: {
    getTomorrowDate: function () {
      return moment().add(1, 'd').format('YYYY-MM-DD')
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  @include formControl;
  @include formSelectControl;
  background-color: color(quaternary);

  &-select-control {
    padding: 0;
    margin: 0 .3rem .6rem .3rem;
    @include response(sm) { margin: 0; }
  }

  .input-group-append {
    .btn {
      @include solidButton(40, .1);
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
}
</style>
