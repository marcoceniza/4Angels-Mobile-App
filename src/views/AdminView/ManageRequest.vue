<template>
    <ion-page>
        <ion-toolbar class="title-toolbar ion-padding-top ion-padding-bottom">
            <ion-header class="header" no-border collapse="fade">
            
            <ion-toolbar class="main-header">
                <ion-buttons @click="presentActionSheet" slot="end"><ion-icon :icon="logOut"></ion-icon></ion-buttons>
                <ion-title>Request</ion-title>
            </ion-toolbar>
        </ion-header>
        </ion-toolbar>
        <ion-content id="notif_content" fullscreen="true" @click="showArrowNotif" @ionScroll="scrollTopNotif($event)" scroll-events >

            <ion-list>
                <ion-item lines="none">
                    <ion-select placeholder="Filter Request" interface="action-sheet" v-model="selectedReq">
                        <ion-select-option value="0">Schedule Application</ion-select-option>
                        <ion-select-option value="1">Reschedule Request</ion-select-option>
                        <ion-select-option value="2">Reassign Request</ion-select-option>
                    </ion-select>
                </ion-item>
            </ion-list>

            <ion-card v-for="request in requests" :key="request.id">
                <div v-if="selectedReq == '' || request.requests_type == selectedReq">
                    <ion-card-header>
                        <ion-card-title>{{ requestType(request.requests_type) }}</ion-card-title>
                        <ion-card-subtitle>{{ request.employee_firstname }} {{ request.employee_lastname }}</ion-card-subtitle>
                        <ion-card-subtitle>Request Created: {{ dateFormat('%lm %d, %y', request.requests_created_at) }}</ion-card-subtitle>
                    </ion-card-header>

                    <ion-card-content>
                        <strong>Reason:</strong> {{ request.requests_reason }}
                    </ion-card-content>

                    <ion-button @click="setOpen(true); viewRequest(request.requests_id)" fill="clear"><ion-icon :icon="eye"></ion-icon> View</ion-button>
                    <ion-button fill="clear"><ion-icon :icon="checkmarkCircle"></ion-icon> Accept</ion-button>
                    <ion-button fill="clear"><ion-icon :icon="closeCircle"></ion-icon> Denied</ion-button>
                </div>
            </ion-card>

            <p v-if="!hasData">no data</p>

            <ion-modal :is-open="isOpen">
                <ion-header>
                    <ion-toolbar class="ion-padding">
                        <ion-title>Details</ion-title>
                        <ion-buttons slot="end">
                            <ion-button color="light" @click="setOpen(false)"><ion-icon :icon="close"></ion-icon></ion-button>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <ion-list>
                        <ion-item-group>
                            <ion-item-divider class="ion-padding">
                                <ion-icon :icon="calendar" size="large"></ion-icon>
                                <ion-label>{{ requestType(viewedRequest.requests_type) }}</ion-label>
                            </ion-item-divider>
                            <ion-item lines="none">
                                <ion-label>Employee: {{ viewedRequest.employee_firstname }} {{ viewedRequest.employee_lastname }}</ion-label>
                            </ion-item>
                            <ion-item lines="none">
                                <ion-label>Status: {{ status(viewedRequest.requests_status) }}</ion-label>
                            </ion-item>
                            <ion-item lines="none">
                                <ion-label>Created At: {{ dateFormat('%lm %d, %y', viewedRequest.requests_created_at) }}</ion-label>
                            </ion-item>
                        </ion-item-group>
                    </ion-list>
                </ion-content>
            </ion-modal>

            <a class="scrollTopNotif" href="javascript:;"><ion-icon :icon="chevronUpCircle"></ion-icon></a>
            
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonButtons, IonToolbar, IonHeader, IonTitle, IonIcon, loadingController, actionSheetController, IonList, IonItem, IonSelect, IonSelectOption, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonModal, IonLabel, IonItemGroup, IonItemDivider } from '@ionic/vue';
import { lStore, axios, dateFormat } from '@/functions';
import { funnel, chevronUpCircle, notificationsCircle, logOut, eye, closeCircle, checkmarkCircle, close, calendar } from 'ionicons/icons';

export default defineComponent({
    name: 'NotificationsView',
    components: { IonContent, IonPage, IonButtons, IonToolbar, IonHeader, IonTitle, IonIcon, IonList, IonItem, IonSelect, IonSelectOption, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonModal, IonLabel, IonItemGroup, IonItemDivider },
    data() {
        return {
            user: {},
            cifile: 'https://www.4angelshc.com/mobile/filesystem/',
            notif: '',
            realtimeData: '',
            continueInterval: false,
            totalNotif: '',
            requests: '',
            selectedReq: '',
            isOpen: false,
            viewedRequest:{}
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

        return { funnel, chevronUpCircle, scrollTopNotif, notificationsCircle, logOut, eye, closeCircle, checkmarkCircle, close, calendar }
    },
    created() {
        this.user = lStore.get('user_info');
    },
    computed: {
        hasData(){
            if(this.requests.filter == null) return;
            return this.requests.filter(el=>this.selectedReq == '' || el.requests_type == this.selectedReq).length > 0
        },
    },
    methods: {
        dateFormat,
        viewRequest(ID) {
            for(let request in this.requests) {
                if(this.requests[request].requests_id == ID) {
                    this.viewedRequest = this.requests[request];
                    console.log(this.viewedRequest);
                }
            }
        },
        setOpen(isOpen) {
            this.isOpen = isOpen
        },
        status(num){
            let status = parseInt(num);
            switch(status){
                case 0: return 'Pending';
                case 1: return 'Approved';
                case 2: return 'Denied';
            }
        },
        requestType(num){            
            let type = parseInt(num);
            switch(type){
                case 0: return 'Schedule Application';
                case 1: return 'Reschedule Request';
                case 2: return 'Reassign Requests';
            }
        },
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
        axios.post(`requests?&_joins=schedules,employee&_on=requests.requests_schedulesid=schedules.schedules_id,requests.requests_employeeid=employee.employee_id&_batch=true`).then(res => {
            if(!res.data.success) return;
            this.requests = res.data.result;
        });
    },
});
</script>

<style scoped>

ion-item-divider ion-label {
    padding-left: 8px;
}

ion-card-title {
    font-size: 23px;
    padding-bottom: 5px;
}

ion-select {
    width: 100% !important;
}

ion-select ion-label {
    text-overflow: unset !important;
    overflow: unset !important;
}

ion-item ion-label {
    text-overflow: unset !important;
    overflow: unset !important;
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