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
                <ion-title>Timesheets</ion-title>
            </ion-toolbar>
        </ion-header>
        </ion-toolbar>
        <ion-content id="timesheets_content" fullscreen="true" @click="showArrowTimesheets" @ionScroll="scrollTopTimesheets($event)" scroll-events>

            <div class="sortTimesheets">
                <p>Total: {{ this.totalTimesheets }}</p>
                <p><a href="javascript:;" @click="sortTimesheetsHandler"><ion-icon :icon="funnel"></ion-icon></a></p>
            </div>

            <ion-list v-for="timesheet in timesheets" :key="timesheet.id">
                <ion-item lines="none" class="doneSchedules">
                    <ion-label class="ion-text-wrap">
                        <h1>{{ timesheet.role_name }}</h1>
                        <p>Location: {{ timesheet.facility_location }}</p>
                        <p>Date: {{ dateFormat('%lm %d, %y', timesheet.schedules_dates) }}</p>
                        <p>ID: {{ timesheet.assigndesignation_employeeid }}</p>
                    </ion-label>
                </ion-item>
            </ion-list>

            <a class="scrollTopTimesheets" href="javascript:;"><ion-icon :icon="chevronUpCircle"></ion-icon></a>
        
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonAvatar, IonButtons, IonToolbar, IonHeader, IonList, IonItem, IonLabel, IonTitle, IonIcon } from '@ionic/vue';
import { lStore, axios, dateFormat } from '@/functions';
import { funnel, chevronUpCircle } from 'ionicons/icons';

export default defineComponent({
    name: 'TimesheetsView',
    components: { IonContent, IonPage, IonAvatar, IonButtons, IonToolbar, IonHeader, IonList, IonItem, IonLabel, IonTitle, IonIcon },
    data() {
        return {
            user: {},
            cifile: 'https://www.4angelshc.com/mobile/filesystem/',
            notif: '',
            timesheets: '',
            totalTimesheets: ''
        }
    },
    created() {
        this.user = lStore.get('user_info');
    },
    setup() {
        const scrollTopTimesheets = (env) => {
            if(env.detail.scrollTop > 80) {
                document.querySelector('.scrollTopTimesheets').classList.add('showArrowTimesheets');
            }else {
                document.querySelector('.scrollTopTimesheets').classList.remove('showArrowTimesheets');
            }
        }
        return { funnel, chevronUpCircle, scrollTopTimesheets }
    },
    methods: {
        dateFormat,
        showArrowTimesheets() {
            document.getElementById('timesheets_content').scrollToTop(1500);
        },
        sortTimesheetsHandler() {
            this.timesheets.reverse()
            clearInterval(this.realtimeData2);
        }
    },
    mounted() {
        this.realtimeData2 = setInterval(() => {
            axios.post(`userDesignations?_joins=assignschedules,schedules,facility,role&_on=assigndesignation_id=assignschedules_assigndesignationid,schedules_id=assignschedules_scheduleid,facility_id=assigndesignation_facilityid,role_id=assigndesignation_roleid&assigndesignation_employeeid=${lStore.get('user_info').employee_id}&_batch=true&_orderedby=schedules__dates_DESC`).then(res => {
                if(!res.data.success) return;
                this.timesheets = res.data.result;
                this.totalTimesheets = Object.keys(this.timesheets).length;
            });
        }, 1000)
    },
});
</script>

<style scoped>

.scrollTopTimesheets {
    position: fixed;
    bottom: 15px;
    right: 12px;
    z-index: 9999;
    display: block;
    font-size: 35px;
    color: #000;
    display: none;
}

.sortTimesheets {
    text-align: right;
    margin: 10px 0 8px;
    display: flex;
    justify-content: space-between;
}

.sortTimesheets ion-icon {
    color: #92949c;
}

.sortTimesheets p {
    margin: 0;
}

.sortTimesheets p:first-child {
    font-size: 14px;
    font-style: italic;
    color: #999;
}

.showArrowTimesheets {
    display: block;
}

.sortTimesheets a {
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

.doneSchedules {
    border-left: 6px solid #999999 !important;
    --background: #f2f2f2 !important;
}

</style>