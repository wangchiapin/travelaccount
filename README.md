# 旅費帳本 Travel Account

**用途：** 家人共用的旅行花費記帳與結算（多幣別、分帳、快速記錄）。
**網址：** https://wangchiapin.github.io/travelaccount/
**Firebase 專案：** `moneybook-50481`（與生活帳本共用專案；本 app 的資料放在 `travelUsers`、`travelHouseholds`，和生活帳本的 `ledgers` 分開）
**登入：** Email / 密碼
**狀態：** 使用中

## Firestore 規則（`moneybook-50481` 專案，需整份一起發布）

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // 生活帳本：只有本人能讀寫自己的帳本
    match /ledgers/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    // 旅費帳本：使用者設定
    match /travelUsers/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }

    // 旅費帳本：家庭帳本（以邀請碼＝文件 ID 加入）
    match /travelHouseholds/{hid} {
      allow get: if request.auth != null;
      allow create: if request.auth != null
        && request.resource.data.members == [request.auth.uid];
      allow update: if request.auth != null && (
        request.auth.uid in resource.data.members
        || (request.resource.data.diff(resource.data).affectedKeys().hasOnly(['members'])
            && request.resource.data.members.hasAll(resource.data.members)
            && request.resource.data.members.size() == resource.data.members.size() + 1
            && request.auth.uid in request.resource.data.members));
      allow delete: if request.auth != null && request.auth.uid in resource.data.members;

      match /trips/{document=**} {
        allow read, write: if request.auth != null
          && request.auth.uid in get(/databases/$(database)/documents/travelHouseholds/$(hid)).data.members;
      }
    }
  }
}
```
