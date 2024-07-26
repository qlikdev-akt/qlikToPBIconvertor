import { useNavigate } from "react-router-dom";
import "../style/landing.css";
function Landing() {
  const navigate = useNavigate();
  function navigateToDesktopInstance() {
    navigate("/setup");
  }
  return (
    <>
      <div className="button-container">
        <button
          className="btn"
          id="desktop"
          onClick={navigateToDesktopInstance}
        >
          Desktop
        </button>
        <button className="btn" id="enterprise">
          Enterprise
        </button>
        <button className="btn" id="cloud">
          Cloud
        </button>
      </div>
    </>
  );
}

export default Landing;
