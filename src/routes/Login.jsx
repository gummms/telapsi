import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import T from "../components/T";
import { useAuth } from "../context/useAuth";

import Icones from "../components/Icones";
import heroDefault from "../assets/heroimg.jpg";
import Footer from "../sections/Footer";
import ButtonMain from "../components/ButtonMain";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, currentUser } = useAuth();
  const [heroImg, setHeroImg] = useState(heroDefault);

  useEffect(() => {
    const images = [
      heroDefault,
      "https://film-grab.com/wp-content/uploads/photo-gallery/47%20(897).jpg?bwg=1547384614",
      "https://film-grab.com/wp-content/uploads/photo-gallery/61%20(273).jpg?bwg=1547211308",
      "https://film-grab.com/wp-content/uploads/photo-gallery/Perfect_Blue_029.jpg?bwg=1569600821"
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    setHeroImg(images[randomIndex]);
  }, []);

  useEffect(() => {
    if (currentUser) {
      navigate("/professor");
    }
  }, [currentUser, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Falha no login:", error);
    }
  };

  return (
    <>
      <div className="Login">
        <div className="LoginContainer">
          <div className="LoginCard">
            <div className="LoginInput">
              <h2>Telapsi</h2>
              <h3><T>Utilize sua conta Google para entrar:</T></h3>
              <div className="LoginButton">
                <ButtonMain
                className="btn"
                  id="GoogleSignInButton"
                  onClick={handleGoogleSignIn}
                >
                  <i>
                    <Icones icone={"fa-brands fa-google"} />
                  </i>
                  <T>Entrar com Google</T>
                </ButtonMain>
              </div>
            </div>

            <img src={heroImg} alt="Cena do filme Uma Mente Brilhante" />
          </div>
          <div className="BackBtn">
            <ButtonMain path="/">
              <i>
                <Icones icone={"fa-chevron-left"} />
              </i>
              <p><T>Voltar para o site</T></p>
            </ButtonMain>
          </div>
        </div>
        <>
          <Footer />
        </>
      </div>
    </>
  );
};

export default Login;
