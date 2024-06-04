// NodeJS script to download json from a specific URL and save it to a file
const fs = require('fs')
const https = require('https')
const path = require('path')

// Mainnet and Testnet
const urls = ['https://api2.neptunemutual.net/home/product-summary/1', 'https://api2.neptunemutual.net/home/product-summary/43113']

const file = path.resolve(__dirname, '../src/data/summary.json')

const getJson = (url) => {
  console.log(`Downloading ${url}`)

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        resolve(JSON.parse(data))
      })
    }).on('error', (err) => {
      reject(err)
    })
  })
}

const run = async () => {
  const arr = await Promise.all(urls.map(getJson))

  const result = arr.reduce((acc, cur) => {
    acc.push(...cur.data)

    return acc
  }, [])

  fs.writeFileSync(file, JSON.stringify(result, null, 2))
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
