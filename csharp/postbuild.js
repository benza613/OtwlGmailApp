const fs = require('fs-extra');
// edit this with your file names
templfile = 'csharp/Home.aspx';
distfile = 'dist/OtwlGmailApp/Home.aspx';
distIndexfile = 'dist/OtwlGmailApp/index.html';

srcdir = 'dist/OtwlGmailApp';
//destdir = 'C:\\Users\\benza\\Source\\Repos\\IT1\\OTWLFRT\\CourierDetails';
//destdir = 'C:\\Users\\OTWL-D034\\Source\\Repos\\IT1\\OTWLFRT\\OtwlGmailApp';
destdir = 'F:\\Backup of Imp IT Projects\\Changes\\2.Project with Benito Code\\20052019\\OTWLFRT\\OTWLFRT\\OtwlGmailApp';

// destination will be created or overwritten by default.
fs.copyFile(templfile, distfile, (err) => {
  if (err) throw err;
  console.log('Template was copied to destination');
  ReadAppend(distfile, distIndexfile);
});

function ReadAppend(file, appendFile) {
  fs.readFile(appendFile, 'utf8', function (err, data) {
    if (err) throw err;

    var result = data.replace('head', 'head runat="server"');

    console.log('File was read');

    fs.appendFile(file, result, function (err) {
      if (err) throw err;
      console.log('The "data to append" was appended to file!');

      // copies directory, even if it has subdirectories or files
      fs.copy(srcdir, destdir, err => {
        if (err) return console.error(err)

        console.log('exported to working dir!')
      })
    });
  });
}
