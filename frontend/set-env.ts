const fs = require('fs');

const sourcePath = './src/environments/environment.ts.dist';
const targetPath = './src/environments/environment.ts';

const isInteger = v => {
  if (isNaN(v)) {
    return false;
  }
  const x = parseFloat(v);
  // tslint:disable-next-line:no-bitwise
  return (x | 0) === x;
};

const isBoolean = v => v === 'true' || v === 'false';

const processFile = (file, content) => {
  // console.log(file, content);
  const data = content.match(/environment = \{\s+(.*)\s+\}/si)[1]
    .split('\n')
    .map(s => s.trim())
    .map(line => {
      const [key, value] = line.split(':').map(s => s.trim().replace(/[,]+$/, ''));
      if (process.env.hasOwnProperty(key)) {
        if (isInteger(process.env[key]) || isBoolean(process.env[key])) {
          return `${key}: ${process.env[key]}`;
        }
        return `${key}: '${process.env[key]}'`;
      }
      return `${key}: ${value}`;
    });

  console.log(data);
  let dataString = 'export const environment = {\n  ';
  dataString += data.join(',\n  ');
  dataString += '\n}';
  console.log(dataString);
  fs.writeFileSync(file, dataString);
};

fs.readFile(sourcePath, (err, data) => {
  if (err) {
    throw err;
  }
  processFile(targetPath, data.toString());
});
