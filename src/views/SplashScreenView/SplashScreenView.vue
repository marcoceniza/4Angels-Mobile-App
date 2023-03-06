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
                if(!lStore.isset('user_token')) {
                    router.push('/welcome');
                }else if (!lStore.get('user_token')) {
                    if (this.loginPaths.includes(route.path)) return;
                    router.push('/login');
                    router.push('/loginadmin');
                }else if(lStore.isset('user_type') && lStore.get('user_type') == 1 && !route.path.includes('/admin/')){
                    router.push('/admin/reports');
                }
            }, 1500);
            // if(!lStore.isset('user_token')) {
            //     setTimeout(() => {
            //         router.push('/welcome');
            //     }, 1500);
            // } else {
            //     setTimeout(() => {
            //         router.replace('/employee/dashboard');
            //     }, 1500);
            // }
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
    width: 100%;
    max-width: 60vw;
    margin: 0;
    animation-name: fadeInTop;
    animation-duration: 1s;
    animation-fill-mode: both;
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