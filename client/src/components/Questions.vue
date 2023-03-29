<template>
  <section class="questions bg-white pt-3 pb-5">
    <div class="container">
      <div class="questions-heading">
        <h1 class="questions-heading-title">
          常見問題
        </h1>
        <p class="questions-heading-description">
          了解更多相關資訊
        </p>
      </div>
      <div class="accordion-wrapper row">
        <div
          id="questionsAccordion"
          class="accordion col-12 col-md-8 col-xl-6 offset-md-2 offset-xl-3"
        >
          <div
            v-for="question in questions"
            :key="question.id"
            class="card rounded-0 "
          >
            <div
              :id="'heading' + question.id"
              class="card-header rounded-0 d-flex align-items-center justify-content-between"
              data-toggle="collapse"
              :data-target="'#collapse' + question.id"
              aria-expanded="false"
              aria-controls="collapse"
            >
              <span class="heading-title">{{ question.title }}</span>
              <i class="fas fa-plus" />
            </div>

            <div
              :id="'collapse' + question.id"
              class="collapse"
              :aria-labelledby="'heading' + question.id"
              data-parent="#questionsAccordion"
            >
              <div
                class="card-body"
                v-html="question.answer"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="btn-container">
        <router-link
          :to="{name: 'faq'}"
          class="btn mt-5"
        >
          了解更多
        </router-link>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      questions: [
        {
          id: 1,
          title: 'NextMeal 是什麼？',
          answer: '<p>NextMeal 平台提供餐點預訂的服務，您可以實惠的價格享受附近優質餐廳提供的招牌餐點。</p><p>每天 NextMeal 會為您隨機選出附近兩間優質餐廳，您可以在訂閱期間任何時段，使用點數快速預定隔日午餐，並於領餐時間前往餐廳取餐，免去等待排隊的煩惱。</p>'
        },
        {
          id: 2,
          title: 'NextMeal 方案有哪些？',
          answer: '輕量型: 月繳 1000 元，可訂 10 餐。<br>滿足型: 月繳 2000 元，可訂 20 餐'
        },
        {
          id: 3,
          title: 'NextMeal 目前有哪些營運地區？',
          answer: '目前 NextMeal 營運地區包含台北市信義、中山、松山與大安區。您可以前往各地區的頁面了解更多合作的餐廳資訊，並查看他們目前推出的招牌菜喔!'
        },
        {
          id: 4,
          title: '有推出晚餐時段訂餐嗎？',
          answer: '很遺憾地，目前NextMeal只開放午餐時段的訂購。不過在不久的將來後便會開放晚餐與其他地區的餐點訂購!敬請期待!'
        },
        {
          id: 5,
          title: '有提供外送餐點服務嗎？',
          answer: 'NextMeal 沒有提供外送服務，每份新鮮的餐點都需要您親自到場取餐。與我們合作的有上百家餐廳，相信一定可以在您的附近找到又近又能讓您滿意的餐點!'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.questions {
  @include headingStyling;

  &-heading { text-align: center; }
}

.card {
  margin-bottom: .6rem;
  border: none;
  border-bottom: 1px solid lighten(color(secondary), 55%);

  &:first-of-type { border-bottom: 1px solid lighten(color(secondary), 55%); }

  &:not(:first-of-type):not(:last-of-type) { @extend .card:first-of-type; }

  &-header {
    padding: 20px 20px 20px 0;
    font-weight: weight(bold);
    color: color(tertiary);
    background-color: white;
    border-top: none;
    border-bottom: none;
    &:hover { cursor: pointer; }
  }

  &-body {
    padding: 0 20px 20px 0;
    font-size: size(xs);
    color: lighten(color(secondary), 10%);
  }
}

.btn-container {
  text-align: center;
  .btn { @include solidButton; }
}
</style>
