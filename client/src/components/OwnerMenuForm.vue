<template>
  <form
    class="form p-4 rounded shadow-sm"
    novalidate
    @submit.stop.prevent="handleSubmit"
  >
    <h3 class="form-header mb-4">
      更新下週菜單
    </h3>
    <!--Dish selection-->
    <CustomSelect
      v-model="id"
      :options="options"
      :v="$v.id"
      :target="'id'"
    >
      <template v-slot:label>
        餐點
      </template>
      <template v-slot:option>
        選擇餐點
      </template>
      <template v-slot:invalid>
        請選擇一種餐點
      </template>
    </CustomSelect>

    <!--Quantity-->
    <div
      class="form-group"
      :class="{invalid: $v.quantity.$error}"
    >
      <label for="quantity">供應數量</label>
      <input
        id="quantity"
        v-model.number="quantity"
        type="number"
        class="form-control"
        min="1"
        max="50"
        required
        @blur="$v.quantity.$touch()"
      >
      <small
        v-if="$v.quantity.$error"
        class="form-text"
      >請填寫欲提供的數量，最少 1 份和最多 50 份</small>
    </div>

    <div class="btn-container mt-4">
      <button
        class="btn"
        type="submit"
        :disabled="isProcessing || $v.$invalid"
      >
        更新
      </button>
    </div>
  </form>
</template>

<script>
import CustomSelect from '../components/CustomSelect'
import ownerAPI from '../apis/owner'
import { Toast } from '../utils/helpers'
import { required, between } from 'vuelidate/lib/validators'

export default {
  components: {
    CustomSelect
  },
  props: {
    initialMeal: {
      type: Object,
      default: () => ({
        id: '',
        name: '',
        quantity: 0
      })
    },
    options: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      quantity: 0,
      id: '',
      isProcessing: false
    }
  },
  validations: {
    id: {
      required
    },
    quantity: {
      required,
      between: between(1, 50)
    }
  },
  watch: {
    initialMeal (meal) {
      this.id = meal.id || this.id
      this.quantity = meal.quantity || this.quantity
    }
  },
  created () {
    this.id = this.initialMeal.id || this.id
    this.quantity = this.initialMeal.quantity || this.quantity
  },
  methods: {
    async handleSubmit (e) {
      // prepare form data
      const formData = {
        id: this.id,
        quantity: this.quantity
      }

      // update loading status
      this.isProcessing = true

      try {
        // send the updated data
        const { data, statusText } = await ownerAPI.menu.putMenu(formData)
        // error handling
        if (data.status !== 'success' || statusText !== 'OK') throw new Error(data.message)
        // send dish name and image from response to parent
        this.$emit('after-submit', { ...formData, name: data.meal.name, image: data.meal.image })
        // notify for successful update
        Toast.fire({
          type: 'success',
          title: '成功更新下週菜單！'
        })
        // update loading status
        this.isProcessing = false
      } catch (error) {
        // update loading status
        this.isProcessing = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '無法更新下週菜單，請稍後再試'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
    @include inputValidation;
    @include formControl;
    background-color: color(quaternary);
    color: color(secondary);

    &-header {
        font-size: size(md);
    }
}

.btn {
    @include solidButton;
    min-width: 100px;
    transition: min-width .2s linear;

    &-container {
        text-align: center;
    }

    @include response(md) {
        min-width: 200px;
    }
}
</style>
