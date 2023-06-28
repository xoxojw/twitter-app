import { useState, useEffect } from "react";
import { getAuth, updateProfile, signOut } from "firebase/auth";
import { query, getDocs, collection, where, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { authService, dbService } from "fbase";

const Profile = ({ userObj, refreshUser }) => {
  const navigate = useNavigate();
  const [newDisplayName, setNewDispayName] = useState(userObj.displayName);

  const onLogOutClick = () => {
    const auth = getAuth();
    signOut(auth);
    navigate("/", { replace: true });
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDispayName(value)
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      try {
        await updateProfile(authService.currentUser, { displayName: newDisplayName });
        window.alert("닉네임이 정상적으로 변경되었습니다.");
      }
      catch (error) {
        window.alert(error);
      }
    }
    refreshUser();
  }

  const getMyTweets = async () => {
    const q = query(
      collection(dbService, "tweets"),
      where("creatorId", "==", userObj.uid),
      // firebase는 noSQL DB라서 pre-made query를 만들어주어야 함
      orderBy("createdAt", "desc"),
    );
    
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  }

  useEffect(() => {
    getMyTweets();
  }, [])

  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="닉네임을 설정해주세요"
          value={newDisplayName}
        />
        <input type="submit" value="업데이트"/>
      </form>
    </>
  );
};

export default Profile;