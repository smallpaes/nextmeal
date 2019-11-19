<template>
  <section class="form">
    <form
      ref="form"
      class="form-wrapper rounded-sm shadow-sm p-3"
    >
      <h2 class="form-title mb-4">
        訂購資料
      </h2>
      <!--Time slot selection-->
      <fieldset
        class="form-group"
        :disabled="isProcessing"
      >
        <legend class="form-legend">
          預定領餐時間
          <span
            v-if="errorMessage.time"
            class="invalid-message"
          >({{ errorMessage.time }})</span>
        </legend>
        <div
          v-for="timeSlot in orderInfo.timeSlots"
          :key="timeSlot"
          class="form-check form-check-inline"
        >
          <input
            :id="'radio' + timeSlot"
            v-model="formData.time"
            class="form-check-input"
            type="radio"
            name="inlineRadioOptions"
            :value="timeSlot"
            :checked="timeSlot === formData.time"
            hidden
          >
          <label
            class="form-check-label"
            :for="'radio' + timeSlot"
          >{{ timeSlot }}</label>
        </div>
      </fieldset>
      <!--Quantity selection-->
      <div class="form-group">
        <label for="quantity">預定數量</label>
        <span
          v-if="errorMessage.quantity"
          class="invalid-message"
        >({{ errorMessage.quantity }})</span>
        <div class="form-quantity">
          <button
            class="btn btn-minus"
            :class="{'disable-btn': formData.quantity <= 1}"
            :disabled="isProcessing || formData.quantity <= 1"
            @click.stop.prevent="formData.quantity -= 1"
          >
            -
          </button>
          <input
            id="quantity"
            v-model.number="formData.quantity"
            type="text"
            class="form-quantity-input text-center"
            name="quantity"
            size="2"
            disabled
          >
          <button
            class="btn btn-plus"
            :class="{'disable-btn': orderInfo.quantity === formData.quantity || formData.quantity === currentUser.subscriptionBalance + initialOrder.quantity }"
            :disabled="isProcessing || orderInfo.quantity === formData.quantity || formData.quantity === currentUser.subscriptionBalance + initialOrder.quantity"
            @click.stop.prevent="formData.quantity += 1"
          >
            +
          </button>
        </div>
      </div>
      <hr class="form-divider mt-4">
      <div class="btn-container">
        <ProcessButton
          class="btn"
          :is-processing="isProcessing"
          :v="{}"
          :color="'tertiary'"
          :border-radius="'.3rem'"
          @after-click="$route.name === 'order-new' ? $emit('change-order') : $emit('to-last-page')"
        >
          <template #initial>
            回上一頁
          </template>
        </ProcessButton>
        <ProcessButton
          class="btn"
          :is-processing="isProcessing"
          :v="{}"
          :color="'primary'"
          :border-radius="'.3rem'"
          @after-click="handleSubmit"
        >
          <template #initial>
            <slot name="submit">
              確認訂購
            </slot>
          </template>
        </ProcessButton>
      </div>
    </form>
  </section>
</template>

<script>
import ProcessButton from '../components/Button/ProcessButton'

export default {
  components: {
    ProcessButton
  },
  props: {
    orderInfo: {
      type: Object,
      required: true
    },
    initialOrder: {
      type: Object,
      default: () => ({
        time: '',
        quantity: 0
      })
    },
    initialProcessing: {
      type: Boolean,
      default: false
    },
    currentUser: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      formData: {
        time: '',
        quantity: 1
      },
      errorMessage: {
        time: null,
        quantity: null
      },
      isProcessing: false
    }
  },
  watch: {
    initialOrder (order) {
      this.formData = {
        ...this.formData,
        ...order
      }
    },
    initialProcessing (isProcessing) {
      this.isProcessing = isProcessing
    }
  },
  created () {
    this.formData = {
      ...this.formData,
      ...this.initialOrder
    }
    this.isProcessing = this.initialProcessing
  },
  methods: {
    handleSubmit (e) {
      // form validation: time
      if (!this.formData.time) {
        this.errorMessage.time = '請選擇領餐時間'
        return
      }
      this.errorMessage.time = null

      // form validation: quantity
      if (this.formData.quantity < 1) {
        this.errorMessage.quantity = '請選擇訂購數量'
        return
      }
      // update processing status
      this.isProcessing = true
      // send data to parent
      const formData = { quantity: this.formData.quantity, require_date: this.formData.time }
      this.$emit('after-submit', formData)
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  width: 100%;

  &-wrapper {
    background-color: color(quaternary);
  }

  &-title {
    font-size: size(md);
    font-weight: weight(bold);
    color: color(primary);
  }

  &-legend {
    font-size: size(sm);
  }

  &-check {
    &-label {
      color: lighten(color(secondary), 20%);
      padding: .2rem 1rem;
      border-radius: .1rem;
      margin-bottom: .75rem;
      border: 1px solid lighten(color(secondary), 20%);
      cursor: pointer;
      transition: all .2s linear;

      &:hover {
        border-color: color(tertiary);
        background: color(tertiary);
        color: color(quaternary);
      }
    }

    &-input {
      &:checked ~ .form-check-label {
        border-color: color(tertiary);
        background: color(tertiary);
        color: color(quaternary);
      }
    }
  }

  &-quantity {
    display: flex;

    &-input {
      background-color: transparent;
      border: none;
    }

    .btn {
      border: 1px solid lighten(color(secondary), 20%);
      color: lighten(color(secondary), 20%);
      border-radius: .1rem;
      padding: .1rem;
      width: 1.5rem;
    }

    .disable-btn {
      color: lighten(color(secondary), 40%);
      border: 1px solid lighten(color(secondary), 40%);
    }
  }
}

.btn-container {
  text-align: center;
  .btn {
    margin-left: .8rem;
    padding: 0;
    line-height: 1.8rem;
    min-width: 78px;
    font-size: size(xs);

    &:last-child {
      margin-left: 0;
    }

    @include response(md) {
      font-size: size(sm);
      min-width: 130px;
      padding: .1rem 0;
      margin-left: 1rem;
    }
  }

  @include response(md) {
    text-align: right;
  }
}

.invalid-message {
  color: color(primary);
}
</style>
