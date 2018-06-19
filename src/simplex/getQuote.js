import call from './call'
import {
    simplex
} from '../config'
export default (reqObject) => {
    return call(reqObject, simplex.quoteEP)
}