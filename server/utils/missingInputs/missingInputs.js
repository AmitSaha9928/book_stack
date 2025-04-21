const missingInputs = (field, fieldName) => {
  if (!field) {
    return {
      status: 422, 
      error: true,
      message: `${fieldName} is missing`,
      data: null,
    };
  }
  return null;
};

module.exports = missingInputs;
