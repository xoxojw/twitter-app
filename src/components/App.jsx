import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const App = () => {
  const [init, setInit] = useState(false);
  // tweet을 누가 썼는지 확인하기 위해 현재 로그인 되어있는 유저 state 관리
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    // 로그인이 되면, onAuthS(tateChanged 함수가 호출됨
    onAuthStateChanged(auth, (user) => { 
      if (user) {
        // 로그인이 되면 userObj의 state가 초기값 null에서 userObj로 변경
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        });

        // AppRouter에 위의 두 정보(로그인 여부, 유저명)를 props로 전달해줘야함
      } else {
        setUserObj(null);
      }
      setInit(true);
     });
  })

  return (
    <>
      {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "Initializing..."}
      <footer>&copy; Twitter-clone-app {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
