<template>
    <ion-page>
        <ion-toolbar class="title-toolbar ion-padding-top ion-padding-bottom">
            <ion-header class="header" no-border collapse="fade">
            
            <ion-toolbar class="main-header">
                <ion-buttons @click="presentActionSheet" slot="end"><ion-icon :icon="logOut"></ion-icon></ion-buttons>
                <ion-title>Reports</ion-title>
            </ion-toolbar>
        </ion-header>
        </ion-toolbar>
        <ion-content id="notif_content" fullscreen="true" @click="showArrowNotif" @ionScroll="scrollTopNotif($event)" scroll-events >
            
            <div class="greetings_wrap">
                <ion-text class="ion-padding-start ion-margin-top" color="primary">Hello {{ user.users_username}}</ion-text>
                <p class="ion-padding-start">{{ getMonthToday }} {{ new Date().getDate() }}, {{ new Date().getFullYear() }}</p>
            </div>

            <ion-grid>
                <ion-row>
                    <ion-col>
                        <ion-card>
                            <ion-card-header>
                                <ion-card-title>15</ion-card-title>
                            </ion-card-header>
                            <ion-icon :icon="server"></ion-icon>
                            <ion-card-content>Total Facility</ion-card-content>
                        </ion-card>

                        <ion-card>
                            <ion-card-header>
                                <ion-card-title>23</ion-card-title>
                            </ion-card-header>
                            <ion-icon :icon="person"></ion-icon>
                            <ion-card-content>Total Supervisor</ion-card-content>
                        </ion-card>
                    </ion-col>

                    <ion-col>
                        <ion-card>
                            <ion-card-header>
                                <ion-card-title>12</ion-card-title>
                            </ion-card-header>
                            <ion-icon :icon="person"></ion-icon>
                            <ion-card-content>Total Managers</ion-card-content>
                        </ion-card>

                        <ion-card>
                            <ion-card-header>
                                <ion-card-title>$97.02</ion-card-title>
                            </ion-card-header>
                            <ion-icon :icon="trendingUp"></ion-icon>
                            <ion-card-content>Total Revenue</ion-card-content>
                        </ion-card>
                    </ion-col>

                </ion-row>
            </ion-grid>

            <a class="scrollTopNotif" href="javascript:;"><ion-icon :icon="chevronUpCircle"></ion-icon></a>
            
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonButtons, IonToolbar, IonHeader, IonTitle, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonText, loadingController, actionSheetController } from '@ionic/vue';
import { lStore, axios, dateFormat } from '@/functions';
import { funnel, chevronUpCircle, notificationsCircle, logOut, server, trendingUp, person } from 'ionicons/icons';

export default defineComponent({
    name: 'NotificationsView',
    components: { IonContent, IonPage, IonButtons, IonToolbar, IonHeader, IonTitle, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, IonText },
    data() {
        return {
            user: {},
            cifile: 'https://www.4angelshc.com/mobile/filesystem/',
            notif: '',
            realtimeData: '',
            continueInterval: false,
            totalNotif: '',
            getMonthToday: ''
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

        return { funnel, chevronUpCircle, scrollTopNotif, notificationsCircle, logOut, server, trendingUp, person }
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
        },
        async openLoader() {
            const loading = await loadingController.create({
                message: 'Logging Out...',
                cssClass: 'custom-loading'
            });
            return loading.present();
        },
        async openActionSheet() {
            const openSheet = await actionSheetController.create({
                header: 'Are you sure you want to log out?',
                buttons: [
                    {
                        text: 'Log Out',
                        role: 'destructive',
                        handler: () => {
                            this.openLoader().then(()=>{
                                this.logout();
                            });
                        },
                    },
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        data: {
                            action: 'cancel',
                        },
                    },
                ],
            });
            return openSheet.present();
        },
        async presentActionSheet() {
            this.openActionSheet();
        },
        logout() {
            loadingController.dismiss();
            localStorage.clear();
            this.$router.push('/loginadmin');
            setTimeout(() => {
                window.location.reload();
            }, 1500)
        },
    },
    mounted() {
        const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        
        let month = months[new Date().getMonth()].toUpperCase();
        this.getMonthToday = month;

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

.greetings_wrap ion-text {
    font-size: 30px;
    display: block;
}

.greetings_wrap ion-text p {
    font-size: 50px;
}

.greetings_wrap p {
    margin: 4px 0 0;
    font-size: 12px;
    color: #888;
}

ion-grid ion-col {
    padding: 0;
}

ion-col ion-card {
    margin-inline: 4px;
}

ion-card ion-icon {
    font-size: 35px;
    position: absolute;
    right: 5px;
    top: 5px;
}

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

.main-header ion-icon {
    font-size: 28px;
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