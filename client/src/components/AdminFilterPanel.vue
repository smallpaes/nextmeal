<template>
  <form
    class="form p-3 rounded-sm shadow-sm mb-3"
    @submit.stop.prevent="$emit('after-search', searchInput)"
  >
    <div class="form-row">
      <!--Option filter-->
      <div class="form-group form-select-control col-sm-6">
        <select
          v-model.trim="selectedOption"
          class="form-control"
          @input="e => $emit('after-filter', e.target.value)"
        >
          <option
            value=""
            selected
          >
            <slot name="filterOption" />
          </option>
          <option
            v-for="option in options"
            :key="option"
            :value="option"
          >
            {{ option }}
          </option>
        </select>
      </div>
      <!--Input search-->
      <div class="input-group col-sm-6 m-0">
        <input
          id="searchInput"
          v-model.trim="searchInput"
          type="text"
          class="form-control"
          :placeholder="inputPlaceholder"
          required
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
export default {
  props: {
    options: {
      type: Array,
      required: true
    },
    inputPlaceholder: {
      type: String,
      default: '搜尋名稱'
    }
  },
  data () {
    return {
      searchInput: '',
      selectedOption: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  @include formControl;
  @include formSelectControl;
  background-color: color(quaternary);

  &-control {
      @include formValidation;
  }

  &-select-control {
    margin: 0 .3rem .6rem .3rem;

    @include response(sm) {
      margin: 0;
    }
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
