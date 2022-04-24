import { useHistory } from "react-router";
import { styled } from "@mui/system";

import {
  SwipeableDrawer as MuiDrawer,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import { ListItemIcon } from "@material-ui/core";

import {
  ChevronLeft as ChevronLeftIcon,
  SubjectOutlined,
  AddCircleOutlined,
  InboxOutlined,
} from "@material-ui/icons";

const SwipeableDrawer = styled(MuiDrawer, {
  name: "SwipeableDrawer",
  slot: "root",
  shouldForwardProp: (prop) => prop !== "openDrawer" && prop !== "width",
})(({ theme, openDrawer, width }) => ({
  "& .MuiPaper-root": {
    display: "flex",
    flexDirection: "column",
    width: width,
    padding: theme.spacing(0.5, 0),
    transition: openDrawer
      ? theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        })
      : theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
  },
}));

const SideHeader = styled("div", { name: "sideHeader", slot: "root" })(
  ({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignContent: "center",
    padding: theme.spacing(0.5, 1),
    verticalAlign: "middle",
  })
);

const BodyFrame = styled("div", {
  name: "bodyFrame",
  slot: "root",
  shouldForwardProp: (prop) => prop !== "open" && prop !== "width",
})(({ theme, open, width }) => ({
  display: "flex",
  justifyContent: "space-between",
  marginLeft: open && width,

  transition: open
    ? theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      })
    : theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
}));

const LeftIcon = styled(ChevronLeftIcon, { name: "leftIcon", slot: "root" })(
  ({ theme }) => ({
    color: theme.palette.grey[500],
    padding: theme.spacing(0.2),
    borderRadius: "50%",

    "&:hover": {
      backgroundColor: theme.palette.grey[50],
    },
  })
);

function DrawerList(props) {
  const history = useHistory();
  const location = history.location;
  const menuItems = [
    {
      text: "My Templates",
      icon: <SubjectOutlined color="secondary" />,
      path: "/",
    },

    {
      text: "My Resume",
      icon: <AddCircleOutlined color="secondary" />,
      path: "/resume",
    },

    {
      text: "Other Resume",
      icon: <InboxOutlined color="secondary" />,
      path: "/shared_resume",
    },
  ];
  return (
    <List>
      {menuItems.map((item) => {
        const selected = location.pathname === item.path;
        return (
          <ListItem
            sx={{
              bgColor: selected ? "lightgray" : "default",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: (theme) => theme.palette.grey[500],
              },
            }}
            key={item.text}
            onClick={() => history.push(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text}></ListItemText>
          </ListItem>
        );
      })}
    </List>
  );
}

function CustomDrawer(props) {
  const { open, toggleDrawer, drawerWidth } = props;
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <SwipeableDrawer
      variant="persistent"
      anchor="left"
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      open={open}
      openDrawer={open}
      width={drawerWidth}
      onOpen={toggleDrawer(true)}
      onClose={toggleDrawer(false)}
    >
      <SideHeader>
        <Typography variant="h6" lineHeight={2}>
          Regital
        </Typography>
        <IconButton onClick={toggleDrawer()}>
          <LeftIcon />
        </IconButton>
      </SideHeader>

      <Divider />

      <DrawerList />
    </SwipeableDrawer>
  );
}

export { BodyFrame, CustomDrawer };

// const useStyles = makeStyles((theme) => ({
// drawer: (showDrawer) => ({
//   "& .MuiPaper-root": {
//     display: "flex",
//     flexDirection: "column",
//     width: drawerWidth,
//     padding: theme.spacing(0.5, 0),

//     transition: showDrawer
//       ? theme.transitions.create(["margin", "width"], {
//           easing: theme.transitions.easing.easeOut,
//           duration: theme.transitions.duration.enteringScreen,
//         })
//       : theme.transitions.create(["margin", "width"], {
//           easing: theme.transitions.easing.sharp,
//           duration: theme.transitions.duration.leavingScreen,
//         }),
//   },
// }),

// drawerHeader: {
//   display: "flex",
//   justifyContent: "space-between",
//   alignContent: "center",
//   padding: theme.spacing(0.5, 1),
//   verticalAlign: "middle",
// },

// listItem: {
//   "&:hover": {
//     cursor: "pointer",
//     backgroundColor: theme.palette.grey[500],
//   },
// },

// main: (showDrawer) => ({
//   display: "flex",
//   justifyContent: "space-between",
//   marginLeft: showDrawer && `${drawerWidth}`,

//   transition: showDrawer
//     ? theme.transitions.create("margin", {
//         easing: theme.transitions.easing.easeOut,
//         duration: theme.transitions.duration.enteringScreen,
//       })
//     : theme.transitions.create("margin", {
//         easing: theme.transitions.easing.sharp,
//         duration: theme.transitions.duration.leavingScreen,
//       }),
// }),

//   leftIcon: {
//     color: "#bdbdbd",
//     padding: theme.spacing(0.2),
//     borderRadius: "50%",

//     "&:hover": {
//       backgroundColor: "#eeeeee",
//     },
//   },
// }));
