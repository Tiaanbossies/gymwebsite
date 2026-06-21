// Legacy alias — the old /community route now renders the Team page.
// This file exists only so historic imports don't break the build; App.jsx
// routes /community → Team directly and no longer imports from here.
export { default } from './Team.jsx';
