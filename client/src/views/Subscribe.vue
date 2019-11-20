<template>
  <section class="subscribe">
    <TopLogoNavbar />
    <transition
      appear
      name="slide"
    >
      <div class="subscribe-content rounded">
        <div class="subscribe-content-top row">
          <div class="subscribe-content-top-header col-12 mb-4">
            <h3>
              方案選擇
            </h3>
            <h5>
              根據個人需求挑選月繳方案
            </h5>
          </div>
          <div class="subscribe-content-top-choices col-12">
            <button
              v-for="plan in plans"
              :key="plan.id"
              type="button"
              class="subscribe-choice"
              :disabled="isProcessing"
              @click.stop="handleSubscribe(plan.name, plan.quantity, plan.price)"
            >
              <h4 class="subscribe-choice-header">
                {{ plan.name }}
              </h4>
              <h3 class="subscribe-choice-description">
                {{ plan.quantity }} 餐
                <span class="subscribe-choice-price d-block mt-2">月付 {{ plan.price }} 元</span>
              </h3>
            </button>
          </div>
        </div>
        <div class="subscribe-content-bottom">
          <p class="text-left m-0 mr-3">
            計算方式：一個月以 30 天計算
          </p>
        </div>
        <form
          ref="tradeForm"
          action="https://ccore.newebpay.com/MPG/mpg_gateway"
          method="POST"
        >
          <input
            v-for="item in tradeInfo"
            :key="item"
            :ref="item"
            type="text"
            :name="item"
            hidden
          >
        </form>
      </div>
    </transition>
  </section>
</template>

<script>
import TopLogoNavbar from '../components/Navbar/TopLogoNavbar'
import usersAPI from '../apis/users'
import { Toast } from '../utils/helpers'

export default {
  components: {
    TopLogoNavbar
  },
  data () {
    return {
      plans: [
        {
          id: 1,
          name: '輕量型',
          price: 1000,
          quantity: 10
        },
        {
          id: 2,
          name: '滿足型',
          price: 2000,
          quantity: 20
        }
      ],
      tradeInfo: ['MerchantID', 'TradeInfo', 'TradeSha', 'Version'],
      isProcessing: false
    }
  },
  methods: {
    async handleSubscribe (name, quantity, price) {
      // prepare data for subscription
      const subscriptionData = {
        sub_balance: quantity,
        sub_description: `一個月${quantity}餐`,
        sub_name: name,
        sub_price: price
      }

      try {
        // update processing status
        this.isProcessing = true
        // create new subscription
        const { data, statusText } = await usersAPI.postSubscribe({ formData: subscriptionData })
        // error handling
        if (statusText !== 'OK' || data.status !== 'success') throw new Error(data.message)
        // prepare form for 藍新
        this.tradeInfo.forEach(item => this.$refs[item][0].setAttribute('value', data.tradeInfo[item]))
        // submit the form
        this.$refs.tradeForm.submit()
      } catch (error) {
        // update loading status
        this.isProcessing = false
        // fire error messages
        Toast.fire({
          type: 'error',
          title: '訂閱失敗，請稍後再試'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@include slideAnimation;

.subscribe {
  @include setBackground('https://cdn.pixabay.com/photo/2019/03/29/09/26/food-4088832_1280.jpg', 100%);
  max-height: 100vh;
  padding: 120px 15px 30px 15px;
  overflow-y: scroll;

  &-content {
    max-width: 450px;
    margin-top: 70px;
    margin: 0 auto;
    overflow-y: hidden;
    background-color: color(quaternary);

    &-top {
      padding: 2.7rem .7rem;
      margin: 0;
      width: 100%;

      @include response(xs) { padding: 2.7rem; }

      &-header {
        text-align: center;
        h3 { font-size: size(lg); }
        h5 { font-size: size(sm); }
      }

      &-choices {
        @include flexPosition(space-between, center, row);
      }
    }

    &-bottom {
      padding: .8rem 2.7rem;
      font-size: size(xs);
      color:lighten(color(secondary), 10%);
      background-color: color(quinary);
    }
  }

  &-choice {
    width: 45%;
    padding: 0;
    margin: 0;
    overflow: hidden;
    color: rgba(color(secondary), .7);
    background-color: color(quaternary);
    box-shadow: 0 .125rem .25rem rgba(0,0,0,.075);
    border-radius: .2rem;
    border: 0px;
    transition: all .2s linear;

    &-header {
      position: relative;
      color: color(quaternary);
      background-color: rgba(color(primary), .9);
      padding: .3rem 0;
      font-size: size(sm);
      transition: all .2s linear;
      @include response(xs) { font-size: size(md); }

      &::after {
        position: absolute;
        content: '';
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-top: .5rem solid rgba(color(primary), .9);
        border-left: .5rem solid transparent;
        border-right: .5rem solid transparent;
      }
    }

    &-description {
      @include flexPosition(center, center, column);
      min-height: 120px;
      font-size: size(md);
      @include response(xs) { font-size: size(lg); }
    }

    &-price {
      font-size: size(sm);
    }

    &:hover {
      color: color(primary);
      box-shadow: 0 .35rem .5rem rgba(0,0,0,.15);
      transform: translateY(-3px);

      .subscribe-choice-header {
        background-color: color(primary);
      }
    }
  }
}
</style>
