# Reddit Cron Jobs
Automated Reddit subreddit statistics collection and scheduled post publishing using GitHub Actions.

## What It Does
This project runs two automated tasks:
1. **Collects subreddit statistics** every 10 minutes and stores them in MongoDB
2. **Publishes scheduled Reddit posts** at specified times

## How It Works

### Statistics Collection (`fetch-stats.ts`)
- Fetches subscriber counts from Reddit API for configured subreddits
- Groups subreddits for batch processing
- Calculates running averages for statistical analysis
- Rate limited to 1.1 seconds between API calls
- Runs every 10 minutes via GitHub Actions

### Post Publishing (`check-post.ts`)
- Checks database for posts scheduled within next 5 minutes
- Publishes posts via external API
- Updates post status from "scheduled" to "published"
- Triggered on demand via GitHub Actions

## GitHub Actions Setup

### Workflows
Two workflows triggered by repository dispatch events:
- `trigger-fetch-stats` - runs statistics collection
- `trigger-check-posts` - runs post publishing
