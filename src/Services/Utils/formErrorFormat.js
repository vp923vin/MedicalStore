const formatErrors = (errors) => {
    return errors.map((error) => ({
        field: error.path,
        message: error.msg
    }));
};

module.exports = formatErrors;