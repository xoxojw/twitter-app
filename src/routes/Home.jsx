import { useEffect, useState } from "react";
import { dbService } from "fbase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import Tweet from "components/Tweet";
import TweetForm from "components/TweetForm";

const Home = ({ userObj }) => {
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
      creatorId: userObj.uid,
      id: document.id,
      ...document.data(),
      }));
      setTweets(tweetArr);
    });
    }, []);

  return (
    <>
      <h1>Home</h1>
      <div>
        
        <div>
          <TweetForm userObj={userObj} />
          {tweets.map((tweet) => (
            <Tweet key={tweet.id} tweet={tweet} isOwner={tweet.creatorId === userObj.uid} />
          ))}
        </div>
      </div>
    </>
  )
};

export default Home;