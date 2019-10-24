<template>
  <section class="subscribe">
    <TopLogoNavbar />
    <div class="subscribe-content rounded">
      <div class="subscribe-content-top row">
        <div class="subscribe-content-top-header col-12 mb-4">
          <h3>
            方案選擇
          </h3>
          <h5>
            根據自己的需求挑選月繳方案
          </h5>
        </div>
        <div class="subscribe-content-top-choices col-12">
          <button
            v-for="plan in plans"
            :key="plan.id"
            type="button"
            class="subscribe-choice"
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
          計算方式：一個月以 30 天為標準
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import TopLogoNavbar from '../components/Navbar/TopLogoNavbar'

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
      ]
    }
  },
  methods: {
    handleSubscribe (name, quantity, price) {
      // POST to /api/subscribe
      const subscriptionData = {
        sub_balance: quantity,
        sub_description: `${quantity} 餐`,
        sub_name: name,
        sub_price: price
      }
      console.log(subscriptionData)
    }
  }
}
</script>

<style lang="scss" scoped>
.subscribe {
    @include setBackground('https://cdn.pixabay.com/photo/2019/03/29/09/26/food-4088832_1280.jpg', 100%);
    overflow-y: scroll;
    max-height: 100vh;
    padding: 120px 15px 30px 15px;

    &-content {
        max-width: 450px;
        background-color: color(quaternary);
        margin-top: 70px;
        margin: 0 auto;
        overflow-y: hidden;

        &-top {
            padding: 2.7rem;
            width: 100%;

            &-header {
                text-align: center;

                h3 {
                    font-size: size(lg);
                }

                h5 {
                    font-size: size(sm);
                }
            }

            &-choices {
                @include flexPosition(space-between, center, row);
            }
        }

        &-bottom {
            background-color: color(quinary);
            padding: .8rem 2.7rem;
            font-size: size(xs);
            color:lighten(color(secondary), 10%);
        }
    }

    &-choice {
        color: rgba(color(secondary), .7);
        width: 45%;
        background-color: color(quaternary);
        box-shadow: 0 .125rem .25rem rgba(0,0,0,.075);
        border-radius: .2rem;
        border: 0px;
        padding: 0;
        overflow: hidden;
        margin: 0;
        transition: all .2s linear;

        &-header {
            position: relative;
            color: color(quaternary);
            background-color: rgba(color(primary), .9);
            padding: .3rem 0;
            font-size: size(md);
            transition: all .2s linear;

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
            font-size: size(lg);
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
