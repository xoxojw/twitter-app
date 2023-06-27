import { useState } from "react";
import { dbService } from "fbase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

const Tweet = ({ tweet, isOwner }) => {
  // editing -> true/false값으로 수정모드인지 아닌지에 대한 상태
  const [editing, setEditng] = useState(false);
  // newTweet -> 수정 input에 입력된 값을 state에 업데이트
  const [newTweet, setNewTweet] = useState(tweet.text);

  // 삭제하기 - Firebase의 deleteDoc() 메서드
  const onDeleteClick = async () => {
    const ok = window.confirm("정말로 이 트윗을 삭제하시겠어요?");
    const tweetRef = doc(dbService, "tweets", tweet.id);
    if (ok) {
      // delete tweet
      await deleteDoc(tweetRef);
    }
  }

  // 수정하기 - updateDoc() 메서드
  const toggleEditing = () => setEditng((prev) => !prev);
  const onSubmit = async (e) => {
    e.preventDefault();
    const tweetRef = doc(dbService, "tweets", tweet.id);
    await updateDoc(tweetRef, {
      text: newTweet,
      createdAt: Date.now(),
    });
    setEditng(false);
   }
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewTweet(value);
  }

  return (
    <>
      {editing ?
        (
        <>
          {/* editing === true이면 수정 form 렌더링 */}
          {/* isOwner가 true인지 한번 더 확인해줘서 유효성 검사 향상 */}
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="현재 트윗을 수정해주세요."
                  value={newTweet}
                  onChange={onChange}
                  required
                  />
                <input type="submit" value="Update Tweet" />
              </form>
              <button onClick={toggleEditing}>취소</button>
            </>
          )}
        </>
        ) : 
        (<div style={{
          border: "1px solid black",
          margin: "10px",
          padding: "10px",
        }}>
          {tweet.attachmentUrl && <img src={tweet.attachmentUrl} width="150px" height="150px"/>}
          <h4>{tweet.text}</h4>
          <p>{new Date(tweet.createdAt).toLocaleString()}</p>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>삭제하기</button>
              <button onClick={toggleEditing}>수정하기</button>
            </>
           )
          }
        </div>
        )
        }
    </>
  )
}

export default Tweet;