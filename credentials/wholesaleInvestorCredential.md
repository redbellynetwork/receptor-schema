# certificateNumber

Unique number of the certificate issued.

```
  "certificateNumber": "CERT-2024-0001"
```

# jurisdiction

Jurisdiction for which the credential applies

```
  "juridiction": "Australia"
```

# name

The name of the person.

```
  "name": "John Doe"
```

# email

Email address of the credential subject.

```
  "email": johndoe@example.com
```

# grossIncome

Represents the gross income of the credential subject in the jurisdiction currency

```
  "grossIncome": 300000
```

# netAssets

Represents the net assets of the credential subject in the jurisdiction currency

```
  "netAssets": 3000000
```

# validUntil

Represents date until which the credential is valid

```
    "validUntil": "20450101"
```

# accountantDetails

Details of the accountant certifying the investor's status.

```json
{
  "accountantDetails": {
    "name": "Jane Accountant",
    "certifyingBody": "Institute of Chartered Accountants of Australia",
    "licenseNumber": "AUS12345"
  }
}
```

# accountantName

Name of the accountant.

```
  "accountantName": "Jane Accountant",
```

# certifyingBody

Organization that certifies the accountant.

```
  "certifyingBody": "Institute of Chartered Accountants of Australia",
```

# licenseNumber

License number of the accountant.

```
  "licenseNumber": "AUS12345"
```

# attachments

Additional documentation or evidence attached to the credential.

```json
{
  "attachments": [
      {
        "type": "MediaObject",
        "contentUrl": "https://example.com/certificate.pdf",
        "contentSize": "1.2MB",
        "encodingFormat": "application/pdf",
        "name": "Accountant Certification"
      }
    ]
}
```

# type

Type of the item

```
  type: "MediaObject",
```

# contentUrl

URL of the item.

```
  contentUrl: https://example.com/certificate.pdf
```

# contentSize

Size of the item

```
contentSize: "1.2MB"
```

# encodingFormat

a MIME format

```
  encodingFormat: "application/pdf"
```

# attachmentName

name of the item

```
  name: "Accountant Certification"
```
