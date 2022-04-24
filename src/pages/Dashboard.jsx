import PageHeader from "../components/Dashboard/PageHeader";
import { CustomDrawer, BodyFrame } from "../components/Dashboard/Drawer";
import { TemplateList } from "../components/Dashboard/PageSection";
import { useState } from "react";

const drawerWidth = "250px";

export function Layout({ children }) {
  const [showDrawer, setShowDrawer] = useState(false);

  const toggleDrawer = (forced = null) => {
    if (forced === null) return () => setShowDrawer(!showDrawer);
    return () => setShowDrawer(forced);
  };

  const layoutProps = { open: showDrawer, toggleDrawer, drawerWidth };
  return (
    <div>
      <CustomDrawer {...layoutProps} />
      <PageHeader {...layoutProps} />
      <BodyFrame open={showDrawer} width={drawerWidth}>
        {children}
      </BodyFrame>
    </div>
  );
}

function Dashboard() {
  return (
    <Layout>
      <TemplateList />
    </Layout>
  );
}

export default Dashboard;
