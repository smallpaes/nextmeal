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
              <div class="card-body">
                {{ question.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-container">
        <router-link
          :to="{name: 'signup'}"
          class="btn mt-5"
        >
          體驗看看
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
          answer: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perspiciatis atque possimus, nihil eius placeat facilis accusantium sint ab quia! Unde.'
        },
        {
          id: 2,
          title: '方案有哪些？',
          answer: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perspiciatis atque possimus, nihil eius placeat facilis accusantium sint ab quia! Unde.'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.questions {
  @include headingStyling;

    &-heading {
      text-align: center;
    }
}

.card {
    border: none;
    border-bottom: 1px solid rgb(182, 182, 182);
    margin-bottom: .6rem;

    &:first-of-type {
        border-bottom: 1px solid rgb(182, 182, 182);
    }

    &-header {
        border-top: none;
        background-color: white;
        border-bottom: none;
        color: color(tertiary);
        font-weight: weight(bold);
        padding: 20px 20px 20px 0;

        &:hover {
            cursor: pointer;
        }
    }

    &-body {
        color: lighten(color(secondary), 10%);
        padding: 0 20px 20px 0;
    }
}

.btn-container {
    text-align: center;
    .btn {
        @include solidButton;
    }
}
</style>
