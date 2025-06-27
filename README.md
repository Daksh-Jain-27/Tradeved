# Tradeved - Quest Platform

A React Native application for managing and participating in quests/challenges.

## Features

- User authentication and authorization
- Quest browsing and participation
- Interactive quiz system with immediate feedback
- Space/Community management
- Leaderboard system
- Points and rewards tracking

## Tech Stack

- React Native
- Expo
- TypeScript
- AsyncStorage for local storage
- RESTful API integration

## Project Structure

```
app/
├── components/         # Reusable components
├── space-details/     # Space details page
├── quest-details/     # Quest details page
├── explorequest/      # Quest exploration page
└── assets/           # Images and other static assets
```

## Getting Started

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
npm start
   ```

## Environment Setup

Create a `.env` file in the root directory with the following variables:
```
API_URL=https://api.dev.tradeved.com
```

## API Integration

The application integrates with the Tradeved API for:
- User authentication
- Quest management
- Space management
- Leaderboard data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
