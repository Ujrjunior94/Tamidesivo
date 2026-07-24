# Security Specification for StickerMaster

## 1. Data Invariants
1. **Sticker Ownership**: A sticker can only be created with `createdBy` set to the active authenticated user's ID (`request.auth.uid`), and can only be updated or deleted by its creator.
2. **Sticker Validation**: A sticker must have a non-empty `title`, a valid `category`, and conform to structure (e.g. valid string sizes for safety).
3. **Favorites Isolation**: A user's favorite sticker IDs collection is strictly isolated. A user can only read and write their own `favorites` document, where the document ID matches `request.auth.uid`.
4. **User Config Isolation**: A user's configuration and preference document is strictly private. A user can only read and write their own `user_configs` document, matching `request.auth.uid`.

## 2. The "Dirty Dozen" Malicious Payloads (Attack Scenarios)
These 12 scenarios are designed to break the rules of Identity, Integrity, and State, and are blocked by the security rules:

1. **Sticker Spoofing (Identity)**: Creating a sticker with `createdBy` set to another user's UID.
2. **Sticker Ghost Modification (Integrity)**: Updating a sticker created by another user.
3. **Sticker Hijack/Delete (State)**: Deleting a sticker created by another user.
4. **Sticker Overload (Denial of Wallet)**: Injecting a massive 1MB string into the `title` or `category` field to drain resources.
5. **Sticker Malicious ID (Path Poisoning)**: Creating a sticker with a malicious ID containing non-alphanumeric characters (e.g., directory traversal `../evil`).
6. **Favorites Intruder Read (PII)**: Attempting to read another user's favorites document.
7. **Favorites Spoof Write (Identity)**: Writing a favorites document for another user's UID.
8. **Favorites Non-List Poisoning (Type Safety)**: Setting the `stickerIds` field of a favorites document to a giant text block instead of an array.
9. **User Config Intruder Read (PII)**: Attempting to read another user's preferences/config.
10. **User Config Hijack Write (Identity)**: Creating or overwriting another user's configuration.
11. **Client-side Claim Spoofing**: Attempting to bypass checks by assuming custom auth claims that don't exist.
12. **Blanket Query Scraping (Query Trust)**: Trying to execute list/query operations on user configurations without filtering by `userId == request.auth.uid`.

---

## 3. Security Rules Test Definitions (`firestore.rules.test.ts`)
The validation logic ensures that all of these scenarios fail with `PERMISSION_DENIED` under zero-trust conditions.
