import { getEvents } from './retrieveEvents'

getEvents()
.then(() => {
  process.exit(0)
})
.catch(_error => {
  console.error(_error) // todo remove dev item
  process.exit(1)
})
