# Apps Script Backend Directory Guide

This document explains how our **Google Apps Script backend** will be organized for the farm marketplace platform.

The frontend modules are separate HTML/CSS/JS files. The frontend will only need to call **one Apps Script Web App URL**. Apps Script will work as the backend API and connect to the shared Google Sheet.

---

## 1. Overall System Flow

```text
Frontend Module
        ↓
Apps Script Web App URL
        ↓
Router.gs
        ↓
Correct Module API File
        ↓
Correct Module Data File
        ↓
Google Sheet
```

Example:

```text
Farm Adoption Frontend
        ↓
Apps Script URL
        ↓
Router.gs
        ↓
E_FarmAdoptionCrowdfundingApi.gs
        ↓
E_FarmAdoptionCrowdfundingData.gs
        ↓
AdoptionProjects / AdoptionContributions Sheet Tabs
```

---

## 2. Why We Use One Apps Script URL

All frontend modules should call the same Apps Script deployment URL.

This keeps the project:

- Easier to manage
- Connected to one shared Google Sheet
- More consistent between modules
- Easier to debug
- Easier to deploy

Each frontend module sends a request like this:

```javascript
{
  module: "farmAdoptionCrowdfunding",
  action: "getProjects",
  payload: {}
}
```

Apps Script will check the `module` name and route the request to the correct backend file.

---

## 3. Apps Script File Structure

Apps Script does not support real folders in the online editor, so we use file prefixes.

Recommended file list:

```text
appsscript.json

Code.gs
Config.gs
Router.gs
Response.gs
Utils.gs
Auth.gs

A_MarketplaceApi.gs
A_MarketplaceData.gs
A_ProductCatalogApi.gs
A_ProductCatalogData.gs
A_MarketPriceApi.gs
A_MarketPriceData.gs

B_FarmerProfileApi.gs
B_FarmerProfileData.gs
B_LocationApi.gs
B_LocationData.gs
B_CertificationApi.gs
B_CertificationData.gs

C_SearchFilterApi.gs
C_SearchFilterData.gs
C_AvailableProductDetailApi.gs
C_AvailableProductDetailData.gs

D_ChatMessagingApi.gs
D_ChatMessagingData.gs
D_NotificationApi.gs
D_NotificationData.gs

E_FarmAdoptionCrowdfundingApi.gs
E_FarmAdoptionCrowdfundingData.gs
E_PaymentApi.gs
E_PaymentData.gs
E_TransactionCoordinationApi.gs
E_TransactionCoordinationData.gs
```

---

## 4. Module Assignment

| Assigned Member | Module | Backend Files |
|---|---|---|
| A | Marketplace Module | `A_MarketplaceApi.gs`, `A_MarketplaceData.gs` |
| A | Product Catalog Module | `A_ProductCatalogApi.gs`, `A_ProductCatalogData.gs` |
| A | Market Price Module | `A_MarketPriceApi.gs`, `A_MarketPriceData.gs` |
| B | Farmer Profile Module | `B_FarmerProfileApi.gs`, `B_FarmerProfileData.gs` |
| B | Location Module | `B_LocationApi.gs`, `B_LocationData.gs` |
| B | Certification / Product Label Module | `B_CertificationApi.gs`, `B_CertificationData.gs` |
| C | Search and Filter Module | `C_SearchFilterApi.gs`, `C_SearchFilterData.gs` |
| C | Available Products Detail Module | `C_AvailableProductDetailApi.gs`, `C_AvailableProductDetailData.gs` |
| D | Chat / Messaging Module | `D_ChatMessagingApi.gs`, `D_ChatMessagingData.gs` |
| D | Notification Module | `D_NotificationApi.gs`, `D_NotificationData.gs` |
| E | Farm Adoption / Crowdfunding Module | `E_FarmAdoptionCrowdfundingApi.gs`, `E_FarmAdoptionCrowdfundingData.gs` |
| E | Payment Module | `E_PaymentApi.gs`, `E_PaymentData.gs` |
| E | Transaction Coordination Module | `E_TransactionCoordinationApi.gs`, `E_TransactionCoordinationData.gs` |

---

## 5. File Responsibility

Each module has two main backend files:

```text
ModuleApi.gs
ModuleData.gs
```

### API File

The API file receives the request action and decides what function should run.

Example:

```text
E_FarmAdoptionCrowdfundingApi.gs
```

This file should contain functions such as:

```javascript
function FarmAdoptionCrowdfundingApi_handle(action, payload) {
  if (action === "getProjects") {
    return successResponse(FarmAdoptionCrowdfundingData_getProjects());
  }

  if (action === "createContribution") {
    return successResponse(FarmAdoptionCrowdfundingData_createContribution(payload));
  }

  return errorResponse("Invalid farm adoption action: " + action);
}
```

### Data File

The data file connects to Google Sheets and reads or writes data.

Example:

```text
E_FarmAdoptionCrowdfundingData.gs
```

This file should contain functions such as:

```javascript
function FarmAdoptionCrowdfundingData_getProjects() {
  return sheetToObjects("AdoptionProjects");
}

function FarmAdoptionCrowdfundingData_createContribution(payload) {
  return appendObjectToSheet("AdoptionContributions", {
    ContributionID: Utilities.getUuid(),
    ProjectID: payload.projectId,
    Amount: payload.amount,
    DisplayName: payload.displayName,
    Message: payload.message || "",
    CreatedAt: new Date()
  });
}
```

---

## 6. Core Files

These files are shared by everyone. Do not edit them unless the group agrees.

### `Code.gs`

Main Apps Script entry point.

```javascript
function doGet(e) {
  return routeApi(e);
}

function doPost(e) {
  return routeApi(e);
}
```

---

### `Config.gs`

Stores shared configuration.

```javascript
const APP_CONFIG = {
  APP_NAME: "Farm Marketplace Platform",
  SPREADSHEET_ID: "PASTE_MASTER_GOOGLE_SHEET_ID_HERE"
};
```

---

### `Router.gs`

Routes requests to the correct module.

Example request:

```javascript
{
  module: "marketplace",
  action: "getListings",
  payload: {}
}
```

Router example:

```javascript
function routeApi(e) {
  try {
    const request = parseRequest(e);
    const moduleName = request.module;
    const action = request.action;
    const payload = request.payload || {};

    if (moduleName === "marketplace") {
      return MarketplaceApi_handle(action, payload);
    }

    if (moduleName === "productCatalog") {
      return ProductCatalogApi_handle(action, payload);
    }

    if (moduleName === "marketPrice") {
      return MarketPriceApi_handle(action, payload);
    }

    if (moduleName === "farmerProfile") {
      return FarmerProfileApi_handle(action, payload);
    }

    if (moduleName === "location") {
      return LocationApi_handle(action, payload);
    }

    if (moduleName === "certification") {
      return CertificationApi_handle(action, payload);
    }

    if (moduleName === "searchFilter") {
      return SearchFilterApi_handle(action, payload);
    }

    if (moduleName === "availableProductDetail") {
      return AvailableProductDetailApi_handle(action, payload);
    }

    if (moduleName === "chatMessaging") {
      return ChatMessagingApi_handle(action, payload);
    }

    if (moduleName === "notification") {
      return NotificationApi_handle(action, payload);
    }

    if (moduleName === "farmAdoptionCrowdfunding") {
      return FarmAdoptionCrowdfundingApi_handle(action, payload);
    }

    if (moduleName === "payment") {
      return PaymentApi_handle(action, payload);
    }

    if (moduleName === "transactionCoordination") {
      return TransactionCoordinationApi_handle(action, payload);
    }

    return errorResponse("Invalid module: " + moduleName);

  } catch (error) {
    return errorResponse(error.message, error.stack);
  }
}

function parseRequest(e) {
  if (e.postData && e.postData.contents) {
    return JSON.parse(e.postData.contents);
  }

  return {
    module: e.parameter.module,
    action: e.parameter.action,
    payload: e.parameter
  };
}
```

---

### `Response.gs`

Standardizes all API responses.

```javascript
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function successResponse(data, message) {
  return jsonResponse({
    success: true,
    message: message || "Success",
    data: data || null
  });
}

function errorResponse(message, details) {
  return jsonResponse({
    success: false,
    message: message || "Something went wrong",
    details: details || null
  });
}
```

---

### `Utils.gs`

Contains shared helper functions.

```javascript
function getSpreadsheet() {
  return SpreadsheetApp.openById(APP_CONFIG.SPREADSHEET_ID);
}

function getSheetByName(sheetName) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error("Sheet not found: " + sheetName);
  }

  return sheet;
}

function sheetToObjects(sheetName) {
  const sheet = getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();

  if (values.length < 2) return [];

  const headers = values.shift();

  return values.map(row => {
    const item = {};

    headers.forEach((header, index) => {
      item[header] = row[index];
    });

    return item;
  });
}

function appendObjectToSheet(sheetName, object) {
  const sheet = getSheetByName(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  const row = headers.map(header => object[header] || "");
  sheet.appendRow(row);

  return object;
}
```

---

## 7. Module Keys for Frontend Requests

Frontend developers should use these exact module names:

| Module | Module Key |
|---|---|
| Marketplace Module | `marketplace` |
| Product Catalog Module | `productCatalog` |
| Market Price Module | `marketPrice` |
| Farmer Profile Module | `farmerProfile` |
| Location Module | `location` |
| Certification / Product Label Module | `certification` |
| Search and Filter Module | `searchFilter` |
| Available Products Detail Module | `availableProductDetail` |
| Chat / Messaging Module | `chatMessaging` |
| Notification Module | `notification` |
| Farm Adoption / Crowdfunding Module | `farmAdoptionCrowdfunding` |
| Payment Module | `payment` |
| Transaction Coordination Module | `transactionCoordination` |

---

## 8. Frontend API Call Format

All frontend modules should call the Apps Script URL using the same format.

Example shared frontend function:

```javascript
const APPS_SCRIPT_URL = "PASTE_APPS_SCRIPT_WEB_APP_URL_HERE";

async function callAppsScript(moduleName, action, payload = {}) {
  const response = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      module: moduleName,
      action: action,
      payload: payload
    })
  });

  return response.json();
}
```

Example usage:

```javascript
const result = await callAppsScript("farmAdoptionCrowdfunding", "getProjects", {});
```

Example with payload:

```javascript
const result = await callAppsScript("farmAdoptionCrowdfunding", "createContribution", {
  projectId: "PROJECT_001",
  amount: 100,
  displayName: "Anonymous",
  message: "Happy to support this farm!"
});
```

---

## 9. Suggested Google Sheet Tabs

The shared Google Sheet should contain tabs like this:

```text
Users
Farmers
Farms
Products
ProductCategories
ProductLabels
MarketPrices
MarketplaceListings
ProductStock
Locations
Certifications
Chats
Messages
Notifications
AdoptionProjects
AdoptionContributions
Payments
Transactions
AdminLogs
Settings
```

---

## 10. Sheet Ownership by Module

| Member | Main Sheet Tabs |
|---|---|
| A | `MarketplaceListings`, `Products`, `ProductCategories`, `ProductStock`, `MarketPrices` |
| B | `Farmers`, `Farms`, `Locations`, `Certifications`, `ProductLabels` |
| C | `MarketplaceListings`, `Products`, `ProductStock`, `ProductLabels`, `Locations` |
| D | `Chats`, `Messages`, `Notifications`, `Users` |
| E | `AdoptionProjects`, `AdoptionContributions`, `Payments`, `Transactions` |

Some tabs are shared between modules. If changing shared sheet columns, inform the whole group first.

---

## 11. Naming Rules

Because Apps Script uses one global scope, function names must be unique.

Use this naming pattern:

```text
ModuleNameApi_handle()
ModuleNameData_actionName()
```

Good examples:

```javascript
function MarketplaceApi_handle(action, payload) {}
function MarketplaceData_getListings() {}

function FarmAdoptionCrowdfundingApi_handle(action, payload) {}
function FarmAdoptionCrowdfundingData_getProjects() {}

function PaymentApi_handle(action, payload) {}
function PaymentData_createPayment() {}
```

Avoid generic function names:

```javascript
function getData() {}
function saveData() {}
function handleRequest() {}
function submitForm() {}
```

Generic names can conflict with other members' code.

---

## 12. Recommended Workflow for Group Members

Each member should follow this workflow:

```text
1. Work only on your assigned module files.
2. Do not edit shared core files unless discussed.
3. Use the correct module key.
4. Use unique function names with your module prefix.
5. Read and write only the sheet tabs related to your module.
6. Tell the group before changing any shared sheet columns.
7. Test your action using a simple frontend call or Postman.
8. Add new actions to your module API file.
9. Keep response format consistent: success, message, data.
```

---

## 13. Example: Adding a New Action

Suppose Member E wants to add:

```text
getProjectById
```

### Step 1: Add action in API file

File:

```text
E_FarmAdoptionCrowdfundingApi.gs
```

```javascript
function FarmAdoptionCrowdfundingApi_handle(action, payload) {
  if (action === "getProjects") {
    return successResponse(FarmAdoptionCrowdfundingData_getProjects());
  }

  if (action === "getProjectById") {
    return successResponse(FarmAdoptionCrowdfundingData_getProjectById(payload.projectId));
  }

  return errorResponse("Invalid farm adoption action: " + action);
}
```

### Step 2: Add data function

File:

```text
E_FarmAdoptionCrowdfundingData.gs
```

```javascript
function FarmAdoptionCrowdfundingData_getProjectById(projectId) {
  const projects = sheetToObjects("AdoptionProjects");

  return projects.find(project => project.ProjectID === projectId) || null;
}
```

### Step 3: Call from frontend

```javascript
const result = await callAppsScript("farmAdoptionCrowdfunding", "getProjectById", {
  projectId: "PROJECT_001"
});
```

---

## 14. Important Notes

### Do not create separate Apps Script URLs for every module

Use one shared backend URL unless the group decides otherwise.

### Do not duplicate sheet access logic

Use helper functions from `Utils.gs` when possible.

### Do not change shared tabs without discussion

Some modules depend on the same tabs.

### Keep frontend and backend separate

Frontend files:

```text
HTML
CSS
JS
```

Backend Apps Script files:

```text
.gs files only
```

---

## 15. Quick Reference

### Backend URL

```text
One Apps Script Web App URL for all modules
```

### Request format

```javascript
{
  module: "moduleKey",
  action: "actionName",
  payload: {}
}
```

### Response format

```javascript
{
  success: true,
  message: "Success",
  data: {}
}
```

or

```javascript
{
  success: false,
  message: "Error message",
  details: null
}
```

### Main rule

```text
Each member owns their own module API and Data files.
Shared core files should only be changed with group agreement.
```

---

## 16. Summary

This backend structure allows all members to work separately while still using one Apps Script backend and one shared Google Sheet.

The most important files are:

```text
Code.gs
Router.gs
Config.gs
Response.gs
Utils.gs
```

The most important rule is:

```text
Use clear module prefixes and do not edit other members' module files.
```
