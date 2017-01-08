const request = require('request')

let data

module.exports = {
  name() {
    // This is ... shocking news: the name of the plugin
    return 'sitespeedio-s3'
  },

  open(context, options) {
    // when sitespeed.io start it calls the open function once for all plugins
    // the context holds information for this specific run that
    // generated at runtime, for example you can get hold of the storageManager
    // that stores files to disk.
    // The options is the configuration supplied for the run.
    data = context
  },
  processMessage(message, queue) {
    // The plugin will get all messages sent through the queue
    // and can act on specific messages by type:
    // message.type
    console.log('message:', message.type)
  },
  close(options, errors) {
    // When all URLs are finished all plugins close function is called once.
    // Options are the configuration options and errors a array of errors
    // from the run.
    console.log(data.dataCollection)
  }
}
