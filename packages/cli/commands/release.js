const path = require('path');
const fsExtra = require('fs-extra');
const { omit } = require('lodash');
const shell = require('shelljs');

const outputDir = path.resolve(__dirname, '../../ccui/build');

const packageJson = require('../../ccui/package.json');

const getVersion = (version) => {
  if (version) {
    return version;
  } else {
    const versionNums = packageJson.version.split('.');
    return versionNums
      .map((num, index) => (index === versionNums.length - 1 ? +num + 1 : num))
      .join('.');
  }
};

const createPackageJson = async (version) => {
  packageJson.version = getVersion(version);
  const fileStr = JSON.stringify(
    omit(packageJson, 'scripts', 'devDependencies'),
    null,
    2
  );
  await fsExtra.outputFile(
    path.resolve(outputDir, `package.json`),
    fileStr,
    'utf-8'
  );
};

exports.release = async ({ version }) => {
  await createPackageJson(version);
  shell.sed('-i', 'workspace:', '', path.resolve(outputDir, 'package.json'));
  shell.cp('-R', path.resolve(__dirname, '../../ccui/README.md'), outputDir);
  shell.cd(outputDir);
  shell.mkdir('-p', 'theme');
  shell.cp(
    '-R',
    path.resolve(__dirname, '../../ccui/ui/theme/theme.scss'),
    path.resolve(outputDir, 'theme')
  );
  shell.cp(
    '-R',
    path.resolve(__dirname, '../../ccui/ui/theme/darkTheme.css'),
    path.resolve(outputDir, 'theme')
  );
  // shell.exec('npm publish');
};
