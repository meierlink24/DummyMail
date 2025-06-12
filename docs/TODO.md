
#  Dummy-Usr – P Implementation Plan

.

---

## – UI, Manifest & Email Generator Logic

- [x] Create base React layout in `frontend/dummy-usr-page/react`
- [x] Add TTL input (dropdown or number input)
- [x] Add “Generate Email” button
- [x] Display generated dummy email in UI
- [x] Create dummy email generator (e.g., random string + `@dummyusr.mail`)
- [ ] Store generated email + TTL in React state
- [ ] Optional: Display countdown (TTL) in UI
- [ ] Create `manifest.json` (Manifest V3)
- [ ] Add required permissions: `"storage"`, `"activeTab"`
- [ ] Test extension in Firefox Developer Edition

---

## – Backend API & Frontend Integration

- [x] Set up simple backend 
- [x] Create API endpoint: `POST /generate` to return email + TTL
- [x] Create API endpoint: `GET /status/:id` to check expiry
- [x] Store generated emails with timestamps in-memory
- [ ] Add expiry logic: auto-remove expired emails 
- [x] Connect frontend to backend via `fetch` or Axios
- [ ] Display real email and status in frontend using API
- [x]  Handle expired emails correctly in the UI

---

##   Polish, Copy Feature, Styling & Testing

- [ ] Add "Copy to Clipboard" button
- [ ] Add toast or alert: "Email copied!"
- [ ] Show message if email has expired
- [x] Apply clean UI styling (black/white minimal)
- [ ] Add favicon/logo/icon for the extension 
- [ ] basic tests:
  - [ ] Email format is correct
  - [ ] TTL countdown works
  - [ ] Backend returns expected results
- [ ] Take screenshots of extension in use
- [ ] Write/update `README.md`:
  - [ ] What the extension does
  - [ ] How to run it locally
  - [ ] How to load it in Firefox
- [ ] Final test: install and use end-to-end

---

