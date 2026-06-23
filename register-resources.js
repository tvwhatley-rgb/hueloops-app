const fs = require('fs');
const path = require('path');

// Target the native iOS Xcode configuration file
const pbxprojPath = path.join(__dirname, 'ios', 'App', 'App.xcodeproj', 'project.pbxproj');

if (!fs.existsSync(pbxprojPath)) {
  console.error("❌ Could not find project.pbxproj at:", pbxprojPath);
  process.exit(1);
}

let content = fs.readFileSync(pbxprojPath, 'utf8');

// If already registered, do not duplicate
if (content.includes('GoogleService-Info.plist')) {
  console.log("✅ GoogleService-Info.plist is already registered in Xcode settings!");
  process.exit(0);
}

console.log("🛠️ Registering GoogleService-Info.plist in Xcode configuration...");

// 1. Register the build file entry
const buildFileEntry = "DE4C455E21DE1E4300EA0709 /* GoogleService-Info.plist in Resources */ = {isa = PBXBuildFile; fileRef = DE4C455D21DE1E4300EA0709 /* GoogleService-Info.plist */; };\n";
content = content.replace("/* Begin PBXBuildFile section */\n", "/* Begin PBXBuildFile section */\n\t\t" + buildFileEntry);

// 2. Register the file reference entry
const fileRefEntry = "DE4C455D21DE1E4300EA0709 /* GoogleService-Info.plist */ = {isa = PBXFileReference; fileEncoding = 4; lastKnownFileType = text.plist.xml; path = \"GoogleService-Info.plist\"; sourceTree = \"<group>\"; };\n";
content = content.replace("/* Begin PBXFileReference section */\n", "/* Begin PBXFileReference section */\n\t\t" + fileRefEntry);

// 3. Insert the file reference inside the App's structural folder group
if (content.includes("Info.plist */,")) {
  content = content.replace("Info.plist */,", "Info.plist */,\n\t\t\t\tDE4C455D21DE1E4300EA0709 /* GoogleService-Info.plist */,");
} else {
  console.error("⚠️ Warning: Could not locate Info.plist group tag in PBXGroup.");
}

// 4. Insert the build reference in the Resources Build Phase compilation target
if (content.includes("LaunchScreen.storyboard in Resources */,")) {
  content = content.replace("LaunchScreen.storyboard in Resources */,", "LaunchScreen.storyboard in Resources */,\n\t\t\t\tDE4C455E21DE1E4300EA0709 /* GoogleService-Info.plist in Resources */,");
} else if (content.includes("Main.storyboard in Resources */,")) {
  content = content.replace("Main.storyboard in Resources */,", "Main.storyboard in Resources */,\n\t\t\t\tDE4C455E21DE1E4300EA0709 /* GoogleService-Info.plist in Resources */,");
} else {
  console.error("⚠️ Warning: Could not locate structural layout files in Resources build phase.");
}

// Save the updated configuration
fs.writeFileSync(pbxprojPath, content, 'utf8');
console.log("🎉 Successfully linked GoogleService-Info.plist to iOS target compile resources!");