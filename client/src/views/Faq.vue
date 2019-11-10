<template>
  <section>
    <!--Navbar-->
    <UserNavbar />
    <!--Header-->
    <header>
      <transition
        name="fade"
        appear
      >
        <!--Banner-->
        <ImageHeaderBanner
          :background-photo="bannerImage"
          :banner-height="300"
        >
          <template v-slot:header>
            <h1 class="banner-content-title">
              常見問題
            </h1>
          </template>
        </ImageHeaderBanner>
      </transition>
    </header>

    <!--Question and Answer Section-->
    <transition
      name="slide"
      appear
    >
      <section class="faq">
        <div class="container pt-3 pb-0 pb-md-5">
          <div
            v-for="(topic, name) in questionsCollection"
            :key="name"
            class="faq-title-wrapper"
          >
            <h2
              class="faq-title"
            >
              {{ topic.title }}
            </h2>
            <ul
              class="list-group list-group-flush"
            >
              <li
                v-for="(question, index) in topic.questions"
                :key="index"
                class="list-group-item"
              >
                <h4 class="list-title">
                  {{ index + 1 }}. {{ question.title }}
                </h4>
                <p
                  class="list-description"
                  v-html="question.answer"
                />
              </li>
            </ul>
          </div>
        </div>
      </section>
    </transition>
    <transition
      name="fade"
      appear
    >
      <Footer />
    </transition>
  </section>
</template>

<script>
import UserNavbar from '../components/Navbar/UserNavbar'
import ImageHeaderBanner from '../components/Banner/ImageHeaderBanner'
import Footer from '../components/Footer'

export default {
  name: 'Home',
  components: {
    UserNavbar,
    ImageHeaderBanner,
    Footer
  },
  data () {
    return {
      bannerImage: 'https://images.unsplash.com/photo-1543198432-a20fa3055570?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=3150&q=80',
      questionsCollection: {
        platform: {
          title: '平台與方案問題',
          questions: [
            {
              id: 1,
              title: 'NextMeal 是什麼？',
              answer: `NextMeal 平台提供餐點預訂的服務，您可以用實惠的價格享受附近優質餐廳提供的招牌餐點。<br>每天 NextMeal 會為您隨機選出附近兩間優質餐廳，您可以在訂閱期間任何時段，使用點數快速預定隔日午餐，並於領餐時間前往餐廳取餐，免去等待排隊的煩惱。`
            },
            {
              id: 2,
              title: '方案選擇有哪些？',
              answer: '輕量型: 月繳 1000 元，可訂 10 餐。<br>滿足型: 月繳 2000 元，可訂 20 餐。'
            },
            {
              id: 3,
              title: '方案期間如何計算？',
              answer: '您選擇的訂閱方案會在付款成功後的當下生效，並在完整的 30 天內都能享受便捷的訂餐服務。當方案截止時，未使用的額度將不會退款或累計到下一次的訂閱方案中。<br>若您滿意我們的服務，您可以在方案結束後，再次訂閱適合自己的方案，展開下一趟由 NextMeal 合作店家帶給您優質餐點！'
            },
            {
              id: 4,
              title: '目前有哪些營運地區？',
              answer: '目前 NextMeal 營運地區包含台北市信義、中山、松山與大安區。您可以前往各地區的頁面了解更多合作的餐廳資訊，並查看他們目前推出的招牌菜喔!'
            }
          ]
        },
        account: {
          title: '帳號問題',
          questions: [
            {
              id: 1,
              title: '預定餐點前一定需要註冊成為會員嗎？',
              answer: '您無須註冊即可瀏覽目前 Nextmeal 在各地區的合作餐廳與評論。為提供您更好的訂餐服務，在您訂餐前才需要註冊成為會員，Nextmeal 將會依照您的偏好設定，每日推薦合適的餐廳與餐點給您挑選和預訂！'
            },
            {
              id: 2,
              title: '方案到期後需要重新註冊嗎？',
              answer: '在您方案到期後，可以使用相同的帳號，訂閱下一期的方案，無需重新註冊一組新帳號。'
            },
            {
              id: 3,
              title: '可以更換我的所在地點嗎？',
              answer: '您可以前往「帳戶設定」頁面更新地址，Nextmeal 將會依照您修改後的地址推薦附近的優質餐廳給您。'
            }
          ]
        },
        meal: {
          title: '餐點與訂單問題',
          questions: [
            {
              id: 1,
              title: '可以預訂取餐的時段有哪些呢？',
              answer: '目前合作餐廳僅在午餐時段 11:00 至 14:00 間提供餐點，您可以在預定餐點時，選取適合自己的取餐時間。'
            },
            {
              id: 2,
              title: '有推出晚餐時段的訂餐嗎？',
              answer: '很遺憾地，目前 NextMeal 只開放午餐時段的訂購。不過在不久的將來後便會開放晚餐與其他地區的餐點訂購！敬請期待！'
            },
            {
              id: 3,
              title: '可以一次預訂多間餐廳的餐點嗎？',
              answer: 'Nextmeal 每天都會推薦兩間餐廳給您挑選，目前一餐僅能預定一間店家的餐點。然而，若您需要訂購多個餐點，可以在訂餐時，調整訂購數量。'
            },
            {
              id: 4,
              title: '可以更換或客製化餐點嗎？',
              answer: '合作餐廳每天所提供的餐點皆是精心挑選的超值組合，且為該店家的招牌菜色，因此沒有提供更換菜色的服務。'
            },
            {
              id: 5,
              title: '預定餐點後能修改或取消訂單嗎？',
              answer: '在您下訂餐點後，可以在每天 23:59 以前修改或取消訂單；取餐當日則無法再變更訂單內容。'
            }
          ]
        },
        pickup: {
          title: '取餐問題',
          questions: [
            {
              id: 1,
              title: '有提供外送服務嗎？',
              answer: 'NextMeal 沒有提供外送服務，每份新鮮的餐點都需要您親自到場取餐。與我們合作的有上百家餐廳，相信一定可以在您的附近找到又近又能讓您滿意的餐點!'
            },
            {
              id: 2,
              title: '何時前往取餐？',
              answer: '在您預訂餐點時，可以選擇預定的取餐時間，當天您可以在該時間點直接到店領餐。'
            }
          ]
        },
        payment: {
          title: '付款問題',
          questions: [
            {
              id: 1,
              title: '付款方式有哪些？',
              answer: '目前僅提供線上刷卡服務。'
            }
          ]
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@include fadeAnimation;
@include slideAnimation;

.faq {
    &-title {
        color: color(primary);
        padding: 0 0 .5rem 1rem;

        &-wrapper {
            margin: 1.5rem 0 3rem 0;
        }
    }
}

.list {

    &-group {

        &-item {
            background-color: transparent;
            padding-top: 1.5rem;
        }
    }

    &-title {
        font-size: size(sm);
        margin-bottom: 1rem;
        font-weight: weight(bold);
    }

    &-description {
      font-size: size(xs);
    }
}
</style>
