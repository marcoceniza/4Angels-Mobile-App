<template>
  <ion-page>
    <ion-content>
      <div class="welcome">
        <ion-text color="primary">
          <h2>Welcome</h2>
        </ion-text>
        <p class="ion-text-wrap">Please Sign in to continue using our app</p>
      </div>
      <swiper :modules="modules" effect="flip" :autoplay="true" :pagination="true">
          <swiper-slide><img src="../images/welcome_graphics3.svg" alt="Welcome"/></swiper-slide>
          <swiper-slide><img src="../images/welcome_graphics4.svg" alt="Welcome"/></swiper-slide>
          <swiper-slide><img src="../images/welcome_graphics2.svg" alt="Welcome"/></swiper-slide>
      </swiper>
      <div class="flex">
        <ion-button expand="block" size="large" @click="$router.push('/login')">Sign In</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
  import { Autoplay, EffectFlip, Pagination } from 'swiper';
  import { Swiper, SwiperSlide } from 'swiper/vue';
  import { IonContent, IonPage, IonButton, IonText } from '@ionic/vue';

  import 'swiper/css';
  import 'swiper/css/bundle';

  export default({
    name: 'WelcomePage',
    components: { Swiper, SwiperSlide, IonContent, IonPage, IonButton, IonText },
    setup() {
      return {
        modules: [EffectFlip, Pagination, Autoplay]
      };
    }
  });

</script>

<style scoped>
ion-content {
    --padding-top: 0;
    --padding-bottom: 0;
    --padding-start: 0;
    --padding-end: 0;
}

.welcome ion-text h2 {
    font-size: 2em;
    font-weight: bold;
    color: #1f94db;
    margin: 0 0 10px;
    text-align: center;
}

.flex {
    display: flex;
    justify-content: center;
    align-items: center;
}

ion-button {
  width: 47%;
}

.welcome {
  margin: 70px 0 0;
}

.welcome p {
  margin: 0 auto;
  text-align: center;
  font-size: 16px;
  padding: 0 10vw;
}

.graphics {
    display: block;
    margin: 30px auto;
}

.graphics img {
    width: 100% !important;
    height: 50vh !important;
}

.swiper {
  margin: 70px 0 90px;
}

.swiper .swiper-slide img {
  width: 300px;
}

</style>