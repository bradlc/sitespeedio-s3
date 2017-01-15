const s3 = require('s3')
const waiton = require('wait-on')
const log = require('intel')

log.basicConfig({
  'format': '[%(date)s] %(message)s'
})

let data
const s3Client = s3.createClient()

module.exports = {
  name () {
    // This is ... shocking news: the name of the plugin
    return 's3'
  },

  open (context, options) {
    // when sitespeed.io start it calls the open function once for all plugins
    // the context holds information for this specific run that
    // generated at runtime, for example you can get hold of the storageManager
    // that stores files to disk.
    // The options is the configuration supplied for the run.
    data = context
  },
  processMessage (message, queue) {
    // The plugin will get all messages sent through the queue
    // and can act on specific messages by type:
    // message.type
  },
  close (options, errors) {
    // When all URLs are finished all plugins close function is called once.
    // Options are the configuration options and errors a array of errors
    // from the run.
    const dir = data.storageManager.baseDir
    const datetime = data.timestamp.format('YYYY-MM-DD-HH-mm-ss')

    return new Promise((resolve, reject) => {
      waiton({
        resources: [dir]
      }, () => {
        var params = {
          localDir: dir,
          s3Params: {
            Bucket: 'electricfishhorse',
            Prefix: datetime,
            ACL: 'public-read'
          }
        }

        const uploader = s3Client.uploadDir(params)
        let uploadStarted = false

        uploader.on('error', (err) => {
          console.error('unable to upload:', err.stack)
          reject()
        })

        uploader.on('progress', () => {
          if (!uploadStarted) {
            uploadStarted = true
            log.info('Uploading to S3...')
          }
        })

        uploader.on('end', () => {
          log.info('Finished uploading to S3')
          resolve()
        })
      })
    })
  }
}
