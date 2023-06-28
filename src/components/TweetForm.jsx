import { useState } from "react";
import uuid from "react-uuid";
import { dbService, storageService } from "fbase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const TweetForm = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const onSubmitTweet = async (e) => {
    e.preventDefault();
    let attachmentUrl = "";

    const ok = window.confirm("트윗을 등록하시겠어요?")
    if (ok) {
      //이미지 첨부하지 않고 텍스트만 올리고 싶을 때도 있기 때문에 attachment가 있을때만 아래 코드 실행
      //이미지 첨부하지 않은 경우엔 attachmentUrl=""
      if (attachment !== "") {
        //파일 경로 참조 만들기
        const attachmentRef = ref(storageService, `${userObj.uid}/${uuid()}`);
        //storage 참조 경로로 파일 업로드 하기
        const response = await uploadString(attachmentRef, attachment, "data_url");
        //storage 참조 경로에 있는 파일의 URL을 다운로드해서 attachmentUrl 변수에 넣어서 업데이트
        attachmentUrl = await getDownloadURL(response.ref);
      }

      try {
        // "tweets" : collection 이름
        await addDoc(collection(dbService, "tweets"), {
          text: tweet,
          createdAt: Date.now(),
          creatorId: userObj.uid,
          attachmentUrl,
        });
      } catch (error) {
        alert("트윗이 정상적으로 업로드되지 않았습니다. 다시 시도해주세요.");
        console.error("Error adding tweet: ", error);
      }

      setTweet("");
      setAttachment("");
    };
  }

  const onChange = (e) => {setTweet(e.target.value)}

  const onFileChange = (e) => {
    // Uncaught TypeError: Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'. 오류 발생
    // const {
    //   target: { files },
    // } = e;
    const files = e.target?.files;

    // fileReader API
    // 1. input에 있는 모든 파일 중에 첫번째 파일만 받도록 한다.
    const theFile = files[0];
    // 2. 그 파일로 reader를 만든 후
    const imgFileReader = new FileReader();
    // 3. reader에 event listner를 추가한다.
    imgFileReader.onloadend = (finishedEvent) => {
      const { currentTarget: { result }
        , } = finishedEvent;
      // 브라우저가 읽을 수 있는 파일명을 state에 저장
      setAttachment(result);
    }
    // 4. readAsDataURL API로 사진을 얻는다.
    imgFileReader.readAsDataURL(theFile);
  }
  const onClearAttatchment = () => setAttachment("");

  return (
    <>
      <form onSubmit={onSubmitTweet} style={{ margin: "20px" }}>
        <input
          value={tweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120} />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Tweet" />
        {attachment && <div>
          <img src={attachment} alt="loading" width="50px" height="50px" />
          <button onClick={onClearAttatchment}>✖️</button>
        </div>}
      </form>
    </>
  )
}

export default TweetForm;