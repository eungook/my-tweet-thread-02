const twitter = require('../../../code/twitter').init();
const { distinct, compareFnAsc, compareFnDesc, } = require('../../../code/my-util');

export default async function handler(req, res) {
  const { query } = req;
  const { username } = query;
  const list = await myTweetThread(username);

  res.status(200).json(list);
}

/**
 * 해당 트위터 계정의 최근 트윗 스레드를 조회한다.
 * 스레드의 점수를 계산하여 Top 10의 스레드를 조회한다.
 * @param {*} username 트위터 계정명
 * @returns 
 */
async function myTweetThread(username) {
  	// dump
	const id = await twitter.usersByUsernameId(username);
	const data = await twitter.dumpUsersIdTweets(id);

	// my-tweet-thread
	const selfReplyList = data.filter(tweet => (tweet.in_reply_to_user_id == id));
	const conversationIdList = distinct(selfReplyList.map(tweet => tweet.conversation_id));
	
	// thread: {conversation_id, list, length, created_at, score}
	let threadList = conversationIdList
		// 1. conversation_id, list
		.map(conversation_id => ({
			conversation_id,
			list: data
				.filter(tweet => tweet.conversation_id == conversation_id)
				.sort(compareFnCreatedAtAsc),
		}))
		// 2. length, created_at, score
		.map(thread => ({
			...thread,
			length: thread.list.length,
			created_at: thread.list[0].created_at,
			score: (thread.list.reduce((score, tweet) => score + tweetScore(tweet), 0)) - (thread.list.length) + (thread.list.length * 0.5),
		}));

	// order by: score, length, and created_at
	threadList.sort((threadA, threadB) =>
		compareFnScoreDesc(threadA, threadB) ||
		compareFnLengthDesc(threadA, threadB) ||
		compareFnCreatedAtDesc(threadA, threadB)
	);

	// result
	threadList = threadList
		.filter(thread => (thread.conversation_id == thread.list[0].id)) // validation
		.slice(0, 10) // top 10
    .sort(compareFnCreatedAtAsc);
  
  return threadList;
}

/**
 * tweet의 점수를 매기는 함수
 * @param {*} tweet
 * @returns 
 */
function tweetScore(tweet) {
	const { public_metrics } = tweet;
	const { retweet_count, reply_count, like_count, quote_count } = public_metrics;
	return ((retweet_count * 3) + reply_count + like_count + (quote_count * 2));
}

/**
 * sort()를 위한 콜백 함수. thread를 score 순으로 내림차순 정렬.
 * @param {*} threadA 
 * @param {*} threadB 
 * @returns 
 */
function compareFnScoreDesc(threadA, threadB) {
	return compareFnDesc(threadA.score, threadB.score);
}

/**
 * sort()를 위한 콜백 함수. thread를 length 순으로 내림차순 정렬.
 * @param {*} threadA 
 * @param {*} threadB 
 * @returns 
 */
function compareFnLengthDesc(threadA, threadB) {
	return compareFnDesc(threadA.length, threadB.length);	
}

/**
 * sort()를 위한 콜백 함수. tweet|thread를 create_at 순으로 오름차순 정렬.
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
function compareFnCreatedAtAsc(a, b) {
	return compareFnAsc(new Date(a.created_at), new Date(b.created_at));
}

/**
 * sort()를 위한 콜백 함수. thread를 create_at 순으로 내림차순 정렬.
 * @param {*} threadA 
 * @param {*} threadB 
 * @returns 
 */
function compareFnCreatedAtDesc(threadA, threadB) {
	return compareFnDesc(new Date(threadA.created_at), new Date(threadB.created_at));
}