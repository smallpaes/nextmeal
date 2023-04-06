<template>
  <section class="not-found">
    <TopLogoNavbar />
    <div class="message-container">
      <div class="message-video-container">
        <video
          class="message-video"
          autoplay
          muted
          loop
        >
          <source
            :src="videoUrl"
            type="video/mp4"
          >
        </video>
      </div>
      <div class="message-content">
        <h1 class="message-content-heading">
          404
        </h1>
        <h3 class="message-content-description">
          你想找的頁面被當成美食吃掉了
        </h3>
        <p class="message-content-subdescription">
          但還有許多美食等者你探索呢
        </p>
        <button
          class="home-btn btn mt-2"
          @click="$route.path === '/' ? $router.go() : $router.push('/')"
        >
          回首頁
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { formFullUrl } from '../utils/image-url'
import TopLogoNavbar from '../components/Navbar/TopLogoNavbar'

export default {
  components: {
    TopLogoNavbar
  },
  data () {
    return {
      videoUrl: formFullUrl('/Video/grill.mp4')
    }
  }
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Indie+Flower&display=swap');

.not-found {
  height: 100vh;
  width: 100vw;
}

.message {
  @include positionCenter;

  &-container { height: 100%; }

  &-video-container {
    height: 100%;
    overflow: hidden;
  }

  // make video responsive
  &-video {
    width: 189.62962963vh;
    min-width: 100%;
    height: 100%;
    min-height: 52.734375vw;
  }

  &-content {
    width: 100%;
    color: color(quaternary);
    text-shadow: 1px 1px 1px lighten(color(secondary), 20%);

    &-heading {
      font-family: 'Indie Flower', cursive;
      font-size: 7rem;
    }

    &-description {
      font-size: size(sm);
      font-weight: weight(bold);

      @include response(sm) { font-size: size(md); }
      @include response(md) { font-size: size(lg); }
    }

    &-subdescription {
      font-size: size(xs);
      font-weight: weight(bold);

      @include response(sm) { font-size: size(sm); }
      @include response(md) { font-size: size(md); }
    }
  }
}

.home-btn {
  @include solidButton;
  min-width: 120px;
  font-size: size(xs);
  text-shadow: none;

  @include response(sm) {
    min-width: 150px;
    font-size: size(sm);
  }

  @include response(md) { min-width: 200px; }
}
</style>
