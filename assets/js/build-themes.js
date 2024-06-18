import { compile } from "sass";
import { join } from "path";
import { existsSync, mkdirSync, readdirSync, unlinkSync, writeFileSync } from "fs";

const themeColors = [
  "amber",
  "blue",
  "cyan",
  "fuchsia",
  "green",
  "grey",
  "indigo",
  "jade",
  "lime",
  "orange",
  "pink",
  "pumpkin",
  "purple",
  "red",
  "sand",
  "slate",
  "violet",
  "yellow",
  "zinc",
];

const tempScssFoldername = join(__dirname, "../.pico");
const cssFoldername = join(__dirname, "../css");

// Create a folder if it doesn't exist
const createFolderIfNotExists = (foldername) => {
  if (!existsSync(foldername)) {
    mkdirSync(foldername);
  }
};

// Empty a folder
const emptyFolder = (foldername) => {
  // Delete all files in the temp folder
  readdirSync(foldername).forEach((file) => {
    unlinkSync(join(foldername, file));
  });
};

// Create the temp folder if it doesn't exist
createFolderIfNotExists(tempScssFoldername);

// Empty the temp folder
emptyFolder(tempScssFoldername);

// Loop through the theme colors
themeColors.forEach((themeColor, colorIndex) => {
  // All the versions to generate
  const versions = [
    {
      name: "pico",
      content: `@use "../scss" with (
        $theme-color: "${themeColor}"
      );`,
    },
    {
      name: "pico.classless",
      content: `@use "../scss" with (
        $theme-color: "${themeColor}",
        $enable-semantic-container: true,
        $enable-classes: false
      );`,
    },
    {
      name: "pico.fluid.classless",
      content: `@use "../scss" with (
        $theme-color: "${themeColor}", 
        $enable-semantic-container: true, 
        $enable-viewport: false, 
        $enable-classes: false
      );`,
    },
    {
      name: "pico.conditional",
      content: `@use "../scss" with (
        $theme-color: "${themeColor}",
        $parent-selector: ".pico"
      );`,
    },
    {
      name: "pico.classless.conditional",
      content: `@use "../scss" with (
        $theme-color: "${themeColor}",
        $enable-semantic-container: true,
        $enable-classes: false,
        $parent-selector: ".pico"
      );`,
    },
    {
      name: "pico.fluid.classless.conditional",
      content: `@use "../scss" with (
        $theme-color: "${themeColor}", 
        $enable-semantic-container: true, 
        $enable-viewport: false, 
        $enable-classes: false,
        $parent-selector: ".pico"
      );`,
    },
  ];

  const displayAsciiProgress = ({length, index, color}) => {
    const progress = Math.round((index / length) * 100);
    const bar = "■".repeat(progress / 10);
    const empty = "□".repeat(10 - progress / 10);
    process.stdout.write(`[@picocss/pico] ✨ ${bar}${empty} ${color}\r`);
  };

  // Loop through the versions
  versions.forEach((version) => {
    displayAsciiProgress({
      length: themeColors.length,
      index: colorIndex,
      color: themeColor.charAt(0).toUpperCase() + themeColor.slice(1),
    });

    // Create the file
    writeFileSync(
      join(tempScssFoldername, `${version.name}.${themeColor}.scss`),
      version.content,
    );

    // Compile the file
    const result = compile(
      join(tempScssFoldername, `${version.name}.${themeColor}.scss`),
      { outputStyle: "compressed" },
    );

    // Write the file
    writeFileSync(join(cssFoldername, `${version.name}.${themeColor}.css`), result.css);

    // Clear the console
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  });
});

// Empty the temp folder
emptyFolder(tempScssFoldername);
