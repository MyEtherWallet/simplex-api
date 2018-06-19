import call from './call'
import {
    simplex
} from '../config'
export default (reqObject) => {
	console.log(reqObject)
    return call(reqObject, simplex.orderEP)
}