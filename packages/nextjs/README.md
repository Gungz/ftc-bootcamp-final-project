# Creator X Fan Platform - Frontend

Next.js frontend for the Creator X Fan decentralized platform.

## Environment Setup

Create `.env.local` file in this directory:

```
NEXT_PUBLIC_PINATA_JWT=your_pinata_jwt_token
```

Get your Pinata JWT from [Pinata Cloud](https://pinata.cloud) after creating an account.

## Development

```bash
yarn start
```

Runs on http://localhost:3000

## Pages

- `/` - Landing page
- `/creator` - Create new creator space
- `/my-space` - Manage your creator spaces
- `/space/[address]` - Public view of a creator space
- `/explore` - Browse all creator spaces

## Key Components

### Creator Dashboard (`/my-space/manage/[spaceAddress]`)
- Content Manager - Upload and manage exclusive content
- Membership settings
- Campaign management
- Space analytics

### Public Space View (`/space/[address]`)
- Membership card with mint functionality
- Tip creator
- Like button
- Content gallery (members only)
- Download minted content

## Custom Hooks

Located in `hooks/creator-platform/`:

- `useCreatorPlatform.ts` - Factory contract interactions
- `useCreatorSpace.ts` - Space data fetching
- `useCreatorSpaceActions.ts` - Tips, likes, polls
- `useMembershipNFT.ts` - Membership NFT operations
- `useExclusiveContent.ts` - Content management

## IPFS Integration

Uses Pinata SDK for file uploads. See `services/ipfs/ipfsClient.ts`.

## Deployment

### Vercel

```bash
yarn vercel
```

### Environment Variables

Set in Vercel dashboard:
- `NEXT_PUBLIC_PINATA_JWT`

### Network Configuration

Update `scaffold.config.ts` for target network (Aurora Virtual Chain).
