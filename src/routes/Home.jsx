import { useEffect, useState } from "react";
import { dbService } from "fbase";
import {
  addDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
  } from "firebase/firestore";
import Tweet from "components/Tweet";

const Home = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [tweets, setTweets] = useState([]);
  
  useEffect(() => {
    // query 불러오고 정렬하기
    const q = query(
      collection(dbService, "tweets"),
      orderBy("createdAt", "desc"),
    );
    // snapshot
    onSnapshot(q, (snapshot) => {
    const tweetArr = snapshot.docs.map((document) => ({
      creatorId: 12121,
      id: document.id,
      ...document.data(),
      }));
      setTweets(tweetArr);
      console.log(tweets);
    });
    }, []);

  const onSubmitTweet = async (e) => {
    e.preventDefault();
    try {
      // "tweets" : collection 이름
      const docRef = await addDoc(collection(dbService, "tweets"), {
        text: tweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
      });
      console.log("Tweet written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding tweet: ", error);
    }
    setTweet("");
  }

  const onChange = (e) => {setTweet(e.target.value)}

  return (
    <>
      <h1>Home</h1>
      <div>
        <form onSubmit={onSubmitTweet}>
          <input value={tweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
          <input type="submit" value="Tweet" />
        </form>
        <div>
          {tweets.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} isOwner={tweet.creatorId === userObj.uid} />
          ))}
        </div>
      </div>
    </>
  )
};

export default Home;