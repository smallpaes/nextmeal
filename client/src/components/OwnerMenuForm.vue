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
        <option>
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
        請填寫欲提供的數量，最多 50 份
      </div>
    </div>

    <div class="btn-container mt-4">
      <button
        class="btn"
        type="submit"
      >
        更新
      </button>
    </div>
  </form>
</template>

<script>
const dummyUpdatedMeal = {
  name: '菜餚二',
  image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260'
}

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
      id: this.initialMeal.id
    }
  },
  methods: {
    handleSubmit (e) {
      // form validation
      if (e.target.checkValidity() === false) {
        return e.target.classList.add('was-validated')
      }
      // send the dish to api
      const formData = {
        current_meal_id: this.initialMeal.id,
        updated_meal_id: this.id,
        quantity: this.quantity
      }
      console.log(formData)
      // send dish name and image from response to parent
      this.$emit('after-submit', dummyUpdatedMeal)
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
