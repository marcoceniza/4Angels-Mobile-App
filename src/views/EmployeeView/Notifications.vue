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
        <ion-content fullscreen="true">
            <ion-refresher style="position:relative; z-index:999;" slot="fixed">
                <ion-refresher-content refreshing-spinner="crescent"></ion-refresher-content>
            </ion-refresher>
            
            <ion-list v-for="notifs in this.notif" :key="notifs.id">
                <ion-item :class="(notifs.notifications_isseen > 0) ? 'isPending' : 'isRead'" lines="none" button @click="isSeen(notifs.notifications_id), $router.push('/employee/schedules')">
                    <ion-label>
                        <h1 class="ion-margin-bottom">{{ notifs.notifications_title }}</h1>
                        <p class="ion-text-wrap">Description: {{ notifs.notifications_description }}</p>
                        <p>Date: {{ dateFormat('%lm %d, %y', notifs.notifications_createdate) }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>
            
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonAvatar, IonButtons, IonToolbar, IonHeader, IonRefresher, IonRefresherContent, IonList, IonItem, IonLabel, IonTitle } from '@ionic/vue';
import { lStore, axios, dateFormat } from '@/functions';

export default defineComponent({
    name: 'EmployeeProfile',
    components: { IonContent, IonPage, IonAvatar, IonButtons, IonToolbar, IonHeader,IonRefresher, IonRefresherContent, IonList, IonItem, IonLabel, IonTitle },
    setup() {
        return {  };
    },
    data() {
        return {
            user: {},
            cifile: 'https://www.4angelshc.com/mobile/filesystem/',
            notif: ''
        }
    },
    created() {
        this.user = lStore.get('user_info');
    },
    methods: {
        dateFormat,
        isSeen(ID) {
            axios.post(`notifications/update?userid=${lStore.get('user_info').employee_id}&id=${ID}`, null, { notifications_isseen: 0 }).then(res => {
                if(!res.data.success) return;
                return true;
            });
        }
    },
    mounted() {
        setInterval(() => {
            axios.post(`notifications?_batch=true&notifications_userid=${lStore.get('user_info').employee_id}`).then(res => {
                if(!res.data.success) return;
                this.notif = res.data.result.reverse();
            });
        }, 1000);
    },
});
</script>

<style scoped>

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