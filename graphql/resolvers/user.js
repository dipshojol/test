const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

module.exports = {
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error('User exists.');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
        
            const user = new User({
                firstName: args.userInput.firstName,
                lastName: args.userInput.lastName,
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user.save();
            return { ...result._doc, password: null, _id: result.id };
        } catch (err) {
            throw err;
        }
    },
    login: async ({email, password}) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User not exist')
        }
        const matched = await bcrypt.compare(password, user.password);
        if (!matched) {
            throw new Error('Incorrect password.')
        }
        const token = jwt.sign(
            { userId: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email },
            'somesupersecretkey',
            {
                expiresIn: '1h'
            });
            return { userId: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, token: token, tokenExpiration: 1 };
    }
}