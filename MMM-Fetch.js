
Module.register('MMM-Fetch', {
    version: null,
    interval: null,

    // Module config defaults.
    defaults: {
        updateInterval: 24 * 60 * 60 * 1000, // 24 hours
    },

    start: function () {
        Log.info(`Starting module ${this.name}`)
        Log.info(`with config: ${JSON.stringify(this.config)}`)
        this.scheduleUpdate()
    },

    stop: function () {
        Log.info(`Stopping module ${this.name}`)
        clearInterval(this.interval)
    },

    resume: function () {
        Log.info(`Resuming module ${this.name}`)
        Log.info(`with config: ${JSON.stringify(this.config)}`)
        if (this.interval === null) {
            this.scheduleUpdate()
        }
    },

    suspend: function () {
        Log.info(`Suspending module ${this.name}`)
    },

    scheduleUpdate: function () {
        Log.info(this.name, 'scheduleUpdate', this.interval, this.config.updateInterval)
        if (this.interval === null) {
            this.interval = setInterval(() => {
                this.getVersion()
            }, this.config.updateInterval)

            this.getVersion()
        }
    },

    getVersion: function () {
        Log.info(this.name, 'getVersion')
        this.sendSocketNotification('GET_VERSION')
    },

    getDom: function () {
        const wrapper = document.createElement('div')
        wrapper.className = 'mmm-fetch'

        if (!this.loaded) {
            wrapper.innerHTML = 'Loading...'
            return wrapper
        }

        let span = document.createElement('span')
        span.className = 'version'
        span.innerHTML = `버전은 ${this.version.version}입니다.`

        wrapper.appendChild(span);

        return wrapper;
    },

    socketNotificationReceived: function (notification, payload) {
        Log.info(this.name, 'socketNotificationReceived', notification)
        Log.info(this.name, 'socketNotificationReceived', payload)

        if (notification === "VERSION_RESULTS") {
            this.loaded = true
            this.version = {}
            if (payload && Object.keys(payload).length > 0) {
                this.version = payload
            }
            this.updateDom()
        }
    },

})
