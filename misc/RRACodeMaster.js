/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* To use this as a library, add this code to your doc:
function onOpen(ev) {
    return RRACodeMaster.onOpen(ev);
}

To add the library, in a document: Tools menu > Script Editor
Resources menu > Libraries

And add this project's key identifier (MUhl8ggBOAixeY3wLW2aqooJhnl668_xO) (or you project's identifier)
Note that if you want to always get the latest version, you need to check the "development" checkbox, else just select the desired version.
*/

function onOpen(ev) {
  var ui = DocumentApp.getUi();
  var menu1 = ui.createMenu('RRA Utilities')
  .addSubMenu(ui.createMenu('Insert Data Classification Label')
                   .addItem('Public', 'RRACodeMaster.class1')
                   .addItem('Staff Confidential', 'RRACodeMaster.class2')
                   .addItem('Workgroup Confidential', 'RRACodeMaster.class3')
                   .addItem('Individual Confidential', 'RRACodeMaster.class4'))
  .addSeparator()
  .addSubMenu(ui.createMenu('Insert Impact Label')
                   .addItem('LOW', 'RRACodeMaster.risk1')
                   .addItem('MEDIUM', 'RRACodeMaster.risk2')
                   .addItem('HIGH', 'RRACodeMaster.risk3')
                   .addItem('MAXIMUM', 'RRACodeMaster.risk4'))
  .addSeparator()
  .addItem('Mark RRA as last reviewed by myself', 'RRACodeMaster.markRRA');
  menu1.addToUi();
}

// TODO Replace markRRA with managed named versions, whenever the API allows this (on 2018-03, it does not allow this yet)
// `onEdit` Is not possible with Docs, only Sheet. See https://developers.google.com/apps-script/guides/triggers/events#google_docs_events
// This is using a menu trigger instead.
function markRRA(ev) {
  // Get new values for footer
  var  time = new Date();
  time = Utilities.formatDate(time, "GMT-00:00", "YYYY-MM-dd hh:mm:ss");
  var user = Session.getActiveUser().getEmail();
  
  // Setup new footer
  var doc = DocumentApp.getActiveDocument();
  var ftr = doc.getFooter();
  var txt = 'Rapid Risk Analysis is a lightweight risk and threat modeling framework.\rRRA was last reviewed at DATE by USER';
  var style = {};
  style[DocumentApp.Attribute.FONT_SIZE] = 8;
  style[DocumentApp.Attribute.ITALIC] = true;
  style[DocumentApp.Attribute.HORIZONTAL_ALIGNMENT] = DocumentApp.HorizontalAlignment.CENTER;
  
  // Replace/set values
  ftr.setText(txt);
  ftr.replaceText('DATE', time);
  ftr.replaceText('USER', user);
  ftr.getChild(0).setAttributes(style);
}

// Data classification menus
function insertClassification(title1, color1) {
  var doc = DocumentApp.getActiveDocument();
  var c = doc.getCursor();
  var style = {};
  style[DocumentApp.Attribute.FOREGROUND_COLOR] = color1;
  style[DocumentApp.Attribute.FONT_FAMILY] = 'Open Sans';
  style[DocumentApp.Attribute.FONT_SIZE] = 10;
  style[DocumentApp.Attribute.BOLD] = true;
  style[DocumentApp.Attribute.UNDERLINE] = false;

  c.insertText(title1);
  
  var txt = c.getSurroundingText();
  var cpos_start = c.getSurroundingTextOffset();
  var cpos_end = cpos_start + title1.length-1;
  
  txt.setLinkUrl(cpos_start, cpos_end, 'https://wiki.mozilla.org/Security/Data_Classification');
  txt.setAttributes(cpos_start, cpos_end, style);
}

function class1() {
  insertClassification('Public', '#7a7a7a');
}
function class2() {
  insertClassification('Staff Confidential', '#4a6785');
}
function class3() {
  insertClassification('Workgroup Confidential', '#ebbd30'); // this is not the standard level color, but the standard color is far too flashy in gdocs.
                                                             // this color code is very close but darker and does not look as flashy in gdocs.
}
function class4() {
  insertClassification('Individual Confidential', '#d04437');
}

// Risk label menus
function insertRisk(title1, color1) {
  var doc = DocumentApp.getActiveDocument();
  var c = doc.getCursor();
  var style = {};
  style[DocumentApp.Attribute.FOREGROUND_COLOR] = color1;
  style[DocumentApp.Attribute.FONT_FAMILY] = 'Open Sans';
  style[DocumentApp.Attribute.FONT_SIZE] = 10;
  style[DocumentApp.Attribute.BOLD] = true;
  style[DocumentApp.Attribute.UNDERLINE] = false;

  
  var txt = c.getSurroundingText();
  //c.insertText(title1);
  //var cpos_start = c.getSurroundingTextOffset();
  //var cpos_end = cpos_start + title1.length-1;
  // Override position so that its always at the start of the string, so that we can parse it properly
  cpos_start = 0;
  cpos_end = title1.length-1;
  txt.insertText(cpos_start, title1+' '); //add extra spacing for convenience
  txt.setLinkUrl(cpos_start, cpos_end, 'https://wiki.mozilla.org/Security/Standard_Levels');
  txt.setAttributes(cpos_start, cpos_end, style);
}

function risk1() {
  insertRisk('LOW', '#7a7a7a');
}
function risk2() {
  insertRisk('MEDIUM', '#4a6785');
}
function risk3() {
  insertRisk('HIGH', '#ebbd30'); // this is not the standard level color, but the standard color is far too flashy in gdocs
}
function risk4() {
  insertRisk('MAXIMUM', '#d04437');
}
