<template>
    <ion-page>
        <ion-tabs>
            <ion-router-outlet></ion-router-outlet>
            <ion-tab-bar slot="bottom">

                <ion-tab-button tab="reports" href="/admin/reports">
                    <ion-icon :icon="podium" />
                </ion-tab-button>

                <ion-tab-button tab="request" href="/admin/request">
                    <ion-icon :icon="newspaper" />
                </ion-tab-button>

            </ion-tab-bar>
        </ion-tabs>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonPage, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon } from '@ionic/vue';
import { podium, newspaper } from 'ionicons/icons';
import { lStore, axios } from '@/functions';

export default defineComponent({
    name: 'EmployeeTabs',
    components: { IonPage, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton,IonIcon },
    data() {
        return {
            notifCounter: 0
        }
    },
    setup() {
        return { podium, newspaper };
    },
    created() {
        this.user = lStore.get('user_info');
    },
    methods: {
        notifHandler() {
            setTimeout(() => {
                axios.post(`notifications/update?userid=${lStore.get('user_info').employee_id}`, null, { notifications_isread: 0 }).then(res => {
                    if(!res.data.success) return;
                    return true;
                });
            }, 1000);
        }
    },
    mounted() {
        setInterval(() => {
            axios.post(`notifications?_batch=true&notifications_userid=${lStore.get('user_info').employee_id}&notifications_isread=1`).then(res => {
                if(!res.data.success) {
                    this.notifCounter = 0;
                    return;
                }
                this.notifCounter = res.data.result.length;
            });
        }, 1000)
    },
});
</script>

<style scoped>
ion-tab-button {
    --padding-top: 10px;
    --padding-bottom: 10px;
    --padding-start: 10px;
    --padding-end: 10px;
    border-bottom: 3px solid transparent;
}

.notif_wrap {
    position: absolute;
}

.notif {
    position: absolute; display: block; background: #ff0c3a; width: 15px; height: 15px; border-radius: 30px; color: #fff; right: -15px; margin: 0 auto; line-height: 15px; font-size: 10px; bottom: 0; left: 0;
}

ion-tab-button[aria-selected=true] {
    border-bottom: 3px solid #1f94db;
}

</style>
