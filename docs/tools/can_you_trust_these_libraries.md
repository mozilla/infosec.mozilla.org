## Verify this site is using unmodified libraries

You'll see that all pages on this site include additional libraries (jquery,
anchor) which could potentially contain malicious code.

You can verify the integrity of the libraries on this site with these steps.

```bash
test "$(curl --silent https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js | sha256sum)" \
   = "$(curl --silent https://infosec.mozilla.org/assets/js/jquery-1.12.4.min.js | sha256sum)" && echo "Success, jquery hashes match"
test "$(curl --silent https://cdnjs.cloudflare.com/ajax/libs/anchor-js/4.1.0/anchor.min.js | sha256sum)" \
   = "$(curl --silent https://infosec.mozilla.org/assets/js/anchor.min.js | sha256sum)" && echo "Success, anchor hashes match"
```

## Verify this sites libraries do what you'd expect

You can review the unminified code for [anchor here](https://github.com/bryanbraun/anchorjs/blob/848ef8ca7e8bbd5edb032b6c3623f05aefb5ef0b/docs/anchor.js).
For jquery, because of it's size, the best may just be to look for [security
vulnerabilities that have been reported publicly](https://snyk.io/test/npm/jquery/1.12.4).