# Final

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.5.

# Milestones

## 1.Registration 60 points
Started on 2.12.2023

### Profit 60/60
- page with dedicated url: **5 points**
- validation for _name_ and _email_ fields with error messages: **5 points**
- validation for _password_ field with error messages: **5 points**
- redirection to sign-in page after successful registration: **5 points**
- [toast messages](./README.md#toast) with appropriate text are displayed if http-request fails or
  succeed: **10 points**
- _Submit_ button is disabled if form is invalid. Also, it should be disabled after http error with
  type `PrimaryDuplicationException` until the user changes the field value: **10 points**
- _Submit_ button is disabled (user cannot click it) and `email` field has error message of taken
  account if user type the same email address that he tried to send before and got an
  error `PrimaryDuplicationException`: **10 points**
- _Submit_ button is disabled (user cannot click it) after clicking while http-request is in
  progress: **10 points**

### Fines 0/40
- redirection to sign-in page after failed registration: **-20 points**
- user can click _Submit_ button more than once even if previous http-request
  is not completed: **-20 points**

### Total 60/60

## Login 70 points
Started on 7.12.2023

### Profit 70/70
- default page for unauthorized user: **10 points**
- validation for _email_ field with error messages: **5 points**
- validation for _password_ field with error messages: **5 points**
- redirection to the main page after successful authentication: **10 points**
- [toast messages](./README.md#toast) with appropriate text are displayed if http-request fails or
  succeed: **10 points**
- _Submit_ button is disabled (user cannot click it) if form is invalid. Also, it should be disabled
  after http error with type `NotFoundException` until the user changes `email` or `password` field
  value: **10 points**
- _Submit_ button is disabled (user cannot click it) after clicking while http-request is in
  progress: **10 points**
- `token`, `uid` and `email` value is saved in `localStorage` after successful sign in and used
  again in the following http-requests even after page reloading (it allows user to omit
  sign in again after page reloading): **10 points**

### Fines 0/40
- redirection to any page after failed login: **-20 points**
- user can click _Submit_ button more than once even if previous http-request
  is not completed: **-20 points**

### Total 70/70

## Profile 40 points
Started on 7.12.2023

### Profit 40/40

- button _Edit_ makes `name` field editable: **10 points**
- button _Cancel_ returns initial page state (static appearance): **5 points**
- clicking the button _Save_ sends 1 http-request to save new data without the ability to click it
  again (along with _Cancel_ button) until process is end: **20 points**
- buttons _Cancel_ and _Save_ are visible ony for editable form: **5 points**
- button _Edit_ is visible only for static page: **5 points**
- [toast messages](./README.md#toast) with appropriate text are displayed if http-request fails or
  succeed: **10 points**

### Fines 0/40

- http-request `/profile` to retrieve profile data is sent: **-20 points**
- edited data is applied to the static Profile page even if http-request fails: **-20 points**

### Total 40/40


## Update profile 55 points
Started on 8.12.2023

### Profit 55/55
- button _Edit_ makes `name` field editable: **10 points**
- button _Cancel_ returns initial page state (static appearance): **5 points**
- clicking the button _Save_ sends 1 http-request to save new data without the ability to click it
  again (along with _Cancel_ button) until process is end: **20 points**
- buttons _Cancel_ and _Save_ are visible ony for editable form: **5 points**
- button _Edit_ is visible only for static page: **5 points**
- [toast messages](./README.md#toast) with appropriate text are displayed if http-request fails or
  succeed: **10 points**

### Fines 0/40
- http-request `/profile` to retrieve profile data is sent: **-20 points**
- edited data is applied to the static Profile page even if http-request fails: **-20 points**
### Total 55/55


## Logout 40 points
Started on 9.12.2023

### Profit 40/40

- clicking on `Logout` button the http-request is sent
  with `DELETE` method: **10 points**
- user is redirected to Sign-In page after successful logout process: **10 points**
- all data in `cookies`, `localStorage` is deleted: **10 points**
- [toast messages](./README.md#toast) with appropriate text are displayed if http-request fails or
  succeed: **10 points**
### Total 40/40

## People and group sections 175 points
Started on 9.12.2023

### Profit
- default page for authorized user: **10 points**
- page is divided on 2 vertical sections with independent content: **5 points**
#### Group section (left)
- the list of available groups is loaded if user opens this page first time: **5 points**
- the list item created by current user should contain _Delete_ button: **10 points**
- the confirmation modal appears after clicking on _Delete_ button on list item with _Cancel_,
  _Delete_ button inside. If user clicks _Cancel_ the modal disappears. If user clicks _Delete_ the
  http-request is sent and item is removed from the list after succeeded response: **15 points**
- clicking on _Update_ button sends corresponding http-request and update group
  list if succeeded: **10 points**
- countdown appears for 1 minute after clicking on _Update_ button
  (except if error occurs): **10 points** (no consider error)
- _Update_ button is disabled (user cannot click it) after clicking during updating and until the
  timer is active: **5 points**
- clicking on _Create_ button the modal window is opened. There is form with validation and
  submit button: **10 points**
- submit button in modal window should be disabled (user cannot click it) until form
  is valid: **5 points**
- clicking on submit button in modal window the appropriate http-request is sent to create new
  group. Modal window is closed only if http-request succeeded: **15 points**
- [toast messages](./README.md#toast) with appropriate text are displayed if http-request fails or
  succeed: **10 points**
- clicking on list item the user is redirected to group dialog page: **5 points**

#### People list (right)
- the list of people is loaded if user opens this page first time: **10 points**
- the list item with which current user already has active conversation has
  special background: **10 points**
- clicking on _Update_ button sends corresponding http-request and update people list
  if succeeded: **10 points**
- countdown appears for 1 minute after clicking on _Update_ button
  (except if error occurs): **10 points**
- _Update_ button is disabled (user cannot click it) after clicking during updating and until the
  timer is active: **5 points**
- clicking on list item the user is redirected to personal conversation page. New conversation (via
  certain http-request) is created if it has not already created before transition: **15 points**

### Fines
#### Group section
- list of groups via `/groups/list` is automatically (_Update_ button is not pressed) loaded more
  than once **until** user logs out or refreshes the browser's page. For instance, when user
  navigates through the pages, sends new messages, deletes or creates group(s): **-30 points**

#### People list
- list of conversations via `/conversations/list` is automatically (_Update_ button is not pressed)
  loaded more than once **until** user logs out or refreshes the browser's page. For instance, when
  user navigates through the pages, sends new messages, deletes or creates
  conversation(s): **-20 points**
- list of users via `/users` is automatically (_Update_ button is not pressed) loaded more than once
  **until** user logs out or refreshes the browser's page. For instance, when user navigates through
  the pages, sends new messages, deletes or creates conversation(s): **-20 points**
### Total 175/175


## Group dialog 140 points
Started on 11.12.2023

### Profit
- the page is protected by a guard only for authorized user: **5 points**
- the error message is displayed if group with provided id does not exist: **10 points**
- _Return back_ is a link, not a button: **5 points**
- the full message history is loaded if user visit this page first time: **10 points**
- only the last messages (using `since` parameter) are loaded if user opens this group conversation
  again: **20 points**
- only the last messages (using `since` parameter) are loaded if user clicks on
  _Update_ button: **20 points**
- messages in corresponding area are sorted by time. New messages are appended at
  the bottom: **5 points**
- message item contains readable time, user name and text. Own messages are displayed on the right.
  Other messages are displayed on the left: **10 points**
- countdown appears for 1 minute after clicking on _Update_ button
  (except if error occurs): **10 points**
- _Update_ button is disabled (user cannot click it) after clicking during updating and until the
  timer is active: **5 points**
- group is created by current user should contain _Delete_ button: **10 points**
- the confirmation modal appears after clicking on _Delete_ button with _Cancel_,
  _Delete_ button inside. If user clicks _Cancel_ the modal disappears. If user clicks _Delete_ the
  http-request is sent and the user is redirected to main page after succeeded
  response: **10 points**
- form field has `required` validator. _Send new message_ button is disabled (user cannot click it)
  until field has text: **5 points**
- new messages are loaded (using `since` parameter) after successful sending
  new message: **15 points**

### Fines
- _Delete_ button is not present on the page for own group after hard page
  reloading(refreshing): **-20 points**
- while user is on this dialog page, he reloads the page and navigates to the main page.
  Http-request to `/groups/list` is sent more than once (if user do not click _Update_
  button): **-25 points**
- user can enter the page of existing dialog and see the messages even if he is
  not authorized: **-15 points**
### Total 175/175

## People conversation 140 points
Started on 13.12.2023
## 404 page 30 points
Started on 16.12.2023
## Bonus: Style theme 50 points
Started on 16.12.2023
## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

