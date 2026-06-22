const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'index.html',
  'server.ts',
  'src/App.tsx',
  'src/main.tsx',
  'src/toolsData.ts',
  'src/components/tools/ToolWorkspace.tsx',
  'src/components/payment/PaywallModal.tsx',
  'src/components/admin/AdminPage.tsx',
  'src/components/admin/AdminCRMPage.tsx',
  'src/components/admin/AdminDashboard.tsx',
  'render.yaml',
  'vercel.json',
  'package.json'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace "PDF Eazy" with "Trust My PDF"
    content = content.replace(/PDF Eazy/gi, 'Trust My PDF');
    // Replace "pdfeazy.in" with "trustmypdf.in"
    content = content.replace(/pdfeazy\.in/g, 'trustmypdf.in');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', file);
  } else {
    console.log('Not found', file);
  }
});
