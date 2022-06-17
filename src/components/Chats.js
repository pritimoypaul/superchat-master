import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ChatEngine } from "react-chat-engine";
import { app } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { getAuth } from "firebase/auth";
import axios from "axios";

const auth = getAuth(app);

const Chats = () => {
  const history = useHistory();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  console.log(user);

  const handleLogout = async () => {
    await auth.signOut();
    history.push("/");
  };

  const getFile = async (url) => {
    const response = await fetch(url);
    const data = await response.blob();
    return new File([data], "userPhoto.jpg", { type: "image/jpeg" });
  };

  useEffect(() => {
    if (!user) {
      history.push("/");
      return;
    }
    axios
      .get("https://api.chatengine.io/users/me", {
        headers: {
          "project-id": process.env.CHAT_ENGINE_PROJECT_ID,
          "user-name": user.displayName,
          "user-secret": user.uid,
        },
      })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        let formdata = new FormData();
        formdata.append("email", user.email);
        formdata.append("username", user.displayName);
        formdata.append("secret", user.uid);
        getFile(user.photoURL).then((avatar) => {
          formdata.append("avatar", avatar, avatar.name);

          axios
            .post("https://api.chatengine.io/users/", formdata, {
              headers: {
                "private-key": process.env.CHAT_ENGINE_PRIVATE_KEY,
              },
            })
            .then(() => setLoading(false))
            .catch((err) => console.log(err));
        });
      });
  }, [user, history]);

  if (!user || loading) return "Loading...";

  return (
    <div className="chats-page">
      <div className="nav-bar">
        <div className="logo-tab">SuperChat</div>
        <div className="logout-tab" onClick={handleLogout}>
          Logout
        </div>
      </div>
      <ChatEngine
        height="calc(100vh - 66px)"
        projectID={process.env.CHAT_ENGINE_PROJECT_ID}
        privateKey={process.env.CHAT_ENGINE_PRIVATE_KEY}
        userName={user.displayName}
        userSecret={user.uid}
      />
    </div>
  );
};

export default Chats;
