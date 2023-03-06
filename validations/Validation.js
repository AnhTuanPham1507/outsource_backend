const { isValidDate } = require("../utils/Moment");
const ObjectId = require("mongoose").Types.ObjectId
function validateString(input) {
  if (
    typeof input !== "string" ||
    input === null ||
    input === undefined ||
    input.trim() === ""
  )
    return true;
  return false;
}

function validateNumber(input) {
  if (typeof input !== "number" || input === null || input === undefined)
    return true;
  return false;
}

function validateArray(input) {
  if (
    typeof input !== "object" ||
    input === null ||
    input === undefined ||
    input.length <= 0
  )
    return true;
  return false;
}

function validateEmail(input) {
  const checkEmailInput = input
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  if (
    typeof input !== "string" ||
    input === null ||
    input === undefined ||
    !checkEmailInput
  )
    return true;
  return false;
}

function validateEnum(Enum, input) {
  return !Object.values(Enum).includes(input);
}

function validatePhone(input) {
  if (
    typeof input !== "string" ||
    input === null ||
    input === undefined ||
    !input
    .toLowerCase()
    .match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)
  )
    return true;
  return false;
}

function validateDate(input) {
  if (
    typeof input !== "string" ||
    input === null ||
    input === undefined ||
    isValidDate(input)
  )
    return true;
  return false;
}
function validateObjectId(input) {
  if (ObjectId.isValid(input)) return false;
  return true;
}
function validateObject(input) {
  if (
    typeof input !== "object" ||
    input === null ||
    input === undefined ||
    Object.keys(input).length <= 0
  )
    return true;
  return false;
}

module.exports = {
  validateNumber,
  validateString,
  validateArray,
  validateEmail,
  validatePhone,
  validateEnum,
  validateDate,
  validateObjectId,
  validateObject
};
