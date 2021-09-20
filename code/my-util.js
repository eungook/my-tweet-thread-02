/**
 * 검증 오류
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types
 */
class ValidError extends Error {
  constructor(...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidError);
    }
  }
}

/**
 * 파라미터를 검증합니다.
 * @param {*} name 파라미터명
 * @param {*} value 파라미터값
 */
function validateParameter(name, value) {
	const isValid = (value > '');
	if (isValid == false) {
		throw new ValidError(`parameter가 올바르지 않습니다. name: '${name}', value: '${value}'`);
	}
}

/**
 * 리스트의 중복 값을 제거한다.
 * @param {*} list 
 * @returns 중복 값이 제거된 list
 */
function distinct(list) {
	return Object.keys(list.reduce((object, item) => ({
		...object,
		[item]: true,
	}), {}));
}

/**
 * sort()를 위한 콜백 함수. 오름차순 정렬. (1, 2, 3, ...)
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
function compareFnAsc(a, b) {
	if (a > b) {
		return 1;

	} else if (a < b) {
		return -1;

	} else {
		return 0;
	}
}

/**
 * sort()를 위한 콜백 함수. 내림차순 정렬. (9, 8, 7, ...)
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
function compareFnDesc(a, b) {
	if (a > b) {
		return -1;

	} else if (a < b) {
		return 1;

	} else {
		return 0;
	}
}

/**
 * 날짜 정보를 구조 분해하여 리턴한다.
 * @param {*} date 날짜 문자열
 * @returns 
 */
function destructDate(date) {
	date = new Date(date);
	const yyyy = date.getFullYear();
	const m = date.getMonth() + 1;
	const mm = (m < 10 ? '0' : '') + m;
	const d = date.getDate();

	const dd = (d < 10 ? '0' : '') + d;
	const h = date.getHours();
	const hh = (h < 10 ? '0' : '') + h;
	const i = date.getMinutes();
	const ii = (i < 10 ? '0' : '') + i;

	const s = date.getSeconds();
	const ss = (s < 10 ? '0' : '') + s;
	const w = date.getDay();
	const ww = (['일', '월', '화', '수', '목', '금', '토'])[w];

	return {
		date, yyyy, m, mm, d,
		dd, h, hh, i, ii,
		s, ss, w, ww,
	};
}

module.exports = {
	ValidError,
	validateParameter,
	distinct,
	compareFnAsc,
	compareFnDesc,
	destructDate,
};