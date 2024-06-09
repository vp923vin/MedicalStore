const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    console.error('Error in hashPassword function:', error);
    throw new Error('Password hashing failed');
  }
};

const comparePassword = async (password, userPassword) => {
  try {
      if (!password || !userPassword) {
          console.error('Missing password or userPassword:', { password, userPassword });
          throw new Error('Invalid password');
      }
      return await bcrypt.compare(password, userPassword);
  } catch (error) {
      console.error('Error in comparePassword function:', error);
      throw new Error('Invalid password');
  }
};

module.exports = {
    hashPassword, 
    comparePassword 
};
