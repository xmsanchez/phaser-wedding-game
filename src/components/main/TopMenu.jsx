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
    <div id="top-menu" className={`top-menu ${collapsed ? "collapsed" : ""}`}>
      {!collapsed && (
        <>
          <h3>Ens faria molta il·lusió que completis el joc, però si no vols no pateixis, fes click al següent enllaç per obtenir tota la informació que necessites</h3>
          <button onClick={handleButtonClick}>VULL CONFIRMAR ASSISTÈNCIA</button>
        </>
      )}
      <div>
        <br/>
        <button className="collapse-button" onClick={toggleCollapse}>
          {collapsed ? "CONFIRMA ASSISTÈNCIA AQUÍ" : "Vull jugar"}
        </button>
      </div>
    </div>
  );
}

export default TopMenu;
