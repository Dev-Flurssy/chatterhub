# Global Search Feature

## Overview

Comprehensive search functionality that allows users to search for both users and posts from the homepage (Posts page).

## Features Implemented

### Backend Search Endpoints

#### User Search (`GET /api/users/search`)

- Search by name, email, or username
- Case-insensitive regex search
- Returns up to 20 results
- Requires authentication

#### Post Search (`GET /api/posts/search`)

- Search by post text content
- Case-insensitive regex search
- Returns up to 20 results with populated user data
- Requires authentication

### Frontend Components

#### GlobalSearch Component

**Location**: `frontend-new/src/components/GlobalSearch.tsx`

**Features**:

- Real-time search with 300ms debounce
- Tabbed interface: All, Users, Posts
- Click-outside to close dropdown
- Clear button to reset search
- Loading states with spinner
- Empty state messaging
- Keyboard accessible

**Search Results Display**:

- **Users**: Shows profile picture, name, email
- **Posts**: Shows author info and post preview (2 lines)
- Result counts in tabs
- Hover effects and smooth transitions

**UI/UX**:

- Dropdown appears below search input
- Max height 500px with scrolling
- Dark mode support
- Responsive design
- Auto-focus management

### Integration

The GlobalSearch component is integrated into the Posts page (user homepage):

- Positioned at the top, above "Create Post"
- Full-width search bar
- Instant results as you type

## API Endpoints

### Search Users

```
GET /api/users/search?query=john
Authorization: Bearer {token}

Response: User[]
```

### Search Posts

```
GET /api/posts/search?query=hello
Authorization: Bearer {token}

Response: Post[]
```

## How It Works

1. **User types in search box**
2. **300ms debounce** prevents excessive API calls
3. **Parallel requests** to both user and post search endpoints
4. **Results displayed** in categorized tabs
5. **Click result** to navigate to user profile or view post
6. **Click outside** or clear to close dropdown

## Search Behavior

- Minimum query length: 1 character
- Empty query: No results shown
- Loading state: Spinner displayed
- No results: Friendly message with search icon
- Results: Grouped by type with counts
