# Negotium Card - User Interaction Guide

## 🎯 Quick Start Guide

### First Time User Flow

1. **Login** (`/login`)
   - Enter email and password
   - Click "로그인" button
   - → Redirects to Dashboard

2. **Dashboard** (`/`)
   - See stats: Total cards, Registered companies
   - View recent scanned cards
   - Search bar at top
   - → Tap "명함 스캔하기" to start

3. **Scan Card** (`/scan`)
   - Tap "카메라로 촬영" or "갤러리에서 선택"
   - Select/capture business card image
   - → Image preview appears

4. **AI Analysis**
   - Tap "AI 분석 시작" button
   - Watch 3-stage progress:
     - 🔍 Detecting (YOLO finds fields)
     - 📝 Extracting (OCR reads text)
     - 🧩 Parsing (Structure data)
   - **Can cancel** by tapping "취소" button
   - → Bounding boxes appear on image

5. **Edit & Review**
   - Review extracted information
   - Edit any incorrect fields
   - **Company autocomplete** suggests similar companies
   - Fill required fields (Name*, Position*, Company*)
   - Tap "저장 & 조직도 생성"
   - → Returns to Dashboard

6. **View Organization**
   - Navigate to "Org Chart" tab
   - Select company from dropdown
   - → View hierarchical organization structure

## 📱 Navigation Guide

### Bottom Navigation (Always Visible)
```
┌────────────────────────────────────────┐
│  [Dashboard] [Scan] [Org Chart] [Profile]  │
└────────────────────────────────────────┘
```

**Dashboard**: Home screen
- Stats cards
- Recent cards list
- Quick search

**Scan**: Camera scanner
- Upload/capture cards
- AI analysis
- Edit results

**Org Chart**: Organization view
- Company selector
- Hierarchical tree
- Expandable departments

**Profile**: Settings
- User profile
- App settings
- Logout

### Back Button Locations

#### Person Detail Page
```
┌─────────────────────────────────┐
│ [←] 인물 정보                  │ ← Back button
│                                 │
│ [Profile Card]                  │
│ Tags, Contact Info, Memos       │
└─────────────────────────────────┘
```

#### Organization Detail
```
┌─────────────────────────────────┐
│ [←] Samsung Electronics         │ ← Back + Company name
│                                 │
│ [Company Stats]                 │
│ [Department Tree]               │
└─────────────────────────────────┘
```

#### Search Page
```
┌─────────────────────────────────┐
│ [X] 검색                        │ ← X button
│ [Search input]                  │
│ [Filter options]                │
└─────────────────────────────────┘
```

#### Scan Page (with image)
```
┌─────────────────────────────────┐
│ 명함 스캔               [X]     │ ← X button
│ [Image preview]                 │
└─────────────────────────────────┘
```

## 🎨 Visual Interactions

### 1. AI Analysis Progress

**Stage 1: Detecting**
```
┌─────────────────────────────┐
│    [Spinning loader icon]    │
│                              │
│   영역 탐지 중...            │
│   YOLO로 명함 필드를         │
│   감지하고 있습니다          │
│                              │
│   • ● ○                      │ ← Progress dots
│   [████████░░] 33%           │ ← Progress bar
│                              │
│   [   취소   ]               │ ← Cancel button
└─────────────────────────────┘
```

**With Bounding Boxes**
```
┌─────────────────────────────┐
│  ┌──────────────┐           │
│  │ name 95%     │           │ ← Labels with confidence
│  └──────────────┘           │
│  ┌────────────┐             │
│  │position 92%│             │
│  └────────────┘             │
│  ┌──────────────────┐       │
│  │ company 94%      │       │
│  └──────────────────┘       │
└─────────────────────────────┘
```

### 2. Company Autocomplete

**Typing "Samsung"**
```
┌─────────────────────────────┐
│ 회사명 *                    │
│ ┌─────────────────────┐ ⚠️  │ ← Alert icon
│ │ Samsung             │     │
│ └─────────────────────┘     │
│                              │
│ ┌───────────────────────────┐│
│ │ ⚠️ 기존에 등록된 유사한   ││
│ │   회사가 있습니다         ││
│ ├───────────────────────────┤│
│ │ Samsung Electronics    ✓  ││ ← Suggestions
│ │ Samsung Display        ✓  ││
│ │ Samsung SDI            ✓  ││
│ ├───────────────────────────┤│
│ │ 새 회사로 등록            ││ ← Create new option
│ └───────────────────────────┘│
└─────────────────────────────┘
```

### 3. Organization Tree (Accordion)

**Collapsed State**
```
┌─────────────────────────────┐
│ ▶ [🏢] Engineering Team     │
│     15명 · 3개 하위 조직    │
│     [Lv.1]                  │
└─────────────────────────────┘
```

**Expanded State**
```
┌─────────────────────────────┐
│ ▼ [🏢] Engineering Team     │
│     15명 · 3개 하위 조직    │
│     [Lv.1]                  │
│ ┌─────────────────────────┐ │
│ │ [👤] 김민수              │ │
│ │      Director       →   │ │
│ │ [👤] 박지은              │ │
│ │      Senior Manager →   │ │
│ ├─────────────────────────┤ │
│ │ ▶ [🏢] Cloud Platform   │ │ ← Sub-departments
│ │     5명 [Lv.2]          │ │
│ │ ▶ [🏢] Data Science     │ │
│ │     7명 [Lv.2]          │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### 4. Person Detail Actions

**Quick Actions Section**
```
┌─────────────────────────────┐
│ 빠른 작업                    │
│ ┌─────────────────────────┐ │
│ │ [💳] 원본 명함 보기      │ │ ← View scanned card
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ [🏢] 조직도에서 보기     │ │ ← Jump to org chart
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ [↗️] 공유하기            │ │ ← Share contact
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**Original Card Dialog**
```
┌─────────────────────────────┐
│ 원본 명함              [X]  │
│ ─────────────────────────── │
│                              │
│   [Business Card Image]      │
│                              │
│ 스캔 일자: 2026.03.16        │
└─────────────────────────────┘
```

## 🎯 Key Interactions

### Touch Gestures

| Action | Gesture | Effect |
|--------|---------|--------|
| Navigate | Tap | Open page/detail |
| Expand | Tap | Show children |
| Collapse | Tap | Hide children |
| Select | Tap | Choose option |
| Cancel | Tap X | Close/abort |
| Delete | Tap trash | Remove item |
| Add | Tap + | Create new |

### Visual Feedback

| State | Visual | Duration |
|-------|--------|----------|
| Loading | Spinner + Progress | 2-3s |
| Success | Green toast | 2s |
| Error | Red toast | 3s |
| Active | Primary color | Persistent |
| Hover | Scale 98% | Instant |
| Disabled | Muted + No cursor | Persistent |

### Form Validation

**Required Fields**
- Name*
- Position*
- Company*

**Validation Rules**
- Name: Not empty
- Position: Not empty
- Company: Not empty
- Email: Valid format (optional)
- Phone: Any format (optional)

**Save Button States**
```
Enabled:  [✓ 저장 & 조직도 생성]  (All required filled)
Disabled: [✗ 저장 & 조직도 생성]  (Missing required fields)
```

## 🔔 Notification Examples

### Toast Messages

**Success**
- ✅ "명함이 저장되고 조직도가 업데이트됩니다!"
- ✅ "영역 탐지 완료"
- ✅ "텍스트 추출 완료"
- ✅ "분석 완료!"
- ✅ "메모가 추가되었습니다"
- ✅ "태그가 추가되었습니다"

**Info**
- ℹ️ "분석이 취소되었습니다"
- ℹ️ "준비 중입니다"

**Error**
- ❌ "이미지 파일만 업로드 가능합니다."
- ❌ "분석 중 오류가 발생했습니다."
- ❌ "이미 추가된 태그입니다"

## 🎬 Common Workflows

### Workflow 1: Add First Business Card
1. Dashboard → Tap "명함 스캔하기"
2. Scan → Tap "갤러리에서 선택"
3. Select image from gallery
4. Tap "AI 분석 시작"
5. Wait for analysis (can cancel)
6. Review results, edit if needed
7. Tap "저장 & 조직도 생성"
8. → Dashboard shows new card

### Workflow 2: View Organization Structure
1. Dashboard → Tap "Org Chart" tab
2. Select company from dropdown
3. View stats (employees, departments)
4. Tap department to expand
5. Tap person to view details
6. → Person detail page

### Workflow 3: Add Notes to Contact
1. Dashboard → Tap person card
2. Person Detail → Scroll to "메모" section
3. Tap "+ 추가" button
4. Type memo text
5. Tap "저장" button
6. → Memo added to list

### Workflow 4: Find Specific Contact
1. Dashboard → Tap search bar OR tap "Filter" icon
2. Search → Type name/company
3. Optionally: Open filters (company, position)
4. Tap result card
5. → Person detail page

### Workflow 5: Handle Duplicate Company
1. Scan → Complete AI analysis
2. Edit → Type company name "Samsung"
3. See alert icon and suggestions
4. Choose existing "Samsung Electronics" OR
5. Tap "새 회사로 등록" to create new
6. → Saves with selected option

## 💡 Pro Tips

### Efficiency Tips
- ✨ Use search bar for quick access
- ✨ Expand departments to see hierarchy
- ✨ Add tags for easy categorization
- ✨ Use memos for important notes
- ✨ View original card to verify info

### Best Practices
- 📸 Ensure good lighting when scanning
- 📸 Keep card flat and centered
- ✏️ Review AI results before saving
- 🏢 Use autocomplete to avoid duplicates
- 🏷️ Tag contacts (VIP, Decision Maker, etc.)
- 📝 Add memos with meeting notes

### Troubleshooting
- ❌ Analysis fails → Retry with better image
- ❌ Wrong OCR result → Edit fields manually
- ❌ Can't find contact → Use advanced search filters
- ❌ Organization not showing → Check company selection

---

## 📞 Support

For technical issues or questions:
- Check `/MOBILE_UI_GUIDE.md` for UI details
- See `/FEATURE_SUMMARY.md` for feature list
- Review `/guidelines/Guidelines.md` for development info

**Happy networking! 🎯**
