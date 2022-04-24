import { createContext, useState } from "react";
import { useStyles } from "../hooks/useDrawer";

const DrawerContext = createContext();

function DrawerProvider({ children }) {
  const startingShowDrawer = false;
  const [showDrawer, setShowDrawer] = useState(startingShowDrawer);
  const [className, setClassName] = useState({
    appBar: "appBar open",
    drawer: "drawer open",
  });

  const classes = useStyles();

  const toggleDrawer = (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setShowDrawer(!showDrawer);
    const appClass = showDrawer ? "appBarOpen" : "appBarClose";
    const drawerClass = showDrawer ? "drawerOpen" : "drawerClose";
    setClassName({ appBar: classes[appClass], drawer: classes[drawerClass] });
  };

  const contextData = {
    classes,
    className,
    showDrawer,
    setShowDrawer,
    toggleDrawer,
  };

  return (
    <DrawerContext.Provider value={contextData}>
      {children}
    </DrawerContext.Provider>
  );
}

export { DrawerContext, DrawerProvider };
