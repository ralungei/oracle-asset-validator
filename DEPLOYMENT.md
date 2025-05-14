# Deployment Instructions: Oracle GenAI Demo

## Requirements

- Docker
- Oracle AI environment variables
- Oracle private key (.pem)

## Configuration

1. Create `.env` file with actual values based on `.env.example`:

```
# Oracle AI configuration
ORACLE_TENANCY_ID=ocid1.tenancy.oc1..your-value
ORACLE_USER_ID=ocid1.user.oc1..your-value
ORACLE_FINGERPRINT=xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx:xx
ORACLE_PRIVATE_KEY_PATH=./keys/your-private-key.pem
ORACLE_COMPARTMENT_ID=ocid1.compartment.oc1..your-value
ORACLE_ENDPOINT=https://inference.generativeai.eu-frankfurt-1.oci.oraclecloud.com
ORACLE_MODEL_ID=ocid1.generativeaimodel.oc1.eu-frankfurt-1.your-value
```

2. Private key setup:
   - Create a `keys` directory in the same location as the Dockerfile
   - Place the private key file inside the `keys` directory
   - Name it as referenced in your ORACLE_PRIVATE_KEY_PATH variable
   - Set proper permissions: `chmod 600 keys/your-private-key.pem`

## Building and Running

```bash
# Build image
docker build -t oracle-genai-demo .

# Run container
docker run -p 3000:3000 --env-file .env -v $(pwd)/keys:/app/keys:ro oracle-genai-demo
```

## Important notes

- App exposes port 3000
- The private key must be mounted as a volume at runtime
- The `$(pwd)/keys:/app/keys:ro` maps your local keys directory to the container
- The `:ro` flag ensures the key is mounted as read-only
- Do not include the private key in the Docker image
