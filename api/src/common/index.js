let getIP = (req) => {
  return (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress || req.headers['cf-connecting-ip']).split(',')[0]
}

export {
  getIP
}
