<template>
    <ion-page>
        <ion-content fullscreen="true">
            <div class="form-container">
                <span class="style-circle"></span>
                <div class="form-header">
                    <img src="../../images/main_logo.png" alt="Logo"/>
                    <p>Sign In <small>(Admin Login)</small></p>
                </div>
                <div class="form-input">
                    <ion-item>
                        <ion-label position="stacked">Username</ion-label>
                        <ion-input type="email" v-model="loginInput" placeholder="Enter username here"></ion-input>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Password</ion-label>
                        <ion-input type="password" v-model="password" placeholder="Enter password here" id="password"></ion-input>
                        <a class="eyeCon" v-if="password != ''" href="javascript:;" @click="showPass('#password')">
                            <ion-icon :class="{ showIcon : !showIcon }" :icon="eye"></ion-icon>
                            <ion-icon :class="{ showIcon2 : !showIcon2 }" :icon="eyeOff"></ion-icon>
                        </a>
                    </ion-item>
                    <ion-button color="danger" class="ion-margin-top" expand="block" size="large" :disabled="formLoading" v-on:click="login">
                        <span v-if="!formLoading" >LOGIN</span>
                        <span v-if="formLoading">
                            <ion-spinner name="dots"></ion-spinner>
                        </span>
                    </ion-button>
                    <div class="btn_wrap">
                        <a href="javascript:;" @click="setOpen3(true)">Forgot password</a>
                        <a href="javascript:;" @click="$router.push('/login')">Login as Employee</a>
                    </div>
                </div>
                <ion-text class="privacy">By logging in, I agree to <strong>4Angels Healthcare Staffing</strong>'s <a @click="setOpen(true)" href="javascript:;">Terms of Service and Privacy Policy</a></ion-text>
            </div>

            <ion-modal :is-open="isOpen">
                <ion-header>
                    <ion-toolbar>
                        <ion-title>Privacy Policy and <br> Terms of Use</ion-title>
                        <ion-buttons @click="setOpen(false)" slot="end">
                            <ion-icon :icon="close"></ion-icon>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <ion-list lines="none" class="ion-margin-bottom ion-padding-bottom">
                        <ion-item>
                            <ion-label class="ion-text-wrap">
                                <p>This privacy policy sets out how <strong>4Angels Healthcare Staffing</strong> uses and protects any information you give to <strong>4Angels Healthcare Staffing</strong> via the website’s online forms. <strong>4Angels Healthcare Staffing</strong> is committed to ensuring that your privacy is protected and preserved.</p>
                            </ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label class="ion-text-wrap">
                                <p>When you are asked to provide certain information by which you can be identified, rest assured that such information will only be used in accordance with this privacy statement. <strong>4Angels Healthcare Staffing</strong> may change this policy from time to time by updating this webpage. It is your responsibility to check this page from time to time to ensure that you are happy with any changes. This policy is effective as of January 1, 2023.</p>
                            </ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label class="ion-text-wrap">
                                <h1 class="ion-margin-bottom" color="primary">Information You Provide to <strong>4Angels Healthcare Staffing</strong></h1>
                                <p>On our online forms, we may collect the following information:</p>
                                <ul>
                                    <li>name or name of your client</li>
                                    <li>mailing/delivery address</li>
                                    <li>contact information</li>
                                    <li>email address</li>
                                    <li>telephone number</li>
                                </ul>
                            </ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label class="ion-text-wrap">
                                <p>The information collected will help <strong>4Angels Healthcare Staffing</strong> fulfill the services that are due to you. We also collect information through the website for the following purposes:</p>
                                <ul>
                                    <li>Internal Record Keeping</li>
                                    <li>Client/Customer Feedback to improve services and/or products</li>
                                    <li>Promotional emails about our services, special offers or other information which you may find interesting using the email address that you have provided to us</li>
                                    <li>To contact you for market research purposes.</li>
                                </ul>
                            </ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label class="ion-text-wrap">
                                <h1>Security of Information</h1>
                                <p>We are committed to ensuring that the information you submitted to <strong>4Angels Healthcare Staffing</strong> is secure. To prevent unauthorized access or disclosure, we have put in place suitable physical, electronic, and managerial measures to secure the information we collect online.</p>
                            </ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label class="ion-text-wrap">
                                <h1>The Use of Cookies</h1>
                                <p>A cookie is a small file which asks permission to be placed on your computer's hard drive. With your permission on our browser settings, the file is added and the cookie helps analyze web traffic or lets you know when you visit a particular site. Cookies allow web applications to respond to you as an individual. The web application can tailor its operations to your needs, likes, and dislikes by gathering and remembering information about your preferences.</p>
                            </ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label class="ion-text-wrap">
                                <p>We use traffic log cookies to identify which pages are being used as this helps <strong>4Angels Healthcare Staffing</strong> analyze data about web page traffic which will be used to improve our website in fulfilling customer needs. We only use this information for statistical analysis purposes and then the data is subsequently removed from the system.</p>
                            </ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label class="ion-text-wrap">
                                <p>Please note that a cookie will NOT give us access to your computer or any information about you, other than the data you choose to share with us through the <strong>4Angels Healthcare Staffing</strong> website.</p>
                            </ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label class="ion-text-wrap">
                                <p>You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies once you access certain websites. Be advised that when you do decline cookies, it may prevent you from taking full advantage of the website features.</p>
                            </ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label class="ion-text-wrap">
                                <h1>Links to Other Websites</h1>
                                <p>Through the <strong>4Angels Healthcare Staffing</strong> website, you can link to other websites which are not under the control of <strong>4Angels Healthcare Staffing</strong>. We have no control over the nature, content, and availability of outbound third-party websites. The inclusion of any links does not necessarily imply a recommendation or endorsement of the views expressed within them. <strong>4Angels Healthcare Staffing</strong> remains independent from third-party website links.</p>
                            </ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label class="ion-text-wrap">
                                <h1>Security of Your Personal Information</h1>
                                <p><strong>4Angels Healthcare Staffing</strong> will not sell, distribute or forward your personal information to third parties unless we have your express and written permission or are required by law to disclose your information.</p>
                            </ion-label>
                        </ion-item>
                        <ion-item>
                            <ion-label class="ion-text-wrap">
                                <p>You may request details of personal information which we currently hold under the Data Protection Act of 1998. Requesting this information will require a small fee. If you would like a copy of the information we have on you, please contact us.</p>
                            </ion-label>
                        </ion-item>
                        <ion-item class="ion-padding-bottom">
                            <ion-label class="ion-text-wrap">
                                <p>If you find that any information we are currently holding on you is incorrect or incomplete, please advise us of the corrections accordingly.</p>
                            </ion-label>
                        </ion-item>
                    </ion-list>
                </ion-content>
            </ion-modal>

            <ion-modal :is-open="isOpen3">
                <ion-header>
                    <ion-toolbar>
                        <ion-title>Forgot Password</ion-title>
                        <ion-buttons @click="setOpen3(false)" slot="end">
                            <ion-icon :icon="close"></ion-icon>
                        </ion-buttons>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding resetPass">
                    <img src="../../images/Resetpass.svg" alt="reset password"/>
                    <div class="passText">
                        <h2>Forgot password</h2>
                        <p>Enter your email to receive an emailto reset your password.</p>
                    </div>
                    <ion-list>
                        <ion-item lines="none">
                            <ion-label>
                                <ion-input :clear-input="true" placeholder="Email"></ion-input>
                            </ion-label>
                        </ion-item>
                    </ion-list>
                    <ion-button color="danger" class="ion-margin-top btn_reset" expand="block" size="large" :disabled="formLoading">
                        <span v-if="!formLoading3" >Send</span>
                        <span v-if="formLoading3">
                            <ion-spinner name="dots"></ion-spinner>
                        </span>
                    </ion-button>
                </ion-content>
            </ion-modal>

        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonText, IonItem, IonLabel, IonInput, IonButton, IonSpinner, IonModal, IonList, IonIcon, IonTitle, IonButtons, IonToolbar, IonHeader } from '@ionic/vue';
import { axios, validateForm, openToast, lStore } from '@/functions';
import { eye, eyeOff, close } from 'ionicons/icons';

export default defineComponent({
    name: 'LoginAdminPage',
    components: { IonContent, IonPage, IonText, IonItem, IonLabel, IonInput, IonButton, IonSpinner, IonModal, IonList, IonIcon, IonTitle, IonButtons, IonToolbar, IonHeader },
    data() {
        return{
            loginInput: "",
            password: "",
            formLoading: false,
            formLoading3: false,
            showIcon: true,
            showIcon2: false,
            eye,
            eyeOff,
            close,
            isOpen: false,
            isOpen3: false, 
        };
    },
    methods: {
        resetPass() {
            this.formLoading3 = true;
            axios.post('/email/forgotpassword/',null,{email: this.resetField}).then(res => {
                if(!res.data.success) return;
                this.formLoading3 = false;
                openToast(`Message sent to this email ${this.resetField}`, 'light');
                this.resetField = '';
            });
        },
        setOpen(isOpen) {
            this.isOpen = isOpen;
        },
        setOpen3(isOpen3) {
            this.isOpen3 = isOpen3;
        },
        login() {
            let rules = {password:{isRequired:true}};
            let input = {password:this.password};
            input.email = this.loginInput;
            rules.callback = ()=>{openToast('All fields are required!', 'danger')};
            
            const valid = validateForm(input,rules);
            if(!valid.allValid) return;
            
            this.formLoading = true;

            axios.post('users/login',null,{
                login: this.loginInput,
                password: this.password
            }).catch(err=>{
                console.log(err);
                openToast('Something went wrong...', 'light');
            }).then(res=>{
                if(res.data.msg === 'user not found') openToast('User not registered!', 'light');
                if(res.data.msg === 'wrong password') openToast('Wrong password!', 'light');
                this.formLoading = false;
                
                if(res.data.success) {
                    lStore.set('user_id',res.data.result.users_id);
                    lStore.set('user_token',res.data.token);
                    lStore.set('user_info', res.data.result);
                    lStore.set('user_type', '1');
                    openToast('Login Success', 'light');
                    this.$router.replace('/admin/reports');
                }
            });
        },
        showPass(e) {
            document.querySelector("#password input").focus();
            let inType = document.querySelector(e);
            if (inType.type === "password") {
                inType.type = "text";
                this.showIcon2 = true;
                this.showIcon = false;
            } else {
                inType.type = "password";
                this.showIcon = true;
                this.showIcon2 = false;
            }
        },
    }
});
</script>

<style scoped>

.passText {
    margin-bottom: 45px;
}

.passText p {
    color: #92949c;
}

.btn_reset {
    --border-radius: 30px !important;
}

.resetPass {
    text-align: center;
}

.resetPass img {
    width: 280px;
    display: block;
    margin: 0 auto;
}

.resetPass ion-item {
    --min-height: 0 !important;
    --border-width: 1px;
    --border-radius: 30px;
    --background: var(--ion-color-light-tint) !important;
}

.resetPass ion-item ion-label {
    max-width: 100% !important;
    width: 100% !important;
}

.form-header p small {
    display: block;
    font-size: 12px !important;
    margin-top: 5px;
}

.btn_wrap {
    display: flex;
    justify-content: space-between;
}

.btn_wrap a {
    display: block;
    text-align: right;
    position: relative;
    bottom: -15px;
    color: #555;
    font-size: 14px;
    text-decoration: none;
}

ion-content {
    --padding-top: 30px;
}

ion-header {
    box-shadow: none;
}

ion-label h1 {
    margin-bottom: 12px !important;
    color: #1f94db;
    font-weight: bold;
}

.style-circle::before {
    content: '';
    width: 200px;
    height: 200px;
    background: #b3223d;
    position: absolute;
    border-radius: 50%;
    z-index: -1;
    top: 0;
    left: -90px;
}

.style-circle::after {
    content: '';
    width: 200px;
    height: 200px;
    background: #b3223d;
    position: absolute;
    border-radius: 50%;
    z-index: -1;
    right: -105px;
    top: 145px;
}

ion-label p {
    font-size: 15px;
    line-height: 20px;
    color: #555;
}

ion-label ul {
    padding-left: 30px;
}

ion-label ul li {
    color: #555;
}

ion-label p strong {
    color: #1f94db;
}

ion-modal ion-icon {
    font-size: 20px;
}

ion-title {
    font-size: 19px;
}

.privacy{
    text-align: center;
    margin-top: 60px;
    font-size: 14px;
    color: #555;
}

.form-container {
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
	align-items: stretch;
    width: 100%;
    height: auto;
}


.form-container::before {
    content: '';
    width: 100%;
    height: 370px;
    background: #aa0927;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
}

.form-container p {
    text-align: center;
}

.form-header {
    display: flex;
    flex-flow: column wrap;
    justify-content: center;
	align-items: center;
    margin-bottom: 30px;
}

.form-header img {
    width: 100%;
    max-width: 160px;
    margin-bottom: 25px;
}

.form-header h2 {
    font-size: 26px;
    font-weight: bold;
    color: #1f94db;
    margin: 0 0 5px;
}

.form-header p {
    margin: 0;
    color: #fff;
    font-size: 20px;
}

.form-input {
    box-shadow: 0px 0px 8px #d9d9d9;
    border-radius: 15px;
    padding: 45px 12px 35px 12px;
    margin: 0 16px;
    background: #fff;
}

.form-input-footer {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;
    margin: 5px 0;
}

.form-input-footer ion-item {
    --border-width: 0;
    --padding-start: 0;
    --padding-end: 0;
    --inner-padding-start: 0;
    --inner-padding-end: 0;
    --background-activated: none;
    --border-radius: 0;
    --background: none !important;
    margin: 0;
}

.form-input-footer ion-label {
    margin: 0 !important;
}

.form-input-footer ion-checkbox {
    margin: 0 10px 0 0 !important;
}

.form-input ion-button {
    margin-top: 25px;
}

.eyeCon {
	position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    z-index: 999;
    height: 100%;
    display: flex;
    align-items: center;
}

.eyeCon ion-icon {
    width: 20px;
    height: 20px;
}

.showIcon, .showIcon2 {
    display: none;
}
</style>