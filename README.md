# Gallery of Wonders

---

# Project Overview

**Gallery of Wonders** is a MERN-stack based digital platform designed to help creators showcase, organize, and preserve their creative works in a centralized environment.

Creative works such as artwork, photography, illustrations, poems, stories, and other forms of expression are often scattered across multiple social media platforms. While these platforms provide visibility, they lack proper organization, long-term preservation, meaningful discovery mechanisms, and dedicated creator-focused features.

Gallery of Wonders addresses these challenges by providing a dedicated digital gallery where creators can upload their work, organize it into collections, interact with the community, and gain insights into audience engagement.

The platform aims to create a vibrant ecosystem that celebrates creativity while making it easier for users to discover inspiring content.

---

# Problem Statement

Creative content is frequently distributed across various platforms, making it difficult for creators to maintain a unified portfolio and for audiences to discover relevant content efficiently.

Existing social media platforms primarily focus on short-term engagement and lack:

* Proper categorization of creative works
* Long-term content preservation
* Creator-focused dashboards
* Intelligent content discovery
* Personalized recommendations
* Community-driven creative collections

Gallery of Wonders solves these issues by providing a centralized digital gallery that supports content organization, discovery, interaction, and analytics.

---

# Objectives

* Provide a centralized platform for showcasing creative works.
* Enable creators to build and maintain digital portfolios.
* Improve discoverability through search and categorization.
* Foster community interaction among creators and audiences.
* Provide insights and analytics on content performance.
* Implement intelligent recommendation mechanisms.
* Preserve creative works in an organized digital archive.

---

# Technology Stack

## Frontend

* React.js
* React Router DOM
* Axios
* Redux Toolkit / Context API
* Tailwind CSS

## Backend

* Node.js
* Express.js
* JWT Authentication
* bcrypt.js

## Database

* MongoDB Atlas
* Mongoose ODM

## File Storage

* Cloudinary

## Additional Libraries

* Multer
* Chart.js / Recharts
* dotenv
* cors

---

# System Architecture

Frontend (React)
↓
REST APIs
↓
Backend (Node.js + Express)
↓
MongoDB Database
↓
Cloudinary Storage

---

# Project Workflow

### Step 1: User Registration

Users create an account using:

* Username
* Email
* Password

### Step 2: Authentication

Users log in securely using JWT-based authentication.

### Step 3: Upload Creative Work

Users can upload:

* Artworks
* Photography
* Poems
* Stories
* Digital Designs
* Other Creative Content

Each upload contains:

* Title
* Description
* Category
* Tags
* Media File

### Step 4: Content Storage

Uploaded content is:

* Stored in Cloudinary
* Metadata stored in MongoDB

### Step 5: Gallery Display

Works are displayed publicly in the gallery.

### Step 6: Community Interaction

Users can:

* Like
* Bookmark
* Comment
* Share Collections

### Step 7: Content Discovery

Users discover works through:

* Search
* Filters
* Categories
* Recommendations

### Step 8: Analytics

Creators can monitor:

* Views
* Likes
* Bookmarks
* Engagement Trends

---

# Core Features

## User Management

### Registration

Create a new account.

### Login

Secure authentication using JWT.

### Profile Management

Users can:

* Update profile image
* Update bio
* Manage personal information

---

## Creative Work Management

### Upload Works

Users can upload creative content with metadata.

### Edit Works

Modify existing uploads.

### Delete Works

Remove uploaded content.

### Organize Collections

Group works into themed collections.

---

## Gallery System

### Public Gallery

Displays all uploaded works.

### Categories

Examples:

* Photography
* Digital Art
* Traditional Art
* Poetry
* Stories
* Illustrations

### Search

Search by:

* Title
* Creator
* Tags
* Category

### Filters

Filter by:

* Category
* Date
* Popularity

---

## Social Features

### Likes

Users can like creative works.

### Bookmarks

Save works for future reference.

### Comments

Provide feedback and engage with creators.

### Collaborative Collections

Multiple users can contribute to shared collections.

---

# Advanced Features

## Personalized Recommendations

The system analyzes user activity and recommends relevant works.

Recommendation factors:

* Viewed content
* Liked content
* Bookmarked content
* Preferred categories

---

## Auto Categorization

AI-based content classification:

* Detect artwork type
* Generate tags
* Suggest categories

---

## Content Insights Dashboard

Provides creators with:

* Total uploads
* Total views
* Total likes
* Total bookmarks
* Monthly growth metrics
* Popular content reports

---

## Similarity Search

Users can find related works using:

* Tags
* Categories
* Visual similarity

Future enhancement:

* Vector Search
* CLIP Embeddings

---

# Database Design

## Users Collection

Fields:

* _id
* username
* email
* password
* profileImage
* bio
* createdAt

## Works Collection

Fields:

* _id
* title
* description
* category
* tags
* mediaUrl
* creatorId
* views
* likes
* bookmarks
* createdAt

## Comments Collection

Fields:

* _id
* userId
* workId
* comment
* createdAt

## Collections Collection

Fields:

* _id
* name
* description
* ownerId
* works

---

# Folder Structure

gallery-of-wonders/

client/
├── src/
│ ├── pages/
│ ├── components/
│ ├── services/
│ ├── redux/
│ ├── hooks/
│ └── App.jsx

server/
├── controllers/
├── routes/
├── models/
├── middleware/
├── config/
├── services/
└── server.js

---

# Future Scope

* Mobile application
* AI-generated content recommendations
* Real-time notifications
* Creator verification system
* Follow/Followers feature
* Content moderation tools
* NFT integration
* Advanced visual similarity search

---

# Expected Outcomes

* Centralized platform for creative expression.
* Enhanced discoverability of creative works.
* Improved creator engagement and visibility.
* Organized digital preservation of content.
* Community-driven interaction and collaboration.

---

# Conclusion

Gallery of Wonders aims to bridge the gap between creators and audiences by providing a dedicated platform for showcasing, preserving, and discovering creative works. Through modern web technologies and intelligent features, the platform encourages creativity, collaboration, and long-term engagement within a growing creative community.

---

## Developed By

**Piyush Gautam**
**Mohd Sufiyan**

Department Project – MERN Stack Development
