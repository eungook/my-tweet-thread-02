import { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import axios from 'axios';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import { destructDate } from '../../code/my-util';

function Thread() {
	const router = useRouter();
	const { username } = router.query;
	const [data, setData] = useState([]);

	useEffect(() => {
		const isValid = (username > '');
		if (isValid == false) {
			return; // early return
		}

		axios.get(`/api/thread/${username}`).then(result => {
			const { data } = result;
			setData(data);
		});
		
	}, [username]);
	
	return (
		<div id="container">
			<main>
				{data.map(thread => (
					<section className="thread" key={thread.conversation_id}>
						<h2>{thread.list[0].text}</h2>
						<time
							dateTime={formatDate1(thread.created_at)}
							title={formatDate2(thread.created_at)}
						>
							{formatDate3(thread.created_at)}
						</time>

						{thread.list.map(tweet => (
							<div key={tweet.id}>
								<TwitterTweetEmbed
									tweetId={tweet.id}
									placeholder="Loading"
									options={{
										conversation: 'none',
									}}
								/>
							</div>
						))}
					</section>
				))}
			</main>

			<style jsx>{`
				#container {
					margin: 15px;
				}

				main {
					max-width: 550px;
					margin: 0 auto;
				}

				section:not(:last-child) {
					margin-bottom: 50px;
				}

				h2 {
					margin: 5px 0;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					color: #333;
				}

				time {
					color: #666;
				}
			`}</style>
		</div>
	);
}

export default Thread;

/**
 * 날짜를 yyyy-mm-dd로 포매팅 한다.
 * @param {*} date 날짜
 * @returns 
 */
function formatDate1(date) {
	date = destructDate(date);
	const { yyyy, mm, dd } = date;
	return `${yyyy}-${mm}-${dd}`;
}

/**
 * 날짜를 yyyy년 m월 d일 (ww)로 포매팅 한다.
 * @param {*} date 날짜
 * @returns 
 */
function formatDate2(date) {
	date = destructDate(date);
	const { yyyy, m, d, ww } = date;
	return `${yyyy}년 ${m}월 ${d}일 (${ww})`;
}

/**
 * 날짜를 m월 d일 (ww)로 포매팅 한다.
 * @param {*} date 
 */
function formatDate3(date) {
	date = destructDate(date);
	const { m, d, ww } = date;
	return `${m}월 ${d}일 (${ww})`;
}