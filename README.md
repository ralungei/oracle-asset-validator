# Oracle GenAI Demo

A Next.js application that validates GitHub assets against Oracle standards and guidelines established by Alex Hodicke.

## Features

- GitHub repository file validation
- Quality, security, structure, and template compliance checks
- Interactive UI with modern components
- Integration with Oracle AI APIs

## Tech Stack

- Next.js (React framework)
- Material UI components
- Oracle Generative AI APIs
- Docker containerization

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Oracle credentials

# Create keys directory and add your Oracle private key
mkdir -p keys
# Copy your private key to the keys directory

# Start development server
npm run dev
```

### Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Docker deployment instructions.

## Project Structure

- `src/app/api/oracle-ai`: API route for Oracle AI integration
- `src/app/components`: UI components
- `src/app/hooks`: Custom React hooks
- `src/services`: Service layer for API communication
- `src/utils`: Utility functions

## License

Proprietary - All Rights Reserved
