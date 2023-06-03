import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import './TopMenu.css';

function TopMenu() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);

  const handleButtonClick = () => {
    navigate("/landing");
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={`top-menu ${collapsed ? "collapsed" : ""}`}>
      {!collapsed && (
        <>
          <h3 style={{ color: "#ffffff" }}>Ens faria molta il·lusió que completis el joc, però si no, no pateixis, fes click al següent enllaç per obtenir un resum de tot el que cal saber</h3>
          <button onClick={handleButtonClick}>CASAMENT</button>
        </>
      )}
      <div>
        <br/>
        <button className="collapse-button" onClick={toggleCollapse}>
          {collapsed ? "No vols jugar?" : "Vull jugar"}
        </button>
      </div>
    </div>
  );
}

export default TopMenu;
