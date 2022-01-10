/* eslint-disable no-param-reassign */
export const NUMBER_LENGTH_8 = new RegExp(/^[0-9]{8}$/, 'ig');
export const NUMBER_LENGTH_9 = new RegExp(/^[0-9]{9}$/, 'ig');
export const NUMBER_LENGTH_10 = new RegExp(/^[0-9]{10}$/, 'ig');
export const NUMBER_LENGTH_11 = new RegExp(/^[0-9]{11}$/, 'ig');
export const PHONEREGULAR = new RegExp(/^(0|86|17951)?((13[0-9]|15[012356789]|166|17[0135678]|18[0-9]|14[57]|19[189])[0-9]{8})$/, 'ig');
export function isPhone(phone) {
    return PHONEREGULAR.test(phone);
}
/**
 * 输入区号和手机号（必填）校验合法返回一个完整带+号的手机号否则null
 * 例如 checkPhoneAndGetCredential(0086,13122234567)
 * 返回 +008613122234567
 * @param {*} countryCode 区号
 * @param {*} phone 手机号
 */
export function checkPhoneAndGetCredential(countryCode, phone) {
    if (!countryCode || !phone) return null;
    phone = phone.trim();
    switch (countryCode) {
        case '86':
        case '0086':
            if (!isPhone(phone)) {
                return null;
            }
            return phone;
        case '00852':
        case '00853':
        case '0065':
            if (NUMBER_LENGTH_8.test(phone)) {
                return '+' + countryCode + phone;
            }
            return null;
        case '0033':
        case '0061':
        case '0066':
        case '00886':
            if (NUMBER_LENGTH_9.test(phone)) {
                return '+' + countryCode + phone;
            }
            return null;
        case '001':
        case '007':
        case '0044':
        case '0055':
        case '0060':
        case '0081':
        case '0091':
            if (NUMBER_LENGTH_10.test(phone)) {
                return '+' + countryCode + phone;
            }
            return null;
        case '0049':
            if (NUMBER_LENGTH_11.test(phone)) {
                return '+' + countryCode + phone;
            }
            return null;
        case '0082':
            if (NUMBER_LENGTH_10.test(phone) || NUMBER_LENGTH_11.test(phone)) {
                return '+' + countryCode + phone;
            }
            return null;
        default:
            return null;
    }
}
/**
 * 根据国家码验证手机号码长度，合法返回与国家码合并后的手机号码否则null
 * @param {*} phone 电话号码
 */
export function checkFullInternationalPhoneAndGetCredential(phone) {
    if (!phone) return null;
    if (phone.startsWith('+') || phone.startsWith('-')) {
        phone = phone.substring(1);
    }
    phone = phone.replace(/-/ig, '').trim();
    // 根据国家码验证手机号码长度，返回与国家码合并后的手机号码
    if (phone.startsWith('00')) {
        if (phone.startsWith('00852') ||
                phone.startsWith('00853')) {
            if (NUMBER_LENGTH_8.test(phone.substring(5))) {
                return '+' + phone;
            }
            return null;
        } else if (phone.startsWith('0065')) {
            if (NUMBER_LENGTH_8.test(phone.substring(4))) {
                return '+' + phone;
            }
            return null;
        } else if (phone.startsWith('0061') ||
                phone.startsWith('0066') ||
                phone.startsWith('0033')) {
            if (NUMBER_LENGTH_9.test(phone.substring(4))) {
                return '+' + phone;
            }
            return null;
        } else if (phone.startsWith('00886')) {
            if (NUMBER_LENGTH_9.test(phone.substring(5))) {
                return '+' + phone;
            }
            return null;
        } else if (phone.startsWith('0044') ||
                phone.startsWith('0055') ||
                phone.startsWith('0060') ||
                phone.startsWith('0081') ||
                phone.startsWith('0091')) {
            if (NUMBER_LENGTH_10.test(phone.substring(4))) {
                return '+' + phone;
            }
            return null;
        } else if (phone.startsWith('007') ||
                phone.startsWith('001')) {
            if (NUMBER_LENGTH_10.test(phone.substring(3))) {
                return '+' + phone;
            }
            return null;
        } else if (phone.startsWith('0049')) {
            if (NUMBER_LENGTH_11.test(phone.substring(4))) {
                return '+' + phone;
            }
            return null;
        } else if (phone.startsWith('0082')) {
            if (NUMBER_LENGTH_10.test(phone.substring(4)) || NUMBER_LENGTH_11.test(phone.substring(4))) {
                return '+' + phone;
            }
            return null;
        } else if (phone.startsWith('0086')) {
            phone = phone.substring(4);
            if (isPhone(phone)) {
                return phone;
            }
            return null;
        } else {
            return null;
        }
    } else if (phone.startsWith('86')) {
        phone = phone.substring(2);
        if (isPhone(phone)) {
            return phone;
        }
        return null;
    } else {
        if (isPhone(phone)) {
            return phone;
        } else {
            return null;
        }
    }

}
/**
 * 手机号码切割成区号和手机号,这里不做合法性校验：例如传入splitCountryCodeAndPhone('+00861234567****')
 * 如果没传就会返回{}，没找到默认返回{
            countryCode: '0086',
            phoneNumber: phone,
        }
 * @param {*} phone
 */
export function splitCountryCodeAndPhone(phone) {
    if (!phone) return {};
    if (phone.startsWith('+') || phone.startsWith('-')) {
        phone = phone.substring(1);
    }
    phone = phone.replace(/-/ig, '').trim();
    // 根据国家码验证手机号码长度，返回与国家码合并后的手机号码
    if (phone.startsWith('00')) {
        if (phone.startsWith('00852') ||
                phone.startsWith('00853')) {
                    return {
                        countryCode: phone.slice(0, 5),
                        phoneNumber: phone.slice(5),
                    };
        } else if (phone.startsWith('0065')) {
            return {
                countryCode: phone.slice(0, 4),
                phoneNumber: phone.slice(4),
            };
        } else if (phone.startsWith('0061') ||
                phone.startsWith('0066') ||
                phone.startsWith('0033')) {
                return {
                    countryCode: phone.slice(0, 4),
                    phoneNumber: phone.slice(4),
                };
        } else if (phone.startsWith('00886')) {
            return {
                countryCode: phone.slice(0, 5),
                phoneNumber: phone.slice(5),
            };
        } else if (phone.startsWith('0044') ||
                phone.startsWith('0055') ||
                phone.startsWith('0060') ||
                phone.startsWith('0081') ||
                phone.startsWith('0091')) {
                    return {
                        countryCode: phone.slice(0, 4),
                        phoneNumber: phone.slice(4),
                    };
        } else if (phone.startsWith('007') ||
                phone.startsWith('001')) {
                    return {
                        countryCode: phone.slice(0, 3),
                        phoneNumber: phone.slice(3),
                    };
        } else if (phone.startsWith('0049')) {
            return {
                countryCode: phone.slice(0, 4),
                phoneNumber: phone.slice(4),
            };
        } else if (phone.startsWith('0082')) {
            return {
                countryCode: phone.slice(0, 4),
                phoneNumber: phone.slice(4),
            };
        } else if (phone.startsWith('0086')) {
            return {
                countryCode: phone.slice(0, 4),
                phoneNumber: phone.slice(4),
            };
        } else {
            return {
                countryCode: '0086',
                phoneNumber: phone.slice(2),
            };
        }
    } else if (phone.startsWith('86')) {
        return {
            countryCode: '0086',
            phoneNumber: phone.slice(2),
        };
    } else {
        return {
            countryCode: '0086',
            phoneNumber: phone,
        };
    }
}