# Auto-Comment Dashboard

A comprehensive LinkedIn automation dashboard built with React, TypeScript, and Tailwind CSS that integrates with your backend auto-commenting system.

## Features

### 🤖 **Auto-Comment System**

- **Job Configuration**: Set keywords, comment limits, and AI preferences
- **Real-time Monitoring**: Live queue status and job progress tracking
- **Job History**: Comprehensive logging and analytics
- **Smart Controls**: Pause, resume, and manage the comment queue

### 🎯 **Key Components**

#### 1. **CommentJobForm** (`/src/components/CommentJobForm.tsx`)

- Configure target keywords for LinkedIn post discovery
- Set maximum comment limits (1-20)
- Advanced options:
  - Minimum reaction thresholds
  - Job post filtering
  - Message tone selection (Professional, Casual, Enthusiastic, etc.)
  - Emoji and hashtag preferences

#### 2. **QueueStatus** (`/src/components/QueueStatus.tsx`)

- Real-time queue monitoring with auto-refresh (10s intervals)
- Visual progress indicators and statistics
- Queue control operations:
  - Pause/Resume queue
  - Clean completed/failed jobs
  - Manual refresh

#### 3. **JobHistory** (`/src/components/JobHistory.tsx`)

- Comprehensive job tracking and filtering
- Search by keywords or job ID
- Status-based filtering (Waiting, Active, Completed, Failed)
- Date range filtering
- CSV export functionality

#### 4. **AutoComment Dashboard** (`/src/pages/dashboard/AutoComment.tsx`)

- Integrated interface combining all components
- Status overview cards with metrics
- Tabbed navigation for different functions
- LinkedIn connection status monitoring

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Backend server running on `http://localhost:5000`
- LinkedIn Cookie Extension installed and paired

### Installation

1. **Install Dependencies**

   ```bash
   cd prospect-panel
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Access Dashboard**
   - Navigate to `http://localhost:8080`
   - Login with your credentials
   - Go to Dashboard → Auto-Comment

## Usage Guide

### Starting a Comment Job

1. **Navigate to Auto-Comment Dashboard**

   - Click "Auto-Comment" in the sidebar
   - Ensure LinkedIn connection status shows "LinkedIn Connected"

2. **Configure Job Parameters**

   - **Keywords**: Add target keywords (e.g., "AI", "Startup", "SaaS")
   - **Max Comments**: Set limit (1-20 comments per job)
   - **Advanced Options**:
     - Minimum reactions threshold
     - Exclude job posts
     - Message tone selection
     - Emoji/hashtag preferences

3. **Submit Job**
   - Click "Start Comment Job"
   - Job will be added to the queue
   - Monitor progress in Queue Status tab

### Monitoring Jobs

#### **Queue Status Tab**

- View real-time job counts (Waiting, Active, Completed, Failed)
- Monitor overall progress percentage
- Control queue operations (Pause/Resume/Clean)

#### **Job History Tab**

- Track all completed and failed jobs
- Filter by status, date range, or search terms
- Export job data to CSV
- View detailed results and error messages

### Queue Management

- **Pause Queue**: Stop processing new jobs
- **Resume Queue**: Continue processing paused jobs
- **Clean Queue**: Remove completed/failed jobs from history
- **Auto-refresh**: Stats update every 10 seconds

## API Integration

### Backend Endpoints Used

```typescript
// Comment Job Management
POST /api/start-comment-job     // Start new job
GET  /api/comment-jobs/stats    // Queue statistics
POST /api/comment-jobs/pause    // Pause queue
POST /api/comment-jobs/resume   // Resume queue
POST /api/comment-jobs/clean    // Clean queue
GET  /api/comment-jobs/user/:id // User job status
```

### Data Flow

1. **Frontend** → **Backend**: Submit job configuration
2. **Backend** → **Redis**: Store job in BullMQ queue
3. **Worker** → **LinkedIn**: Execute automation
4. **Worker** → **Backend**: Update job status
5. **Frontend** ← **Backend**: Real-time status updates

## Architecture

### **Component Structure**

```
AutoComment Dashboard
├── CommentJobForm (Job Configuration)
├── QueueStatus (Real-time Monitoring)
├── JobHistory (Analytics & Tracking)
└── Status Overview Cards
```

### **State Management**

- **useCommentJobs Hook**: Centralized queue state management
- **Real-time Updates**: Auto-refresh every 10 seconds
- **Error Handling**: Toast notifications for user feedback
- **Loading States**: Visual feedback during operations

### **Responsive Design**

- Mobile-first approach with responsive breakpoints
- Collapsible sidebar for mobile devices
- Touch-friendly controls and navigation

## Customization

### **Adding New Job Options**

1. Update `CommentJobRequest` interface in `/src/lib/api.ts`
2. Add form controls in `CommentJobForm.tsx`
3. Update backend validation and processing

### **Modifying Queue Controls**

1. Extend `useCommentJobs` hook with new operations
2. Add UI controls in `QueueStatus.tsx`
3. Implement corresponding backend endpoints

### **Custom Job Types**

1. Create new job configuration components
2. Add job type selection in the form
3. Update backend worker logic

## Troubleshooting

### **Common Issues**

#### LinkedIn Connection Failed

- Ensure cookie extension is installed and paired
- Check backend server is running
- Verify cookies are valid and not expired

#### Job Not Starting

- Check queue status (paused/active)
- Verify user has valid LinkedIn cookies
- Check backend logs for errors

#### Queue Not Updating

- Refresh page to re-establish connection
- Check network connectivity to backend
- Verify backend Redis connection

### **Debug Mode**

Enable console logging for detailed debugging:

```typescript
// In useCommentJobs hook
console.log('Queue stats:', stats);
console.log('Operation result:', result);
```

## Development

### **Adding New Features**

1. Create component in `/src/components/`
2. Add route in `/src/App.tsx`
3. Update navigation in `/src/components/Sidebar.tsx`
4. Test integration with backend APIs

### **Testing**

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

### **Building for Production**

```bash
npm run build
npm run preview
```

## Contributing

1. Follow TypeScript best practices
2. Use Tailwind CSS for styling
3. Implement proper error handling
4. Add loading states for async operations
5. Test responsive design on mobile devices

## Support

For issues or questions:

1. Check backend server logs
2. Verify API endpoint responses
3. Test with browser developer tools
4. Review component console logs

---

**Note**: This dashboard requires a properly configured backend with Redis, BullMQ, and LinkedIn automation workers to function correctly.
