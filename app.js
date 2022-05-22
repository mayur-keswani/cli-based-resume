var blessed = require("blessed");
const fs = require("fs");
const path = require("path");

// Create a screen object.
var screen = blessed.screen({
  smartCSR: true,
  width: "100%",
  dockBorders: true,
  cursor: {
    artificial: true,
    shape: "line",
    blink: true,
    color: null,
  },
});
screen.title = "Mayur Keswani";

// Create a Welcome Box
var welcomeBox = blessed.box({
  top: "center",
  left: "center",
  width: "50%",
  height: "200",
  content: "{bold}Hello Muggle!, Welcome to my Resume-World{/bold}!",
  align: "center",
  valign: "middle",
  tags: true,
  border: {
    type: "line",
  },
  style: {
    fg: "white",
    bg: "#363636",
    border: {
      fg: "red",
    },
    hover: {
      bg: "green",
    },
  },
});

// Append our box to the screen.
screen.append(welcomeBox);

const fetchContent = (filename) => {
  let content = "";
  try {
    let data = fs.readFileSync(
      path.join(process.cwd(), "sections", `${filename}.txt`),
      "utf8"
    );
    return data
  } catch (error) {
    return error;
  }

  //return filename;
};
const displayContent = (selectedSection) => {
  let content = "";

  content = fetchContent(selectedSection.toLowerCase());

  return content;
};
// Widget to show resume section
var sectionBox = blessed.box({
  width: "25%",
  // height: "shrink",
  // content: "Sections!...",
  tags: true,
  border: {
    type: "line",
  },
  style: {
    fg: "white",
    bg: "gray",
    hover: {
      bg: "green",
    },
  },
});

// Widget to Set List Option in SectionBox i.e, Description,Projects,Skils etc...
var sectionOptions = blessed.list({
  parent: sectionBox,
  mouse: true,
  label: "Resume Section",
  border: "line",
  style: {
    fg: "blue",
    bg: "default",
    border: {
      fg: "default",
      bg: "default",
    },
    selected: {
      bg: "green",
    },
  },
  width: "shrink",
  height: "shrink",
  top: "left",
  left: "left",
  tags: true,
  invertSelected: false,
  mouse: true,
  keys: true,
  autoCommandKeys: true,
  items: [
    "Description",
    "{red-fg}Projects{/red-fg}",
    "Skills",
    "Experience",
    "Education",
    "Contacts",
  ],
  scrollbar: {
    ch: " ",
    track: {
      bg: "red",
    },
    style: {
      // inverse: true,
    },
  },
});
// sectionOptions.items.forEach(function (item) {
//   item.setHover('>'+item.getText().trim());
// });

// var item = sectionOptions.items[1];
// sectionOptions.removeItem(sectionOptions.items[1]);
// sectionOptions.insertItem(1, item.getContent());

sectionOptions.on("keydown", function (ch, key) {
  contentBox.destroy();
  if (key.name === "up" || key.name === "k") {
    sectionOptions.up();
    screen.render();
    return;
  } else if (key.name === "down" || key.name === "j") {
    sectionOptions.down();
    screen.render();
    return;
  }
});

var content = blessed.box({
  top: 0,
  right: 0,
  width: "75%",
  height: "100%",
  tags: true,
  border: {
    type: "line",
  },
  // content: "",
  style: {
    fg: "white",
    bg: "#363636",
    display: "flex",
    hover: {
      bg: "green",
    },
  },
});

var contentTitle = blessed.box({
  top: 0,
  left: 0,
  parent: content,
  width: "30%",
  height: "shrink",
  content: "Content Title!",
  tags: true,
  border: {
    type: "line",
  },
  style: {
    fg: "white",
    bg: "#363636",
    hover: {
      bg: "green",
    },
  },
});
var contentData = blessed.box({
  top: "100",
  left: 0,
  parent: content,
  width: "98%",
  height: "shrink",
  content: "No Section Selected!",
  tags: true,
  border: {
    type: "line",
  },
  style: {
    fg: "white",
    bg: "#363636",

    hover: {
      bg: "green",
    },
  },
});

sectionOptions.on("select", function (item, select) {
  // sectionOptions.setLabel(" " + item.getText() + " ");
  contentTitle.content = item.getText();
  contentData.content = displayContent(item.getText());
  screen.render();
});
// If box is focused, handle `enter`/`return` and give us some more content.
welcomeBox.key("enter", function (ch, key) {
  welcomeBox.destroy();
  screen.append(sectionBox);
  screen.append(content);
  // screen.append(contentData);
  // screen.render();

  screen.render();
  sectionOptions.focus();
});

// Quit on Escape, q, or Control-C.
screen.key(["escape", "q", "C-c"], function (ch, key) {
  return process.exit(0);
});

// Focus our element.
welcomeBox.focus();

screen.on("keypress", function (ch, key) {
  if (key.name === "tab") {
    return key.shift ? screen.focusPrevious() : screen.focusNext();
  }
  if (key.name === "escape" || key.name === "q") {
    return process.exit(0);
  }
});
// Render the screen.
screen.render();
