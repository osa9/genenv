# genenv: .env generator
Genenv generates .env file from AWS SSM, GCP SecretManager.
Currently only supports GCP SecretManager.

## Install
```shell script
# with npm
npm install genenv (TODO)
```

## Usage (GCP)
### Register Secret to GCP Secret Manager
```shell script
gcloud config set project <Your Project ID>
gcloud secrets create "CLIENT_KEY" --replication-policy="automatic"
echo -n "secret" | gcloud secrets versions add "CLIENT_KEY" --data-file=-
```

You can also use Web Console
https://console.cloud.google.com/security/secret-manager

### Generate .env file
```shell script
npx genenv (TODO)
```

## Example Input
### Simple
#### Input Schema
env.json
```json
{
  "env": [
    "CLIENT_KEY",
    "CLIENT_SECRET"
  ]
}
```

#### Output
.env
```shell script
CLIENT_KEY=<Your Client Key>
CLIENT_SECRET=<Your Client Secret>
```

### MultiPart
#### Input Schema
env.json
```json
{
  "source": "gcp",
  "env": {
    "": {
      "CLIENT_KEY": "CLIENT_KEY",
      "CLIENT_SECRET": {
        "id": "CLIENT_SECRET"
      },
      "credentials.json": {
        "id": "CREDENTIAL_FILE",
        "type": "file"
      }
    },
    "dev": {
      "CLIENT_KEY": "DEV_KEY",
      "CLIENT_SECRET": {
        "id": "DEV_SECRET"
      },
      "credentials-dev.json": {
        "id": "CREDENTIAL_FILE_DEV",
        "type": "file"
      }
    }
  }
}
```

#### Output
.env
```shell script
CLIENT_KEY=<Your Client Key>
CLIENT_SECRET=<Your Client Secret>
```

dev.env
```shell script
CLIENT_KEY=<Your Dev Key>
CLIENT_SECRET=<Your Dev Secret>
```

credentials.json
```
(Your Credential File)
```

credentials-dev.json
```
(Your Dev Credential File)
```