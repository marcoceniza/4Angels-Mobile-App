<template>
    <ion-page>
        <div class="Schedule_modal" :class="{openModal:openModal != 0}">
            <div class="Schedule_modal_box" v-if="openModal == 1">
                <h2>{{openedSchedule.role_name}}</h2>
                <div class="grid">
                    <p>Schedule ID:</p><div><span>{{openedSchedule.schedules_id}}</span></div>
                    <p>Schedule Date:</p><div><span>{{dateFormat('%lm %d, %y',openedSchedule.schedules_dates)}}</span></div>
                    <p>Schedule Start:</p><div><span>{{dateFormat('%h:%i%a','2022-01-01 '+openedSchedule.schedules_timestart)}}</span></div>
                    <p>Schedule End:</p><div><span>{{dateFormat('%h:%i%a','2022-01-01 '+openedSchedule.schedules_timeend)}}</span></div>
                    <p>Branch:</p><div><span>{{openedSchedule.facility_name}}</span></div>
                    <p>Branch Location:</p><div><span>{{openedSchedule.facility_location}}</span></div>
                    <p>Description:</p><div><span>{{openedSchedule.schedules_description}}</span></div>
                    <p v-if="scheduleShowStatus(openedSchedule) != false">Status:</p><div><span>{{scheduleShowStatus(openedSchedule)[1]}}</span></div>
                </div>

                <ion-button expand="block" @click="openModal=0">Close</ion-button>
            </div>

            <div class="Schedule_modal_box" v-if="openModal == 2">
                <h2>Reschedule Request - <span style="display:inline-block">{{openedSchedule.role_name}} Personnel</span></h2>
                <div class="grid">
                    <p>Schedule ID:</p><div><span>{{openedSchedule.schedules_id}}</span></div>
                    <p>Schedule Date:</p><div><span>{{dateFormat('%lm %d, %y',openedSchedule.schedules_dates)}}</span></div>
                    <p>Schedule Start:</p><div><span>{{dateFormat('%h:%i%a','2022-01-01 '+openedSchedule.schedules_timestart)}}</span></div>
                    <p>Schedule End:</p><div><span>{{dateFormat('%h:%i%a','2022-01-01 '+openedSchedule.schedules_timeend)}}</span></div>
                </div>
                <div class="separator"></div>
                <div class="grid">
                    <p>Reschedule Date:</p><div><input type="date" v-model="openedSchedule.requests_resched_date"></div>
                    <p>From:</p><div><input type="time" :value="openedSchedule.requests_resched_timestart" @input="autoEndTime"></div>
                    <p>To:</p><div><input type="time" readonly v-model="openedSchedule.requests_resched_timeend"></div>
                    <p>Reason</p><div><textarea v-model="openedSchedule.requests_reason" placeholder="Enter your reason here..." type="text"></textarea></div>
                </div>

                <div class="button_col2">
                    <ion-button expand="block" @click="submitReschedRequest">Submit</ion-button>
                    <ion-button expand="block" @click="openModal=0">Close</ion-button>
                </div>
            </div>

            <div class="Schedule_modal_box" v-if="openModal == 3">
                <h2>Reassign Request - <span style="display:inline-block">{{openedSchedule.role_name}}</span></h2>
                <div class="grid">
                    <p>Schedule ID:</p><div><span>{{openedSchedule.schedules_id}}</span></div>
                    <p>Schedule Date:</p><div><span>{{dateFormat('%lm %d, %y',openedSchedule.schedules_dates)}}</span></div>
                    <p>Schedule Start:</p><div><span>{{dateFormat('%h:%i%a','2022-01-01 '+openedSchedule.schedules_timestart)}}</span></div>
                    <p>Schedule End:</p><div><span>{{dateFormat('%h:%i%a','2022-01-01 '+openedSchedule.schedules_timeend)}}</span></div>
                </div>

                <div class="separator"></div>
                <strong>Please recommend an employee who is willing to take this schedule</strong>
                <div class="employee_datalist">
                    <input v-model="searchEmployee" placeholder="Select employee...">
                    <ul>
                        <li v-for="e,i in filterEmployees" :key="i" @click="openedSchedule.requests_reassign_employeeid = e.employee_id;searchEmployee = e.employee_firstname+' '+e.employee_lastname">
                            <p>
                                {{e.employee_firstname}} {{e.employee_lastname}}
                            </p>
                        </li>
                    </ul>
                </div>

                <strong class="title">Reason</strong>

                <textarea v-model="openedSchedule.requests_reason" placeholder="Enter your reason here..." type="text"></textarea>

                <div class="button_col2">
                    <ion-button expand="block" @click="submitReassignRequest">Submit</ion-button>
                    <ion-button expand="block" @click="openModal=0">Close</ion-button>
                </div>
            </div>
        </div>

        <ion-header class="header" no-border collapse="fade">
            
            <ion-toolbar class="main-header">
                <ion-buttons slot="end">
                    <ion-avatar @click="$router.push('/employee/profile')">
                        <img :src="user.employee_profilepicture" v-if="user.employee_profilepicture != 'https://www.4angelshc.com/mobile/filesystem/'"/>
                        <img src="../../images/profile.svg" v-else/>
                    </ion-avatar>
                </ion-buttons>
                <ion-title>Schedules</ion-title>
            </ion-toolbar>
            <ion-toolbar class="sub-header sub-header2 ion-padding-bottom">
                <ion-datetime @ionChange="setDate" presentation="date"></ion-datetime>
            </ion-toolbar>
        </ion-header>
        <ion-content fullscreen="true" scroll-events="true" class="scrollContent" @ionScroll="scrollTopContent($event)">
            <ion-refresher style="position:relative; z-index:999;" slot="fixed" @ionRefresh="handleRefresh($event)">
                <ion-refresher-content refreshing-spinner="crescent"></ion-refresher-content>
            </ion-refresher>

            <div class="noData" v-if="schedulesToday == ''">
                <img src="@/images/noData.svg" alt="No Data">
            </div>

            <ion-list class="ion-margin-top" v-for="st in schedulesToday" :key="st.id">
                <ion-item button lines="none" @click="openActionSheet(st.schedules_id)" :style="'border-left: 6px solid '+st.role_color">
                    <ion-label>
                        <h2>{{st.role_name}}
                        </h2>
                        <p>Start Time: {{dateFormat('%h:%i%a',selectedDate+' '+st.schedules_timestart)}}</p>
                        <p>End Time: {{dateFormat('%h:%i%a',selectedDate+' '+st.schedules_timeend)}}</p>
                        <p>Date: {{dateFormat('%lm %d, %y',st.schedules_dates)}}</p>
                        <small class="schedStatus" v-if="scheduleShowStatus(st) != false">
                            <ion-icon :icon="scheduleShowStatus(st)[0]"></ion-icon>
                            {{scheduleShowStatus(st)[1]}}
                        </small>
                    </ion-label>
                </ion-item>
            </ion-list>

            <div class="scrollTop" v-show="showArrow" @click="clickToTop">
                <ion-icon :icon="arrowUpCircle" size="large"></ion-icon>
            </div>

        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonHeader, IonToolbar, IonDatetime, IonIcon,actionSheetController, IonTitle, IonButtons, IonRefresher, IonRefresherContent, IonButton, IonAvatar, IonLabel, IonItem, IonList } from '@ionic/vue';
import { stopwatch, calendar, checkmarkDoneCircle, clipboard, arrowUpCircle } from 'ionicons/icons';
import { axios, lStore,dateFormat, openToast, validateForm } from '@/functions';

export default defineComponent({
    name: 'SchedulesView',
    components: { IonIcon,IonContent, IonPage, IonHeader, IonToolbar, IonDatetime, IonTitle, IonButtons, IonRefresher, IonRefresherContent, IonButton, IonAvatar, IonLabel, IonItem, IonList },
    setup() {
        const clickToTop = () => {
            const scrollContent = document.querySelector('ion-content.scrollContent');
            scrollContent.scrollToTop(1000);
        }

        return { clickToTop };
    },
    data() {
        return{
            formLoading1: false,
            task: null,
            message: null,
            schedulesToday:[],
            cifile: 'https://www.4angelshc.com/mobile/filesystem/',
            takenSchedulesToday: [],
            noProfilePic: false,
            selectedDate:'2022-01-01',
            user: {},
            facility: '',
            getMonthToday: '',
            isOpen: false,
            openModal: 0,
            openedSchedule:{},
            allowedRoles:{},
            showArrow: false,
            searchEmployee:'',
            employees:[],

            stopwatch, calendar, checkmarkDoneCircle, clipboard, arrowUpCircle
        }
    },
    created() {
        this.user = lStore.get('user_info');
        this.path = this.cifile+this.user.employee_id;
    },
    mounted() {
        let date = new Date().toLocaleDateString();
        date = date.split('/')[2]+'-'+date.split('/')[0]+'-'+date.split('/')[1];
        this.selectedDate = date;

        this.allowedRoles = {};

        axios.post(`UserDesignations?_batch=true&assigndesignation_employeeid=${lStore.get('user_info').employee_id}`).then(res=>{
            res.data.result.forEach(el=>{
                this.allowedRoles[el.assigndesignation_facilityid] = el;
            })
        });

        let selectedDate = new Date().toLocaleDateString('zh-Hans-CN',{
                year:'numeric',
                month:'2-digit',
                day: '2-digit'
            }).replaceAll('/','-');
            
        this.setDate(selectedDate);
    },
    computed:{
        filterEmployees(){
            let filtered = this.employees.filter(el=>{
                let name1 = el.employee_lastname+' '+el.employee_firstname;
                let name2 = el.employee_firstname+' '+el.employee_lastname;
                return (
                    ((name1.toLowerCase().includes(this.searchEmployee.toLowerCase()) ||
                    name2.toLowerCase().includes(this.searchEmployee.toLowerCase())) ||
                    this.searchEmployee == '') && el.assigndesignation_roleid == this.openedSchedule.schedules_roleid
                );
            });
            return filtered;
        },
    },
    methods: {
        dateFormat,
        fetchEmployees(facilityId){
            console.log(facilityId);
            axios.post(`UserDesignations?
            assigndesignation_facilityid=${facilityId}
            &_batch=true
            &_joins=employee,role
            &_on=
            employee.employee_id=assigndesignation.assigndesignation_employeeid,
            role.role_id=assigndesignation.assigndesignation_roleid`)
            .then(res=>{
                // res.data = axios.decryptToJSON(res.data);
                // if(!res.data) return;
                this.employees = res.data.result

                console.log(this.employees);
            });
        },
        async submitReassignRequest(){
            let schedStart = new Date(this.openedSchedule.schedules_dates+' '+this.openedSchedule.schedules_timestart);
            let curDateTime = new Date();
            console.log(schedStart,curDateTime,curDateTime.getTime() >= schedStart.getTime());
            if(curDateTime.getTime() >= schedStart.getTime()) {
                openToast('You cannot request to reschedule a schedule that has started already!','warning');
                return;
            }

            let valid = validateForm(this.openedSchedule,{
                requests_reassign_employeeid:"required"
            });

            if(!valid.allValid){
                openToast('Please select an employee!','danger');
                return;
            }

            const openSheet = await actionSheetController.create({
                header: 'Confirm Reassign Request?',
                buttons: [
                    { text: 'Yes',  data: {action: 'apply'}},
                    { text: 'No',   role: 'cancel',    data: {action: 'cancel'}}
                ],
            });

            await openSheet.present();
            openSheet.onDidDismiss().then(res=>{
                if(res.data.action != 'apply') return;

                axios.post(`requests?requests_type=2&requests_employeeid=${lStore.get('user_id')}&requests_schedulesid=${this.openedSchedule.schedules_id}&_orderby=id_DESC`).then(res=>{
                    // if(res.data.result != null && new Date(res.data.result.requests_created_at).toLocaleDateString() == new Date().toLocaleDateString()){
                    if(res.data.result != null){
                        openToast('You can only do one reassign request per schedule!','danger');
                        return;
                    }

                    axios.post('requests/create',null,{
                        requests_type: 2,
                        requests_employeeid : lStore.get('user_id'),
                        requests_schedulesid : this.openedSchedule.schedules_id,
                        requests_reassign_employeeid: this.openedSchedule.requests_reassign_employeeid,
                        requests_reason: this.openedSchedule.requests_reason ?? '',
                        requests_created_at: new Date().toLocaleString('zh-Hans-CN').replaceAll('-',''),
                        requests_updated_at: new Date().toLocaleString('zh-Hans-CN').replaceAll('-','')
                    }).then(()=>{
                        window.location.reload();
                    })
                })
            });

        },
        async submitReschedRequest(){
            let schedStart = new Date(this.openedSchedule.schedules_dates+' '+this.openedSchedule.schedules_timestart);
            let curDateTime = new Date();
            console.log(schedStart,curDateTime,curDateTime.getTime() >= schedStart.getTime());
            if(curDateTime.getTime() >= schedStart.getTime()) {
                openToast('You cannot request to reschedule a schedule that has started already!','warning');
                return;
            }

            let valid = validateForm(this.openedSchedule,{
                requests_resched_date:"required",
                requests_resched_timestart: "required",
                requests_resched_timeend: "required"    
            });
            
            if(!valid.allValid){
                openToast('All fields are required!','danger');
                return;
            }

            if(new Date(this.openedSchedule.requests_resched_date+' '+this.openedSchedule.requests_resched_timestart) < new Date()){
                openToast('The reschedule datetime should be later than the current datetime!','danger');
                return;
            }

            const openSheet = await actionSheetController.create({
                header: 'Confirm Reschedule Request?',
                buttons: [
                    { text: 'Yes',  data: {action: 'apply'}},
                    { text: 'No',   role: 'cancel',    data: {action: 'cancel'}}
                ],
            });

            await openSheet.present();
            openSheet.onDidDismiss().then(res=>{
                if(res.data.action != 'apply') return;

                axios.post(`requests?requests_type=1&requests_employeeid=${lStore.get('user_id')}&requests_schedulesid=${this.openedSchedule.schedules_id}&_orderby=id_DESC`).then(res=>{
                    // if(res.data.result != null && new Date(res.data.result.requests_created_at).toLocaleDateString() == new Date().toLocaleDateString()){
                    if(res.data.result != null){
                        openToast('You can only do one reschedule request per schedule!','danger');
                        return;
                    }

                    axios.post('requests/create',null,{
                        requests_type: 1,
                        requests_employeeid : lStore.get('user_id'),
                        requests_schedulesid : this.openedSchedule.schedules_id,
                        requests_resched_date: this.openedSchedule.requests_resched_date,
                        requests_resched_timestart: this.openedSchedule.requests_resched_timestart,
                        requests_resched_timeend: this.openedSchedule.requests_resched_timeend,
                        requests_reason: this.openedSchedule.requests_reason ?? '',
                        requests_created_at: new Date().toLocaleString('zh-Hans-CN').replaceAll('-',''),
                        requests_updated_at: new Date().toLocaleString('zh-Hans-CN').replaceAll('-','')
                    }).then(()=>{
                        window.location.reload();
                    })
                })
            });
        },
        autoEndTime(e){
            this.openedSchedule.requests_resched_timestart = e.target.value;
            
            let difference = new Date('2001-01-01 '+this.openedSchedule.schedules_timeend).getTime() - new Date('2001-01-01 '+this.openedSchedule.schedules_timestart).getTime();
            let newEndTime = new Date('2001-01-01 '+e.target.value);
            newEndTime.setTime(newEndTime.getTime()+difference);

            this.openedSchedule.requests_resched_timeend = newEndTime.toLocaleTimeString('zh-Hans-CN',{hour12:false,hour:'2-digit',minute:'2-digit'});
        },
        scrollTopContent(evn) {
            if(evn.detail.scrollTop >= 100) {
                this.showArrow = true;
            } else {
                this.showArrow = false;
            }
        },
        scheduleShowStatus(sched){
            if(sched.assignschedules_id == null) return false;
            if(sched.assignschedules_timeout != null) return [this.checkmarkDoneCircle,'Completed'];
            else if(sched.assignschedules_timein != null) return [this.stopwatch,'In progress'];
            else if(sched.assignschedules_status != 10) return [this.calendar,'Assigned'];
            else if(sched.assignschedules_status == 10) return [this.clipboard,'Applied'];
        },
        async openActionSheet(id) {
            let selectedSched = this.schedulesToday.filter(el=>el.schedules_id == id);
            selectedSched = selectedSched[0];
            let actionSheetButtons = [
                {
                    text: 'View Schedule Details',
                    data: {
                        action: 'view',
                    },
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    data: {
                        action: 'cancel',
                    },
                }
            ];

            if(!this.hasApplied(selectedSched)){
                actionSheetButtons.push({
                    text: 'Apply Shift',
                    data: {
                        action: 'apply',
                    }
                });
            }
            else{
                actionSheetButtons.push({
                    text: 'Request to Reschedule',
                    data: {
                        action: 'request reschedule',
                    }
                });
                actionSheetButtons.push({
                    text: 'Request to Reassign',
                    data: {
                        action: 'request reassign',
                    }
                });
            }

            const openSheet = await actionSheetController.create({
                header: 'Schedule Action',
                buttons: actionSheetButtons,
            });

            await openSheet.present();
            openSheet.onDidDismiss().then(res=>{
                if(res.data == null) return;
                if(res.data.action == 'cancel') return;
                if(res.data.action == 'apply') {
                    let schedStart = new Date(selectedSched.schedules_dates+' '+selectedSched.schedules_timestart);
                    let curDateTime = new Date();
                    if(curDateTime.getTime() >= schedStart.getTime()) {
                        openToast('You cannot apply for a schedule that\'s already started!','warning');
                        return;
                    }

                    axios.post(`requests?requests_type=0&requests_employeeid=${lStore.get('user_id')}&requests_schedulesid=${selectedSched.schedules_id}&_orderby=id_DESC`).then(res=>{  
                        
                        if(res.data.result != null){
                            openToast('You already applied for this schedule!','danger');
                            return;
                        }

                        axios.post('requests/create',null,{
                            requests_type: 0,
                            requests_employeeid : lStore.get('user_id'),
                            requests_schedulesid : selectedSched.schedules_id,
                            requests_created_at: new Date().toLocaleString('zh-Hans-CN').replaceAll('-',''),
                            requests_updated_at: new Date().toLocaleString('zh-Hans-CN').replaceAll('-',''),
                            requests_isseen: 1,
                            requests_isread: 1
                        }).then(()=>{
                            openToast('Waiting for Admin Approval', 'light');
                            setTimeout(() => {
                                window.location.reload();
                            }, 3000)
                        })
                    })
                    
                }else if(res.data.action == 'view'){
                    this.openedSchedule = JSON.parse(JSON.stringify(selectedSched));
                    this.openModal = 1;
                }else if(res.data.action == 'request reschedule'){
                    this.openedSchedule = JSON.parse(JSON.stringify(selectedSched));
                    this.openModal = 2;
                }else if(res.data.action == 'request reassign'){
                    this.fetchEmployees(selectedSched.schedules_facilityid)
                    this.openedSchedule = JSON.parse(JSON.stringify(selectedSched));
                    this.openModal = 3;
                    
                }
            });

        },
        setOpen() {
            this.isOpen = true;
        },
        hasApplied(sched){
            return sched.assignschedules_id != null
        },
        handleRefresh(e){
            this.setDate(this.selectedDate);
            setTimeout(() => {
                e.target.complete();
            }, 2000);
        },
        setDate(e){
            let date = e;
            if(e.target != null){
                date = e.target.value.match(/^[0-9]+-[0-9]+-[0-9]+/)[0];
                this.selectedDate = date;
            }
            
            let selectedDate = new Date(date).toLocaleDateString('zh-Hans-CN',{
                year:'numeric',
                month:'2-digit',
                day: '2-digit'
            }).replaceAll('/','-');
            
            
            axios.post(`Schedule/joint?schedules_dates=${selectedDate}&_batch=true`).then(res=>{
                if(res.data.result == null) {
                    this.schedulesToday = [];
                    return;
                }
                this.schedulesToday = [];
                res.data.result.forEach(el=>{
                    if(el.assignedEmps.length > 0) el = {...el,...el.assignedEmps[0]};
                    delete el.assignedEmps;
                    if(this.allowedRoles[el.schedules_facilityid] == null) return false;
                    if(this.allowedRoles[el.schedules_facilityid].assigndesignation_roleid != el.schedules_roleid) return;
                    this.schedulesToday.push(el)
                });

                this.schedulesToday = this.schedulesToday.sort((a,b)=>{
                    let timeA = new Date(a.schedules_dates+' '+a.schedules_timestart).getTime();
                    let timeB = new Date(b.schedules_dates+' '+b.schedules_timestart).getTime();
                    return timeA - timeB;
                });
            })
        }
    }
});
</script>

<style scoped>

.page-title{text-align: center; font-weight: bold; font-size: 20px; margin: 0 0 12px;}

.scrollTop{
    position: fixed;
    z-index: 1;
    bottom: 12px;
    right: 12px;
    cursor: pointer;
}

.noData{width: 230px; max-width: 100%; margin: 30px auto 0;}

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

.sub-header.hidden {
    top: -250px;
}

ion-header {
    box-shadow: none;
}

ion-header::after {
    display: none;
}

ion-datetime {
    min-height: 0 !important;
}

ion-title {
    --text-align: left !important; 
    font-size: 20px; 
    --padding: 0 !important;
}

ion-title span {
    display: block;
    color: #1f94db;
    font-weight: bold;
}

ion-col h2 {
    font-size: 17px; 
    padding-left: 14px;
}

ion-col h2 {
    font-size: 15px;
    padding-left: 14px;
    color: #4daca8;
    font-weight: 600;
}

ion-col h2 span {
    display: block;
}

ion-col h2 small {
    font-size: 10px;
}

ion-list ion-item {
    border: 1px solid #ddd;
    border-left: 6px solid #999999;
    margin-bottom: 6px;
}

ion-list ion-item:nth-child(even) {
    border-left: 6px solid #1f94db  ;
}

.schedTaken ion-item{
    border-left: 6px solid #f44;
}

.Schedule_modal{
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    width: 100vw;
    height: 100vh;
    transition: 0.4s;
    opacity: 0;
    overflow: auto;
    padding-bottom: 50px;
    display:flex;
    align-items:center;
}

.Schedule_modal.openModal{
    z-index: 999;
    opacity:1;
}

.Schedule_modal_box{
    background: #fff;
    color: #000;
    padding: 10px;
    margin: 20px auto;
    border-radius: 10px;
    transition: 0.4s;
    transform: translateY(-100%);
    width: 0%;
    overflow: hidden;
}

.Schedule_modal.openModal .Schedule_modal_box{
    transform: translateY(0%);
    width: calc(100% - 40px);
}

.Schedule_modal_box h2{
    margin: 0;
    font-size: 20px;
    border-bottom: 1px solid #eee;
    padding: 10px 0;
}

.Schedule_modal_box .grid{
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap:10px;
    margin: 20px 0;
}

.Schedule_modal_box .grid > p{
    font-weight: normal;
    width:30%;
    color: #555;
    font-size: 15px;
    line-height: 1.5;
    margin: 0;
}



.Schedule_modal_box .grid > div{
    width:63%;
}

.Schedule_modal_box .grid > div:nth-child(2n) > span{
    background: #edf8ff;
    border-bottom: 1px solid #c0e7ff;
    padding: 7px;
    line-height: 1.5;
    color: #555;
    font-size: 15px;
    width: 100%;
    display: block;
    border-radius: 10px;
}

.notBranchMatch{
    background: #ffbcbc;
    padding: 5px;
    margin: 5px 0;
    display: inline-block;
}

.designation_chips_cont{margin-top: 10px;}

.designation_chips{
    background: #1f94db;
    color: #fff;
    padding: 5px 7px;
    border-radius: 20px;
    margin: 0 5px;
    font-size: 15px;
    display: inline-block;
}
.designation_chips:first-child{margin-left: 0;}
.schedStatus{
    color: #fff;
    background: var(--ion-color-primary);
    font-size: 14px;
    padding: 2px 5px;
    border-radius: 20px;
    display: block;
    width: max-content;
    margin: 10px 0;
}
.schedStatus i {vertical-align: text-top;}

.Schedule_modal_box input,.Schedule_modal_box textarea{
    background: #edf8ff;
    border: none;
    border-bottom-color: currentcolor;
    border-bottom-style: none;
    border-bottom-width: medium;
    padding: 7px;
    line-height: 1.5;
    color: #555;
    font-size: 15px;
    width: 100%;
    display: block;
    border-radius: 10px;
    border-bottom: 1px solid #c0e7ff;
}

.button_col2{
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 5px;
}

.Schedule_modal_box .separator{
    height: 1px;
    border-top:1px solid #ddd;
    margin: 20px 0;
}

.Schedule_modal_box strong.title{
    margin: 0 0 10px;
    display: block;
}

.employee_datalist{margin:20px 0 10px}
.employee_datalist input{
    background: #edf8ff;
    border:none;
    border-bottom: 1px solid #c0e7ff;
    padding: 7px;
    line-height: 1.5;
    color: #555;
    font-size: 15px;
    width: 100%;
    display: block;
    border-radius: 10px;
}


.employee_datalist ul{padding-left: 0;list-style: none;}
.employee_datalist ul li{
    padding: 10px;
    border: 1px solid #bbb;
    margin: 5px;
    border-radius: 5px;
    transition: 0.2s;
}

.employee_datalist ul li:active{scale:0.95}
.employee_datalist ul li p{margin-block: 0;}
</style>