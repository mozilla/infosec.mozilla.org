---
layout: default
resource: true
categories: [Disabled]
title: Create a New Security Incident
description: Tool to create an new Google Drive folder and document for a security incident
---

<div id="incident">
  <p>
    <fieldset>
      <label for="text">Name of the incident</label>
      <input id="text" type="text" placeholder="Enter your text here" /><br />
    </fieldset>
  </p>
  <p>
    <button type="submit" id="submit">Submit</button>
  </p>
</div>

<div id="results"></div>

---

<p>
  <button id="authorize_button" style="display: none;">Authorize</button>
  <button id="signout_button" style="display: none;">Sign Out</button>
</p>

<script type="text/javascript">
  // Client ID and API key from the Developer Console
  // https://developers.google.com/workspace/guides/create-credentials#client
  // Google Project : security-incident-doc-creator 537143757568

  var CLIENT_ID = '537143757568-avr40v4ssk02qo3ncb87cc6kq8je27ut.apps.googleusercontent.com';
  var API_KEY = 'AIzaSyC4uh5pqr9pms8cQ80_jn0WFMj90YvK1Nc';
  var INCIDENT_FOLDER_ID = '1gb6Gz_sgIb4SJy15kgHImxiVDwfoMI_1';
  var INCIDENT_TEMPLATE_ID = '1KfaAca4zClGedtKwWCuvkQa02fUTBJL51ylYElEFHac';

  // Array of API discovery doc URLs
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

  // Authorization scopes required by the API
  var SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly';

  var authorizeButton = document.getElementById('authorize_button');
  var signoutButton = document.getElementById('signout_button');

  /**
   *  On load, called to load the auth2 library and API client library.
   */
  function handleClientLoad() {
    gapi.load('client:auth2', initClient);
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  function initClient() {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(function () {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // Handle the initial sign-in state.
      updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      authorizeButton.onclick = handleAuthClick;
      signoutButton.onclick = handleSignoutClick;
    }, function(error) {
      showMessage(document.createTextNode(JSON.stringify(error, null, 2) + '\n'));
    });
  }

  /**
   *  Called when the signed in status changes, to update the UI
   *  appropriately. After a sign-in, the API is called.
   */
  function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      authorizeButton.style.display = 'none';
      signoutButton.style.display = 'block';
      document.getElementById('submit').onclick = createIncident;
      document.getElementById('incident').style.display = 'block';
    } else {
      authorizeButton.style.display = 'block';
      signoutButton.style.display = 'none';
      document.getElementById('incident').style.display = 'none';
    }
  }

  /**
   *  Sign in the user upon button click.
   */
  function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
  }

  /**
   *  Sign out the user upon button click.
   */
  function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
  }

  /**
   * Return a link element.
   *
   * @param {string} text Text to hyperlinked.
   * @param {string} imageUrl Image URL to be hyperlinked.
   * @param {string} url URL of the link.
   */
  function getLink(text, imageUrl, url) {
      var image = document.createElement('img');
      image.src = imageUrl;
      image.style = 'vertical-align: middle;';
      var link = document.createElement('a');
      link.href = url;
      link.appendChild(document.createTextNode(text));
      link.appendChild(image);
      return link;
  }

  /**
   * Append an element to the result div.
   *
   * @param {Element} element Element to be added to results.
   */
  function showMessage(element) {
    var div = document.getElementById('results');
    div.appendChild(element);
    div.appendChild(document.createElement('br'));
  }

  /**
   * Get the name of the incident from the input and call createFolderAndDoc
   * to create a folder and doc with that name
   */
  function createIncident() {
    var incidentName = document.getElementById('text').value;
    var m = new Date();
    var dateString = m.getFullYear() +"-"+ ('0' + (m.getMonth()+1)).slice(-2) +"-"+ ('0' + m.getDate()).slice(-2);
    var title = `${dateString} Security Incident ${incidentName}`;
    createFolderAndDoc(title);
  }


  /**
   * Create folder and doc
   */
  function createFolderAndDoc(name) {
    // scopes needed
    // Create document and folder https://www.googleapis.com/auth/drive.file
    // Read incident template document https://www.googleapis.com/auth/drive.readonly
    console.log(`Creating incident called ${name}`);
    var folderMetadata = {
      'name': name,
      'mimeType': 'application/vnd.google-apps.folder',
      'parents': [INCIDENT_FOLDER_ID]
    };
    gapi.client.drive.files.create({
      resource: folderMetadata,
      fields: 'id,webViewLink'
    }).then(function(response) {
        var folderId = response.result.id;
        var folderWebViewLink = response.result.webViewLink;
        console.log(`Folder ${name} created : ${folderWebViewLink}`);
        var fileMetadata = {
            'name': name,
            'parents': [folderId]
        };
        gapi.client.drive.files.copy({
            fileId: INCIDENT_TEMPLATE_ID,
            supportsAllDrives: true,
            resource: fileMetadata,
            fields: 'id,webViewLink'
        }).then(function (response) {
            var documentWebViewLink = response.result.webViewLink;
            console.log(`File ${name} created : ${documentWebViewLink}`);
            return {'folderWebViewLink': folderWebViewLink, 'documentWebViewLink': documentWebViewLink};
        }).then(function (response) {

          showMessage(getLink('The new incident document', '/assets/images/icon-google-doc.svg', response.documentWebViewLink));
          showMessage(getLink('The new incident folder', '/assets/images/icon-folder.svg', response.folderWebViewLink));
        });
    });
  }

</script>

<script async defer src="https://apis.google.com/js/api.js"
  onload="this.onload=function(){};handleClientLoad()"
  onreadystatechange="if (this.readyState === 'complete') this.onload()">
</script>
