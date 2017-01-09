import fetch from './fetch';

export default (file) => {
  return fetch(`/_/private/presign?filename=${file.name}&length=${file.size}&type=${file.type}`)
    .then(response => {
      let signed = response.data.signedUrl,
        data = new FormData();
      data.append('file', file);
      return new Promise(function(resolve) {
        let xhr = new XMLHttpRequest();
        if (xhr.withCredentials != null) {
          xhr.open('PUT', signed, true);
        }
        else if (typeof XDomainRequest !== "undefined") {
          xhr = new XDomainRequest();
          xhr.open('PUT', signed);
        }
        else {
          xhr = null;
        }
        xhr.setRequestHeader('Content-Type', response.data.type);
        xhr.setRequestHeader('Content-Disposition','inline; filename=' + response.data.filename);
        xhr.setRequestHeader('x-amz-acl', 'public-read');
        xhr.onload = function() {
          resolve({ url: response.data.publicUrl });
        };
        xhr.send(file);
      });
    });
}