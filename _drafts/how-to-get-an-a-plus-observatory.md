include: https://jekyllrb.com/docs/configuration/options/

add `include: ["_headers"]` to _config.yml

CSP: 

```
/* 
    Content-Security-Policy: default-src 'none'; frame-ancestors 'none'; img-src 'self'; script-src 'self'; style-src 'self'
    Referrer-Policy: same-origin
    X-Content-Type-Options: nosniff
    X-Frame-Options: DENY
    X-XSS-Protection: 1; mode=block
```

Serve from netlify: https://www.netlify.com/docs/headers-and-basic-auth/