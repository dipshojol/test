const userResolvers = require('../resolvers/user');


const rootResolvers = {
    ...userResolvers
}

module.exports = rootResolvers;