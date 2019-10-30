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
    <div class="form-group">
      <label for="dish">餐點</label>
      <select
        v-model.trim="id"
        class="form-control"
        required
      >
        <option value="">
          選擇餐點
        </option>
        <option
          v-for="option in options"
          :key="option.id"
          :value="option.id"
          :selected="id === option.id"
        >
          {{ option.name }}
        </option>
      </select>
      <div class="invalid-feedback">
        請選擇餐點
      </div>
    </div>

    <!--Quantity-->
    <div class="form-group">
      <label for="quantity">供應數量</label>
      <input
        id="quantity"
        v-model.trim="quantity"
        type="number"
        class="form-control"
        min="1"
        max="50"
        required
      >
      <div class="invalid-feedback">
        請填寫欲提供的數量，最少 1 份和最多 50 份
      </div>
    </div>

    <div class="btn-container mt-4">
      <button
        class="btn"
        type="submit"
        :disabled="isLoading"
      >
        更新
      </button>
    </div>
  </form>
</template>

<script>
import ownerAPI from '../apis/owner'
import { Toast } from '../utils/helpers'

export default {
  props: {
    initialMeal: {
      type: Object,
      required: true
    },
    options: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      quantity: this.initialMeal.quantity,
      id: -1,
      isLoading: false
    }
  },
  watch: {
    initialMeal (meal) {
      this.id = meal.id
    }
  },
  created () {
    this.id = this.initialMeal.id
  },
  methods: {
    async handleSubmit (e) {
      // form validation
      if (e.target.checkValidity() === false) {
        return e.target.classList.add('was-validated')
      }
      // prepare form data
      const formData = {
        id: this.id,
        quantity: this.quantity
      }

      // update loading status
      this.isLoading = true

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
        this.isLoading = false
      } catch (error) {
        // update loading status
        this.isLoading = false
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
    @include formControl;
    background-color: color(quaternary);
    color: color(secondary);

    &-control {
        @include formValidation;
    }

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
