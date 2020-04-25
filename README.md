# Fork [https://github.com/qoobaa/fakturama](fakturamy) dla Bistro Złota Jura

Adres: [https://s3.baraniecki.eu/fakturama/](https://s3.baraniecki.eu/fakturama/)

Aby zbudować i deployować:

```
$ node_modules/.bin/ember build --production
$ s3cmd -P put -r fakturama/ s3://s3.baraniecki.eu/
```
