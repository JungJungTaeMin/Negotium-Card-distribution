# Negotium Card - Mobile UI Design Guide

## Design System

### Color Palette
- **Primary Color**: Deep Blue (#1A2B4C)
- **Accent Color**: #3B5998
- **Background**: #F8F9FC
- **Muted**: #64748B
- **Border**: #E2E8F0

### Typography
- **Font Family**: System Sans-serif
- **Headers**: 500 weight, 1.5 line-height
- **Body**: 400 weight, 1.5 line-height

### Spacing & Borders
- **Border Radius**: 8px (0.5rem)
- **Card Shadow**: Subtle shadows for depth
- **Mobile-first**: Responsive layout optimized for mobile devices
- **Material Design 3**: Consistent with modern mobile UI guidelines

## Key Screens

### 1. Home & Dashboard (`/`)
**Features:**
- Summary stats cards showing total business cards and companies
- Quick scan button for immediate access to camera
- Recent cards list with search functionality
- Clean, card-based layout with smooth animations

**Components:**
- Stats cards with icons
- Search bar in header
- Recent cards grid with person info
- Bottom navigation bar

### 2. AI Camera Scanner (`/scan`) - ⭐ Enhanced
**Features:**
- Camera/gallery file selection with proper validation
- **Real-time YOLO bounding box overlay** with confidence scores during detection
- **3-Stage AI Analysis Loading Screen** with progress indicators:
  1. "영역 탐지 중..." - Detecting areas with YOLO
  2. "텍스트 추출 중..." - Extracting text with OCR
  3. "데이터 구조화 중..." - Parsing data
- **Cancel Button** during analysis to abort the process
- **Interactive Card Info Editor** with editable fields
- **Company Name Autocomplete** with similar company suggestions
- **Bounding box visualization** with semi-transparent overlays

**AI Process Flow:**
1. Image Upload → Select from camera/gallery
2. YOLO Detection (0-33%) - Shows animated bounding boxes with labels
3. OCR Text Extraction (34-66%) - Text recognition
4. Data Parsing (67-100%) - Structured data creation
5. **Editable Result Form** - User can review and correct all fields
6. Save & Generate Organization Chart

**Visual Elements:**
- Animated bounding boxes with labels and confidence percentages
- Enhanced loading overlay with gradient background and blur effect
- Stage progress dots (3 stages)
- Required field indicators (asterisks)
- Alert icon for company suggestions
- Form validation (required: name, position, company)

**Company Autocomplete Feature (F-ORG-001):**
- Real-time similar company detection as user types
- Dropdown suggestions with existing companies
- Alert icon indicator when matches found
- "새 회사로 등록" option to bypass suggestions
- Prevents duplicate company entries with different spellings

### 3. Hierarchical Org-Chart (`/organization`) - ⭐ Enhanced
**Features:**
- Company selector dropdown
- **Dynamic URL routing** (`/organization/:companyId`)
- **Back button with company name** in header when viewing specific company
- Vertical expandable/collapsible tree structure (accordion-style)
- Color-coded department levels
- Person cards within departments
- Statistics summary (total employees, departments)

**Mobile-Optimized:**
- Nested list view instead of wide horizontal tree
- Tap to expand/collapse departments (drill-down interaction)
- Swipe-friendly cards
- Level badges showing organizational depth
- Animated expand/collapse with smooth height transitions
- First-level departments auto-expanded by default

**Navigation Enhancement:**
- Shows current company name in header
- Back button appears when navigating from person detail
- Maintains company selection state

### 4. Person Profile (`/persons/:id`) - ⭐ Enhanced
**Features:**
- **Back button** in header for easy navigation
- Large profile header with initial avatar
- Contact information (email, phone)
- Organization details (company, department, position)
- Tags with color coding (Decision Maker, VIP, etc.)
- Memos with add/delete functionality
- **"View Original Card" button** - Opens dialog showing scanned business card image
- Quick actions (call, email, view in org chart, share)

**New Features:**
- **Original Card Dialog**: Full-screen modal showing the scanned business card image
- Scan date display
- Professional card preview with Material Design styling

**Interactions:**
- Tap tags to remove
- Tap "+" to add new tags
- Expandable memo input with save/cancel
- Direct call/email links
- Navigate to organization chart from person
- View original business card image in modal

### 5. Search Page (`/search`)
**Features:**
- **Back button** (X icon) in header
- Full-screen search interface
- Real-time filtering
- Advanced filters (company, position)
- Filter toggle with active filter count badge
- Results with person cards

**UX Elements:**
- Animated filter panel
- Active filter badges
- Quick reset option
- Empty state with helpful message

### 6. Settings/Profile Page (`/settings`)
**Features:**
- User profile card
- Grouped settings sections (Account, App, Support)
- Logout functionality
- App version info

## Navigation - ⭐ Updated

### Bottom Navigation Bar (Material Design 3)
Fixed at the bottom with 4 main sections:
1. **Dashboard** - Dashboard and recent cards
2. **Scan** - AI camera scanner
3. **Org Chart** - Hierarchical organization view
4. **Profile** - App settings and user profile

**Active State:**
- Primary color for active tab
- Icon fill effect
- Bold label text
- Smooth color transitions

### Back Button Implementation
**All sub-pages include back buttons:**
- Person Detail Page: Arrow left button, returns to previous page
- Organization Detail: Arrow left with company name in header
- Search Page: X button to close search
- Scan Page: X button when image is selected

## Key Features by Functional Spec

### F-CARD-001: Business Card Upload & Scan
✅ Camera UI with rectangular guide
✅ Gallery upload button
✅ File format validation with error toast
✅ Image preview before analysis

### F-ANALYZE-001: AI Analysis
✅ **3-stage progress indicator** (Detecting → Extracting → Parsing)
✅ YOLO bounding box visualization with labels and confidence scores
✅ OCR text extraction simulation
✅ **Cancel button** during analysis
✅ Sophisticated loading screen with stage descriptions

### F-PARSE-001: Card Info Editor
✅ Display original card image at top
✅ Editable form fields (Name*, Company*, Department, Position*, Email, Phone)
✅ Required field indicators
✅ **Company autocomplete** with similar company detection
✅ "Save & Generate Org" button
✅ Form validation before save

### F-ORG-001: Organization Chart Creation
✅ **Company name autocomplete** with alias detection
✅ Similar company suggestions dropdown
✅ Alert indicator when similar companies exist
✅ Option to create new company or use existing

### F-ORG-002: Dynamic Org Chart Visualization
✅ Mobile-optimized **vertical tree view**
✅ **Accordion-style** expandable/collapsible departments
✅ Company level (top)
✅ Department level with expand/collapse
✅ Person cards within departments
✅ Level badges and color coding
✅ Tap-to-expand interaction
✅ Back button with company name in header

### Person Detail Features
✅ Profile view with tags (Decision Maker, VIP, etc.)
✅ Memos with add/edit/delete
✅ **"View Original Card" button** - Shows scanned business card image
✅ Contact quick actions (call, email)
✅ Navigate to organization chart
✅ Back button navigation

## Interactions

### Gestures
- **Tap**: Navigate, select, expand/collapse
- **Long Press**: Quick actions menu (future)
- **Active State**: Scale feedback on button press
- **Pull to Refresh**: Update data (future)

### Animations (Motion/React - Framer Motion successor)
- Staggered list animations (cards appear sequentially)
- Scale feedback on button press
- Slide-in/slide-out for panels and modals
- Fade effects for overlays
- **Bounding box animations** with scale and opacity
- **Progress dot animations** with pulse effect
- **Smooth height animations** for accordion expand/collapse
- **Dialog animations** for original card viewer

## Mobile-First Design Principles

1. **Touch-Friendly**: 
   - Minimum 44px touch targets (all buttons 44px or larger)
   - Comfortable spacing between interactive elements
   - Large input fields (h-11 = 44px)

2. **Performance**:
   - Lazy loading for images
   - Optimized animations with AnimatePresence
   - Mock data for instant response
   - Abort controller for cancellable operations

3. **Accessibility**:
   - Clear visual hierarchy
   - High contrast ratios
   - Readable font sizes (minimum 14px)
   - Required field indicators
   - Clear loading states

4. **Visual Feedback**:
   - Loading states with stage indicators
   - Success/error toasts (Sonner)
   - Progress indicators
   - Active states
   - Disabled states for invalid forms

## Enterprise SaaS Aesthetic

### Professional Features
- Clean, minimal interface
- Consistent spacing and alignment (16px/20px padding)
- Subtle shadows for depth
- Professional color palette (Deep Blue theme)
- Business-focused iconography (Lucide React)
- Material Design 3 principles

### Trust Signals
- Clear data hierarchy
- Organized information architecture
- Professional typography
- Reliable visual feedback
- Data validation and error handling
- **Company deduplication** to maintain data integrity

## Technical Implementation

### Key Libraries
- **React Router 7**: Multi-page navigation with Data mode
- **Motion (Framer Motion successor)**: Smooth animations
- **Radix UI**: Accessible components (Dialog, Select, etc.)
- **Tailwind CSS v4**: Utility-first styling
- **Lucide React**: Modern icons
- **Sonner**: Toast notifications

### Mock Services
- Authentication simulation
- **YOLO detection simulation** with animated bounding boxes
- **OCR result parsing** with field extraction
- Organization tree building
- Company similarity detection
- Abort controller for cancellable AI analysis

### State Management
- React useState for local state
- useRef for abort controllers and file inputs
- URL parameters for deep linking (company/person IDs)
- Form validation state

## Exception Flows & UX

### Analysis Cancellation
✅ Cancel button visible during all analysis stages
✅ AbortController properly cleans up ongoing operations
✅ Toast notification confirms cancellation
✅ Bounding boxes cleared on cancel

### Company Name Handling
✅ Real-time similarity detection
✅ Visual indicator (alert icon) when similar companies found
✅ User can choose existing or create new
✅ Prevents "Samsung" vs "Samsung Electronics" duplicates

### Navigation & History
✅ Back buttons on all sub-pages except Dashboard
✅ Browser back button supported
✅ Company name displayed in org chart header
✅ Deep linking support for sharing

## Data Structures

### CardData Interface
```typescript
interface CardData {
  name: string;        // Required
  email: string;
  phone: string;
  company: string;     // Required
  department: string;
  position: string;    // Required
}
```

### BoundingBox Interface
```typescript
interface BoundingBox {
  id: string;
  label: string;       // name, position, company, email, phone
  x: number;           // Percentage
  y: number;           // Percentage
  width: number;       // Percentage
  height: number;      // Percentage
  confidence: number;  // 0-1
}
```

### Analysis Stages
```typescript
type AnalysisStage = 
  | "detecting"   // YOLO detection
  | "extracting"  // OCR text extraction
  | "parsing"     // Data parsing & structuring
  | "complete";
```

## Future Enhancements

1. Real backend integration (Spring Boot API)
2. AWS S3 for business card image storage
3. MySQL database persistence
4. Real YOLO model integration
5. Real OCR service (Tesseract.js or cloud OCR)
6. Swipe actions for card management
7. Offline support with local storage
8. Push notifications
9. Advanced sharing (vCard export)
10. Export to contacts
11. Multi-language support
12. Dark mode theme
13. Batch card scanning
14. Analytics dashboard
15. CRM integration options