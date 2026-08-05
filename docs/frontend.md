# Frontend Architecture & Flow

This document describes the current Next.js client structure, routes, state management, API client, and UI flow.

---

## 1. Technology Stack

* **Framework**: Next.js 16 with the App Router
* **Library**: React 19
* **State Management**: Zustand with persistence middleware
* **Styling**: Tailwind CSS 4 with custom utility classes
* **Animations**: Framer Motion
* **Icons**: Lucide React
* **HTTP Client**: Axios with request/response interceptors
* **CSV Utility**: PapaParse

---

## 2. Directory Structure

The frontend code resides in the `client/` folder and is organized as follows:

```text
client/
├── public/                    # Static assets
└── src/
    ├── app/                   # App Router pages and layouts
    │   ├── (app)/             # Authenticated workspace routes
    │   │   ├── dashboard/     # High-level metrics view
    │   │   ├── library/       # Saved invoices search
    │   │   ├── profile/       # User profile details
    │   │   ├── reports/       # Visual reporting
    │   │   ├── results/       # Upload logs and detailed results
    │   │   ├── upload/        # File drag-and-drop uploader
    │   │   └── layout.js      # Authenticated sidebar layout
    │   ├── login/             # Login page
    │   ├── signup/            # Registration page
    │   ├── LandingPage.jsx    # Homepage UI
    │   ├── globals.css        # Main stylesheet
    │   └── layout.js          # Main layout provider
    ├── components/            # Shared UI components
    │   ├── layout/            # Navigation and footer items (Navbar, Footer)
    │   └── ui/                # Small reusable components (Button, Input, FeaturesCarousel, CountUp)
    ├── hooks/                 # Custom React hooks
    ├── lib/                   # Third-party configurations (e.g. axios instance)
    ├── store/                 # Zustand global stores (auth, jobs, upload)
    └── utils/                 # General utility scripts
```

---

## 3. Core Pages & UI Flow

### 3.1 Authentication Route Guards

Next.js routing is structured into protected and public views. Authenticated pages are wrapped inside the `(app)` router group. The `layout.js` inside `(app)` inspects the Zustand authentication store and browser cookies. If no active session or `bip_token` is present, users are redirected to `/login`.

### 3.2 Landing Page (`LandingPage.jsx`)
Features the public landing area introducing the ClearTax bulk upload product. It uses motion-based sections and shared layout components.

### 3.3 Bulk Upload Dashboard (`upload/page.js`)
Handles the user interface for sending CSV invoice batches to the server:
* **Drag-and-Drop Area**: Implements standard HTML drag-and-drop triggers (`onDragOver`, `onDragLeave`, `onDrop`) to accept files, altering styling classnames dynamically based on drag status.
* **File Filtering**: Validates file types by inspecting MIME types or extensions (`.csv` only), printing clean error alerts for skipped files.
* **Multipart Request**: Builds a standard JavaScript `FormData` object containing the file under key `"file"`.
* **Instant Feedback**: Displays loading state during upload and returns a batch summary on success.

### 3.4 Results & Progress Tracking (`results/page.js`)
This page handles two distinct states based on the URL query parameter `jobId`:

#### State A: Batch Upload Logs (No `jobId` in URL)
Retrieves historical upload batches from `/api/uploads` page-by-page. Shows details such as Job ID, date processed, total invoices, and completion status. Clicking a batch navigates the user to `/results?jobId={id}`.

#### State B: Detailed Invoice Transactions (With `jobId` in URL)
Shows individual transaction results inside a tabular interface:
1. **Background Polling**: Checks if the batch status is `processing` or `pending`. If so, it initializes an interval calling `/api/upload/${jobId}` every 1.5 seconds. The interval is cleared when status switches to `completed` or `failed`.
2. **Dynamic Progress Bar**: Dynamically calculates the completion percentage using:
   $$\text{percentage} = \min\left(100, \text{Math.round}\left(\frac{\text{processedRows}}{\text{totalRows}} \times 100\right)\right)$$
3. **Interactive Grid**: Provides search input (matching vendor, invoice number, or error messages) and status tabs (All, Matches, Mismatches, Failures) that filter rows instantly.
4. **Table Pagination**: Displays paginated invoices in chunks of 10 rows.
5. **CSV Downloader**: Re-maps transaction rows into clean objects, parses them to a raw CSV string using `Papa.unparse()`, creates a memory URL blob, and triggers a click download link on the browser.

---

## 4. State Management & API Client

### 4.1 Zustand Persisted Store (`auth.store.js`)
Maintains user information and login state across page reloads.

```javascript
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        document.cookie = `bip_token=${token}; path=/; max-age=604800`;
        set({ token });
      },
      clearUser: () => {
        document.cookie = "bip_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "bip_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        set({ user: null, token: null });
      }
    }),
    { name: "auth-storage" }
  )
);
```

### 4.2 Axios Client Interceptors (`axios.js`)
Configures a centralized API client targeting the Node express server URL (either locally on port 5000 or on a hosted production server):
* **Request Interceptor**: Extracts the `bip_token` from Zustand or cookies and attaches it as a `Bearer` token inside the `Authorization` header.
* **Response Interceptor**: Listens for HTTP responses. If a `401 Unauthorized` status code is caught (excluding `/auth/login` or `/auth/signup`), it triggers the state's `clearUser()` method, wipes the session, and redirects the browser back to the `/login` route.

---

## 5. UI Styling & Theme Tokens

The application uses a custom Tailwind-based visual system in `src/app/globals.css` and shared component class names:
* **Colors**: Violet primary accents with stone and neutral surfaces.
* **Glassmorphism**: Cards, banners, and table containers use translucent surfaces and blur effects.
* **Micro-Animations**: Hover transitions, spring motion, and staggered reveals are used on key interactive elements.
