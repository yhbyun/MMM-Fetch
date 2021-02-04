const NodeHelper = require('node_helper')
const request = require('request')
const Log = require('../../js/logger.js')

module.exports = NodeHelper.create({
    start: function () {
        Log.log(`Starting node helper for: ${this.name}`)
    },

    stop: function () {
        Log.log(`Stopping node helper for: ${this.name}`)
    },

    fetchVersion: function () {
        const url = "https://raw.githubusercontent.com/yhbyun/MMM-Fetch/master/package.json"
        Log.log(this.name, 'fetchVersion', url)
        request({
            url,
            method: 'GET',
        }, (error, response, body) => {
            let version = 0
            if (!error && response.statusCode == 200) {
                // 받은 데이타에 대한 파싱
                results = JSON.parse(body)
                version = results.version || 0
            }
            this.sendSocketNotification('VERSION_RESULTS', { version: version })
        })
    },

    socketNotificationReceived: function (notification, payload) {
        Log.log(this.name, notification, payload)
        if (notification === 'GET_VERSION') {
            this.fetchVersion(payload || null)
        }
    }
});
