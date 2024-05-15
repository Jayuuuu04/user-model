
const generatePassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    const encryptedPassword = await bcrypt.hash(password, salt)

    return {encryptedPassword, salt}
}


const comparePassword = async (enteredPassword, encryptedPassword, salt) => {
    const passwordMatch = await bcrypt.compare(enteredPassword, encryptedPassword)

    return passwordMatch;
}