
export const VN_PHONE_NUMBER_REGEX = /((09|03|07|08|05|06)+([0-9]{8})\b)/g;
/**
 * Without country code
 */
export const isValidPhoneNumber = (phoneNumber: string) => {
  if (phoneNumber.startsWith('+84')) {
    phoneNumber = '0' + phoneNumber.substr(3);
  }
  return phoneNumber ? phoneNumber.match(VN_PHONE_NUMBER_REGEX) : null;
};
