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
        <ImageHeaderBanner :background-photo="bannerImage">
          <template v-slot:header>
            <h1 class="banner-content-title">
              常見問題
            </h1>
          </template>
        </ImageHeaderBanner>
      </transition>
    </header>
    <section class="faq">
      <div class="container pt-3 pb-0 pb-md-5" />
    </section>
    <Footer />
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
      bannerImage: 'https://images.pexels.com/photos/929192/pexels-photo-929192.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      questions: [
        {
          id: 1,
          title: 'NextMeal 是什麼？',
          answer: `<p>NextMeal 平台提供餐點預訂的服務，您可以實惠的價格享受附近優質餐廳提供的招牌餐點。</p><p>每天 NextMeal 會為您隨機選出附近兩間優質餐廳，您可以在訂閱期間任何時段，使用點數快速預定隔日午餐，並於領餐時間前往餐廳取餐，免去等待排隊的煩惱。</p>`
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
          title: 'NextMeal 有推出晚餐時段的訂餐嗎？',
          answer: '很遺憾地，目前NextMeal只開放午餐時段的訂購。不過在不久的將來後便會開放晚餐與其他地區的餐點訂購!敬請期待!'
        },
        {
          id: 5,
          title: 'NextMeal 有提供外送服務嗎？',
          answer: 'NextMeal 沒有提供外送服務，每份新鮮的餐點都需要您親自到場取餐。與我們合作的有上百家餐廳，相信一定可以在您的附近找到又近又能讓您滿意的餐點!'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@include fadeAnimation;

.faq {
    @include headingStyling;
    &-heading {
      text-align: center;
    }
}
</style>
