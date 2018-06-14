export default {
    error: (res, msg) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify({
            error: true,
            msg: msg
        }, null, 3))
    },
    success: (res, msg) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify({
            error: false,
            msg: msg
        }, null, 3))

    }
}