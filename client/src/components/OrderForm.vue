<template>
  <section class="form">
    <form
      class="form-wrapper rounded-sm shadow-sm p-3"
      @submit.stop.prevent="handleSubmit"
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
            v-if="errorMessage.length > 0"
            class="invalid-message"
          >({{ errorMessage[0] }})</span>
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
        <div class="form-quantity">
          <button
            class="btn btn-minus"
            :class="{'disable-btn': formData.quantity === 1}"
            :disabled="isProcessing"
            @click.stop.prevent="formData.quantity === 1 ? formData.quantity = 1 : formData.quantity -= 1"
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
            :class="{'disable-btn': orderInfo.quantity === formData.quantity }"
            :disabled="isProcessing"
            @click.stop.prevent="orderInfo.quantity === formData.quantity ? formData.quantity = orderInfo.quantity: formData.quantity += 1"
          >
            +
          </button>
        </div>
      </div>
      <hr class="form-divider mt-4">
      <div class="btn-container text-right">
        <button
          v-if="$route.name==='order-new'"
          class="btn btn-last"
          @click.stop.prevent="$emit('change-order')"
        >
          回上一頁
        </button>
        <button
          class="btn btn-next"
          type="submit"
          :disabled="isProcessing"
        >
          <slot name="submit">
            確認訂購
          </slot>
        </button>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  props: {
    orderInfo: {
      type: Object,
      required: true
    },
    initialOrder: {
      type: Object,
      default: () => ({
        time: '',
        quantity: 1
      })
    },
    initialProcessing: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formData: {
        time: '',
        quantity: 1
      },
      errorMessage: [],
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
      if (!this.formData.time) {
        this.errorMessage.push('請選擇領餐時間')
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
    .btn {
        margin-left: .8rem;
        padding: .1rem;
        line-height: 1.8rem;

        &-last {
            @include solidButton(80, .3, tertiary);
        }

        &-next {
            @include solidButton(80, .3, primary);
        }

        @include response(md) {
            min-width: 180px;
            padding: .2rem .5rem;
            margin-left: 1rem;
        }
    }
}

.invalid-message {
    color: color(primary);
}
</style>
