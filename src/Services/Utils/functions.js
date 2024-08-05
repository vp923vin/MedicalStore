const generateRandomUsername = (fullname) => {
    const randomSuffix = Math.floor(Math.random() * 10000);
    return `${fullname.replace(/\s+/g, '')}_${randomSuffix}`;
};

const generateMPIN = () => {
    return Math.floor(111111 + Math.random() * 888889);
};

const isOTPExpired = (expiresAt) => {
    return new Date() > new Date(expiresAt);
};

const generateRandomNumber = () => {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return randomNumber;
};

module.exports = {
    generateRandomUsername,
    generateMPIN,
    isOTPExpired,
    generateRandomNumber
}