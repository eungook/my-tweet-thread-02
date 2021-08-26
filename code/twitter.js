require('dotenv').config();
const Twitter = require('twitter-lite');
const { ValidError, validateParameter, } = require('./my-util');

const client = new Twitter({
	version: "2",
	extension: false,

	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token_key: process.env.ACCESS_TOKEN_KEY,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

/**
 * 트윗을 준비합니다.
 */
function init() {
  return {
		client,
		usersByUsername,
		usersIdTweets,
		usersByUsernameId,
		dumpUsersIdTweets,
  };
}

/**
 * GET /2/users/by/username/:username
 * @param username 트위터 계정 이름
 * @returns Promise
 * @see [참고: API 문서](https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-by-username-username)
 */
function usersByUsername(username) {
	validateParameter('username', username);
	return client.get(`users/by/username/${username}`);
}

/**
 * GET /2/users/:id/tweets
 * @param id 트위터 내부 id
 * @param parameters
 * @returns Promise
 * @see [참고: API 문서](https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-tweets)
 */
function usersIdTweets(id, parameters) {
	validateParameter('id', id);
	validateParameter('parameters', parameters);
	return client.get(`users/${id}/tweets`, parameters);
}

/**
 * 트위터 계정명으로 트위터 내부 id를 얻습니다.
 * @param {*} username 트위터 계정명
 * @returns 트위터 내부 id
 */
async function usersByUsernameId(username) {
	const result = await usersByUsername(username);
	const { data } = result;
	const { id } = data;
	return id;
}

/**
 * 트위터 계정의 트윗을 덤프한다.
 * {@link usersByUsername}의 wrapper
 * @param {*} id 트위터 내부 id
 * @returns 
 */
async function dumpUsersIdTweets(id) {
	const parameters = {
		'tweet.fields': 'conversation_id,in_reply_to_user_id,created_at,public_metrics',
		expansions: 'author_id,in_reply_to_user_id',
		exclude: 'retweets,replies',
		max_results: 100,
		// pagination_token: '', // at first: DO NOT SET THIS PROPERTY
	};

	// do-while
	let SAFETY = 10; // safety
	let pagination_token = '';

	// result
	let data = [];

	do {
		SAFETY--;
		const result = await usersIdTweets(id, parameters);
		const { errors, meta } = result;
		data = [...data, ...result.data];
		const { next_token, result_count } = meta;
		pagination_token = next_token; // do-while
		parameters.pagination_token = next_token; // pagination

	} while (pagination_token > '' && SAFETY > 0)

	return data;
}

module.exports = { init };