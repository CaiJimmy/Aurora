import * as Sentry from '@sentry/browser'
import Vue from 'vue'

const VUE_APP_SENTRY_API = process.env.VUE_APP_SENTRY_API;

if (VUE_APP_SENTRY_API) {
    Sentry.init({
        dsn: VUE_APP_SENTRY_API,
        integrations: [new Sentry.Integrations.Vue({
            Vue
        })]
    });
}

export default Sentry;