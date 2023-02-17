<template>
    <ion-page>
        <ion-toolbar class="title-toolbar ion-padding-top ion-padding-bottom">
            <ion-header class="header" no-border collapse="fade">
            
            <ion-toolbar class="main-header">
                <ion-buttons slot="end">
                    <ion-avatar @click="$router.push('/employee/profile')">
                        <img :src="user.employee_profilepicture" v-if="user.employee_profilepicture != 'https://www.4angelshc.com/mobile/filesystem/'"/>
                        <img src="../../images/profile.svg" v-else/>
                    </ion-avatar>
                </ion-buttons>
                <ion-title>Notifications</ion-title>
            </ion-toolbar>
        </ion-header>
        </ion-toolbar>
        <ion-content id="notif_content" fullscreen="true" @click="showArrowNotif" @ionScroll="scrollTopNotif($event)" scroll-events >

            <div class="sortNotif">
                <p>Total: {{ this.totalNotif }}</p>
                <p><a href="javascript:;" @click="sortNotifHandler"><ion-icon :icon="funnel"></ion-icon></a></p>
            </div>
            
            <ion-list v-for="notifs in this.notif" :key="notifs.id">
                <ion-item :class="(notifs.notifications_isseen > 0) ? 'isPending' : 'isRead'" lines="none" button @click="isSeen(notifs.notifications_id), $router.push('/employee/schedules')">
                    <ion-label>
                        <h1 class="ion-margin-bottom">{{ notifs.notifications_title }}</h1>
                        <p class="ion-text-wrap">Description: {{ notifs.notifications_description }}</p>
                        <p>Date: {{ dateFormat('%lm %d, %y', notifs.notifications_createdate) }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>

            <a class="scrollTopNotif" href="javascript:;"><ion-icon :icon="chevronUpCircle"></ion-icon></a>
            
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonAvatar, IonButtons, IonToolbar, IonHeader, IonList, IonItem, IonLabel, IonTitle, IonIcon } from '@ionic/vue';
import { lStore, axios, dateFormat } from '@/functions';
import { funnel, chevronUpCircle, notificationsCircle } from 'ionicons/icons';

export default defineComponent({
    name: 'NotificationsView',
    components: { IonContent, IonPage, IonAvatar, IonButtons, IonToolbar, IonHeader, IonList, IonItem, IonLabel, IonTitle, IonIcon },
    data() {
        return {
            user: {},
            cifile: 'https://www.4angelshc.com/mobile/filesystem/',
            notif: '',
            realtimeData: '',
            continueInterval: false,
            totalNotif: ''
        }
    },
    setup() {
        const scrollTopNotif = (env) => {
            if(env.detail.scrollTop > 80) {
                document.querySelector('.scrollTopNotif').classList.add('showArrowNotif');
            }else {
                document.querySelector('.scrollTopNotif').classList.remove('showArrowNotif');
            }
        }

        return { funnel, chevronUpCircle, scrollTopNotif, notificationsCircle }
    },
    created() {
        this.user = lStore.get('user_info');
    },
    methods: {
        dateFormat,
        showArrowNotif() {
            document.getElementById('notif_content').scrollToTop(1500);
        },
        sortNotifHandler() {
            this.notif.reverse();
            clearInterval(this.realtimeData);
        },
        isSeen(ID) {
            axios.post(`notifications/update?userid=${lStore.get('user_info').employee_id}&id=${ID}`, null, { notifications_isseen: 0 }).then(res => {
                if(!res.data.success) return;
               return true; 
            });
        }
    },
    mounted() {
        this.realtimeData = setInterval(() => {
            axios.post(`notifications?_batch=true&notifications_userid=${lStore.get('user_info').employee_id}&_orderedby=notifications__createdate_DESC`).then(res => {
                if(!res.data.success) return;
                this.notif = res.data.result;
                this.totalNotif = Object.keys(this.notif).length;
            });
        }, 1000);
    },
});
</script>

<style scoped>

.scrollTopNotif {
    position: fixed;
    bottom: 15px;
    right: 12px;
    z-index: 9999;
    display: block;
    font-size: 35px;
    color: #000;
    display: none;
}

.sortNotif {
    text-align: right;
    margin: 10px 0 8px;
    display: flex;
    justify-content: space-between;
}

.sortNotif ion-icon {
    color: #92949c;
}

.sortNotif p {
    margin: 0;
}

.sortNotif p:first-child {
    font-size: 14px;
    font-style: italic;
    color: #999;
}

.showArrowNotif {
    display: block;
}

.showArrowNotif a {
    color: #000;
}

ion-menu ion-content ion-item ion-label {
    margin: 0;
}

ion-menu ion-content ion-item ion-button {
    width: 100%;
    margin: auto;
}

ion-avatar img {
    padding: 3px;
    border: 3px solid #fff;
}

ion-header {
    z-index: 200;
}

ion-header.hidden {
	max-height: 104px;
	margin-bottom: 104px;
}

.ios ion-header.hidden {
	max-height: 88px;
	margin-bottom: 88px;
}

.main-header {
    position: relative;
    z-index: 2;
}

.sub-header {
    position: relative;
    top: 0;
    --padding-top: 0;
    transition: top ease-in-out 500ms;
    z-index: 1;
}

.sub-header ion-card {
    margin: 0 auto 8px; 
    padding: 15px 0;
    border-radius: 25px;
}

.sub-header.hidden {
    top: -250px;
}

ion-header {
    box-shadow: none;
}

ion-header::after {
    display: none;
}

ion-title {
    --text-align: left !important; 
    font-size: 21px; 
    --padding: 0 !important;
}

ion-title span {
    display: block;
    color: #1f94db;
    font-weight: bold;
}

ion-list ion-item {
    border: 1px solid #ddd;
    margin-bottom: 6px;
}

.isRead {
    border-left: 6px solid #999999 !important;
    --background: #e3e3e3 !important;
}
.isPending {
    border-left: 6px solid #1f94db !important;
    --background: #dbf0fd !important;
}

ion-toolbar {
    --min-height: 0;
    padding: 0;
}

ion-toolbar ion-text {
    text-align: center;
    display: block;
    margin: 0 auto;
}

ion-label h1 {
    margin-bottom: 8px;
}

</style>