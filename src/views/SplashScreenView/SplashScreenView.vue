<template>
    <ion-page>
        <ion-content fullscreen="true">
            <div class="container">
                <figure class="name"><img src="@/images/name.png" /></figure>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { IonPage, IonContent, onIonViewDidEnter } from '@ionic/vue';
import { lStore } from '@/functions';
import router from '@/router';
import { useRoute } from 'vue-router';

export default ({
    components: {
        IonPage,
        IonContent
    },
    data() {
        return {
            loginPaths: [
                "/home",
                "/splash",
                "/welcome",
                "/login",
            ],
        };
    },
    setup() {
        let route = useRoute();
        onIonViewDidEnter(() => {
            setTimeout(() => {
                if(!lStore.isset('user_info')) {
                    router.push('/welcome');
                }else if (!lStore.get('user_info')) {
                    if (this.loginPaths.includes(route.path)) return;
                    router.push('/login');
                    router.push('/loginadmin');
                }else if(lStore.isset('user_type') && lStore.get('user_type') == 1 && !route.path.includes('/admin/')){
                    router.push('/admin/reports');
                }
            }, 1500);
        });
    }
});
</script>

<style scoped>
ion-content {
    background: #fff !important;
    --background: #fff !important;
}

.container {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    margin: 0 auto;
}

.icon {
    position: relative;
    width: 100%;
    max-width: 20vw;
    margin: 0 0 15px;
    animation-name: fadeInDown;
    animation-duration: 1s;
    animation-fill-mode: both;
}

.name {
    position: relative;
    max-width: 60vw;
    margin: 0 auto;
    animation-name: fadeInTop;
    animation-duration: 1s;
    animation-fill-mode: both;
    display: flex;
}

@keyframes fadeInDown {
    0% {
        opacity: 0;
        top: -20%;
    }
    100% {
        opacity: 1;
        top: 0;
    }
}

@keyframes fadeInTop {
    0% {
        opacity: 0;
        bottom: -10%;
    }
    100% {
        opacity: 1;
        bottom: 0;
    }
}
</style>