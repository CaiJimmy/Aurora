import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations';
import Vue from 'vue'

const VUE_APP_SENTRY_API = process.env.VUE_APP_SENTRY_API;

if (VUE_APP_SENTRY_API && process.env.NODE_ENV == 'production') {
    Sentry.init({
        dsn: VUE_APP_SENTRY_API,
        integrations: [new Integrations.Vue({Vue, attachProps: true})]
    });
}

export default Sentry;