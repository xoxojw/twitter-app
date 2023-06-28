import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { query, getDocs, collection, where, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { dbService } from "fbase";

const Profile = ({ userObj }) => {
  const navigate = useNavigate();
  const auth = getAuth();
  
  const onLogOutClick = () => {
    signOut(auth);
    navigate("/", { replace: true });
  };

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
    </>
  );
};

export default Profile;