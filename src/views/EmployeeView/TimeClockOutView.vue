<template>
    <ion-page>
         <BackButton :showButton = false bgColor="#FFF" :toggleHidden = true ></BackButton>
         <ion-header class="ion-head">
         </ion-header>
         <ion-content fullscreen="true" id="main-content" scroll-events="true">

            <ion-list lines="full">
                <ion-list-header color="danger">
                    <ion-label><ion-icon :icon="informationCircle"></ion-icon> Clockout Information</ion-label>
                </ion-list-header>
                <ion-item>
                    <ion-label color="medium"><span>Time Clockout:</span> {{ timers }}</ion-label>
                </ion-item>
                <ion-item>
                    <ion-label color="medium"><span>Date:</span> {{ new Date(readytoclockoutsched.schedules_dates).toLocaleDateString() }}</ion-label>
                </ion-item>
                <ion-item>
                    <ion-label color="medium"><span>Time Schedules:</span> {{ new Date(readytoclockoutsched.schedules_dates+' '+readytoclockoutsched.schedules_timestart).toLocaleTimeString('en-US', { hour12: true, hour: "2-digit", minute: "2-digit" }) }} - {{ new Date(readytoclockoutsched.schedules_dates+' '+readytoclockoutsched.schedules_timeend).toLocaleTimeString('en-US', { hour12: true, hour: "2-digit", minute: "2-digit" }) }}</ion-label>
                </ion-item>
                <ion-item>
                    <ion-label color="medium"><span>Facility:</span> {{ readytoclockoutsched.facility_name }}</ion-label>
                </ion-item>
            </ion-list>

            <ion-button class="ion-margin-top" expand="block" @click="ClockOut">Continue &raquo;</ion-button>

         </ion-content>
     </ion-page>
 </template>
 <script>
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonHeader,actionSheetController, IonList, IonLabel, IonItem, IonButton, IonIcon, IonListHeader } from '@ionic/vue';
import { lStore, axios, formatDateString,ImageDataConverter,openToast,calcFlyDist } from '@/functions';
import axiosA from 'axios';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import BackButton from '@/views/BackButton';
import { informationCircle } from 'ionicons/icons';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { Geolocation } from '@capacitor/geolocation';
defineCustomElements(window);
 
 
 export default defineComponent({
     name: 'DashboardView',
     components: { IonContent, IonPage, IonHeader,BackButton, IonList, IonLabel, IonItem, IonButton, IonIcon, IonListHeader },
     setup() {
         const logScrolling = (e) => {
             if (e.detail.scrollTop >= 20) {
                 document.querySelector('.ion-head').classList.add('ion-head-style');
             } else {
                 document.querySelector('.ion-head').classList.remove('ion-head-style');
             }
         }
         return { logScrolling, informationCircle };
     },
     data() {
         return{
             readytoclockoutsched: {},
             timers: lStore.get('timeOut'),
         }
     },
     mounted() {
        this.timers = new Date().toLocaleTimeString('en-US', { hour12: true, hour: "2-digit", minute: "2-digit" });
     },
     created() {
         
         let currentDate = new Date();
         let currentDateString = currentDate.toLocaleDateString().split('/');
         currentDateString = formatDateString(currentDateString[2] + '-' + currentDateString[0] + '-' + currentDateString[1]).replaceAll(' ','');
         let weekDate = new Date();
         weekDate.setDate(weekDate.getDate()+7);
         weekDate = weekDate.toLocaleDateString();
         let weekDateArr = weekDate.split('/');
         let weekDateString = formatDateString(weekDateArr[2]+'-'+weekDateArr[0]+'-'+weekDateArr[1]).replaceAll(' ','');
         axios.post(`schedule?_joins=assignschedules,assigndesignation,facility,role&_on=assignschedules_scheduleid=schedules_id,assigndesignation_id=assignschedules_assigndesignationid,schedules_facilityid=facility_id,role_id=assigndesignation_roleid&_GTE_schedules_dates=${currentDateString}&_LSE_schedules_dates=${weekDateString}&_batch=true&schedules_id=${lStore.get('scheduleclockoutid')}&_orderby=dates,schedules__timestart_ASC`).then(res=>{
             if(res.data.result == null)
             {
                 return;
             }
             res.data.result.forEach(element => {
                 this.readytoclockoutsched = element;
             });
         });
     },
     methods: {
         async setProfileImg(){
             const image = await Camera.getPhoto({
                 quality: 90,
                 allowEditing: true,
                 source: CameraSource.Camera,
                 resultType: CameraResultType.DataUrl
             });
 
             let blobObj = new ImageDataConverter(image.dataUrl);
             let blob = blobObj.dataURItoBlob()
             let form = new FormData();
             form.append('file',blob,'file.'+blobObj.getMimeString().replace(/\w+\//g,''));
 
             let action = await actionSheetController.create({
                 header: 'Confirm Image?',
                 buttons: [
                     {
                         text: 'Confirm',
                         data: {
                             action: 'confirm',
                         },
                     },
                     {
                         text: 'Choose Another',
                         data: {
                             action: 'redo',
                         },
                     },
                     {
                         text: 'Cancel',
                         role: 'cancel',
                         data: {
                             action: 'cancel',
                         },
                     }
                 ]
             })
 
             await action.present();
 
             action.onDidDismiss().then(res=>{
                 if(res.data == null) return;
                 if(res.data.action == 'cancel') return;
                 if(res.data.action == 'redo') {
                     this.setProfileImg();
                     return;
                 }
                 if(res.data.action == 'confirm') {
                     openToast('Saving Image', 'tertiary')
                     axiosA({
                         method:'post',
                         url: 'https://4angelshc.com/mobile/assign/updates?id='+this.readytoclockoutsched.assignschedules_id,
                         data : form
                     }).then(()=>{
                         this.loadImage = true;
                         let userFromLStore = this.readytoclockoutsched;
                         userFromLStore.assignschedules_clockoutselfie = image.dataUrl;
                         openToast('Successfully Added Image', 'primary');
                     })
                 }
 
             });
 
             
         },
         async ClockOut()
         {
        const coordinates = await Geolocation.getCurrentPosition({enableHighAccuracy:true});
        if(calcFlyDist([this.readytoclockoutsched.facility_location_long,this.readytoclockoutsched.facility_location_lat],[coordinates.coords.longitude,coordinates.coords.latitude]) <= 0.2)
        {

            let ClockoutTime = new Date(new Date().toLocaleDateString()+' '+lStore.get('time')).toLocaleTimeString('zh-Hans-CN');
            console.log(ClockoutTime);
            axios.post('assign/update?id='+this.readytoclockoutsched.assignschedules_id,null,{ assignschedules_timeout: ClockoutTime, assignschedules_status: 1,assignschedules_timeoutlocationname: await this.mapFind(coordinates.coords.longitude,coordinates.coords.latitude), assignschedules_timeoutlong: coordinates.coords.longitude, assignschedules_timeoutlat: coordinates.coords.latitude}).then(()=>{
                openToast('Successfully Clockout', 'light');
                setTimeout(()=>{
                    this.$router.push('employee/dashboard');
                },3000);
            })
        }
        else
        {
            openToast('You need to be near on the facility to clockout', 'danger');
            return;
        }
         },
         async mapFind(long,lat){
             let accessToken = "pk.eyJ1Ijoic3BlZWR5cmVwYWlyIiwiYSI6ImNsNWg4cGlzaDA3NTYzZHFxdm1iMTJ2cWQifQ.j_XBhRHLg-CcGzah7uepMA";
             let returnVal = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=${accessToken}`)
             return returnVal.data.features[0].place_name;
         },
     }
 });
 </script>
 
 <style scoped>

ion-list-header {
    padding: 0 0 0 15px;
    font-size: 20px;
}

ion-list-header ion-label {
    margin: 10px 0 12px;
}

ion-list-header ion-label ion-icon {
    position: relative;
    top: 6px;
    font-size: 25px;
}

ion-item ion-label span {
    color:#555; font-weight:bold;
}

ion-list {
    background: #fff;
}

 .mt{
     margin-top: 15px;
 }
 .item.sc-ion-label-ios-h, .item .sc-ion-label-ios-h{white-space: unset;}
 
 .noData{text-align: center; color: #959595; font-weight: bold;}
 
 .disabled2,.disabled{pointer-events: none;}
 .today {display: none;}
 .upcoming {display: none;}
 
 ion-menu ion-content {
     background: #fff;
     --background: #fff;
     --padding-top: 20px;
     --padding-bottom: 60px;
     --padding-start: 0;
     --padding-end: 0;
     --inner-padding-start: 0;
     --inner-padding-end: 0;
 }
 
 ion-label h1{color: #555;margin-bottom: 9px; border-left: 12px groove #1f94db; padding-left: 6px; text-transform: capitalize;font-size: 18px !important;}
 
 ion-item{margin-top: 15px;}
 
 ion-item p strong{color: #999;}
 
 .ion-head-style {
     background: linear-gradient(to top, #fff, #6cbcf0);
     padding-bottom: 10px;
 }
 
 ion-menu ion-list {
     padding: 0;
 }
 
 ion-menu ion-content ion-item ion-label {
     margin: 0;
 }
 
 ion-menu ion-content ion-item ion-button {
     width: 100%;
     margin: auto;
 }
 
 ion-header {
     z-index: 999;
 }
 
 ion-header {
     box-shadow: none;
 }
 
 ion-header::after {
     display: none;
 }
 
 ion-card {
     margin: 24px auto;
 }
 
 ion-card-title {
     font-size: 15px;
     margin: 6px auto 4px;
     color: #1f94db;
 }
 
 ion-text {
     font-size: 24px;
     display: block;
     text-align: center;
     padding: 0;
 }
 
 ion-text p {
     font-size: 50px;
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
     border-radius: 0 0 30px 30px;
 }
 
 .sub-header ion-card {
     margin: 0 auto 8px; 
     padding: 15px 0;
     border-radius: 25px;
 }
 
 .sub-header.hidden {
     top: -200px;
 }
 
 ion-header {
     box-shadow: none;
 }
 
 ion-header::after {
     display: none;
 }
 
 ion-text h3 {
     font-size: 18px;
     margin: 0;
 }
 
 ion-item p {
     color: #1f94db;
     font-weight: bold;
 }
 
 ion-item p span {
     display: block;
     color: #999999;
     margin-top: 2px;
     font-weight: normal;
 }
 
 ion-list {
     border-radius: 12px;
 }
 
 .approved {
     font-size: 13px;
     font-weight: bold;
     color: #999;
 }
 
 .approved ion-icon {
     position: relative;
     top: 2px;
     left: 1px;
 }
 
 ion-toolbar p {
     margin: 4px 0 0;
     font-size: 12px;
     color: #fff;
 }
 
 ion-title {
     color: #fff;
 }
 
 .avatar_wrap {
     position: relative;
 }
 
 .avatar_wrap p {
     text-align: center;
     color: #555;
     margin: 30px 0 15px;
 }
 
 .avatar_wrap img {
     width: 200px;
     margin: 0 auto;
     display: block;
 }
 
 .avatar_wrap ion-icon {
     position: absolute;
     right: 85px;
     bottom: 0;
     font-size: 25px;
 }
 
 .avatar_wrap ion-button {
     margin: 25px auto 0;
     text-align: center;
     display: block;
     width: 150px;
     max-width: 100%;
 }
 
 
 </style>