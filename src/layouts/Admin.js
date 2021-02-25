import React, { Component } from "react";
import { useLocation, Route, Switch } from "react-router-dom";

import routes from "routes.js";


function Admin() {
  const location = useLocation();
  const mainPanel = React.useRef(null);
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            render={(props) => <prop.component {...props} />}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      var element = document.getElementById("bodyClick");
      element.parentNode.removeChild(element);
    }
  }, [location]);
  return (
    <>
      <div className="wrapper" style={{background: '#EBECEF'}}>
        <div className="" ref={mainPanel}>
          <div
            className="content"
            style={{
              paddingTop: "50px",
              paddingLeft: "50px",
              background: "#172C49",
              // overflow: 'hidden'
            }}
          >
            <Switch>{getRoutes(routes)}</Switch>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin;
