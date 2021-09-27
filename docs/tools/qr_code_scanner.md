---
layout: default
resource: true
categories: [Tools]
title: QR Code Scanner
description: Tool to parse an image file containing a QR Code
---

# QR Code Scanner

Select the QR Code image file

<input type="file" id="qr-input-file" accept="image/*">
<div id="reader" style="display: inline-block;"></div>
<div class="empty"></div>

# Decoded QR Code Results

<div id="scanned-result" style="font-family: monospace,monospace; padding: .2em .4em; margin: 0; font-size: 85%; background-color: rgba(27,31,35,.05); border-radius: 3px;"></div>

---

# How can you trust that uploading an image to this page is safe and it won't be sent out of your browser?

## Verify this page is using an unmodified html5-qrcode library

This page uses the [html5-qrcode](https://github.com/davidshimjs/qrcodejs) library,
[version 2.0.11](https://github.com/mebjas/html5-qrcode/releases/tag/V2.0.11).
You can see that this library is what's in use on the page by looking at this
page's source.

You can see that the html5-qrcode library this page uses is the same as the one
on GitHub by comparing the hash of the library at version 2.0.11 on GitHub and 
the library that this page uses

```bash
test "$(curl --silent https://github.com/mebjas/html5-qrcode/releases/download/V2.0.11/html5-qrcode.min.js | sha256sum)" \
   = "$(curl --silent https://infosec.mozilla.org/assets/js/html5-qrcode-2.0.11.min.js | sha256sum)" && echo "Success, html5-qrcode hashes match"
```

## Verify this pages html5-qrcode library does what you'd expect

Unfortunately, the html5-qrcode codebase is large, but you can look at the
contents as of [version 2.0.11 here](https://github.com/mebjas/html5-qrcode/tree/V2.0.11)
to see what it does.

{% include_relative can_you_trust_these_libraries.md %}

<script src="/assets/js/html5-qrcode-2.0.11.min.js"></script>
<script>
    function docReady(fn) {
        // see if DOM is already available
        if (document.readyState === "complete" || document.readyState === "interactive") {
            // call on next available tick
            setTimeout(fn, 1);
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }
    docReady(function() {
        const html5QrCode = new Html5Qrcode("reader");
        const fileinput = document.getElementById('qr-input-file');
        fileinput.addEventListener('change', e => {
            if (e.target.files.length == 0) {
                // No file selected, ignore
                return;
            }

            const imageFile = e.target.files[0];
            // Scan QR Code
            html5QrCode.scanFile(imageFile, true)
                .then(decodedText => {
                    // success, use decodedText
                    document.getElementById("scanned-result").textContent=decodedText;
                    document.getElementById("results").style.display = "block";
                    console.log(decodedText);
                })
                .catch(err => {
                    // failure, handle it.
                    console.log(`Error scanning file. Reason: ${err}`)
                });
        });

    });
</script>