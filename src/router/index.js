import { createRouter, createWebHistory } from '@ionic/vue-router';
import { lStore } from '@/functions';

//Import of Views
import SplashScreenView from '../views/SplashScreenView/SplashScreenView.vue';
import WelcomePage from '../views/WelcomePage.vue';
import LoginPage from '../views/LoginView/LoginPage.vue';
import ErrorPage from '../views/ErrorPage.vue';
import DashboardView from '@/views/EmployeeView/Dashboard.vue';
import EmployeeTabs from '@/views/EmployeeView/EmployeeTabs.vue';
import TimeClock from '@/views/EmployeeView/TimeClockView.vue';
import EmployeeProfile from '@/views/EmployeeView/Profile.vue';
import SchedulesView from '@/views/EmployeeView/Schedules.vue';
import TimeClockOut from '@/views/EmployeeView/TimeClockOutView.vue';
import NotificationsView from '@/views/EmployeeView/Notifications.vue';
import TimesheetsView from '@/views/EmployeeView/Timesheets.vue';

const routes = [
  {
    path: '/',
    redirect: '/splash'
  },
  {
    path: '/splash',
    name: 'SplashScreenView',
    component: SplashScreenView,
    beforeEnter: (to, from) => {
      if (from.path === '/welcome' || from.path === '/employee' || from.path === '/employee/dashboard'){return false;}
    }
  },
  {
    path: '/welcome',
    name: 'WelcomePage',
    component: WelcomePage,
    beforeEnter: () => {
      if (lStore.isset('user_token')) return false;
    }
  },
  {path: '/login', name: 'LoginPage', component: LoginPage},
  {path: '/:pathMatch(.*)*', name: 'ErrorPage', component: ErrorPage},
  {
    path: '/employee',
    component: EmployeeTabs,
    children: [
      {
        path: '/employee/dashboard',
        component: DashboardView,
        beforeEnter: () => {
          if (!lStore.isset('user_token')) return '/login';
        },
      },
      {
        path: '/employee/schedules',
        component: SchedulesView,
        beforeEnter: () => {
          if (!lStore.isset('user_token')) return '/login';
        },
      },
      {
        path: '/employee/notifications',
        component: NotificationsView,
        beforeEnter: () => {
          if (!lStore.isset('user_token')) return '/login';
        },
      },
      {
        path: '/employee/timesheets',
        component: TimesheetsView,
        beforeEnter: () => {
          if (!lStore.isset('user_token')) return '/login';
        },
      },
      {
        path: '/employee/profile',
        component: EmployeeProfile,
        beforeEnter: () => {
          if (!lStore.isset('user_token')) return '/login';
        },
      },
    ],
  },
  {path: '/timeclock', name: 'timeclock', component: TimeClock},
  {path: '/timeclockout', name: 'timeclockout', component: TimeClockOut},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
